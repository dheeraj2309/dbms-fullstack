// GET /api/student
//   Session → get userId
//   prisma.formDetails.findUnique({ userId })
//       ├── found?   → return formData   (edit mode on frontend)
//       └── null?    → return { formData: null }  (submit mode on frontend)

// POST /api/student
//   Session → logged in? verified?
//   Zod validates body
//   Already submitted? → 409
//   prisma.formDetails.create()
//   Send confirmation email (non-blocking)
//   → 201 Created

import { successResponse, errorResponse } from '@/lib/api-response';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { StudentFormSchema } from '@/lib/validations';
import { sendConfirmationEmail } from '@/lib/mail';

export async function GET() {
  try {
    // must be logged in
    const session = await auth();
    if (!session?.user?.email) {
      return errorResponse('Unauthorized', 401);
    }
    const email = session.user.email;
    // find the formData
    const formData = await prisma.formDetails.findUnique({
      where: { userId: session.user.id },
    });
    return successResponse({ formData }); // the frontend uses null value to decide to open in submit vs edit
  } catch (error) {
    console.error('[STUDENT_FORM_GET]', error);
    return errorResponse('Internal server error', 500);
  }
}
// post request -> submitting here for the first time
// to update values we use PATCH
export async function POST(req: Request) {
  try {
    // must be logged in
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse('Unauthorized', 401);
    }
    // Step 2 — Must have verified email first
    if (!session.user.isEmailVerified) {
      return errorResponse('Email not verified', 403);
    }
    const body = await req.json();
    const parsed = StudentFormSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400);
    }
    // Step 4 — Check if form already submitted
    // POST is only for first time submission
    // Edits go through PATCH in /api/student/[id]
    const existing = await prisma.formDetails.findUnique({
      where: { userId: session.user.id },
    });
    if (existing) {
      return errorResponse('Form already submitted, use edit instead', 409);
    }
    // Step 5 — Create the form entry
    const formData = await prisma.formDetails.create({
      data: {
        userId: session.user.id,
        ...parsed.data,
      },
    });
    // Step 6 — Send confirmation email
    // Non-blocking — if email fails, form is still saved
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true },
    });
    if (user) {
      const { error } = await sendConfirmationEmail(
        user.email,
        parsed.data.firstName,
        parsed.data.course,
        parsed.data.branch,
        parsed.data.year,
        parsed.data.cgpa
      );
      if (error) {
        // Log but don't fail the request
        // Form is saved, email is secondary
        console.error('[CONFIRMATION_EMAIL]', error);
      }
    }
    return successResponse({ formData }, 201);
  } catch (error) {
    console.error('[STUDENT_POST]', error);
    return errorResponse('Internal server error', 500);
  }
}

