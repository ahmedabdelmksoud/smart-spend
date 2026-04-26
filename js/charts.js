/* ==========================================================
   charts.js — Shared Chart Configurations (Chart.js)
   Smart Spend | Used on: dashboard.html, reports.html
   ========================================================== */

/**
 * Initializes the Spending Trend line chart.
 * @param {string} canvasId - The ID of the <canvas> element.
 */
function initSpendingTrendChart(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
            // Fixed: labels count now matches data points count (9 each)
            labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP'],
            datasets: [{
                label: 'Spending',
                data: [30000, 36000, 48000, 40000, 52000, 59000, 70000, 64000, 78000],
                borderColor: '#125e3a',
                backgroundColor: '#125e3a',
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: '#125e3a',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 90000,
                    ticks: {
                        stepSize: 10000,
                        callback: (value) => value.toLocaleString(),
                        font: { size: 10 }
                    },
                    grid: { display: false }
                },
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 10, weight: 'bold' } }
                }
            }
        }
    });
}

/**
 * Initializes the Category Breakdown doughnut chart.
 * @param {string} canvasId - The ID of the <canvas> element.
 */
function initCategoryBreakdownChart(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    new Chart(canvas.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['Dining', 'Groceries', 'Others', 'Shopping', 'Entertainment', 'Health', 'Transport'],
            datasets: [{
                data: [23, 33.1, 3.73, 6.53, 7.93, 10.5, 15.2],
                backgroundColor: [
                    '#125e3a', // Dining
                    '#fbbf24', // Groceries
                    '#6b7280', // Others
                    '#f59e0b', // Shopping
                    '#8b5cf6', // Entertainment
                    '#10b981', // Health
                    '#3b82f6'  // Transport
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '50%',
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        font: { size: 11 },
                        padding: 15
                    }
                }
            }
        }
    });
}
