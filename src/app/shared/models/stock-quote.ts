import { TitleCasePipe } from '@angular/common'
import { inject } from '@angular/core'
import { Title } from '@angular/platform-browser'

export type StockQuoteDTO = {
  c: number
  d: number
  h: number
  l: number
  o: number
  t: number
  dp: number
  pc: number
}

export class StockQuote {
  constructor(
    readonly name: string,
    readonly code: string,
    readonly currentPrice: number,
    readonly change: number,
    readonly percentChange: number,
    readonly highestPriceToday: number,
    readonly lowestPriceToday: number,
    readonly openingPriceToday: number,
    readonly previousClosingPrice: number
  ) {}

  static fromDTO(dto: StockQuoteDTO, code: string, name: string) {
    return new StockQuote(
      name,
      code,
      dto.c,
      dto.d,
      dto.dp,
      dto.h,
      dto.l,
      dto.o,
      dto.pc
    )
  }

  static null() {
    return new StockQuote('', '', 0, 0, 0, 0, 0, 0, 0)
  }

  todaysTrendIsPositive(): boolean {
    return this.percentChange > 0
  }

  formattedName() {
    if (this.name) {
      return `${new TitleCasePipe().transform(this.name)} (${this.code})`
    }

    return this.code
  }
}
