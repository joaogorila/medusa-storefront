import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const TrustChip = ({
  icon,
  text,
}: {
  icon: React.ReactNode
  text: string
}) => (
  <div className="flex items-center gap-2 text-xs text-gorila-mist">
    <span className="text-gorila-orange">{icon}</span>
    <span>{text}</span>
  </div>
)

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  const category = (product as any).categories?.[0]

  return (
    <>
      <div className="bg-white">
        <div className="content-container py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center text-xs text-gorila-mist gap-2 mb-6">
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
            {category && (
              <>
                <span>/</span>
                <LocalizedClientLink
                  href={`/categories/${category.handle}`}
                  className="hover:text-gorila-orange transition"
                >
                  {category.name}
                </LocalizedClientLink>
              </>
            )}
            <span>/</span>
            <span className="text-gorila-ink truncate">{product.title}</span>
          </nav>

          <div
            className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-12"
            data-testid="product-container"
          >
            {/* Galeria */}
            <div>
              <ImageGallery images={images} />
            </div>

            {/* Info + Actions sticky */}
            <div className="lg:sticky lg:top-32 lg:self-start space-y-6">
              <ProductInfo product={product} />

              <Suspense
                fallback={
                  <ProductActions
                    disabled={true}
                    product={product}
                    region={region}
                  />
                }
              >
                <ProductActionsWrapper id={product.id} region={region} />
              </Suspense>

              {/* Trust chips */}
              <div className="border-t border-gorila-stone pt-5 space-y-2.5">
                <TrustChip
                  icon={
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  }
                  text="Garantia vitalícia contra defeitos de fábrica"
                />
                <TrustChip
                  icon={
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="1" y="3" width="15" height="13" />
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                  }
                  text="Frete grátis em compras acima de R$ 499"
                />
                <TrustChip
                  icon={
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    </svg>
                  }
                  text="Troca facilitada em até 30 dias"
                />
                <TrustChip
                  icon={
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  }
                  text="Parcele em até 12x sem juros"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs (descrição completa, especificações, envio) */}
      <div className="bg-gorila-pearl py-12 border-t border-gorila-stone">
        <div className="content-container">
          <ProductTabs product={product} />
        </div>
      </div>

      {/* Relacionados */}
      <div className="content-container my-16" data-testid="related-products-container">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-gorila-orange">
            Você também vai gostar
          </span>
          <h2 className="text-2xl md:text-3xl font-black uppercase mt-1 text-gorila-ink">
            Produtos relacionados
          </h2>
        </div>
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
