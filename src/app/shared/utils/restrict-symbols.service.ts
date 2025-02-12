import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RestrictSymbolsService {

  constructor() { }

  sanitizeOnInput(event: Event, controlName: string) : string {
    const inputElement = event.target as HTMLInputElement;
    const sanitizedValue = inputElement.value.replace(/[^0-9]/g, '');
    inputElement.value = sanitizedValue;
    return sanitizedValue;
  }

}
