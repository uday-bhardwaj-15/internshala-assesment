'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Car, LogOut, Menu, UserCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

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
          <div className="rounded-md bg-black p-1.5 text-white">
            <Car className="w-5 h-5" />
          </div>
          <span className={isScrolled ? 'text-black' : 'text-white'}>CARRENT</span>
        </Link>

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

        {/* Mobile menu button */}
        <button
          className={`md:hidden p-2 transition-colors ${isScrolled ? 'text-gray-900' : 'text-white'}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white text-black shadow-lg">
          <div className="px-4 py-6 space-y-4">
            <Link href="/cars" className="block text-lg font-semibold hover:text-gray-600 transition-colors border-b border-gray-100 pb-4 mb-4">
              BROWSE GARAGE
            </Link>
            
            {user ? (
              <>
                <div className="text-sm font-medium text-gray-500 border-b border-gray-100 pb-2">
                  <span className="text-gray-400 text-xs block mb-1">Signed in as</span>
                  {user.type === 'agency' ? user.agencyName || user.name : user.name}
                </div>
                {user.type === 'agency' && (
                  <>
                    <Link href="/agency/cars" className="block text-lg font-semibold hover:text-gray-600 transition-colors">
                      Garage
                    </Link>
                    <Link href="/agency/bookings" className="block text-lg font-semibold hover:text-gray-600 transition-colors">
                      Logs
                    </Link>
                  </>
                )}
                {user.type === 'customer' && (
                  <Link href="/customer/bookings" className="block text-lg font-semibold hover:text-gray-600 transition-colors">
                    MY BOOKINGS
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="block w-full text-left text-lg font-semibold text-red-600 hover:text-red-700 mt-6 pt-4 border-t border-gray-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-4">
                <Link href="/login?type=customer" className="block">
                  <button className="w-full py-3 text-lg font-semibold bg-gray-100 rounded-lg">
                    RIDER LOGIN
                  </button>
                </Link>
                <Link href="/login?type=agency" className="block">
                  <button className="w-full py-3 text-lg font-semibold bg-black text-white rounded-lg">
                    AGENCY LOGIN
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
