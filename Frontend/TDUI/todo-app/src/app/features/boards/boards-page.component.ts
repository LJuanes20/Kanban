import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-boards-page',
    imports: [],
    template: `
    <div class="placeholder">
        <h1>Hola, {{ authService.currentUser()?.displayName ?? 'usuario' }}</h1>
        <p style="color: forestgreen;"><b>Logueo exitoso</b></p>
        <button class="logout-btn" type="button" (click)="logout()">Cerrar sesión</button>
    </div>`,
    styles: [`
    .placeholder {
        max-width: 600px;
        margin: 60px auto;
        padding: 32px;
        background: #fff;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(15, 23, 42, 0.08);
        text-align: center;
    }

    .placeholder h1 {
        margin: 0 0 12px;
        color: #111827;
    }

    .placeholder p {
        color: #6b7280;
        margin: 0 0 24px;
    }

    .logout-btn {
        border: none;
        background: #f3f4f6;
        color: #111827;
        padding: 10px 18px;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
    }

    .logout-btn:hover {
        background: #e5e7eb;
    }`]
})
export class BoardsPageComponent {
    authService = inject(AuthService);
    private router = inject(Router);

    logout(): void {
        this.authService.logout();
        this.router.navigateByUrl('/login');
    }
}