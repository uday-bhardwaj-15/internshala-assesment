'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Heart, Star, MapPin, Car, ChevronLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface CarItem {
  id: string
  model: string
  number: string
  seatingCapacity: number
  rentPerDay: number
  agencyId: string
  agencyName?: string
  available: boolean
}

const carImages = [
  '/images/nfs_car_1_1772865619857.png',
  '/images/nfs_car_2_1772865638008.png',
  '/images/nfs_hero_car_1772865584821.png',
]

export function FavoritesListing() {
  const router = useRouter()
  const { user, isLoading: isAuthLoading } = useAuth()
  const [cars, setCars] = useState<CarItem[]>([])
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('carrent_favorites')
    if (saved) {
      try {
        setFavoriteIds(JSON.parse(saved))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch('/api/cars')
        if (!res.ok) throw new Error('Failed to fetch cars')
        const data = await res.json()
        setCars(data)
      } catch (err) {
        console.error('Failed to load cars.', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCars()
  }, [])

  const toggleFavorite = (e: React.MouseEvent, carId: string) => {
    e.stopPropagation()
    setFavoriteIds(prev => {
      const isFav = prev.includes(carId)
      const next = isFav ? prev.filter(id => id !== carId) : [...prev, carId]
      localStorage.setItem('carrent_favorites', JSON.stringify(next))
      return next
    })
  }

  const handleBookClick = (carId: string) => {
    if (!user) {
      router.push('/login?type=customer')
      return
    }
    if (user.type === 'agency') {
      alert('Agencies cannot book cars.')
      return
    }
    router.push(`/booking/${carId}?days=1&date=${new Date().toISOString().split('T')[0]}`)
  }

  if (isAuthLoading || isLoading) {
    return <div className="text-center py-12 text-gray-500">Loading your favorites...</div>
  }

  const favoriteCars = cars.filter(car => favoriteIds.includes(car.id))

  return (
    <div className="space-y-6">
      <div className="mb-8 border-b pb-6">
        <button onClick={() => router.back()} className="flex items-center text-sm font-medium text-gray-500 hover:text-black mb-4 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </button>
        <h2 className="text-3xl font-bold text-gray-900">My Favorites</h2>
        <p className="text-gray-500 text-sm mt-1">Vehicles you have saved for later</p>
      </div>

      {favoriteCars.length === 0 ? (
        <div className="text-center py-24 bg-white border border-dashed rounded-2xl flex flex-col items-center justify-center">
          <Heart className="w-12 h-12 text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg font-medium mb-4">You have no saved vehicles</p>
          <Link
            href="/cars"
            className="text-white bg-black hover:bg-gray-800 px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            Browse Garage
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteCars.map((car, i) => (
            <div 
                key={car.id} 
                className="group rounded-2xl bg-white p-5 shadow-sm transition-all hover:shadow-md border border-gray-200"
            >
              <div className="mb-4 flex items-center justify-between text-xs text-gray-500 font-medium">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  <span>120m</span>
                  <span className="mx-1">•</span>
                  <div className="flex items-center text-yellow-500">
                    <Star className="h-3 w-3 fill-current mr-1" />
                    <span className="text-black font-semibold">4.7</span>
                  </div>
                </div>
                <button 
                  onClick={(e) => toggleFavorite(e, car.id)}
                  className="transition-colors text-red-500"
                >
                  <Heart className="h-5 w-5 fill-current" />
                </button>
              </div>

              <div className="relative mb-6 h-32 w-full cursor-pointer" onClick={() => handleBookClick(car.id)}>
                <Image
                  src={carImages[cars.findIndex(c => c.id === car.id) % carImages.length]}
                  alt={car.model}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="flex items-end justify-between border-t border-gray-100 pt-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">{car.model}</h3>
                  <p className="text-xs text-gray-500 mt-1">{car.seatingCapacity} Seater • {car.agencyName || 'Agency'}</p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <p className="text-lg font-bold text-black mb-1">${car.rentPerDay}<span className="text-xs font-normal text-gray-500"> / day</span></p>
                  <button 
                    onClick={() => handleBookClick(car.id)}
                    className="bg-black text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Book
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
