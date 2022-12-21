/* eslint-disable @typescript-eslint/member-ordering */
import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Optional,
} from '@angular/core'
import { NgControl } from '@angular/forms'

type PredefinedPatterns = 'numbers' | 'alphanum'

/**
 * Essa diretiva é utilizada para delimitar os caracteres
 * que o usuário pode inserir em um campo de entrada.
 *
 * Note que seu escopo se limita a bloquear caracteres. Se você deseja
 * uma funcionalidade mais complexa, como máscaras de CPF, CNPJ, Telefone, etc,
 * dê preferência a um componente especializado de máscara.
 *
 * ## Padrões pré-definidos
 *
 * No momento, ela oferece padrões pré-definidos para aceitar apenas números
 * ou apenas alfanuméricos.
 *
 * ```html
 * <!-- Aceitará apenas números -->
 * <input appPattern="numbers" >
 *
 * <!-- Aceitará apenas alfanuméricos -->
 * <input appPattern="alphanum" >
 * ```
 *
 * ## Padrões customizados
 *
 * Para usar um padrão customizado, você deverá passar um RegEx indicando
 * o que o campo aceita. No exemplo a seguir, ele aceitará qualquer coisa
 * que não seja os caracteres k, ç, w, x, y e z. Lembre-se de usar o modificador `g`
 * no fim do RegEx.
 *
 * ```typescript
 * class ExampleComponent {
 *    myCustomRegEx = /[^kçwxyz]/g
 * }
 * ```
 *
 * ```html
 * <input [appPattern]="myCustomRegEx">
 * ```
 */
@Directive({
  selector: '[appPattern]',
})
export class PatternDirective implements OnInit {
  @Input() appPattern: PredefinedPatterns | RegExp = 'alphanum'

  private regExp!: RegExp

  private predefinedPatterns: Record<PredefinedPatterns, RegExp> = {
    numbers: /\d/g,
    alphanum: /[A-Za-z\d]/g,
  }

  constructor(
    private element: ElementRef,
    @Optional() private ngControl: NgControl
  ) {}

  ngOnInit() {
    if (typeof this.appPattern === 'string') {
      this.regExp = this.predefinedPatterns[this.appPattern]
    } else {
      this.regExp = this.appPattern
    }
  }
  /**
   * Stops the user from typing non-numerical
   * characters in the input.
   */
  @HostListener('keydown', ['$event'])
  handleKeyDown(e: KeyboardEvent) {
    if (this.isNavigationKeyOrSpecialCommand(e)) {
      return
    }

    if (!this.regExp.test(e.key)) {
      e.preventDefault()
    }
  }

  /**
   * This additional handler is needed for some edge cases involving the Dead key.
   */
  @HostListener('input', ['$event'])
  handleInput(event: InputEvent) {
    const target = event.target as HTMLInputElement
    target.value = this.filterValidChars(this.getValue())
  }

  /**
   * Removes non-numerical characters
   * from the content the user pastes in the input.
   */
  @HostListener('paste', ['$event'])
  handlePaste(event: ClipboardEvent) {
    event.preventDefault()

    const rawText = event.clipboardData?.getData('text/plain') || ''
    const parsedText = this.filterValidChars(rawText)

    this.setValue(parsedText)
  }

  private filterValidChars(value: string) {
    const matches = value?.match(this.regExp)
    return matches ? matches.join('') : ''
  }

  private isNavigationKeyOrSpecialCommand(e: KeyboardEvent) {
    const navigationKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'Escape',
      'Enter',
      'Home',
      'End',
      'ArrowLeft',
      'ArrowRight',
      'Clear',
      'Copy',
      'Paste',
    ]

    if (navigationKeys.includes(e.key)) {
      return true
    }

    const allowedCombinations: [string, keyof KeyboardEvent][] = [
      ['a', 'ctrlKey'], // CTRL + A
      ['c', 'ctrlKey'], // CTRL + C
      ['v', 'ctrlKey'], // CTRL + V
      ['x', 'ctrlKey'], // CTRL + X
      ['a', 'metaKey'], // CMD + A
      ['c', 'metaKey'], // CMD + C
      ['v', 'metaKey'], // CMD + V
      ['x', 'metaKey'], // CMD + X
    ]

    return allowedCombinations.some(
      ([key, flag]) => e.key === key && e[flag] === true
    )
  }

  private setValue(value: string) {
    if (this.ngControl) {
      this.ngControl.control?.setValue(value)
    } else {
      this.element.nativeElement.value = value
    }
  }

  private getValue() {
    return this.element.nativeElement.value
  }
}
