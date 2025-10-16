import nodemailer from 'nodemailer';

let cachedTransporter = global.__decoreraisaMailer;

async function createTransporter() {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email environment variables are not configured');
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.verify();
  } catch (error) {
    console.warn('SMTP transporter verification failed. Attempting to continue.', error);
  }
  return transporter;
}

async function getTransporter() {
  if (cachedTransporter) {
    return cachedTransporter;
  }
  cachedTransporter = await createTransporter();
  global.__decoreraisaMailer = cachedTransporter;
  return cachedTransporter;
}

export default async function sendEmail({ to, subject, text, html }) {
  const transporter = await getTransporter();
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;
  await transporter.sendMail({ from, to, subject, text, html });
}
