import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-marketplace">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-16 text-gray-700 space-y-6 bg-white my-10 rounded-2xl shadow-sm">
        <h1 className="text-3xl font-extrabold text-[#172033]">Cookie Policy</h1>
        <p>
          Essential cookies power login, cart, and custom t-shirt checkout on COSMORA. Analytics cookies help us
          improve the print shopping experience. You can block non-essential cookies in your browser settings.
        </p>
      </main>
      <Footer />
    </div>
  )
}
