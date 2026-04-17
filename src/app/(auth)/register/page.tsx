"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import axios from "axios"
import { toast } from "sonner"
import Link from "next/link"

const RegisterSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type RegisterValues = z.infer<typeof RegisterSchema>

const inputStyle = (hasError?: boolean) => ({
  width: "100%", padding: "11px 14px",
  background: "white",
  border: `1px solid ${hasError ? "#E24B4A" : "#E8DDD4"}`,
  borderRadius: 10, fontSize: 14, color: "#1C1410",
  fontFamily: "'DM Sans', sans-serif",
  boxSizing: "border-box" as const, outline: "none",
})

const labelStyle = {
  display: "block" as const,
  fontSize: 11, fontWeight: 500 as const,
  color: "#4A3728", letterSpacing: "0.06em",
  textTransform: "uppercase" as const, marginBottom: 6,
}

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterValues>({
    resolver: zodResolver(RegisterSchema),
  })

  async function onSubmit(values: RegisterValues) {
    setLoading(true)
    try {
      await axios.post("/api/auth/register", {
        email: values.email,
        password: values.password,
      })
      toast.success("Account created — please sign in")
      router.push("/login")
    } catch (err: any) {
      toast.error(err.response?.data?.error ?? "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--cream)",
      display: "flex",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Left panel — same as login */}
      <div style={{
        width: "60%", background: "#1C1410",
        padding: "48px 40px",
        display: "flex", flexDirection: "column",
        justifyContent: "space-between",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 280, height: 280, borderRadius: "50%", background: "#C4622D", opacity: 0.12 }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 200, height: 200, borderRadius: "50%", background: "#E8A87C", opacity: 0.08 }} />

        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, background: "#C4622D", borderRadius: "50%" }} />
          <span style={{ color: "#F5EFE6", fontSize: 13, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" }}>DBMS Lab</span>
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", color: "#F5EFE6", fontSize: 38, lineHeight: 1.2, margin: "0 0 16px" }}>
            Join the<br /><em style={{ color: "#E8A87C" }}>Registration</em><br />Portal
          </h1>
          <p style={{ color: "#8C7B6E", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
            Create your account to submit your student registration and manage your academic profile.
          </p>
        </div>

        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 24, height: 1, background: "#C4622D" }} />
          <span style={{ color: "#6B5C52", fontSize: 12, letterSpacing: "0.05em" }}>Secure · Fast · Reliable</span>
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        flex: 1, padding: "48px",
        display: "flex", flexDirection: "column",
        justifyContent: "center",
        background: "var(--cream)",
      }}>
        <div style={{ maxWidth: '100vw' }}>
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C4622D", margin: "0 0 10px" }}>
            Get started
          </p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 30, color: "#1C1410", margin: "0 0 8px", lineHeight: 1.2 }}>
            Create your account
          </h2>
          <p style={{ fontSize: 14, color: "#8C7B6E", margin: "0 0 32px" }}>
            Fill in your details to register. You'll verify your email with an OTP next.
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Email address</label>
              <input {...register("email")} type="email" placeholder="you@college.edu" style={inputStyle(!!errors.email)} />
              {errors.email && <p style={{ fontSize: 12, color: "#E24B4A", marginTop: 4 }}>{errors.email.message}</p>}
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Password</label>
              <input {...register("password")} type="password" placeholder="Min. 6 characters" style={inputStyle(!!errors.password)} />
              {errors.password && <p style={{ fontSize: 12, color: "#E24B4A", marginTop: 4 }}>{errors.password.message}</p>}
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Confirm password</label>
              <input {...register("confirmPassword")} type="password" placeholder="Repeat your password" style={inputStyle(!!errors.confirmPassword)} />
              {errors.confirmPassword && <p style={{ fontSize: 12, color: "#E24B4A", marginTop: 4 }}>{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: 13,
                background: loading ? "#8C7B6E" : "#1C1410",
                color: "#F5EFE6", border: "none",
                borderRadius: 10, fontSize: 14, fontWeight: 500,
                fontFamily: "'DM Sans', sans-serif",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s", marginTop: 8,
              }}
            >
              {loading ? "Creating account..." : "Create account →"}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
            <div style={{ flex: 1, height: 1, background: "#E8DDD4" }} />
            <span style={{ fontSize: 12, color: "#B0A096" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "#E8DDD4" }} />
          </div>

          <p style={{ textAlign: "center", fontSize: 13, color: "#8C7B6E", margin: 0 }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#C4622D", fontWeight: 500, textDecoration: "none" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}