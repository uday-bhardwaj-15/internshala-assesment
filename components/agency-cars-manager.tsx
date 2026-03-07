'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth-context'
import { AlertCircle, Trash2, Edit2, Plus, Car } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface CarItem {
  id: string
  model: string
  number: string
  seatingCapacity: number
  rentPerDay: number
  agencyId: string
  available: boolean
}

export function AgencyCarsManager() {
  const router = useRouter()
  const { user, isLoading: isAuthLoading } = useAuth()
  const [cars, setCars] = useState<CarItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    model: '',
    number: '',
    seatingCapacity: '',
    rentPerDay: '',
  })

  useEffect(() => {
    if (isAuthLoading) return
    if (!user || user.type !== 'agency') {
      router.push('/login?type=agency')
      return
    }
    fetchCars()
  }, [user, isAuthLoading, router])

  const fetchCars = async () => {
    try {
      const res = await fetch('/api/cars')
      if (!res.ok) throw new Error('Failed to fetch cars')
      const data = await res.json()
      setCars(data)
    } catch (err) {
      setError('Failed to load cars')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const payload = {
        ...formData,
        seatingCapacity: parseInt(formData.seatingCapacity),
        rentPerDay: parseFloat(formData.rentPerDay),
        agencyId: user?.id,
      }

      if (editingId) {
        const res = await fetch(`/api/cars/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Failed to update car')
        const updatedCar = await res.json()
        setCars((prev) =>
          prev.map((car) => (car.id === editingId ? updatedCar : car))
        )
        setEditingId(null)
      } else {
        const res = await fetch('/api/cars', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Failed to add car')
        const newCar = await res.json()
        setCars((prev) => [...prev, newCar])
      }

      setFormData({
        model: '',
        number: '',
        seatingCapacity: '',
        rentPerDay: '',
      })
      setShowAddForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save car')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this car?')) return

    try {
      const res = await fetch(`/api/cars/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete car')
      setCars((prev) => prev.filter((car) => car.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete car')
    }
  }

  const handleEdit = (car: CarItem) => {
    setFormData({
      model: car.model,
      number: car.number,
      seatingCapacity: car.seatingCapacity.toString(),
      rentPerDay: car.rentPerDay.toString(),
    })
    setEditingId(car.id)
    setShowAddForm(true)
  }

  if (isAuthLoading || isLoading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">My Garage</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your fleet and add new vehicles</p>
        </div>
        {!showAddForm && (
          <button onClick={() => setShowAddForm(true)} className="bg-black text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Vehicle
          </button>
        )}
      </div>

      {error && (
        <div className="flex gap-2 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {showAddForm && (
        <div className="bg-white border rounded-2xl p-6 shadow-sm mb-8">
          <h3 className="text-xl font-bold mb-6 text-gray-900 border-b pb-4">
            {editingId ? 'Edit Vehicle Details' : 'Add New Vehicle'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Vehicle Model</label>
                <input
                  name="model"
                  placeholder="e.g., Toyota Camry"
                  value={formData.model}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-50 border border-gray-200 text-black p-3 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">License Plate Number</label>
                <input
                  name="number"
                  placeholder="e.g., ABC-1234"
                  value={formData.number}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-50 border border-gray-200 text-black p-3 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-all uppercase"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Seating Capacity</label>
                <input
                  type="number"
                  name="seatingCapacity"
                  placeholder="5"
                  value={formData.seatingCapacity}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-50 border border-gray-200 text-black p-3 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Rent per Day ($)</label>
                <input
                  type="number"
                  name="rentPerDay"
                  placeholder="50"
                  value={formData.rentPerDay}
                  onChange={handleChange}
                  step="0.01"
                  required
                  className="w-full bg-gray-50 border border-gray-200 text-black p-3 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button type="submit" className="bg-black text-white px-8 py-2.5 rounded-xl font-semibold hover:bg-gray-800 transition-colors">
                {editingId ? 'Save Changes' : 'Add Vehicle'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false)
                  setEditingId(null)
                  setFormData({ model: '', number: '', seatingCapacity: '', rentPerDay: '' })
                }}
                className="px-8 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {cars.length === 0 ? (
        <div className="text-center py-20 bg-white border rounded-2xl border-dashed mt-8">
            <Car className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-lg font-medium">You haven't added any vehicles yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {cars.map((car) => (
            <div key={car.id} className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4 border-b pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{car.model}</h3>
                    <p className="text-gray-500 font-mono text-sm mt-1">{car.number}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${car.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {car.available ? 'Available' : 'Rented'}
                  </span>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Capacity</span>
                  <span className="font-semibold text-gray-900">{car.seatingCapacity} Seats</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Rate setup</span>
                  <span className="font-semibold text-gray-900">${car.rentPerDay} / day</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleEdit(car)}
                  className="flex-1 flex justify-center items-center gap-1.5 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-semibold"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(car.id)}
                  className="flex-1 flex justify-center items-center gap-1.5 py-2 rounded-lg border border-red-100 text-red-600 hover:bg-red-50 transition-colors text-sm font-semibold"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
