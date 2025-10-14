import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { Task, TaskStatus } from './task.model';
import { TaskService } from './task.service';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

// State shape
export interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  filter: { status: TaskStatus | 'all'; query: string };
}

// Initial State
const initialState: TaskState = {
  tasks: [],
  isLoading: false,
  filter: { status: 'all', query: '' },
};

// SignalStore
export const TaskStore = signalStore(
  { providedIn: 'root' }, // Make it available application-wide
  withState(initialState),

  // Computed Signals
  withComputed(({ tasks, filter }) => ({
    filteredTasks: computed(() => {
      const allTasks = tasks();
      const { status, query } = filter();

      return allTasks.filter(task => {
        const statusMatch = status === 'all' || task.status === status;
        const queryMatch = !query || task.title.toLowerCase().includes(query.toLowerCase());
        return statusMatch && queryMatch;
      });
    }),
    taskCounts: computed(() => {
        const allTasks = tasks();
        return {
            total: allTasks.length,
            completed: allTasks.filter(t => t.status === 'completed').length,
            pending: allTasks.filter(t => t.status === 'pending').length
        };
    })
  })),

  // Mutate State
  withMethods((store, taskService = inject(TaskService), snackBar = inject(MatSnackBar)) => ({
    // --- STATE UPDATERS ---
    updateStatusFilter(status: TaskStatus | 'all') {
      patchState(store, (state) => ({ filter: { ...state.filter, status } }));
    },
    updateSearchQuery(query: string) {
      patchState(store, (state) => ({ filter: { ...state.filter, query } }));
    },

    // API METHODS
    loadTasks: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() => taskService.getTasks()),
        tap((tasks) => patchState(store, { tasks, isLoading: false }))
      )
    ),

    addTask: rxMethod<Omit<Task, 'id' | 'status'>>(
        pipe(
            switchMap((taskData) => taskService.addTask(taskData).pipe(
                tap(newTask => {
                    patchState(store, (state) => ({ tasks: [...state.tasks, newTask] }));
                    snackBar.open(`Task "${newTask.title}" created!`, '✅', { duration: 3000 });
                })
            ))
        )
    ),

    updateTask: rxMethod<Task>(
        pipe(
            switchMap((updatedTask) => taskService.updateTask(updatedTask).pipe(
                tap(task => {
                    patchState(store, (state) => ({
                        tasks: state.tasks.map(t => t.id === task.id ? task : t)
                    }));
                    snackBar.open(`Task "${task.title}" updated!`, '✔️', { duration: 3000 });
                })
            ))
        )
    ),

    deleteTask: rxMethod<string>(
        pipe(
            switchMap((id) => taskService.deleteTask(id).pipe(
                tap(() => {
                    patchState(store, (state) => ({
                        tasks: state.tasks.filter(t => t.id !== id)
                    }));
                    snackBar.open('Task deleted successfully!', '🗑️', { duration: 3000 });
                })
            ))
        )
    ),
  }))
);