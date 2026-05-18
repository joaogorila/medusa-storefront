import { convertToLocale } from "@lib/util/money"
import DiscountCode from "@modules/checkout/components/discount-code"
import Thumbnail from "@modules/products/components/thumbnail"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  const items = cart?.items || []

  return (
    <div className="sticky top-6 flex flex-col gap-4">
      <div className="bg-white border border-ui-border-base rounded-lg overflow-hidden">
        <div className="p-5 border-b border-ui-border-base">
          <h2 className="text-base font-semibold text-ui-fg-base">
            Resumo do pedido
          </h2>
          <p className="text-xs text-ui-fg-subtle">
            {items.length} {items.length === 1 ? "item" : "itens"}
          </p>
        </div>

        <ul className="divide-y divide-ui-border-base">
          {items.map((item: any) => (
            <li
              key={item.id}
              className="flex items-start gap-3 p-4"
              data-testid="cart-item"
            >
              <div className="w-14 h-14 rounded border border-ui-border-base shrink-0 overflow-hidden bg-ui-bg-base">
                <Thumbnail
                  thumbnail={item.thumbnail}
                  images={item.variant?.product?.images}
                  size="square"
                  className="!w-full !h-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ui-fg-base truncate">
                  {item.product_title || item.title}
                </p>
                <p className="text-xs text-ui-fg-subtle truncate">
                  {item.variant_title}
                </p>
                <p className="text-xs text-ui-fg-subtle">Qtd: {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold text-ui-fg-base">
                {convertToLocale({
                  amount: item.subtotal ?? item.unit_price * item.quantity,
                  currency_code: cart.currency_code,
                })}
              </p>
            </li>
          ))}
        </ul>

        <div className="p-5 border-t border-ui-border-base">
          <DiscountCode cart={cart} />
        </div>

        <div className="p-5 border-t border-ui-border-base flex flex-col gap-2 text-sm">
          <Row
            label="Subtotal"
            value={convertToLocale({
              amount: cart.item_subtotal ?? 0,
              currency_code: cart.currency_code,
            })}
          />
          <Row
            label="Frete"
            value={
              cart.shipping_subtotal
                ? convertToLocale({
                    amount: cart.shipping_subtotal,
                    currency_code: cart.currency_code,
                  })
                : "A calcular"
            }
          />
          {!!cart.discount_subtotal && (
            <Row
              label="Desconto"
              value={`- ${convertToLocale({
                amount: cart.discount_subtotal,
                currency_code: cart.currency_code,
              })}`}
              valueClass="text-emerald-700"
            />
          )}
          {!!cart.tax_total && (
            <Row
              label="Impostos"
              value={convertToLocale({
                amount: cart.tax_total,
                currency_code: cart.currency_code,
              })}
            />
          )}
        </div>

        <div className="p-5 border-t border-ui-border-base bg-ui-bg-base">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-ui-fg-subtle">Total</span>
            <span
              className="text-2xl font-bold text-ui-fg-base"
              data-testid="cart-total"
              data-value={cart.total || 0}
            >
              {convertToLocale({
                amount: cart.total ?? 0,
                currency_code: cart.currency_code,
              })}
            </span>
          </div>
          <p className="text-xs text-ui-fg-subtle mt-1">
            ou no Pix com aprovação imediata
          </p>
        </div>
      </div>

      {/* Selo de segurança */}
      <div className="bg-white border border-ui-border-base rounded-lg p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-emerald-700"
          >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold text-ui-fg-base">
            Compra 100% segura
          </p>
          <p className="text-xs text-ui-fg-subtle">
            Dados protegidos com SSL 256 bits
          </p>
        </div>
      </div>
    </div>
  )
}

const Row = ({
  label,
  value,
  valueClass = "",
}: {
  label: string
  value: string
  valueClass?: string
}) => (
  <div className="flex items-center justify-between">
    <span className="text-ui-fg-subtle">{label}</span>
    <span className={`font-medium text-ui-fg-base ${valueClass}`}>{value}</span>
  </div>
)

export default CheckoutSummary
