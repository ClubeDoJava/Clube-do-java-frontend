import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

// Validador customizado para verificar se as senhas coincidem
function passwordMatcher(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password?.pristine || confirmPassword?.pristine) {
    return null;
  }

  return password && confirmPassword && password.value !== confirmPassword.value
    ? { 'mismatch': true }
    : null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      passwordGroup: this.fb.group({
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      }, { validators: passwordMatcher }),
      // Adicionar outros campos conforme necessário (ex: telefone)
      // phone: ['']
    });
  }

  ngOnInit(): void { }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.toastr.error('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    this.isLoading = true;
    const { name, email, passwordGroup } = this.registerForm.value;
    const password = passwordGroup.password;

    // Ajustar payload conforme esperado pelo backend
    const registrationData = { name, email, password };

    this.authService.register(registrationData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.toastr.success('Registro realizado com sucesso! Faça o login para continuar.');
        this.router.navigate(['/auth/login']); // Redireciona para login após registro
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        const errorMessage = err.error?.message || err.error?.error || 'Erro ao registrar. Tente novamente.';
        this.toastr.error(errorMessage);
        console.error('Registration error:', err);
      }
    });
  }

  // Getters para acesso fácil no template
  get name() { return this.registerForm.get('name'); }
  get email() { return this.registerForm.get('email'); }
  get passwordGroup() { return this.registerForm.get('passwordGroup'); }
  get password() { return this.registerForm.get('passwordGroup.password'); }
  get confirmPassword() { return this.registerForm.get('passwordGroup.confirmPassword'); }
} 