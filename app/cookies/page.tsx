import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { PageBanner } from "@/components/page-banner"

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-marketplace">
      <Navbar />
      <PageBanner
        title="Cookie Policy"
        subtitle="Cookies keep your cart, login, and print checkout preferences working."
      />
      <main className="max-w-4xl mx-auto px-4 py-16 text-gray-700 space-y-6 bg-white my-10 rounded-2xl shadow-sm">
        <p>
          Essential cookies power login, cart, and custom t-shirt checkout on COSMORA. Analytics cookies help us
          improve the print shopping experience. You can block non-essential cookies in your browser settings.
        </p>
      </main>
      <Footer />
    </div>
  )
}
