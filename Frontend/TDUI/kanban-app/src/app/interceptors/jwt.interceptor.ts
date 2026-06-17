import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.getToken();

    if (!token || authService.isTokenExpired()) {
        return next(req);
    }

    const authReq = req.clone({
        setHeaders: {
            // Seteo del barer token en el header de autorización.
            Authorization: `Bearer ${token}`
        }
    });

    return next(authReq);
};