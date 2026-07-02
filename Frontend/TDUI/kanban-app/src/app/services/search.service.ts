import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SearchService {
    query = signal('');

    setQuery(q: string): void {
        this.query.set(q);
    }

    clear(): void {
        this.query.set('');
    }
}