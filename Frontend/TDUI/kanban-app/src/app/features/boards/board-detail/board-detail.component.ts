import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BoardService, Board } from '../../../services/board.service';
import { TaskService, TaskItem, CreateTaskRequest } from '../../../services/tasks.service';
import { SearchService } from '../../../services/search.service';
interface Column {
    statusId: number;
    name: string;
}

const COLUMNS: Column[] = [
    { statusId: 1, name: 'Backlog' },
    { statusId: 2, name: 'In Progress' },
    { statusId: 3, name: 'Review' },
    { statusId: 4, name: 'Done' }
];

const POINTS = [1, 2, 3, 5, 8, 13, 21]; // Fibonacci.

@Component({
    selector: 'app-board-detail',
    standalone: true,
    imports: [FormsModule, DatePipe],
    templateUrl: './board-detail.component.html',
    styleUrl: './board-detail.component.css'
})
export class BoardDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private boardService = inject(BoardService);
    private taskService = inject(TaskService);

    board = signal<Board | null>(null);
    tasks = signal<TaskItem[]>([]);
    isLoading = signal(true);
    errorMessage = signal('');

    // Modal
    showTaskModal = signal(false);
    isCreating = signal(false);
    createError = signal('');
    newTask: CreateTaskRequest = { title: '', description: '', points: 1 };
    draggedTask = signal<TaskItem | null>(null);

    readonly columns = COLUMNS;
    readonly pointOptions = POINTS;

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (!id) { this.router.navigate(['/boards']); return; }
        this.loadAll(id);
    }

    private loadAll(boardId: number): void {
        this.isLoading.set(true);

        this.boardService.getById(boardId).subscribe({
            next: (board) => {
                this.board.set(board);
                this.taskService.getByBoard(boardId).subscribe({
                    next: (tasks) => { this.tasks.set(tasks); this.isLoading.set(false); },
                    error: () => { this.errorMessage.set('Error al cargar las tareas.'); this.isLoading.set(false); }
                });
            },
            error: () => { this.router.navigate(['/boards']); }
        });
    }

    openTaskModal(): void {
        this.newTask = { title: '', description: '', points: 1 };
        this.createError.set('');
        this.showTaskModal.set(true);
    }

    closeTaskModal(): void { this.showTaskModal.set(false); }

    createTask(): void {
        if (!this.newTask.title.trim()) return;
        this.isCreating.set(true);
        this.createError.set('');

        this.taskService.create(this.board()!.id, this.newTask).subscribe({
            next: (task) => {
                this.tasks.update(list => [...list, task]);
                this.isCreating.set(false);
                this.closeTaskModal();
            },
            error: () => {
                this.createError.set('Error al crear la tarea.');
                this.isCreating.set(false);
            }
        });
    }

    moveTask(task: TaskItem, direction: 'prev' | 'next'): void {
        const newStatusId = direction === 'next' ? task.statusId + 1 : task.statusId - 1;
        if (newStatusId < 1 || newStatusId > 4) return;
        this.applyStatusChange(task, newStatusId);
    }

    onDragStart(task: TaskItem): void { this.draggedTask.set(task); }

    onDragOver(event: DragEvent): void { event.preventDefault(); }

    onDrop(event: DragEvent, statusId: number): void {
        event.preventDefault();
        const task = this.draggedTask();
        if (!task || task.statusId === statusId) return;
        this.applyStatusChange(task, statusId);
        this.draggedTask.set(null);
    }

    onDragEnd(): void { this.draggedTask.set(null); }

    private applyStatusChange(task: TaskItem, newStatusId: number): void {
        const boardId = this.board()!.id;

        this.tasks.update(list =>
            list.map(t => t.id === task.id ? { ...t, statusId: newStatusId } : t)
        );

        this.taskService.updateStatus(boardId, task.id, newStatusId).subscribe({
            error: () => {
                this.tasks.update(list =>
                    list.map(t => t.id === task.id ? { ...t, statusId: task.statusId } : t)
                );
            }
        });
    }

    goBack(): void { this.router.navigate(['/boards']); }

    private searchService = inject(SearchService);

    filteredTasks = computed(() => {
        const q = this.searchService.query().toLowerCase().trim();
        if (!q) return this.tasks();
        return this.tasks().filter(t =>
            t.title.toLowerCase().includes(q) ||
            (t.description ?? '').toLowerCase().includes(q)
        );
    });

    tasksByStatus = computed(() => {
        const map = new Map<number, TaskItem[]>();
        for (const col of COLUMNS) map.set(col.statusId, []);
        for (const task of this.filteredTasks()) {
            map.get(task.statusId)?.push(task);
        }
        return map;
    });
}