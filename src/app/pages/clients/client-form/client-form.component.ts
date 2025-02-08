import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {integerValidator} from '../../../shared/validators/integer-validator';
import {georgianOrLatinValidator} from '../../../shared/validators/language-validator';

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
      name: new FormControl(null,
        [Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          georgianOrLatinValidator()
        ]),
      lastName: new FormControl(null,
        [Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          georgianOrLatinValidator()
        ]),
      gender: new FormControl(null, Validators.required),
      personalNumber: new FormControl(null,
        [Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11)
        ]),
      phone: new FormControl(null,
        [Validators.required,
          Validators.minLength(9),
          Validators.maxLength(9)]),
      officialAddress: new FormGroup({
      country: new FormControl(null, [Validators.required]),
      city: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required])
      }),
      factualAddress:
        new FormGroup({
          country: new FormControl(null,
            [Validators.required
            ]),
          city: new FormControl(null,
            [Validators.required
            ]),
          address: new FormControl(null,
            [Validators.required
            ])
        }),
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
