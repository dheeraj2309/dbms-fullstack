import ConfirmationEmail from '@/emails/ConfirmationEmail';
import OtpEmail from '@/emails/Otp';
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = 'onboarding@resend.dev';

export async function sendOtpEmail(email: string, otp: string, name: string) {
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: 'dheerajw2309@gmail.com',
    subject: 'Your OTP for Student Registration',
    react: OtpEmail({ otp, name }),
  });
  if (error) {
    console.error('Resend Error:', error);
    return { data: null, error };
  }
  return { data, error: null };
}

export async function sendConfirmationEmail(
  email: string,
  name: string,
  course: string,
  branch?: string,
  year?: string,
  cgpa?: number
) {
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Registration Confirmed — Student Registration System',
    react: ConfirmationEmail({
      name,
      course,
      branch,
      year,
      cgpa,
      submittedAt: new Date().toLocaleString('en-IN', {
        dateStyle: 'long',
        timeStyle: 'short',
      }),
    }),
  });
  if (error) {
    console.error('Resend Error:', error);
    return { data: null, error };
  }
  return { data, error: null };
}
