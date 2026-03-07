import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session')?.value

    if (sessionToken) {
      await pool.query('DELETE FROM sessions WHERE token = ?', [sessionToken])
    }
  } catch (error) {
    console.error('Logout error:', error)
  }

  const response = NextResponse.json({ message: 'Logged out' })
  response.cookies.delete('session')
  return response
}
