import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {integerValidator} from '../../../shared/validators/integer-validator';

@Component({
  selector: 'app-client-form',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss'
})
export class ClientFormComponent implements OnInit {
  clientForm!: FormGroup;

  constructor() {}

  ngOnInit() {
    this.clientForm = new FormGroup({
      clientNumber: new FormControl(null, [Validators.required, integerValidator]),
      name: new FormControl(),
      lastName: new FormControl(null, Validators.required),
      gender: new FormControl(null, Validators.required),
      personalNumber: new FormControl(null, Validators.required),
      phone: new FormControl(),
      officialAddress: new FormArray([
        new FormGroup({
          country: new FormControl(),
          city: new FormControl(),
          address: new FormControl()
        })
      ]),
      factualAddress: new FormArray([
        new FormGroup({
          country: new FormControl(),
          city: new FormControl(),
          address: new FormControl()
        })
      ]),
      photo: new FormControl()
    });
  }

  onIntInput(event: Event, controlName: string): void {
    const inputElement = event.target as HTMLInputElement;
    const sanitizedValue = inputElement.value.replace(/[^0-9]/g, '');
    inputElement.value = sanitizedValue;
    this.clientForm.get(controlName)?.setValue(sanitizedValue);
  }

  onSubmit() {
    console.log(this.clientForm);
  }

}
