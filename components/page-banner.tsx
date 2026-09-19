export function PageBanner({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  return (
    <section
      className="text-white text-center py-12 sm:py-16 px-4"
      style={{
        background: "linear-gradient(90deg, #5B21B6 0%, #7C3AED 50%, #DB2777 100%)",
      }}
    >
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold">{title}</h1>
      {subtitle && <p className="mt-3 text-white/90 max-w-2xl mx-auto text-sm sm:text-base">{subtitle}</p>}
    </section>
  )
}
