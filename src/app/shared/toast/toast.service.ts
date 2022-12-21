import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class ToastService {
  messages$: Observable<string>
  isVisible$: Observable<boolean>

  private messagesSubject = new BehaviorSubject('')
  private isVisibleSubject = new BehaviorSubject(false)

  private timeout?: ReturnType<typeof setTimeout>

  constructor() {
    this.messages$ = this.messagesSubject.asObservable()
    this.isVisible$ = this.isVisibleSubject.asObservable()
  }

  show(message: string) {
    this.messagesSubject.next(message)
    this.isVisibleSubject.next(true)

    this.hideAfterFiveSeconds()
  }

  hide(): void {
    return this.isVisibleSubject.next(false)
  }

  private hideAfterFiveSeconds() {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }

    this.timeout = setTimeout(() => this.hide(), 5000)
  }
}
