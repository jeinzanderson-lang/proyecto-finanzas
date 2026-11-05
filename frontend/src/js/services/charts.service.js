// src/js/services/charts.service.js
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);
Chart.defaults.font.family = "'Segoe UI', system-ui, sans-serif";
Chart.defaults.color = '#6c757d';

const chartInstances = {};

export const chartsService = {
  createLineChart(canvasId, data) {
    if (chartInstances[canvasId]) chartInstances[canvasId].destroy();
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    chartInstances[canvasId] = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: { y: { beginAtZero: true, ticks: { callback: (value) => '$' + value.toLocaleString() } } },
      },
    });
    return chartInstances[canvasId];
  },
  createDoughnutChart(canvasId, data) {
    if (chartInstances[canvasId]) chartInstances[canvasId].destroy();
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    chartInstances[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
      },
    });
    return chartInstances[canvasId];
  },
  createBarChart(canvasId, data, options = {}) {
    if (chartInstances[canvasId]) chartInstances[canvasId].destroy();
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    chartInstances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: options.indexAxis || 'x',
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { callback: (value) => '$' + value.toLocaleString() } },
          x: { grid: { display: false } }
        }
      }
    });
    return chartInstances[canvasId];
  },
  destroyAll() {
    Object.keys(chartInstances).forEach((key) => {
      if (chartInstances[key]) { chartInstances[key].destroy(); delete chartInstances[key]; }
    });
  },
};