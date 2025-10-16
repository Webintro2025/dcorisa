import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';
import sendEmail from '../../../utils/sendEmail';

const jsonResponse = (payload, init = {}) => new Response(JSON.stringify(payload), {
  ...init,
  headers: {
    'Content-Type': 'application/json',
    ...init.headers,
  },
});

let ensuredMobileIndex = false;

const ensureMobileIndex = async () => {
  if (ensuredMobileIndex) {
    return;
  }

  const collection = User.collection;

  try {
    await collection.dropIndex('mobile_1');
    console.info('Dropped legacy unique mobile index without sparse option');
  } catch (error) {
    if (error.codeName && error.codeName !== 'IndexNotFound') {
      console.warn('Unable to drop legacy mobile index', error);
    }
  }

  try {
    await collection.createIndex({ mobile: 1 }, { unique: true, sparse: true, name: 'mobile_1' });
    ensuredMobileIndex = true;
  } catch (error) {
    console.error('Failed to ensure sparse mobile index', error);
  }
};

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch (error) {
    return jsonResponse({ message: 'Invalid request payload' }, { status: 400 });
  }

  const { email, mobile } = body ?? {};

  if (!email) {
    return jsonResponse({ message: 'Email is required' }, { status: 400 });
  }

  await dbConnect();
  await ensureMobileIndex();

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedMobile = mobile?.trim();

  let user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    const userData = { email: normalizedEmail };
    if (normalizedMobile) {
      userData.mobile = normalizedMobile;
    }
    user = new User(userData);
  } else if (normalizedMobile && user.mobile !== normalizedMobile) {
    user.mobile = normalizedMobile;
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpires = Date.now() + 5 * 60 * 1000;
  try {
    await user.save();
  } catch (error) {
    if (error?.code === 11000 && error?.keyPattern?.mobile) {
      console.error('Duplicate mobile detected while issuing OTP', error);
      return jsonResponse({ message: 'This mobile number is already linked to another account.' }, { status: 409 });
    }
    console.error('Failed to persist OTP details', error);
    return jsonResponse({ message: 'Unable to issue OTP right now' }, { status: 500 });
  }

  try {
    await sendEmail({
      to: normalizedEmail,
      subject: 'Your Decoreraisa OTP Code',
      text: `Your one-time password is ${otp}. It expires in 5 minutes.`,
      html: `<p>Your one-time password is <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
    });
  } catch (error) {
    console.error('Email send failed', error);
    const errorMessage = error?.message || 'Failed to send OTP email';
    if (process.env.NODE_ENV !== 'production') {
      console.warn('OTP dispatch failed in development. OTP value:', otp);
    }
    return jsonResponse({ message: errorMessage }, { status: 500 });
  }

  return jsonResponse({ message: 'OTP sent to email' }, { status: 200 });
}
