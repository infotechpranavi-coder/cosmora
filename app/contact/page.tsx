import Navbar from "@/components/navbar"
import ContactForm from "@/components/contact-form"
import Footer from "@/components/footer"
import { MapPin, Phone, Mail, Clock, Shirt } from "lucide-react"
import { STORE_ADDRESS } from "@/data/print-marketplace"
import { STORE_EMAIL, STORE_PHONE_DISPLAY, STORE_PHONE_TEL } from "@/lib/shop-nav"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-marketplace">
      <Navbar />

      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <h1 className="text-3xl font-extrabold text-[#172033] mb-8">Contact</h1>
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF2F7] px-3 py-1 text-xs font-semibold text-[#14243D]">
                <Shirt className="w-3.5 h-3.5" />
                Custom t-shirt printing
              </div>
              <h2 className="text-2xl font-extrabold text-[#172033]">Print studio & support</h2>
              <p className="text-sm text-[#667085]">
                Reach us for sample visits, design help, single-piece orders, or corporate bulk printing.
              </p>
              <div className="flex items-start gap-3 text-[#172033]">
                <MapPin className="w-5 h-5 text-[#14243D] mt-0.5 shrink-0" />
                <p>{STORE_ADDRESS}</p>
              </div>
              <div className="flex items-start gap-3 text-[#172033]">
                <Phone className="w-5 h-5 text-[#14243D] mt-0.5 shrink-0" />
                <p>
                  WhatsApp / call:{" "}
                  <a href={`tel:${STORE_PHONE_TEL}`} className="hover:underline">
                    {STORE_PHONE_DISPLAY}
                  </a>
                </p>
              </div>
              <div className="flex items-start gap-3 text-[#172033]">
                <Mail className="w-5 h-5 text-[#14243D] mt-0.5 shrink-0" />
                <p>
                  Email:{" "}
                  <a href={`mailto:${STORE_EMAIL}`} className="hover:underline">
                    {STORE_EMAIL}
                  </a>
                </p>
              </div>
              <div className="flex items-start gap-3 text-[#172033]">
                <Clock className="w-5 h-5 text-[#14243D] mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">Studio hours</p>
                  <p>Mon–Fri: 9am–9pm</p>
                  <p>Sat–Sun: 9am–11pm</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-extrabold text-[#172033] mb-2">Request a quote</h2>
              <p className="text-sm text-[#667085] mb-6">
                Share quantity, tee type, and print details — we&apos;ll send factory rates.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
