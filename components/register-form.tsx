'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { AlertCircle, UserPlus } from 'lucide-react'

export function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { register } = useAuth()
  const userType = (searchParams.get('type') as 'customer' | 'agency') || 'customer'

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    agencyName: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (!formData.email || !formData.password || !formData.name) {
        throw new Error('Please fill in all fields')
      }
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match')
      }
      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters')
      }
      if (userType === 'agency' && !formData.agencyName) {
        throw new Error('Agency name is required')
      }

      await register(
        formData.email,
        formData.password,
        formData.name,
        userType,
        userType === 'agency' ? formData.agencyName : undefined
      )

      const callbackUrl = searchParams.get('callbackUrl')
      router.push(callbackUrl || (userType === 'agency' ? '/agency/cars' : '/'))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16 relative overflow-hidden text-gray-900">
      
      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-10">
          <UserPlus className="w-12 h-12 text-black mx-auto mb-4" />
          <h1 className="text-3xl font-bold tracking-tight">
            {userType === 'agency' ? 'Agency Registration' : 'Customer Registration'}
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            {userType === 'agency'
              ? 'Partner with us to rent your vehicles'
              : 'Create an account to start booking'}
          </p>
        </div>

        <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm">
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex gap-3 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="font-semibold text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                {userType === 'agency' ? 'Contact Name' : 'Full Name'}
              </label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full bg-gray-50 border border-gray-200 text-black p-3 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
              />
            </div>

            {userType === 'agency' && (
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Agency Name</label>
                <input
                  type="text"
                  name="agencyName"
                  placeholder="Apex Rentals"
                  value={formData.agencyName}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full bg-gray-50 border border-gray-200 text-black p-3 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full bg-gray-50 border border-gray-200 text-black p-3 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full bg-gray-50 border border-gray-200 text-black p-3 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full bg-gray-50 border border-gray-200 text-black p-3 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-black text-white rounded-lg py-3 font-semibold mt-4 hover:bg-gray-800 transition-colors">
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>

            <div className="text-center text-sm text-gray-500 pt-6">
              Already have an account?{' '}
              <Link
                href={`/login?type=${userType}${searchParams.get('callbackUrl') ? `&callbackUrl=${encodeURIComponent(searchParams.get('callbackUrl')!)}` : ''}`}
                className="text-black font-semibold hover:underline"
              >
                Sign in
              </Link>
            </div>

            <div className="text-center text-sm pt-4 border-t border-gray-100">
              {userType === 'customer' ? (
                <>
                  <span className="text-gray-500">Registering an agency? </span>
                  <Link href="/register?type=agency" className="text-black font-semibold hover:underline">
                    Agency Registration
                  </Link>
                </>
              ) : (
                <>
                   <span className="text-gray-500">Registering as a customer? </span>
                  <Link href="/register?type=customer" className="text-black font-semibold hover:underline">
                    Customer Registration
                  </Link>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
