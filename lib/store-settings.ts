export type StoreSettings = {
  shippingFee: number
  freeShippingThreshold: number
  giftEnabled: boolean
  giftFee: number
  taxRate: number
  heroEyebrow: string
  heroTagline: string
  heroDescription: string
}

export const DEFAULT_SETTINGS: StoreSettings = {
  shippingFee: 0,
  freeShippingThreshold: 0,
  giftEnabled: true,
  giftFee: 0,
  taxRate: 0.18,
  heroEyebrow: 'Custom t-shirt printing',
  heroTagline: 'Wear Your Universe',
  heroDescription:
    'Custom printed tees from the manufacturer — factory rates, editable design, door delivery across India.',
}
