import { Navbar } from '@/components/navbar'
import { AuthProvider } from '@/lib/auth-context'
import Link from 'next/link'
import { ArrowRight, MapPin, Shield, Clock } from 'lucide-react'

export default function Home() {
  return (
    <AuthProvider>
      <Navbar />
      <main className="min-h-screen bg-white text-gray-900">
        
        {/* Modern Clean Hero Section */}
        <div className="relative h-screen min-h-[600px] w-full flex flex-col justify-center overflow-hidden">
          {/* Background Video/Image focusing on real users and modern aesthetic */}
          <div className="absolute inset-0 z-0">
             <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="https://videos.pexels.com/video-files/4010131/4010131-uhd_2560_1440_25fps.mp4" type="video/mp4" />
              {/* Fallback image if video fails to load */}
              <img src="/images/nfs_hero_car_1772865584821.png" className="w-full h-full object-cover" alt="Car driving" />
            </video>
            <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium mb-6">
                Redefining Mobility
              </span>
              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight mb-6">
                Drive the moment. <br/>
                <span className="text-white/80">Experience freedom.</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl font-light">
                Premium car rentals designed around your life. Seamless booking, transparent pricing, and vehicles that elevate your journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/cars">
                  <button className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-semibold text-lg hover:bg-gray-100 transition-transform hover:scale-105 flex items-center justify-center gap-2">
                    Browse Vehicles <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Value Props Section */}
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto md:mx-0">
                  <MapPin className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-bold">Anywhere, Anytime</h3>
                <p className="text-gray-500">Pick up your vehicle from hundreds of convenient locations across the country.</p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto md:mx-0">
                  <Shield className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-bold">Trusted Protection</h3>
                <p className="text-gray-500">Every rental includes premium insurance and 24/7 roadside assistance.</p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto md:mx-0">
                  <Clock className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-bold">Instant Booking</h3>
                <p className="text-gray-500">Skip the counter. Book instantly online and unlock your car with the app.</p>
              </div>
            </div>
          </div>
        </div>
        
      </main>
    </AuthProvider>
  )
}
