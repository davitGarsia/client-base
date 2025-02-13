import {Component, DestroyRef, effect, inject, OnInit, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {integerValidator} from '../../../shared/validators/integer-validator';
import {georgianOrLatinValidator} from '../../../shared/validators/language-validator';
import {UniqueClientNumberValidator} from '../../../shared/validators/client-number-validator';
import {startsWithFiveValidator} from '../../../shared/validators/phone-number-validator';
import {ActivatedRoute, Route, RouterLink} from '@angular/router';
import {Tooltip} from 'primeng/tooltip';
import {Store} from '@ngrx/store';
import * as ClientActions from '../../../state/clients/client.actions';
import {RestrictSymbolsService} from '../../../shared/utils/restrict-symbols.service';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {selectClient} from '../../../state/clients/client.selectors';
import {photoRequiredValidator} from '../../../shared/validators/photo-required-validator';

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
  client = toSignal(this.store.select(selectClient));
  clientForm!: FormGroup;
  photoSignal = signal<string>('');
  imageAsBase64 = signal<string>('');
  isEditMode = signal<boolean>(false);
  clientId = signal<string>('');
  uniqueClientNumberValidator = inject(UniqueClientNumberValidator);
  restrictSymbolsService: RestrictSymbolsService = inject(RestrictSymbolsService);
  route: ActivatedRoute = inject(ActivatedRoute);
  readonly destroy$: DestroyRef = inject(DestroyRef);
  constructor() {
  }

  ngOnInit() {
    this.clientForm = new FormGroup({
      clientNumber: new FormControl(
        null,
        {
          validators: [Validators.required, integerValidator],
          asyncValidators: !this.isEditMode ? [this.uniqueClientNumberValidator.validate.bind(this.uniqueClientNumberValidator)] : [],
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
      photo: new FormControl(null),
    });
    this.getRouteParams();


  }

  getRouteParams() {
    this.route.params.pipe(takeUntilDestroyed(this.destroy$)).subscribe(params => {
      console.log(params);
      if (params['id']) {
        this.clientId.set(params['id']);
        this.isEditMode.set(true);
        // this.store.dispatch(ClientActions.getClientById({clientId: this.clientId()}));
        // setTimeout(() => {
        //   console.log(this.client());
        //   // @ts-ignore
        //   const client = this.client()[0];
        //
        // }, 3000)


      }
    })

    this.route.data.pipe(takeUntilDestroyed(this.destroy$)).subscribe(data => {
      if (data['client']) {
        console.log(data['client'][0]);
        const client = data['client'][0];
        this.clientForm.get('clientNumber')?.setValue(client.clientNumber);
        this.clientForm.get('name')?.setValue(client.name);
        this.clientForm.get('lastName')?.setValue(client.lastName);
        this.clientForm.get('gender')?.setValue(client.gender);
        this.clientForm.get('personalNumber')?.setValue(client.personalNumber);
        this.clientForm.get('phone')?.setValue(client.phone);
        this.clientForm.get('officialAddress.country')?.setValue(client?.officialAddress?.country);
        this.clientForm.get('officialAddress.city')?.setValue(client?.officialAddress?.city);
        this.clientForm.get('officialAddress.address')?.setValue(client.officialAddress?.address);
        this.clientForm.get('factualAddress.country')?.setValue(client.factualAddress?.country);
        this.clientForm.get('factualAddress.city')?.setValue(client.factualAddress?.city);
        this.clientForm.get('factualAddress.address')?.setValue(client.factualAddress?.address);
        this.photoSignal.set(client.photo);
        this.imageAsBase64.set(client.photo);
      }
    });
  }

  onIntInput(event: Event, controlName: string): void {
    const sanitizedValue : string = this.restrictSymbolsService.sanitizeOnInput(event, controlName);
    this.clientForm.get(controlName)?.setValue(sanitizedValue);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.clientForm.get('photo')?.markAsDirty();
      this.clientForm.get('photo')?.markAsTouched();
      const reader = new FileReader();
      reader.onload = () => {
        this.imageAsBase64.set(reader.result as string);  // Update the signal with base64 data
        this.photoSignal.set(reader.result as string);  // Update the signal with base64 data
      };
      reader.readAsDataURL(file);
    } else {
      this.clientForm.get('photo')?.markAsDirty();
      this.clientForm.get('photo')?.markAsTouched();
    }
  }

  removePhoto() {
    this.photoSignal.set('');
    this.clientForm.get('photo')?.setValue(null);
    this.imageAsBase64.set('');
    // this.clientForm.get('photo')?.setValidators([Validators.required]);
    // this.clientForm.updateValueAndValidity();
    // this.clientForm.get('photo')?.markAsDirty();
    // this.clientForm.get('photo')?.markAsTouched();
  }

  addClient(body: any) {
    this.store.dispatch(ClientActions.createClient({client: body}));
  }

  editClient(body: any) {
    this.store.dispatch(ClientActions.updateClient({client: body, clientId: this.clientId()}));
  }

  onSubmit() {
    this.clientForm.markAllAsTouched();
    console.log(this.clientForm);
    console.log(this.clientForm.value);
    const body = {...this.clientForm.value};
    body.photo = this.imageAsBase64();
    console.log(body)
    if (this.clientForm.invalid) {
      console.log("Form has errors:", this.clientForm.errors);
    }

   if (this.isEditMode()) {
     this.editClient(body);
   } else {
      this.addClient(body);
   }

  }

}
