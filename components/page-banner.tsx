export function PageBanner({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  return (
    <section className="text-white text-center py-12 sm:py-16 px-4 bg-cosmora-gradient relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-50 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 80% 20%, rgba(201,162,39,0.35), transparent 35%), radial-gradient(circle at 10% 90%, rgba(225,29,116,0.28), transparent 40%)",
        }}
      />
      <h1 className="relative text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[0.08em]">{title}</h1>
      {subtitle && (
        <p className="relative mt-3 text-white/85 max-w-2xl mx-auto text-sm sm:text-base">{subtitle}</p>
      )}
    </section>
  )
}
