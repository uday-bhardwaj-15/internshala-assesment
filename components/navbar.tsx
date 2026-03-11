'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Car, LogOut, Menu, UserCircle, Home, Calendar, Heart } from 'lucide-react'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'

function NavbarMobileContent({ user, logout, pathname }: any) {
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

export function Navbar() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  
  const isHomePage = pathname === '/'
  const isScrolled = scrolled || !isHomePage

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm' : 'bg-transparent text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
        <Link 
          href="/" 
          className="flex items-center gap-2 font-bold text-2xl tracking-tight"
        >
          <div className={`rounded-md ${isScrolled ? 'bg-black text-white' : 'bg-white text-black'} p-1.5`}>
            <Car className="w-5 h-5" />
          </div>
          <span className={isScrolled ? 'text-black' : 'text-white'}>CARRENT</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/cars" className={`text-sm font-semibold transition-colors ${isScrolled ? 'text-gray-600 hover:text-black' : 'text-white/80 hover:text-white'}`}>
            Browse Garage
          </Link>
          
          {user ? (
            <>
              <div className={`flex items-center gap-2 rounded-full px-4 py-1.5 ${isScrolled ? 'bg-gray-100 text-gray-900' : 'bg-white/10 text-white'}`}>
                <UserCircle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {user.type === 'agency' ? user.agencyName || user.name : user.name}
                </span>
              </div>
              
              <div className="flex gap-4">
                {user.type === 'agency' && (
                  <>
                    <Link href="/agency/cars" className={`text-sm font-semibold transition-colors ${isScrolled ? 'text-gray-600 hover:text-black' : 'text-white/80 hover:text-white'}`}>
                      Garage
                    </Link>
                    <Link href="/agency/bookings" className={`text-sm font-semibold transition-colors ${isScrolled ? 'text-gray-600 hover:text-black' : 'text-white/80 hover:text-white'}`}>
                      Logs
                    </Link>
                  </>
                )}
                {user.type === 'customer' && (
                  <Link href="/customer/bookings" className={`text-sm font-semibold transition-colors ${isScrolled ? 'text-gray-600 hover:text-black' : 'text-white/80 hover:text-white'}`}>
                    My Bookings
                  </Link>
                )}
              </div>

              <button
                onClick={logout}
                className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ml-4 ${isScrolled ? 'text-red-600 hover:text-red-700' : 'text-red-400 hover:text-red-300'}`}
              >
                <LogOut className="w-4 h-4" />
                Exit
              </button>
            </>
          ) : (
            <div className="flex gap-4 items-center">
              <Link href="/login?type=customer" className={`text-sm font-semibold transition-colors ${isScrolled ? 'text-gray-600 hover:text-black' : 'text-white/80 hover:text-white'}`}>
                Rider Login
              </Link>
              <Link href="/login?type=agency">
                <button className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${isScrolled ? 'bg-black text-white hover:bg-gray-800' : 'bg-white text-black hover:bg-gray-100'}`}>
                  Agency Login
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button (Sheet Trigger) */}
        <div className="md:hidden">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <button
                  className={`p-2 transition-colors rounded-md ${isScrolled ? 'text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
                >
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-6">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <NavbarMobileContent user={user} logout={logout} pathname={pathname} />
              </SheetContent>
            </Sheet>
        </div>

      </div>
    </nav>
  )
}
