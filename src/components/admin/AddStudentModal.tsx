"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import axios from "axios"
import { toast } from "sonner"
import { useState } from "react"

const AddStudentSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),
})

type AddStudentValues = z.infer<typeof AddStudentSchema>

interface Props {
  onClose: () => void
  onSuccess: () => void
}

const inputStyle = (hasError?: boolean) => ({
  width: "100%", padding: "10px 13px",
  background: "#FAF7F2",
  border: `1px solid ${hasError ? "#E24B4A" : "#E8DDD4"}`,
  borderRadius: 9, fontSize: 14, color: "#1C1410",
  fontFamily: "'DM Sans', sans-serif",
  outline: "none", boxSizing: "border-box" as const,
})

export default function AddStudentModal({ onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<AddStudentValues>({
    resolver: zodResolver(AddStudentSchema),
  })

  async function onSubmit(values: AddStudentValues) {
    setLoading(true)
    try {
      await axios.post("/api/auth/register", values)
      toast.success("Student account created")
      onSuccess()
    } catch (err: any) {
      toast.error(err.response?.data?.error ?? "Failed to create account")
    } finally {
      setLoading(false)
    }
  }

  return (
    // Backdrop
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(28,20,16,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 50, fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Modal card */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white", borderRadius: 20,
          border: "1px solid #E8DDD4",
          padding: "36px 32px",
          width: "100%", maxWidth: 420,
          margin: "0 24px",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C4622D", margin: "0 0 6px" }}>
              Admin action
            </p>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#1C1410", margin: 0 }}>
              Add new student
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#FAF7F2", border: "1px solid #E8DDD4",
              borderRadius: 8, width: 32, height: 32,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: 16, color: "#8C7B6E",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "#4A3728", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 6 }}>
              Email address
            </label>
            <input {...register("email")} placeholder="student@college.edu" style={inputStyle(!!errors.email)} />
            {errors.email && <p style={{ fontSize: 12, color: "#E24B4A", marginTop: 4 }}>{errors.email.message}</p>}
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "#4A3728", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 6 }}>
              Temporary password
            </label>
            <input {...register("password")} type="password" placeholder="Min. 6 characters" style={inputStyle(!!errors.password)} />
            {errors.password && <p style={{ fontSize: 12, color: "#E24B4A", marginTop: 4 }}>{errors.password.message}</p>}
            <p style={{ fontSize: 11, color: "#B0A096", marginTop: 4 }}>
              The student can change this after logging in.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1, padding: "11px",
                background: "#FAF7F2", color: "#4A3728",
                border: "1px solid #E8DDD4", borderRadius: 10,
                fontSize: 14, fontWeight: 500,
                fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1, padding: "11px",
                background: loading ? "#8C7B6E" : "#1C1410",
                color: "#F5EFE6", border: "none",
                borderRadius: 10, fontSize: 14, fontWeight: 500,
                fontFamily: "'DM Sans', sans-serif",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Creating..." : "Create account →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}