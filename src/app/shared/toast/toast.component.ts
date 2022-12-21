import { animate, state, style, transition, trigger } from '@angular/animations'
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { map, Observable } from 'rxjs'
import { ToastService } from './toast.service'

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('visibility', [
      state('visible', style({ opacity: 1 })),
      state('invisible', style({ opacity: 0 })),
      transition('visible => invisible', [animate('0.5s')]),
      transition('invisible => visible', [animate('0.25s')]),
    ]),
  ],
})
export class ToastComponent implements OnInit {
  message$!: Observable<string>
  visibility$!: Observable<string>

  constructor(public service: ToastService) {}

  ngOnInit(): void {
    this.message$ = this.service.messages$
    this.visibility$ = this.service.isVisible$.pipe(
      map((isVisible) => (isVisible ? 'visible' : 'invisible'))
    )
  }
}
