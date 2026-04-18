# Student Registration System

A full-stack student registration portal built as a DBMS lab project. Students can register, verify their email via OTP, and submit an academic profile form. Admins can manage all student records through a dedicated dashboard.

---

## What it does

- **Students** create an account, verify their email with a 6-digit OTP, and fill out a registration form with personal and academic details. They can return and edit their submission at any time.
- **Admins** have a separate dashboard with a searchable table of all registered students. They can view any student's full profile, edit their details, delete their form data, or manually create new student accounts.
- **Confirmation emails** are sent to students automatically when their form is submitted, delivered via Gmail using Nodemailer with an App Password.

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
| Email | Nodemailer + Gmail App Password | Transactional OTP and confirmation emails |
| Email templates | react-email | React-based email components |
| Passwords | bcryptjs | Secure password hashing |
| Toast | Sonner | Notification system |
| HTTP client | Axios | API calls from client components |
| Deployment | Vercel | Hosting + serverless functions |

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx                        # Root layout — Providers, Toaster, fonts
│   ├── page.tsx                          # Root redirect based on session + role
│   ├── globals.css                       # Global styles + CSS design tokens
│   │
│   ├── (auth)/                           # Public routes — no shared layout
│   │   ├── login/page.tsx                # Email + password login
│   │   ├── register/page.tsx             # New student registration
│   │   └── verify-otp/page.tsx           # 6-digit OTP verification screen
│   │
│   ├── student/                          # Protected: role === USER
│   │   ├── layout.tsx                    # Checks session + role
│   │   └── dashboard/page.tsx            # Student form — submit or edit mode
│   │
│   ├── admin/                            # Protected: role === ADMIN
│   │   ├── layout.tsx                    # Checks session + role
│   │   └── dashboard/
│   │       ├── page.tsx                  # Student table with search + stats
│   │       └── [id]/page.tsx             # View and edit a specific student
│   │
│   └── api/
│       ├── auth/
│       │   ├── [...nextauth]/route.ts    # NextAuth handler (GET + POST)
│       │   └── register/route.ts         # Create new user account
│       ├── otp/
│       │   ├── send/route.ts             # Generate OTP, save to DB, send email
│       │   └── verify/route.ts           # Verify OTP, mark email verified
│       ├── student/
│       │   ├── route.ts                  # GET own profile, POST submit form
│       │   └── [id]/route.ts             # GET / PATCH / DELETE (admin)
│       └── admin/
│           └── users/route.ts            # GET all students with search
│
├── components/
│   ├── ui/                               # shadcn/ui components (auto-generated)
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── table.tsx
│   ├── forms/
│   │   ├── StudentForm.tsx               # Registration form — submit + edit mode
│   │   └── LoginForm.tsx                 # Email + password fields
│   ├── admin/
│   │   ├── StudentTable.tsx              # Searchable table with stats + actions
│   │   └── AddStudentModal.tsx           # Dialog to manually add a student
│   ├── shared/
│   │   ├── Navbar.tsx                    # Top nav — user info, role badge, logout
│   │   └── OtpInput.tsx                  # 6-box OTP input with auto-focus + paste
│   └── Providers.tsx                     # SessionProvider wrapper
│
├── emails/
│   ├── Otp.tsx                           # react-email OTP template
│   └── ConfirmationEmail.tsx             # react-email confirmation template
│
├── generated/
│   └── prisma/                           # Auto-generated Prisma client (do not edit)
│
├── lib/
│   ├── prisma.ts                         # Prisma singleton with Accelerate extension
│   ├── auth.ts                           # NextAuth full config (Node.js — has Prisma)
│   ├── auth.config.ts                    # NextAuth edge-safe config (no Prisma)
│   ├── validations.ts                    # All Zod schemas — single source of truth
│   ├── mail.ts                           # Nodemailer helpers — sendOtpEmail, sendConfirmationEmail
│   ├── api-response.ts                   # Standardised successResponse / errorResponse
│   └── utils.ts                          # shadcn cn() utility
│
├── types/
│   └── next-auth.d.ts                    # Extends Session + JWT with id, role, isEmailVerified
│
└── proxy.ts                              # Route protection middleware
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

Create a `.env` file at the root:

```env
# Neon / Prisma Accelerate connection string
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=your_key"

# Generate with: npx auth secret
AUTH_SECRET="your_generated_secret"

# Local dev URL — update to Vercel URL on deployment
AUTH_URL="http://localhost:3000"

# Gmail credentials for Nodemailer
# Use a Gmail App Password — NOT your real Gmail password
# Generate at: Google Account → Security → 2-Step Verification → App Passwords
GMAIL_USER="your-email@gmail.com"
GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"
```

> **Why Gmail App Password and not your real password?**
> Google blocks direct password login for third-party apps. An App Password is a 16-character code generated from your Google account that grants Nodemailer permission to send emails on your behalf without exposing your real password. Two-factor authentication must be enabled on your Google account before you can generate one.

---

## Gmail + Nodemailer setup

```ts
// src/lib/mail.ts
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})
```

No third-party email service account needed. Completely free.

---

## Getting started

```bash
# 1. Clone and install
git clone https://github.com/your-username/dbms.git
cd dbms
npm install

# 2. Set up environment variables
cp .env.example .env
# Fill in DATABASE_URL, AUTH_SECRET, AUTH_URL, GMAIL_USER, GMAIL_APP_PASSWORD

# 3. Push schema to database and generate client
npx prisma db push
npx prisma generate

# 4. Create your admin account
# Register normally via /register, then go to your Neon dashboard
# Tables → User → find your row → change role from USER to ADMIN

# 5. Run the dev server
npm run dev

# 6. Preview email templates (optional)
npm run email
```

---

## Auth flow

```
/register → account created
     ↓
/login → credentials verified → JWT cookie set
     ↓
/verify-otp → OTP sent to email → entered → isEmailVerified = true
     ↓
role === ADMIN → /admin/dashboard
role === USER  → /student/dashboard
```

The `proxy.ts` middleware enforces this at the routing level before any page renders. JWT tokens expire after 7 days with daily refresh for active sessions.

---

## Key architectural decisions

**Split auth config for Edge Runtime compatibility**

NextAuth v5 middleware runs in the Edge Runtime which does not support Node.js built-in modules. Prisma uses `node:path` and `node:crypto` internally, so it cannot run at the edge. The solution is to split the config into two files:
- `auth.config.ts` — JWT and session callbacks only, no imports that touch Node.js. Used by `proxy.ts`.
- `auth.ts` — full config including the Credentials provider with Prisma. Used by API routes and server components.

**Nodemailer with Gmail App Password over third-party email APIs**

Services like Resend, SendGrid, and Mailgun all require a verified custom domain before you can send to arbitrary email addresses on their free tiers — which makes them impractical for local development and lab projects. Nodemailer with a Gmail App Password requires no external account, has no domain verification step, and works immediately with two environment variables.

**OTP stored in the User model**

For a project of this scale, storing the OTP and its expiry directly on the User row is sufficient and avoids the overhead of a separate Redis instance. The OTP is cleared immediately after successful verification so it cannot be reused even within the expiry window.

**Expiry checked before value in OTP verification**

When verifying an OTP, the expiry timestamp is checked before comparing the code value. This prevents a timing-based information leak where an attacker could distinguish between "wrong code" and "expired code" to time their brute-force attempts.

**Shared Zod schemas as single source of truth**

All validation schemas live in `src/lib/validations.ts` and are imported by both API route handlers (server-side) and React Hook Form resolvers (client-side). This ensures the server and client always validate against identical rules — no duplication, no drift.

**Confirmation email is non-blocking**

If the Gmail transporter fails to deliver the confirmation email, the form submission still succeeds. Email failure is logged server-side but does not return an error to the user — the data is already saved, and that is what matters.

**Prisma Accelerate for serverless**

Vercel functions are stateless and spin up cold on every request. Regular Prisma connections would exhaust the Neon connection pool rapidly. Prisma Accelerate sits in front of Neon and manages connection pooling automatically with zero configuration.

**Standardised API responses**

Every API route returns the same JSON shape via `successResponse` and `errorResponse` helpers in `lib/api-response.ts`. The frontend always knows exactly what structure to expect and never has to guess field names across different endpoints.

---

## What this project taught

**Next.js App Router architecture**

How route groups `(auth)`, `student`, and `admin` work to share layouts without affecting URL paths. The difference between Server Components (async, run on server, can call Prisma directly) and Client Components (run in browser, can use hooks and event handlers). How nested `layout.tsx` files create layered protection — the admin layout checks the role before the page even starts rendering.

**Authentication from scratch without magic**

How JWT tokens are created, signed, stored in cookies, and verified on every request. What the `jwt()` and `session()` callbacks actually do and why they run in sequence. How `authorize()` in the Credentials provider connects the login form to your database. Why TypeScript's `.d.ts` declaration merging is needed to extend the built-in session type with custom fields like `role` and `isEmailVerified`.

**The Edge Runtime boundary**

There is a hard boundary in Next.js between code that runs in the Edge Runtime (middleware, lightweight) and the Node.js Runtime (API routes, server components, full). Prisma cannot cross this boundary. Learning to architect around it by splitting configuration files is a real-world pattern used in production Next.js applications.

**Database design and Prisma**

One-to-one relations with the `@relation` directive. The `onDelete: Cascade` behaviour — deleting a User automatically deletes their FormDetails. The `@default` decorator and when Prisma handles fields automatically versus when you must pass them explicitly. The critical difference between `db push` (no migration history, fast for prototyping) and `migrate dev` (tracked SQL files, required for production). Why mixing both in the same project causes drift errors.

**Security fundamentals that matter**

Password hashing with bcrypt and why salt rounds exist. The difference between `Math.random()` (predictable, seeded algorithm) and `crypto.getRandomValues()` (OS entropy pool, genuinely unpredictable) — and why the latter is mandatory for security-sensitive values like OTPs. Role-based access control enforced at three independent layers: middleware, layout server components, and API route handlers.

**Email delivery without third-party services**

How SMTP works and why direct password login is blocked by Google for third-party apps. How Gmail App Passwords grant scoped access without exposing your real credentials. How Nodemailer's transport abstraction works and how react-email renders React components to HTML strings that Nodemailer sends as the email body.

**TypeScript patterns worth knowing**

Zod schema inference with `z.infer<typeof Schema>` to derive TypeScript types from validation schemas. Module augmentation with `declare module "next-auth"` to extend third-party library types without modifying their source. The Prisma singleton pattern using `globalThis` to survive Next.js hot module replacement in development without exhausting database connections.

---

## License

MIT — built for academic and lab purposes.
