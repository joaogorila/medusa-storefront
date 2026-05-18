export const onlyDigits = (value: string): string =>
  (value || "").replace(/\D/g, "")

export const isValidCPF = (input: string): boolean => {
  const cpf = onlyDigits(input)
  if (cpf.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cpf)) return false

  const calc = (factor: number): number => {
    let total = 0
    for (let i = 0; i < factor - 1; i++) {
      total += parseInt(cpf[i], 10) * (factor - i)
    }
    const rest = (total * 10) % 11
    return rest === 10 ? 0 : rest
  }

  return calc(10) === parseInt(cpf[9], 10) && calc(11) === parseInt(cpf[10], 10)
}

export const isValidCNPJ = (input: string): boolean => {
  const cnpj = onlyDigits(input)
  if (cnpj.length !== 14) return false
  if (/^(\d)\1{13}$/.test(cnpj)) return false

  const calc = (size: number): number => {
    const nums = cnpj.substring(0, size)
    const weights =
      size === 12
        ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    let total = 0
    for (let i = 0; i < size; i++) total += parseInt(nums[i], 10) * weights[i]
    const rest = total % 11
    return rest < 2 ? 0 : 11 - rest
  }

  return (
    calc(12) === parseInt(cnpj[12], 10) && calc(13) === parseInt(cnpj[13], 10)
  )
}

export const isValidBrPhone = (input: string): boolean => {
  const d = onlyDigits(input)
  return d.length === 10 || d.length === 11
}

export const isValidCEP = (input: string): boolean => {
  return onlyDigits(input).length === 8
}

export const isValidBrDate = (input: string): boolean => {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(input)) return false
  const [dd, mm, yyyy] = input.split("/").map(Number)
  if (mm < 1 || mm > 12) return false
  if (dd < 1 || dd > 31) return false
  const d = new Date(yyyy, mm - 1, dd)
  return (
    d.getFullYear() === yyyy &&
    d.getMonth() === mm - 1 &&
    d.getDate() === dd &&
    yyyy >= 1900 &&
    d <= new Date()
  )
}
