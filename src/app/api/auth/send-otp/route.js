import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';
import sendEmail from '../../../utils/sendEmail';

export async function POST(req) {
  const { email, mobile } = await req.json();

  if (!email) {
    return new Response(JSON.stringify({ message: 'Email is required' }), { status: 400 });
  }

  await dbConnect();

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedMobile = mobile?.trim();

  let user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    user = new User({ email: normalizedEmail, mobile: normalizedMobile });
  } else if (normalizedMobile && user.mobile !== normalizedMobile) {
    user.mobile = normalizedMobile;
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpires = Date.now() + 5 * 60 * 1000;
  await user.save();

  try {
    await sendEmail({
  to: normalizedEmail,
      subject: 'Your Decoreraisa OTP Code',
      text: `Your one-time password is ${otp}. It expires in 5 minutes.`,
      html: `<p>Your one-time password is <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
    });
  } catch (err) {
    console.error('Email send failed', err);
    return new Response(JSON.stringify({ message: 'Failed to send OTP email' }), { status: 500 });
  }

  return new Response(JSON.stringify({ message: 'OTP sent to email' }), { status: 200 });
}
