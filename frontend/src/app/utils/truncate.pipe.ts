import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 30): string {
    if (value.length <= limit) {
      return value;
    }

    const trimmedString = value.substr(0, limit);
    const lastSpaceIndex = trimmedString.lastIndexOf(' ');

    if (lastSpaceIndex > 0) {
      return trimmedString.substring(0, lastSpaceIndex) + '...';
    }

    return trimmedString + '...';
  }
}
