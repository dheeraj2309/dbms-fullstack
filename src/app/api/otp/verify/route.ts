import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { auth } from '@/lib/auth';
import { OtpSchema } from '@/lib/validations';

export async function POST(req: Request) {
  try {
    // user must be logged in
    const session = await auth();
    if (!session?.user?.email) {
      return errorResponse('Unauthorized', 401);
    }
    const email = session.user.email;
    // extract the otp
    const body = await req.json();
    const parsed = OtpSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('Invalid OTP', 400);
    }
    const { otp } = parsed.data;
    // find the user whose OTP has to be verified
    const user = await prisma.user.findUnique({
      where: { email },
      select: { otp: true, otpExpiry: true, isEmailVerified: true },
    });
    if (!user) {
      return errorResponse('User not found', 404);
    }
    // Step 4 — Already verified? Nothing to do
    if (user.isEmailVerified) {
      return successResponse({ message: 'Already verified' });
    }
    // Step 5 — No OTP exists (never requested one)
    if (!user.otp || !user.otpExpiry) {
      return errorResponse('No OTP found, request a new one', 400);
    }
    // Step 6 — Check expiry BEFORE checking value
    // (don't leak whether the code was right or wrong if expired)
    if (new Date() > user.otpExpiry) {
      return errorResponse('OTP has expired, request a new one', 400);
    }
    // Step 7 — Check if OTP matches
    if (user.otp !== otp) {
      return errorResponse('Incorrect OTP', 400);
    }
    // Step 8 — Valid! Clear OTP fields + mark verified
    // Clearing otp ensures it can't be reused even within the expiry window
    await prisma.user.update({
      where: { email },
      data: {
        otp: null,
        otpExpiry: null,
        isEmailVerified: true, // marking true
      },
    });
    return successResponse({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('[OTP_VERIFY]', error);
    return errorResponse('Internal server error', 500);
  }
}
// User types 6-digit code on /verify-otp page
//           ↓
// POST /api/otp/verify  with body { otp: "482910" }
//           ↓
// Session read → get email from JWT
//           ↓
// Fetch stored otp + otpExpiry from DB
//           ↓
//           ├── No OTP in DB?     → 400 "request a new one"
//           ├── Expired?          → 400 "OTP expired"
//           └── Wrong code?       → 400 "Incorrect OTP"
//           ↓
// All checks pass:
//   otp      → null   (can't reuse it)
//   otpExpiry → null
//   isEmailVerified → true
//           ↓
// 200 OK → middleware now lets user through to /dashboard
