import { Component, computed, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ArcElement, Chart, ChartConfiguration, ChartType, DoughnutController, Legend, Tooltip } from 'chart.js';
import { TaskStore } from '../task.store';

// Register the components required for the doughnut chart
Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-task-metrics',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './task-metrics.component.html',
  styleUrl: './task-metrics.component.css'
})
export class TaskMetricsComponent {
  // services
  store = inject(TaskStore);

  // viewchild
  readonly chart = viewChild(BaseChartDirective);

  // computed
  doughnutData = computed<ChartConfiguration['data']>(() => {
    const taskCounts = this.store.taskCounts()
    return {
      labels: ['Completed', 'Pending'],
      datasets: [
        { 
          data: [taskCounts.completed, taskCounts.pending],
          backgroundColor: ['#b9f8cf', '#fff085'],
        }
      ],
    };
  });
}
