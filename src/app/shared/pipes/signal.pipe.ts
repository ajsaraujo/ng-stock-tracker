import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'signal',
})
export class SignalPipe implements PipeTransform {
  transform(str: unknown, numericalValue: number) {
    if (numericalValue > 0) {
      return `+${str}`
    }

    return str
  }
}
