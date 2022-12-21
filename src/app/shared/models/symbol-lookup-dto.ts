export type SymbolLookupDTO = {
  count: number
  result: SymbolLookupResult[]
}

type SymbolLookupResult = {
  description: string
  displaySymbol: string
  symbol: string
  type: string
}
