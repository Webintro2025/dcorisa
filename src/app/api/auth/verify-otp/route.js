import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  const { email, otp } = await req.json();

  if (!email || !otp) {
    return new Response(JSON.stringify({ message: 'Email and OTP are required' }), { status: 400 });
  }

  await dbConnect();

  const normalizedEmail = email.trim().toLowerCase();
  const submittedOtp = otp.trim();

  const user = await User.findOne({ email: normalizedEmail });

  if (
    !user ||
    user.otp !== submittedOtp ||
    !user.otpExpires ||
    user.otpExpires.getTime() < Date.now()
  ) {
    return new Response(JSON.stringify({ message: 'Invalid or expired OTP' }), { status: 400 });
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

  return new Response(JSON.stringify({ message: 'OTP verified', token }), { status: 200 });
}
