import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { last } from 'rxjs';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { CustomValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutFromGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private shopFormService: ShopFormService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.reviewCartDetails();

    this.checkoutFromGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhiteSpace,
        ]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhiteSpace,
        ]),
        email: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhiteSpace,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhiteSpace,
        ]),
        state: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
        country: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
        zipcode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhiteSpace,
        ]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhiteSpace,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhiteSpace,
        ]),
        state: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
        country: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
        zipcode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhiteSpace,
        ]),
      }),

      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhiteSpace,
        ]),
        cardNumber: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{16}'),
        ]),
        securityCode: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{3}'),
        ]),
        expirationMonth: new FormControl('', [Validators.required]),
        expirationYear: new FormControl('', [Validators.required]),
      }),
    });

    const startMonth: number = new Date().getMonth() + 1;

    this.shopFormService.getCreditCardMonths(startMonth).subscribe((data) => {
      console.log(JSON.stringify(data));
      this.creditCardMonths = data;
    });

    this.shopFormService.getCreditCardYears().subscribe((data) => {
      console.log(JSON.stringify(data));
      this.creditCardYears = data;
    });

    this.shopFormService.getCountries().subscribe((data) => {
      console.log('Retrived Countries' + JSON.stringify(data));
      this.countries = data;
    });
  }

  reviewCartDetails() {
    this.cartService.totalQuantity.subscribe(
      (totalQuantity) => (this.totalQuantity = totalQuantity)
    );

     this.cartService.totalPrice.subscribe(
       (totalPrice) => (this.totalPrice = totalPrice)
     );
  }

  onSubmit() {
    if (this.checkoutFromGroup.invalid) {
      this.checkoutFromGroup.markAllAsTouched();
    }
    console.log('Handling form Submition');
    console.log(this.checkoutFromGroup.get('customer')?.value.email);
  }

  get firstName() {
    return this.checkoutFromGroup.get('customer.firstName');
  }
  get lastName() {
    return this.checkoutFromGroup.get('customer.lastName');
  }
  get email() {
    return this.checkoutFromGroup.get('customer.email');
  }
  get shippingAddressStreet() {
    return this.checkoutFromGroup.get('shippingAddress.street');
  }
  get shippingAddresscCity() {
    return this.checkoutFromGroup.get('shippingAddress.city');
  }
  get shippingAddressState() {
    return this.checkoutFromGroup.get('shippingAddress.state');
  }
  get shippingAddressCountry() {
    return this.checkoutFromGroup.get('shippingAddress.country');
  }
  get shippingAddressZipCode() {
    return this.checkoutFromGroup.get('shippingAddress.zipcode');
  }

  get billingAddressStreet() {
    return this.checkoutFromGroup.get('shippingAddress.street');
  }
  get billingAddresscCity() {
    return this.checkoutFromGroup.get('shippingAddress.city');
  }
  get billingAddressState() {
    return this.checkoutFromGroup.get('shippingAddress.state');
  }
  get billingAddressCountry() {
    return this.checkoutFromGroup.get('shippingAddress.country');
  }
  get billingAddressZipCode() {
    return this.checkoutFromGroup.get('shippingAddress.zipcode');
  }

  get creditCardType() {
    return this.checkoutFromGroup.get('creditCard.cardType');
  }
  get creditCardNameOnCard() {
    return this.checkoutFromGroup.get('creditCard.nameOnCard');
  }
  get creditCardCardNumber() {
    return this.checkoutFromGroup.get('creditCard.cardNumber');
  }
  get creditCardSecurityCode() {
    return this.checkoutFromGroup.get('creditCard.securityCode');
  }

  copyShoppingAddressToBillingAddress(event: any) {
    if (event.target.checked) {
      this.checkoutFromGroup.controls['billingAddress'].setValue(
        this.checkoutFromGroup.controls['shippingAddress'].value
      );

      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFromGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFromGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(
      creditCardFormGroup?.value.expirationYear
    );

    let startMonth: number;

    if (currentYear == selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }
    this.shopFormService.getCreditCardMonths(startMonth).subscribe((data) => {
      this.creditCardMonths = data;
    });
  }

  getState(formGroupName: string) {
    const formGroup = this.checkoutFromGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;
    console.log(countryCode + ' ' + countryName);

    this.shopFormService.getStates(countryCode).subscribe((data) => {
      if (formGroupName == 'shippingAddress') {
        this.shippingAddressStates = data;
      } else if (formGroupName == 'billingAddress') {
        this.billingAddressStates = data;
      }

      formGroup?.get('state')?.setValue(data[0]);
    });
  }
}
