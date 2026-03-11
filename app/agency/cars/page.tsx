import { Sidebar } from '@/components/sidebar'
import { AgencyCarsManager } from '@/components/agency-cars-manager'
import { AuthProvider } from '@/lib/auth-context'

export const metadata = {
  title: 'Manage Cars - CarRent Agency',
  description: 'Manage your rental vehicles',
}

export default function AgencyCarsPage() {
  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-[#F8F9FA]">
        <Sidebar className="hidden md:flex" />
        <main className="flex-1 md:ml-64 p-8 pt-20 md:pt-8 overflow-y-auto w-full">
          <div className="max-w-6xl mx-auto">
            <AgencyCarsManager />
          </div>
        </main>
      </div>
    </AuthProvider>
  )
}
