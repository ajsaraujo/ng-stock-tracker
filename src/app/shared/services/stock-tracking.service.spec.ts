import { TestBed } from '@angular/core/testing'
import {
  FakeStorageService,
  LocalStorageService,
} from './local-storage.service'
import { StockTrackingService } from './stock-tracking.service'

describe('StockTrackingService', () => {
  let service: StockTrackingService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: LocalStorageService,
          useValue: new FakeStorageService(),
        },
      ],
    })
    service = TestBed.inject(StockTrackingService)
  })

  describe('track()', () => {
    it('should not track the same stock twice', (done) => {
      service.track('AAPL')
      service.track('AAPL')

      service.stocks$.subscribe((stocks) => {
        expect(stocks).toEqual(['AAPL'])
        done()
      })
    })
  })
})
