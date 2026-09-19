export const IMG = (path: string) => `https://www.inktantra.com${path}`

export type CatalogItem = {
  name: string
  href: string
  image: string
  priceLabel?: string
  subtitle?: string
  wide?: boolean
}

export const CATEGORY_TREE = [
  {
    name: "Business Essentials",
    items: [
      { name: "Backpack", href: "/products?category=Backpack" },
      { name: "Customized Bottles", href: "/products?category=Customized Bottles" },
      { name: "Customized Diary", href: "/products?category=Customized Diary" },
      { name: "Customized Mugs", href: "/products?category=Customized Mugs" },
      { name: "Pen Drive", href: "/products?category=Pen Drive" },
      { name: "Travel Pouch", href: "/products?category=Travel Pouch" },
      { name: "Visiting Card Holder", href: "/products?category=Visiting Card Holder" },
    ],
  },
  {
    name: "Corporate Merchandise",
    items: [
      { name: "Bluetooth Speakers", href: "/products?category=Bluetooth Speaker" },
      { name: "Charging cable", href: "/products?category=Charging Cable" },
      { name: "Desktop Gifts", href: "/products?category=Desktop Gift" },
      { name: "Gadgets", href: "/products?category=Gadget" },
      { name: "Headphones", href: "/products?category=Headphones" },
      { name: "Lights", href: "/products?category=Light" },
      { name: "Mobile Accessories", href: "/products?category=Mobile Accessories" },
      { name: "Power Banks", href: "/products?category=Power Bank" },
      { name: "Travel Adapters", href: "/products?category=Travel Adapter" },
      { name: "USB Hubs", href: "/products?category=USB Hub" },
    ],
  },
  {
    name: "Customize Apparels",
    items: [
      { name: "Cotton Polos", href: "/products?category=Cotton Polos" },
      { name: "Hoodies", href: "/products?category=Over Sized T-shirts" },
      { name: "Pullover Hoodies", href: "/products?category=Over Sized T-shirts" },
      { name: "Sweatshirt", href: "/products?category=Over Sized T-shirts" },
      { name: "Zipper Hoodies", href: "/products?category=Over Sized T-shirts" },
      { name: "Premium Cotton Polos", href: "/products?category=Cotton Polos" },
      { name: "Round Neck T Shirt", href: "/products?category=Round Neck T-Shirt" },
      { name: "Ultra Premium Polos", href: "/products?category=Cotton Polos" },
    ],
  },
]

export const BUSINESS_ESSENTIALS: CatalogItem[] = [
  {
    name: "Backpack",
    href: "/products?category=Backpack",
    image: IMG("/printtool/data/thumbnails/lumise-media-BackPack-thumbn.jpg"),
    priceLabel: "699/-",
  },
  {
    name: "Customized Bottles",
    href: "/products?category=Customized Bottles",
    image: IMG("/printtool/data/thumbnails/lumise-media-Bottle-thumbn.jpg"),
    priceLabel: "189/-",
  },
  {
    name: "Customized Diary",
    href: "/products?category=Customized Diary",
    image: IMG("/printtool/data/thumbnails/lumise-media-Diary-thumbn.jpg"),
    priceLabel: "199/-",
  },
  {
    name: "Customized Mugs",
    href: "/products?category=Customized Mugs",
    image: IMG("/printtool/data/thumbnails/lumise-media-Mug-thumbn-1.jpg"),
    priceLabel: "169/-",
  },
]

export const MORE_ESSENTIALS: CatalogItem[] = [
  {
    name: "Pen Drive",
    href: "/products?category=Pen Drive",
    image: IMG("/printtool/data/thumbnails/lumise-media-PenDrive-thumbn.jpg"),
    priceLabel: "249/-",
  },
  {
    name: "Travel Pouch",
    href: "/products?category=Travel Pouch",
    image: IMG("/printtool/data/thumbnails/lumise-media-Bag-thumbn.jpg"),
    priceLabel: "299/-",
  },
  {
    name: "Visiting Card Holder",
    href: "/products?category=Visiting Card Holder",
    image: IMG("/printtool/data/thumbnails/lumise-media-BussinessCardholder-thumbn.jpg"),
    priceLabel: "149/-",
  },
]

export const FEATURED_APPARELS: CatalogItem[] = [
  {
    name: "Sports T-Shirt",
    href: "/products?category=Sports T-Shirt",
    image: IMG("/img/homepage-new/grid/6.jpg?var=1789713787"),
    priceLabel: "₹ 299/-",
    subtitle: "For 1 printed t shirt",
    wide: true,
  },
  {
    name: "Over Sized T-shirts",
    href: "/products?category=Over Sized T-shirts",
    image: IMG("/img/homepage-new/grid/5-old.png?var=1789713787"),
    priceLabel: "₹ 699/-",
    subtitle: "For 1 printed hoodie",
    wide: true,
  },
]

export const APPARELS: CatalogItem[] = [
  {
    name: "Cotton Polos",
    href: "/products?category=Cotton Polos",
    image: IMG("/img/homepage-new/grid/1.png?var=1789713787"),
    priceLabel: "₹ 299/-",
    subtitle: "For 1 printed Polo",
  },
  {
    name: "Round Neck T-Shirt",
    href: "/products?category=Round Neck T-Shirt",
    image: IMG("/img/homepage-new/grid/2.png?var=1789713787"),
    priceLabel: "₹ 299/-",
    subtitle: "For 1 printed t shirt",
  },
  {
    name: "Kids T-Shirt",
    href: "/products?category=Kids T-Shirt",
    image: IMG("/img/homepage-new/grid/3.png?var=1789713787"),
    priceLabel: "₹ 349/-",
    subtitle: "For 21 printed t shirt",
  },
  {
    name: "Women's T-Shirt",
    href: "/products?category=Women's T-Shirt",
    image: IMG("/img/homepage-new/grid/4.png?var=1789713787"),
    priceLabel: "₹ 349/-",
    subtitle: "For 21 printed t shirt",
  },
]

export const CORPORATE: CatalogItem[] = [
  {
    name: "Bluetooth Speaker",
    href: "/products?category=Bluetooth Speaker",
    image: IMG("/img/homepage-new/grid/7.png?var=1789713787"),
    priceLabel: "₹ 499/-",
    subtitle: "For 20 printed hoodies",
  },
  {
    name: "Gadget",
    href: "/products?category=Gadget",
    image: IMG("/img/homepage-new/grid/8.png?var=1789713787"),
    priceLabel: "₹ 149/-",
    subtitle: "For 20 printed hoodies",
  },
  {
    name: "Charging Cable",
    href: "/products?category=Charging Cable",
    image: IMG("/img/homepage-new/grid/9.png?var=1789713787"),
    priceLabel: "₹ 149/-",
    subtitle: "For 50 printed hoodies",
  },
  {
    name: "Light",
    href: "/products?category=Light",
    image: IMG("/img/homepage-new/grid/10.png?var=1789713787"),
    priceLabel: "₹ 149/-",
    subtitle: "For 50 printed hoodies",
  },
  {
    name: "Desktop Gift",
    href: "/products?category=Desktop Gift",
    image: IMG("/img/homepage-new/grid/11.png?var=1789713787"),
    priceLabel: "₹ 299/-",
    subtitle: "For 25 printed hoodies",
  },
  {
    name: "Headphones",
    href: "/products?category=Headphones",
    image: IMG("/img/homepage-new/grid/12.png?var=1789713787"),
    priceLabel: "₹ 499/-",
    subtitle: "For 50 printed hoodies",
  },
  {
    name: "Mobile Accessories",
    href: "/products?category=Mobile Accessories",
    image: IMG("/img/homepage-new/grid/13.png?var=1789713787"),
    priceLabel: "₹ 99/-",
    subtitle: "For 20 printed hoodies",
  },
  {
    name: "Power Bank",
    href: "/products?category=Power Bank",
    image: IMG("/img/homepage-new/grid/14.png?var=1789713787"),
    priceLabel: "₹ 399/-",
    subtitle: "For 20 printed hoodies",
  },
  {
    name: "Travel Adapter",
    href: "/products?category=Travel Adapter",
    image: IMG("/img/homepage-new/grid/15.png?var=1789713787"),
    priceLabel: "₹ 199/-",
    subtitle: "For 50 printed hoodies",
  },
  {
    name: "USB Hub",
    href: "/products?category=USB Hub",
    image: IMG("/img/homepage-new/grid/16.png?var=1789713787"),
    priceLabel: "₹ 149/-",
    subtitle: "For 50 printed hoodies",
  },
]

export const HERO_SLIDES = [
  {
    image: IMG("/img/slider/home/2.jpg?var=1789713787"),
    buyAt: "149/-",
    mrp: "699/-",
  },
  {
    image: IMG("/img/slider/home/3.jpg?var=1789713787"),
    buyAt: "249/-",
    mrp: "1199/-",
  },
  {
    image: IMG("/img/slider/home/4.jpg?var=1789713787"),
    buyAt: "299/-",
    mrp: "899/-",
  },
  {
    image: IMG("/img/slider/home/5.jpg?var=1789713787"),
    buyAt: "189/-",
    mrp: "699/-",
  },
  {
    image: IMG("/img/slider/home/6.jpg?var=1789713787"),
    buyAt: "349/-",
    mrp: "999/-",
  },
]

export const CLIENT_LOGOS = Array.from({ length: 12 }, (_, i) =>
  IMG(`/img/hooper/client/${i + 1}.jpg`)
)

export const FIND_IT_FAST = [
  { name: "Buy Even 1", href: "/products" },
  { name: "Hoodies", href: "/products?category=Over Sized T-shirts" },
  { name: "Diary", href: "/products?category=Customized Diary" },
  { name: "Mugs", href: "/products?category=Customized Mugs" },
  { name: "Pocket diary", href: "/products?category=Customized Diary" },
  { name: "Bottles", href: "/products?category=Customized Bottles" },
  { name: "Bulk Tees", href: "/products?category=Round Neck T-Shirt" },
  { name: "Cups", href: "/products?category=Customized Mugs" },
  { name: "Office Bags", href: "/products?category=Backpack" },
  { name: "Sports T Shirt", href: "/products?category=Sports T-Shirt" },
]

export const CUSTOMER_CARE = [
  { name: "Order Tracking", href: "/account" },
  { name: "Customer Service", href: "/contact" },
  { name: "Terms & Conditions", href: "/terms" },
  { name: "Returns / Exchange", href: "/return-policy" },
  { name: "FAQs", href: "/contact" },
  { name: "Locations", href: "/locations" },
]

export const ALL_CATALOG: CatalogItem[] = [
  ...BUSINESS_ESSENTIALS,
  ...MORE_ESSENTIALS,
  ...FEATURED_APPARELS,
  ...APPARELS,
  ...CORPORATE,
]
