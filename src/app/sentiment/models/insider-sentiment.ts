export type InsiderSentimentDTO = {
  data: MonthlyInsiderSentimentDTO[]
  symbol: string
}

type MonthlyInsiderSentimentDTO = {
  symbol: string
  year: number
  month: number
  change: number
  mspr: number
}

export class InsiderSentiment {
  constructor(
    public readonly symbol: string,
    public readonly year: number,
    public readonly month: number,
    public readonly change: number,
    public readonly monthlySharePurchaseRatio: number
  ) {}

  static fromDTO(dto: MonthlyInsiderSentimentDTO) {
    return new InsiderSentiment(
      dto.symbol,
      dto.year,
      dto.month,
      dto.change,
      dto.month
    )
  }

  getMonthName() {
    return [
      '',
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ][this.month]
  }
}
