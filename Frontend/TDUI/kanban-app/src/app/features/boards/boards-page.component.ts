import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { BoardService, Board, CreateBoardRequest } from '../../services/board.service';
import { SearchService } from '../../services/search.service';

@Component({
    selector: 'app-boards-page',
    standalone: true,
    imports: [FormsModule, RouterLink, DatePipe],
    templateUrl: './boards-page.component.html',
    styleUrls: ['./boards-page.component.css']
})
export class BoardsPageComponent implements OnInit {
    private authService = inject(AuthService);
    private boardService = inject(BoardService);
    private router = inject(Router);

    currentUser = this.authService.currentUser;

    boards = signal<Board[]>([]);
    isLoading = signal(false);
    errorMessage = signal('');

    // Estado del modal de crear board
    showModal = signal(false);
    isCreating = signal(false);
    createError = signal('');
    newBoard: CreateBoardRequest = { name: '', description: '' };

    ngOnInit(): void {
        this.loadBoards();
    }

    loadBoards(): void {
        this.isLoading.set(true);
        this.errorMessage.set('');

        this.boardService.getAll().subscribe({
            next: (boards) => {
                this.boards.set(boards);
                this.isLoading.set(false);
            },
            error: () => {
                this.errorMessage.set('Error al cargar los tableros.');
                this.isLoading.set(false);
            }
        });
    }

    openModal(): void {
        this.newBoard = { name: '', description: '' };
        this.createError.set('');
        this.showModal.set(true);
    }

    closeModal(): void {
        this.showModal.set(false);
    }

    createBoard(): void {
        if (!this.newBoard.name.trim()) return;

        this.isCreating.set(true);
        this.createError.set('');

        this.boardService.create(this.newBoard).subscribe({
            next: (board) => {
                this.boards.update(list => [board, ...list]);
                this.isCreating.set(false);
                this.closeModal();
            },
            error: () => {
                this.createError.set('Error al crear el tablero.');
                this.isCreating.set(false);
            }
        });
    }

    goToBoard(id: number): void {
        this.router.navigate(['/boards', id]);
    }

    logout(): void {
        this.authService.logout();
        this.router.navigateByUrl('/login');
    }

    private searchService = inject(SearchService);

    filteredBoards = computed(() => {
        const q = this.searchService.query().toLowerCase().trim();
        if (!q) return this.boards();
        return this.boards().filter(b =>
            b.name.toLowerCase().includes(q) ||
            (b.description ?? '').toLowerCase().includes(q)
        );
    });
}