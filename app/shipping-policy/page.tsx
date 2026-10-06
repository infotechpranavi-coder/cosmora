import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-marketplace">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-16 text-gray-700 space-y-6 bg-white my-10 rounded-2xl shadow-sm">
        <h1 className="text-3xl font-extrabold text-[#172033]">Shipping Policy</h1>
        <p>
          COSMORA ships custom printed t-shirts and apparel after your design is approved. Metro cities usually
          receive orders in 3–7 business days after printing is complete. Bulk tee orders may take longer depending
          on quantity, fabric, and print colours.
        </p>
        <p>
          You can also pick up finished tees at our Goregaon West studio in Mumbai — see the
          Locations page for the full address.
        </p>
        <p>
          Tracking details are shared on WhatsApp once your print job leaves the studio. For shipping questions call
          +91 9326493809.
        </p>
      </main>
      <Footer />
    </div>
  )
}
