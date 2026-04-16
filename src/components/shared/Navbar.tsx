"use client"

import { signOut, useSession } from "next-auth/react"

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav style={{
      background: "#1C1410",
      padding: "0 40px",
      height: 56,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 10,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 7, height: 7, background: "#C4622D", borderRadius: "50%" }} />
        <span style={{ color: "#F5EFE6", fontSize: 13, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          DBMS Lab
        </span>
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 13, color: "#8C7B6E" }}>
          {session?.user?.email}
        </span>
        <span style={{
          background: "#C4622D22",
          color: "#E8A87C",
          fontSize: 11, padding: "3px 10px",
          borderRadius: 99, fontWeight: 500,
        }}>
          {session?.user?.role === "ADMIN" ? "Admin" : "Student"}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          style={{
            fontSize: 13, color: "#8C7B6E",
            background: "none",
            border: "1px solid #2D1F18",
            borderRadius: 8, padding: "6px 14px",
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            transition: "all 0.2s",
          }}
        >
          Sign out
        </button>
      </div>
    </nav>
  )
}