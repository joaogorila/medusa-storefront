import { notFound } from "next/navigation"
import { Suspense } from "react"

import InteractiveLink from "@modules/common/components/interactive-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

const CATEGORY_HERO_IMAGES: Record<string, string> = {
  "mochilas-taticas":
    "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1920&q=80",
  "edc-ferramentas":
    "https://images.unsplash.com/photo-1567113463300-102a7eb3cb26?w=1920&q=80",
  iluminacao:
    "https://images.unsplash.com/photo-1583248369069-9d91f1640fe6?w=1920&q=80",
  acessorios:
    "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1920&q=80",
}

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)

  const heroImg =
    CATEGORY_HERO_IMAGES[category.handle] ||
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1920&q=80"

  return (
    <div>
      {/* Category hero */}
      <div className="relative bg-gorila-ink text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt={category.name}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gorila-ink via-gorila-ink/60 to-transparent" />
        </div>

        <div className="relative content-container py-16 md:py-20">
          {/* Breadcrumbs */}
          <nav className="flex items-center text-xs text-gorila-mist mb-3 gap-2">
            <LocalizedClientLink
              href="/"
              className="hover:text-gorila-orange transition"
            >
              Início
            </LocalizedClientLink>
            <span>/</span>
            <LocalizedClientLink
              href="/store"
              className="hover:text-gorila-orange transition"
            >
              Loja
            </LocalizedClientLink>
            {parents.map((parent) => (
              <span key={parent.id} className="flex items-center gap-2">
                <span>/</span>
                <LocalizedClientLink
                  href={`/categories/${parent.handle}`}
                  className="hover:text-gorila-orange transition"
                >
                  {parent.name}
                </LocalizedClientLink>
              </span>
            ))}
            <span>/</span>
            <span className="text-white">{category.name}</span>
          </nav>

          <h1
            className="text-3xl md:text-5xl font-black uppercase tracking-tight"
            data-testid="category-page-title"
          >
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-3 text-base text-gorila-pearl/80 max-w-2xl">
              {category.description}
            </p>
          )}
        </div>
      </div>

      <div
        className="content-container py-10 flex flex-col small:flex-row small:items-start gap-8"
        data-testid="category-container"
      >
        <aside className="small:w-60 small:shrink-0">
          <RefinementList sortBy={sort} data-testid="sort-by-container" />

          {!!category.category_children?.length && (
            <div className="mt-8 pt-6 border-t border-gorila-stone">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gorila-ink mb-3">
                Subcategorias
              </h3>
              <ul className="flex flex-col gap-2">
                {category.category_children.map((c) => (
                  <li key={c.id}>
                    <InteractiveLink href={`/categories/${c.handle}`}>
                      {c.name}
                    </InteractiveLink>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
        <div className="w-full">
          <Suspense
            fallback={
              <SkeletonProductGrid
                numberOfProducts={category.products?.length ?? 8}
              />
            }
          >
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              categoryId={category.id}
              countryCode={countryCode}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
