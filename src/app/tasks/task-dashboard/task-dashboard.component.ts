import { Component, effect, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Task, TaskStatus } from '../task.model';
import { TaskStore } from '../task.store';
import { TaskFormComponent } from '../task-form/task-form.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { TaskMetricsComponent } from '../task-metrics/task-metrics.component';
import { AuthService } from '../../auth/auth.service';
import { ThemeService } from '../../core/theme.service';

@Component({
  selector: 'app-task-dashboard',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    TitleCasePipe,
    CommonModule,
    TaskMetricsComponent,
],
  templateUrl: './task-dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class TaskDashboardComponent implements OnInit {
  // services
  readonly store = inject(TaskStore);
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);
  readonly theme = inject(ThemeService);

  displayedColumns: string[] = ['title', 'description', 'status', 'actions'];

  ngOnInit(): void {
    this.store.loadTasks();
  }

  onFilterChange(status: TaskStatus | 'all'): void {
    this.store.updateStatusFilter(status);
  }

  onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.store.updateSearchQuery(query);
  }

  openTaskDialog(task?: Task): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '500px',
      data: task ?? null,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      if (task) { // Editing
        this.store.updateTask(result as Task);
      } else { // Creating
        this.store.addTask(result);
      }
    });
  }

  deleteTask(task: Task): void {
    // Optional: Add a confirmation dialog
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
        this.store.deleteTask(task.id);
    }
  }

  logout(): void {
    this.authService.logout();
  }
}