import StudentsTable from "@/components/admin/StudentTable"

export default function AdminDashboard() {
  return (
    <div style={{
      maxWidth: 1000,
      margin: "0 auto",
      padding: "40px 24px",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <p style={{
        fontSize: 11, fontWeight: 500,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "#C4622D", margin: "0 0 8px",
      }}>
        Admin Panel
      </p>
      <h1 style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize: 30, color: "#1C1410",
        margin: "0 0 6px",
      }}>
        Student registrations
      </h1>
      <p style={{ fontSize: 14, color: "#8C7B6E", margin: "0 0 32px" }}>
        Manage and review all student submissions from here.
      </p>

      <StudentsTable />
    </div>
  )
}