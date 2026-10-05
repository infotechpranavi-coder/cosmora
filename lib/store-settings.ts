import { parseYoutubeVideoId, youtubeHeroEmbedUrl } from '@/lib/youtube'

export type StoreSettings = {
  shippingFee: number
  freeShippingThreshold: number
  giftEnabled: boolean
  giftFee: number
  taxRate: number
  heroEyebrow: string
  heroTagline: string
  heroDescription: string
  /** Homepage hero video URLs (Cloudinary). Empty = use bundled public/*.mp4 fallbacks. */
  heroVideoAllUrl: string
  heroVideoAllPublicId: string
  heroVideoBagsUrl: string
  heroVideoBagsPublicId: string
  heroVideoTeesUrl: string
  heroVideoTeesPublicId: string
  heroVideoShirtsUrl: string
  heroVideoShirtsPublicId: string
  /** YouTube watch/embed URL (or video id) — takes priority over uploaded MP4 on homepage hero. */
  heroVideoAllYoutubeUrl: string
  heroVideoBagsYoutubeUrl: string
  heroVideoTeesYoutubeUrl: string
  heroVideoShirtsYoutubeUrl: string
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
  heroVideoAllUrl: '',
  heroVideoAllPublicId: '',
  heroVideoBagsUrl: '',
  heroVideoBagsPublicId: '',
  heroVideoTeesUrl: '',
  heroVideoTeesPublicId: '',
  heroVideoShirtsUrl: '',
  heroVideoShirtsPublicId: '',
  heroVideoAllYoutubeUrl: '',
  heroVideoBagsYoutubeUrl: '',
  heroVideoTeesYoutubeUrl: '',
  heroVideoShirtsYoutubeUrl: '',
}

export type HeroVideoSlot = 'all' | 'bags' | 'tees' | 'shirts'

export const HERO_VIDEO_SLOTS: { slot: HeroVideoSlot; label: string; fallback: string }[] = [
  { slot: 'all', label: 'All Styles (main hero)', fallback: '/fashion-hero.mp4' },
  { slot: 'bags', label: 'Bags tab', fallback: '/hero-bags.mp4' },
  { slot: 'tees', label: 'T-Shirts tab', fallback: '/hero-tees.mp4' },
  { slot: 'shirts', label: 'Formal Shirts tab', fallback: '/hero-shirts.mp4' },
]

export function heroVideoUrlKey(slot: HeroVideoSlot) {
  return (
    {
      all: 'heroVideoAllUrl',
      bags: 'heroVideoBagsUrl',
      tees: 'heroVideoTeesUrl',
      shirts: 'heroVideoShirtsUrl',
    } as const
  )[slot]
}

export function heroVideoPublicIdKey(slot: HeroVideoSlot) {
  return (
    {
      all: 'heroVideoAllPublicId',
      bags: 'heroVideoBagsPublicId',
      tees: 'heroVideoTeesPublicId',
      shirts: 'heroVideoShirtsPublicId',
    } as const
  )[slot]
}

export function heroVideoYoutubeUrlKey(slot: HeroVideoSlot) {
  return (
    {
      all: 'heroVideoAllYoutubeUrl',
      bags: 'heroVideoBagsYoutubeUrl',
      tees: 'heroVideoTeesYoutubeUrl',
      shirts: 'heroVideoShirtsYoutubeUrl',
    } as const
  )[slot]
}

export type HeroVideoSettingsPick = Pick<
  StoreSettings,
  | 'heroVideoAllUrl'
  | 'heroVideoBagsUrl'
  | 'heroVideoTeesUrl'
  | 'heroVideoShirtsUrl'
  | 'heroVideoAllYoutubeUrl'
  | 'heroVideoBagsYoutubeUrl'
  | 'heroVideoTeesYoutubeUrl'
  | 'heroVideoShirtsYoutubeUrl'
>

function pickYoutubeForCategory(categoryKey: string, settings: HeroVideoSettingsPick) {
  if (categoryKey === 'bags') {
    return settings.heroVideoBagsYoutubeUrl || settings.heroVideoAllYoutubeUrl || ''
  }
  if (categoryKey === 't-shirts') {
    return settings.heroVideoTeesYoutubeUrl || settings.heroVideoAllYoutubeUrl || ''
  }
  if (categoryKey === 'formal shirts') {
    return settings.heroVideoShirtsYoutubeUrl || settings.heroVideoAllYoutubeUrl || ''
  }
  return settings.heroVideoAllYoutubeUrl || ''
}

function pickMp4ForCategory(categoryKey: string, settings: HeroVideoSettingsPick, fallback: string) {
  if (categoryKey === 'bags') return settings.heroVideoBagsUrl || settings.heroVideoAllUrl || fallback
  if (categoryKey === 't-shirts') return settings.heroVideoTeesUrl || settings.heroVideoAllUrl || fallback
  if (categoryKey === 'formal shirts') {
    return settings.heroVideoShirtsUrl || settings.heroVideoAllUrl || fallback
  }
  return settings.heroVideoAllUrl || fallback
}

export function resolveHeroMedia(
  categoryKey: string,
  settings: HeroVideoSettingsPick | null,
  fallbackMp4: string,
  muted = true
): { kind: 'youtube'; embedUrl: string; videoId: string } | { kind: 'mp4'; src: string } {
  if (settings) {
    const ytRaw = pickYoutubeForCategory(categoryKey, settings)
    if (ytRaw) {
      const videoId = parseYoutubeVideoId(ytRaw)
      if (videoId) {
        return { kind: 'youtube', videoId, embedUrl: youtubeHeroEmbedUrl(videoId, muted) }
      }
    }
  }
  return { kind: 'mp4', src: settings ? pickMp4ForCategory(categoryKey, settings, fallbackMp4) : fallbackMp4 }
}
