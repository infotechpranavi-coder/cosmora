import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-marketplace">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-16 text-gray-700 space-y-6 bg-white my-10 rounded-2xl shadow-sm">
        <h1 className="text-3xl font-extrabold text-[#172033]">Terms & Conditions</h1>
        <p>
          COSMORA provides custom t-shirt printing and apparel merch. By placing an order you confirm that artwork,
          sizes, and quantities are correct. Production starts after design approval — once printing begins, custom
          jobs cannot always be cancelled or returned.
        </p>
        <p>
          Prices on the site are starting factory rates for printed tees and may change with fabric, print method
          (DTG, screen, vinyl, etc.), colours, and quantity. Delivery timelines are estimates; courier delays beyond
          our control may occur.
        </p>
        <p>
          You must provide accurate WhatsApp and shipping details. For support call +91 9619108909 / +91 7506550101
          or email info@cosmora.in.
        </p>
      </main>
      <Footer />
    </div>
  )
}
