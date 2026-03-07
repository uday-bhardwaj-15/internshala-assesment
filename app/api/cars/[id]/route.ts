import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { model, number, seatingCapacity, rentPerDay } = await request.json()

    const sessionToken = request.cookies.get('session')?.value
    if (!sessionToken) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const [userRows]: any = await pool.query(
      `SELECT u.id, u.type FROM users u JOIN sessions s ON u.id = s.user_id WHERE s.token = ? AND s.expires_at > NOW() AND u.type = 'agency'`,
      [sessionToken]
    )
    if (userRows.length === 0) return NextResponse.json({ message: 'Unauthorized agency access' }, { status: 403 })
    const agencyId = userRows[0].id

    // Check if the car belongs to this agency
    const [carRows]: any = await pool.query('SELECT agency_id FROM cars WHERE id = ?', [id])
    if (carRows.length === 0) return NextResponse.json({ message: 'Car not found' }, { status: 404 })
    if (carRows[0].agency_id !== agencyId) return NextResponse.json({ message: 'Unauthorized access to this car' }, { status: 403 })

    await pool.query(
      'UPDATE cars SET model = ?, vehicle_number = ?, seating_capacity = ?, rent_per_day = ? WHERE id = ?',
      [model, number, seatingCapacity, rentPerDay, id]
    )

    const updatedCar = {
      id,
      model,
      number,
      seatingCapacity,
      rentPerDay,
      agencyId,
      available: true,
    }

    return NextResponse.json(updatedCar)
  } catch (error) {
    console.error('Error updating car:', error)
    return NextResponse.json({ message: 'Failed to update car' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const sessionToken = request.cookies.get('session')?.value
    if (!sessionToken) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const [userRows]: any = await pool.query(
      `SELECT u.id, u.type FROM users u JOIN sessions s ON u.id = s.user_id WHERE s.token = ? AND s.expires_at > NOW() AND u.type = 'agency'`,
      [sessionToken]
    )
    if (userRows.length === 0) return NextResponse.json({ message: 'Unauthorized agency access' }, { status: 403 })
    const agencyId = userRows[0].id

    // Check if the car belongs to this agency
    const [carRows]: any = await pool.query('SELECT agency_id FROM cars WHERE id = ?', [id])
    if (carRows.length === 0) return NextResponse.json({ message: 'Car not found' }, { status: 404 })
    if (carRows[0].agency_id !== agencyId) return NextResponse.json({ message: 'Unauthorized access to this car' }, { status: 403 })

    await pool.query('DELETE FROM cars WHERE id = ?', [id])

    return NextResponse.json({ message: 'Car deleted' })
  } catch (error) {
    console.error('Error deleting car:', error)
    return NextResponse.json({ message: 'Failed to delete car' }, { status: 500 })
  }
}
