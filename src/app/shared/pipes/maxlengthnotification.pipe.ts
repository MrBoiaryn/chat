import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'maxlengthnotification',
})
export class MaxlengthPipeNotification implements PipeTransform {
  transform(value: string, limit = 130): string {
    return value.length > limit ? `${value.substring(0, limit)}...` : value;
  }
}
