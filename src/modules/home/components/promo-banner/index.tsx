import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function PromoBanner() {
  return (
    <section className="relative bg-gorila-ink text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=1920&q=80"
          alt="Equipamento tático em campo"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gorila-ink/80 via-gorila-ink/40 to-gorila-orange/30" />
      </div>

      <div className="relative z-10 content-container py-20 md:py-28 text-center">
        <span className="inline-block px-3 py-1 mb-5 text-xs font-bold uppercase tracking-widest bg-white text-gorila-ink rounded">
          Construído para sempre
        </span>
        <h2 className="text-4xl md:text-5xl font-black uppercase max-w-3xl mx-auto leading-tight">
          Garantia <span className="text-gorila-orange">vitalícia</span> em
          cada produto
        </h2>
        <p className="mt-4 text-base text-white/80 max-w-2xl mx-auto">
          Acreditamos no que fazemos. Se quebrar, falhar ou apresentar defeito
          de fábrica, trocamos. Para sempre.
        </p>
        <LocalizedClientLink
          href="/store"
          className="inline-flex items-center justify-center mt-8 h-12 px-8 bg-gorila-orange hover:bg-gorila-orange-hover text-gorila-ink font-bold text-sm uppercase tracking-wider rounded-md transition"
        >
          Conheça nossa missão
        </LocalizedClientLink>
      </div>
    </section>
  )
}
