import { NextResponse } from 'next/server';
import dbConnect from '../../utils/dbConnect';
import Cart from '../../models/Cart';
import Product from '../../models/Product';

function serializeCart(cartDoc) {
  if (!cartDoc) {
    return { userId: '', items: [], total: 0 };
  }

  const items = (cartDoc.items || []).map((item) => {
    const productDoc = item.product && typeof item.product === 'object' ? item.product : null;
    const productId = productDoc?._id ? String(productDoc._id) : String(item.product);
    const unitPrice = typeof item.price === 'number' ? item.price : Number(item.price) || Number(productDoc?.price) || 0;

    return {
      productId,
      name: item.name || productDoc?.name || 'Product',
      price: unitPrice,
      quantity: item.quantity,
      image: Array.isArray(productDoc?.images) && productDoc.images.length > 0 ? productDoc.images[0] : null,
    };
  });

  const total = items.reduce((sum, entry) => sum + entry.price * entry.quantity, 0);

  return {
    userId: cartDoc.userId,
    items,
    total,
  };
}

function toNumber(value) {
  if (value === null || value === undefined) return undefined;
  if (typeof value === 'number') return Number.isFinite(value) ? value : NaN;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    const num = Number(trimmed);
    return Number.isNaN(num) ? NaN : num;
  }
  return NaN;
}

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }
  return cart;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId || !userId.trim()) {
    return NextResponse.json({ message: 'userId query parameter is required' }, { status: 400 });
  }

  await dbConnect();

  const cart = await Cart.findOne({ userId: userId.trim() }).populate('items.product', 'name price images');
  if (!cart) {
    return NextResponse.json({ cart: { userId: userId.trim(), items: [], total: 0 } });
  }

  return NextResponse.json({ cart: serializeCart(cart) });
}

export async function POST(request) {
  const body = await request.json();
  const userId = body?.userId?.trim();
  const productId = body?.productId?.trim();
  const quantityNum = toNumber(body?.quantity) ?? 1;

  if (!userId) {
    return NextResponse.json({ message: 'userId is required' }, { status: 400 });
  }
  if (!productId) {
    return NextResponse.json({ message: 'productId is required' }, { status: 400 });
  }
  if (Number.isNaN(quantityNum) || quantityNum < 1) {
    return NextResponse.json({ message: 'quantity must be a positive number' }, { status: 400 });
  }

  await dbConnect();

  const product = await Product.findById(productId);
  if (!product) {
    return NextResponse.json({ message: 'Invalid product specified' }, { status: 400 });
  }

  const cart = await getOrCreateCart(userId);
  const existingItem = cart.items.find((item) => String(item.product) === String(product._id));

  if (existingItem) {
    existingItem.quantity += quantityNum;
  } else {
    cart.items.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: quantityNum,
    });
  }

  await cart.save();
  await cart.populate('items.product', 'name price images');

  return NextResponse.json({ message: 'Product added to cart', cart: serializeCart(cart) }, { status: 201 });
}

export async function PATCH(request) {
  const body = await request.json();
  const userId = body?.userId?.trim();
  const productId = body?.productId?.trim();
  const action = body?.action;
  const quantityValue = body?.quantity;

  if (!userId) {
    return NextResponse.json({ message: 'userId is required' }, { status: 400 });
  }
  if (!productId) {
    return NextResponse.json({ message: 'productId is required' }, { status: 400 });
  }

  await dbConnect();

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    return NextResponse.json({ message: 'Cart not found' }, { status: 404 });
  }

  const item = cart.items.find((entry) => String(entry.product) === String(productId));
  if (!item) {
    return NextResponse.json({ message: 'Product not found in cart' }, { status: 404 });
  }

  let newQuantity;

  if (action === 'increase') {
    newQuantity = item.quantity + 1;
  } else if (action === 'decrease') {
    newQuantity = item.quantity - 1;
  } else if (quantityValue !== undefined) {
    const qty = toNumber(quantityValue);
    if (Number.isNaN(qty) || qty < 0) {
      return NextResponse.json({ message: 'quantity must be zero or a positive number' }, { status: 400 });
    }
    newQuantity = qty;
  } else {
    return NextResponse.json({ message: 'action or quantity is required' }, { status: 400 });
  }

  if (newQuantity <= 0) {
  cart.items = cart.items.filter((entry) => String(entry.product) !== String(productId));
  } else {
    item.quantity = newQuantity;
  }

  await cart.save();
  await cart.populate('items.product', 'name price images');

  return NextResponse.json({ message: 'Cart updated', cart: serializeCart(cart) });
}
