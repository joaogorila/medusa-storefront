import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { listCategories } from "@lib/data/categories"
import { getLocale } from "@lib/data/locale-actions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import GorilaLogo from "@modules/common/components/gorila-logo"

export default async function Nav() {
  const [regions, locales, currentLocale, categories] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
    listCategories().catch(() => []),
  ])

  const topCategories = (categories || [])
    .filter((c: any) => !c.parent_category_id)
    .slice(0, 5)

  return (
    <div className="sticky top-0 inset-x-0 z-50">
      {/* Top bar promo */}
      <div className="bg-gorila-ink text-gorila-pearl text-xs">
        <div className="content-container py-1.5 flex items-center justify-center text-center">
          <span className="font-medium tracking-wide">
            FRETE GRÁTIS em compras acima de R$ 499 · Garantia vitalícia em
            todos os produtos
          </span>
        </div>
      </div>

      {/* Header principal */}
      <header className="bg-white border-b border-gorila-stone">
        <div className="content-container">
          <nav className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile menu + logo */}
            <div className="flex items-center gap-3 lg:gap-8">
              <div className="lg:hidden">
                <SideMenu
                  regions={regions}
                  locales={locales}
                  currentLocale={currentLocale}
                />
              </div>
              <LocalizedClientLink href="/" data-testid="nav-store-link">
                <GorilaLogo
                  className="hidden sm:flex"
                  textClassName="text-gorila-ink"
                />
                <GorilaLogo
                  variant="icon"
                  iconClassName="w-9 h-9 sm:hidden"
                />
              </LocalizedClientLink>
            </div>

            {/* Nav categorias (desktop) */}
            <div className="hidden lg:flex items-center gap-8">
              <LocalizedClientLink
                href="/store"
                className="text-sm font-semibold uppercase tracking-wide text-gorila-ink hover:text-gorila-orange transition"
              >
                Todos
              </LocalizedClientLink>
              {topCategories.map((c: any) => (
                <LocalizedClientLink
                  key={c.id}
                  href={`/categories/${c.handle}`}
                  className="text-sm font-semibold uppercase tracking-wide text-gorila-ink hover:text-gorila-orange transition"
                >
                  {c.name}
                </LocalizedClientLink>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-4 lg:gap-6">
              <LocalizedClientLink
                href="/account"
                className="hidden sm:flex items-center gap-1.5 text-sm text-gorila-ink hover:text-gorila-orange transition"
                data-testid="nav-account-link"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="hidden lg:inline font-medium">Conta</span>
              </LocalizedClientLink>

              <Suspense
                fallback={
                  <LocalizedClientLink
                    href="/cart"
                    className="flex items-center gap-1.5 text-sm text-gorila-ink hover:text-gorila-orange transition"
                    data-testid="nav-cart-link"
                  >
                    <CartIcon />
                    <span className="hidden lg:inline font-medium">
                      Carrinho (0)
                    </span>
                  </LocalizedClientLink>
                }
              >
                <CartButton />
              </Suspense>
            </div>
          </nav>
        </div>
      </header>
    </div>
  )
}

const CartIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
)
