import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core'
import { StockQuote } from '../../shared/models/stock-quote'

@Component({
  selector: 'app-stock-card',
  templateUrl: './stock-card.component.html',
  styleUrls: ['./stock-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StockCardComponent {
  @Input() quote: StockQuote = StockQuote.null()
  @Output() stopTracking = new EventEmitter()

  getStockTrendImage() {
    if (this.quote.todaysTrendIsPositive()) {
      return {
        src: '/assets/up-arrow.png',
        alt: 'Green arrow pointing up',
      }
    } else {
      return {
        src: '/assets/down-arrow.png',
        alt: 'Red arrow pointing down',
      }
    }
  }

  getSentimentRouterLink() {
    return `sentiment/${this.quote.code}`
  }
}
