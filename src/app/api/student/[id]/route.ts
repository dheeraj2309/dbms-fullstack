// GET /api/student/[id]        → admin fetches one student's full details
// PATCH /api/student/[id]      → student edits own data OR admin edits any student
// DELETE /api/student/[id]     → admin deletes a student's form data

// Authorization logic on PATCH:
//   isAdmin?  → can edit anyone
//   isOwnData? → student can only edit themselves
//   neither?  → 403 Forbidden
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { auth } from '@/lib/auth';
import { StudentFormSchema } from '@/lib/validations';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse('Unauthorized', 401);
    }
    // Only admin can fetch specific student by id
    if (session.user.role !== 'ADMIN') {
      return errorResponse('Forbidden', 403);
    }
    const formData = await prisma.formDetails.findUnique({
      where: { userId: params.id },
      include: { user: { select: { email: true, createdAt: true } } }, //nice
    });
    if (!formData) {
      return errorResponse('Student not found', 404);
    }
    return successResponse({ formData });
  } catch (error) {
    console.error('[STUDENT_GET_ID]', error);
    return errorResponse('Internal server error', 500);
  }
}
// PATCH → edit form data
// Both student (own data) and admin (any student) can call this
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse('Unauthorized', 401);
    }
    // Students can only edit their own data
    // Admins can edit anyone
    const isAdmin = session.user.role === 'ADMIN';
    const isOwnData = session.user.id === params.id;
    if (!isAdmin && !isOwnData) {
      return errorResponse('Forbidden', 403);
    }
    // Validate body
    const body = await req.json();
    const parsed = StudentFormSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400);
    }
    // Check the form exists before updating
    const existing = await prisma.formDetails.findUnique({
      where: { userId: params.id },
    });
    if (!existing) {
      return errorResponse('Form not found', 404);
    }
    // Update
    const updated = await prisma.formDetails.update({
      where: { userId: params.id },
      data: parsed.data,
    });
    return successResponse({ formData: updated });
  } catch (error) {
    console.error('[STUDENT_PATCH]', error);
    return errorResponse('Internal server error', 500);
  }
}
// DELETE → admin only
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse('Unauthorized', 401);
    }
    if (session.user.role !== 'ADMIN') {
      return errorResponse('Forbidden', 403);
    }
    // Check exists first
    const existing = await prisma.formDetails.findUnique({
      where: { userId: params.id },
    });
    if (!existing) {
      return errorResponse('Student not found', 404);
    }
    // onDelete: Cascade in schema means deleting User
    // also deletes FormDetails automatically
    // But here admin is only deleting form data, not the account
    await prisma.formDetails.delete({
      where: { userId: params.id },
    });
    return successResponse({ message: 'Student data deleted successfully' });
  } catch (error) {
    console.error('[STUDENT_DELETE]', error);
    return errorResponse('Internal server error', 500);
  }
}
