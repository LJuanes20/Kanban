import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TaskItem {
    id: number;
    boardId: number;
    title: string;
    description: string | null;
    statusId: number;
    statusName: string;
    points: number;
    assignedUserId: string | null;
    assignedUserDisplayName: string | null;
    createdById: string;
    createdByDisplayName: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTaskRequest {
    title: string;
    description?: string | null;
    points: number;
}

export interface UpdateTaskStatusRequest {
    statusId: number;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
    private readonly apiUrl = `${environment.apiUrl}/boards`;

    constructor(private http: HttpClient) { }

    getByBoard(boardId: number): Observable<TaskItem[]> {
        return this.http.get<TaskItem[]>(`${this.apiUrl}/${boardId}/tasks`);
    }

    create(boardId: number, request: CreateTaskRequest): Observable<TaskItem> {
        return this.http.post<TaskItem>(`${this.apiUrl}/${boardId}/tasks`, request);
    }

    updateStatus(boardId: number, taskId: number, statusId: number): Observable<TaskItem> {
        return this.http.patch<TaskItem>(
            `${this.apiUrl}/${boardId}/tasks/${taskId}/status`,
            { statusId }
        );
    }
}