import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div>
      {/* Page header */}
      <div className="bg-gorila-ink text-white py-12">
        <div className="content-container">
          <span className="text-xs font-bold uppercase tracking-widest text-gorila-orange">
            Loja completa
          </span>
          <h1
            className="text-3xl md:text-4xl font-black uppercase mt-2"
            data-testid="store-page-title"
          >
            Todos os produtos
          </h1>
          <p className="text-sm text-gorila-mist mt-2 max-w-xl">
            Mochilas táticas, EDC, iluminação e acessórios. Garantia vitalícia.
          </p>
        </div>
      </div>

      <div
        className="content-container py-10 flex flex-col small:flex-row small:items-start gap-8"
        data-testid="category-container"
      >
        <aside className="small:w-60 small:shrink-0">
          <RefinementList sortBy={sort} />
        </aside>
        <div className="w-full">
          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              countryCode={countryCode}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default StoreTemplate
