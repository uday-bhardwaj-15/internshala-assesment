'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Heart, Star, Search, MapPin, ChevronDown, Check, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface Car {
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

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Slider } from '@/components/ui/slider'
import { Filter, Clock, CheckCircle2, XCircle } from 'lucide-react'

// Put FiltersContent inside CarsListing or above it (but above avoids re-creating it).
// But it needs states (selectedSeats, toggleSeatFilter), so I'll create it right inside or pass props.

function FiltersContent({ 
  selectedSeats, 
  toggleSeatFilter, 
  rentalType, 
  setRentalType,
  availableOnly,
  setAvailableOnly,
  priceRange,
  setPriceRange,
  onReset
}: { 
  selectedSeats: number[], 
  toggleSeatFilter: (s: number) => void,
  rentalType: 'any' | 'day' | 'hour',
  setRentalType: (t: 'any' | 'day' | 'hour') => void,
  availableOnly: boolean,
  setAvailableOnly: (a: boolean) => void,
  priceRange: [number, number],
  setPriceRange: (r: [number, number]) => void,
  onReset: () => void
}) {
  return (
    <>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Filter by</h2>
          <button onClick={onReset} className="text-sm text-gray-400 hover:text-black transition-colors">Reset all ✕</button>
        </div>

        <div className="space-y-8">
          {/* Rental Type */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rental Type</h3>
            <div className="flex rounded-lg border bg-gray-50/50 p-1">
              <button 
                onClick={() => setRentalType('any')}
                className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-all ${rentalType === 'any' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Any
              </button>
              <button 
                onClick={() => setRentalType('day')}
                className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-all ${rentalType === 'day' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Per day
              </button>
              <button 
                onClick={() => setRentalType('hour')}
                className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-all ${rentalType === 'hour' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Per hour
              </button>
            </div>
          </div>

          <div 
            className="flex items-center justify-between cursor-pointer group"
            onClick={() => setAvailableOnly(!availableOnly)}
          >
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-gray-600 transition-colors">Available Now Only</span>
            <div className={`h-5 w-9 rounded-full transition-colors p-0.5 ${availableOnly ? 'bg-black' : 'bg-gray-200'}`}>
              <div className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${availableOnly ? 'translate-x-4' : ''}`} />
            </div>
          </div>

          <div className="space-y-4 border-t pt-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex justify-between">
              Price Range / {rentalType === 'hour' ? 'Hour' : 'Day'} <ChevronDown className="w-4 h-4 text-gray-300" />
            </h3>
            
            <div className="h-12 flex items-end gap-1 px-1 mb-2">
              {[4, 6, 8, 5, 3, 7, 10, 12, 11, 8, 6, 4, 3, 2].map((h, i) => {
                const step = 200 / 14
                const pos = i * step
                const isInRange = pos >= priceRange[0] && pos <= priceRange[1]
                return (
                  <div 
                    key={i} 
                    className={`flex-1 rounded-t-sm transition-colors ${isInRange ? 'bg-black' : 'bg-black/10'}`} 
                    style={{ height: `${h * 8}%` }} 
                  />
                )
              })}
            </div>

            <div className="px-2">
              <Slider
                value={priceRange}
                min={0}
                max={200}
                step={1}
                onValueChange={(v) => setPriceRange(v as [number, number])}
                className="mb-6"
              />
            </div>

            <div className="flex items-center gap-4">
                <div className="flex-1 bg-gray-50 border rounded-lg p-2 flex justify-between">
                    <span className="text-xs text-gray-400">FROM</span>
                    <span className="text-sm font-semibold">${priceRange[0]}</span>
                </div>
                <div className="flex-1 bg-gray-50 border rounded-lg p-2 flex justify-between">
                    <span className="text-xs text-gray-400">TO</span>
                    <span className="text-sm font-semibold">${priceRange[1]}</span>
                </div>
            </div>
          </div>

          <div className="space-y-4 border-t pt-6 pb-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Seats Capacity</h3>
            <div className="grid grid-cols-2 gap-3">
              {[2, 4, 5, 7].map((seats) => (
                <label 
                  key={seats} 
                  className="flex items-center gap-2 cursor-pointer group" 
                  onClick={() => toggleSeatFilter(seats)}
                >
                  <div className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${selectedSeats.includes(seats) ? 'bg-black border-black text-white' : 'border-gray-300 group-hover:border-gray-400'}`}>
                    {selectedSeats.includes(seats) && <Check className="w-3 h-3" />}
                  </div>
                  <span className={`text-sm transition-colors ${selectedSeats.includes(seats) ? 'text-black font-medium' : 'text-gray-600'}`}>
                    {seats} Seats
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
    </>
  )
}

export function CarsListing() {
  const router = useRouter()
  const { user } = useAuth()
  const [cars, setCars] = useState<Car[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null)

  // Filters State
  const [selectedSeats, setSelectedSeats] = useState<number[]>([])
  const [rentalType, setRentalType] = useState<'any' | 'day' | 'hour'>('any')
  const [availableOnly, setAvailableOnly] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200])
  const [favorites, setFavorites] = useState<string[]>([])
  const [showMap, setShowMap] = useState(true)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [detailsCar, setDetailsCar] = useState<Car | null>(null)

  const handleResetFilters = () => {
    setSelectedSeats([])
    setRentalType('any')
    setAvailableOnly(false)
    setPriceRange([0, 200])
  }

  useEffect(() => {
    const saved = localStorage.getItem('carrent_favorites')
    if (saved) {
      try {
        setFavorites(JSON.parse(saved))
      } catch (e) {}
    }
  }, [])

  const toggleFavorite = (e: React.MouseEvent, carId: string) => {
    e.stopPropagation()
    setFavorites(prev => {
      const isFav = prev.includes(carId)
      const next = isFav ? prev.filter(id => id !== carId) : [...prev, carId]
      localStorage.setItem('carrent_favorites', JSON.stringify(next))
      return next
    })
  }

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch('/api/cars')
        if (!res.ok) throw new Error('Failed to fetch cars')
        const data = await res.json()
        setCars(data)
      } catch (err) {
        setError('Failed to load cars.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchCars()
  }, [])

  const handleBookClick = (carId: string) => {
    if (!user) {
      router.push('/login?type=customer')
      return
    }
    if (user.type === 'agency') {
      alert('Agencies cannot book cars.')
      return
    }
    // Basic default booking logic for UI mockup
    router.push(`/booking/${carId}?days=1&date=${new Date().toISOString().split('T')[0]}`)
  }

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  const toggleSeatFilter = (seats: number) => {
    setSelectedSeats(prev => 
      prev.includes(seats) ? prev.filter(s => s !== seats) : [...prev, seats]
    )
  }

  const filteredCars = cars.filter(car => {
    if (selectedSeats.length > 0 && !selectedSeats.includes(car.seatingCapacity)) {
      return false
    }
    if (availableOnly && !car.available) {
      return false
    }
    const price = car.rentPerDay
    if (price < priceRange[0] || price > priceRange[1]) {
      return false
    }
    return true
  })

  return (
    <div className="flex h-[calc(100vh-4rem)] md:h-screen w-full overflow-hidden text-[#1A1D20]">
      {/* 1. Left Filters Sidebar (Desktop) */}
      <div className="hidden lg:block w-[300px] flex-shrink-0 overflow-y-auto border-r bg-white p-6 pb-24">
        <FiltersContent 
          selectedSeats={selectedSeats} 
          toggleSeatFilter={toggleSeatFilter}
          rentalType={rentalType}
          setRentalType={setRentalType}
          availableOnly={availableOnly}
          setAvailableOnly={setAvailableOnly}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          onReset={handleResetFilters}
        />
      </div>

      {/* Mobile Filters Sheet */}
      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetContent side="left" className="w-[300px] p-6 overflow-y-auto">
            <SheetTitle className="sr-only">Filters</SheetTitle>
            <FiltersContent 
              selectedSeats={selectedSeats} 
              toggleSeatFilter={toggleSeatFilter}
              rentalType={rentalType}
              setRentalType={setRentalType}
              availableOnly={availableOnly}
              setAvailableOnly={setAvailableOnly}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              onReset={handleResetFilters}
            />
        </SheetContent>
      </Sheet>

      {/* 2. Center Cars Grid */}
      <div className="flex-1 overflow-y-auto bg-[#F8F9FA] p-4 sm:p-8 pb-32 relative">
        <div className="flex justify-between items-center mb-6 z-10 sticky top-0 md:relative">
            {!showMap && (
               <button 
                 onClick={() => setShowMap(true)}
                 className="hidden md:flex bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200 font-medium text-sm hover:bg-gray-50 items-center gap-2"
               >
                 <MapPin className="w-4 h-4" /> Show map
               </button>
            )}
        </div>
        
        <div className="mb-6 flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => setMobileFiltersOpen(true)}
                    className="lg:hidden flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border text-sm font-medium shadow-sm"
                >
                    <Filter className="w-4 h-4" /> Filters
                </button>
                <h1 className="text-xl sm:text-2xl font-bold">{filteredCars.length} vehicles to rent</h1>
            </div>
            <button className="text-sm font-medium flex items-center gap-2 w-max">Closest to me <ChevronDown className="w-4 h-4" /></button>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 ${showMap ? 'xl:grid-cols-2' : 'lg:grid-cols-3 xl:grid-cols-4'} gap-4 sm:gap-6`}>
          {filteredCars.map((car, i) => (
            <div 
                key={car.id} 
                onClick={() => setDetailsCar(car)}
                className={`group cursor-pointer rounded-2xl bg-white p-5 shadow-sm transition-all hover:shadow-md border border-transparent ${selectedCarId === car.id ? 'ring-2 ring-black' : 'hover:border-gray-200'}`}
            >
              <div className="mb-4 flex items-center justify-between text-xs text-gray-500 font-medium">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  <span>120m <span className="text-gray-400 font-normal">(4 min)</span></span>
                  <span className="mx-1">•</span>
                  <div className="flex items-center text-yellow-500">
                    <Star className="h-3 w-3 fill-current mr-1" />
                    <span className="text-black font-semibold">4.7</span> <span className="text-gray-400 font-normal ml-1">(109)</span>
                  </div>
                </div>
                <button 
                  onClick={(e) => toggleFavorite(e, car.id)}
                  className={`transition-colors p-1 -m-1 ${favorites.includes(car.id) ? 'text-red-500' : 'text-gray-300 hover:text-red-500'}`}
                >
                  <Heart className={`h-5 w-5 ${favorites.includes(car.id) ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="relative mb-6 h-32 w-full transition-transform group-hover:scale-105">
                <Image
                  src={carImages[i % carImages.length]}
                  alt={car.model}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900">{car.model}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-gray-500">{car.seatingCapacity} Seater</p>
                    <span className="text-gray-300 text-[10px]">•</span>
                    <p className="text-xs text-gray-500">{car.agencyName || 'Agency'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-black">
                    ${rentalType === 'hour' ? (car.rentPerDay / 24).toFixed(2) : car.rentPerDay}
                    <span className="text-xs font-normal text-gray-500"> / {rentalType === 'hour' ? 'hour' : 'day'}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Right Map Column */}
      {showMap && (
        <div className="relative hidden w-[450px] flex-shrink-0 bg-gray-200 lg:block border-l border-gray-200">
          {/* Fake Map Background using generic map-like pattern or simple iframe */}
          <iframe 
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d13251.642958372439!2d-122.4194155!3d37.7749295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1655321307689!5m2!1sen!2sus" 
              className="w-full h-full border-0 absolute inset-0 opacity-60 mix-blend-multiply" 
              loading="lazy"
          />
          
          {/* Map Top UI */}
          <div className="absolute top-6 left-6 right-6 z-10 flex items-center gap-2">
              <div className="flex flex-1 items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm border border-gray-100">
                  <Search className="h-5 w-5 text-gray-400" />
                  <input 
                      type="text" 
                      placeholder="Search address or vehicles..." 
                      className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
                  />
              </div>
              <button onClick={() => setShowMap(false)} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 font-medium text-sm hover:bg-gray-50">
                  Hide map ✕
              </button>
          </div>

          {/* Selected Car Popup on Map */}
          {selectedCarId && filteredCars.find(c => c.id === selectedCarId) && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[240px] bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center text-xs font-bold">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500 mr-1" />
                          4.9 <span className="text-gray-400 font-normal ml-1">(189)</span>
                      </div>
                      <Heart className={`h-4 w-4 ${favorites.includes(selectedCarId) ? 'text-red-500 fill-current' : 'text-gray-300'}`} />
                  </div>
                  <div className="relative h-20 w-full mb-3">
                      <Image
                          src={carImages[filteredCars.findIndex(c => c.id === selectedCarId) % carImages.length]}
                          alt="Car"
                          fill
                          className="object-contain"
                      />
                  </div>
                  <h4 className="font-bold text-sm">{filteredCars.find(c => c.id === selectedCarId)?.model}</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5 mb-3">{filteredCars.find(c => c.id === selectedCarId)?.seatingCapacity} Seater</p>
                  <div className="flex">
                      <button 
                          onClick={() => handleBookClick(selectedCarId)}
                          className="flex-1 bg-black text-white text-sm font-semibold py-2 px-3 rounded-lg flex justify-between items-center hover:bg-gray-800 transition-colors"
                      >
                          <span>Book</span>
                          <span>${filteredCars.find(c => c.id === selectedCarId)?.rentPerDay}/d</span>
                      </button>
                  </div>
              </div>
          )}
        </div>
      )}

      {/* Car Details Modal */}
      <Dialog open={!!detailsCar} onOpenChange={(open) => !open && setDetailsCar(null)}>
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-3xl gap-0 border-none">
          <DialogTitle className="sr-only">Car Details</DialogTitle>
          {detailsCar && (
            <div className="flex flex-col">
              <div className="relative h-56 w-full bg-[#F8F9FA] p-8 flex items-center justify-center">
                <Image
                  src={carImages[cars.findIndex(c => c.id === detailsCar.id) % carImages.length]}
                  alt={detailsCar.model}
                  fill
                  className="object-contain p-4"
                />
                <button 
                  onClick={(e) => toggleFavorite(e, detailsCar.id)}
                  className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm hover:scale-110 transition-transform"
                >
                  <Heart className={`h-5 w-5 ${favorites.includes(detailsCar.id) ? 'text-red-500 fill-current' : 'text-gray-300'}`} />
                </button>
              </div>

              <div className="p-6 bg-white">
                <div className="flex items-center justify-between mb-2">
                   <h2 className="text-2xl font-bold">{detailsCar.model}</h2>
                   <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-bold">4.8</span>
                   </div>
                </div>
                
                <p className="text-gray-500 text-sm mb-6 flex items-center gap-2">
                  Managed by <span className="text-black font-semibold">{detailsCar.agencyName || 'Agency'}</span>
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">CAPACITY</p>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-bold">{detailsCar.seatingCapacity} Seater</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">AVAILABILITY</p>
                    <div className="flex items-center gap-2">
                        {detailsCar.available ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-bold">In Stock</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-red-500" />
                            <span className="text-sm font-bold">Rented</span>
                          </>
                        )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">TOTAL PRICE</p>
                    <p className="text-2xl font-black">${detailsCar.rentPerDay}<span className="text-sm font-normal text-gray-500"> / day</span></p>
                  </div>
                  <button 
                    onClick={() => handleBookClick(detailsCar.id)}
                    className="flex-[1.5] bg-black text-white font-bold py-4 rounded-2xl hover:bg-gray-800 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:bg-gray-300"
                    disabled={!detailsCar.available}
                  >
                    {detailsCar.available ? 'Book this car' : 'Not Available'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
