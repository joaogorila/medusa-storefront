import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import GorilaProductCard from "@modules/products/components/gorila-product-card"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct & {
    categories?: { id: string; handle: string }[] | null
  }
  countryCode: string
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)
  if (!region) return null

  const queryParams: HttpTypes.StoreProductListParams = {
    region_id: region.id,
    is_giftcard: false,
    limit: 8,
  }
  const categoryIds = product.categories?.map((c) => c.id).filter(Boolean) as
    | string[]
    | undefined
  if (categoryIds?.length) {
    queryParams.category_id = categoryIds
  }

  const products = await listProducts({
    queryParams,
    countryCode,
  }).then(({ response }) =>
    response.products.filter((p) => p.id !== product.id).slice(0, 4)
  )

  if (!products.length) return null

  return (
    <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-4 gap-y-8">
      {products.map((p) => (
        <li key={p.id}>
          <GorilaProductCard region={region} product={p as any} />
        </li>
      ))}
    </ul>
  )
}
