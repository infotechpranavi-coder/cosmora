import Navbar from "@/components/navbar"
import ContactForm from "@/components/contact-form"
import Footer from "@/components/footer"
import { PageBanner } from "@/components/page-banner"
import { MapPin, Phone, Mail, Clock, Briefcase } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-marketplace">
      <Navbar />
      <PageBanner title="Contact us" subtitle="Leave us a message — we are available 24/7 for bulk print orders." />

      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
              <h2 className="text-2xl font-extrabold text-gray-900">Our Address</h2>
              <div className="flex items-start gap-3 text-gray-700">
                <MapPin className="w-5 h-5 text-[#7C3AED] mt-0.5" />
                <p>Everest World, 1205 Bluebell, Thane West, Thane, Maharashtra 400607</p>
              </div>
              <div className="flex items-start gap-3 text-gray-700">
                <Phone className="w-5 h-5 text-[#7C3AED] mt-0.5" />
                <p>Support +91 9619108909, +91 7506550101</p>
              </div>
              <div className="flex items-start gap-3 text-gray-700">
                <Mail className="w-5 h-5 text-[#7C3AED] mt-0.5" />
                <p>Email: info@inktantra.in</p>
              </div>
              <div className="flex items-start gap-3 text-gray-700">
                <Clock className="w-5 h-5 text-[#7C3AED] mt-0.5" />
                <div>
                  <p className="font-semibold">Opening Hours</p>
                  <p>Monday to Friday: 9am-9pm</p>
                  <p>Saturday to Sunday: 9am-11pm</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-gray-700">
                <Briefcase className="w-5 h-5 text-[#7C3AED] mt-0.5" />
                <div>
                  <p className="font-semibold">Careers</p>
                  <p>If you’re interested in employment opportunities at Inktantra, please email us: inktantra.v1.1@gmail.com</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Leave us a Message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
