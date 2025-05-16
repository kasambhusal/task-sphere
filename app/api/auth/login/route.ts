import { type NextRequest, NextResponse } from "next/server"
import { comparePasswords, createToken, setAuthCookie } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { z } from "zod"

// Validation schema for login
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const result = loginSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 })
    }

    const { email, password } = result.data

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Check the password
    const passwordValid = await comparePasswords(password, user.password)

    if (!passwordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Create a token
    const token = await createToken({
      id: user.id,
      email: user.email,
      name: user.name,
    })

    // Set the auth cookie
    setAuthCookie(token)

    // Return the user (without password)
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "An error occurred during login" }, { status: 500 })
  }
}
