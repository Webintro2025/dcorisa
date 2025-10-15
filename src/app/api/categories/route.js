import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import { randomUUID } from 'crypto';
import dbConnect from '../../utils/dbConnect';
import Category from '../../models/Category';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

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
  const filename = `category-${Date.now()}-${randomUUID()}.${safeExt}`;
  const filePath = path.join(UPLOAD_DIR, filename);
  await fs.writeFile(filePath, buffer);
  return `/uploads/${filename}`;
}

function payloadError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

async function parseBody(req) {
  const contentType = req.headers.get('content-type') || '';
  const fallbackRequest = req.clone();

  if (contentType.includes('multipart/form-data')) {
    try {
      const formData = await req.formData();
      const name = formData.get('name');
      const description = formData.get('description');
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
        name,
        description,
        images: savedImages,
      };
    } catch (err) {
      console.error('Failed to parse multipart payload', err);
      // Fall back to parsing as JSON so clients can still submit URL lists
      return await parseJsonPayload(fallbackRequest);
    }
  }

  return await parseJsonPayload(req);
}

async function parseJsonPayload(request) {
  try {
    const bodyText = await request.text();

    if (!bodyText) {
      return { name: undefined, description: undefined, images: [] };
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
      images: incomingImages.filter(Boolean).map((url) => url.trim()),
    };
  } catch (err) {
    console.error('Failed to parse JSON payload', err);
    throw payloadError('Invalid JSON payload.', 400);
  }
}

export async function GET() {
  await dbConnect();
  const categories = await Category.find().sort({ createdAt: -1 });
  return NextResponse.json({ categories });
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

  const { name, description, images } = payload;

  if (!name || !name.trim()) {
    return NextResponse.json({ message: 'Category name is required' }, { status: 400 });
  }

  await dbConnect();

  const normalizedName = name.trim();
  const existing = await Category.findOne({ name: normalizedName });

  if (existing) {
    return NextResponse.json({ message: 'Category already exists' }, { status: 409 });
  }

  const category = await Category.create({
    name: normalizedName,
    description: description?.trim(),
    images,
  });

  return NextResponse.json({ message: 'Category created', category }, { status: 201 });
}
