import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface BoardOwner {
    id: string;
    displayName: string;
}

export interface Board {
    id: number;
    name: string;
    description: string | null;
    createdAt: string;
    owner: BoardOwner;
}

export interface CreateBoardRequest {
    name: string;
    description?: string | null;
}

@Injectable({ providedIn: 'root' })
export class BoardService {
    private readonly apiUrl = `${environment.apiUrl}/boards`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<Board[]> {
        return this.http.get<Board[]>(this.apiUrl);
    }

    getById(id: number): Observable<Board> {
        return this.http.get<Board>(`${this.apiUrl}/${id}`);
    }

    create(request: CreateBoardRequest): Observable<Board> {
        return this.http.post<Board>(this.apiUrl, request);
    }
}