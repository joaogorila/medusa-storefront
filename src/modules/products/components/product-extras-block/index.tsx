import { ProductExtras } from "@lib/data/product-extras"
import { convertToLocale } from "@lib/util/money"

const youtubeId = (url: string): string | null => {
  const m = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  )
  return m?.[1] || null
}

export default function ProductExtrasBlock({
  extras,
}: {
  extras: ProductExtras | null
}) {
  if (!extras) return null

  const ytId = extras.video_url ? youtubeId(extras.video_url) : null
  const hasSpecs = !!extras.especificacoes?.length

  return (
    <div className="space-y-12">
      {hasSpecs && (
        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-gorila-orange mb-2">
            Especificações técnicas
          </h3>
          <h4 className="text-2xl font-black uppercase text-gorila-ink mb-5">
            Ficha técnica completa
          </h4>
          <div className="bg-white border border-gorila-stone rounded-lg overflow-hidden">
            <dl className="divide-y divide-gorila-stone">
              {extras.especificacoes!.map((s, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-1 sm:gap-4 px-5 py-3"
                >
                  <dt className="text-sm font-semibold text-gorila-mist">
                    {s.label}
                  </dt>
                  <dd className="text-sm text-gorila-ink">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {ytId && (
        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-gorila-orange mb-2">
            Vídeo do produto
          </h3>
          <h4 className="text-2xl font-black uppercase text-gorila-ink mb-5">
            Veja em ação
          </h4>
          <div className="relative w-full aspect-video bg-gorila-ink rounded-lg overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${ytId}`}
              title="Vídeo do produto"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </section>
      )}

      {(extras.brand ||
        extras.fabricante ||
        extras.modelo ||
        extras.ean_gtin ||
        extras.ncm ||
        extras.garantia_periodo ||
        extras.peso_bruto_kg) && (
        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-gorila-orange mb-2">
            Dados do produto
          </h3>
          <h4 className="text-2xl font-black uppercase text-gorila-ink mb-5">
            Informações comerciais
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <DataChip label="Marca" value={extras.brand} />
            <DataChip label="Fabricante" value={extras.fabricante} />
            <DataChip label="Modelo" value={extras.modelo} />
            <DataChip label="EAN / GTIN" value={extras.ean_gtin} />
            <DataChip label="NCM" value={extras.ncm} />
            <DataChip
              label="Condição"
              value={
                extras.condition === "refurbished"
                  ? "Recondicionado"
                  : extras.condition === "used"
                  ? "Usado"
                  : extras.condition === "new"
                  ? "Novo"
                  : null
              }
            />
            <DataChip
              label="Garantia"
              value={
                extras.garantia_periodo
                  ? `${extras.garantia_periodo}${
                      extras.garantia_tipo === "fabricante"
                        ? " (fabricante)"
                        : extras.garantia_tipo === "loja"
                        ? " (loja)"
                        : extras.garantia_tipo === "estendida"
                        ? " (estendida)"
                        : ""
                    }`
                  : null
              }
            />
            <DataChip
              label="Peso bruto"
              value={
                extras.peso_bruto_kg != null
                  ? `${extras.peso_bruto_kg} kg`
                  : null
              }
            />
            <DataChip
              label="Dimensões da caixa"
              value={
                extras.caixa_largura_cm &&
                extras.caixa_altura_cm &&
                extras.caixa_profundidade_cm
                  ? `${extras.caixa_largura_cm} × ${extras.caixa_altura_cm} × ${extras.caixa_profundidade_cm} cm`
                  : null
              }
            />
          </div>
        </section>
      )}

      {extras.manual_url && (
        <section>
          <a
            href={extras.manual_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gorila-orange hover:text-gorila-orange-hover transition"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Baixar manual em PDF
          </a>
        </section>
      )}
    </div>
  )
}

const DataChip = ({
  label,
  value,
}: {
  label: string
  value?: string | null
}) => {
  if (!value) return null
  return (
    <div className="bg-white border border-gorila-stone rounded-md p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-gorila-mist">
        {label}
      </p>
      <p className="text-sm font-semibold text-gorila-ink mt-0.5">{value}</p>
    </div>
  )
}

// JSON-LD schema.org Product (rich snippets para Google)
export function ProductJsonLd({
  product,
  extras,
  price,
  currency,
  url,
}: {
  product: { title: string; description?: string; thumbnail?: string }
  extras: ProductExtras | null
  price: number
  currency: string
  url: string
}) {
  const json: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.thumbnail,
    brand: {
      "@type": "Brand",
      name: extras?.brand || "GorilaShield",
    },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: currency.toUpperCase(),
      price: price.toFixed(2),
      availability: "https://schema.org/InStock",
      itemCondition:
        extras?.condition === "used"
          ? "https://schema.org/UsedCondition"
          : extras?.condition === "refurbished"
          ? "https://schema.org/RefurbishedCondition"
          : "https://schema.org/NewCondition",
    },
  }
  if (extras?.ean_gtin) json.gtin13 = extras.ean_gtin
  if (extras?.mpn) json.mpn = extras.mpn
  if (extras?.fabricante)
    json.manufacturer = { "@type": "Organization", name: extras.fabricante }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  )
}

// Componente para o preço "de R$ X por R$ Y" com riscado
export function PriceWithCompare({
  price,
  comparePrice,
  currency,
}: {
  price: number
  comparePrice?: number | null
  currency: string
}) {
  const showCompare = comparePrice != null && comparePrice > price
  const discount = showCompare
    ? Math.round((1 - price / comparePrice!) * 100)
    : 0
  return (
    <div className="space-y-1">
      {showCompare && (
        <div className="flex items-center gap-2 text-sm text-gorila-mist">
          <span className="line-through">
            {convertToLocale({ amount: comparePrice!, currency_code: currency })}
          </span>
          <span className="px-1.5 py-0.5 bg-gorila-orange text-gorila-ink text-[10px] font-black rounded">
            -{discount}%
          </span>
        </div>
      )}
      <p className="text-3xl font-black text-gorila-ink">
        {convertToLocale({ amount: price, currency_code: currency })}
      </p>
    </div>
  )
}
