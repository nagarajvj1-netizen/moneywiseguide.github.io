// Visualizations Module - Chart.js implementations

class Visualizations {
    constructor() {
        this.charts = {};
        this.colors = [
            '#0066cc', '#00a86b', '#ff6b35', '#9c27b0', '#ff9800',
            '#e91e63', '#009688', '#795548', '#607d8b', '#f44336'
        ];
    }

    // Destroy existing chart if it exists
    destroyChart(chartId) {
        // First, try to get chart from Chart.js registry
        const existingChart = Chart.getChart(chartId);
        if (existingChart) {
            existingChart.destroy();
        }
        
        // Also clean up our own tracking
        if (this.charts[chartId]) {
            this.charts[chartId].destroy();
            delete this.charts[chartId];
        }
    }

    // Destroy all charts
    destroyAllCharts() {
        // Destroy all tracked charts
        Object.keys(this.charts).forEach(chartId => {
            this.destroyChart(chartId);
        });
        
        // Also destroy any charts in Chart.js registry
        const chartIds = ['nav-chart', 'risk-return-chart', 'rolling-returns-chart', 'drawdown-chart', 'expense-chart'];
        chartIds.forEach(id => {
            const existingChart = Chart.getChart(id);
            if (existingChart) {
                existingChart.destroy();
            }
        });
        
        // Clear our tracking object
        this.charts = {};
    }

    // Create NAV Performance Trend Chart
    createNAVChart(canvasId, navDataArray, schemeNames) {
        this.destroyChart(canvasId);
        
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        const datasets = navDataArray.map((navData, index) => ({
            label: schemeNames[index],
            data: navData.map(d => ({ 
                x: this.parseDate(d.date), 
                y: d.nav 
            })),
            borderColor: this.colors[index % this.colors.length],
            backgroundColor: this.colors[index % this.colors.length] + '20',
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,
            tension: 0.1,
            fill: navDataArray.length === 1
        }));

        this.charts[canvasId] = new Chart(ctx, {
            type: 'line',
            data: { datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    title: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ₹' + context.parsed.y.toFixed(2);
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'month',
                            displayFormats: {
                                month: 'MMM yyyy'
                            }
                        },
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'NAV (₹)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '₹' + value.toFixed(2);
                            }
                        }
                    }
                }
            }
        });
    }

    // Create Risk-Return Scatter Plot
    createRiskReturnChart(canvasId, metricsData, schemeNames) {
        this.destroyChart(canvasId);
        
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        const datasets = metricsData.map((metrics, index) => ({
            label: schemeNames[index],
            data: [{
                x: metrics.volatility,
                y: metrics.cagr
            }],
            backgroundColor: this.colors[index % this.colors.length],
            borderColor: this.colors[index % this.colors.length],
            pointRadius: 8,
            pointHoverRadius: 12
        }));

        this.charts[canvasId] = new Chart(ctx, {
            type: 'scatter',
            data: { datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    title: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + 
                                       '\nRisk: ' + context.parsed.x.toFixed(2) + '%' +
                                       '\nReturn: ' + context.parsed.y.toFixed(2) + '%';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Risk (Volatility %)'
                        },
                        ticks: {
                            callback: function(value) {
                                return value.toFixed(1) + '%';
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Return (CAGR %)'
                        },
                        ticks: {
                            callback: function(value) {
                                return value.toFixed(1) + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    // Create Rolling Returns Chart
    createRollingReturnsChart(canvasId, rollingReturnsArray, schemeNames) {
        this.destroyChart(canvasId);
        
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        const datasets = rollingReturnsArray.map((rollingReturns, index) => ({
            label: schemeNames[index],
            data: rollingReturns.map(d => ({ 
                x: this.parseDate(d.date), 
                y: d.returns 
            })),
            borderColor: this.colors[index % this.colors.length],
            backgroundColor: this.colors[index % this.colors.length] + '20',
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,
            tension: 0.1,
            fill: false
        }));

        this.charts[canvasId] = new Chart(ctx, {
            type: 'line',
            data: { datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    title: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y.toFixed(2) + '%';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'month',
                            displayFormats: {
                                month: 'MMM yyyy'
                            }
                        },
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: '1-Year Rolling Returns (%)'
                        },
                        ticks: {
                            callback: function(value) {
                                return value.toFixed(1) + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    // Create Drawdown Chart
    createDrawdownChart(canvasId, navDataArray, schemeNames) {
        this.destroyChart(canvasId);
        
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        const datasets = navDataArray.map((navData, index) => {
            const drawdownData = this.calculateDrawdownSeries(navData);
            return {
                label: schemeNames[index],
                data: drawdownData.map(d => ({ 
                    x: this.parseDate(d.date), 
                    y: d.drawdown 
                })),
                borderColor: this.colors[index % this.colors.length],
                backgroundColor: this.colors[index % this.colors.length] + '40',
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 4,
                tension: 0.1,
                fill: true
            };
        });

        this.charts[canvasId] = new Chart(ctx, {
            type: 'line',
            data: { datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    title: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y.toFixed(2) + '%';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'month',
                            displayFormats: {
                                month: 'MMM yyyy'
                            }
                        },
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Drawdown (%)'
                        },
                        reverse: true,
                        ticks: {
                            callback: function(value) {
                                return value.toFixed(1) + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    // Calculate drawdown series for visualization
    calculateDrawdownSeries(navData) {
        const drawdownData = [];
        let peak = navData[0].nav;
        
        for (let i = 0; i < navData.length; i++) {
            const currentNav = navData[i].nav;
            
            if (currentNav > peak) {
                peak = currentNav;
            }
            
            const drawdown = ((currentNav - peak) / peak) * 100;
            
            drawdownData.push({
                date: navData[i].date,
                drawdown: Math.abs(drawdown)
            });
        }
        
        return drawdownData;
    }

    // Create Expense Ratio Comparison Chart
    createExpenseRatioChart(canvasId, metricsData, schemeNames) {
        this.destroyChart(canvasId);
        
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        this.charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: schemeNames,
                datasets: [{
                    label: 'Expense Ratio',
                    data: metricsData.map(m => m.expenseRatio),
                    backgroundColor: this.colors.slice(0, schemeNames.length),
                    borderColor: this.colors.slice(0, schemeNames.length),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Expense Ratio: ' + context.parsed.y.toFixed(2) + '%';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Schemes'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Expense Ratio (%)'
                        },
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toFixed(2) + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    // Create Performance Metrics Table with Rankings
    createMetricsTable(tableId, resultsArray, schemeNames, selectedMetrics, selectedPeriods, showRanking = false) {
        const table = document.getElementById(tableId);
        table.innerHTML = '';

        // Create table header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        // Add rank column if showing rankings
        if (showRanking) {
            const rankHeader = document.createElement('th');
            rankHeader.textContent = 'Rank';
            rankHeader.style.width = '60px';
            rankHeader.style.textAlign = 'center';
            headerRow.appendChild(rankHeader);
        }
        
        const schemeHeader = document.createElement('th');
        schemeHeader.textContent = 'Scheme Name';
        schemeHeader.style.minWidth = '250px';
        headerRow.appendChild(schemeHeader);

        // Define metrics to display
        const metricsToShow = {
            'returns': 'Returns (%)',
            'cagr': 'CAGR (%)',
            'volatility': 'Volatility (%)',
            'sharpe-ratio': 'Sharpe',
            'sortino-ratio': 'Sortino',
            'max-drawdown': 'Max DD (%)',
            'beta': 'Beta',
            'alpha': 'Alpha (%)',
            'information-ratio': 'Info Ratio',
            'treynor-ratio': 'Treynor',
            'expense-ratio': 'Expense (%)'
        };

        // Filter metrics based on selection
        const filteredMetrics = Object.keys(metricsToShow).filter(key => 
            selectedMetrics.includes(key) || key === 'returns' || key === 'cagr'
        );

        // Add overall score column if ranking
        if (showRanking) {
            filteredMetrics.forEach(metricKey => {
                const th = document.createElement('th');
                th.textContent = metricsToShow[metricKey];
                th.style.textAlign = 'center';
                headerRow.appendChild(th);
            });
            
            const scoreHeader = document.createElement('th');
            scoreHeader.textContent = 'Score';
            scoreHeader.style.textAlign = 'center';
            scoreHeader.style.backgroundColor = '#4CAF50';
            scoreHeader.style.color = 'white';
            headerRow.appendChild(scoreHeader);
        } else {
            filteredMetrics.forEach(metricKey => {
                const th = document.createElement('th');
                th.textContent = metricsToShow[metricKey];
                th.style.textAlign = 'center';
                headerRow.appendChild(th);
            });
        }

        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create table body
        const tbody = document.createElement('tbody');

        // Use primary period for table
        const primaryPeriod = selectedPeriods.includes('1Y') ? '1Y' : selectedPeriods[0];

        // Add row for each scheme
        resultsArray.forEach((result, index) => {
            const row = document.createElement('tr');
            
            // Rank column
            if (showRanking) {
                const rankCell = document.createElement('td');
                rankCell.textContent = result.rank || (index + 1);
                rankCell.style.fontWeight = '700';
                rankCell.style.textAlign = 'center';
                rankCell.style.fontSize = '1.1rem';
                
                // Color code top 3
                if (result.rank <= 3) {
                    rankCell.style.color = result.rank === 1 ? '#FFD700' : 
                                          result.rank === 2 ? '#C0C0C0' : '#CD7F32';
                }
                
                row.appendChild(rankCell);
            }
            
            // Scheme name
            const nameCell = document.createElement('td');
            nameCell.textContent = result.scheme.name;
            nameCell.style.fontWeight = '500';
            row.appendChild(nameCell);

            // Metrics
            const periodMetrics = result.metrics[primaryPeriod];
            
            filteredMetrics.forEach(metricKey => {
                const valueCell = document.createElement('td');
                valueCell.style.textAlign = 'center';
                
                if (periodMetrics) {
                    let value = this.getMetricValue(periodMetrics, metricKey);
                    valueCell.textContent = value;
                    
                    // Color coding for positive/negative values
                    if (this.isPositiveMetric(metricKey) && parseFloat(value) > 0) {
                        valueCell.classList.add('positive-value');
                    } else if (parseFloat(value) < 0 && metricKey !== 'max-drawdown') {
                        valueCell.classList.add('negative-value');
                    }
                } else {
                    valueCell.textContent = 'N/A';
                }
                
                row.appendChild(valueCell);
            });

            // Overall score
            if (showRanking && result.overallScore) {
                const scoreCell = document.createElement('td');
                scoreCell.textContent = result.overallScore.toFixed(1);
                scoreCell.style.fontWeight = '700';
                scoreCell.style.textAlign = 'center';
                scoreCell.style.backgroundColor = '#e8f5e9';
                row.appendChild(scoreCell);
            }

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
    }

    // Get metric value from metrics object
    getMetricValue(metrics, metricKey) {
        const calc = new FinancialCalculations();
        
        switch(metricKey) {
            case 'returns':
                return calc.formatPercentage(metrics.absoluteReturns);
            case 'cagr':
                return calc.formatPercentage(metrics.cagr);
            case 'volatility':
                return calc.formatPercentage(metrics.volatility);
            case 'sharpe-ratio':
                return calc.formatNumber(metrics.sharpeRatio);
            case 'sortino-ratio':
                return calc.formatNumber(metrics.sortinoRatio);
            case 'max-drawdown':
                return calc.formatPercentage(metrics.maxDrawdown);
            case 'beta':
                return calc.formatNumber(metrics.beta);
            case 'alpha':
                return calc.formatPercentage(metrics.alpha);
            case 'information-ratio':
                return calc.formatNumber(metrics.informationRatio);
            case 'treynor-ratio':
                return calc.formatNumber(metrics.treynorRatio);
            case 'expense-ratio':
                return calc.formatPercentage(metrics.expenseRatio);
            default:
                return 'N/A';
        }
    }

    // Check if metric is positive (higher is better)
    isPositiveMetric(metricKey) {
        const positiveMetrics = ['returns', 'cagr', 'sharpe-ratio', 'sortino-ratio', 
                                 'alpha', 'information-ratio', 'treynor-ratio'];
        return positiveMetrics.includes(metricKey);
    }

    // Get period label
    getPeriodLabel(period) {
        const labels = {
            '1M': '1 Month',
            '3M': '3 Months',
            '6M': '6 Months',
            '1Y': '1 Year',
            '3Y': '3 Years',
            '5Y': '5 Years'
        };
        return labels[period] || period;
    }

    // Create Quick Stats Cards
    createQuickStats(containerId, metricsData, schemeName) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        // Use 1Y metrics if available, otherwise use the first available period
        const metrics = metricsData['1Y'] || Object.values(metricsData)[0];
        
        if (!metrics) return;

        const calc = new FinancialCalculations();

        // Define stats to show
        const stats = [
            {
                label: 'Current NAV',
                value: calc.formatCurrency(metrics.endNav),
                change: `As of ${metrics.endDate}`,
                class: ''
            },
            {
                label: 'CAGR',
                value: calc.formatPercentage(metrics.cagr),
                change: `${this.getPeriodLabel(metrics.period)}`,
                class: metrics.cagr >= 0 ? 'success' : 'danger'
            },
            {
                label: 'Volatility',
                value: calc.formatPercentage(metrics.volatility),
                change: 'Annualized',
                class: 'warning'
            },
            {
                label: 'Sharpe Ratio',
                value: calc.formatNumber(metrics.sharpeRatio),
                change: 'Risk-adjusted return',
                class: metrics.sharpeRatio >= 1 ? 'success' : ''
            },
            {
                label: 'Max Drawdown',
                value: calc.formatPercentage(metrics.maxDrawdown),
                change: 'Worst decline',
                class: 'danger'
            },
            {
                label: 'Expense Ratio',
                value: calc.formatPercentage(metrics.expenseRatio),
                change: 'Annual cost',
                class: ''
            }
        ];

        stats.forEach(stat => {
            const card = document.createElement('div');
            card.className = `stat-card ${stat.class}`;
            card.innerHTML = `
                <div class="stat-label">${stat.label}</div>
                <div class="stat-value">${stat.value}</div>
                <div class="stat-change">${stat.change}</div>
            `;
            container.appendChild(card);
        });
    }

    // Helper method to parse date from DD-MM-YYYY format
    parseDate(dateString) {
        if (!dateString) return null;
        
        // If already a Date object, return it
        if (dateString instanceof Date) return dateString;
        
        // Parse DD-MM-YYYY format (e.g., "19-10-2024")
        const parts = dateString.split('-');
        if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
            const year = parseInt(parts[2], 10);
            return new Date(year, month, day);
        }
        
        // Fallback: try to parse as-is
        return new Date(dateString);
    }
}

// Export for use in other modules
window.Visualizations = Visualizations;
