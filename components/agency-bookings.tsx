'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'
import { AlertCircle, Calendar, DollarSign, User, CalendarCheck2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Booking {
  id: string
  carId: string
  customerId: string
  startDate: string
  endDate: string
  numberOfDays: number
  totalPrice: number
  status: string
}

export function AgencyBookings() {
  const router = useRouter()
  const { user, isLoading: isAuthLoading } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAuthLoading) return
    if (!user || user.type !== 'agency') {
      router.push('/login?type=agency')
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
    return <div className="text-center py-12 text-gray-500">Loading bookings...</div>
  }

  return (
    <div className="space-y-6">
      <div className="mb-8 border-b pb-6">
        <h2 className="text-3xl font-bold text-gray-900">Active Bookings</h2>
        <p className="text-gray-500 text-sm mt-1">Review customer bookings for your fleet</p>
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
          <p className="text-gray-500 text-lg font-medium">No active bookings detected</p>
        </div>
      ) : (
        <div className="space-y-4 mt-8">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start border-b border-gray-100 pb-4 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Contract #{booking.id.substring(0, 8)}</h3>
                  <p className="font-mono text-sm text-gray-500 mt-1">Vehicle Match: {booking.carId}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold uppercase tracking-wider">
                  {booking.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Customer ID</p>
                  <p className="font-mono font-bold text-gray-900">{booking.customerId.substring(0, 8)}</p>
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
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /> Contract Value</p>
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
