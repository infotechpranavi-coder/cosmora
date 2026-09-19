import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { PageBanner } from "@/components/page-banner"
import { CheckCircle2 } from "lucide-react"
import { IMG } from "@/data/print-marketplace"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-marketplace">
      <Navbar />
      <PageBanner
        title="COSMORA"
        subtitle="Wear your universe — premium customized merchandise at factory prices"
      />

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <p className="text-center text-sm font-semibold tracking-widest text-[#7C3AED] mb-2">ABOUT US</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center mb-6">
            3 Steps To A Success Product Business.
          </h2>
          <p className="text-gray-600 leading-relaxed text-center max-w-3xl mx-auto mb-10">
            COSMORA is a print marketplace that connects end consumers with leading manufacturers of merchandise
            across the country, ensuring a wide variety of options at the lowest rates possible. Our expert technical
            team provides design support and guidance at every step of the purchase. We ensure product quality, print
            quality, and timely delivery. Our no middle-man operations model ensures that customers get products at
            the lowest rates without compromising quality.
          </p>
          <p className="text-center font-semibold text-gray-800 mb-16">COSMORA Team</p>

          <div className="grid md:grid-cols-2 gap-10 items-center bg-white rounded-3xl shadow-sm p-8">
            <div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-4">Make Your Merchandise With Our Team</h3>
              <p className="text-gray-600 mb-6">Leverage the platform that connects consumers directly with suppliers</p>
              <ul className="space-y-3">
                {["Wide variety to select from", "Design assistance", "Quality Assurance", "Timely Delivery"].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-2 text-gray-800 font-medium">
                      <CheckCircle2 className="w-5 h-5 text-[#7C3AED]" />
                      {item}
                    </li>
                  )
                )}
              </ul>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={IMG("/img/homepage-new/about/bottom-banner1.jpg?var=1789713787")}
              alt="COSMORA print marketplace team"
              className="w-full rounded-2xl object-cover max-h-80"
            />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
