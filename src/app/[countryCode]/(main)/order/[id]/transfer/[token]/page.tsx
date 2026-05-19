import { Heading, Text } from "@medusajs/ui"
import TransferActions from "@modules/order/components/transfer-actions"
import TransferImage from "@modules/order/components/transfer-image"

export default async function TransferPage({
  params,
}: {
  params: { id: string; token: string }
}) {
  const { id, token } = params

  return (
    <div className="flex flex-col gap-y-4 items-start w-2/5 mx-auto mt-10 mb-20">
      <TransferImage />
      <div className="flex flex-col gap-y-6">
        <Heading level="h1" className="text-xl text-zinc-900">
          Solicitação de transferência para o pedido {id}
        </Heading>
        <Text className="text-zinc-600">
          Você recebeu uma solicitação para transferir a propriedade do seu pedido ({id}).
          Se concordar com essa solicitação, pode aprovar a transferência clicando
          no botão abaixo.
        </Text>
        <div className="w-full h-px bg-zinc-200" />
        <Text className="text-zinc-600">
          Se aceitar, o novo proprietário assumirá todas as responsabilidades e
          permissões associadas a este pedido.
        </Text>
        <Text className="text-zinc-600">
          Se não reconhecer essa solicitação ou deseja manter a propriedade, nenhuma
          ação adicional é necessária.
        </Text>
        <div className="w-full h-px bg-zinc-200" />
        <TransferActions id={id} token={token} />
      </div>
    </div>
  )
}
