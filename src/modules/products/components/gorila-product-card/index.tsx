import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type Props = {
  product: HttpTypes.StoreProduct & { metadata?: Record<string, any> | null }
  region?: HttpTypes.StoreRegion
}

const getPrice = (product: any, regionCurrency = "brl") => {
  const variant = product.variants?.[0]
  const calc = variant?.calculated_price
  if (calc?.calculated_amount != null) {
    return convertToLocale({
      amount: calc.calculated_amount,
      currency_code: calc.currency_code || regionCurrency,
    })
  }
  const price = variant?.prices?.find(
    (p: any) => p.currency_code === regionCurrency
  )
  if (price) {
    return convertToLocale({
      amount: price.amount,
      currency_code: regionCurrency,
    })
  }
  return null
}

const Stars = ({ value = 4.8 }: { value?: number }) => (
  <div className="flex items-center gap-0.5 text-gorila-orange">
    {[1, 2, 3, 4, 5].map((i) => (
      <svg
        key={i}
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill={i <= Math.round(value) ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ))}
  </div>
)

export default function GorilaProductCard({ product, region }: Props) {
  const price = getPrice(product, region?.currency_code)
  const badge = (product.metadata as any)?.badge as string | undefined
  const reviewCount = Math.floor(50 + Math.random() * 500)

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group block bg-white"
    >
      <div className="relative aspect-square bg-gorila-pearl overflow-hidden rounded-md">
        {badge && (
          <span
            className={`absolute top-3 left-3 z-10 px-2 py-1 text-[10px] font-black uppercase tracking-wider rounded ${
              badge === "BEST SELLER"
                ? "bg-gorila-orange text-gorila-ink"
                : "bg-emerald-500 text-white"
            }`}
          >
            {badge === "BEST SELLER" ? "Mais vendido" : "Novidade"}
          </span>
        )}
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gorila-mist text-xs">
            Sem imagem
          </div>
        )}
      </div>

      <div className="pt-4 pb-2">
        <h3 className="text-sm font-semibold text-gorila-ink leading-snug line-clamp-2 group-hover:text-gorila-orange transition">
          {product.title}
        </h3>
        <div className="flex items-center gap-2 mt-1.5">
          <Stars value={4.8} />
          <span className="text-xs text-gorila-mist">
            ({reviewCount} avaliações)
          </span>
        </div>
        {price && (
          <p className="mt-2 text-base font-bold text-gorila-ink">{price}</p>
        )}
      </div>
    </LocalizedClientLink>
  )
}
