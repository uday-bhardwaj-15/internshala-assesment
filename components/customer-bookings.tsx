'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { AlertCircle, Calendar, DollarSign, Car, CalendarCheck2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Booking {
  id: string
  carId: string
  customerId: string
  startDate: string
  endDate: string
  numberOfDays: number
  totalPrice: number
  status: string
  agencyName?: string
}

export function CustomerBookings() {
  const router = useRouter()
  const { user, isLoading: isAuthLoading } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAuthLoading) return
    if (!user || user.type !== 'customer') {
      router.push('/login?type=customer')
      return
    }
    fetchBookings()
  }, [user, isAuthLoading, router])

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings')
      if (!res.ok) throw new Error('Failed to fetch bookings')
      const data = await res.json()
      setBookings(data)
    } catch (err) {
      setError('Failed to load bookings')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isAuthLoading || isLoading) {
    return <div className="text-center py-12 text-gray-500">Loading your bookings...</div>
  }

  return (
    <div className="space-y-6">
      <div className="mb-8 border-b pb-6">
        <h2 className="text-3xl font-bold text-gray-900">My Bookings</h2>
        <p className="text-gray-500 text-sm mt-1">View and manage your past and active rentals</p>
      </div>

      {error && (
        <div className="flex gap-2 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="font-semibold text-sm">{error}</p>
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="text-center py-24 bg-white border border-dashed rounded-2xl flex flex-col items-center justify-center">
          <CalendarCheck2 className="w-12 h-12 text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg font-medium mb-4">You have no active bookings</p>
          <Link
            href="/cars"
            className="text-white bg-black hover:bg-gray-800 px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            Browse Garage
          </Link>
        </div>
      ) : (
        <div className="space-y-6 mt-8">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row justify-between items-start border-b border-gray-100 pb-4 mb-4 gap-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Booking #{booking.id.substring(0, 8)}</h3>
                  <p className="font-mono text-sm text-gray-500 mt-1">Car Reference: {booking.carId}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold uppercase tracking-wider">
                    {booking.status}
                  </span>
                  {booking.agencyName && (
                    <span className="text-xs text-gray-500 font-medium bg-gray-50 px-2 py-1 border rounded-md uppercase">
                      Agency: <span className="text-gray-900">{booking.agencyName}</span>
                    </span>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"><Car className="w-3.5 h-3.5" /> Vehicle</p>
                  <p className="font-bold text-gray-900">Ref {booking.carId.substring(0,4)}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Duration</p>
                  <p className="font-bold text-gray-900">{booking.numberOfDays} Days</p>
                </div>

                <div className="space-y-1">
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Start Date</p>
                  <p className="font-bold text-gray-900">{booking.startDate.substring(5)}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /> Total Paid</p>
                  <p className="font-bold text-xl text-black">${booking.totalPrice}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
