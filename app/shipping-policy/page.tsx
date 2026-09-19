import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { PageBanner } from "@/components/page-banner"

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-marketplace">
      <Navbar />
      <PageBanner title="Shipping Policy" subtitle="Door delivery across India from our Thane and Mumbai units." />
      <main className="max-w-4xl mx-auto px-4 py-16 text-gray-700 space-y-6 bg-white my-10 rounded-2xl shadow-sm">
        <p>
          Print Marketplace ships customized merchandise after artwork approval. Metro cities typically receive orders
          in 3–7 business days after production. Bulk apparel may take longer depending on quantity.
        </p>
        <p>Pickup is available at Thane, Dadar, and Lower Parel locations listed on the Locations page.</p>
      </main>
      <Footer />
    </div>
  )
}
