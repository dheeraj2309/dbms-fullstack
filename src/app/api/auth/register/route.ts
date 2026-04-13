// Frontend register form submits { email, password }
//           ↓
// Zod validates shape — bad data stops here with 400
//           ↓
// Check DB — email already exists? Stop with 409
//           ↓
// bcrypt hashes the password (plain text never touches DB)
//           ↓
// prisma.user.create() saves the new user
//           ↓
// 201 Created → frontend redirects to /login
import { successResponse, errorResponse } from '@/lib/api-response';
import bcrypt, { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import z from 'zod';

const RegisterSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});
export async function POST(req: Request) {
  try {
    const body = await req.json();
    // step1 parse the if the incoming data is valid
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('Invalid email or password', 400);
    }
    // extract the correct data
    const { email, password } = parsed.data;
    // check if the email is already taken

    const existing = await prisma.user.findUnique({
      where: { email },
    });
    if (existing) {
      return errorResponse('Email is already taken', 409);
    }
    // hash the password

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'USER',
        isEmailVerified: false,
      },
    });

    return successResponse('Account Created Successfully', 201);
  } catch (error) {
    console.error('[REGISTERING USER]', error);
    const errMssg =
      error instanceof Error ? error.message : 'Internal Server Error';
    return errorResponse(errMssg, 500);
  }
}
