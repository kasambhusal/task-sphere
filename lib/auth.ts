import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify, SignJWT } from 'jose'
import bcrypt from 'bcryptjs'
import prisma from './prisma'

// Secret key for JWT signing - in production, use a proper secret management system
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-at-least-32-characters-long'
)

export interface UserJwtPayload {
  id: string
  email: string
  name: string | null
}

// Hash a password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

// Compare a password with a hash
export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Create a JWT token
export async function createToken(payload: UserJwtPayload): Promise<string> {
  return new SignJWT({ ...payload } as import('jose').JWTPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // Token expires in 7 days
    .sign(JWT_SECRET)
}

// Verify a JWT token
export async function verifyToken(token: string): Promise<UserJwtPayload> {
  const { payload } = await jwtVerify(token, JWT_SECRET)
  return payload as unknown as UserJwtPayload
}

// Set the auth cookie
export function setAuthCookie(token: string): void {
  cookies().set({
    name: 'auth-token',
    value: token,
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'strict',
  })
}

// Clear the auth cookie
export function clearAuthCookie(): void {
  cookies().set({
    name: 'auth-token',
    value: '',
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    sameSite: 'strict',
  })
}

// Get the current user from the request
export async function getCurrentUser(): Promise<UserJwtPayload | null> {
  const cookieStore = cookies()
  const token = cookieStore.get('auth-token')

  if (!token) {
    return null
  }

  try {
    return await verifyToken(token.value)
  } catch (error) {
    return null
  }
}

// Middleware to check if user is authenticated
export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('auth-token')?.value

  if (!token) {
    return false
  }

  try {
    await verifyToken(token)
    return true
  } catch (error) {
    return false
  }
}
