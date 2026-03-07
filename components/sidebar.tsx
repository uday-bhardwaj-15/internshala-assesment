'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Car, Home, Calendar, Heart, Clock, Bell, MessageSquare, Shield, HelpCircle, LogOut } from 'lucide-react'
import { usePathname } from 'next/navigation'

export function Sidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Car, label: 'Vehicles', href: '/cars' },
    { icon: Calendar, label: 'Bookings', href: user?.type === 'agency' ? '/agency/bookings' : '/customer/bookings' },
    { icon: Heart, label: 'Favourites', href: '/favorites' },
  ]

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r bg-white px-4 py-6 text-sm font-medium">
      <Link href="/" className="mb-8 flex items-center gap-2 px-2 text-xl font-bold tracking-tight">
        <div className="rounded-md bg-black p-1 text-white">
          <Car className="h-5 w-5" />
        </div>
        CARRENT
      </Link>

      <div className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
              pathname === item.href ? 'bg-gray-100 text-black' : 'text-gray-500 hover:bg-gray-50 hover:text-black'
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}

        {user?.type === 'agency' && (
          <Link
            href="/agency/cars"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
              pathname === '/agency/cars' ? 'bg-gray-100 text-black' : 'text-gray-500 hover:bg-gray-50 hover:text-black'
            }`}
          >
            <Car className="h-4 w-4" />
            My Garage
          </Link>
        )}
      </div>

      <div className="mt-8 space-y-1">
        {user ? (
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-colors hover:bg-gray-50 hover:text-black text-left"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        ) : (
          <Link
            href="/login?type=customer"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-colors hover:bg-gray-50 hover:text-black"
          >
            <LogOut className="h-4 w-4" />
            Login
          </Link>
        )}
      </div>
    </aside>
  )
}
