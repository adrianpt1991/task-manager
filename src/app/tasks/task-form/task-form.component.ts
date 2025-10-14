import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Task } from '../task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule],
  templateUrl: './task-form.component.html',
})
export class TaskFormComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<TaskFormComponent>);
  private readonly data: Task | null = inject(MAT_DIALOG_DATA);

  // Inject task data for editing, or null for creating
  isEditMode = !!this.data;

  taskForm = this.fb.group({
    title: [this.data?.title ?? '', [Validators.required, Validators.minLength(3)]],
    description: [this.data?.description ?? '', Validators.required],
    status: [this.data?.status ?? 'pending', Validators.required],
  });

  saveTask(): void {
    if (this.taskForm.invalid) {
      return;
    }

    const taskData = this.isEditMode
      ? { ...this.data, ...this.taskForm.value } // Merge existing id
      : this.taskForm.value;

    this.dialogRef.close(taskData);
  }
}