"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { StudentFormSchema, type StudentFormValues } from "@/lib/validations"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import axios from "axios"

interface StudentFormProps {
  existingData?: StudentFormValues & { id?: string }
  userId?: string
  isAdmin?: boolean
}

const inputStyle = (hasError?: boolean) => ({
  padding: "10px 13px",
  background: "#FAF7F2",
  border: `1px solid ${hasError ? "#E24B4A" : "#E8DDD4"}`,
  borderRadius: 9,
  fontSize: 14,
  color: "#1C1410",
  fontFamily: "'DM Sans', sans-serif",
  outline: "none",
  width: "100%",
  boxSizing: "border-box" as const,
  transition: "border-color 0.15s",
})

const labelStyle = {
  fontSize: 11,
  fontWeight: 500 as const,
  color: "#4A3728",
  letterSpacing: "0.04em",
  textTransform: "uppercase" as const,
}

const selectStyle = {
  ...inputStyle(),
  appearance: "none" as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%238C7B6E' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat" as const,
  backgroundPosition: "right 12px center",
  paddingRight: 32,
  cursor: "pointer" as const,
}

export default function StudentForm({ existingData, userId, isAdmin }: StudentFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const isEditMode = !!existingData

  const { register, handleSubmit, formState: { errors } } = useForm<StudentFormValues>({
    resolver: zodResolver(StudentFormSchema) as any,
    defaultValues: existingData ?? {},
  })

  async function onSubmit(values: StudentFormValues) {
    setLoading(true)
    try {
      if (isEditMode) {
        // PATCH — editing existing data
        const id = userId ?? ""
        await axios.patch(`/api/student/${id}`, values)
        toast.success("Registration updated successfully")
      } else {
        // POST — first time submission
        await axios.post("/api/student", values)
        toast.success("Registration submitted successfully")
      }
      router.refresh()
    } catch (err: any) {
      toast.error(err.response?.data?.error ?? "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const sectionLabel = (text: string) => (
    <div style={{
      fontSize: 11, fontWeight: 500,
      letterSpacing: "0.1em",
      textTransform: "uppercase" as const,
      color: "#C4622D",
      marginBottom: 20,
      display: "flex",
      alignItems: "center",
      gap: 8,
    }}>
      {text}
      <div style={{ flex: 1, height: 1, background: "#F0EAE0" }} />
    </div>
  )

  const field = (
    label: string,
    name: keyof StudentFormValues,
    placeholder: string,
    optional = false,
    hint?: string,
    fullWidth = false
  ) => (
    <div style={{
      display: "flex", flexDirection: "column", gap: 6,
      gridColumn: fullWidth ? "1 / -1" : undefined,
    }}>
      <label style={labelStyle}>
        {label}{" "}
        {optional && <span style={{ color: "#B0A096", fontWeight: 400, textTransform: "none" }}>(optional)</span>}
      </label>
      <input
        {...register(name)}
        placeholder={placeholder}
        style={inputStyle(!!errors[name])}
      />
      {hint && <span style={{ fontSize: 11, color: "#B0A096" }}>{hint}</span>}
      {errors[name] && (
        <span style={{ fontSize: 12, color: "#E24B4A" }}>
          {errors[name]?.message}
        </span>
      )}
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div style={{
        background: "white",
        borderRadius: 16,
        border: "1px solid #E8DDD4",
        overflow: "hidden",
      }}>

        {/* Personal information */}
        <div style={{ padding: "28px 32px", borderBottom: "1px solid #F0EAE0" }}>
          {sectionLabel("Personal information")}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {field("First name", "firstName", "Rahul")}
            {field("Last name", "lastName", "Sharma", true)}
            {field("Address", "address", "123, MG Road, Bangalore", false, undefined, true)}
            {field("Phone number", "phoneNumber", "+91 98765 43210", true)}
          </div>
        </div>

        {/* Academic details */}
        <div style={{ padding: "28px 32px", borderBottom: "1px solid #F0EAE0" }}>
          {sectionLabel("Academic details")}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

            {/* Course */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={labelStyle}>Course</label>
              <select {...register("course")} style={selectStyle}>
                <option value="">Select course</option>
                {["B.Tech", "M.Tech", "BCA", "MCA", "B.Sc", "M.Sc"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.course && <span style={{ fontSize: 12, color: "#E24B4A" }}>{errors.course.message}</span>}
            </div>

            {/* Branch */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={labelStyle}>
                Branch <span style={{ color: "#B0A096", fontWeight: 400, textTransform: "none" }}>(optional)</span>
              </label>
              <select {...register("branch")} style={selectStyle}>
                <option value="">Select branch</option>
                {["Computer Science", "Electronics", "Mechanical", "Civil", "Chemical", "Information Technology"].map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={labelStyle}>
                Year <span style={{ color: "#B0A096", fontWeight: 400, textTransform: "none" }}>(optional)</span>
              </label>
              <select {...register("year")} style={selectStyle}>
                <option value="">Select year</option>
                {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* CGPA */}
            {field("CGPA", "cgpa", "8.5", false, "Enter on a scale of 0 – 10")}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: "24px 32px",
          background: "#FAF7F2",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <span style={{ fontSize: 12, color: "#8C7B6E", display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="1" y="5" width="10" height="7" rx="2" stroke="#8C7B6E" strokeWidth="1.2"/>
              <path d="M3 5V3.5a3 3 0 016 0V5" stroke="#8C7B6E" strokeWidth="1.2"/>
              <circle cx="6" cy="8.5" r="1" fill="#8C7B6E"/>
            </svg>
            Your data is encrypted and stored securely
          </span>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "11px 28px",
              background: loading ? "#8C7B6E" : "#1C1410",
              color: "#F5EFE6",
              border: "none", borderRadius: 10,
              fontSize: 14, fontWeight: 500,
              fontFamily: "'DM Sans', sans-serif",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
          >
            {loading ? "Saving..." : isEditMode ? "Save changes →" : "Submit registration →"}
          </button>
        </div>
      </div>
    </form>
  )
}