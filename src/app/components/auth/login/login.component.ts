import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ProfileService } from 'src/app/core/services/profile/profile.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public registerForm: FormGroup;

  constructor(private router: Router, private formBuilder: FormBuilder, private authService: AuthService, private profileService: ProfileService) {
    this.createLoginForm();
    this.createRegisterForm();
  }

  owlcarousel = [
    {
      title: "Welcome to Tai-Dye Studios",
      desc: "Something motivational will go here",
    },
    {
      title: "Welcome to Tai-Dye Studios",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.",
    },
    {
      title: "Welcome to Tai-Dye Studios",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.",
    }
  ]
  owlcarouselOptions = {
    loop: true,
    items: 1,
    dots: true
  };

  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      userName: [''],
      password: [''],
    })
  }
  createRegisterForm() {
    this.registerForm = this.formBuilder.group({
      userName: [''],
      password: [''],
      confirmPassword: [''],
    })
  }

  public login(email: string, password: string) {
    this.authService.login(email, password);
  }

  // async register(email: string, password: string, confirmPassword: string) {
  //   if (password === confirmPassword) {
  //     await this.authService.register(email, password)
  //   } else {
  //     this.registerForm.reset();
  //   }
  // }


  ngOnInit() {
  }

}
