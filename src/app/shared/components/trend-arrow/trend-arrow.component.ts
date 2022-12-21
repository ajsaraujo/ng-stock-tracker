import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core'

@Component({
  selector: 'app-trend-arrow',
  templateUrl: './trend-arrow.component.html',
  styleUrls: ['./trend-arrow.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrendArrowComponent {
  @Input() trendValue = 0
  @Input() height = '50px'

  getTrendImage() {
    if (this.trendValue > 0) {
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
}
