import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'objToKeys' })
export class ObjToKeysPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (!value) {
      return value;
    }
    return Object.keys(value);
  }
}
