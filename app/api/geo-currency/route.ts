import { NextRequest, NextResponse } from 'next/server'
import { currencyFromCountry, currencyFromBrowserLocale, type CurrencyCode } from '@/lib/currencies'

async function resolveCountry(request: NextRequest): Promise<string | null> {
  const fromHeader =
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-vercel-ip-country')

  if (fromHeader && fromHeader !== 'XX') {
    return fromHeader.toUpperCase()
  }

  try {
    const ipRes = await fetch('https://ipapi.co/json/', {
      headers: { 'User-Agent': 'COSMORA/1.0' },
      signal: AbortSignal.timeout(3000),
    })
    if (ipRes.ok) {
      const geo = await ipRes.json()
      if (geo?.country_code) return String(geo.country_code).toUpperCase()
    }
  } catch {
    // fall through
  }

  return null
}

export async function GET(request: NextRequest) {
  const country = await resolveCountry(request)

  // Location always wins — browser language must not override country (e.g. en-US in India)
  let currency: CurrencyCode | null = country ? currencyFromCountry(country) : null

  if (!currency) {
    const acceptLang = request.headers.get('accept-language') || ''
    currency = currencyFromBrowserLocale(acceptLang)
  }

  if (!currency) {
    currency = 'INR'
  }

  return NextResponse.json({ success: true, currency, country })
}
