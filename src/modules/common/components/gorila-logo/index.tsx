import { clx } from "@medusajs/ui"

type Props = {
  variant?: "horizontal" | "compact" | "icon"
  className?: string
  iconClassName?: string
  textClassName?: string
}

const ShieldIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Escudo preto outline */}
    <path
      d="M32 4 L56 12 V32 C56 46 45 56 32 60 C19 56 8 46 8 32 V12 Z"
      fill="#0a0a0a"
      stroke="#0a0a0a"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Interior do escudo */}
    <path
      d="M32 10 L50 16 V32 C50 43 41 51 32 54 C23 51 14 43 14 32 V16 Z"
      fill="#f59e0b"
    />
    {/* Silhueta do gorila simplificada */}
    <path
      d="M22 28 Q24 22 30 22 Q34 22 36 24 Q40 23 42 27 Q43 32 40 35 L40 40 Q35 44 30 44 Q24 44 22 40 L20 36 Q19 31 22 28 Z M28 30 Q29 33 32 33 Q35 33 36 30"
      fill="#0a0a0a"
    />
    <circle cx="28" cy="29" r="1.5" fill="#f59e0b" />
    <circle cx="35" cy="29" r="1.5" fill="#f59e0b" />
  </svg>
)

export default function GorilaLogo({
  variant = "horizontal",
  className = "",
  iconClassName = "",
  textClassName = "",
}: Props) {
  if (variant === "icon") {
    return <ShieldIcon className={clx("w-8 h-8", iconClassName, className)} />
  }

  if (variant === "compact") {
    return (
      <div className={clx("flex items-center gap-2", className)}>
        <ShieldIcon className={clx("w-7 h-7 shrink-0", iconClassName)} />
        <span
          className={clx(
            "font-black text-base tracking-tight uppercase leading-none",
            textClassName
          )}
        >
          Gorila
          <span className="text-gorila-orange">Shield</span>
        </span>
      </div>
    )
  }

  return (
    <div className={clx("flex items-center gap-3", className)}>
      <ShieldIcon className={clx("w-10 h-10 shrink-0", iconClassName)} />
      <div className={clx("flex flex-col leading-none", textClassName)}>
        <span className="font-black text-lg tracking-tight uppercase">
          Gorila<span className="text-gorila-orange">Shield</span>
        </span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-gorila-mist mt-0.5">
          Built for Mission
        </span>
      </div>
    </div>
  )
}
