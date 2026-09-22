import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { PageBanner } from "@/components/page-banner"
import { MapPin } from "lucide-react"
import { LOCATIONS } from "@/data/print-marketplace"

export default function LocationsPage() {
  return (
    <div className="min-h-screen bg-marketplace">
      <Navbar />
      <PageBanner
        title="Print studios"
        subtitle="Visit COSMORA in Navi Mumbai for samples, design help, and custom t-shirt printing pickup."
      />
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 grid gap-6 md:grid-cols-3">
          {LOCATIONS.map((store) => (
            <article key={store.city} className="bg-white rounded-2xl shadow-sm p-6 border border-[#E5E7EB]">
              <div className="w-10 h-10 rounded-full bg-[#EEF2F7] text-[#14243D] flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-extrabold text-[#172033] mb-2">{store.city}</h2>
              <p className="text-sm text-[#667085] leading-relaxed mb-3">{store.address}</p>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#C49A52]">
                T-shirt printing · samples · pickup
              </p>
            </article>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  )
}
