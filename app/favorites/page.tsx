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
        <Sidebar className="hidden md:flex" />
        <main className="flex-1 md:ml-64 p-8 pt-20 md:pt-8 overflow-y-auto w-full">
          <div className="max-w-6xl mx-auto">
            <FavoritesListing />
          </div>
        </main>
      </div>
    </AuthProvider>
  )
}
