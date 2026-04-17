import ConfirmationEmail from '@/emails/ConfirmationEmail';
import OtpEmail from '@/emails/Otp';
import { render } from '@react-email/render';
// import { Resend } from 'resend';
import nodemailer from 'nodemailer';
// const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = `"Student Portal" <${process.env.GMAIL_USER}>`;
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail address
    pass: process.env.GMAIL_APP_PASS, // Your 16-char App Password
  },
});

export async function sendOtpEmail(email: string, otp: string, name: string) {
  try {
    const emailHtml = await render(OtpEmail({ otp, name }));
    const options = {
      from: FROM,
      to: email, // Changed this back to 'email' so it goes to the user!
      subject: 'Your OTP for Student Registration',
      html: emailHtml,
    };
    const info = await transporter.sendMail(options);
    return { data: info, error: null };
  } catch (error) {
    console.error('Nodemailer OTP Error:', error);
    return { data: null, error };
  }
}

export async function sendConfirmationEmail(
  email: string,
  name: string,
  course: string,
  branch?: string,
  year?: string,
  cgpa?: number
) {
  try {
    const emailHtml = await render(
      ConfirmationEmail({
        name,
        course,
        branch,
        year,
        cgpa,
        submittedAt: new Date().toLocaleString('en-IN', {
          dateStyle: 'long',
          timeStyle: 'short',
        }),
      })
    );
    const options = {
      from: FROM,
      to: email,
      subject: 'Registration Confirmed — Student Registration System',
      html: emailHtml,
    };

    const info = await transporter.sendMail(options);
    return { data: info, error: null };
  } catch (error) {
    console.error('Nodemailer Confirmation Error:', error);
    return { data: null, error };
  }
}
