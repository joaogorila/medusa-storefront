import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full bg-neutral-50 min-h-screen flex flex-col">
      {/* Header minimal */}
      <header className="h-16 bg-white border-b border-ui-border-base shrink-0">
        <nav className="flex h-full items-center content-container justify-between">
          <LocalizedClientLink
            href="/cart"
            className="text-xs sm:text-sm flex items-center gap-x-2 text-ui-fg-subtle hover:text-ui-fg-base"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="hidden sm:inline">Voltar ao carrinho</span>
            <span className="sm:hidden">Voltar</span>
          </LocalizedClientLink>

          <LocalizedClientLink
            href="/"
            className="text-base font-semibold uppercase tracking-wider text-ui-fg-base"
            data-testid="store-link"
          >
            Medusa Store
          </LocalizedClientLink>

          <div className="flex items-center gap-2 text-xs text-emerald-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span className="hidden sm:inline">Compra 100% segura</span>
          </div>
        </nav>
      </header>

      {/* Conteúdo */}
      <main
        className="flex-1 relative"
        data-testid="checkout-container"
      >
        {children}
      </main>

      {/* Footer com selos */}
      <footer className="border-t border-ui-border-base bg-white py-6">
        <div className="content-container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-ui-fg-subtle">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>
              Seus dados estão protegidos com criptografia SSL de 256 bits
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <span className="text-xs text-ui-fg-subtle mr-2">
              Formas de pagamento:
            </span>
            <PaymentBadge label="Pix" />
            <PaymentBadge label="Visa" />
            <PaymentBadge label="Master" />
            <PaymentBadge label="Elo" />
            <PaymentBadge label="Boleto" />
          </div>
        </div>
      </footer>
    </div>
  )
}

const PaymentBadge = ({ label }: { label: string }) => (
  <span className="inline-flex items-center justify-center h-7 px-2 text-[10px] font-semibold uppercase tracking-wide border border-ui-border-base rounded bg-white text-ui-fg-subtle">
    {label}
  </span>
)
