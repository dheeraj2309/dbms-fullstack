// GET /api/admin/users              → returns all students
// GET /api/admin/users?search=rahul → filters by name, email, course, branch

// Session check → logged in?
// Role check    → ADMIN only
// Read URL      → extract search param if present
              
// prisma.user.findMany()
//   where role = USER
//   if search:
//     OR [
//       email contains search
//       firstName contains search
//       lastName contains search
//       course contains search
//       branch contains search
//     ]
//   select only safe fields (no password)
//   order by newest first

// → { users: [...], total: 5 }

import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    // Step 1 — Must be logged in
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse('Unauthorized', 401);
    }
    // Step 2 — Admin only route
    if (session.user.role !== 'ADMIN') {
      return errorResponse('Forbidden', 403);
    }
    // Step 3 — Read search query from URL
    // e.g. /api/admin/users?search=rahul
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') ?? '';
    // Step 4 — Fetch all students with optional search
    const users = await prisma.user.findMany({
      where: {
        role: 'USER',
        // If search is empty, this condition is ignored
        // If search has value, filter across multiple fields
        ...(search && {
          OR: [
            {
              email: {
                contains: search,
                mode: 'insensitive', // case insensitive search
              },
            },
            {
              formData: {
                OR: [
                  {
                    firstName: {
                      contains: search,
                      mode: 'insensitive',
                    },
                  },
                  {
                    lastName: {
                      contains: search,
                      mode: 'insensitive',
                    },
                  },
                  {
                    course: {
                      contains: search,
                      mode: 'insensitive',
                    },
                  },
                  {
                    branch: {
                      contains: search,
                      mode: 'insensitive',
                    },
                  },
                ],
              },
            },
          ],
        }),
      },

      // Step 5 — Shape the response
      // Only return what the admin table actually needs
      // Never return passwords
      select: {
        id: true,
        email: true,
        isEmailVerified: true,
        createdAt: true,
        formData: {
          select: {
            firstName: true,
            lastName: true,
            course: true,
            branch: true,
            year: true,
            cgpa: true,
            phoneNumber: true,
            submittedAt: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc', // newest registrations first
      },
    });
    return successResponse({ users, total: users.length });
  } catch (error) {
    console.error("[ADMIN_USERS_GET]", error)
    return errorResponse("Internal server error", 500)
  }
}
