"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Clock, Star } from "lucide-react"

const socialLinks = [
  { href: "#", label: "Facebook", Icon: Facebook },
  { href: "#", label: "Instagram", Icon: Instagram },
  { href: "#", label: "Twitter", Icon: Twitter },
  { href: "#", label: "YouTube", Icon: Youtube },
]

const contactItems = [
  {
    Icon: MapPin,
    content: (
      <>
        <p>Shop No 45 KE Zozwala Complex</p>
        <p>Mohammed Ali chowk station road kalyan west 421301</p>
      </>
    ),
  },
  {
    Icon: Phone,
                content: <span>+91 9076055755</span>,
              },
              {
                Icon: Mail,
                content: (
                  <span className="break-all">alankarikajewels1225@gmail.com</span>
                ),
              },
  {
    Icon: Clock,
    content: <span>Tue–Sun: 10:00 AM – 9:00 PM</span>,
  },
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-x-6 lg:gap-y-10">
          {/* Company Info */}
          <div className="space-y-6 sm:col-span-2 lg:col-span-3">
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#F5EEDC] rounded-2xl shrink-0 w-56 h-28 sm:w-64 sm:h-32 flex items-center justify-center overflow-hidden px-4 py-1">
                <Image
                  src="/logo/alankarika_logo-tm-removebg-preview.png"
                  alt="Alankarika Logo"
                  width={256}
                  height={128}
                  className="w-full h-full object-contain scale-110"
                />
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm text-center lg:text-left">
              Crafting timeless jewelry pieces that celebrate life&apos;s most precious moments. Quality, elegance, and
              craftsmanship in every design at Alankarika.
            </p>
            <div className="flex items-center justify-center lg:justify-start gap-3">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 shrink-0 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#C4A484] transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white transition-colors">
                  Our Products
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="text-gray-400 hover:text-white transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="text-gray-400 hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3 min-w-0">
            <h3 className="text-lg font-semibold mb-6">Get in Touch</h3>
            <div className="space-y-4">
              {contactItems.map(({ Icon, content }, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="w-5 h-5 shrink-0 mt-0.5 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#C4A484]" />
                  </span>
                  <div className="text-gray-400 text-sm leading-relaxed">
                    {content}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="lg:col-span-2 lg:pl-8">
            <h3 className="text-lg font-semibold mb-6">Categories</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/necklaces" className="text-gray-400 hover:text-white transition-colors">
                  Necklaces
                </Link>
              </li>
              <li>
                <Link href="/pendants" className="text-gray-400 hover:text-white transition-colors">
                  Pendants
                </Link>
              </li>
              <li>
                <Link href="/rings" className="text-gray-400 hover:text-white transition-colors">
                  Rings
                </Link>
              </li>
              <li>
                <Link href="/earrings" className="text-gray-400 hover:text-white transition-colors">
                  Earrings
                </Link>
              </li>
              <li>
                <Link href="/bracelets" className="text-gray-400 hover:text-white transition-colors">
                  Bracelets
                </Link>
              </li>
              <li>
                <Link href="/wedding" className="text-gray-400 hover:text-white transition-colors">
                  Wedding Collection
                </Link>
              </li>
            </ul>
          </div>

          {/* Special Offers */}
          <div className="lg:col-span-2 lg:pl-4">
            <h3 className="text-lg font-semibold mb-6">Special Offers</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/new-arrivals" className="text-gray-400 hover:text-white transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/sale" className="text-gray-400 hover:text-white transition-colors">
                  Sale Items
                </Link>
              </li>
              <li>
                <Link href="/limited-edition" className="text-gray-400 hover:text-white transition-colors">
                  Limited Edition
                </Link>
              </li>
              <li>
                <Link href="/personalized" className="text-gray-400 hover:text-white transition-colors">
                  Personalized Jewelry
                </Link>
              </li>
              <li>
                <Link href="/luxury-collection" className="text-gray-400 hover:text-white transition-colors">
                  Luxury Collection
                </Link>
              </li>
              <li>
                <Link href="/bridal-sets" className="text-gray-400 hover:text-white transition-colors">
                  Bridal Sets
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <p className="text-gray-400 text-sm">© 2025 Alankarika. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 shrink-0 text-[#C4A484]" />
              <span className="text-gray-400 text-sm">Premium Quality Since 2025</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/return-policy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Refund Policy
            </Link>
            <Link href="/shipping-policy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Shipping Policy
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
              Cookie Policy
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
