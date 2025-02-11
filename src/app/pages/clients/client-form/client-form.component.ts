import {Component, inject, OnInit, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {integerValidator} from '../../../shared/validators/integer-validator';
import {georgianOrLatinValidator} from '../../../shared/validators/language-validator';
import {UniqueClientNumberValidator} from '../../../shared/validators/client-number-validator';
import {startsWithFiveValidator} from '../../../shared/validators/phone-number-validator';


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
  photoSignal = signal<string>('');
  uniqueClientNumberValidator = inject(UniqueClientNumberValidator);

  constructor() {}

  ngOnInit() {
    this.clientForm = new FormGroup({
      clientNumber: new FormControl(
        null,
        {
          validators: [Validators.required, integerValidator],
          asyncValidators: [this.uniqueClientNumberValidator.validate.bind(this.uniqueClientNumberValidator)],
          //updateOn: 'blur'
        }
      ),
      name: new FormControl(null,
        [Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          georgianOrLatinValidator(),

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
          Validators.maxLength(9),
          startsWithFiveValidator(),
          integerValidator]),

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

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.photoSignal.set(reader.result as string);  // Update the signal with base64 data
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto() {
    this.photoSignal.set('');
  }



  onSubmit() {
    console.log(this.clientForm);
    this.clientForm.markAllAsTouched();
    if (this.clientForm.invalid) {
      console.log("Form has errors:", this.clientForm.errors);
    }
  }

}
