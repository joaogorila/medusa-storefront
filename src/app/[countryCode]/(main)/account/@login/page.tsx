import { Metadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"

export const metadata: Metadata = {
  title: "Entrar",
  description: "Acesse sua conta na Medusa Store.",
}

export default function Login() {
  return <LoginTemplate />
}
