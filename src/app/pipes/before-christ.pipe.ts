import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'bcPipe',
})
export class BeforeChristPipe implements PipeTransform {
  transform(value: number): string | undefined {
    if(value < 0){
      let newValue = String(value).replace('-', '');
      return newValue + ' B.C.';
    } else {
      return String(value);
    }
  }
}
