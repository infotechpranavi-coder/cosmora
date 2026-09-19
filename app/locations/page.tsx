import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { PageBanner } from "@/components/page-banner"
import { MapPin } from "lucide-react"

const STORES = [
  {
    city: "Thane",
    address:
      "Gala No 20, Pomal Service Industrial Estate & Premises Co-Op.Society Ltd, Kolshet Rd, Dhokali, Thane West, Thane, Maharashtra 400607",
  },
  {
    city: "Mumbai · Dadar",
    address:
      "Gala no.40, Ground floor, Gurudwara Building, Dr Baba Saheb Ambedkar Rd, opp. Chitra Cinema, Old bdd chawl, Dadar East, Dadar, Mumbai, Maharashtra 400014",
  },
  {
    city: "Mumbai · Lower Parel",
    address:
      "Office no. 39, 3rd Floor, Hanuman Galli Lakshmi Industrial Estate, Lower Parel West, Worli, Mumbai, Maharashtra 400012",
  },
]

export default function LocationsPage() {
  return (
    <div className="min-h-screen bg-marketplace">
      <Navbar />
      <PageBanner title="Locations" subtitle="Visit our Print Marketplace stores in Mumbai and Thane." />
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 grid gap-6 md:grid-cols-3">
          {STORES.map((store) => (
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
