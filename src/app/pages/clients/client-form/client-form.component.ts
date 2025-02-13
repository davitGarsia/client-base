import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { Store } from '@ngrx/store';
import { Tooltip } from 'primeng/tooltip';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Actions, ofType } from '@ngrx/effects';

import { integerValidator } from '../../../shared/validators/integer-validator';
import { georgianOrLatinValidator } from '../../../shared/validators/language-validator';
import { UniqueClientNumberValidator } from '../../../shared/validators/client-number-validator';
import { startsWithFiveValidator } from '../../../shared/validators/phone-number-validator';
import { RestrictSymbolsService } from '../../../shared/utils/restrict-symbols.service';
import * as ClientActions from '../../../state/clients/client.actions';
import { selectClient } from '../../../state/clients/client.selectors';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {AppMessageService} from '../../../core/services/message.service';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    Tooltip,
    MessagesModule,
    MessageModule,
    ProgressSpinnerModule
  ],
  providers: [],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss'
})
export class ClientFormComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly messageService = inject(AppMessageService);
  private router = inject(Router);
  private readonly uniqueClientNumberValidator = inject(UniqueClientNumberValidator);
  private readonly restrictSymbolsService = inject(RestrictSymbolsService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroy$ = inject(DestroyRef);

  client = toSignal(this.store.select(selectClient));
  clientForm!: FormGroup;

  // Signals
  loading = signal(false);
  error = signal<string | null>(null);
  photoSignal = signal<string>('');
  imageAsBase64 = signal<string>('');
  isEditMode = signal<boolean>(false);
  clientId = signal<string>('');

  ngOnInit() {
    this.initializeForm();
    this.setupRouteParamsSubscription();
    this.setupActionsSubscription();
  }

  private initializeForm(): void {
    this.clientForm = new FormGroup({
      clientNumber: new FormControl(null, {
        validators: [Validators.required, integerValidator],
        asyncValidators: !this.isEditMode() ?
          [this.uniqueClientNumberValidator.validate.bind(this.uniqueClientNumberValidator)] :
          []
      }),
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        georgianOrLatinValidator()
      ]),
      lastName: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        georgianOrLatinValidator()
      ]),
      gender: new FormControl(null, Validators.required),
      personalNumber: new FormControl(null, [
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(11)
      ]),
      phone: new FormControl(null, [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(9),
        startsWithFiveValidator(),
        integerValidator
      ]),
      officialAddress: new FormGroup({
        country: new FormControl(null, [Validators.required]),
        city: new FormControl(null, [Validators.required]),
        address: new FormControl(null, [Validators.required])
      }),
      factualAddress: new FormGroup({
        country: new FormControl(null, [Validators.required]),
        city: new FormControl(null, [Validators.required]),
        address: new FormControl(null, [Validators.required])
      }),
      photo: new FormControl(null)
    });
  }

  private setupRouteParamsSubscription(): void {
    this.route.params.pipe(
      takeUntilDestroyed(this.destroy$)
    ).subscribe({
      next: params => {
        if (params['id']) {
          this.clientId.set(params['id']);
          this.isEditMode.set(true);
        }
      },
      error: (err) => {
        this.error.set('Failed to process route parameters');
        this.messageService.showError('Error', 'Failed to process route parameters');
      }
    });

    this.route.data.pipe(
      takeUntilDestroyed(this.destroy$)
    ).subscribe({
      next: data => {
        if (data['client']?.[0]) {
          this.populateForm(data['client'][0]);
        }
      },
      error: (err) => {
        this.error.set('Failed to load client data');
        this.messageService.showError('Error', 'Failed to load client data');
      }
    });
  }

  private setupActionsSubscription(): void {
    this.actions$.pipe(
      ofType(
        ClientActions.createClientSuccess,
        ClientActions.createClientFailure,
        ClientActions.updateClientSuccess,
        ClientActions.updateClientFailure
      ),
      takeUntilDestroyed(this.destroy$)
    ).subscribe({
      next: (action) => {
        this.loading.set(false);
        if (action.type === ClientActions.createClientSuccess.type ||
          action.type === ClientActions.updateClientSuccess.type) {
          this.messageService.showSuccess('Success', `კლიენტი წარმატებით ${this.isEditMode() ? 'განახლდა' : 'დაემატა'}`);
          this.router.navigate(['/clients']);
        } else {
          this.error.set('Operation failed');
          this.messageService.showError('Error', 'Operation failed');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.messageService.showInfo('Error', 'An unexpected error occurred');
      }
    });
  }

  private populateForm(client: any): void {
    Object.keys(this.clientForm.controls).forEach(key => {
      if (key !== 'photo') {
        const control = this.clientForm.get(key);
        const value = client[key];
        if (control instanceof FormGroup) {
          Object.keys(control.controls).forEach(subKey => {
            control.get(subKey)?.setValue(value?.[subKey]);
          });
        } else {
          control?.setValue(value);
        }
      }
    });

    this.photoSignal.set(client.photo);
    this.imageAsBase64.set(client.photo);
  }

  onIntInput(event: Event, controlName: string): void {
    const sanitizedValue = this.restrictSymbolsService.sanitizeOnInput(event, controlName);
    this.clientForm.get(controlName)?.setValue(sanitizedValue);
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.handleFileSelection(file);
    } else {
      this.clientForm.get('photo')?.markAsDirty();
      this.clientForm.get('photo')?.markAsTouched();
    }
  }

  private handleFileSelection(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      this.imageAsBase64.set(result);
      this.photoSignal.set(result);
      this.clientForm.get('photo')?.markAsDirty();
      this.clientForm.get('photo')?.markAsTouched();
    };
    reader.onerror = () => {
      this.messageService.showWarning('Warning', 'Failed to read the file');
    };
    reader.readAsDataURL(file);
  }

  removePhoto(): void {
    this.photoSignal.set('');
    this.imageAsBase64.set('');
    this.clientForm.get('photo')?.setValue(null);
  }

  onSubmit(): void {
    if (this.loading()) return;

    this.clientForm.markAllAsTouched();
    if (this.clientForm.invalid) {
      this.messageService.showWarning('Warning', 'Please fill in all required fields');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const body = {
      ...this.clientForm.value,
      photo: this.imageAsBase64()
    };

    if (this.isEditMode()) {
      this.store.dispatch(ClientActions.updateClient({
        client: body,
        clientId: this.clientId()
      }));
    } else {
      this.store.dispatch(ClientActions.createClient({
        client: body
      }));
    }
  }
}
