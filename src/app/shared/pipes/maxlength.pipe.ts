import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'maxlength',
})
export class MaxlengthPipe implements PipeTransform {
  transform(value: string, limit = 30): string {
    return value.length > limit ? `${value.substring(0, limit)}...` : value;
  }
}
