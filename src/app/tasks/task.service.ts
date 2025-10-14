import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Task, TaskStatus } from './task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly STORAGE_KEY = 'tasks';
  private tasks: Task[] = [];

  constructor() {
    // Load tasks from localStorage on initialization
    const savedTasks = localStorage.getItem(this.STORAGE_KEY);
    this.tasks = savedTasks ? JSON.parse(savedTasks) : this.getInitialTasks();
    this.saveTasks();
  }

  private saveTasks(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks));
  }

  private getInitialTasks(): Task[] {
    return [
      { id: '1', title: 'Setup Project', description: 'Create a new Angular project with Material and Tailwind.', status: 'completed' },
      { id: '2', title: 'Create Components', description: 'Generate all necessary components for the task list and form.', status: 'pending' },
      { id: '3', title: 'Implement SignalStore', description: 'Set up the NgRx SignalStore for state management.', status: 'pending' },
    ];
  }

  // Simulate API calls with a delay
  getTasks(): Observable<Task[]> {
    return of(this.tasks).pipe(delay(500));
  }

  addTask(taskData: Omit<Task, 'id' | 'status'>): Observable<Task> {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      status: 'pending',
    };
    this.tasks = [...this.tasks, newTask];
    this.saveTasks();
    return of(newTask).pipe(delay(300));
  }

  updateTask(updatedTask: Task): Observable<Task> {
    this.tasks = this.tasks.map(task => task.id === updatedTask.id ? updatedTask : task);
    this.saveTasks();
    return of(updatedTask).pipe(delay(300));
  }

  deleteTask(taskId: string): Observable<{ id: string }> {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
    this.saveTasks();
    return of({ id: taskId }).pipe(delay(300));
  }
}