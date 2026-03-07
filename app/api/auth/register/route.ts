import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, type, agencyName } = await request.json()

    // Validation
    if (!email || !password || !name || !type) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    if (type === 'agency' && !agencyName) {
      return NextResponse.json({ message: 'Agency name required' }, { status: 400 })
    }

    const userId = uuidv4()
    const passwordHash = await bcrypt.hash(password, 10)

    await pool.query(
      'INSERT INTO users (id, email, password_hash, name, type, agency_name) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, email, passwordHash, name, type, type === 'agency' ? agencyName : null]
    )

    const sessionToken = uuidv4()
    const sessionId = uuidv4()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    await pool.query(
      'INSERT INTO sessions (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)',
      [sessionId, userId, sessionToken, expiresAt]
    )

    const user = {
      id: userId,
      email,
      name,
      type,
      ...(type === 'agency' && { agencyName }),
    }

    const response = NextResponse.json(user, { status: 201 })
    
    // Set secure HTTP-only cookie with session token
    response.cookies.set({
      name: 'session',
      value: sessionToken,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })
    
    return response
  } catch (error: any) {
    console.error('Registration error:', error)
    if (error.code === 'ER_DUP_ENTRY') {
       return NextResponse.json({ message: 'Email already exists' }, { status: 409 })
    }
    return NextResponse.json({ message: 'Registration failed' }, { status: 500 })
  }
}
