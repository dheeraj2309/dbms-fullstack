import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import StudentForm from "@/components/forms/StudentForm"

export default async function StudentDashboard() {
  const session = await auth()

  // Fetch existing form data if any
  const formData = await prisma.formDetails.findUnique({
    where: { userId: session!.user.id },
  })

  const isEditMode = !!formData

  return (
    <div style={{
      maxWidth: 780,
      margin: "0 auto",
      padding: "40px 24px",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <p style={{
          fontSize: 11, fontWeight: 500,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#C4622D", margin: "0 0 8px",
        }}>
          My Registration
        </p>
        <h1 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 30, color: "#1C1410",
          margin: "0 0 6px",
        }}>
          {isEditMode ? "Edit your profile" : "Complete your profile"}
        </h1>
        <p style={{ fontSize: 14, color: "#8C7B6E", margin: 0 }}>
          {isEditMode
            ? "Update your academic details below."
            : "Fill in your academic details below. You can edit this anytime"}
        </p>
      </div>

      {/* Status bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        background: "#EAF3DE",
        border: "1px solid #C0DD97",
        borderRadius: 10, padding: "12px 16px",
        marginBottom: 32,
      }}>
        <div style={{ width: 7, height: 7, background: "#3B6D11", borderRadius: "50%", flexShrink: 0 }} />
        <span style={{ fontSize: 13, color: "#27500A" }}>
          {isEditMode
            ? "Form already submitted — editing your existing registration"
            : "Email verified — you're all set to submit your registration"}
        </span>
      </div>

      <StudentForm
        existingData={formData ?? undefined as any} 
        userId={session!.user.id}
      />
    </div>
  )
}