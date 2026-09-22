import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { PageBanner } from "@/components/page-banner"
import { CheckCircle2, Shirt, Printer, Palette, Truck } from "lucide-react"
import { IMG } from "@/data/print-marketplace"
import Link from "next/link"

const PILLARS = [
  {
    title: "Custom t-shirt printing",
    text: "Round neck, polo, sports, oversized, kids & women’s tees — printed to your design.",
    Icon: Shirt,
  },
  {
    title: "Factory print quality",
    text: "Direct from our Navi Mumbai units. Sharp artwork, soft fabrics, consistent colour.",
    Icon: Printer,
  },
  {
    title: "Design support",
    text: "Upload your logo or artwork. Our team helps size, place, and prep files for print.",
    Icon: Palette,
  },
  {
    title: "Door delivery",
    text: "Single pieces or bulk corporate orders shipped across India after print approval.",
    Icon: Truck,
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-marketplace">
      <Navbar />
      <PageBanner
        title="About COSMORA"
        subtitle="India’s t-shirt printing marketplace — factory rates, custom designs, door delivery"
      />

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <p className="text-center text-sm font-semibold tracking-widest text-[#C49A52] mb-2">
            T-SHIRT PRINTING · NAVI MUMBAI
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172033] text-center mb-6">
            Wear your brand. We print it.
          </h2>
          <p className="text-[#667085] leading-relaxed text-center max-w-3xl mx-auto mb-6">
            COSMORA is a custom t-shirt printing company connecting you directly with manufacturers.
            Whether you need one personalised tee or thousands for an event, startup, college, or corporate
            team — we print your design at factory rates with no middlemen.
          </p>
          <p className="text-[#667085] leading-relaxed text-center max-w-3xl mx-auto mb-12">
            From blank apparel to finished print, our team handles artwork checks, print placement, quality
            control, and packing so your merch looks brand-ready every time.
          </p>

          <div className="grid sm:grid-cols-2 gap-5 mb-16">
            {PILLARS.map(({ title, text, Icon }) => (
              <div key={title} className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
                <div className="h-11 w-11 rounded-xl bg-[#14243D] text-white flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-extrabold text-[#172033] mb-2">{title}</h3>
                <p className="text-sm text-[#667085] leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-center bg-white rounded-3xl shadow-sm p-8 mb-12">
            <div>
              <h3 className="text-2xl font-extrabold text-[#172033] mb-4">
                How custom t-shirt printing works
              </h3>
              <p className="text-[#667085] mb-6">
                Three simple steps from blank tee to doorstep delivery.
              </p>
              <ul className="space-y-3">
                {[
                  "Choose your tee style & quantity",
                  "Upload your design or logo",
                  "We print, pack & deliver",
                  "Bulk quotes on WhatsApp in hours",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-[#172033] font-medium">
                    <CheckCircle2 className="w-5 h-5 text-[#C49A52] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/products"
                className="inline-flex mt-8 rounded-full px-6 py-3 text-sm font-semibold text-[#14243D]"
                style={{ background: "linear-gradient(90deg, #C49A52 0%, #E8D5B0 100%)" }}
              >
                Browse printed tees
              </Link>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={IMG("/img/homepage-new/about/bottom-banner1.jpg?var=1789713787")}
              alt="COSMORA custom t-shirt printing"
              className="w-full rounded-2xl object-cover max-h-80"
            />
          </div>

          <p className="text-center text-sm text-[#667085]">
            Questions about fabrics, print methods, or bulk pricing?{" "}
            <Link href="/contact" className="font-semibold text-[#14243D] hover:underline">
              Get a print quote
            </Link>
          </p>
        </div>
      </section>
      <Footer />
    </div>
  )
}
