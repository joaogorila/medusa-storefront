"use client"

import { sdk } from "@lib/config"
import {
  maskBrDate,
  maskBrPhone,
  maskCEP,
  maskCNPJ,
  maskCPF,
} from "@lib/util/br/masks"
import {
  isValidBrDate,
  isValidBrPhone,
  isValidCEP,
  isValidCNPJ,
  isValidCPF,
  onlyDigits,
} from "@lib/util/br/validators"
import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Checkbox from "@modules/common/components/checkbox"
import Input from "@modules/common/components/input"
import { mapKeys } from "lodash"
import React, { useEffect, useMemo, useState } from "react"
import AddressSelect from "../address-select"

type TipoPessoa = "PF" | "PJ"

type ViaCepResp = {
  cep?: string
  logradouro?: string
  complemento?: string
  bairro?: string
  cidade?: string
  uf?: string
  ibge?: string
  message?: string
}

const ShippingAddress = ({
  customer,
  cart,
  checked,
  onChange,
}: {
  customer: HttpTypes.StoreCustomer | null
  cart: HttpTypes.StoreCart | null
  checked: boolean
  onChange: () => void
}) => {
  const [tipoPessoa, setTipoPessoa] = useState<TipoPessoa>("PF")
  const [ieIsento, setIeIsento] = useState(false)
  const [cepLoading, setCepLoading] = useState(false)
  const [cepError, setCepError] = useState<string | null>(null)
  const [docError, setDocError] = useState<string | null>(null)
  const [phoneError, setPhoneError] = useState<string | null>(null)
  const [birthError, setBirthError] = useState<string | null>(null)

  const [formData, setFormData] = useState<Record<string, any>>({
    "shipping_address.first_name": cart?.shipping_address?.first_name || "",
    "shipping_address.last_name": cart?.shipping_address?.last_name || "",
    "shipping_address.address_1": cart?.shipping_address?.address_1 || "",
    "shipping_address.address_2": cart?.shipping_address?.address_2 || "",
    "shipping_address.company": cart?.shipping_address?.company || "",
    "shipping_address.postal_code": cart?.shipping_address?.postal_code || "",
    "shipping_address.city": cart?.shipping_address?.city || "",
    "shipping_address.country_code":
      cart?.shipping_address?.country_code || "br",
    "shipping_address.province": cart?.shipping_address?.province || "",
    "shipping_address.phone": cart?.shipping_address?.phone || "",
    email: cart?.email || "",
    br_cpf: "",
    br_cnpj: "",
    br_razao_social: "",
    br_nome_fantasia: "",
    br_inscricao_estadual: "",
    br_data_nascimento: "",
  })

  const countriesInRegion = useMemo(
    () => cart?.region?.countries?.map((c) => c.iso_2),
    [cart?.region]
  )

  const addressesInRegion = useMemo(
    () =>
      customer?.addresses.filter(
        (a) => a.country_code && countriesInRegion?.includes(a.country_code)
      ),
    [customer?.addresses, countriesInRegion]
  )

  const setFormAddress = (
    address?: HttpTypes.StoreCartAddress,
    email?: string
  ) => {
    if (address) {
      setFormData((prev) => ({
        ...prev,
        "shipping_address.first_name": address?.first_name || "",
        "shipping_address.last_name": address?.last_name || "",
        "shipping_address.address_1": address?.address_1 || "",
        "shipping_address.address_2": address?.address_2 || "",
        "shipping_address.company": address?.company || "",
        "shipping_address.postal_code": address?.postal_code
          ? maskCEP(address.postal_code)
          : "",
        "shipping_address.city": address?.city || "",
        "shipping_address.country_code": address?.country_code || "br",
        "shipping_address.province": address?.province || "",
        "shipping_address.phone": address?.phone
          ? maskBrPhone(address.phone)
          : "",
      }))
    }
    if (email) {
      setFormData((prev) => ({ ...prev, email }))
    }
  }

  useEffect(() => {
    if (cart && cart.shipping_address) {
      setFormAddress(cart?.shipping_address, cart?.email || undefined)
    }
    if (cart && !cart.email && customer?.email) {
      setFormAddress(undefined, customer.email)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart])

  const handleMasked =
    (key: string, mask: (v: string) => string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [key]: mask(e.target.value) }))
    }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const lookupCep = async () => {
    setCepError(null)
    const cep = onlyDigits(formData["shipping_address.postal_code"])
    if (cep.length !== 8) return

    setCepLoading(true)
    try {
      const data = await sdk.client.fetch<ViaCepResp>(`/store/br/cep/${cep}`, {
        method: "GET",
      })
      if (data?.logradouro || data?.cidade || data?.uf) {
        setFormData((prev) => ({
          ...prev,
          "shipping_address.address_1": data.logradouro || prev["shipping_address.address_1"],
          "shipping_address.city": data.cidade || prev["shipping_address.city"],
          "shipping_address.province": data.uf || prev["shipping_address.province"],
        }))
      }
    } catch (err: any) {
      setCepError("CEP não encontrado")
    } finally {
      setCepLoading(false)
    }
  }

  const validateDoc = () => {
    if (tipoPessoa === "PF") {
      if (!formData.br_cpf) return setDocError("CPF é obrigatório")
      if (!isValidCPF(formData.br_cpf)) return setDocError("CPF inválido")
      setDocError(null)
    } else {
      if (!formData.br_cnpj) return setDocError("CNPJ é obrigatório")
      if (!isValidCNPJ(formData.br_cnpj)) return setDocError("CNPJ inválido")
      setDocError(null)
    }
  }

  const validatePhone = () => {
    if (formData["shipping_address.phone"] && !isValidBrPhone(formData["shipping_address.phone"])) {
      setPhoneError("Telefone inválido")
    } else {
      setPhoneError(null)
    }
  }

  const validateBirth = () => {
    if (formData.br_data_nascimento && !isValidBrDate(formData.br_data_nascimento)) {
      setBirthError("Data inválida (use dd/mm/aaaa)")
    } else {
      setBirthError(null)
    }
  }

  return (
    <>
      {customer && (addressesInRegion?.length || 0) > 0 && (
        <Container className="mb-6 flex flex-col gap-y-4 p-5">
          <p className="text-small-regular">
            {`Olá ${customer.first_name}, deseja usar um dos seus endereços salvos?`}
          </p>
          <AddressSelect
            addresses={customer.addresses}
            addressInput={
              mapKeys(formData, (_, key) =>
                key.replace("shipping_address.", "")
              ) as HttpTypes.StoreCartAddress
            }
            onSelect={setFormAddress}
          />
        </Container>
      )}

      {/* Toggle PF/PJ */}
      <div className="mb-6">
        <p className="txt-medium-plus text-ui-fg-base mb-2">Tipo de cadastro</p>
        <div className="inline-flex rounded-md border border-ui-border-base overflow-hidden">
          <button
            type="button"
            onClick={() => setTipoPessoa("PF")}
            className={`px-5 py-2 text-sm transition ${
              tipoPessoa === "PF"
                ? "bg-ui-bg-base-pressed text-ui-fg-base"
                : "bg-ui-bg-base text-ui-fg-subtle hover:bg-ui-bg-base-hover"
            }`}
            data-testid="tipo-pessoa-pf"
          >
            Pessoa Física
          </button>
          <button
            type="button"
            onClick={() => setTipoPessoa("PJ")}
            className={`px-5 py-2 text-sm transition border-l border-ui-border-base ${
              tipoPessoa === "PJ"
                ? "bg-ui-bg-base-pressed text-ui-fg-base"
                : "bg-ui-bg-base text-ui-fg-subtle hover:bg-ui-bg-base-hover"
            }`}
            data-testid="tipo-pessoa-pj"
          >
            Pessoa Jurídica
          </button>
        </div>
        <input type="hidden" name="br_tipo_pessoa" value={tipoPessoa} />
      </div>

      {/* Campos PF/PJ */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {tipoPessoa === "PF" ? (
          <>
            <Input
              label="Nome"
              name="shipping_address.first_name"
              autoComplete="given-name"
              value={formData["shipping_address.first_name"]}
              onChange={handleChange}
              required
              data-testid="shipping-first-name-input"
            />
            <Input
              label="Sobrenome"
              name="shipping_address.last_name"
              autoComplete="family-name"
              value={formData["shipping_address.last_name"]}
              onChange={handleChange}
              required
              data-testid="shipping-last-name-input"
            />
            <Input
              label="CPF"
              name="br_cpf"
              inputMode="numeric"
              value={formData.br_cpf}
              onChange={handleMasked("br_cpf", maskCPF)}
              onBlur={validateDoc}
              required
              data-testid="br-cpf-input"
            />
            <Input
              label="Data de nascimento (dd/mm/aaaa)"
              name="br_data_nascimento"
              inputMode="numeric"
              value={formData.br_data_nascimento}
              onChange={handleMasked("br_data_nascimento", maskBrDate)}
              onBlur={validateBirth}
              data-testid="br-data-nascimento-input"
            />
          </>
        ) : (
          <>
            <Input
              label="Razão Social"
              name="br_razao_social"
              value={formData.br_razao_social}
              onChange={handleChange}
              required
              data-testid="br-razao-social-input"
            />
            <Input
              label="Nome Fantasia"
              name="br_nome_fantasia"
              value={formData.br_nome_fantasia}
              onChange={handleChange}
              data-testid="br-nome-fantasia-input"
            />
            <Input
              label="CNPJ"
              name="br_cnpj"
              inputMode="numeric"
              value={formData.br_cnpj}
              onChange={handleMasked("br_cnpj", maskCNPJ)}
              onBlur={validateDoc}
              required
              data-testid="br-cnpj-input"
            />
            <div className="flex flex-col w-full">
              <Input
                label="Inscrição Estadual"
                name="br_inscricao_estadual"
                value={ieIsento ? "ISENTO" : formData.br_inscricao_estadual}
                onChange={handleChange}
                disabled={ieIsento}
                data-testid="br-ie-input"
              />
              <label className="flex items-center gap-2 mt-2 text-xs text-ui-fg-subtle">
                <input
                  type="checkbox"
                  checked={ieIsento}
                  onChange={(e) => setIeIsento(e.target.checked)}
                  data-testid="br-ie-isento"
                />
                Isento de Inscrição Estadual
              </label>
            </div>
            {/* Campos espelhados pra split razão social no shipping_address */}
            <input
              type="hidden"
              name="shipping_address.first_name"
              value={formData.br_razao_social.split(" ")[0] || "Empresa"}
            />
            <input
              type="hidden"
              name="shipping_address.last_name"
              value={
                formData.br_razao_social.split(" ").slice(1).join(" ") ||
                "—"
              }
            />
          </>
        )}
      </div>

      {docError && (
        <p className="text-sm text-rose-500 mb-3" data-testid="doc-error">
          {docError}
        </p>
      )}

      {/* Endereço */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 sm:col-span-1">
          <Input
            label="CEP"
            name="shipping_address.postal_code"
            autoComplete="postal-code"
            inputMode="numeric"
            value={formData["shipping_address.postal_code"]}
            onChange={handleMasked("shipping_address.postal_code", maskCEP)}
            onBlur={lookupCep}
            required
            data-testid="shipping-postal-code-input"
          />
          {cepLoading && (
            <p className="text-xs text-ui-fg-subtle mt-1">Buscando CEP…</p>
          )}
          {cepError && (
            <p className="text-xs text-rose-500 mt-1" data-testid="cep-error">
              {cepError}
            </p>
          )}
        </div>
        <Input
          label="Cidade"
          name="shipping_address.city"
          autoComplete="address-level2"
          value={formData["shipping_address.city"]}
          onChange={handleChange}
          required
          data-testid="shipping-city-input"
        />
        <Input
          label="Estado (UF)"
          name="shipping_address.province"
          autoComplete="address-level1"
          value={formData["shipping_address.province"]}
          onChange={handleChange}
          required
          maxLength={2}
          data-testid="shipping-province-input"
        />
        <Input
          label="Endereço (rua, avenida)"
          name="shipping_address.address_1"
          autoComplete="address-line1"
          value={formData["shipping_address.address_1"]}
          onChange={handleChange}
          required
          data-testid="shipping-address-input"
        />
        <Input
          label="Número e complemento"
          name="shipping_address.address_2"
          autoComplete="address-line2"
          value={formData["shipping_address.address_2"]}
          onChange={handleChange}
          required
          data-testid="shipping-address-2-input"
        />
        <input
          type="hidden"
          name="shipping_address.country_code"
          value={formData["shipping_address.country_code"] || "br"}
        />
        {tipoPessoa === "PJ" && (
          <input
            type="hidden"
            name="shipping_address.company"
            value={formData.br_razao_social || formData["shipping_address.company"]}
          />
        )}
      </div>

      <div className="my-8">
        <Checkbox
          label="Endereço de cobrança igual ao de entrega"
          name="same_as_billing"
          checked={checked}
          onChange={onChange}
          data-testid="billing-address-checkbox"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <Input
          label="E-mail"
          name="email"
          type="email"
          title="Insira um endereço de e-mail válido."
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          required
          data-testid="shipping-email-input"
        />
        <div className="flex flex-col w-full">
          <Input
            label="Telefone"
            name="shipping_address.phone"
            autoComplete="tel"
            inputMode="numeric"
            value={formData["shipping_address.phone"]}
            onChange={handleMasked("shipping_address.phone", maskBrPhone)}
            onBlur={validatePhone}
            required
            data-testid="shipping-phone-input"
          />
          {phoneError && (
            <p className="text-xs text-rose-500 mt-1" data-testid="phone-error">
              {phoneError}
            </p>
          )}
        </div>
      </div>

      {birthError && (
        <p className="text-sm text-rose-500 mb-3" data-testid="birth-error">
          {birthError}
        </p>
      )}
    </>
  )
}

export default ShippingAddress
