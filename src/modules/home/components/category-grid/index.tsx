import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { listCategories } from "@lib/data/categories"

const CATEGORY_IMAGES: Record<string, string> = {
  "mochilas-taticas":
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&q=80",
  "edc-ferramentas":
    "https://images.unsplash.com/photo-1589459072535-550f4fae08b3?w=900&q=80",
  iluminacao:
    "https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=900&q=80",
  acessorios:
    "https://images.unsplash.com/photo-1622445275576-721325763afe?w=900&q=80",
}

export default async function CategoryGrid() {
  const categories = await listCategories().catch(() => [])
  const top = (categories || [])
    .filter((c: any) => !c.parent_category_id)
    .slice(0, 4)

  if (!top.length) return null

  return (
    <section className="py-20 bg-gorila-pearl">
      <div className="content-container">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-gorila-orange">
            Categorias
          </span>
          <h2 className="text-3xl md:text-4xl font-black uppercase mt-2 text-gorila-ink">
            Encontre seu equipamento
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {top.map((c: any) => (
            <LocalizedClientLink
              key={c.id}
              href={`/categories/${c.handle}`}
              className="group relative aspect-square overflow-hidden rounded-lg bg-gorila-ink"
            >
              <img
                src={CATEGORY_IMAGES[c.handle] || CATEGORY_IMAGES["mochilas-taticas"]}
                alt={c.name}
                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-110 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gorila-ink via-gorila-ink/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="text-white font-black text-lg uppercase tracking-tight">
                  {c.name}
                </h3>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gorila-orange group-hover:gap-3 transition-all">
                  Comprar
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </span>
              </div>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}
