import { listCategories } from "@lib/data/categories"
import { Text } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import GorilaLogo from "@modules/common/components/gorila-logo"

export default async function Footer() {
  const productCategories = await listCategories().catch(() => [])

  const topCategories = (productCategories || [])
    .filter((c: any) => !c.parent_category_id)
    .slice(0, 6)

  return (
    <footer className="bg-gorila-ink text-gorila-pearl mt-20">
      {/* Trust signals row */}
      <div className="border-b border-gorila-smoke">
        <div className="content-container py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          <TrustItem
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            }
            title="Garantia vitalícia"
            sub="Trocamos qualquer defeito de fábrica para sempre"
          />
          <TrustItem
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            }
            title="Frete grátis"
            sub="Em compras acima de R$ 499 para todo Brasil"
          />
          <TrustItem
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            }
            title="Troca facilitada"
            sub="30 dias para trocar ou devolver sem burocracia"
          />
          <TrustItem
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M2 10h20" />
              </svg>
            }
            title="Parcele em até 12x"
            sub="Pix, boleto ou cartão sem juros até 12x"
          />
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-b border-gorila-smoke">
        <div className="content-container py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-2">
              Receba ofertas exclusivas
            </h3>
            <p className="text-sm text-gorila-mist">
              Cadastre-se e ganhe 10% OFF na sua primeira compra + acesso
              antecipado a novos lançamentos.
            </p>
          </div>
          <form className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              className="flex-1 h-12 px-4 rounded-md bg-gorila-smoke border border-gorila-mist/30 text-white placeholder-gorila-mist focus:outline-none focus:border-gorila-orange transition"
            />
            <button
              type="submit"
              className="h-12 px-6 bg-gorila-orange hover:bg-gorila-orange-hover text-white font-bold text-sm uppercase tracking-wide rounded-md transition"
            >
              Quero meus 10%
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="content-container py-14 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2 md:col-span-2">
          <GorilaLogo textClassName="text-white" />
          <p className="text-sm text-gorila-mist mt-4 max-w-sm leading-relaxed">
            Equipamentos táticos e EDC desenvolvidos para missão diária.
            Qualidade militar, garantia vitalícia, design brasileiro.
          </p>
          <div className="flex gap-3 mt-6">
            <SocialIcon label="Instagram" href="#">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </SocialIcon>
            <SocialIcon label="WhatsApp" href="#">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.45L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.263l-.999 3.648 3.978-1.61z" />
              </svg>
            </SocialIcon>
            <SocialIcon label="YouTube" href="#">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
              </svg>
            </SocialIcon>
          </div>
        </div>

        <FooterCol title="Comprar">
          <FooterLink href="/store">Todos os produtos</FooterLink>
          {topCategories.map((c: any) => (
            <FooterLink key={c.id} href={`/categories/${c.handle}`}>
              {c.name}
            </FooterLink>
          ))}
        </FooterCol>

        <FooterCol title="Atendimento">
          <FooterLink href="/account">Minha conta</FooterLink>
          <FooterLink href="#">Rastreie seu pedido</FooterLink>
          <FooterLink href="#">Trocas e devoluções</FooterLink>
          <FooterLink href="#">Garantia vitalícia</FooterLink>
          <FooterLink href="#">Fale conosco</FooterLink>
        </FooterCol>

        <FooterCol title="Institucional">
          <FooterLink href="#">Sobre nós</FooterLink>
          <FooterLink href="#">Blog</FooterLink>
          <FooterLink href="#">Política de privacidade</FooterLink>
          <FooterLink href="#">Termos de uso</FooterLink>
          <FooterLink href="#">Política de cookies</FooterLink>
        </FooterCol>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gorila-smoke">
        <div className="content-container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <Text className="text-xs text-gorila-mist">
            © {new Date().getFullYear()} GorilaShield. CNPJ 00.000.000/0001-00.
            Todos os direitos reservados.
          </Text>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            <PayBadge>PIX</PayBadge>
            <PayBadge>VISA</PayBadge>
            <PayBadge>MASTER</PayBadge>
            <PayBadge>ELO</PayBadge>
            <PayBadge>AMEX</PayBadge>
            <PayBadge>HIPER</PayBadge>
            <PayBadge>BOLETO</PayBadge>
          </div>
        </div>
      </div>
    </footer>
  )
}

const TrustItem = ({
  icon,
  title,
  sub,
}: {
  icon: React.ReactNode
  title: string
  sub: string
}) => (
  <div className="flex items-start gap-3">
    <div className="text-gorila-orange shrink-0">{icon}</div>
    <div>
      <p className="text-sm font-bold leading-tight">{title}</p>
      <p className="text-xs text-gorila-mist mt-0.5 leading-snug">{sub}</p>
    </div>
  </div>
)

const FooterCol = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => (
  <div className="flex flex-col gap-3">
    <h4 className="text-xs font-bold uppercase tracking-wider text-white">
      {title}
    </h4>
    <ul className="flex flex-col gap-2">{children}</ul>
  </div>
)

const FooterLink = ({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) => (
  <li>
    <LocalizedClientLink
      href={href}
      className="text-sm text-gorila-mist hover:text-gorila-orange transition"
    >
      {children}
    </LocalizedClientLink>
  </li>
)

const SocialIcon = ({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) => (
  <a
    href={href}
    aria-label={label}
    target="_blank"
    rel="noreferrer"
    className="w-9 h-9 rounded-full border border-gorila-mist/30 flex items-center justify-center text-gorila-mist hover:text-gorila-orange hover:border-gorila-orange transition"
  >
    {children}
  </a>
)

const PayBadge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center justify-center h-7 px-2 text-[10px] font-bold uppercase tracking-wider border border-gorila-mist/30 rounded text-gorila-mist bg-gorila-steel">
    {children}
  </span>
)
