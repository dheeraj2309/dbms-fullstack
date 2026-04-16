"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import OtpInput from "@/components/shared/OtpInput"
import axios from "axios"
import { toast } from "sonner"

export default function VerifyOtpPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [otp, setOtp] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [seconds, setSeconds] = useState(600)   // 10 minutes
  const [otpSent, setOtpSent] = useState(false)

  // Auto-send OTP when page loads
  useEffect(() => {
    sendOtp()
  }, [])

  // Countdown timer
  useEffect(() => {
    if (seconds <= 0) return
    const interval = setInterval(() => setSeconds((s) => s - 1), 1000)
    return () => clearInterval(interval)
  }, [seconds])

  async function sendOtp() {
    try {
      await axios.post("/api/otp/send")
      setOtpSent(true)
      setSeconds(600)
      toast.success("OTP sent to your email")
    } catch {
      toast.error("Failed to send OTP")
    }
  }

  async function handleVerify() {
    const code = otp
    if (code.length !== 6) {
      toast.error("Please enter all 6 digits")
      return
    }

    setLoading(true)
    try {
      await axios.post("/api/otp/verify", { otp: code })
      toast.success("Email verified!")
      router.push("/dashboard")
      router.refresh()
    } catch (err: any) {
      toast.error(err.response?.data?.error ?? "Invalid OTP")
    } finally {
      setLoading(false)
    }
  }

  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0")
  const secs = (seconds % 60).toString().padStart(2, "0")

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--cream)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 40,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{
        background: "white",
        borderRadius: 20,
        border: "1px solid var(--sand)",
        padding: "48px 40px",
        maxWidth: 420,
        width: "100%",
      }}>
        {/* Progress dots */}
        <div style={{ display: "flex", gap: 6, marginBottom: 32 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{
              height: 6, borderRadius: 3,
              background: i === 0 ? "var(--terracotta)" : i === 1 ? "var(--terracotta)" : "var(--sand)",
              width: i === 1 ? 18 : 6,
              transition: "all 0.3s",
            }} />
          ))}
        </div>

        {/* Icon */}
        <div style={{
          width: 52, height: 52,
          background: "#FDF0E8",
          borderRadius: 14,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 24,
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="7" width="20" height="14" rx="3" stroke="#C4622D" strokeWidth="1.5"/>
            <path d="M2 11l10 6 10-6" stroke="#C4622D" strokeWidth="1.5"/>
          </svg>
        </div>

        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--terracotta)", margin: "0 0 8px" }}>
          Step 2 of 3
        </p>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, color: "var(--espresso)", margin: "0 0 8px" }}>
          Check your inbox
        </h2>
        <p style={{ fontSize: 13, color: "var(--muted-dark)", margin: "0 0 32px", lineHeight: 1.6 }}>
          We sent a 6-digit code to{" "}
          <strong style={{ color: "var(--espresso)" }}>{session?.user?.email}</strong>.
          Enter it below to verify your email.
        </p>

        <OtpInput value={otp} onChange={setOtp} />

        {/* Timer + resend */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "20px 0" }}>
          <span style={{ fontSize: 13, color: "var(--muted-dark)" }}>
            Expires in{" "}
            <span style={{ color: "var(--terracotta)", fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>
              {minutes}:{secs}
            </span>
          </span>
          <button
            onClick={sendOtp}
            disabled={seconds > 0}
            style={{
              fontSize: 13, fontWeight: 500,
              color: seconds > 0 ? "var(--sand)" : "var(--terracotta)",
              background: "none", border: "none",
              cursor: seconds > 0 ? "default" : "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Resend code
          </button>
        </div>

        <button
          onClick={handleVerify}
          disabled={loading}
          style={{
            width: "100%", padding: 13,
            background: loading ? "var(--muted-dark)" : "var(--espresso)",
            color: "var(--sand-light)",
            border: "none", borderRadius: 10,
            fontSize: 14, fontWeight: 500,
            fontFamily: "'DM Sans', sans-serif",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.2s",
          }}
        >
          {loading ? "Verifying..." : "Verify email →"}
        </button>

        <p style={{ textAlign: "center", fontSize: 13, color: "var(--muted-dark)", marginTop: 20 }}>
          Wrong email?{" "}
          <a href="/login" style={{ color: "var(--terracotta)", fontWeight: 500, textDecoration: "none" }}>
            Go back
          </a>
        </p>
      </div>
    </div>
  )
}