// Main Application Controller

class MutualFundAnalyzer {
    constructor() {
        this.dataFetcher = new DataFetcher();
        this.calculator = new FinancialCalculations();
        this.visualizer = new Visualizations();
        this.reportGenerator = new ReportGenerator();
        
        this.amfiData = null;
        this.selectedCategory = null;
        this.top10Schemes = [];
        
        this.init();
    }

    async init() {
        console.log('Initializing Mutual Fund Analyzer...');
        
        // Show loading
        this.showLoading(true);
        
        // Fetch AMFI data
        try {
            this.amfiData = await this.dataFetcher.fetchAMFIData();
            console.log(`Data loaded successfully: ${this.amfiData.schemes.length} schemes available`);
            
            // Log category distribution
            const categoryCount = {};
            this.amfiData.schemes.forEach(scheme => {
                categoryCount[scheme.category] = (categoryCount[scheme.category] || 0) + 1;
            });
            console.log('Schemes per category:', categoryCount);
            
        } catch (error) {
            console.error('Error loading data:', error);
            alert('Error loading fund data. Using sample data for demonstration.');
        }
        
        this.showLoading(false);
        
        // Setup event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Category selection
        document.getElementById('category-select').addEventListener('change', async (e) => {
            await this.onCategoryChange(e.target.value);
        });

        // Analyze button
        document.getElementById('analyze-btn').addEventListener('click', () => {
            this.performAnalysis();
        });

        // Reset button
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetForm();
        });

        // Time period checkboxes - at least one must be selected
        const timePeriodCheckboxes = document.querySelectorAll('input[name="time-period"]');
        timePeriodCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.validateTimePeriods();
            });
        });
    }

    async onCategoryChange(category) {
        this.selectedCategory = category;
        
        if (category) {
            // Get all schemes from this category
            const categorySchemes = this.dataFetcher.filterSchemes(this.amfiData, null, category);
            
            console.log(`Category selected: ${category}`);
            console.log(`Total schemes found in category: ${categorySchemes.length}`);
            
            if (categorySchemes.length === 0) {
                console.warn('No schemes found for this category.');
                alert(`No schemes found in ${category} category. Please try another category.`);
                this.top10Schemes = [];
                this.checkAnalyzeButton();
                return;
            }
            
            // Take more schemes initially (top 30) to ensure we get 10 with valid data
            const topSchemes = categorySchemes.slice(0, Math.min(30, categorySchemes.length));
            
            console.log(`Selected top ${topSchemes.length} schemes for NAV fetching`);
            
            // Show loading while fetching NAVs
            const analyzeBtn = document.getElementById('analyze-btn');
            analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading schemes...';
            analyzeBtn.disabled = true;
            
            try {
                // Fetch latest NAVs for top schemes
                await this.dataFetcher.fetchMultipleLatestNAVs(topSchemes);
                
                // Filter schemes with valid NAV and sort
                this.top10Schemes = topSchemes
                    .filter(s => s.nav && s.nav > 0)
                    .sort((a, b) => b.nav - a.nav)
                    .slice(0, 10);
                
                console.log(`Top 10 schemes selected: ${this.top10Schemes.length}`);
                if (this.top10Schemes.length > 0) {
                    console.log('Sample scheme:', this.top10Schemes[0].name, 'NAV:', this.top10Schemes[0].nav);
                    
                    // Show success message to user
                    analyzeBtn.innerHTML = `<i class="fas fa-chart-bar"></i> Analyze Top ${this.top10Schemes.length} Schemes`;
                } else {
                    console.warn('No schemes with valid NAV found.');
                    alert(`Could not fetch NAV data for schemes in ${category} category. Please try again.`);
                    analyzeBtn.innerHTML = '<i class="fas fa-chart-bar"></i> Analyze Performance';
                }
            } catch (error) {
                console.error('Error fetching NAVs:', error);
                alert('Error fetching scheme data. Please try again.');
                analyzeBtn.innerHTML = '<i class="fas fa-chart-bar"></i> Analyze Performance';
            }
            
            // Enable analyze button
            this.checkAnalyzeButton();
        } else {
            this.top10Schemes = [];
            this.checkAnalyzeButton();
        }
    }

    checkAnalyzeButton() {
        const analyzeBtn = document.getElementById('analyze-btn');
        analyzeBtn.disabled = this.top10Schemes.length === 0;
    }

    validateTimePeriods() {
        const checkedPeriods = document.querySelectorAll('input[name="time-period"]:checked');
        
        if (checkedPeriods.length === 0) {
            // Re-check the last unchecked one
            const allPeriods = document.querySelectorAll('input[name="time-period"]');
            allPeriods[0].checked = true;
            alert('At least one time period must be selected');
        }
    }

    getSelectedTimePeriods() {
        const checkboxes = document.querySelectorAll('input[name="time-period"]:checked');
        return Array.from(checkboxes).map(cb => cb.value);
    }

    getSelectedMetrics() {
        const checkboxes = document.querySelectorAll('input[name="metric"]:checked');
        return Array.from(checkboxes).map(cb => cb.value);
    }

    async performAnalysis() {
        // Validate selection
        if (this.top10Schemes.length === 0) {
            alert('Please select a fund category to analyze');
            return;
        }

        // Get selected parameters
        const selectedPeriods = this.getSelectedTimePeriods();
        const selectedMetrics = this.getSelectedMetrics();

        if (selectedPeriods.length === 0) {
            alert('Please select at least one time period');
            return;
        }

        // Destroy all existing charts before starting new analysis
        this.visualizer.destroyAllCharts();

        // Show loading with progress
        this.showLoading(true, 'Fetching latest NAV data...');
        document.getElementById('results-section').style.display = 'none';

        try {
            console.log(`Analyzing top ${this.top10Schemes.length} schemes in ${this.selectedCategory}...`);

            // Step 1: Fetch latest NAVs for all schemes
            this.updateLoadingMessage('Fetching latest NAV data for schemes...');
            await this.dataFetcher.fetchMultipleLatestNAVs(this.top10Schemes);
            
            // Re-sort by latest NAV (some schemes might not have NAV data)
            this.top10Schemes = this.top10Schemes
                .filter(s => s.nav && s.nav > 0)
                .sort((a, b) => b.nav - a.nav)
                .slice(0, 10);
            
            console.log(`Proceeding with ${this.top10Schemes.length} schemes with valid NAV data`);

            // Step 2: Fetch historical data and calculate metrics for each scheme
            const analysisResults = [];
            let completedCount = 0;

            for (const scheme of this.top10Schemes) {
                completedCount++;
                this.updateLoadingMessage(`Analyzing scheme ${completedCount}/${this.top10Schemes.length}: ${scheme.name.substring(0, 50)}...`);
                
                const metrics = {};
                
                // Get longest period to fetch historical data once
                const maxPeriod = Math.max(...selectedPeriods.map(p => this.getPeriodDays(p)));
                
                // Fetch real historical NAV data from MFApi
                const historicalData = await this.dataFetcher.getHistoricalNAV(
                    scheme.schemeCode || scheme.code,
                    maxPeriod
                );
                
                if (!historicalData || historicalData.length < 20) {
                    console.warn(`Insufficient historical data for ${scheme.name}, skipping...`);
                    continue;
                }
                
                // Calculate metrics for each selected period
                for (const period of selectedPeriods) {
                    const days = this.getPeriodDays(period);
                    
                    // Get relevant slice of historical data
                    const periodData = historicalData.slice(-Math.min(days, historicalData.length));
                    
                    if (periodData.length < 10) {
                        console.warn(`Not enough data for period ${period} for ${scheme.name}`);
                        continue;
                    }
                    
                    // Calculate metrics using real data
                    const periodMetrics = this.calculator.calculateAllMetrics(periodData, period);
                    metrics[period] = periodMetrics;
                }
                
                // Only add if we have metrics for at least one period
                if (Object.keys(metrics).length > 0) {
                    analysisResults.push({
                        scheme,
                        metrics,
                        historicalData // Store historical data for visualization
                    });
                }
                
                // Small delay to avoid overwhelming the API
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            if (analysisResults.length === 0) {
                throw new Error('No schemes with sufficient historical data found. Please try a different category.');
            }

            console.log(`Successfully analyzed ${analysisResults.length} schemes`);

            // Step 3: Rank schemes based on selected metrics
            this.updateLoadingMessage('Calculating rankings...');
            const rankedResults = this.rankSchemes(analysisResults, selectedPeriods, selectedMetrics);

            // Step 4: Display results
            this.updateLoadingMessage('Generating visualizations and report...');
            await new Promise(resolve => setTimeout(resolve, 500));
            this.displayResults(rankedResults, selectedPeriods, selectedMetrics);

        } catch (error) {
            console.error('Analysis error:', error);
            alert(`Error performing analysis: ${error.message}\n\nPlease try again or select a different category.`);
        } finally {
            this.showLoading(false);
        }
    }

    updateLoadingMessage(message) {
        const loadingIndicator = document.getElementById('loading-indicator');
        const messageElement = loadingIndicator.querySelector('p');
        if (messageElement) {
            messageElement.textContent = message;
        }
    }

    rankSchemes(analysisResults, selectedPeriods, selectedMetrics) {
        // Use primary period for ranking (1Y preferred)
        const primaryPeriod = selectedPeriods.includes('1Y') ? '1Y' : selectedPeriods[0];
        
        // Calculate overall score for each scheme
        const resultsWithScores = analysisResults.map(result => {
            const metrics = result.metrics[primaryPeriod];
            
            // Calculate composite score based on multiple factors
            let score = 0;
            
            // CAGR (30% weight) - normalized to 0-30 scale
            const cagrScore = Math.min((metrics.cagr / 20) * 30, 30);
            score += cagrScore;
            
            // Sharpe Ratio (25% weight) - normalized to 0-25 scale
            const sharpeScore = Math.min((metrics.sharpeRatio / 2) * 25, 25);
            score += sharpeScore;
            
            // Volatility (20% weight, inverse) - lower is better
            const volatilityScore = Math.max(20 - (metrics.volatility / 30) * 20, 0);
            score += volatilityScore;
            
            // Alpha (15% weight) - normalized to 0-15 scale
            const alphaScore = Math.min(((metrics.alpha + 5) / 10) * 15, 15);
            score += alphaScore;
            
            // Max Drawdown (10% weight, inverse) - lower is better
            const drawdownScore = Math.max(10 - (metrics.maxDrawdown / 40) * 10, 0);
            score += drawdownScore;
            
            return {
                ...result,
                overallScore: score,
                rank: 0 // Will be assigned after sorting
            };
        });
        
        // Sort by overall score (descending)
        resultsWithScores.sort((a, b) => b.overallScore - a.overallScore);
        
        // Assign ranks
        resultsWithScores.forEach((result, index) => {
            result.rank = index + 1;
        });
        
        return resultsWithScores;
    }

    getPeriodDays(period) {
        const periodDays = {
            '1M': 21,
            '3M': 63,
            '6M': 126,
            '1Y': 252,
            '3Y': 756,
            '5Y': 1260
        };
        return periodDays[period] || 252;
    }

    getExpectedReturn(category) {
        // Expected annual returns by category
        const returns = {
            'Large Cap Fund': 12,
            'Mid Cap Fund': 15,
            'Small Cap Fund': 18,
            'Multi Cap Fund': 14,
            'Flexi Cap Fund': 14,
            'Large & Mid Cap Fund': 13,
            'Liquid Fund': 6,
            'Ultra Short Duration Fund': 7,
            'Short Duration Fund': 8,
            'Medium Duration Fund': 8,
            'Long Duration Fund': 9,
            'Conservative Hybrid Fund': 9,
            'Balanced Hybrid Fund': 11,
            'Aggressive Hybrid Fund': 13,
            'Index Fund': 11,
            'ELSS': 13,
            'Sectoral': 15
        };
        return returns[category] || 12;
    }

    getExpectedVolatility(category) {
        // Expected annual volatility by category
        const volatilities = {
            'Large Cap Fund': 18,
            'Mid Cap Fund': 22,
            'Small Cap Fund': 28,
            'Multi Cap Fund': 20,
            'Flexi Cap Fund': 19,
            'Large & Mid Cap Fund': 20,
            'Liquid Fund': 2,
            'Ultra Short Duration Fund': 3,
            'Short Duration Fund': 4,
            'Medium Duration Fund': 6,
            'Long Duration Fund': 8,
            'Conservative Hybrid Fund': 8,
            'Balanced Hybrid Fund': 12,
            'Aggressive Hybrid Fund': 15,
            'Index Fund': 18,
            'ELSS': 20,
            'Sectoral': 25
        };
        return volatilities[category] || 18;
    }

    displayResults(rankedResults, selectedPeriods, selectedMetrics) {
        const schemeNames = rankedResults.map(r => r.scheme.name);
        const metricsDataArray = rankedResults.map(r => r.metrics);

        // Show results section
        document.getElementById('results-section').style.display = 'block';

        // Scroll to results
        document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });

        // Create quick stats for top performer
        const topPerformer = rankedResults[0];
        this.visualizer.createQuickStats('quick-stats', topPerformer.metrics, topPerformer.scheme.name);

        // Get primary period data (1Y preferred)
        const primaryPeriod = selectedPeriods.includes('1Y') ? '1Y' : selectedPeriods[0];
        const primaryMetrics = metricsDataArray.map(m => m[primaryPeriod]);

        // All results (top 10)
        const allResults = rankedResults;
        const allNames = schemeNames;
        const allMetrics = primaryMetrics;

        // Create NAV trend chart (all 10 schemes) using real historical data
        const navDataArray = allResults.map(r => {
            // Use the real historical data we fetched during analysis
            if (r.historicalData) {
                // Get data for the primary period
                const days = this.getPeriodDays(primaryPeriod);
                return r.historicalData.slice(-Math.min(days, r.historicalData.length));
            }
            return [];
        });
        this.visualizer.createNAVChart('nav-chart', navDataArray, allNames);

        // Create risk-return scatter plot (all 10 schemes)
        this.visualizer.createRiskReturnChart('risk-return-chart', allMetrics, allNames);

        // Hide rolling returns chart for category comparison
        document.getElementById('rolling-returns-card').style.display = 'none';

        // Create drawdown chart (all 10 schemes)
        this.visualizer.createDrawdownChart('drawdown-chart', navDataArray, allNames);

        // Create expense ratio chart (all 10 schemes)
        if (selectedMetrics.includes('expense-ratio')) {
            document.getElementById('expense-card').style.display = 'block';
            this.visualizer.createExpenseRatioChart('expense-chart', allMetrics, allNames);
        } else {
            document.getElementById('expense-card').style.display = 'none';
        }

        // Create ranked metrics table (all 10 schemes)
        this.visualizer.createMetricsTable(
            'metrics-table',
            rankedResults,
            schemeNames,
            selectedMetrics,
            selectedPeriods,
            true // Show ranking
        );

        // Generate AI report with category analysis
        this.reportGenerator.generateCategoryReport(
            this.selectedCategory,
            rankedResults,
            selectedPeriods,
            selectedMetrics
        );
    }

    showLoading(show, message = 'Analyzing fund performance...') {
        const loadingIndicator = document.getElementById('loading-indicator');
        loadingIndicator.style.display = show ? 'block' : 'none';
        
        if (show) {
            const messageElement = loadingIndicator.querySelector('p');
            if (messageElement) {
                messageElement.textContent = message;
            }
        }
    }

    resetForm() {
        // Reset all form elements
        document.getElementById('category-select').value = '';

        // Reset checkboxes to defaults
        const timeCheckboxes = document.querySelectorAll('input[name="time-period"]');
        timeCheckboxes.forEach((cb, index) => {
            cb.checked = index < 5; // Check first 5 periods by default
        });

        const metricCheckboxes = document.querySelectorAll('input[name="metric"]');
        metricCheckboxes.forEach(cb => {
            const defaultMetrics = ['returns', 'sharpe-ratio', 'volatility', 'max-drawdown'];
            cb.checked = defaultMetrics.includes(cb.value);
        });

        // Reset data
        this.selectedCategory = null;
        this.top10Schemes = [];

        // Reset button text
        const analyzeBtn = document.getElementById('analyze-btn');
        analyzeBtn.innerHTML = '<i class="fas fa-chart-bar"></i> Analyze Performance';

        // Hide results
        document.getElementById('results-section').style.display = 'none';

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Disable analyze button
        this.checkAnalyzeButton();
    }
}

// Initialize the application when DOM is ready
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new MutualFundAnalyzer();
});
