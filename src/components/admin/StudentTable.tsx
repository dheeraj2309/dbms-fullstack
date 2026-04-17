"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "sonner"
import AddStudentModal from "@/components/admin/AddStudentModal"

interface Student {
  id: string
  email: string
  isEmailVerified: boolean
  createdAt: string
  formData: {
    firstName: string
    lastName?: string
    course: string
    branch?: string
    year?: string
    cgpa: number
    submittedAt: string
  } | null
}

const thStyle = {
  padding: "12px 20px",
  textAlign: "left" as const,
  fontSize: 11,
  fontWeight: 500 as const,
  color: "#8C7B6E",
  letterSpacing: "0.06em",
  textTransform: "uppercase" as const,
  borderBottom: "1px solid #F0EAE0",
  background: "#FAF7F2",
}

const tdStyle = {
  padding: "14px 20px",
  fontSize: 13,
  color: "#1C1410",
  borderBottom: "1px solid #F0EAE0",
  verticalAlign: "middle" as const,
}

function getInitials(firstName: string, lastName?: string) {
  return `${firstName[0]}${lastName?.[0] ?? ""}`.toUpperCase()
}

export default function StudentsTable() {
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchStudents = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/admin/users?search=${search}`)
      setStudents(data.data.users)
    } catch {
      toast.error("Failed to fetch students")
    } finally {
      setLoading(false)
    }
  }, [search])

  // Debounce search
  useEffect(() => {
    const timeout = setTimeout(fetchStudents, 300)
    return () => clearTimeout(timeout)
  }, [fetchStudents])

  async function handleDelete(id: string) {
    if (!confirm("Delete this student's form data? This cannot be undone.")) return
    setDeleting(id)
    try {
      await axios.delete(`/api/student/${id}`)
      toast.success("Student data deleted")
      fetchStudents()
    } catch {
      toast.error("Failed to delete")
    } finally {
      setDeleting(null)
    }
  }

  const submitted = students.filter((s) => s.formData).length
  const verified = students.filter((s) => s.isEmailVerified).length
  const pending = students.filter((s) => !s.isEmailVerified).length

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Total registered", value: students.length, sub: "All time" },
          { label: "Forms submitted", value: submitted, sub: `${students.length ? Math.round((submitted / students.length) * 100) : 0}% completion` },
          { label: "Pending verification", value: pending, sub: "Email not verified" },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: "white", border: "1px solid #E8DDD4",
            borderRadius: 12, padding: "20px 24px",
          }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: "#8C7B6E", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
              {stat.label}
            </div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, color: "#1C1410", lineHeight: 1 }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 12, color: "#B0A096", marginTop: 4 }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, gap: 12 }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
          <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="#8C7B6E" strokeWidth="1.2"/>
            <path d="M9.5 9.5L12 12" stroke="#8C7B6E" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, branch..."
            style={{
              width: "100%", padding: "9px 12px 9px 36px",
              background: "white", border: "1px solid #E8DDD4",
              borderRadius: 9, fontSize: 13, color: "#1C1410",
              fontFamily: "'DM Sans', sans-serif", outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: "9px 20px", background: "#1C1410",
            color: "#F5EFE6", border: "none", borderRadius: 9,
            fontSize: 13, fontWeight: 500,
            fontFamily: "'DM Sans', sans-serif",
            cursor: "pointer", whiteSpace: "nowrap",
          }}
        >
          + Add student
        </button>
      </div>

      {/* Table */}
      <div style={{ background: "white", borderRadius: 16, border: "1px solid #E8DDD4", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: "center", color: "#8C7B6E", fontSize: 14 }}>
            Loading students...
          </div>
        ) : students.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: "#8C7B6E", fontSize: 14 }}>
            {search ? `No students found for "${search}"` : "No students registered yet"}
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Student", "Course / Branch", "CGPA", "Email", "Form", "Actions"].map((h) => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr
                  key={student.id}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={(e) => {
                    Array.from((e.currentTarget as HTMLTableRowElement).cells).forEach(
                      (cell) => (cell.style.background = "#FAF7F2")
                    )
                  }}
                  onMouseLeave={(e) => {
                    Array.from((e.currentTarget as HTMLTableRowElement).cells).forEach(
                      (cell) => (cell.style.background = "transparent")
                    )
                  }}
                >
                  {/* Student name + email */}
                  <td style={tdStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: "#FDF0E8",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12, fontWeight: 500, color: "#C4622D", flexShrink: 0,
                      }}>
                        {student.formData
                          ? getInitials(student.formData.firstName, student.formData.lastName)
                          : student.email[0].toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, color: "#1C1410" }}>
                          {student.formData
                            ? `${student.formData.firstName} ${student.formData.lastName ?? ""}`
                            : "—"}
                        </div>
                        <div style={{ fontSize: 12, color: "#8C7B6E" }}>{student.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Course / Branch */}
                  <td style={tdStyle}>
                    {student.formData ? (
                      <>
                        <span>{student.formData.course}</span>
                        {student.formData.branch && (
                          <span style={{ color: "#8C7B6E" }}> · {student.formData.branch}</span>
                        )}
                        {student.formData.year && (
                          <div style={{ fontSize: 11, color: "#8C7B6E", marginTop: 2 }}>
                            {student.formData.year}
                          </div>
                        )}
                      </>
                    ) : "—"}
                  </td>

                  {/* CGPA */}
                  <td style={tdStyle}>
                    {student.formData?.cgpa ?? "—"}
                  </td>

                  {/* Email verified */}
                  <td style={tdStyle}>
                    <span style={{
                      background: student.isEmailVerified ? "#EAF3DE" : "#FAEEDA",
                      color: student.isEmailVerified ? "#27500A" : "#633806",
                      fontSize: 11, padding: "3px 10px",
                      borderRadius: 99, fontWeight: 500,
                    }}>
                      {student.isEmailVerified ? "Verified" : "Pending"}
                    </span>
                  </td>

                  {/* Form submitted */}
                  <td style={tdStyle}>
                    <span style={{
                      background: student.formData ? "#E6F1FB" : "#F1EFE8",
                      color: student.formData ? "#0C447C" : "#5F5E5A",
                      fontSize: 11, padding: "3px 10px",
                      borderRadius: 99, fontWeight: 500,
                    }}>
                      {student.formData ? "Submitted" : "Not submitted"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={tdStyle}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => router.push(`/admin/dashboard/${student.id}`)}
                        style={{
                          padding: "5px 12px",
                          background: "#FAF7F2",
                          border: "1px solid #E8DDD4",
                          borderRadius: 7, fontSize: 12,
                          color: "#4A3728",
                          fontFamily: "'DM Sans', sans-serif",
                          cursor: "pointer",
                        }}
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        disabled={deleting === student.id}
                        style={{
                          padding: "5px 12px",
                          background: "#FCEBEB",
                          border: "1px solid #F7C1C1",
                          borderRadius: 7, fontSize: 12,
                          color: "#A32D2D",
                          fontFamily: "'DM Sans', sans-serif",
                          cursor: deleting === student.id ? "not-allowed" : "pointer",
                        }}
                      >
                        {deleting === student.id ? "..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Footer */}
        <div style={{
          padding: "14px 20px",
          background: "#FAF7F2",
          borderTop: "1px solid #F0EAE0",
          fontSize: 12, color: "#8C7B6E",
        }}>
          Showing {students.length} student{students.length !== 1 ? "s" : ""}
          {search && ` matching "${search}"`}
        </div>
      </div>

      {showModal && (
        <AddStudentModal
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); fetchStudents() }}
        />
      )}
    </div>
  )
}