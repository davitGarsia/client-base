import { Component, computed, DestroyRef, effect, inject, Signal, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Tooltip } from 'primeng/tooltip';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Actions, ofType } from '@ngrx/effects';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { integerValidator } from '../../../shared/validators/integer-validator';
import { georgianOrLatinValidator } from '../../../shared/validators/language-validator';
import { UniqueClientNumberValidator } from '../../../shared/validators/client-number-validator';
import { startsWithFiveValidator } from '../../../shared/validators/phone-number-validator';
import { RestrictSymbolsService } from '../../../shared/utils/restrict-symbols.service';
import * as ClientActions from '../../../state/clients/client.actions';
import { selectClient } from '../../../state/clients/client.selectors';
import { AppMessageService } from '../../../core/services/message.service';

interface ClientFormState {
  loading: boolean;
  error: string | null;
  photo: string;
  imageAsBase64: string;
  isEditMode: boolean;
  clientId: string;
}

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
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss'
})
export class ClientFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly messageService = inject(AppMessageService);
  private readonly router = inject(Router);
  private readonly uniqueClientNumberValidator = inject(UniqueClientNumberValidator);
  private readonly restrictSymbolsService = inject(RestrictSymbolsService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroy$ = inject(DestroyRef);

  protected readonly state = signal<ClientFormState>({
    loading: false,
    error: null,
    photo: '',
    imageAsBase64: '',
    isEditMode: false,
    clientId: ''
  });

  protected readonly client: Signal<any> = this.store.selectSignal(selectClient);
  protected readonly clientForm: FormGroup = this.initializeForm();

  constructor() {
    this.setupRouteParamsSubscription();
    this.setupActionsSubscription();
    this.setupFormEffects();
  }

  private initializeForm(): FormGroup {
    return this.fb.group({
      clientNumber: [null, {
        validators: [Validators.required, integerValidator],
        asyncValidators: !this.state().isEditMode ?
          [this.uniqueClientNumberValidator.validate.bind(this.uniqueClientNumberValidator)] : []
      }],
      name: [null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        georgianOrLatinValidator()
      ]],
      lastName: [null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        georgianOrLatinValidator()
      ]],
      gender: [null, Validators.required],
      personalNumber: [null, [
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(11)
      ]],
      phone: [null, [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(9),
        startsWithFiveValidator(),
        integerValidator
      ]],
      officialAddress: this.fb.group({
        country: [null, Validators.required],
        city: [null, Validators.required],
        address: [null, Validators.required]
      }),
      factualAddress: this.fb.group({
        country: [null, Validators.required],
        city: [null, Validators.required],
        address: [null, Validators.required]
      }),
      photo: [null]
    });
  }

  private setupRouteParamsSubscription(): void {
    this.route.params.pipe(
      takeUntilDestroyed(this.destroy$)
    ).subscribe({
      next: params => {
        if (params['id']) {
          this.state.update(s => ({ ...s, clientId: params['id'], isEditMode: true }));
        }
      },
      error: () => {
        this.handleError('Failed to process route parameters');
      }
    });

    this.route.data.pipe(
      takeUntilDestroyed(this.destroy$)
    ).subscribe({
      next: data => {
        if (this.state().isEditMode && data['client']?.[0] && !this.clientForm.dirty) {
          this.populateForm(data['client'][0]);
        }
      },
      error: () => {
        this.handleError('Failed to load client data');
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
        this.handleActionResponse(action);
      },
      error: () => {
        this.state.update(s => ({ ...s, loading: false }));
        this.messageService.showInfo('Error', 'An unexpected error occurred');
      }
    });
  }

  private setupFormEffects(): void {
    effect(() => {
      const currentState = this.state();
      if (currentState.photo) {
        this.clientForm.get('photo')?.markAsDirty();
        this.clientForm.get('photo')?.markAsTouched();
      }
    });
  }

  private populateForm(client: any): void {
    if (!client) return;

    if (this.clientForm.dirty) return;

    this.clientForm.reset();

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

    this.state.update(s => ({
      ...s,
      photo: client.photo || '',
      imageAsBase64: client.photo || ''
    }));
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
      this.state.update(s => ({
        ...s,
        imageAsBase64: result,
        photo: result
      }));
    };
    reader.onerror = () => {
      this.messageService.showWarning('Warning', 'Failed to read the file');
    };
    reader.readAsDataURL(file);
  }

  removePhoto(): void {
    this.state.update(s => ({
      ...s,
      photo: '',
      imageAsBase64: ''
    }));
    this.clientForm.get('photo')?.setValue(null);
  }

  onSubmit(): void {
    if (this.state().loading) return;

    this.clientForm.markAllAsTouched();
    if (this.clientForm.invalid) {
      this.messageService.showWarning('Warning', 'Please fill in all required fields');
      return;
    }

    this.state.update(s => ({ ...s, loading: true, error: null }));

    const body = {
      ...this.clientForm.value,
      photo: this.state().imageAsBase64
    };

    if (this.state().isEditMode) {
      this.store.dispatch(ClientActions.updateClient({
        client: body,
        clientId: this.state().clientId
      }));
    } else {
      this.store.dispatch(ClientActions.createClient({
        client: body
      }));
    }
  }

  private handleActionResponse(action: any): void {
    this.state.update(s => ({ ...s, loading: false }));

    if (action.type === ClientActions.createClientSuccess.type ||
      action.type === ClientActions.updateClientSuccess.type) {
      this.messageService.showSuccess(
        'Success',
        `კლიენტი წარმატებით ${this.state().isEditMode ? 'განახლდა' : 'დაემატა'}`
      );
      this.router.navigate(['/clients']);
    } else {
      this.handleError('Operation failed');
    }
  }

  private handleError(message: string): void {
    this.state.update(s => ({ ...s, error: message }));
    this.messageService.showError('Error', message);
  }
}
