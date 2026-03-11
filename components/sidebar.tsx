'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Car, Home, Calendar, Heart, LogOut, Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'

function SidebarContent({ user, logout, pathname }: any) {
  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Car, label: 'Vehicles', href: '/cars' },
    { icon: Calendar, label: 'Bookings', href: user?.type === 'agency' ? '/agency/bookings' : '/customer/bookings' },
    { icon: Heart, label: 'Favourites', href: '/favorites' },
  ]

  return (
    <div className="flex h-full flex-col font-medium text-sm">
      <Link href="/" className="mb-8 flex items-center gap-2 px-2 text-xl font-bold tracking-tight">
        <div className="rounded-md bg-black p-1 text-white flex-shrink-0">
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
    </div>
  )
}

export function Sidebar({ className }: { className?: string }) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-white border-b z-40 flex items-center px-4 justify-between shadow-sm">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <div className="rounded-md bg-black p-1 text-white">
              <Car className="h-5 w-5" />
            </div>
            CARRENT
        </Link>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-md">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-6">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <SidebarContent user={user} logout={logout} pathname={pathname} />
          </SheetContent>
        </Sheet>
      </div>

      <aside className={`hidden md:flex fixed left-0 top-0 z-50 h-screen w-64 flex-col border-r bg-white px-4 py-6 ${className || ''}`}>
        <SidebarContent user={user} logout={logout} pathname={pathname} />
      </aside>
    </>
  )
}
