"use client"

import {
  initiatePaymentSession,
  placeOrder,
  setShippingMethod,
  updateCart,
} from "@lib/data/cart"
import { lookupCep } from "@lib/data/br"
import { sdk } from "@lib/config"
import {
  maskBrDate,
  maskBrPhone,
  maskCEP,
  maskCNPJ,
  maskCPF,
} from "@lib/util/br/masks"
import {
  isValidCNPJ,
  isValidCPF,
  onlyDigits,
} from "@lib/util/br/validators"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Button, clx, Text } from "@medusajs/ui"
import { useEffect, useMemo, useState, useTransition } from "react"

type TipoPessoa = "PF" | "PJ"
type PaymentMethod = "pix" | "card" | "boleto"

type Props = {
  cart: HttpTypes.StoreCart
  customer: HttpTypes.StoreCustomer | null
  availableShippingMethods: HttpTypes.StoreCartShippingOption[]
  availablePaymentMethods: any[]
}

const SectionHeader = ({
  num,
  title,
  done,
}: {
  num: number
  title: string
  done?: boolean
}) => (
  <div className="flex items-center gap-3 mb-5">
    <div
      className={clx(
        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border",
        done
          ? "bg-emerald-600 text-white border-emerald-600"
          : "bg-white text-ui-fg-base border-ui-border-base"
      )}
    >
      {done ? "✓" : num}
    </div>
    <h2 className="text-xl font-semibold text-ui-fg-base">{title}</h2>
  </div>
)

const Field = ({
  label,
  required,
  error,
  children,
  className = "",
}: {
  label: string
  required?: boolean
  error?: string | null
  children: React.ReactNode
  className?: string
}) => (
  <label className={clx("flex flex-col gap-1", className)}>
    <span className="text-xs font-medium text-ui-fg-subtle">
      {label}
      {required && <span className="text-rose-500 ml-0.5">*</span>}
    </span>
    {children}
    {error && <span className="text-xs text-rose-500">{error}</span>}
  </label>
)

const inputClass =
  "h-11 px-3 rounded-md border border-ui-border-base bg-white text-ui-fg-base focus:outline-none focus:border-ui-fg-base transition w-full"

export default function CheckoutFormBr({
  cart,
  customer,
  availableShippingMethods,
  availablePaymentMethods,
}: Props) {
  const [isPending, startTransition] = useTransition()
  const [globalError, setGlobalError] = useState<string | null>(null)

  const [tipoPessoa, setTipoPessoa] = useState<TipoPessoa>("PF")
  const [ieIsento, setIeIsento] = useState(false)

  const [form, setForm] = useState({
    email: cart.email || customer?.email || "",
    first_name: cart.shipping_address?.first_name || customer?.first_name || "",
    last_name: cart.shipping_address?.last_name || customer?.last_name || "",
    cpf: "",
    cnpj: "",
    razao_social: "",
    nome_fantasia: "",
    inscricao_estadual: "",
    data_nascimento: "",
    telefone: cart.shipping_address?.phone
      ? maskBrPhone(cart.shipping_address.phone)
      : "",

    postal_code: cart.shipping_address?.postal_code
      ? maskCEP(cart.shipping_address.postal_code)
      : "",
    address_1: cart.shipping_address?.address_1 || "",
    address_2: cart.shipping_address?.address_2 || "",
    city: cart.shipping_address?.city || "",
    province: cart.shipping_address?.province || "",
  })

  const [docError, setDocError] = useState<string | null>(null)
  const [cepLoading, setCepLoading] = useState(false)
  const [cepError, setCepError] = useState<string | null>(null)

  const [shippingMethodId, setShippingMethodId] = useState<string | null>(
    cart.shipping_methods?.at(-1)?.shipping_option_id || null
  )
  const [shippingLoading, setShippingLoading] = useState(false)

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix")

  const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }))

  const isAddressValid = useMemo(() => {
    return (
      form.first_name &&
      form.last_name &&
      onlyDigits(form.postal_code).length === 8 &&
      form.address_1 &&
      form.address_2 &&
      form.city &&
      form.province
    )
  }, [form])

  const isIdentValid = useMemo(() => {
    if (!form.email || !form.telefone) return false
    if (tipoPessoa === "PF") return isValidCPF(form.cpf)
    return isValidCNPJ(form.cnpj) && !!form.razao_social
  }, [form, tipoPessoa])

  const totalLabel = convertToLocale({
    amount: cart.total ?? 0,
    currency_code: cart.currency_code,
  })

  const handleCepBlur = async () => {
    setCepError(null)
    const cep = onlyDigits(form.postal_code)
    if (cep.length !== 8) return

    setCepLoading(true)
    try {
      const data = await lookupCep(cep)
      if (data && (data.logradouro || data.cidade || data.uf)) {
        setForm((p) => ({
          ...p,
          address_1: data.logradouro || p.address_1,
          city: data.cidade || p.city,
          province: data.uf || p.province,
        }))
      } else {
        setCepError("CEP não encontrado")
      }
    } catch {
      setCepError("CEP não encontrado")
    } finally {
      setCepLoading(false)
    }
  }

  const handleSelectShipping = async (id: string) => {
    setShippingMethodId(id)
    setShippingLoading(true)
    try {
      await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
    } catch (e: any) {
      setGlobalError(e?.message || "Erro ao escolher entrega")
    } finally {
      setShippingLoading(false)
    }
  }

  const handlePlaceOrder = () => {
    setGlobalError(null)
    if (!isIdentValid) {
      setGlobalError("Preencha corretamente a identificação")
      return
    }
    if (!isAddressValid) {
      setGlobalError("Preencha corretamente o endereço")
      return
    }
    if (!shippingMethodId) {
      setGlobalError("Escolha uma forma de envio")
      return
    }

    startTransition(async () => {
      try {
        const addr: any = {
          first_name:
            tipoPessoa === "PJ" && form.razao_social
              ? form.razao_social.split(" ")[0]
              : form.first_name,
          last_name:
            tipoPessoa === "PJ" && form.razao_social
              ? form.razao_social.split(" ").slice(1).join(" ") || "—"
              : form.last_name,
          company: tipoPessoa === "PJ" ? form.razao_social : "",
          address_1: form.address_1,
          address_2: form.address_2,
          postal_code: onlyDigits(form.postal_code),
          city: form.city,
          province: form.province,
          country_code: "br",
          phone: onlyDigits(form.telefone),
        }

        await updateCart({
          email: form.email,
          shipping_address: addr,
          billing_address: addr,
        } as any)

        await sdk.client.fetch(`/store/carts/${cart.id}/br-data`, {
          method: "POST",
          body: {
            tipo_pessoa: tipoPessoa,
            cpf: form.cpf ? onlyDigits(form.cpf) : null,
            cnpj: form.cnpj ? onlyDigits(form.cnpj) : null,
            razao_social: form.razao_social || null,
            nome_fantasia: form.nome_fantasia || null,
            inscricao_estadual: ieIsento
              ? "ISENTO"
              : form.inscricao_estadual || null,
            data_nascimento: form.data_nascimento || null,
            telefone: form.telefone ? onlyDigits(form.telefone) : null,
          },
        })

        const mpProvider = availablePaymentMethods.find((p) =>
          p.id.includes("mercadopago")
        )
        if (mpProvider) {
          await initiatePaymentSession(cart, {
            provider_id: mpProvider.id,
            data: {
              payment_method_id: paymentMethod,
              email: form.email,
            },
          } as any)
        }

        await placeOrder()
      } catch (e: any) {
        setGlobalError(e?.message || "Erro ao finalizar pedido")
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Identificação */}
      <section className="bg-white border border-ui-border-base rounded-lg p-6">
        <SectionHeader num={1} title="Identificação" done={isIdentValid} />

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="col-span-2">
            <div className="inline-flex rounded-md border border-ui-border-base overflow-hidden">
              {(["PF", "PJ"] as TipoPessoa[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTipoPessoa(t)}
                  className={clx(
                    "px-5 py-2 text-sm transition",
                    tipoPessoa === t
                      ? "bg-ui-bg-base-pressed text-ui-fg-base"
                      : "bg-white text-ui-fg-subtle hover:bg-ui-bg-base-hover",
                    t === "PJ" && "border-l border-ui-border-base"
                  )}
                  data-testid={`tipo-pessoa-${t.toLowerCase()}`}
                >
                  {t === "PF" ? "Pessoa Física" : "Pessoa Jurídica"}
                </button>
              ))}
            </div>
          </div>

          <Field label="E-mail" required className="col-span-2 sm:col-span-1">
            <input
              type="email"
              className={inputClass}
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              data-testid="checkout-email"
            />
          </Field>

          <Field label="Telefone" required className="col-span-2 sm:col-span-1">
            <input
              type="tel"
              inputMode="numeric"
              className={inputClass}
              value={form.telefone}
              onChange={(e) => set("telefone", maskBrPhone(e.target.value))}
              placeholder="(00) 00000-0000"
              data-testid="checkout-telefone"
            />
          </Field>

          {tipoPessoa === "PF" ? (
            <>
              <Field label="Nome" required>
                <input
                  className={inputClass}
                  value={form.first_name}
                  onChange={(e) => set("first_name", e.target.value)}
                />
              </Field>
              <Field label="Sobrenome" required>
                <input
                  className={inputClass}
                  value={form.last_name}
                  onChange={(e) => set("last_name", e.target.value)}
                />
              </Field>
              <Field
                label="CPF"
                required
                error={docError}
              >
                <input
                  inputMode="numeric"
                  className={inputClass}
                  value={form.cpf}
                  onChange={(e) => set("cpf", maskCPF(e.target.value))}
                  onBlur={() =>
                    setDocError(
                      form.cpf && !isValidCPF(form.cpf) ? "CPF inválido" : null
                    )
                  }
                  placeholder="000.000.000-00"
                  data-testid="checkout-cpf"
                />
              </Field>
              <Field label="Data de nascimento">
                <input
                  inputMode="numeric"
                  className={inputClass}
                  value={form.data_nascimento}
                  onChange={(e) =>
                    set("data_nascimento", maskBrDate(e.target.value))
                  }
                  placeholder="dd/mm/aaaa"
                />
              </Field>
            </>
          ) : (
            <>
              <Field label="Razão Social" required className="col-span-2">
                <input
                  className={inputClass}
                  value={form.razao_social}
                  onChange={(e) => set("razao_social", e.target.value)}
                />
              </Field>
              <Field label="Nome Fantasia" className="col-span-2">
                <input
                  className={inputClass}
                  value={form.nome_fantasia}
                  onChange={(e) => set("nome_fantasia", e.target.value)}
                />
              </Field>
              <Field label="CNPJ" required error={docError}>
                <input
                  inputMode="numeric"
                  className={inputClass}
                  value={form.cnpj}
                  onChange={(e) => set("cnpj", maskCNPJ(e.target.value))}
                  onBlur={() =>
                    setDocError(
                      form.cnpj && !isValidCNPJ(form.cnpj)
                        ? "CNPJ inválido"
                        : null
                    )
                  }
                  placeholder="00.000.000/0000-00"
                />
              </Field>
              <div className="flex flex-col gap-1">
                <Field label="Inscrição Estadual">
                  <input
                    className={inputClass}
                    value={ieIsento ? "ISENTO" : form.inscricao_estadual}
                    onChange={(e) =>
                      set("inscricao_estadual", e.target.value)
                    }
                    disabled={ieIsento}
                  />
                </Field>
                <label className="flex items-center gap-2 text-xs text-ui-fg-subtle">
                  <input
                    type="checkbox"
                    checked={ieIsento}
                    onChange={(e) => setIeIsento(e.target.checked)}
                  />
                  Isento de Inscrição Estadual
                </label>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 2. Endereço */}
      <section className="bg-white border border-ui-border-base rounded-lg p-6">
        <SectionHeader
          num={2}
          title="Endereço de entrega"
          done={!!isAddressValid}
        />

        <div className="grid grid-cols-6 gap-4">
          <Field label="CEP" required className="col-span-6 sm:col-span-2">
            <input
              className={inputClass}
              value={form.postal_code}
              onChange={(e) => set("postal_code", maskCEP(e.target.value))}
              onBlur={handleCepBlur}
              placeholder="00000-000"
              inputMode="numeric"
              data-testid="checkout-cep"
            />
            {cepLoading && (
              <span className="text-xs text-ui-fg-subtle">Buscando CEP…</span>
            )}
            {cepError && (
              <span className="text-xs text-rose-500">{cepError}</span>
            )}
          </Field>

          <Field
            label="Endereço (rua, avenida)"
            required
            className="col-span-6 sm:col-span-4"
          >
            <input
              className={inputClass}
              value={form.address_1}
              onChange={(e) => set("address_1", e.target.value)}
            />
          </Field>

          <Field label="Número" required className="col-span-6 sm:col-span-2">
            <input
              className={inputClass}
              value={form.address_2}
              onChange={(e) => set("address_2", e.target.value)}
              placeholder="Nº e complemento"
            />
          </Field>

          <Field label="Cidade" required className="col-span-6 sm:col-span-3">
            <input
              className={inputClass}
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
            />
          </Field>

          <Field label="UF" required className="col-span-6 sm:col-span-1">
            <input
              className={inputClass}
              value={form.province}
              maxLength={2}
              onChange={(e) =>
                set("province", e.target.value.toUpperCase().slice(0, 2))
              }
            />
          </Field>
        </div>
      </section>

      {/* 3. Forma de envio */}
      <section className="bg-white border border-ui-border-base rounded-lg p-6">
        <SectionHeader
          num={3}
          title="Forma de envio"
          done={!!shippingMethodId}
        />

        {!isAddressValid ? (
          <Text className="text-sm text-ui-fg-subtle">
            Preencha o endereço para ver as opções de entrega.
          </Text>
        ) : availableShippingMethods.length === 0 ? (
          <Text className="text-sm text-ui-fg-subtle">
            Nenhuma opção de entrega disponível para este endereço.
          </Text>
        ) : (
          <div className="flex flex-col gap-2">
            {availableShippingMethods.map((m) => (
              <label
                key={m.id}
                className={clx(
                  "flex items-center justify-between border rounded-md p-3 cursor-pointer transition",
                  shippingMethodId === m.id
                    ? "border-ui-fg-base bg-ui-bg-base-pressed"
                    : "border-ui-border-base hover:border-ui-fg-subtle"
                )}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping_method"
                    checked={shippingMethodId === m.id}
                    onChange={() => handleSelectShipping(m.id)}
                  />
                  <span className="text-sm font-medium">{m.name}</span>
                </div>
                <span className="text-sm font-semibold">
                  {m.amount != null
                    ? convertToLocale({
                        amount: m.amount,
                        currency_code: cart.currency_code,
                      })
                    : "—"}
                </span>
              </label>
            ))}
            {shippingLoading && (
              <Text className="text-xs text-ui-fg-subtle">Atualizando…</Text>
            )}
          </div>
        )}
      </section>

      {/* 4. Pagamento */}
      <section className="bg-white border border-ui-border-base rounded-lg p-6">
        <SectionHeader num={4} title="Pagamento" />

        <div className="grid grid-cols-3 gap-2 mb-4">
          {(
            [
              { id: "pix", label: "Pix", sub: "Aprovação imediata" },
              { id: "card", label: "Cartão", sub: "Em breve" },
              { id: "boleto", label: "Boleto", sub: "Em breve" },
            ] as { id: PaymentMethod; label: string; sub: string }[]
          ).map((p) => {
            const disabled = p.id !== "pix"
            return (
              <button
                key={p.id}
                type="button"
                disabled={disabled}
                onClick={() => setPaymentMethod(p.id)}
                className={clx(
                  "border rounded-md p-3 text-left transition",
                  paymentMethod === p.id
                    ? "border-ui-fg-base bg-ui-bg-base-pressed"
                    : "border-ui-border-base hover:border-ui-fg-subtle",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
                data-testid={`payment-method-${p.id}`}
              >
                <div className="text-sm font-semibold">{p.label}</div>
                <div className="text-xs text-ui-fg-subtle">{p.sub}</div>
              </button>
            )
          })}
        </div>

        {paymentMethod === "pix" && (
          <div className="border border-emerald-200 bg-emerald-50 rounded-md p-4 text-sm text-emerald-900">
            Ao finalizar o pedido, geraremos um QR Code Pix com aprovação
            instantânea. Você terá 24 horas para pagar.
          </div>
        )}
      </section>

      {globalError && (
        <div className="border border-rose-200 bg-rose-50 text-rose-700 text-sm rounded-md p-3">
          {globalError}
        </div>
      )}

      <Button
        size="large"
        onClick={handlePlaceOrder}
        isLoading={isPending}
        disabled={isPending}
        className="w-full !h-14 !text-base"
        data-testid="place-order-button"
      >
        Finalizar pedido — {totalLabel}
      </Button>

      <p className="text-center text-xs text-ui-fg-subtle">
        Ao finalizar, você concorda com nossos Termos e Política de Privacidade.
      </p>
    </div>
  )
}
