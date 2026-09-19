import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { PageBanner } from "@/components/page-banner"

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-marketplace">
      <Navbar />
      <PageBanner title="Returns / Exchange" subtitle="Custom printed items follow factory return guidelines." />
      <main className="max-w-4xl mx-auto px-4 py-16 text-gray-700 space-y-6 bg-white my-10 rounded-2xl shadow-sm">
        <p>
          Because most products are printed to order, returns are accepted for manufacturing defects or wrong items
          shipped. Custom designs approved by you cannot usually be exchanged.
        </p>
        <p>Raise a request within 7 days of delivery via +91 9619108909 or the contact form.</p>
      </main>
      <Footer />
    </div>
  )
}
