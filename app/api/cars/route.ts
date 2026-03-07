import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'

export async function GET() {
  try {
    const [rows]: any = await pool.query(`
      SELECT c.*, u.agency_name, u.name as user_name 
      FROM cars c 
      JOIN users u ON c.agency_id = u.id 
      WHERE c.available = true
    `)
    const formattedCars = rows.map((car: any) => ({
      id: car.id,
      model: car.model,
      number: car.vehicle_number,
      seatingCapacity: car.seating_capacity,
      rentPerDay: Number(car.rent_per_day),
      agencyId: car.agency_id,
      agencyName: car.agency_name || car.user_name,
      available: car.available === 1
    }))
    
    return NextResponse.json(formattedCars)
  } catch(error) {
    console.error('Error fetching cars:', error)
    return NextResponse.json({ message: 'Error fetching cars' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session')?.value
    if (!sessionToken) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    // Check user is agency
    const [userRows]: any = await pool.query(
      `SELECT u.id, u.type FROM users u JOIN sessions s ON u.id = s.user_id WHERE s.token = ? AND s.expires_at > NOW() AND u.type = 'agency'`,
      [sessionToken]
    )
    if (userRows.length === 0) return NextResponse.json({ message: 'Unauthorized agency access' }, { status: 403 })
    
    const agencyId = userRows[0].id

    const { model, number, seatingCapacity, rentPerDay } = await request.json()
    const carId = uuidv4()

    await pool.query(
      'INSERT INTO cars (id, agency_id, model, vehicle_number, seating_capacity, rent_per_day, available) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [carId, agencyId, model, number, seatingCapacity, rentPerDay, true]
    )

    const newCar = {
      id: carId,
      model,
      number,
      seatingCapacity,
      rentPerDay,
      agencyId,
      available: true,
    }

    return NextResponse.json(newCar, { status: 201 })
  } catch (error: any) {
    console.error('Error creating car:', error)
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ message: 'Vehicle number already exists' }, { status: 409 })
    }
    return NextResponse.json({ message: 'Failed to create car' }, { status: 500 })
  }
}
