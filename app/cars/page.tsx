'use client'

import { Sidebar } from '@/components/sidebar'
import { AuthProvider } from '@/lib/auth-context'
import { CarsListing } from '@/components/cars-listing'

export default function CarsPage() {
  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-[#F8F9FA]">
        <Sidebar />
        
        <main className="flex-1 ml-64 flex">
          <CarsListing />
        </main>
      </div>
    </AuthProvider>
  )
}
