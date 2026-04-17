import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function RootPage() {
  const session = await auth()

  // Not logged in → go to login
  if (!session) redirect("/login")

  // Logged in but OTP not verified → go verify
  if (!session.user.isEmailVerified) redirect("/verify-otp")

  // Admin → admin dashboard
  if (session.user.role === "ADMIN") redirect("/admin/dashboard")

  // Student → student dashboard
  redirect("/student/dashboard")
}