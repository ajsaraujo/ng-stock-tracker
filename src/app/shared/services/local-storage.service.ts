import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private localStorage: Storage = window.localStorage

  clear() {
    this.localStorage.clear()
  }

  setItem(key: string, value: string) {
    this.localStorage.setItem(key, value)
  }

  hasItem(key: string) {
    return typeof this.getItem(key) === 'string'
  }

  getItem(key: string) {
    return this.localStorage.getItem(key)
  }

  removeItem(key: string) {
    this.localStorage.removeItem(key)
  }
}

@Injectable({
  providedIn: null,
})
export class FakeStorageService extends LocalStorageService {
  private storage = new Map()

  override clear() {
    this.storage.clear()
  }

  override setItem(key: string, value: string) {
    this.storage.set(key, value)
  }

  override hasItem(key: string) {
    return typeof this.getItem(key) === 'string'
  }

  override getItem(key: string) {
    return this.storage.get(key)
  }

  override removeItem(key: string) {
    this.storage.delete(key)
  }
}
