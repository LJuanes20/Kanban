import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { LoginRequest } from '../../../models/auth/login-request.model';
import { LoadingComponent } from '../../../components/common/loading/loading.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, LoadingComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  model: LoginRequest = { email: '', password: '' };

  isSubmitting = signal(false);
  errorMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  get canSubmit(): boolean {
    return !!this.model.email.trim()
        && !!this.model.password
        && !this.isSubmitting();
  }

  submit(): void {
    if (!this.canSubmit) return;

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    this.authService.login(this.model).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/boards';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(this.buildErrorMessage(err));
        console.error('Login error:', err);
      }
    });
  }

  private buildErrorMessage(err: any): string {
    const status = err?.status ?? '?';

    if (status === 401) {
      return 'Credenciales inválidas. Verificá tu email y contraseña.';
    }

    // ASP.NET Core con [ApiController]: ProblemDetails con "errors" en 400
    const validationErrors = err?.error?.errors;
    if (validationErrors && typeof validationErrors === 'object') {
      const messages = Object.values(validationErrors).flat().join(' ');
      return messages || 'Datos inválidos.';
    }

    const detail = err?.error?.message || err?.error?.title || err?.message || 'Sin detalles';
    return `Error al iniciar sesión (HTTP ${status}). ${detail}`;
  }
}