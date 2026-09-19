import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { PageBanner } from "@/components/page-banner"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-marketplace">
      <Navbar />
      <PageBanner title="Privacy Policy" subtitle="How Inktantra uses contact details for quotes and orders." />
      <main className="max-w-4xl mx-auto px-4 py-16 text-gray-700 space-y-6 bg-white my-10 rounded-2xl shadow-sm">
        <p>
          We collect name, email, WhatsApp number, and order quantity when you request a bulk quote. This information
          is used only to respond to your enquiry and fulfil print jobs.
        </p>
        <p>
          We do not sell your data. Store visits and sample requests may be logged so our factory team can assist you.
          Email us at info@inktantra.in for any privacy request.
        </p>
      </main>
      <Footer />
    </div>
  )
}
