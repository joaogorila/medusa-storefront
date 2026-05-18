"use server"

import { sdk } from "@lib/config"

export type ViaCepResp = {
  cep?: string
  logradouro?: string
  complemento?: string
  bairro?: string
  cidade?: string
  uf?: string
  ibge?: string
}

export async function lookupCep(cep: string): Promise<ViaCepResp | null> {
  const raw = (cep || "").replace(/\D/g, "")
  if (raw.length !== 8) return null

  try {
    const data = await sdk.client.fetch<ViaCepResp>(`/store/br/cep/${raw}`, {
      method: "GET",
    })
    return data || null
  } catch {
    return null
  }
}
