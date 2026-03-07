import { Sidebar } from '@/components/sidebar'
import { CustomerBookings } from '@/components/customer-bookings'
import { AuthProvider } from '@/lib/auth-context'

export const metadata = {
  title: 'My Bookings - CarRent',
  description: 'View your car rental bookings',
}

export default function CustomerBookingsPage() {
  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-[#F8F9FA]">
        <Sidebar />
        <main className="flex-1 ml-64 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <CustomerBookings />
          </div>
        </main>
      </div>
    </AuthProvider>
  )
}
