import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SelectOptions } from '../../Models/select-options.data';

@Injectable({
  providedIn: 'root'
})
export class SelectOptionsService {
  // Initialize the BehaviorSubject with an initial value (e.g., an empty string)
  private selectOptionsSubject = new BehaviorSubject<SelectOptions[]>([]);

  // Expose the data as an Observable for components to subscribe to
  currentSelectOptions = this.selectOptionsSubject.asObservable();

  // Method to update the data
  setSelectOptions(selectOptions: SelectOptions[]) {
    this.selectOptionsSubject.next(selectOptions);
  }

  // Method to get the current data value (useful for immediate access)
  getSelectOptions() {
    let returnValue: any = this.selectOptionsSubject.getValue();
    return returnValue;
  }
  
}
