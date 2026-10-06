import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import BulkEnquiryForm from "@/components/bulk-enquiry-form"
import { STORE_EMAIL, STORE_PHONE_DISPLAY } from "@/lib/shop-nav"

export default function BulkOrdersPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <Navbar />
      <section className="py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C49A52] mb-2">
            Cosmora corporate
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172033] tracking-tight mb-3">
            Bulk & Corporate Enquiry
          </h1>
          <p className="text-[#667085] text-base sm:text-lg mb-8 max-w-2xl">
            Tell us what you need and our team will get back to you.
          </p>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <BulkEnquiryForm />
          </div>

          <p className="mt-6 text-sm text-slate-500 text-center">
            Prefer to call or email directly? {STORE_PHONE_DISPLAY} · {STORE_EMAIL}
          </p>
        </div>
      </section>
      <Footer />
    </div>
  )
}
