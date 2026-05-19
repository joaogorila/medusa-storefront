import { sdk } from "@lib/config"
import { getCacheOptions } from "./cookies"

export type ProductExtras = {
  id?: string
  product_id?: string
  ncm?: string | null
  cest?: string | null
  ean_gtin?: string | null
  origem?: string | null
  modelo?: string | null
  fabricante?: string | null
  brand?: string | null
  google_product_category?: string | null
  product_type?: string | null
  condition?: "new" | "refurbished" | "used"
  gender?: "male" | "female" | "unisex" | null
  age_group?: string | null
  mpn?: string | null
  color?: string | null
  size?: string | null
  item_group_id?: string | null
  adult_content?: boolean
  compare_at_price?: number | null
  cost_per_item?: number | null
  sale_price?: number | null
  sale_price_start?: string | null
  sale_price_end?: string | null
  frete_gratis?: boolean
  qtd_minima_pedido?: number
  meta_title?: string | null
  meta_description?: string | null
  meta_keywords?: string | null
  garantia_periodo?: string | null
  garantia_tipo?:
    | "fabricante"
    | "loja"
    | "estendida"
    | "sem_garantia"
    | null
  manual_url?: string | null
  video_url?: string | null
  peso_bruto_kg?: number | null
  caixa_largura_cm?: number | null
  caixa_altura_cm?: number | null
  caixa_profundidade_cm?: number | null
  especificacoes?: { label: string; value: string }[] | null
}

export async function getProductExtras(
  productHandle: string
): Promise<ProductExtras | null> {
  const next = { ...(await getCacheOptions("products")) }
  try {
    const { products } = await sdk.client.fetch<{
      products: Array<{ id: string; product_extras?: ProductExtras | null }>
    }>(`/store/products`, {
      query: {
        handle: productHandle,
        fields: "id,+product_extras.*",
        limit: 1,
      },
      next,
      cache: "force-cache",
    })
    return products?.[0]?.product_extras || null
  } catch {
    return null
  }
}
