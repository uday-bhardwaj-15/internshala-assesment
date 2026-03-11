import { Sidebar } from '@/components/sidebar'
import { AgencyBookings } from '@/components/agency-bookings'
import { AuthProvider } from '@/lib/auth-context'

export const metadata = {
  title: 'Agency Bookings - CarRent',
  description: 'View all bookings for your cars',
}

export default function AgencyBookingsPage() {
  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-[#F8F9FA]">
        <Sidebar className="hidden md:flex" />
        <main className="flex-1 md:ml-64 p-8 pt-20 md:pt-8 overflow-y-auto w-full">
          <div className="max-w-6xl mx-auto">
            <AgencyBookings />
          </div>
        </main>
      </div>
    </AuthProvider>
  )
}
