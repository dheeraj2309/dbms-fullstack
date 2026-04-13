// User logs in → immediately hits /verify-otp page
//           ↓
// Page calls POST /api/otp/send automatically on mount
//           ↓
// Route reads session → gets email from JWT (no body needed)
//           ↓
// Checks user exists + not already verified
//           ↓
// crypto.getRandomValues() generates "482910"
//           ↓
// Saves otp + otpExpiry to User row in DB
//           ↓
// Resend fires the email
//           ↓
// 200 OK → frontend shows "check your inbox"


import { prisma } from '@/lib/prisma';
import { sendOtpEmail } from '@/lib/mail';
import { successResponse, errorResponse } from '@/lib/api-response';
import { auth } from '@/lib/auth';
import { hash } from 'bcryptjs';

export async function POST(req: Request) {
  try {
    // user must be logged in to request to otp
    const session = await auth();
    if (!session?.user?.email) {
      return errorResponse('Unauthorized', 401);
    }
    const email = session.user.email;
    // find the user
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return errorResponse('User not found', 404);
    }
    // check if the user is already verified
    if (user.isEmailVerified) {
      return errorResponse('Email Already verified', 400);
    }
    // generate otp cryptographically
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    // Clamp to 6 digits: between 100000 and 999999
    const otp = ((array[0] % 900000) + 100000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    await prisma.user.update({
      where: { email },
      data: { otp, otpExpiry },
    });
    // send the email
    const { error } = await sendOtpEmail(email, otp, 'There');
    if (error) {
      return errorResponse('Failed to send OTP', 502);
    }
    return successResponse({ message: 'OTP SENT SUCCESSFULLY' });
  } catch (error) {
    console.error('[OTP_SEND]', error);
    return errorResponse('Internal server error', 500);
  }
}
