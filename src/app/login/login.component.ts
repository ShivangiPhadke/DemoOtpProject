import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'
import { AuthService } from '../service/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { OtpDialogComponent } from '../dialog/otp-dialog/otp-dialog.component';

export interface DialogData {
  id: string;
  password: string;
  otp: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  id: string | undefined;
  password: string | undefined;
  otp: string | undefined;

  regexPsw = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  regex = /[a-z0-9_.%]+@dso.org.sg$/;
  otpRes: any = '';
  dialogRef: any = '';
  
  constructor(private builder: FormBuilder, private toastr: ToastrService, private service: AuthService,
    private router: Router, public dialog: MatDialog) {
      sessionStorage.clear();

  }
  result: any;

  loginform = this.builder.group({
    password: this.builder.control('', Validators.compose([Validators.required,Validators.pattern(this.regexPsw)])),
    id: this.builder.control('', Validators.compose([Validators.required, Validators.pattern(this.regex)]))
  });

  proceedlogin() {
    if (this.loginform.valid) {
      this.service.GetUserbyId(this.loginform.value.id).subscribe(item => {
        this.result = item;
        if (this.result.password === this.loginform.value.password) {
          this.openDialog();

          
          this.dialogRef.afterClosed().subscribe((result: any) => {
            this.otpRes = result;
              if(this.otpRes && this.otpRes === 'success'){
                  if (this.result.isactive) {
                    sessionStorage.setItem('username',this.result.id);
                    sessionStorage.setItem('role',this.result.role);
                    this.router.navigate(['']);
                  } else {
                    this.toastr.error('Please contact Admin', 'InActive User');
                  }
                }
          });
        } else {
          this.toastr.error('Invalid credentials');
        }
      });
    } else {
      this.toastr.warning('Please enter valid data.')
    }
  }

  openDialog(): void {
    this.dialogRef = this.dialog.open(OtpDialogComponent, {
      data: {
        id: this.loginform.controls['id'].value, 
        password: this.loginform.controls['password'].value,
        otp: this.otpRes
      },
    });
  }
}

