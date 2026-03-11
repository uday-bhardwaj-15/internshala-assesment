'use client'

import { Sidebar } from '@/components/sidebar'
import { AuthProvider } from '@/lib/auth-context'
import { CarsListing } from '@/components/cars-listing'

export default function CarsPage() {
  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-[#F8F9FA]">
        <Sidebar className="hidden md:flex" />
        
        <main className="flex-1 md:ml-64 flex flex-col pt-16 md:pt-0">
          <CarsListing />
        </main>
      </div>
    </AuthProvider>
  )
}
