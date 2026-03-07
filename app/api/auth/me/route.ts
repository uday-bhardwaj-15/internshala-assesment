import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session')?.value

    if (!sessionToken) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
    }

    const [rows]: any = await pool.query(
      `SELECT u.id, u.email, u.name, u.type, u.agency_name 
       FROM users u
       JOIN sessions s ON u.id = s.user_id
       WHERE s.token = ? AND s.expires_at > NOW()`,
      [sessionToken]
    )

    if (rows.length === 0) {
      return NextResponse.json({ message: 'Invalid or expired session' }, { status: 401 })
    }

    const userRecord = rows[0]
    
    const user = {
      id: userRecord.id,
      email: userRecord.email,
      name: userRecord.name,
      type: userRecord.type,
      ...(userRecord.type === 'agency' && { agencyName: userRecord.agency_name }),
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
