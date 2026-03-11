'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { AuthProvider, useAuth } from '@/lib/auth-context'
import { AlertCircle, CheckCircle, ChevronLeft } from 'lucide-react'
import { DatePickerWithRange } from '@/components/date-range-picker'
import { DateRange } from 'react-day-picker'
import { addDays, differenceInDays } from 'date-fns'

function BookingContent() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { user, isLoading: isAuthLoading } = useAuth()

  const carId = params.id as string
  
  const initialDateStr = searchParams.get('date')
  const initialDate = initialDateStr ? new Date(initialDateStr) : new Date()
  const initialDays = parseInt(searchParams.get('days') || '1')

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: initialDate,
    to: addDays(initialDate, initialDays),
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [carDetails, setCarDetails] = useState<any>(null)
  const [isCarLoading, setIsCarLoading] = useState(true)

  // Derived state
  const days = dateRange?.from && dateRange?.to 
    ? Math.max(1, differenceInDays(dateRange.to, dateRange.from))
    : 1
  
  const date = dateRange?.from 
    ? dateRange.from.toISOString().split('T')[0] 
    : new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (isAuthLoading) return
    
    // Agencies cannot book cars
    if (user && user.type === 'agency') {
      router.push('/')
      return
    }

    const fetchCar = async () => {
      try {
        const res = await fetch('/api/cars')
        if (!res.ok) throw new Error('Failed to fetch car details')
        const cars = await res.json()
        const car = cars.find((c: any) => c.id === carId)
        if (car) {
          setCarDetails(car)
        } else {
          setError('Car not found')
        }
      } catch (err) {
        console.error(err)
        setError('Failed to fetch car details')
      } finally {
        setIsCarLoading(false)
      }
    }

    fetchCar()
  }, [user, isAuthLoading, carId, router])

  const handleBooking = async () => {
    if (!user) {
      const callbackUrl = encodeURIComponent(window.location.href)
      router.push(`/login?type=customer&callbackUrl=${callbackUrl}`)
      return
    }

    if (!dateRange?.from || !dateRange?.to) {
      setError('Please select a valid date range.')
      return
    }

    setError('')
    setIsLoading(true)

    try {
      const endDate = dateRange.to.toISOString().split('T')[0]

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carId,
          startDate: date,
          endDate: endDate,
          numberOfDays: days,
        }),
      })

      if (!res.ok) throw new Error('Booking failed')
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed')
    } finally {
      setIsLoading(false)
    }
  }

  if (isAuthLoading || isCarLoading) {
    return <div className="text-center py-12 text-gray-500">Loading details...</div>
  }

  if (!carDetails && error) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="flex gap-2 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-white border rounded-2xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-500 mb-8">Your vehicle is ready for pickup.</p>
          
          <div className="bg-gray-50 rounded-xl p-6 text-left space-y-4 mb-8">
            <h3 className="font-semibold text-gray-900 border-b pb-2 mb-4">Summary</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <div>
                    <p className="text-gray-500 mb-1">Vehicle</p>
                    <p className="font-semibold text-gray-900">{carDetails.model}</p>
                </div>
                <div>
                    <p className="text-gray-500 mb-1">License Plate</p>
                    <p className="font-semibold text-gray-900">{carDetails.number}</p>
                </div>
                <div>
                    <p className="text-gray-500 mb-1">Start Date</p>
                    <p className="font-semibold text-gray-900">{date}</p>
                </div>
                <div>
                    <p className="text-gray-500 mb-1">Duration</p>
                    <p className="font-semibold text-gray-900">{days} Days</p>
                </div>
            </div>
            <div className="border-t pt-4 mt-2 flex justify-between items-center">
                <p className="text-gray-500 font-medium">Total Paid</p>
                <p className="text-2xl font-bold text-gray-900">${carDetails.rentPerDay * days}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/customer/bookings" className="flex-1">
              <button className="w-full bg-black text-white font-semibold py-3 rounded-xl hover:bg-gray-800 transition-colors">
                View My Bookings
              </button>
            </Link>
            <Link href="/cars" className="flex-1">
              <button className="w-full bg-white text-black border border-gray-200 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors">
                Back to Garage
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <button onClick={() => router.back()} className="flex items-center text-sm font-medium text-gray-500 hover:text-black mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back
      </button>

      <div className="bg-white border rounded-2xl shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Confirm your booking</h2>
        
        {error && (
          <div className="flex gap-3 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="font-semibold text-sm">{error}</p>
          </div>
        )}

        <div className="mb-6 space-y-2">
            <label className="text-sm font-bold text-gray-900">Select Booking Window</label>
            <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />
        </div>

        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-8 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
                <div>
                    <h3 className="font-bold text-lg text-gray-900">{carDetails.model}</h3>
                    <p className="text-sm text-gray-500 mt-1">{carDetails.seatingCapacity} Seater</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-lg text-gray-900">${carDetails.rentPerDay}</p>
                    <p className="text-xs text-gray-500">per day</p>
                </div>
            </div>

            <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Start Date</span>
                    <span className="font-medium text-gray-900">{date}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Duration</span>
                    <span className="font-medium text-gray-900">{days} Days</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Rate setup</span>
                    <span className="font-medium text-gray-900">${carDetails.rentPerDay} × {days}</span>
                </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center">
                <span className="font-bold text-gray-900">Total Price</span>
                <span className="text-2xl font-bold text-black">
                    ${carDetails.rentPerDay * days}
                </span>
            </div>
        </div>

        <button
            onClick={handleBooking}
            disabled={isLoading || (!!user && (!dateRange?.from || !dateRange?.to))}
            className="w-full bg-black text-white font-semibold py-4 rounded-xl text-lg hover:bg-gray-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {isLoading ? 'Processing...' : user ? 'Confirm Booking' : 'Sign in to Book'}
        </button>
      </div>
    </div>
  )
}

export default function BookingPage() {
  return (
    <AuthProvider>
      <Navbar />
      <main className="min-h-screen bg-[#F8F9FA] pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BookingContent />
        </div>
      </main>
    </AuthProvider>
  )
}
