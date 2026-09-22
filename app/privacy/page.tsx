import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { PageBanner } from "@/components/page-banner"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-marketplace">
      <Navbar />
      <PageBanner
        title="Privacy Policy"
        subtitle="How COSMORA uses your details for t-shirt print quotes and orders."
      />
      <main className="max-w-4xl mx-auto px-4 py-16 text-gray-700 space-y-6 bg-white my-10 rounded-2xl shadow-sm">
        <p>
          We collect name, email, WhatsApp number, shipping address, and order details when you request a print quote
          or place a custom t-shirt order. Design files you upload are used only to print your order.
        </p>
        <p>
          We do not sell your data. Information is shared with payment partners and couriers only as needed to
          complete your print job. Email info@cosmora.in for any privacy request.
        </p>
      </main>
      <Footer />
    </div>
  )
}
