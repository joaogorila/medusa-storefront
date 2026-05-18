"use client"

import { useState } from "react"

type Props = {
  qrCode?: string | null
  qrCodeBase64?: string | null
  ticketUrl?: string | null
}

export default function PixQrCode({ qrCode, qrCodeBase64, ticketUrl }: Props) {
  const [copied, setCopied] = useState(false)

  if (!qrCode && !qrCodeBase64 && !ticketUrl) return null

  const handleCopy = async () => {
    if (!qrCode) return
    try {
      await navigator.clipboard.writeText(qrCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <div className="border-2 border-emerald-500 bg-emerald-50 rounded-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl font-bold text-emerald-900">Pague com Pix</span>
        <span className="px-2 py-1 text-xs font-bold bg-emerald-600 text-white rounded">
          Aprovação imediata
        </span>
      </div>

      <p className="text-sm text-emerald-900 mb-4">
        Abra o app do seu banco, escaneie o QR Code ou copie o código abaixo.
        Você tem até 24h para pagar.
      </p>

      <div className="flex flex-col sm:flex-row gap-6 items-center">
        {qrCodeBase64 && (
          <div className="bg-white p-3 rounded-lg shrink-0">
            <img
              src={`data:image/png;base64,${qrCodeBase64}`}
              alt="QR Code Pix"
              className="w-48 h-48"
            />
          </div>
        )}

        <div className="flex-1 w-full">
          {qrCode && (
            <>
              <label className="text-xs font-medium text-emerald-900 mb-1 block">
                Pix copia e cola:
              </label>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={qrCode}
                  className="flex-1 h-11 px-3 rounded border border-emerald-300 bg-white text-xs font-mono text-ui-fg-base"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="h-11 px-4 bg-emerald-600 text-white text-sm font-semibold rounded hover:bg-emerald-700 transition shrink-0"
                >
                  {copied ? "Copiado!" : "Copiar"}
                </button>
              </div>
            </>
          )}

          {ticketUrl && (
            <a
              href={ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-xs text-emerald-700 underline"
            >
              Ver Pix no Mercado Pago →
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
