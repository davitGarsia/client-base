import {Component, inject, OnInit, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {integerValidator} from '../../../shared/validators/integer-validator';
import {georgianOrLatinValidator} from '../../../shared/validators/language-validator';
import {UniqueClientNumberValidator} from '../../../shared/validators/client-number-validator';
import {startsWithFiveValidator} from '../../../shared/validators/phone-number-validator';
import {RouterLink} from '@angular/router';
import {Tooltip} from 'primeng/tooltip';
import {Store} from '@ngrx/store';
import * as ClientActions from '../../../state/clients/client.actions';
import {RestrictSymbolsService} from '../../../shared/utils/restrict-symbols.service';

@Component({
  selector: 'app-client-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    Tooltip
  ],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss'
})
export class ClientFormComponent implements OnInit {
  readonly store = inject(Store);
  clientForm!: FormGroup;
  photoSignal = signal<string>('');
  imageAsBase64 = signal<string>('');
  uniqueClientNumberValidator = inject(UniqueClientNumberValidator);
  restrictSymbolsService: RestrictSymbolsService = inject(RestrictSymbolsService);
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
      photo: new FormControl(null, Validators.required)
    });


  }

  onIntInput(event: Event, controlName: string): void {
    const sanitizedValue : string = this.restrictSymbolsService.sanitizeOnInput(event, controlName);
    this.clientForm.get(controlName)?.setValue(sanitizedValue);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageAsBase64.set(reader.result as string);  // Update the signal with base64 data
        this.photoSignal.set(reader.result as string);  // Update the signal with base64 data
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto() {
    this.photoSignal.set('');
    this.clientForm.get('photo')?.setValue(null);
    this.imageAsBase64.set('');
  }



  onSubmit() {
    this.clientForm.markAllAsTouched();
    console.log(this.clientForm.value);
    const body = {...this.clientForm.value};
    body.photo = this.imageAsBase64();
    console.log(body)
    if (this.clientForm.invalid) {
      console.log("Form has errors:", this.clientForm.errors);
    }

    this.store.dispatch(ClientActions.createClient({client: body}));



  }

}
