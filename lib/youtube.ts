/** Extract YouTube video id from URL or raw id. */
export function parseYoutubeVideoId(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed

  try {
    const href = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`
    const u = new URL(href)
    const host = u.hostname.replace(/^www\./, "")

    if (host === "youtube.com" || host === "m.youtube.com") {
      const v = u.searchParams.get("v")
      if (v) return v
      const embed = u.pathname.match(/\/embed\/([^/?]+)/)
      if (embed?.[1]) return embed[1]
      const shorts = u.pathname.match(/\/shorts\/([^/?]+)/)
      if (shorts?.[1]) return shorts[1]
    }
    if (host === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean)[0]
      if (id) return id
    }
  } catch {
    return null
  }
  return null
}

/** Embed URL for homepage hero (autoplay, loop, minimal chrome). */
export function youtubeHeroEmbedUrl(videoId: string, muted = true) {
  const mute = muted ? 1 : 0
  const params = new URLSearchParams({
    autoplay: "1",
    mute: String(mute),
    loop: "1",
    playlist: videoId,
    controls: "0",
    modestbranding: "1",
    rel: "0",
    playsinline: "1",
    iv_load_policy: "3",
  })
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
}
