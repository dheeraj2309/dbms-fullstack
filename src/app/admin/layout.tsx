import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Navbar from "@/components/shared/Navbar"
import { SessionProvider } from "next-auth/react"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session) redirect("/login")
  if (!session.user.isEmailVerified) redirect("/verify-otp")
  if (session.user.role !== "ADMIN") redirect("/dashboard")

  return (
    <SessionProvider>
      <Navbar />
      {children}
    </SessionProvider>
  )
}