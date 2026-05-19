import { clx } from "@medusajs/ui"

type Props = {
  variant?: "horizontal" | "compact" | "icon"
  className?: string
  iconClassName?: string
  textClassName?: string
  invert?: boolean
}

const ShieldImg = ({ className = "" }: { className?: string }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src="/logo-gorilashield.png"
    alt="GorilaShield"
    className={className}
    width={48}
    height={48}
  />
)

export default function GorilaLogo({
  variant = "horizontal",
  className = "",
  iconClassName = "",
  textClassName = "",
  invert = false,
}: Props) {
  if (variant === "icon") {
    return <ShieldImg className={clx("w-8 h-8", iconClassName, className)} />
  }

  if (variant === "compact") {
    return (
      <div className={clx("flex items-center gap-2", className)}>
        <ShieldImg className={clx("w-7 h-7 shrink-0", iconClassName)} />
        <span
          className={clx(
            "font-black text-base tracking-tight uppercase leading-none",
            invert ? "text-white" : "text-gorila-ink",
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
      <ShieldImg className={clx("w-11 h-11 shrink-0", iconClassName)} />
      <div className={clx("flex flex-col leading-none", textClassName)}>
        <span
          className={clx(
            "font-black text-lg tracking-tight uppercase",
            invert ? "text-white" : "text-gorila-ink"
          )}
        >
          Gorila<span className="text-gorila-orange">Shield</span>
        </span>
        <span
          className={clx(
            "text-[10px] uppercase tracking-[0.2em] mt-0.5",
            invert ? "text-gorila-mist" : "text-gorila-mist"
          )}
        >
          Built for Mission
        </span>
      </div>
    </div>
  )
}
