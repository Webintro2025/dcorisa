import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import { randomUUID } from 'crypto';
import dbConnect from '../../utils/dbConnect';
import Product from '../../models/Product';
import Category from '../../models/Category';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'products');

async function ensureUploadDir() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

async function saveFile(file) {
  if (!file || typeof file.arrayBuffer !== 'function' || file.size === 0) {
    return null;
  }

  await ensureUploadDir();
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const originalName = file.name || 'image';
  const extension = originalName.includes('.') ? originalName.split('.').pop() : 'jpg';
  const safeExt = extension.replace(/[^a-zA-Z0-9]/g, '') || 'jpg';
  const filename = `product-${Date.now()}-${randomUUID()}.${safeExt}`;
  const filePath = path.join(UPLOAD_DIR, filename);
  await fs.writeFile(filePath, buffer);
  const relativePath = path.join('uploads', 'products', filename).replace(/\\/g, '/');
  return `/${relativePath}`;
}

function payloadError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

async function parseJsonPayload(request) {
  try {
    const bodyText = await request.text();

    if (!bodyText) {
      return {};
    }

    const body = JSON.parse(bodyText);
    const incomingImages = Array.isArray(body?.images)
      ? body.images
      : typeof body?.images === 'string'
        ? [body.images]
        : [];

    return {
      name: body?.name,
      description: body?.description,
      category: body?.category,
      price: body?.price,
      quantity: body?.quantity,
      dimension: body?.dimension,
      materialCare: body?.materialCare ?? body?.material ?? body?.care,
      images: incomingImages.filter(Boolean).map((url) => url.trim()),
    };
  } catch (err) {
    console.error('Failed to parse JSON payload', err);
    throw payloadError('Invalid JSON payload.', 400);
  }
}

async function parseBody(req) {
  const contentType = req.headers.get('content-type') || '';
  const fallbackRequest = req.clone();

  if (contentType.includes('multipart/form-data')) {
    try {
      const formData = await req.formData();
      const imageEntries = formData.getAll('images');
      const savedImages = [];

      for (const entry of imageEntries) {
        if (entry && typeof entry === 'object' && typeof entry.arrayBuffer === 'function') {
          const stored = await saveFile(entry);
          if (stored) {
            savedImages.push(stored);
          }
        }
      }

      return {
        name: formData.get('name'),
        description: formData.get('description'),
        category: formData.get('category'),
        price: formData.get('price'),
        quantity: formData.get('quantity'),
        dimension: formData.get('dimension'),
        materialCare:
          formData.get('materialCare') ??
          formData.get('material') ??
          formData.get('care'),
        images: savedImages,
      };
    } catch (err) {
      console.error('Failed to parse multipart payload', err);
      return await parseJsonPayload(fallbackRequest);
    }
  }

  return await parseJsonPayload(req);
}

function toNumber(value) {
  if (value === null || value === undefined) return undefined;
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : NaN;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    const num = Number(trimmed);
    return Number.isNaN(num) ? NaN : num;
  }
  return NaN;
}

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('id');

  if (productId) {
    try {
      const product = await Product.findById(productId).populate('category', 'name');
      if (!product) {
        return NextResponse.json({ message: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json({ product });
    } catch (err) {
      console.error('Failed to fetch product by id', err);
      return NextResponse.json({ message: 'Invalid product id' }, { status: 400 });
    }
  }

  const products = await Product.find().sort({ createdAt: -1 }).populate('category', 'name');
  return NextResponse.json({ products });
}

export async function POST(req) {
  let payload;

  try {
    payload = await parseBody(req);
  } catch (err) {
    const status = err.status || 500;
    const message = err.message || 'Unable to process request body.';
    return NextResponse.json({ message }, { status });
  }

  const {
    name,
    description,
    category,
    price,
    quantity,
    dimension,
    materialCare,
    images,
  } = payload;

  if (!name || !name.trim()) {
    return NextResponse.json({ message: 'Product name is required' }, { status: 400 });
  }

  if (!category || !`${category}`.trim()) {
    return NextResponse.json({ message: 'Category is required' }, { status: 400 });
  }

  const priceNum = toNumber(price);
  if (priceNum === undefined || Number.isNaN(priceNum)) {
    return NextResponse.json({ message: 'Price must be a valid number' }, { status: 400 });
  }

  const quantityNum = toNumber(quantity);
  if (Number.isNaN(quantityNum)) {
    return NextResponse.json({ message: 'Quantity must be a valid number' }, { status: 400 });
  }

  await dbConnect();

  const categoryDoc = await Category.findById(`${category}`.trim());
  if (!categoryDoc) {
    return NextResponse.json({ message: 'Invalid category specified' }, { status: 400 });
  }

  const normalizedName = name.trim();

  const product = await Product.create({
    name: normalizedName,
    description: description?.trim(),
    category: categoryDoc._id,
    price: priceNum,
    quantity: quantityNum ?? 0,
    dimension: dimension?.trim(),
    materialCare: materialCare?.trim(),
    images: Array.isArray(images) ? images : [],
  });

  await product.populate('category', 'name');

  return NextResponse.json({ message: 'Product created', product }, { status: 201 });
}
