import { ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from 'src/app/login/login.component';
import { NgxOtpInputComponent, NgxOtpInputConfig } from 'ngx-otp-input/public-api';
import { AuthService } from 'src/app/service/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-otp-dialog',
  templateUrl: './otp-dialog.component.html',
  styleUrls: ['./otp-dialog.component.scss']
})
export class OtpDialogComponent {
otp: any = null; 
showOtpComponent = true; 
otpChangeResult: any = [];
fillResult: any = '';

otpConfig: NgxOtpInputConfig = {
otpLength: 6,
autofocus: true,
classList:{
  inputBox: 'my-super-box-class',
  input: 'my-super-class',
  inputFilled: 'my-super-filled-class',
  inputDisabled: 'my-super-diabled-class',
  inputSuccess: 'my-super-success-class',
  inputError: 'my-super-error-class'
}
}
 @ViewChild('ngxotp') ngxOtp!: NgxOtpInputComponent;
// ngOtpInput: any; 
//   config = { allowNumbersOnly: true, length: 6, 
//               isPasswordInput: false, disableAutoFocus: false, 
//               placeholder: "*", 
//               inputStyles: { width: "50px", height: "50px", }
//             }; 
            // OTP Code onOtpChange(otp) { this.otp = otp; // When all 4 digits are filled, trigger OTP validation method if (otp.length == 4) { this.validateOtp(); } } setVal(val) { this.ngOtpInput.setValue(val); } onConfigChange() { this.showOtpComponent = false; this.otp = null; setTimeout(() => { this.showOtpComponent = true; }, 0); } validateOtp() { // write your logic here to validate it, you can integrate sms API here if you want } 
constructor(
    private service: AuthService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<OtpDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private readonly cdr: ChangeDetectorRef
  ) {}

  onSubmit($event: any){
    this.otp = $event;
    if(this.otp.length === 6){ 
      this.validateOtp(this.otp); 
    }
  }
 
   handleOtpChange($event: string[]): void {
    this.otpChangeResult = $event;
    this.cdr.detectChanges();
  }

    onOtpFilled($event: any){
      if($event.length === 6){ 
      this.validateOtp($event); 
    }
    }

    clear(): void {
    this.ngxOtp.clear();

  }

  validateOtp(otpVal: any) {
   this.service.GetUserbyId(this.data.id).subscribe((res: any)=>{
    let resData = res;
    if(resData && resData.otpKeys.otp === otpVal){
      this.data.otp = resData.otpKeys.status;
      this.dialogRef.close(this.data.otp);
    }
    else{
    this.toastr.error('Invalid OTP');
    }
   })
  }

}
