import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { Cache } from './cache'

@Injectable({ providedIn: null })
class ExampleService {
  constructor(private http: HttpClient) {}

  @Cache('users')
  fetchUsers() {
    return this.http.get<string[]>('/api/v1/users')
  }
}

describe('@Cache()', () => {
  let service: ExampleService
  let http: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExampleService],
    })

    service = TestBed.inject(ExampleService)
    http = TestBed.inject(HttpTestingController)
  })

  it('should cache the return value for a given function', (done) => {
    service.fetchUsers().subscribe()

    http.expectOne({ method: 'GET' }).flush(['Johnny', 'Mary'])

    service.fetchUsers().subscribe((users) => {
      expect(users).toEqual(['Johnny', 'Mary'])
      done()
    })
  })
})
