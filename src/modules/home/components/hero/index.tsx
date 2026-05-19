import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <section className="relative bg-gorila-ink text-white overflow-hidden">
      {/* Background image overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1920&q=80"
          alt="Equipamento tático"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gorila-ink via-gorila-ink/80 to-transparent" />
      </div>

      <div className="relative z-10 content-container py-20 md:py-32 grid md:grid-cols-2 gap-10 items-center">
        <div className="max-w-xl">
          <span className="inline-block px-3 py-1 mb-5 text-xs font-bold uppercase tracking-widest bg-gorila-orange text-gorila-ink rounded">
            Coleção 2026 · Lançamento
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase leading-[0.95] tracking-tight">
            Equipamento
            <br />
            <span className="text-gorila-orange">para missão</span>
            <br />
            diária.
          </h1>
          <p className="mt-6 text-lg text-gorila-pearl/80 leading-relaxed">
            Mochilas táticas, EDC, iluminação e acessórios projetados para
            performance extrema. Garantia vitalícia.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LocalizedClientLink
              href="/store"
              className="inline-flex items-center justify-center h-14 px-8 bg-gorila-orange hover:bg-gorila-orange-hover text-gorila-ink font-bold text-sm uppercase tracking-wider rounded-md transition shadow-lg shadow-gorila-orange/20"
            >
              Comprar agora
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/categories/mochilas-taticas"
              className="inline-flex items-center justify-center h-14 px-8 bg-transparent border-2 border-white/30 hover:border-white text-white font-bold text-sm uppercase tracking-wider rounded-md transition"
            >
              Ver mochilas
            </LocalizedClientLink>
          </div>

          {/* Mini rating bar */}
          <div className="mt-10 flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="flex text-gorila-orange">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg
                    key={i}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <span className="text-white/80">
                <strong className="text-white">4.9</strong> · 8.000+ avaliações
              </span>
            </div>
          </div>
        </div>

        {/* Right column: empty for image breathing room */}
        <div className="hidden md:block" />
      </div>
    </section>
  )
}

export default Hero
