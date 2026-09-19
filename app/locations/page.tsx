import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { PageBanner } from "@/components/page-banner"
import { MapPin } from "lucide-react"
import { LOCATIONS } from "@/data/print-marketplace"

export default function LocationsPage() {
  return (
    <div className="min-h-screen bg-marketplace">
      <Navbar />
      <PageBanner title="Locations" subtitle="Visit our COSMORA stores in Navi Mumbai." />
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 grid gap-6 md:grid-cols-3">
          {LOCATIONS.map((store) => (
            <article key={store.city} className="bg-white rounded-2xl shadow-sm p-6">
              <div className="w-10 h-10 rounded-full bg-violet-100 text-[#7C3AED] flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-extrabold text-gray-900 mb-2">{store.city}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{store.address}</p>
            </article>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  )
}
