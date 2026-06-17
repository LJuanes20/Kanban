import { Component, inject, output, input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})
export class NavbarComponent {
    private router = inject(Router);
    private authService = inject(AuthService);

    searchQuery = output<string>();

    currentUser = this.authService.currentUser;
    searchText = '';
    showUserMenu = false;

    currentSection = toSignal(
        this.router.events.pipe(
            filter(e => e instanceof NavigationEnd),
            map((e: any) => {
                if (e.url.includes('/boards/')) return 'tasks';
                if (e.url.includes('/boards')) return 'boards';
                return 'none';
            })
        ),
        { initialValue: 'none' }
    );

    get searchPlaceholder(): string {
        return this.currentSection() === 'tasks'
            ? 'Buscar tareas...'
            : 'Buscar tableros...';
    }

    get isAuthPage(): boolean {
        const url = this.router.url;
        return url.includes('/login') || url.includes('/register');
    }

    onSearch(): void {
        this.searchQuery.emit(this.searchText);
    }

    toggleUserMenu(): void {
        this.showUserMenu = !this.showUserMenu;
    }

    closeUserMenu(): void {
        this.showUserMenu = false;
    }

    logout(): void {
        this.showUserMenu = false;
        this.authService.logout();
        this.router.navigateByUrl('/login');
    }
}