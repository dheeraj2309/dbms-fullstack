// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useRouter } from "next/navigation";
// import { signIn } from "next-auth/react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { LoginSchema } from "@/lib/validations"; // Assuming you have this from Phase 4

// export default function LoginForm() {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   const form = useForm<z.infer<typeof LoginSchema>>({
//     resolver: zodResolver(LoginSchema),
//     defaultValues: { email: "", password: "" },
//   });

//   async function onSubmit(values: z.infer<typeof LoginSchema>) {
//     setIsLoading(true);
//     setError("");

//     // NextAuth Credentials Sign-In
//     const result = await signIn("credentials", {
//       email: values.email,
//       password: values.password,
//       redirect: false,
//     });

//     if (result?.error) {
//       setError("Invalid email or password");
//       setIsLoading(false);
//     } else {
//       router.push("/dashboard"); // Will be intercepted by middleware based on role
//       router.refresh();
//     }
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
//         {error && (
//           <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
//             {error}
//           </div>
//         )}

//         <FormField
//           control={form.control}
//           name="email"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel className="text-stone-600 font-medium">Email Address</FormLabel>
//               <FormControl>
//                 <Input 
//                   placeholder="student@example.com" 
//                   {...field} 
//                   className="h-12 rounded-xl bg-stone-50 border-stone-200 focus-visible:ring-orange-500 focus-visible:ring-offset-2 transition-all"
//                 />
//               </FormControl>
//               <FormMessage className="text-red-500" />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="password"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel className="text-stone-600 font-medium">Password</FormLabel>
//               <FormControl>
//                 <Input 
//                   type="password" 
//                   placeholder="••••••••" 
//                   {...field} 
//                   className="h-12 rounded-xl bg-stone-50 border-stone-200 focus-visible:ring-orange-500 focus-visible:ring-offset-2 transition-all"
//                 />
//               </FormControl>
//               <FormMessage className="text-red-500" />
//             </FormItem>
//           )}
//         />

//         <Button 
//           type="submit" 
//           disabled={isLoading}
//           className="w-full h-12 text-base font-semibold rounded-xl bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/30 transition-all duration-300 hover:shadow-orange-500/50"
//         >
//           {isLoading ? "Signing in..." : "Sign In"}
//         </Button>
//       </form>
//     </Form>
//   );
// }
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginSchema, type loginFormValues } from "@/lib/validations"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export default function LoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"USER" | "ADMIN">("USER")

  const { register, handleSubmit, formState: { errors } } = useForm<loginFormValues>({
    resolver: zodResolver(LoginSchema),
  })

  async function onSubmit(values: loginFormValues) {
    setLoading(true)
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error("Invalid email or password")
        return
      }

      // Redirect to OTP verification after successful login
      router.push("/verify-otp")
      router.refresh()

    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Tabs */}
      <div style={{
        display: "flex",
        background: "var(--cream-dark)",
        borderRadius: "10px",
        padding: "3px",
        marginBottom: "28px",
      }}>
        {(["USER", "ADMIN"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1, padding: "8px",
              background: activeTab === tab ? "white" : "transparent",
              border: "none",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 500,
              color: activeTab === tab ? "var(--espresso)" : "var(--muted-dark)",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: activeTab === tab ? "0 1px 3px rgba(28,20,16,0.08)" : "none",
              transition: "all 0.2s",
            }}
          >
            {tab === "USER" ? "Student" : "Admin"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Email */}
        <div style={{ marginBottom: "18px" }}>
          <label style={{
            display: "block", fontSize: "11px", fontWeight: 500,
            color: "var(--muted-dark)", letterSpacing: "0.06em",
            textTransform: "uppercase", marginBottom: "6px",
          }}>
            Email address
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder="you@college.edu"
            style={{
              width: "100%", padding: "11px 14px",
              background: "white",
              border: `1px solid ${errors.email ? "#E24B4A" : "var(--sand)"}`,
              borderRadius: "10px",
              fontSize: "14px", color: "var(--espresso)",
              fontFamily: "'DM Sans', sans-serif",
              boxSizing: "border-box",
              outline: "none",
            }}
          />
          {errors.email && (
            <p style={{ fontSize: "12px", color: "#E24B4A", marginTop: "4px" }}>
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div style={{ marginBottom: "18px" }}>
          <label style={{
            display: "block", fontSize: "11px", fontWeight: 500,
            color: "var(--muted-dark)", letterSpacing: "0.06em",
            textTransform: "uppercase", marginBottom: "6px",
          }}>
            Password
          </label>
          <input
            {...register("password")}
            type="password"
            placeholder="••••••••"
            style={{
              width: "100%", padding: "11px 14px",
              background: "white",
              border: `1px solid ${errors.password ? "#E24B4A" : "var(--sand)"}`,
              borderRadius: "10px",
              fontSize: "14px", color: "var(--espresso)",
              fontFamily: "'DM Sans', sans-serif",
              boxSizing: "border-box",
              outline: "none",
            }}
          />
          {errors.password && (
            <p style={{ fontSize: "12px", color: "#E24B4A", marginTop: "4px" }}>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%", padding: "13px",
            background: loading ? "var(--muted)" : "var(--espresso)",
            color: "var(--sand-light)",
            border: "none", borderRadius: "10px",
            fontSize: "14px", fontWeight: 500,
            fontFamily: "'DM Sans', sans-serif",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            marginTop: "8px",
          }}
        >
          {loading ? "Signing in..." : "Sign in →"}
        </button>
      </form>
    </div>
  )
}
