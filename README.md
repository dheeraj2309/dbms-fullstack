# Student Registration System

A full-stack student registration portal built as a DBMS lab project. Students can register, verify their email via OTP, and submit an academic profile form. Admins can manage all student records through a dedicated dashboard.

---

## What it does

- **Students** create an account, verify their email with a 6-digit OTP, and fill out a registration form with personal and academic details. They can return and edit their submission at any time.
- **Admins** have a separate dashboard with a searchable table of all registered students. They can view any student's full profile, edit their details, delete their form data, or manually create new student accounts.
- **Confirmation emails** are sent to students automatically when their form is submitted.

---

## Tech stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Next.js 15 (App Router) | Full-stack React framework |
| Language | TypeScript | Type safety throughout |
| UI | shadcn/ui + Tailwind CSS v4 | Component library + styling |
| Fonts | DM Serif Display + DM Sans | Warm editorial aesthetic |
| Auth | NextAuth.js v5 (Auth.js) | JWT sessions, role-based access |
| ORM | Prisma v6 | Type-safe database queries |
| Database | PostgreSQL via Neon | Serverless Postgres |
| Connection | Prisma Accelerate | Serverless connection pooling |
| Validation | Zod + React Hook Form | Shared client + server validation |
| Email | Resend + react-email | Transactional OTP and confirmation emails |
| Passwords | bcryptjs | Secure password hashing |
| Toast | Sonner | Notification system |
| HTTP client | Axios | API calls from client components |
| Deployment | Vercel | Hosting + serverless functions |

---

## Project structure

```
dbms/
├── prisma/
│   └── schema.prisma                    # User and FormDetails models
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                   # Root layout — SessionProvider, Toaster, fonts
│   │   ├── page.tsx                     # Root redirect based on session + role
│   │   │
│   │   ├── (auth)/                      # Public routes — no shared layout
│   │   │   ├── login/page.tsx           # Email + password login
│   │   │   ├── register/page.tsx        # New student registration
│   │   │   └── verify-otp/page.tsx      # 6-digit OTP verification screen
│   │   │
│   │   ├── (student)/                   # Protected: role === USER
│   │   │   ├── layout.tsx               # Checks session + role, redirects if not student
│   │   │   └── dashboard/page.tsx       # Student form — submit or edit mode
│   │   │
│   │   ├── (admin)/                     # Protected: role === ADMIN
│   │   │   ├── layout.tsx               # Checks session + role, redirects if not admin
│   │   │   └── dashboard/
│   │   │       ├── page.tsx             # Student table with search + stats
│   │   │       └── [id]/page.tsx        # View and edit a specific student
│   │   │
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── [...nextauth]/route.ts   # NextAuth handler (GET + POST)
│   │       │   └── register/route.ts        # Create new user account
│   │       ├── otp/
│   │       │   ├── send/route.ts            # Generate OTP, save to DB, send email
│   │       │   └── verify/route.ts          # Verify OTP, mark email verified
│   │       ├── student/
│   │       │   ├── route.ts                 # GET own profile, POST submit form
│   │       │   └── [id]/route.ts            # GET / PATCH / DELETE (admin)
│   │       └── admin/
│   │           └── users/route.ts           # GET all students with search
│   │
│   ├── components/
│   │   ├── ui/                          # shadcn/ui components (auto-generated)
│   │   ├── forms/
│   │   │   ├── StudentForm.tsx          # Registration form — submit + edit mode
│   │   │   └── LoginForm.tsx            # Email + password fields
│   │   ├── admin/
│   │   │   ├── StudentsTable.tsx        # Searchable table with stats
│   │   │   └── AddStudentModal.tsx      # Dialog to manually add a student
│   │   └── shared/
│   │       ├── Navbar.tsx               # Top nav — user info, role badge, logout
│   │       └── OtpInput.tsx             # 6-box OTP input with auto-focus + paste
│   │
│   ├── emails/
│   │   ├── OtpEmail.tsx                 # react-email OTP template
│   │   └── ConfirmationEmail.tsx        # react-email confirmation template
│   │
│   ├── lib/
│   │   ├── prisma.ts                    # Prisma singleton with Accelerate extension
│   │   ├── auth.ts                      # NextAuth full config (Node.js — has Prisma)
│   │   ├── auth.config.ts               # NextAuth edge-safe config (no Prisma)
│   │   ├── validations.ts               # All Zod schemas — single source of truth
│   │   ├── mail.ts                      # Resend helpers — sendOtpEmail, sendConfirmationEmail
│   │   └── api-response.ts              # Standardised successResponse / errorResponse
│   │
│   ├── proxy.ts                         # Route protection middleware (renamed from middleware.ts in Next 16)
│   │
│   └── types/
│       └── next-auth.d.ts               # Extends Session + JWT with id, role, isEmailVerified
│
├── .env                                 # Local secrets — never commit
├── .env.example                         # Safe to commit — empty values
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Database schema

```prisma
model User {
  id              String       @id @default(cuid())
  email           String       @unique
  password        String
  isEmailVerified Boolean      @default(false)
  role            Role         @default(USER)
  otp             String?
  otpExpiry       DateTime?
  formData        FormDetails?
  createdAt       DateTime     @default(now())
}

model FormDetails {
  id          String   @id @default(cuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  firstName   String
  lastName    String?
  course      String
  branch      String?
  year        String?
  address     String
  phoneNumber String?
  cgpa        Float
  submittedAt DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum Role {
  USER
  ADMIN
}
```

---

## API routes

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create a new student account |
| POST | `/api/auth/signin` | Public | NextAuth login handler |
| POST | `/api/otp/send` | Authenticated | Generate OTP, save to DB, send email |
| POST | `/api/otp/verify` | Authenticated | Verify OTP, mark email as verified |
| GET | `/api/student` | Student | Fetch own form data |
| POST | `/api/student` | Student | Submit form for the first time |
| GET | `/api/student/[id]` | Admin | Fetch a specific student's data |
| PATCH | `/api/student/[id]` | Student (own) / Admin | Edit form data |
| DELETE | `/api/student/[id]` | Admin | Delete student form data |
| GET | `/api/admin/users` | Admin | Fetch all students with optional search |

---

## Environment variables

Create a `.env` file at the root with these keys:

```env
# Neon / Prisma Accelerate connection string
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=your_key"

# Generate with: npx auth secret
AUTH_SECRET="your_generated_secret"

# Local dev URL — update to Vercel URL on deployment
AUTH_URL="http://localhost:3000"

# Get from resend.com dashboard
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxx"
```

---

## Getting started

```bash
# 1. Clone and install
git clone https://github.com/your-username/dbms.git
cd dbms
npm install

# 2. Set up environment variables
cp .env.example .env
# Fill in your values

# 3. Push schema to database
npx prisma db push
npx prisma generate

# 4. Create an admin account
# Register normally via the app, then go to Neon dashboard
# and manually set role = ADMIN on your row

# 5. Run the dev server
npm run dev

# 6. Preview email templates (optional)
npm run email
```

---

## Auth flow

```
Register → Login → OTP sent to email → Enter OTP → Verified
                                                       ↓
                              role === ADMIN → /admin/dashboard
                              role === USER  → /dashboard
```

The middleware (proxy.ts) enforces this at the routing level before any page renders. JWT tokens expire after 7 days with daily refresh for active sessions.

---

## Key architectural decisions

**Split auth config for Edge Runtime compatibility**
NextAuth v5 middleware runs in the Edge Runtime which does not support Node.js modules. Prisma uses `node:path` and `node:crypto` internally, so it cannot run at the edge. The solution is to split the config: `auth.config.ts` contains only the JWT/session callbacks (edge-safe) and is used by the middleware. `auth.ts` adds the Credentials provider with Prisma (Node.js only) and is used by API routes and server components.

**OTP stored in the User model, not Redis**
For a project of this scale, storing the OTP and its expiry directly on the User row is sufficient and simpler than running a separate Redis instance. The OTP is cleared immediately after successful verification so it cannot be reused.

**Single Zod schema as source of truth**
All validation schemas live in `src/lib/validations.ts` and are imported by both API route handlers and React Hook Form resolvers. This ensures the server and client always validate against identical rules.

**Confirmation email is non-blocking**
If Resend fails to deliver the confirmation email, the form submission still succeeds. Email failure is logged server-side but does not return an error to the user — the data is already saved and that is what matters.

**Prisma Accelerate for serverless**
Vercel functions are stateless and spin up cold on every request. Regular Prisma connections would exhaust the Neon connection pool within minutes. Prisma Accelerate sits in front of Neon and manages connection pooling automatically.

---

## What this project taught

**Next.js App Router**
How route groups `(auth)`, `(student)`, `(admin)` work to share layouts without affecting URLs. The difference between Server Components (async, can call Prisma directly) and Client Components (interactive, hooks, browser APIs). How `layout.tsx` files create nested protection layers.

**Authentication from scratch**
How JWT tokens are created, signed, and verified. What the `jwt()` and `session()` callbacks actually do and why they're separate. How NextAuth's `authorize()` function plugs into the credentials flow. Why `.d.ts` declaration merging is needed to add custom fields to the session type.

**Edge Runtime vs Node.js Runtime**
The hard boundary between what can run in middleware (edge) vs API routes (Node.js full). Why Prisma cannot run at the edge and how to architect around it by splitting configuration files.

**Database design with Prisma**
One-to-one relations between User and FormDetails. The `onDelete: Cascade` behaviour. The difference between `db push` (direct schema sync, no history) and `migrate dev` (tracked SQL migration files). Why you should never mix both approaches in the same project.

**Security fundamentals**
Password hashing with bcrypt salt rounds. Cryptographically secure OTP generation using `crypto.getRandomValues()` vs the insecure `Math.random()`. Checking OTP expiry before value to avoid timing-based information leaks. Role-based access control enforced at both the middleware and API route level.

**Email with react-email + Resend**
Building email templates as React components. The `PreviewProps` pattern for local development preview. Why email failures should be non-blocking for the main user flow.

**TypeScript patterns**
Zod schema inference with `z.infer<typeof Schema>`. Module augmentation with `declare module` to extend third-party types. The singleton pattern for database clients in hot-reloading environments.

---

## License

MIT — built for academic/lab purposes.
