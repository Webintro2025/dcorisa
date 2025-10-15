import { NextResponse } from 'next/server';
import dbConnect from '../../utils/dbConnect';
import CustomerInfo from '../../models/CustomerInfo';

function requiredField(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!requiredField(userId)) {
    return NextResponse.json({ message: 'userId query parameter is required' }, { status: 400 });
  }

  await dbConnect();

  const entries = await CustomerInfo.find({ userId: userId.trim() }).sort({ isDefault: -1, updatedAt: -1 });

  return NextResponse.json({ userId: userId.trim(), addresses: entries });
}

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch (err) {
    return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
  }

  const {
    userId,
    name,
    email,
    phone,
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    country,
    isDefault,
  } = body || {};

  if (!requiredField(userId)) {
    return NextResponse.json({ message: 'userId is required' }, { status: 400 });
  }
  if (!requiredField(name)) {
    return NextResponse.json({ message: 'name is required' }, { status: 400 });
  }
  if (!requiredField(phone)) {
    return NextResponse.json({ message: 'phone is required' }, { status: 400 });
  }
  if (!requiredField(addressLine1)) {
    return NextResponse.json({ message: 'addressLine1 is required' }, { status: 400 });
  }
  if (!requiredField(city)) {
    return NextResponse.json({ message: 'city is required' }, { status: 400 });
  }
  if (!requiredField(state)) {
    return NextResponse.json({ message: 'state is required' }, { status: 400 });
  }
  if (!requiredField(postalCode)) {
    return NextResponse.json({ message: 'postalCode is required' }, { status: 400 });
  }
  if (!requiredField(country)) {
    return NextResponse.json({ message: 'country is required' }, { status: 400 });
  }

  await dbConnect();

  if (isDefault === true) {
    await CustomerInfo.updateMany({ userId: userId.trim() }, { $set: { isDefault: false } });
  }

  const record = await CustomerInfo.create({
    userId: userId.trim(),
    name: name.trim(),
    email: email?.trim().toLowerCase(),
    phone: phone.trim(),
    addressLine1: addressLine1.trim(),
    addressLine2: addressLine2?.trim(),
    city: city.trim(),
    state: state.trim(),
    postalCode: postalCode.trim(),
    country: country.trim(),
    isDefault: Boolean(isDefault),
  });

  return NextResponse.json({ message: 'Customer info saved', address: record }, { status: 201 });
}
