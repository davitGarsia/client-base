import {Component, inject, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {integerValidator} from '../../../shared/validators/integer-validator';
import {UniqueAccountNumberValidator} from '../../../shared/validators/account-number-validator';

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
              //updateOn: 'blur'
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
      accountNumber: new FormControl(null, [Validators.required, integerValidator]),
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
    const inputElement = event.target as HTMLInputElement;
    const sanitizedValue = inputElement.value.replace(/[^0-9]/g, '');
    inputElement.value = sanitizedValue;
    this.accountForm.get(controlName)?.setValue(sanitizedValue);
  }

  onSubmit() {
    console.log(this.accountForm.value);
  }


}
