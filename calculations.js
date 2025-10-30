// Financial Calculations Module

class FinancialCalculations {
    constructor() {
        this.riskFreeRate = 6.5; // Annual risk-free rate (%)
    }

    // Calculate absolute returns
    calculateAbsoluteReturns(startNav, endNav) {
        return ((endNav - startNav) / startNav) * 100;
    }

    // Calculate CAGR (Compound Annual Growth Rate)
    calculateCAGR(startNav, endNav, years) {
        if (years === 0) return 0;
        return (Math.pow(endNav / startNav, 1 / years) - 1) * 100;
    }

    // Calculate annualized returns
    calculateAnnualizedReturns(returns, days) {
        const years = days / 365;
        return ((Math.pow(1 + returns / 100, 1 / years) - 1) * 100);
    }

    // Calculate daily returns from NAV data
    calculateDailyReturns(navData) {
        const returns = [];
        for (let i = 1; i < navData.length; i++) {
            const dailyReturn = (navData[i].nav - navData[i - 1].nav) / navData[i - 1].nav;
            returns.push(dailyReturn);
        }
        return returns;
    }

    // Calculate standard deviation (volatility)
    calculateStandardDeviation(returns) {
        if (returns.length === 0) return 0;
        
        const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
        const squaredDiffs = returns.map(r => Math.pow(r - mean, 2));
        const variance = squaredDiffs.reduce((sum, sd) => sum + sd, 0) / returns.length;
        
        return Math.sqrt(variance);
    }

    // Calculate annualized volatility
    calculateAnnualizedVolatility(navData) {
        const dailyReturns = this.calculateDailyReturns(navData);
        const dailyVolatility = this.calculateStandardDeviation(dailyReturns);
        return dailyVolatility * Math.sqrt(252) * 100; // Annualized in percentage
    }

    // Calculate Sharpe Ratio
    calculateSharpeRatio(returns, volatility, riskFreeRate = this.riskFreeRate) {
        if (volatility === 0) return 0;
        return (returns - riskFreeRate) / volatility;
    }

    // Calculate Sortino Ratio (considers only downside volatility)
    calculateSortinoRatio(navData, riskFreeRate = this.riskFreeRate) {
        const dailyReturns = this.calculateDailyReturns(navData);
        const meanReturn = dailyReturns.reduce((sum, r) => sum + r, 0) / dailyReturns.length;
        const annualizedReturn = meanReturn * 252 * 100;
        
        // Calculate downside deviation
        const negativeReturns = dailyReturns.filter(r => r < 0);
        if (negativeReturns.length === 0) return annualizedReturn / 1; // Very high if no negative returns
        
        const downsideDeviation = this.calculateStandardDeviation(negativeReturns);
        const annualizedDownsideVol = downsideDeviation * Math.sqrt(252) * 100;
        
        if (annualizedDownsideVol === 0) return 0;
        return (annualizedReturn - riskFreeRate) / annualizedDownsideVol;
    }

    // Calculate Maximum Drawdown
    calculateMaxDrawdown(navData) {
        let maxDrawdown = 0;
        let peak = navData[0].nav;
        let peakDate = navData[0].date;
        let troughDate = navData[0].date;
        let maxPeak = peak;
        let maxTrough = peak;
        
        for (let i = 1; i < navData.length; i++) {
            const currentNav = navData[i].nav;
            
            if (currentNav > peak) {
                peak = currentNav;
                peakDate = navData[i].date;
            }
            
            const drawdown = ((currentNav - peak) / peak) * 100;
            
            if (drawdown < maxDrawdown) {
                maxDrawdown = drawdown;
                maxPeak = peak;
                maxTrough = currentNav;
                troughDate = navData[i].date;
            }
        }
        
        return {
            maxDrawdown: Math.abs(maxDrawdown),
            peak: maxPeak,
            trough: maxTrough,
            peakDate,
            troughDate
        };
    }

    // Calculate Rolling Returns
    calculateRollingReturns(navData, windowDays = 365) {
        const rollingReturns = [];
        
        for (let i = windowDays; i < navData.length; i++) {
            const startNav = navData[i - windowDays].nav;
            const endNav = navData[i].nav;
            const returns = this.calculateAbsoluteReturns(startNav, endNav);
            
            rollingReturns.push({
                date: navData[i].date,
                returns: returns
            });
        }
        
        return rollingReturns;
    }

    // Calculate Beta (relative to benchmark)
    calculateBeta(fundReturns, benchmarkReturns) {
        if (fundReturns.length !== benchmarkReturns.length) {
            console.error('Fund and benchmark returns must have the same length');
            return 1.0;
        }
        
        const n = fundReturns.length;
        const fundMean = fundReturns.reduce((sum, r) => sum + r, 0) / n;
        const benchmarkMean = benchmarkReturns.reduce((sum, r) => sum + r, 0) / n;
        
        let covariance = 0;
        let benchmarkVariance = 0;
        
        for (let i = 0; i < n; i++) {
            const fundDiff = fundReturns[i] - fundMean;
            const benchmarkDiff = benchmarkReturns[i] - benchmarkMean;
            covariance += fundDiff * benchmarkDiff;
            benchmarkVariance += benchmarkDiff * benchmarkDiff;
        }
        
        covariance /= n;
        benchmarkVariance /= n;
        
        if (benchmarkVariance === 0) return 1.0;
        return covariance / benchmarkVariance;
    }

    // Calculate Alpha
    calculateAlpha(fundReturns, benchmarkReturns, beta, riskFreeRate = this.riskFreeRate) {
        // Alpha = Fund Returns - [Risk Free Rate + Beta * (Benchmark Returns - Risk Free Rate)]
        const benchmarkExcessReturn = benchmarkReturns - riskFreeRate;
        const expectedReturn = riskFreeRate + beta * benchmarkExcessReturn;
        return fundReturns - expectedReturn;
    }

    // Calculate Information Ratio
    calculateInformationRatio(fundReturns, benchmarkReturns) {
        const trackingError = [];
        
        for (let i = 0; i < fundReturns.length; i++) {
            trackingError.push(fundReturns[i] - benchmarkReturns[i]);
        }
        
        const meanTrackingError = trackingError.reduce((sum, te) => sum + te, 0) / trackingError.length;
        const trackingErrorVolatility = this.calculateStandardDeviation(trackingError);
        
        if (trackingErrorVolatility === 0) return 0;
        return (meanTrackingError * 252 * 100) / (trackingErrorVolatility * Math.sqrt(252) * 100);
    }

    // Calculate Treynor Ratio
    calculateTreynorRatio(returns, beta, riskFreeRate = this.riskFreeRate) {
        if (beta === 0) return 0;
        return (returns - riskFreeRate) / beta;
    }

    // Generate benchmark returns (for demonstration - using Nifty 50 proxy)
    generateBenchmarkReturns(navData, benchmarkReturn = 12, benchmarkVolatility = 18) {
        const days = navData.length;
        const tradingDaysPerYear = 252;
        const dailyReturn = benchmarkReturn / 100 / tradingDaysPerYear;
        const dailyVolatility = (benchmarkVolatility / 100) / Math.sqrt(tradingDaysPerYear);
        
        const returns = [];
        
        for (let i = 0; i < days - 1; i++) {
            // Generate random return using normal distribution
            const u1 = Math.random();
            const u2 = Math.random();
            const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
            const randomReturn = dailyReturn + dailyVolatility * z;
            returns.push(randomReturn);
        }
        
        return returns;
    }

    // Calculate all metrics for a fund
    calculateAllMetrics(navData, period) {
        if (!navData || navData.length < 2) {
            return null;
        }

        const startNav = navData[0].nav;
        const endNav = navData[navData.length - 1].nav;
        const days = navData.length;
        const years = days / 252; // Trading days in a year

        // Calculate returns
        const absoluteReturns = this.calculateAbsoluteReturns(startNav, endNav);
        const cagr = this.calculateCAGR(startNav, endNav, years);
        
        // Calculate volatility
        const volatility = this.calculateAnnualizedVolatility(navData);
        
        // Calculate risk-adjusted metrics
        const sharpeRatio = this.calculateSharpeRatio(cagr, volatility);
        const sortinoRatio = this.calculateSortinoRatio(navData);
        
        // Calculate drawdown
        const drawdownData = this.calculateMaxDrawdown(navData);
        
        // Calculate rolling returns
        const rollingReturns = days > 252 ? this.calculateRollingReturns(navData, 252) : [];
        
        // Generate benchmark data and calculate Beta, Alpha
        const fundReturns = this.calculateDailyReturns(navData);
        const benchmarkReturns = this.generateBenchmarkReturns(navData);
        const beta = this.calculateBeta(fundReturns, benchmarkReturns);
        
        // Calculate benchmark annualized return
        const benchmarkAnnualReturn = 12; // Assumed Nifty 50 return
        const alpha = this.calculateAlpha(cagr, benchmarkAnnualReturn, beta);
        
        // Calculate Information Ratio
        const informationRatio = this.calculateInformationRatio(fundReturns, benchmarkReturns);
        
        // Calculate Treynor Ratio
        const treynorRatio = this.calculateTreynorRatio(cagr, beta);
        
        // Estimated expense ratio (typically 0.5% - 2.5% for direct plans)
        const expenseRatio = 0.8 + Math.random() * 1.0; // Random between 0.8% - 1.8%

        return {
            period,
            startDate: navData[0].date,
            endDate: navData[navData.length - 1].date,
            startNav,
            endNav,
            absoluteReturns,
            cagr,
            volatility,
            sharpeRatio,
            sortinoRatio,
            maxDrawdown: drawdownData.maxDrawdown,
            drawdownPeak: drawdownData.peak,
            drawdownTrough: drawdownData.trough,
            drawdownPeakDate: drawdownData.peakDate,
            drawdownTroughDate: drawdownData.troughDate,
            beta,
            alpha,
            informationRatio,
            treynorRatio,
            expenseRatio,
            rollingReturns
        };
    }

    // Calculate metrics for multiple time periods
    calculateMultiplePeriods(getHistoricalData, selectedPeriods) {
        const results = {};
        
        for (const period of selectedPeriods) {
            const navData = getHistoricalData(period);
            const metrics = this.calculateAllMetrics(navData, period);
            if (metrics) {
                results[period] = metrics;
            }
        }
        
        return results;
    }

    // Format number with specified decimal places
    formatNumber(number, decimals = 2) {
        if (typeof number !== 'number' || isNaN(number)) return 'N/A';
        return number.toFixed(decimals);
    }

    // Format percentage
    formatPercentage(number, decimals = 2) {
        if (typeof number !== 'number' || isNaN(number)) return 'N/A';
        return number.toFixed(decimals) + '%';
    }

    // Format currency (Indian Rupee)
    formatCurrency(number, decimals = 2) {
        if (typeof number !== 'number' || isNaN(number)) return 'N/A';
        return '₹' + number.toFixed(decimals);
    }
}

// Export for use in other modules
window.FinancialCalculations = FinancialCalculations;
