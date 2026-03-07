import { LoginForm } from '@/components/login-form'
import { Navbar } from '@/components/navbar'
import { Suspense } from 'react'
import { AuthProvider } from '@/lib/auth-context'

export default function LoginPage() {
  return (
    <AuthProvider>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </AuthProvider>
  )
}
