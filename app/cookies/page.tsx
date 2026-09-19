import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { PageBanner } from "@/components/page-banner"

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-marketplace">
      <Navbar />
      <PageBanner title="Cookie Policy" subtitle="We use cookies to keep your cart and quote preferences." />
      <main className="max-w-4xl mx-auto px-4 py-16 text-gray-700 space-y-6 bg-white my-10 rounded-2xl shadow-sm">
        <p>
          Essential cookies power login, cart, and checkout. Analytics cookies help us improve the COSMORA shopping
          experience. You can block non-essential cookies in your browser.
        </p>
      </main>
      <Footer />
    </div>
  )
}
