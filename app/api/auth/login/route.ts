import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const { email, password, type } = await request.json()

    if (!email || !password || !type) {
      return NextResponse.json({ message: 'Missing credentials' }, { status: 400 })
    }

    const [rows]: any = await pool.query(
      'SELECT * FROM users WHERE email = ? AND type = ?',
      [email, type]
    )

    if (rows.length === 0) {
      return NextResponse.json({ message: 'Invalid credentials or user type' }, { status: 401 })
    }

    const userRecord = rows[0]
    const isPasswordValid = await bcrypt.compare(password, userRecord.password_hash)

    if (!isPasswordValid) {
       return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    const sessionToken = uuidv4()
    const sessionId = uuidv4()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    await pool.query(
      'INSERT INTO sessions (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)',
      [sessionId, userRecord.id, sessionToken, expiresAt]
    )

    const user = {
      id: userRecord.id,
      email: userRecord.email,
      name: userRecord.name,
      type: userRecord.type,
      ...(userRecord.type === 'agency' && { agencyName: userRecord.agency_name }),
    }

    const response = NextResponse.json(user)
    
    // Set secure HTTP-only cookie
    response.cookies.set({
      name: 'session',
      value: sessionToken,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60,
    })
    
    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ message: 'Login failed' }, { status: 500 })
  }
}
