import {Component, inject, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {integerValidator} from '../../../shared/validators/integer-validator';
import {UniqueAccountNumberValidator} from '../../../shared/validators/account-number-validator';
import {RestrictSymbolsService} from '../../../shared/utils/restrict-symbols.service';
import {Store} from '@ngrx/store';
import * as AccountActions from '../../../state/accounts/account.actions';

@Component({
  selector: 'app-account-form',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './account-form.component.html',
  styleUrl: './account-form.component.scss'
})
export class AccountFormComponent implements OnInit {
  uniqueAccountNumberValidator = inject(UniqueAccountNumberValidator);
  restrictSymbolsService: RestrictSymbolsService = inject(RestrictSymbolsService);
  readonly store = inject(Store);
  accountForm!: FormGroup;

  ngOnInit() {
    this.accountForm = new FormGroup({
      clientNumber: new FormControl(null, [Validators.required, integerValidator]),
      account: new FormArray([
        new FormGroup({
          accountNumber: new FormControl( null,
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


  onSubmit() {
    console.log(this.accountForm.value);

    this.store.dispatch(AccountActions.addAccount({account: this.accountForm.value}));

  }


}
