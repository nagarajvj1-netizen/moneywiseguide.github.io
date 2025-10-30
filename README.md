# Mutual Fund Performance Analyzer 📊

A professional, interactive web application for comprehensive **category-wise analysis** of Indian mutual fund schemes. This tool automatically compares and ranks the **top 20 schemes** in any selected category, providing data-driven insights, advanced financial metrics, risk assessment, and AI-powered investment recommendations.

## 🌟 Key Features

### ✅ Category-Based Analysis Approach

Instead of selecting individual funds, this tool focuses on **category-wise comparison**:
- Select any fund category (Large Cap, Mid Cap, Flexi Cap, ELSS, etc.)
- System automatically identifies and analyzes **top 20 schemes** in that category
- Schemes are ranked using a comprehensive **100-point scoring algorithm**
- Get comparative insights across all major players in the category

### 📊 Comprehensive Analysis Features

#### 1. **Automatic Top 20 Selection**
- Fetches schemes from selected category
- Ranks based on composite scoring (Returns + Risk-Adjusted Performance + Volatility + Alpha + Drawdown)
- Displays complete ranking from #1 to #20

#### 2. **Category Coverage**
- **Equity Funds**: Large Cap, Mid Cap, Small Cap, Multi Cap, Flexi Cap, Large & Mid Cap
- **Debt Funds**: Liquid, Ultra Short, Short, Medium, Long Duration
- **Hybrid Funds**: Conservative, Balanced, Aggressive
- **Other**: Index Funds, ELSS (Tax Saving), Sectoral/Thematic

#### 3. **11+ Performance Metrics**
- **Returns**: Absolute Returns, CAGR, Rolling Returns
- **Risk**: Standard Deviation (Volatility), Maximum Drawdown, Beta
- **Risk-Adjusted**: Sharpe Ratio, Sortino Ratio, Treynor Ratio, Information Ratio
- **Performance Attribution**: Alpha, Expense Ratio

#### 4. **Interactive Visualizations**
- **NAV Performance Trend**: Top 10 schemes growth comparison
- **Risk-Return Scatter Plot**: All 20 schemes positioned by risk vs. return
- **Drawdown Analysis**: Top 10 schemes downside risk visualization
- **Expense Ratio Comparison**: Cost analysis across top performers
- **Ranked Metrics Table**: Complete performance table with rankings

#### 5. **AI-Powered Category Report**
Specialized report sections:
- **Category Analysis**: Overall category performance summary
- **Top 5 Detailed Analysis**: In-depth review of best performers
- **Performance Distribution**: Excellent/Good/Average/Poor classification
- **Category Risk Profile**: Collective risk characteristics
- **Leaders vs. Laggards**: Top 5 vs. Bottom 5 comparison
- **Investment Strategy**: Category-specific guidance
- **Recommendations**: Ranked investment suggestions

#### 6. **Export Capabilities**
- **PDF Report**: Complete category analysis with rankings
- **CSV Export**: All metrics for Excel analysis
- **Chart Downloads**: Individual chart images (PNG)

## 🚀 Quick Start

### Simple 3-Step Process

1. **Open** `index.html` in your web browser
2. **Select Category** from dropdown (e.g., "Flexi Cap Fund")
3. **Click "Analyze Performance"** - System automatically compares top 20 schemes!

### What You Get

The system will:
- ✅ Identify top 20 schemes in selected category
- ✅ Calculate all performance metrics for each scheme
- ✅ Rank schemes using composite scoring algorithm
- ✅ Generate interactive charts showing comparative performance
- ✅ Create comprehensive AI-powered analysis report
- ✅ Provide investment recommendations based on ranking

## 📁 Project Structure

```
mutual-fund-analyzer/
├── index.html                 # Main application
├── css/
│   └── style.css             # Professional styling
├── js/
│   ├── data-fetcher.js       # AMFI data handling
│   ├── calculations.js       # Financial metrics (11+ metrics)
│   ├── visualizations.js     # Chart.js visualizations
│   ├── report-generator.js   # AI category report engine
│   ├── export.js             # PDF/CSV/PNG export
│   └── main.js               # Application controller
└── README.md                  # This file
```

## 🎯 How It Works

### Selection Process
```
User selects category (e.g., "Large Cap Fund")
         ↓
System fetches all schemes in that category
         ↓
Sorts and selects top 20 by NAV (fund size proxy)
         ↓
Analyzes each scheme across selected time periods
         ↓
Calculates composite score (100-point scale)
         ↓
Ranks from #1 (best) to #20
         ↓
Generates visualizations and detailed report
```

### Ranking Algorithm (100-Point Scale)

**Score Components:**
- **Returns (30 points)**: CAGR performance
  - 15%+ CAGR → 30 points
  - 10-15% CAGR → 22 points
  - 5-10% CAGR → 15 points
  - <5% CAGR → 5 points

- **Risk-Adjusted Returns (25 points)**: Sharpe Ratio
  - ≥1.5 → 25 points
  - 1.0-1.5 → 18 points
  - 0.5-1.0 → 10 points
  - <0.5 → 3 points

- **Risk Level (20 points)**: Volatility (inverse)
  - <12% → 20 points
  - 12-18% → 15 points
  - 18-25% → 8 points
  - >25% → 3 points

- **Alpha (15 points)**: Benchmark outperformance
  - ≥3% → 15 points
  - 1-3% → 10 points
  - -1 to 1% → 5 points
  - <-1% → 0 points

- **Drawdown (10 points)**: Maximum decline (inverse)
  - <15% → 10 points
  - 15-25% → 7 points
  - 25-35% → 4 points
  - >35% → 1 point

**Performance Classifications:**
- 80-100: Excellent ⭐⭐⭐⭐⭐
- 65-79: Good ⭐⭐⭐⭐
- 50-64: Average ⭐⭐⭐
- <50: Below Average ⭐⭐

## 🌐 Real-Time Data Integration

### MFApi.in REST API
The application now uses **real mutual fund data** from MFApi.in:

- **40,000+ schemes** from AMFI India
- **Historical NAV data** for accurate calculations
- **Daily updates** with latest NAV values
- **Free API** with no authentication required
- **CORS-enabled** for browser access

### How It Works
1. **Initialization**: Fetches all schemes from API (~3-4 seconds)
2. **Category Selection**: Gets latest NAV for top 50 schemes (~5-10 seconds)
3. **Analysis**: Fetches historical data for top 20 schemes (~20-40 seconds)
4. **Results**: Real metrics based on actual market data

**Note**: Analysis takes longer than before because we're fetching real data from the internet, but results are far more accurate and reliable!

See **MFAPI_INTEGRATION.md** for complete API documentation.

---

## 📊 Understanding the Results

### Quick Stats Dashboard
Shows key metrics for the **#1 ranked scheme**:
- Current NAV
- CAGR (Returns)
- Volatility (Risk)
- Sharpe Ratio (Risk-adjusted performance)
- Maximum Drawdown
- Expense Ratio

### Ranked Metrics Table
Complete performance table showing:
- **Rank Column**: #1 to #20 (top 3 color-coded: 🥇🥈🥉)
- **Scheme Name**: Full fund name
- **All Selected Metrics**: CAGR, Sharpe, Volatility, Alpha, etc.
- **Overall Score**: Composite score out of 100

### Interactive Charts
- **Top 10 for clarity**: NAV trends and drawdown charts show only top 10 to avoid clutter
- **All 20 for comparison**: Risk-return scatter plot shows all schemes

### AI Category Report
Comprehensive analysis including:
1. **Category Overview**: Average performance statistics
2. **Top 5 Deep Dive**: Detailed analysis of best performers
3. **Performance Distribution**: How many schemes are excellent/good/average
4. **Risk Profile**: Category-wide risk characteristics
5. **Leaders vs. Laggards**: Top 5 vs. Bottom 5 comparison
6. **Investment Strategy**: Category-specific recommendations
7. **Top Picks**: Ranked list of recommended schemes

## 🎯 Use Cases

### For Individual Investors
- Research which schemes are best in a category before investing
- Compare all major players in one analysis
- Make data-driven decisions based on comprehensive metrics
- Get ranked recommendations from top performers

### For Financial Advisors
- Quick category analysis for client presentations
- Compare schemes objectively using standardized metrics
- Generate professional reports with rankings
- Support investment recommendations with data

### For Portfolio Managers
- Evaluate fund manager performance within categories
- Identify consistent performers across metrics
- Assess category-wide risk-return characteristics
- Screen funds for portfolio inclusion

### For Students & Researchers
- Learn mutual fund analysis methodologies
- Understand category-wise performance patterns
- Study ranking algorithms and scoring systems
- Compare fund performance scientifically

## 📈 Financial Metrics Explained

### Returns Metrics
- **Absolute Returns**: Total % gain/loss
- **CAGR**: Annualized growth rate (compounded)

### Risk Metrics
- **Volatility**: Standard deviation (higher = riskier)
- **Max Drawdown**: Worst peak-to-trough decline
- **Beta**: Market sensitivity (1.0 = moves with market)

### Risk-Adjusted Metrics
- **Sharpe Ratio**: Returns per unit of total risk (>1 is good)
- **Sortino Ratio**: Returns per unit of downside risk
- **Treynor Ratio**: Returns per unit of market risk

### Performance Attribution
- **Alpha**: Excess returns beyond risk-adjusted expectations
- **Information Ratio**: Consistency of outperformance
- **Expense Ratio**: Annual fund cost %

## 🔧 Technical Stack

- **HTML5, CSS3, Vanilla JavaScript** (no frameworks)
- **Chart.js 4.4.0** - Interactive visualizations
- **jsPDF 2.5.1** - PDF report generation
- **AMFI India API** - Live NAV data source
- **Industry-standard formulas** - All calculations

## ⚠️ Important Disclaimers

### Investment Risk Warning
- ✅ **For educational and informational purposes only**
- ✅ **NOT financial advice or investment recommendation**
- ✅ **Past performance ≠ future results**
- ✅ **Mutual funds are subject to market risks**
- ✅ **Consult qualified financial advisor before investing**
- ✅ **Read all scheme documents carefully**

### Data Source - Real API Integration
- ✅ **Real historical NAV data** from MFApi.in (free REST API)
- ✅ **40,000+ actual mutual fund schemes** from AMFI India
- ✅ **Complete historical data** for accurate analysis
- ✅ **Daily NAV updates** as per official AMFI data
- ⚠️ **Requires internet connection** for data fetching
- ⚠️ **Analysis takes 20-40 seconds** (fetching real historical data)
- 📚 **See MFAPI_INTEGRATION.md** for detailed API documentation

## 🎨 Key Benefits

### Comprehensive Coverage
- Analyzes 20 schemes automatically (not just 2-3)
- Compares across all major metrics
- Ranks objectively using composite scoring

### Time-Saving
- No need to manually select each scheme
- Category selection triggers automatic analysis
- Complete report generated in seconds

### Unbiased Analysis
- Mathematical scoring eliminates subjective bias
- All schemes evaluated on same parameters
- Transparent ranking methodology

### Actionable Insights
- Clear recommendations based on ranking
- Top 5 get detailed analysis
- Category-specific investment strategies

## 📚 Documentation

### Core Documentation
- **README.md** (this file) - Complete project overview
- **PROJECT_SNAPSHOT.md** - Complete project state capture (NEW!)
- **USAGE_GUIDE.md** - Detailed user instructions
- **TECHNICAL_DOCS.md** - Developer documentation
- **QUICKSTART.md** - Quick 3-step guide

### API Integration Documentation
- **MFAPI_INTEGRATION.md** - Complete API documentation
- **API_INTEGRATION_SUMMARY.md** - Quick API overview

### Additional Resources
- **DEPLOYMENT_GUIDE.md** - Complete deployment guide
- **FEATURES.md** - Detailed feature documentation
- **CHANGELOG.md** - Version history
- **TEST_INSTRUCTIONS.md** - Testing guide
- **FIX_SUMMARY.md** - Bug fix documentation
- **PROJECT_STATUS.md** - Previous status document

### Navigation
- **DOCUMENTATION_INDEX.md** - Complete documentation navigation

## 🔮 Future Enhancements

### Potential Features
- [ ] Real-time historical NAV data integration
- [ ] Custom weighting for ranking algorithm
- [ ] Portfolio construction optimizer
- [ ] SIP calculator with projections
- [ ] Fund manager comparison
- [ ] Category-to-category comparison
- [ ] Email report delivery
- [ ] Save/Load analysis sessions

## 📊 Functional Entry Points

### Main Workflow
1. **Index Page**: `index.html`
2. **Category Selection** → **Analyze** → **View Rankings** → **Export Report**

### Key Features
- **Category Analysis**: Select any category → Automatic top 20 comparison
- **Ranked Metrics Table**: Complete performance table with #1-#20 rankings
- **Top 10 Charts**: Visual comparison of best performers
- **AI Category Report**: Specialized analysis for selected category
- **Export Options**: PDF, CSV, PNG downloads

### Data Source
- **AMFI India**: `https://portal.amfiindia.com/DownloadNAVHistoryReport_Po.aspx`
- **Sample Data**: Automatic fallback if API unavailable

## 🏆 Why This Approach?

### Traditional Method (Individual Selection)
- User manually selects 2-5 funds
- Limited comparison scope
- Potential selection bias
- Time-consuming research

### Our Method (Category-Wide Analysis)
- ✅ System automatically gets top 20 schemes
- ✅ Comprehensive category coverage
- ✅ Objective ranking algorithm
- ✅ Complete comparative analysis in one click
- ✅ No cherry-picking or bias

## 🎓 Educational Value

Learn how to:
- Evaluate mutual fund categories systematically
- Compare schemes using multiple metrics
- Understand ranking methodologies
- Identify top performers objectively
- Make data-driven investment decisions

## 🙏 Acknowledgments

- **AMFI India**: Public NAV data access
- **Chart.js Community**: Excellent visualization library
- **Indian Mutual Fund Industry**: Transparency and data availability

---

## 📞 Support

For issues:
- Check browser console (F12) for error messages
- Ensure JavaScript is enabled
- Verify internet connection for data fetching
- Try sample data if AMFI API unavailable

---

**Built for Smart Investors | Category-Wise Analysis | Top 20 Rankings | AI-Powered Insights**

*Last Updated: 2024 | Version: 2.0.0 (Category Comparison Edition)*
