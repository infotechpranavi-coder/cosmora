export function PageBanner({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  return (
    <section className="text-white text-center py-12 sm:py-16 px-4 bg-black">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[0.08em]">{title}</h1>
      {subtitle && <p className="mt-3 text-white/80 max-w-2xl mx-auto text-sm sm:text-base">{subtitle}</p>}
    </section>
  )
}
