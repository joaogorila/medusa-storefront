import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { HttpTypes } from "@medusajs/types"
import CheckoutFormBr from "@modules/checkout/components/checkout-form-br"

export default async function CheckoutForm({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) {
  if (!cart) {
    return null
  }

  const shippingMethods = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")

  return (
    <CheckoutFormBr
      cart={cart}
      customer={customer}
      availableShippingMethods={shippingMethods || []}
      availablePaymentMethods={paymentMethods || []}
    />
  )
}
