# Technical Documentation - Mutual Fund Performance Analyzer

## 🏗️ Architecture Overview

### System Architecture
```
┌─────────────────────────────────────────────────────────┐
│                     User Interface                       │
│              (index.html + style.css)                    │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              Main Application Controller                 │
│                   (main.js)                             │
│  - Event handling                                       │
│  - State management                                     │
│  - Workflow orchestration                               │
└────┬──────┬──────┬──────┬──────┬─────────────────────┘
     │      │      │      │      │
     ▼      ▼      ▼      ▼      ▼
┌─────────┐ ┌──────┐ ┌─────┐ ┌─────┐ ┌────────┐
│ Data    │ │ Calc │ │ Viz │ │Reprt│ │ Export │
│ Fetcher │ │      │ │     │ │ Gen │ │        │
└─────────┘ └──────┘ └─────┘ └─────┘ └────────┘
```

## 📦 Module Breakdown

### 1. Data Fetcher Module (`js/data-fetcher.js`)

**Purpose**: Fetch, parse, and manage mutual fund data from AMFI India

#### Key Classes
```javascript
class DataFetcher {
    constructor()
    async fetchAMFIData()
    parseAMFIData(text)
    categorizeScheme(schemeName)
    filterSchemes(data, amc, category)
    async getHistoricalNAV(schemeCode, period)
    getSampleData()
    generateHistoricalData(currentNav, days, annualReturn, volatility)
}
```

#### Data Structure
```javascript
{
    schemes: [
        {
            code: "INF194K01BH4",
            isin: "INF194K01BH4",
            name: "HDFC Flexi Cap Fund - Direct Plan - Growth",
            nav: 872.45,
            date: "19-Oct-2024",
            amc: "HDFC Asset Management Company Limited",
            category: "Flexi Cap Fund"
        },
        // ... more schemes
    ],
    amcs: ["HDFC Asset...", "ICICI Prudential...", ...],
    lastUpdated: Date
}
```

#### Key Features
- **CORS Handling**: Uses proxy service for AMFI data access
- **Data Caching**: 30-minute cache to reduce API calls
- **Auto-categorization**: Smart categorization based on scheme names
- **Fallback Data**: Sample data when API fails

---

### 2. Financial Calculations Module (`js/calculations.js`)

**Purpose**: Implement all financial metric calculations

#### Key Classes
```javascript
class FinancialCalculations {
    constructor()
    calculateAbsoluteReturns(startNav, endNav)
    calculateCAGR(startNav, endNav, years)
    calculateDailyReturns(navData)
    calculateStandardDeviation(returns)
    calculateAnnualizedVolatility(navData)
    calculateSharpeRatio(returns, volatility, riskFreeRate)
    calculateSortinoRatio(navData, riskFreeRate)
    calculateMaxDrawdown(navData)
    calculateRollingReturns(navData, windowDays)
    calculateBeta(fundReturns, benchmarkReturns)
    calculateAlpha(fundReturns, benchmarkReturns, beta, riskFreeRate)
    calculateInformationRatio(fundReturns, benchmarkReturns)
    calculateTreynorRatio(returns, beta, riskFreeRate)
    calculateAllMetrics(navData, period)
}
```

#### Formula Implementations

**CAGR (Compound Annual Growth Rate)**
```javascript
CAGR = (endNav / startNav) ^ (1 / years) - 1
```

**Sharpe Ratio**
```javascript
SharpeRatio = (returns - riskFreeRate) / volatility
```

**Sortino Ratio**
```javascript
SortinoRatio = (returns - riskFreeRate) / downsideDeviation
```

**Maximum Drawdown**
```javascript
MaxDrawdown = max((trough - peak) / peak) × 100
```

**Beta**
```javascript
Beta = Covariance(fundReturns, benchmarkReturns) / Variance(benchmarkReturns)
```

**Alpha**
```javascript
Alpha = fundReturns - [riskFreeRate + beta × (benchmarkReturns - riskFreeRate)]
```

#### Constants
- **Trading Days per Year**: 252
- **Risk-Free Rate**: 6.5% (Indian Government Securities)
- **Benchmark**: Nifty 50 proxy (12% return, 18% volatility)

---

### 3. Visualizations Module (`js/visualizations.js`)

**Purpose**: Create interactive charts using Chart.js

#### Key Classes
```javascript
class Visualizations {
    constructor()
    createNAVChart(canvasId, navDataArray, schemeNames)
    createRiskReturnChart(canvasId, metricsData, schemeNames)
    createRollingReturnsChart(canvasId, rollingReturnsArray, schemeNames)
    createDrawdownChart(canvasId, navDataArray, schemeNames)
    createExpenseRatioChart(canvasId, metricsData, schemeNames)
    createMetricsTable(tableId, metricsDataArray, schemeNames, selectedMetrics, selectedPeriods)
    createQuickStats(containerId, metricsData, schemeName)
}
```

#### Chart Types

**1. NAV Performance Trend (Line Chart)**
- X-axis: Time (Date)
- Y-axis: NAV (₹)
- Multiple series for comparison
- Time-series with zoom/pan

**2. Risk-Return Analysis (Scatter Plot)**
- X-axis: Risk (Volatility %)
- Y-axis: Return (CAGR %)
- Each point represents a fund
- Larger points for better visibility

**3. Drawdown Analysis (Area Chart)**
- X-axis: Time (Date)
- Y-axis: Drawdown (%)
- Filled area showing underwater periods
- Inverted Y-axis (negative values)

**4. Rolling Returns (Line Chart)**
- X-axis: Time (Date)
- Y-axis: Rolling Return (%)
- 1-year rolling window
- Shows consistency

**5. Expense Ratio Comparison (Bar Chart)**
- X-axis: Scheme Names
- Y-axis: Expense Ratio (%)
- Horizontal bars for easy comparison

#### Chart Configuration
```javascript
{
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
        mode: 'index',
        intersect: false
    },
    plugins: {
        legend: { display: true, position: 'top' },
        tooltip: { /* custom callbacks */ }
    },
    scales: {
        x: { type: 'time', /* ... */ },
        y: { /* custom formatting */ }
    }
}
```

---

### 4. Report Generator Module (`js/report-generator.js`)

**Purpose**: Generate AI-powered investment analysis reports

#### Key Classes
```javascript
class ReportGenerator {
    constructor()
    generateReport(schemesData, metricsDataArray, schemeNames)
    
    // Report Sections
    generateExecutiveSummary(schemeNames, metricsArray)
    generatePerformanceAnalysis(schemeNames, metricsArray, allMetricsData)
    generateRiskAssessment(schemeNames, metricsArray)
    generateStrengthsWeaknesses(schemeNames, metricsArray)
    generateComparativeAnalysis(schemeNames, metricsArray)
    generateInvestorSuitability(schemeNames, metricsArray)
    generateKeyObservations(schemeNames, metricsArray)
    generateRecommendations(schemeNames, metricsArray)
    generateDisclaimer()
    
    // Helper Functions
    assessPerformanceQuality(metrics)
    assessRiskLevel(metrics)
    calculateOverallScore(metrics)
    determineInvestorProfile(metrics)
}
```

#### Report Scoring Algorithm
```javascript
Overall Score (100 points):
- Returns Component: 30 points
  * CAGR >= 15%: 30 pts
  * CAGR 10-15%: 22 pts
  * CAGR 5-10%: 15 pts
  * CAGR < 5%: 5 pts

- Risk-Adjusted Returns: 25 points
  * Sharpe >= 1.5: 25 pts
  * Sharpe 1.0-1.5: 18 pts
  * Sharpe 0.5-1.0: 10 pts
  * Sharpe < 0.5: 3 pts

- Risk Level (inverse): 20 points
  * Volatility < 12%: 20 pts
  * Volatility 12-18%: 15 pts
  * Volatility 18-25%: 8 pts
  * Volatility > 25%: 3 pts

- Alpha: 15 points
  * Alpha >= 3%: 15 pts
  * Alpha 1-3%: 10 pts
  * Alpha -1 to 1%: 5 pts
  * Alpha < -1%: 0 pts

- Drawdown (inverse): 10 points
  * Drawdown < 15%: 10 pts
  * Drawdown 15-25%: 7 pts
  * Drawdown 25-35%: 4 pts
  * Drawdown > 35%: 1 pt

Recommendation Thresholds:
- 80+: STRONG BUY
- 65-79: BUY
- 50-64: HOLD/CAUTION
- <50: AVOID/REVIEW
```

#### Investor Suitability Matrix
| Risk Level | Return Level | Profile | Horizon | Risk Tolerance |
|------------|--------------|---------|---------|----------------|
| Low | Any | Conservative | 3-5 years | Low |
| Moderate | >= 10% | Balanced | 5-7 years | Medium |
| High | >= 12% | Aggressive | 7+ years | High |
| Other | Any | Conservative-Moderate | 5+ years | Low-Medium |

---

### 5. Export Module (`js/export.js`)

**Purpose**: Handle PDF, CSV, and image exports

#### Key Functions
```javascript
function downloadChart(chartId)
function exportToCSV()
async function downloadReportPDF()
function exportDataJSON(data)
async function exportAllCharts()
```

#### Export Implementations

**PDF Generation (jsPDF)**
```javascript
- Page Size: A4
- Margins: 15mm
- Font: Helvetica
- Sections: Title, Date, All Report Sections
- Footer: Page numbers + Disclaimer
- Text Wrapping: Auto word-wrap for content width
```

**CSV Export**
```javascript
- Format: Standard CSV with quotes
- Encoding: UTF-8
- Structure: Headers + All metrics rows
- Filename: mutual_fund_analysis_YYYY-MM-DD.csv
```

**Chart Image Export**
```javascript
- Format: PNG
- Quality: High resolution
- Method: Canvas.toDataURL()
- Filename: chartId_YYYY-MM-DD.png
```

---

### 6. Main Controller (`js/main.js`)

**Purpose**: Orchestrate all modules and handle application state

#### Key Classes
```javascript
class MutualFundAnalyzer {
    constructor()
    async init()
    setupEventListeners()
    
    // Data Management
    populateAMCDropdown()
    updateSchemeDropdown()
    
    // Event Handlers
    onAMCChange(amc)
    onCategoryChange(category)
    onSchemeChange(schemeCode)
    onComparisonSchemeChange(index, schemeCode)
    
    // Comparison
    toggleComparison(enabled)
    initializeComparisonSelects()
    removeComparisonScheme(index)
    
    // Analysis
    async performAnalysis()
    displayResults(analysisResults, selectedPeriods, selectedMetrics)
    
    // Utilities
    getSelectedTimePeriods()
    getSelectedMetrics()
    getPeriodDays(period)
    getExpectedReturn(category)
    getExpectedVolatility(category)
    showLoading(show)
    resetForm()
}
```

#### Application State
```javascript
{
    amfiData: {
        schemes: [],
        amcs: [],
        lastUpdated: Date
    },
    selectedSchemes: [schemeObject],
    comparisonSchemes: [schemeObject, null, ...],
    dataFetcher: DataFetcher,
    calculator: FinancialCalculations,
    visualizer: Visualizations,
    reportGenerator: ReportGenerator
}
```

#### Application Flow
```
1. Page Load
   ├─> Initialize modules
   ├─> Fetch AMFI data
   └─> Populate AMC dropdown

2. User Selection
   ├─> AMC/Category change
   ├─> Filter schemes
   └─> Enable/Disable Analyze button

3. Analysis Trigger
   ├─> Validate selections
   ├─> Generate historical data
   ├─> Calculate all metrics
   ├─> Create visualizations
   └─> Generate AI report

4. Results Display
   ├─> Quick stats cards
   ├─> Interactive charts
   ├─> Metrics table
   └─> Comprehensive report

5. Export
   ├─> PDF download
   ├─> CSV export
   └─> Chart images
```

---

## 🔧 Configuration & Constants

### Category Expected Performance
```javascript
const categoryReturns = {
    'Large Cap Fund': 12%,
    'Mid Cap Fund': 15%,
    'Small Cap Fund': 18%,
    'Flexi Cap Fund': 14%,
    'Liquid Fund': 6%,
    // ... etc
};

const categoryVolatilities = {
    'Large Cap Fund': 18%,
    'Mid Cap Fund': 22%,
    'Small Cap Fund': 28%,
    'Flexi Cap Fund': 19%,
    'Liquid Fund': 2%,
    // ... etc
};
```

### Time Period Mapping
```javascript
const periodDays = {
    '1M': 21,
    '3M': 63,
    '6M': 126,
    '1Y': 252,
    '3Y': 756,
    '5Y': 1260
};
```

### Color Palette
```javascript
const colors = [
    '#0066cc', // Primary Blue
    '#00a86b', // Success Green
    '#ff6b35', // Accent Orange
    '#9c27b0', // Purple
    '#ff9800', // Amber
    // ... more colors
];
```

---

## 🧪 Testing Guidelines

### Unit Testing (Manual)
1. **Data Fetching**
   - Test AMFI data fetch success
   - Test fallback to sample data
   - Verify scheme categorization

2. **Calculations**
   - Test CAGR with known values
   - Verify Sharpe ratio calculations
   - Check drawdown identification

3. **Visualizations**
   - Test chart rendering
   - Verify data point accuracy
   - Check responsiveness

4. **Report Generation**
   - Verify all sections present
   - Check recommendation logic
   - Test scoring algorithm

### Integration Testing
1. End-to-end analysis flow
2. Multiple fund comparison
3. Export functionality
4. Error handling

### Browser Testing
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 🚀 Performance Optimization

### Implemented Optimizations
1. **Data Caching**: 30-minute cache for AMFI data
2. **Lazy Chart Rendering**: Charts created only when visible
3. **Debounced Events**: Dropdown changes debounced
4. **Efficient Calculations**: Single-pass algorithms where possible
5. **Canvas Reuse**: Charts destroyed before recreation

### Future Optimizations
- Web Workers for heavy calculations
- Virtual scrolling for large data sets
- Progressive image loading
- Service worker for offline support

---

## 🐛 Debugging

### Console Logging
```javascript
// Data fetching
console.log('Fetching AMFI data...');
console.log('Using cached data');

// Analysis
console.log('Analyzing:', schemeNames);
console.log('Metrics:', metricsData);

// Errors
console.error('Error fetching data:', error);
```

### Browser DevTools
1. **Network Tab**: Monitor AMFI API calls
2. **Console Tab**: View logs and errors
3. **Elements Tab**: Inspect DOM changes
4. **Performance Tab**: Profile rendering

---

## 📚 External Dependencies

### CDN Libraries
```html
<!-- Chart.js -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>

<!-- Chart.js Datalabels -->
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0"></script>

<!-- html2canvas -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>

<!-- jsPDF -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

<!-- Font Awesome -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">

<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

---

## 🔐 Security Considerations

1. **No User Data Storage**: All processing client-side
2. **No Authentication**: Public data only
3. **CORS Proxy**: Required for AMFI access
4. **Input Validation**: All user inputs validated
5. **XSS Prevention**: HTML escaping for user-generated content

---

## 📄 License & Legal

- **Educational Purpose**: Not licensed for commercial use
- **Data Attribution**: AMFI India data source
- **Disclaimers**: Comprehensive investment disclaimers included
- **No Warranties**: Provided "as-is" without guarantees

---

**Last Updated**: October 2024
**Version**: 1.0.0
