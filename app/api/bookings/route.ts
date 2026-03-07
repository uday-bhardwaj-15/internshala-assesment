import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session')?.value
    if (!sessionToken) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const [userRows]: any = await pool.query(
      `SELECT u.id, u.type FROM users u JOIN sessions s ON u.id = s.user_id WHERE s.token = ? AND s.expires_at > NOW()`,
      [sessionToken]
    )
    if (userRows.length === 0) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    
    const user = userRows[0]

    let query = ''
    let params: any[] = []

    if (user.type === 'agency') {
      query = `
        SELECT b.*, c.model, c.vehicle_number, u.name as customer_name
        FROM bookings b 
        JOIN cars c ON b.car_id = c.id 
        JOIN users u ON b.customer_id = u.id
        WHERE c.agency_id = ?
        ORDER BY b.created_at DESC`
      params = [user.id]
    } else {
      query = `
        SELECT b.*, c.model, c.vehicle_number, u.agency_name, u.name as operator_name
        FROM bookings b 
        JOIN cars c ON b.car_id = c.id 
        JOIN users u ON c.agency_id = u.id
        WHERE b.customer_id = ?
        ORDER BY b.created_at DESC`
      params = [user.id]
    }

    const [bookingRows]: any = await pool.query(query, params)
    
    const formattedBookings = bookingRows.map((b: any) => ({
      id: b.id,
      carId: b.car_id,
      customerId: b.customer_id,
      startDate: b.start_date.toISOString().split('T')[0],
      endDate: b.end_date.toISOString().split('T')[0],
      numberOfDays: b.number_of_days,
      totalPrice: Number(b.total_price),
      status: b.status,
      car: {
        model: b.model,
        number: b.vehicle_number
      },
      customerName: b.customer_name,
      agencyName: b.agency_name || b.operator_name
    }))

    return NextResponse.json(formattedBookings)
  } catch(error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json({ message: 'Error fetching bookings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session')?.value
    if (!sessionToken) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const [userRows]: any = await pool.query(
      `SELECT u.id, u.type FROM users u JOIN sessions s ON u.id = s.user_id WHERE s.token = ? AND s.expires_at > NOW() AND u.type = 'customer'`,
      [sessionToken]
    )
    if (userRows.length === 0) return NextResponse.json({ message: 'Unauthorized customer access' }, { status: 403 })
    
    const customerId = userRows[0].id
    const { carId, startDate, endDate, numberOfDays } = await request.json()

    // check car availability and price
    const [carRows]: any = await pool.query('SELECT rent_per_day, available FROM cars WHERE id = ?', [carId])
    if (carRows.length === 0) return NextResponse.json({ message: 'Car not found' }, { status: 404 })
    if (carRows[0].available !== 1) return NextResponse.json({ message: 'Car is not available' }, { status: 400 })

    const rentPerDay = Number(carRows[0].rent_per_day)
    const totalPrice = rentPerDay * numberOfDays

    const bookingId = uuidv4()

    await pool.query(
      'INSERT INTO bookings (id, car_id, customer_id, start_date, end_date, number_of_days, total_price, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [bookingId, carId, customerId, startDate, endDate, numberOfDays, totalPrice, 'confirmed']
    )

    const newBooking = {
      id: bookingId,
      carId,
      customerId,
      startDate,
      endDate,
      numberOfDays,
      totalPrice,
      status: 'confirmed',
    }

    return NextResponse.json(newBooking, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json({ message: 'Failed to create booking' }, { status: 500 })
  }
}
