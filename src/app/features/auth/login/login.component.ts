import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    returnUrl: string = '/';

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router,
        private toastr: ToastrService
    ) {
        // Redireciona para a home se já estiver logado
        if (this.authService.isAuthenticated()) {
            this.router.navigate(['/']);
        }

        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        // Obtém a URL de retorno dos parâmetros da rota ou usa o padrão '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    onSubmit(): void {
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authService.login(
            this.loginForm.get('email')?.value,
            this.loginForm.get('password')?.value
        ).subscribe({
            next: () => {
                this.loading = false;
                this.toastr.success('Login realizado com sucesso!');
                this.router.navigate([this.returnUrl]);
            },
            error: (err) => {
                this.loading = false;
                console.error('Error logging in', err);
                this.toastr.error('Email ou senha incorretos. Por favor, tente novamente.');
            }
        });
    }
}
