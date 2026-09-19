import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { PageBanner } from "@/components/page-banner"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-marketplace">
      <Navbar />
      <PageBanner title="Terms & Conditions" subtitle="By using the Print Marketplace you agree to these terms." />
      <main className="max-w-4xl mx-auto px-4 py-16 text-gray-700 space-y-6 bg-white my-10 rounded-2xl shadow-sm">
        <p>
          Inktantra operates a print marketplace connecting customers with manufacturers. Orders, artwork, and bulk
          quantities must be confirmed before production. Custom printed goods cannot always be returned once printing
          has started.
        </p>
        <p>
          Prices shown on category pages are starting factory rates and may change with quantity, fabric, and print
          method. Timely delivery is our commitment; courier delays beyond our control may occur.
        </p>
        <p>
          You must provide accurate contact details for WhatsApp updates. For questions call +91 9619108909 /
          +91 7506550101.
        </p>
      </main>
      <Footer />
    </div>
  )
}
