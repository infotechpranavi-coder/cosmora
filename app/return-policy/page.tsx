import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { PageBanner } from "@/components/page-banner"

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-marketplace">
      <Navbar />
      <PageBanner
        title="Returns / Exchange"
        subtitle="Custom printed t-shirts follow made-to-order return guidelines."
      />
      <main className="max-w-4xl mx-auto px-4 py-16 text-gray-700 space-y-6 bg-white my-10 rounded-2xl shadow-sm">
        <p>
          Most COSMORA tees are printed to your design. Returns are accepted for manufacturing defects, wrong size
          shipped (if different from your approved order), or print errors on our side.
        </p>
        <p>
          Custom designs you approved before printing usually cannot be exchanged. Blank (unprinted) stock may be
          eligible for exchange within 7 days if unused and with tags intact.
        </p>
        <p>
          Raise a request within 7 days of delivery via WhatsApp +91 9619108909 or the contact form with your order
          number and photos of the issue.
        </p>
      </main>
      <Footer />
    </div>
  )
}
