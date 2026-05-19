import { HttpTypes } from "@medusajs/types"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct & { metadata?: Record<string, any> | null }
}

const Stars = ({ value = 4.8 }: { value?: number }) => (
  <div className="flex items-center gap-0.5 text-gorila-orange">
    {[1, 2, 3, 4, 5].map((i) => (
      <svg
        key={i}
        width="14"
        height="14"
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

const ProductInfo = ({ product }: ProductInfoProps) => {
  const badge = (product.metadata as any)?.badge as string | undefined
  const reviewCount = Math.floor(50 + Math.random() * 500)

  return (
    <div id="product-info" className="flex flex-col gap-3">
      {badge && (
        <span
          className={`inline-block w-fit px-2 py-1 text-[10px] font-black uppercase tracking-wider rounded ${
            badge === "BEST SELLER"
              ? "bg-gorila-orange text-gorila-ink"
              : "bg-emerald-500 text-white"
          }`}
        >
          {badge === "BEST SELLER" ? "Mais vendido" : "Novidade"}
        </span>
      )}

      <h1
        className="text-2xl md:text-3xl font-black uppercase tracking-tight text-gorila-ink leading-tight"
        data-testid="product-title"
      >
        {product.title}
      </h1>

      <div className="flex items-center gap-2">
        <Stars value={4.8} />
        <a
          href="#reviews"
          className="text-xs text-gorila-mist hover:text-gorila-orange transition"
        >
          {reviewCount} avaliações
        </a>
      </div>

      {product.description && (
        <p
          className="text-sm text-gorila-mist leading-relaxed mt-2 line-clamp-3"
          data-testid="product-description"
        >
          {product.description}
        </p>
      )}
    </div>
  )
}

export default ProductInfo
