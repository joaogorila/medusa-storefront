import LocalizedClientLink from "@modules/common/components/localized-client-link"
import GorilaProductCard from "@modules/products/components/gorila-product-card"
import { HttpTypes } from "@medusajs/types"
import { sdk } from "@lib/config"

type Props = {
  region: HttpTypes.StoreRegion
  title: string
  subtitle?: string
  filter?: "best_sellers" | "newest"
  href?: string
  hrefLabel?: string
  limit?: number
}

export default async function ProductsShowcase({
  region,
  title,
  subtitle,
  filter = "newest",
  href = "/store",
  hrefLabel = "Ver todos",
  limit = 4,
}: Props) {
  const query: any = {
    limit,
    region_id: region.id,
    fields: "*variants,*variants.calculated_price,+metadata,*images,+thumbnail",
  }
  if (filter === "newest") {
    query.order = "-created_at"
  }

  const products = await sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[] }>(`/store/products`, {
      query,
      cache: "no-store",
    })
    .then(({ products }) => products)
    .catch(() => [])

  if (!products?.length) return null

  return (
    <section className="py-16 bg-white">
      <div className="content-container">
        <div className="flex items-end justify-between mb-8">
          <div>
            {subtitle && (
              <span className="text-xs font-bold uppercase tracking-widest text-gorila-orange">
                {subtitle}
              </span>
            )}
            <h2 className="text-3xl md:text-4xl font-black uppercase mt-1 text-gorila-ink leading-tight">
              {title}
            </h2>
          </div>
          <LocalizedClientLink
            href={href}
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-gorila-ink hover:text-gorila-orange transition"
          >
            {hrefLabel}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </LocalizedClientLink>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">
          {products.map((p) => (
            <GorilaProductCard key={p.id} product={p} region={region} />
          ))}
        </div>

        <div className="sm:hidden mt-8 text-center">
          <LocalizedClientLink
            href={href}
            className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-gorila-ink hover:text-gorila-orange transition"
          >
            {hrefLabel}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}
