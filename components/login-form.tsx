'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { AlertCircle, CarFront } from 'lucide-react'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const userType = (searchParams.get('type') as 'customer' | 'agency') || 'customer'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, password, userType)
      router.push(userType === 'agency' ? '/agency/cars' : '/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 relative overflow-hidden text-gray-900">
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <CarFront className="w-12 h-12 text-black mx-auto mb-4" />
          <h1 className="text-3xl font-bold tracking-tight">
            {userType === 'agency' ? 'Agency Login' : 'Customer Login'}
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            {userType === 'agency' 
              ? 'Manage your fleet and bookings'
              : 'Book your next journey'}
          </p>
        </div>

        <div className="bg-white border p-8 rounded-2xl shadow-sm">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex gap-3 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="font-semibold text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full bg-gray-50 border border-gray-200 text-black p-3 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full bg-gray-50 border border-gray-200 text-black p-3 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
              />
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-black text-white rounded-lg py-3 font-semibold mt-4 hover:bg-gray-800 transition-colors">
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="text-center text-sm text-gray-500 pt-6">
              Don't have an account?{' '}
              <Link
                href={`/register?type=${userType}`}
                className="text-black font-semibold hover:underline"
              >
                Sign up
              </Link>
            </div>

            <div className="text-center text-sm pt-4 border-t border-gray-100">
              {userType === 'customer' ? (
                <>
                  <span className="text-gray-500">Are you an agency? </span>
                  <Link href="/login?type=agency" className="text-black font-semibold hover:underline">
                    Agency Portal
                  </Link>
                </>
              ) : (
                <>
                  <span className="text-gray-500">Are you a customer? </span>
                  <Link href="/login?type=customer" className="text-black font-semibold hover:underline">
                    Customer Portal
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
