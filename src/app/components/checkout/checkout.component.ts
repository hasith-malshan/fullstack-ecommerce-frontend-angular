import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { last } from 'rxjs';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutFromGroup: FormGroup;

  totalPrice : number = 0;
  totalQuantity : number = 0;

  constructor(private formBuilder: FormBuilder) {
    this.checkoutFromGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: [''],
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipcode: [''],
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipcode: [''],
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: [''],
      }),
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    console.log('Handling form Submition');
    console.log(this.checkoutFromGroup.get('customer')?.value.email);
  }

  copyShoppingAddressToBillingAddress(event : any) {
    if (event.target.checked) {
      this.checkoutFromGroup.controls['billingAddress'].setValue(
        this.checkoutFromGroup.controls['shippingAddress'].value
      );
    }else{
       this.checkoutFromGroup.controls['billingAddress'].reset();
    }
  }
}
