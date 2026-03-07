import { Sidebar } from '@/components/sidebar'
import { FavoritesListing } from '@/components/favorites-listing'
import { AuthProvider } from '@/lib/auth-context'

export const metadata = {
  title: 'My Favorites - CarRent',
  description: 'View your favorite vehicles',
}

export default function FavoritesPage() {
  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-[#F8F9FA]">
        <Sidebar />
        <main className="flex-1 ml-64 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <FavoritesListing />
          </div>
        </main>
      </div>
    </AuthProvider>
  )
}
