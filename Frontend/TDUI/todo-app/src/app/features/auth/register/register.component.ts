import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoadingComponent } from '../../../components/common/loading/loading.component';
import { RegisterRequest } from '../../../models/auth/register-request.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink, LoadingComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  model: RegisterRequest = { email: '', password: '', displayName: '' };
  confirmPassword = '';

  isSubmitting = signal(false);
  errorMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  get passwordsMatch(): boolean {
    return this.model.password === this.confirmPassword;
  }

  get canSubmit(): boolean {
    return !!this.model.email.trim()
        && !!this.model.displayName.trim()
        && !!this.model.password
        && this.model.password.length >= 8
        && this.passwordsMatch
        && !this.isSubmitting();
  }

  submit(): void {
    if (!this.canSubmit) return;

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    this.authService.register(this.model).subscribe({
      next: () => {
        this.router.navigateByUrl('/boards');
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(this.buildErrorMessage(err));
        console.error('Register error:', err);
      }
    });
  }

  private buildErrorMessage(err: any): string {
    const status = err?.status ?? '?';

    if (status === 409) {
      return 'Ya existe una cuenta con ese email. Probá iniciando sesión.';
    }

    const identityErrors = err?.error?.errors;
    if (Array.isArray(identityErrors)) {
      return identityErrors.join(' ');
    }

    if (identityErrors && typeof identityErrors === 'object') {
      const messages = Object.values(identityErrors).flat().join(' ');
      return messages || 'Datos inválidos.';
    }

    const detail = err?.error?.message || err?.error?.title || err?.message || 'Sin detalles';
    return `Error al registrar (HTTP ${status}). ${detail}`;
  }
}