import { RegisterForm } from '@/components/register-form'
import { Navbar } from '@/components/navbar'
import { Suspense } from 'react'
import { AuthProvider } from '@/lib/auth-context'

export const metadata = {
  title: 'Register - CarRent',
  description: 'Create a new CarRent account',
}

export default function RegisterPage() {
  return (
    <AuthProvider>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
        <RegisterForm />
      </Suspense>
    </AuthProvider>
  )
}
