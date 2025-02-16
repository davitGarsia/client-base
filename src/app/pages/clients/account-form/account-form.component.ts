import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {integerValidator} from '../../../shared/validators/integer-validator';
import {UniqueAccountNumberValidator} from '../../../shared/validators/account-number-validator';
import {RestrictSymbolsService} from '../../../shared/utils/restrict-symbols.service';
import {Store} from '@ngrx/store';
import * as AccountActions from '../../../state/accounts/account.actions';
import {AppMessageService} from '../../../core/services/message.service';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Account} from '../../../core/interfaces/account.interface';

@Component({
  selector: 'app-account-form',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './account-form.component.html',
  styleUrl: './account-form.component.scss'
})
export class AccountFormComponent implements OnInit {
  private destroy$ = inject(DestroyRef);
  uniqueAccountNumberValidator = inject(UniqueAccountNumberValidator);
  restrictSymbolsService: RestrictSymbolsService = inject(RestrictSymbolsService);
  readonly store = inject(Store);
  messageService = inject(AppMessageService);
  private router: Router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  accountForm!: FormGroup;

  accountId = signal('');
  isEditMode = signal(false);

  ngOnInit() {
    this.accountForm = new FormGroup({
     clientNumber: new FormControl(null, [Validators.required, integerValidator]),
      account: new FormArray([
        new FormGroup({
          accountNumber: new FormControl(null,
            {
              validators: [Validators.required, integerValidator],
              asyncValidators: [this.uniqueAccountNumberValidator.validate.bind(this.uniqueAccountNumberValidator)],
            }),
          accountType: new FormControl(null, Validators.required),
          currency: new FormControl(null, Validators.required),
          accountStatus: new FormControl(null, Validators.required),
        })
      ])
    });
    this.setupRouteParamsSubscription();
  }

  private setupRouteParamsSubscription(): void {
    this.route.params.pipe(
      takeUntilDestroyed(this.destroy$)
    ).subscribe({
      next: params => {
        if (params['id']) {
          this.accountId.set(params['id']);
          this.isEditMode.set(true);
        } else if (params['clientNumber']) {
          this.accountForm.get('clientNumber')?.setValue(params['clientNumber']);
        }
        this.accountForm.get('clientNumber')?.disable();
      },
      error: (err) => {

        this.messageService.showError('Error', 'Failed to process route parameters');
      }
    });

    this.route.data.pipe(
      takeUntilDestroyed(this.destroy$)
    ).subscribe({
      next: data => {
        console.log(data['clientDetailed'])
        if (data['clientDetailed']?.[0]?.accounts?.[0]) {
          this.populateForm(data['clientDetailed'][0].accounts[0]);
        }
      },
      error: (err) => {

        this.messageService.showError('Error', 'Failed to load client data');
      }
    });
  }

  private populateForm(account: Account): void {
    Object.keys(this.accountForm.controls).forEach(key => {
      const control = this.accountForm.get(key);
      const value = account[key as keyof Account];

      if (key === 'account' && Array.isArray(value) && control instanceof FormArray) {
        control.clear();

        value.forEach((accountItem: any) => {
          control.push(new FormGroup({
            accountNumber: new FormControl(accountItem?.accountNumber, {
              validators: [Validators.required, integerValidator],
              asyncValidators: [this.uniqueAccountNumberValidator.validate.bind(this.uniqueAccountNumberValidator)]
            }),
            accountType: new FormControl(accountItem?.accountType, Validators.required),
            currency: new FormControl(accountItem?.currency, Validators.required),
            accountStatus: new FormControl(accountItem?.accountStatus, Validators.required),
          }));
        });
      } else if (control instanceof FormControl) {
        control.setValue(value);
      }
    });
  }

  addAccount(): void {
    (this.accountForm.get('account') as FormArray).push(new FormGroup({
      accountNumber: new FormControl(null,
        {
          validators: [Validators.required, integerValidator],
          asyncValidators: [this.uniqueAccountNumberValidator.validate.bind(this.uniqueAccountNumberValidator)],
        }
      ),
      accountType: new FormControl(null, Validators.required),
      currency: new FormControl(null, Validators.required),
      accountStatus: new FormControl(null, Validators.required),
    }));
  }

  getAccount() {
    return (this.accountForm.get('account') as FormArray).controls;
  }

  removeAccount(index: number): void {
    (this.accountForm.get('account') as FormArray).removeAt(index);
  }

  onIntInput(event: Event, controlName: string): void {
  const sanitizedValue = this.restrictSymbolsService.sanitizeOnInput(event, controlName);
    this.accountForm.get(controlName)?.setValue(sanitizedValue);
  }


  addAccountNumber(): void {
    const body = {
      ...this.accountForm.value,
      clientNumber: this.accountForm.get('clientNumber')?.value,

    }
    this.store.dispatch(AccountActions.addAccount({account: body}));
  }

  editAccount() {
    this.store.dispatch(AccountActions.updateAccount({
      account: this.accountForm.value as Account,
      id: this.accountId()
    }));

  }

  onSubmit() {
    if (this.isEditMode()) {
      this.editAccount();
      this.messageService.showSuccess('Success', 'Account updated successfully');
    } else {
      this.addAccountNumber();
      this.messageService.showSuccess('Success', 'Account added successfully');
    }
    this.router.navigate(['/clients']);
  }
}
