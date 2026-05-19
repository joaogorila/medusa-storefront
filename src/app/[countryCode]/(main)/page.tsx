import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import CategoryGrid from "@modules/home/components/category-grid"
import ProductsShowcase from "@modules/home/components/products-showcase"
import PromoBanner from "@modules/home/components/promo-banner"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "GorilaShield · Equipamento Tático & EDC",
  description:
    "Mochilas táticas, ferramentas EDC, iluminação e acessórios com garantia vitalícia. Equipamento brasileiro para missão diária.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  return (
    <>
      <Hero />
      <ProductsShowcase
        region={region}
        title="Mais vendidos"
        subtitle="Best Sellers"
        href="/store"
        hrefLabel="Ver todos os produtos"
        limit={4}
      />
      <CategoryGrid />
      <PromoBanner />
      <ProductsShowcase
        region={region}
        title="Lançamentos"
        subtitle="Novidades"
        href="/store"
        hrefLabel="Explorar lançamentos"
        filter="newest"
        limit={4}
      />
    </>
  )
}
