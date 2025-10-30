// AI-Powered Report Generator

class ReportGenerator {
    constructor() {
        this.calc = new FinancialCalculations();
    }

    // Generate comprehensive investment analysis report
    generateReport(schemesData, metricsDataArray, schemeNames) {
        const reportContainer = document.getElementById('report-content');
        reportContainer.innerHTML = '';

        // Use primary metrics (1Y or first available)
        const primaryMetrics = metricsDataArray.map(metrics => 
            metrics['1Y'] || Object.values(metrics)[0]
        );

        // Generate report sections
        const sections = [
            this.generateExecutiveSummary(schemeNames, primaryMetrics),
            this.generatePerformanceAnalysis(schemeNames, primaryMetrics, metricsDataArray),
            this.generateRiskAssessment(schemeNames, primaryMetrics),
            this.generateStrengthsWeaknesses(schemeNames, primaryMetrics),
            this.generateComparativeAnalysis(schemeNames, primaryMetrics),
            this.generateInvestorSuitability(schemeNames, primaryMetrics),
            this.generateKeyObservations(schemeNames, primaryMetrics),
            this.generateRecommendations(schemeNames, primaryMetrics),
            this.generateDisclaimer()
        ];

        sections.forEach(section => {
            if (section) {
                reportContainer.appendChild(section);
            }
        });
    }

    // Executive Summary
    generateExecutiveSummary(schemeNames, metricsArray) {
        const section = this.createSection('Executive Summary', 'fa-file-alt');
        
        let summary = '<p>';
        
        if (schemeNames.length === 1) {
            const metrics = metricsArray[0];
            const performanceQuality = this.assessPerformanceQuality(metrics);
            const riskLevel = this.assessRiskLevel(metrics);
            
            summary += `<strong>${schemeNames[0]}</strong> has delivered a `;
            summary += `<span class="highlight">${performanceQuality}</span> performance with a `;
            summary += `CAGR of <strong>${this.calc.formatPercentage(metrics.cagr)}</strong> `;
            summary += `over the analyzed period. The fund exhibits <span class="highlight">${riskLevel}</span> `;
            summary += `risk characteristics with an annualized volatility of `;
            summary += `<strong>${this.calc.formatPercentage(metrics.volatility)}</strong>. `;
            summary += `The risk-adjusted return, measured by Sharpe Ratio of `;
            summary += `<strong>${this.calc.formatNumber(metrics.sharpeRatio)}</strong>, `;
            summary += `indicates ${this.interpretSharpeRatio(metrics.sharpeRatio)}.`;
        } else {
            summary += `This analysis compares <strong>${schemeNames.length} mutual fund schemes</strong> `;
            summary += `to help identify the optimal investment choice. `;
            
            const topPerformer = this.findTopPerformer(schemeNames, metricsArray, 'cagr');
            const leastRisky = this.findTopPerformer(schemeNames, metricsArray, 'volatility', true);
            const bestRiskAdjusted = this.findTopPerformer(schemeNames, metricsArray, 'sharpeRatio');
            
            summary += `Among the compared schemes, <strong>${topPerformer.name}</strong> `;
            summary += `delivers the highest returns with a CAGR of `;
            summary += `<strong>${this.calc.formatPercentage(topPerformer.value)}</strong>, `;
            summary += `while <strong>${leastRisky.name}</strong> exhibits the lowest volatility at `;
            summary += `<strong>${this.calc.formatPercentage(leastRisky.value)}</strong>. `;
            summary += `From a risk-adjusted perspective, <strong>${bestRiskAdjusted.name}</strong> `;
            summary += `stands out with a Sharpe Ratio of <strong>${this.calc.formatNumber(bestRiskAdjusted.value)}</strong>.`;
        }
        
        summary += '</p>';
        section.innerHTML += summary;
        
        return section;
    }

    // Performance Analysis
    generatePerformanceAnalysis(schemeNames, metricsArray, allMetricsData) {
        const section = this.createSection('Performance Analysis', 'fa-chart-line');
        
        let analysis = '';
        
        schemeNames.forEach((name, index) => {
            const metrics = metricsArray[index];
            const allMetrics = allMetricsData[index];
            
            analysis += `<h5><i class="fas fa-chevron-right"></i> ${name}</h5>`;
            analysis += '<ul>';
            
            // Returns analysis
            analysis += `<li><strong>Returns Performance:</strong> `;
            if (metrics.cagr >= 15) {
                analysis += `Exceptional returns of ${this.calc.formatPercentage(metrics.cagr)} CAGR, `;
                analysis += `significantly outperforming typical market benchmarks. `;
            } else if (metrics.cagr >= 10) {
                analysis += `Strong returns of ${this.calc.formatPercentage(metrics.cagr)} CAGR, `;
                analysis += `demonstrating solid performance above average market returns. `;
            } else if (metrics.cagr >= 5) {
                analysis += `Moderate returns of ${this.calc.formatPercentage(metrics.cagr)} CAGR, `;
                analysis += `providing steady growth albeit below aggressive growth targets. `;
            } else {
                analysis += `Below-average returns of ${this.calc.formatPercentage(metrics.cagr)} CAGR, `;
                analysis += `suggesting the need for careful consideration. `;
            }
            analysis += `</li>`;
            
            // Consistency analysis
            if (allMetrics['3M'] && allMetrics['1Y'] && allMetrics['3Y']) {
                const shortTerm = allMetrics['3M'].cagr;
                const mediumTerm = allMetrics['1Y'].cagr;
                const longTerm = allMetrics['3Y'].cagr;
                
                analysis += `<li><strong>Return Consistency:</strong> `;
                
                if (Math.abs(longTerm - mediumTerm) < 3 && Math.abs(mediumTerm - shortTerm) < 5) {
                    analysis += `Highly consistent performance across time periods (3M: ${this.calc.formatPercentage(shortTerm)}, `;
                    analysis += `1Y: ${this.calc.formatPercentage(mediumTerm)}, 3Y: ${this.calc.formatPercentage(longTerm)}), `;
                    analysis += `indicating stable fund management and strategy. `;
                } else {
                    analysis += `Variable performance across periods (3M: ${this.calc.formatPercentage(shortTerm)}, `;
                    analysis += `1Y: ${this.calc.formatPercentage(mediumTerm)}, 3Y: ${this.calc.formatPercentage(longTerm)}), `;
                    analysis += `reflecting changing market conditions or strategy adjustments. `;
                }
                analysis += `</li>`;
            }
            
            // Alpha analysis
            analysis += `<li><strong>Alpha Generation:</strong> `;
            if (metrics.alpha > 3) {
                analysis += `Outstanding alpha of ${this.calc.formatPercentage(metrics.alpha)}, `;
                analysis += `demonstrating superior stock selection and active management capabilities. `;
            } else if (metrics.alpha > 0) {
                analysis += `Positive alpha of ${this.calc.formatPercentage(metrics.alpha)}, `;
                analysis += `indicating value addition over the benchmark. `;
            } else {
                analysis += `Negative alpha of ${this.calc.formatPercentage(metrics.alpha)}, `;
                analysis += `suggesting underperformance relative to expected returns for the risk taken. `;
            }
            analysis += `</li>`;
            
            analysis += '</ul>';
        });
        
        section.innerHTML += analysis;
        return section;
    }

    // Risk Assessment
    generateRiskAssessment(schemeNames, metricsArray) {
        const section = this.createSection('Risk Assessment', 'fa-exclamation-triangle');
        
        let riskAnalysis = '';
        
        schemeNames.forEach((name, index) => {
            const metrics = metricsArray[index];
            
            riskAnalysis += `<h5><i class="fas fa-chevron-right"></i> ${name}</h5>`;
            riskAnalysis += '<ul>';
            
            // Volatility analysis
            riskAnalysis += `<li><strong>Volatility Level:</strong> `;
            const riskLevel = this.assessRiskLevel(metrics);
            riskAnalysis += `The fund exhibits <span class="highlight">${riskLevel}</span> risk with `;
            riskAnalysis += `${this.calc.formatPercentage(metrics.volatility)} annualized volatility. `;
            
            if (metrics.volatility < 10) {
                riskAnalysis += `This low volatility suggests stable NAV movements and suitability for conservative investors. `;
            } else if (metrics.volatility < 18) {
                riskAnalysis += `This moderate volatility is typical for well-managed equity funds and suitable for balanced investors. `;
            } else {
                riskAnalysis += `This high volatility indicates significant NAV fluctuations and requires higher risk tolerance. `;
            }
            riskAnalysis += `</li>`;
            
            // Maximum drawdown analysis
            riskAnalysis += `<li><strong>Downside Risk:</strong> `;
            riskAnalysis += `The maximum drawdown of ${this.calc.formatPercentage(metrics.maxDrawdown)} `;
            
            if (metrics.maxDrawdown < 10) {
                riskAnalysis += `is remarkably low, demonstrating excellent downside protection and capital preservation. `;
            } else if (metrics.maxDrawdown < 25) {
                riskAnalysis += `is moderate and within acceptable limits for equity investments, though investors should be prepared for temporary declines. `;
            } else {
                riskAnalysis += `is significant and requires strong conviction and long-term investment horizon to weather market downturns. `;
            }
            riskAnalysis += `Peak occurred on ${this.formatDate(metrics.drawdownPeakDate)} `;
            riskAnalysis += `and trough on ${this.formatDate(metrics.drawdownTroughDate)}. `;
            riskAnalysis += `</li>`;
            
            // Beta analysis
            riskAnalysis += `<li><strong>Market Sensitivity:</strong> `;
            riskAnalysis += `With a beta of ${this.calc.formatNumber(metrics.beta)}, `;
            
            if (metrics.beta < 0.8) {
                riskAnalysis += `the fund shows lower sensitivity to market movements, providing defensive characteristics. `;
            } else if (metrics.beta <= 1.2) {
                riskAnalysis += `the fund moves roughly in line with the market, offering balanced exposure. `;
            } else {
                riskAnalysis += `the fund is more volatile than the market, amplifying both gains and losses. `;
            }
            riskAnalysis += `</li>`;
            
            // Sortino Ratio
            riskAnalysis += `<li><strong>Downside Risk-Adjusted Returns:</strong> `;
            riskAnalysis += `Sortino Ratio of ${this.calc.formatNumber(metrics.sortinoRatio)} `;
            
            if (metrics.sortinoRatio > 2) {
                riskAnalysis += `indicates excellent returns relative to downside risk. `;
            } else if (metrics.sortinoRatio > 1) {
                riskAnalysis += `suggests good compensation for downside risk taken. `;
            } else {
                riskAnalysis += `implies limited compensation for downside volatility. `;
            }
            riskAnalysis += `</li>`;
            
            riskAnalysis += '</ul>';
        });
        
        section.innerHTML += riskAnalysis;
        return section;
    }

    // Strengths and Weaknesses
    generateStrengthsWeaknesses(schemeNames, metricsArray) {
        const section = this.createSection('Strengths & Weaknesses Analysis', 'fa-balance-scale');
        
        let analysis = '';
        
        schemeNames.forEach((name, index) => {
            const metrics = metricsArray[index];
            
            analysis += `<h5><i class="fas fa-chevron-right"></i> ${name}</h5>`;
            
            // Strengths
            const strengths = this.identifyStrengths(metrics);
            analysis += '<p><strong style="color: #28a745;"><i class="fas fa-check-circle"></i> Key Strengths:</strong></p>';
            analysis += '<ul>';
            strengths.forEach(strength => {
                analysis += `<li>${strength}</li>`;
            });
            analysis += '</ul>';
            
            // Weaknesses
            const weaknesses = this.identifyWeaknesses(metrics);
            analysis += '<p><strong style="color: #dc3545;"><i class="fas fa-times-circle"></i> Areas of Concern:</strong></p>';
            analysis += '<ul>';
            if (weaknesses.length > 0) {
                weaknesses.forEach(weakness => {
                    analysis += `<li>${weakness}</li>`;
                });
            } else {
                analysis += '<li>No significant concerns identified based on available metrics.</li>';
            }
            analysis += '</ul>';
        });
        
        section.innerHTML += analysis;
        return section;
    }

    // Comparative Analysis
    generateComparativeAnalysis(schemeNames, metricsArray) {
        if (schemeNames.length < 2) return null;
        
        const section = this.createSection('Comparative Analysis', 'fa-project-diagram');
        
        let comparison = '<p>Detailed comparison across key performance metrics:</p>';
        
        // Returns comparison
        comparison += '<h5>Returns Comparison</h5>';
        const sortedByReturns = this.sortSchemesByMetric(schemeNames, metricsArray, 'cagr');
        comparison += '<ol>';
        sortedByReturns.forEach((item, idx) => {
            const badge = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '';
            comparison += `<li>${badge} <strong>${item.name}</strong>: ${this.calc.formatPercentage(item.value)} CAGR</li>`;
        });
        comparison += '</ol>';
        
        // Risk comparison
        comparison += '<h5>Risk Comparison (Lower is Better)</h5>';
        const sortedByRisk = this.sortSchemesByMetric(schemeNames, metricsArray, 'volatility', true);
        comparison += '<ol>';
        sortedByRisk.forEach((item, idx) => {
            const badge = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '';
            comparison += `<li>${badge} <strong>${item.name}</strong>: ${this.calc.formatPercentage(item.value)} Volatility</li>`;
        });
        comparison += '</ol>';
        
        // Risk-adjusted returns
        comparison += '<h5>Risk-Adjusted Returns (Sharpe Ratio)</h5>';
        const sortedBySharpe = this.sortSchemesByMetric(schemeNames, metricsArray, 'sharpeRatio');
        comparison += '<ol>';
        sortedBySharpe.forEach((item, idx) => {
            const badge = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '';
            comparison += `<li>${badge} <strong>${item.name}</strong>: ${this.calc.formatNumber(item.value)} Sharpe Ratio</li>`;
        });
        comparison += '</ol>';
        
        section.innerHTML += comparison;
        return section;
    }

    // Investor Suitability
    generateInvestorSuitability(schemeNames, metricsArray) {
        const section = this.createSection('Investor Suitability Profile', 'fa-user-check');
        
        let suitability = '';
        
        schemeNames.forEach((name, index) => {
            const metrics = metricsArray[index];
            const profile = this.determineInvestorProfile(metrics);
            
            suitability += `<h5><i class="fas fa-chevron-right"></i> ${name}</h5>`;
            suitability += '<p>';
            suitability += `<strong>Best Suited For:</strong> <span class="highlight">${profile.type}</span><br>`;
            suitability += `<strong>Recommended Investment Horizon:</strong> ${profile.horizon}<br>`;
            suitability += `<strong>Risk Tolerance Required:</strong> ${profile.riskTolerance}<br><br>`;
            suitability += `<strong>Profile Description:</strong> ${profile.description}`;
            suitability += '</p>';
        });
        
        section.innerHTML += suitability;
        return section;
    }

    // Key Observations
    generateKeyObservations(schemeNames, metricsArray) {
        const section = this.createSection('Key Observations & Insights', 'fa-lightbulb');
        
        let observations = '<ul>';
        
        // Market context
        observations += '<li><strong>Market Context:</strong> ';
        observations += 'The analysis period captures various market cycles including bull and bear phases, ';
        observations += 'providing comprehensive insight into the fund\'s performance across different market conditions. ';
        observations += '</li>';
        
        if (schemeNames.length === 1) {
            const metrics = metricsArray[0];
            
            // Specific observations for single fund
            if (metrics.sharpeRatio > 1.5 && metrics.alpha > 2) {
                observations += '<li><strong>Superior Management:</strong> ';
                observations += 'The combination of high Sharpe Ratio and positive alpha indicates exceptional fund management ';
                observations += 'and successful stock selection strategies. ';
                observations += '</li>';
            }
            
            if (metrics.informationRatio > 0.5) {
                observations += '<li><strong>Consistent Outperformance:</strong> ';
                observations += `An Information Ratio of ${this.calc.formatNumber(metrics.informationRatio)} `;
                observations += 'suggests the fund manager has consistently delivered excess returns over the benchmark. ';
                observations += '</li>';
            }
            
            if (metrics.expenseRatio < 1.0) {
                observations += '<li><strong>Cost Efficiency:</strong> ';
                observations += `The expense ratio of ${this.calc.formatPercentage(metrics.expenseRatio)} is competitive, `;
                observations += 'allowing more returns to accrue to investors rather than being consumed by fees. ';
                observations += '</li>';
            }
            
        } else {
            // Observations for multiple funds
            const returnsSpread = Math.max(...metricsArray.map(m => m.cagr)) - 
                                 Math.min(...metricsArray.map(m => m.cagr));
            
            if (returnsSpread > 5) {
                observations += '<li><strong>Significant Performance Variation:</strong> ';
                observations += `The ${this.calc.formatPercentage(returnsSpread)} difference in CAGR between `;
                observations += 'the top and bottom performers highlights the importance of careful fund selection. ';
                observations += '</li>';
            }
            
            const avgSharpe = metricsArray.reduce((sum, m) => sum + m.sharpeRatio, 0) / metricsArray.length;
            if (avgSharpe > 1.2) {
                observations += '<li><strong>Quality Fund Universe:</strong> ';
                observations += 'The average Sharpe Ratio across compared funds is above 1.2, ';
                observations += 'indicating a selection of generally well-performing funds. ';
                observations += '</li>';
            }
        }
        
        // General observation
        observations += '<li><strong>Historical Performance:</strong> ';
        observations += 'While past performance provides valuable insights into fund management quality and strategy effectiveness, ';
        observations += 'investors should combine this analysis with qualitative factors such as fund manager tenure, ';
        observations += 'investment philosophy, and portfolio composition. ';
        observations += '</li>';
        
        observations += '</ul>';
        
        section.innerHTML += observations;
        return section;
    }

    // Recommendations
    generateRecommendations(schemeNames, metricsArray) {
        const section = this.createSection('Investment Guidance & Recommendations', 'fa-handshake');
        
        const recommendationBox = document.createElement('div');
        recommendationBox.className = 'recommendation-box';
        
        let recommendations = '<h5><i class="fas fa-star"></i> Investment Recommendations</h5>';
        
        if (schemeNames.length === 1) {
            const metrics = metricsArray[0];
            const recommendation = this.generateSingleFundRecommendation(schemeNames[0], metrics);
            recommendations += recommendation;
        } else {
            const recommendation = this.generateMultiFundRecommendation(schemeNames, metricsArray);
            recommendations += recommendation;
        }
        
        // Investment strategy tips
        recommendations += '<h5><i class="fas fa-compass"></i> Strategic Considerations</h5>';
        recommendations += '<ul>';
        recommendations += '<li><strong>Systematic Investment:</strong> Consider SIP (Systematic Investment Plan) ';
        recommendations += 'to benefit from rupee cost averaging and reduce timing risk.</li>';
        recommendations += '<li><strong>Portfolio Diversification:</strong> Ensure this investment aligns with ';
        recommendations += 'your overall portfolio asset allocation strategy.</li>';
        recommendations += '<li><strong>Regular Review:</strong> Monitor fund performance quarterly and ';
        recommendations += 'review your investment thesis annually.</li>';
        recommendations += '<li><strong>Tax Efficiency:</strong> Consider the tax implications of equity funds ';
        recommendations += '(LTCG, STCG) while planning your investment horizon.</li>';
        recommendations += '<li><strong>Emergency Fund:</strong> Ensure adequate emergency savings before ';
        recommendations += 'committing to market-linked investments.</li>';
        recommendations += '</ul>';
        
        recommendationBox.innerHTML = recommendations;
        section.appendChild(recommendationBox);
        
        return section;
    }

    // Generate single fund recommendation
    generateSingleFundRecommendation(name, metrics) {
        let rec = '<p>';
        
        const score = this.calculateOverallScore(metrics);
        
        if (score >= 80) {
            rec += `<strong style="color: #28a745;">✓ STRONG BUY</strong><br>`;
            rec += `<strong>${name}</strong> demonstrates excellent performance characteristics across multiple metrics. `;
            rec += `The fund's strong risk-adjusted returns (Sharpe: ${this.calc.formatNumber(metrics.sharpeRatio)}), `;
            rec += `positive alpha (${this.calc.formatPercentage(metrics.alpha)}), and manageable volatility `;
            rec += `make it a compelling investment choice for investors seeking ${this.assessRiskLevel(metrics).toLowerCase()} exposure.`;
        } else if (score >= 65) {
            rec += `<strong style="color: #00a86b;">✓ BUY</strong><br>`;
            rec += `<strong>${name}</strong> shows solid performance with good risk-return characteristics. `;
            rec += `While there may be some areas for improvement, the fund's overall profile aligns well `;
            rec += `with investors seeking balanced growth. Consider this as a core holding in your portfolio.`;
        } else if (score >= 50) {
            rec += `<strong style="color: #ffc107;">⚠ HOLD / CONSIDER WITH CAUTION</strong><br>`;
            rec += `<strong>${name}</strong> presents a mixed picture with both strengths and weaknesses. `;
            rec += `Current investors may hold their positions while monitoring performance closely. `;
            rec += `New investors should carefully evaluate if this aligns with their risk tolerance and investment goals.`;
        } else {
            rec += `<strong style="color: #dc3545;">✗ AVOID / REVIEW ALTERNATIVES</strong><br>`;
            rec += `<strong>${name}</strong> shows concerning performance metrics that warrant careful consideration. `;
            rec += `Investors may want to explore alternative funds with better risk-return profiles. `;
            rec += `If already invested, consider reviewing your position and investment thesis.`;
        }
        
        rec += '</p>';
        return rec;
    }

    // Generate multi-fund recommendation
    generateMultiFundRecommendation(schemeNames, metricsArray) {
        let rec = '<p>';
        
        const scores = metricsArray.map(m => this.calculateOverallScore(m));
        const topIndex = scores.indexOf(Math.max(...scores));
        const topFund = schemeNames[topIndex];
        const topMetrics = metricsArray[topIndex];
        
        rec += `<strong style="color: #28a745;">TOP RECOMMENDATION: ${topFund}</strong><br>`;
        rec += `Based on comprehensive analysis, <strong>${topFund}</strong> emerges as the top choice `;
        rec += `with superior overall performance metrics. `;
        rec += `Key strengths include: `;
        rec += `<ul>`;
        rec += `<li>CAGR of ${this.calc.formatPercentage(topMetrics.cagr)}</li>`;
        rec += `<li>Sharpe Ratio of ${this.calc.formatNumber(topMetrics.sharpeRatio)}</li>`;
        rec += `<li>Volatility of ${this.calc.formatPercentage(topMetrics.volatility)}</li>`;
        rec += `<li>Alpha of ${this.calc.formatPercentage(topMetrics.alpha)}</li>`;
        rec += `</ul>`;
        
        rec += '<br><strong>Alternative Considerations:</strong><br>';
        
        // Find best low-risk option
        const volatilities = metricsArray.map(m => m.volatility);
        const lowRiskIndex = volatilities.indexOf(Math.min(...volatilities));
        
        if (lowRiskIndex !== topIndex) {
            rec += `For conservative investors prioritizing capital preservation, `;
            rec += `<strong>${schemeNames[lowRiskIndex]}</strong> offers lower volatility `;
            rec += `(${this.calc.formatPercentage(metricsArray[lowRiskIndex].volatility)}) `;
            rec += `while still delivering reasonable returns.<br>`;
        }
        
        // Find best high-return option
        const cagrs = metricsArray.map(m => m.cagr);
        const highReturnIndex = cagrs.indexOf(Math.max(...cagrs));
        
        if (highReturnIndex !== topIndex) {
            rec += `For aggressive investors seeking maximum returns, `;
            rec += `<strong>${schemeNames[highReturnIndex]}</strong> delivers the highest CAGR `;
            rec += `(${this.calc.formatPercentage(metricsArray[highReturnIndex].cagr)}), `;
            rec += `though with higher volatility.`;
        }
        
        rec += '</p>';
        return rec;
    }

    // Disclaimer
    generateDisclaimer() {
        const section = this.createSection('Legal Disclaimer & Risk Factors', 'fa-shield-alt');
        
        let disclaimer = '<p style="font-size: 0.95rem; line-height: 1.8;">';
        disclaimer += '<strong>Important Notice:</strong><br><br>';
        disclaimer += 'This analysis is provided for informational and educational purposes only and should not be construed ';
        disclaimer += 'as investment advice, recommendation, or solicitation to buy or sell any securities. ';
        disclaimer += '<br><br>';
        disclaimer += '<strong>Key Risk Factors:</strong><br>';
        disclaimer += '• Past performance is not indicative of future results<br>';
        disclaimer += '• Mutual fund investments are subject to market risks<br>';
        disclaimer += '• NAV values can go up or down based on market conditions<br>';
        disclaimer += '• No guarantee of returns or capital protection<br>';
        disclaimer += '• Investor should read all scheme-related documents carefully<br>';
        disclaimer += '<br>';
        disclaimer += '<strong>Recommendation:</strong><br>';
        disclaimer += 'Before making any investment decision, please consult with a qualified financial advisor ';
        disclaimer += 'who can assess your individual financial situation, risk tolerance, investment objectives, ';
        disclaimer += 'and time horizon. The analysis provided is based on historical data and mathematical calculations ';
        disclaimer += 'which may not capture all relevant factors affecting investment suitability.';
        disclaimer += '</p>';
        
        section.innerHTML += disclaimer;
        return section;
    }

    // Helper Functions

    createSection(title, icon) {
        const section = document.createElement('div');
        section.className = 'report-section';
        section.innerHTML = `<h4><i class="fas ${icon}"></i> ${title}</h4>`;
        return section;
    }

    assessPerformanceQuality(metrics) {
        if (metrics.cagr >= 15) return 'exceptional';
        if (metrics.cagr >= 10) return 'strong';
        if (metrics.cagr >= 5) return 'moderate';
        return 'below-average';
    }

    assessRiskLevel(metrics) {
        if (metrics.volatility < 10) return 'low';
        if (metrics.volatility < 18) return 'moderate';
        return 'high';
    }

    interpretSharpeRatio(sharpe) {
        if (sharpe >= 2) return 'excellent risk-adjusted returns';
        if (sharpe >= 1) return 'good risk-adjusted returns';
        if (sharpe >= 0) return 'acceptable risk-adjusted returns';
        return 'poor risk-adjusted returns';
    }

    findTopPerformer(names, metricsArray, metric, inverse = false) {
        const values = metricsArray.map(m => m[metric]);
        const bestValue = inverse ? Math.min(...values) : Math.max(...values);
        const bestIndex = values.indexOf(bestValue);
        return { name: names[bestIndex], value: bestValue };
    }

    sortSchemesByMetric(names, metricsArray, metric, ascending = false) {
        const combined = names.map((name, index) => ({
            name,
            value: metricsArray[index][metric]
        }));
        combined.sort((a, b) => ascending ? a.value - b.value : b.value - a.value);
        return combined;
    }

    identifyStrengths(metrics) {
        const strengths = [];
        
        if (metrics.cagr > 12) {
            strengths.push(`Strong returns of ${this.calc.formatPercentage(metrics.cagr)} CAGR, outperforming typical market averages`);
        }
        
        if (metrics.sharpeRatio > 1.2) {
            strengths.push(`Excellent risk-adjusted returns with Sharpe Ratio of ${this.calc.formatNumber(metrics.sharpeRatio)}`);
        }
        
        if (metrics.alpha > 1) {
            strengths.push(`Positive alpha generation (${this.calc.formatPercentage(metrics.alpha)}), demonstrating value addition through active management`);
        }
        
        if (metrics.maxDrawdown < 20) {
            strengths.push(`Limited downside risk with maximum drawdown of only ${this.calc.formatPercentage(metrics.maxDrawdown)}`);
        }
        
        if (metrics.informationRatio > 0.5) {
            strengths.push(`Consistent outperformance indicated by Information Ratio of ${this.calc.formatNumber(metrics.informationRatio)}`);
        }
        
        if (metrics.expenseRatio < 1.0) {
            strengths.push(`Competitive expense ratio of ${this.calc.formatPercentage(metrics.expenseRatio)}, ensuring cost efficiency`);
        }
        
        if (strengths.length === 0) {
            strengths.push('Provides market exposure with standard industry characteristics');
        }
        
        return strengths;
    }

    identifyWeaknesses(metrics) {
        const weaknesses = [];
        
        if (metrics.cagr < 8) {
            weaknesses.push(`Below-average returns of ${this.calc.formatPercentage(metrics.cagr)} may not meet growth expectations`);
        }
        
        if (metrics.volatility > 22) {
            weaknesses.push(`High volatility of ${this.calc.formatPercentage(metrics.volatility)} requires strong risk tolerance`);
        }
        
        if (metrics.sharpeRatio < 0.5) {
            weaknesses.push(`Low Sharpe Ratio (${this.calc.formatNumber(metrics.sharpeRatio)}) indicates suboptimal risk-adjusted returns`);
        }
        
        if (metrics.maxDrawdown > 30) {
            weaknesses.push(`Significant maximum drawdown of ${this.calc.formatPercentage(metrics.maxDrawdown)} poses capital preservation concerns`);
        }
        
        if (metrics.alpha < -2) {
            weaknesses.push(`Negative alpha (${this.calc.formatPercentage(metrics.alpha)}) suggests underperformance relative to risk taken`);
        }
        
        if (metrics.expenseRatio > 1.8) {
            weaknesses.push(`Above-average expense ratio of ${this.calc.formatPercentage(metrics.expenseRatio)} may erode returns`);
        }
        
        return weaknesses;
    }

    determineInvestorProfile(metrics) {
        const riskLevel = this.assessRiskLevel(metrics);
        const returnLevel = metrics.cagr;
        
        if (riskLevel === 'low') {
            return {
                type: 'Conservative Investors',
                horizon: '3-5 years',
                riskTolerance: 'Low',
                description: 'Suitable for investors who prioritize capital preservation over aggressive growth, including retirees or those nearing retirement, first-time investors, and those with short to medium-term financial goals.'
            };
        } else if (riskLevel === 'moderate' && returnLevel >= 10) {
            return {
                type: 'Balanced/Moderate Investors',
                horizon: '5-7 years',
                riskTolerance: 'Medium',
                description: 'Ideal for investors seeking a balance between growth and stability. Suitable for mid-career professionals building wealth, those with medium-term goals like children\'s education or house down payment, and investors comfortable with moderate market fluctuations.'
            };
        } else if (riskLevel === 'high' && returnLevel >= 12) {
            return {
                type: 'Aggressive/Growth Investors',
                horizon: '7+ years',
                riskTolerance: 'High',
                description: 'Best suited for younger investors with long investment horizons, those with high income and substantial risk capacity, investors seeking maximum capital appreciation, and those who can withstand significant short-term volatility for long-term gains.'
            };
        } else {
            return {
                type: 'Conservative to Moderate Investors',
                horizon: '5+ years',
                riskTolerance: 'Low to Medium',
                description: 'Appropriate for investors seeking steady growth with controlled risk, those transitioning from conservative to balanced portfolios, and investors who want equity exposure but with downside protection focus.'
            };
        }
    }

    calculateOverallScore(metrics) {
        let score = 0;
        
        // Returns component (30 points)
        if (metrics.cagr >= 15) score += 30;
        else if (metrics.cagr >= 10) score += 22;
        else if (metrics.cagr >= 5) score += 15;
        else score += 5;
        
        // Risk-adjusted returns (25 points)
        if (metrics.sharpeRatio >= 1.5) score += 25;
        else if (metrics.sharpeRatio >= 1) score += 18;
        else if (metrics.sharpeRatio >= 0.5) score += 10;
        else score += 3;
        
        // Risk level (20 points) - inverse scoring
        if (metrics.volatility < 12) score += 20;
        else if (metrics.volatility < 18) score += 15;
        else if (metrics.volatility < 25) score += 8;
        else score += 3;
        
        // Alpha (15 points)
        if (metrics.alpha >= 3) score += 15;
        else if (metrics.alpha >= 1) score += 10;
        else if (metrics.alpha >= -1) score += 5;
        else score += 0;
        
        // Drawdown (10 points) - inverse scoring
        if (metrics.maxDrawdown < 15) score += 10;
        else if (metrics.maxDrawdown < 25) score += 7;
        else if (metrics.maxDrawdown < 35) score += 4;
        else score += 1;
        
        return score;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    // Generate Category-Wise Comparison Report
    generateCategoryReport(category, rankedResults, selectedPeriods, selectedMetrics) {
        const reportContainer = document.getElementById('report-content');
        reportContainer.innerHTML = '';

        // Use primary metrics (1Y or first available)
        const primaryPeriod = selectedPeriods.includes('1Y') ? '1Y' : selectedPeriods[0];
        const primaryMetrics = rankedResults.map(r => r.metrics[primaryPeriod]);

        // Get top performers
        const top5 = rankedResults.slice(0, 5);
        const bottom5 = rankedResults.slice(-5).reverse();

        // Generate report sections
        const sections = [
            this.generateCategoryExecutiveSummary(category, rankedResults, primaryMetrics),
            this.generateTop5Analysis(category, top5),
            this.generateCategoryPerformanceDistribution(category, rankedResults, primaryMetrics),
            this.generateCategoryRiskAnalysis(category, rankedResults, primaryMetrics),
            this.generateWinnersAndLaggards(top5, bottom5),
            this.generateCategoryInvestmentStrategy(category, rankedResults),
            this.generateCategoryRecommendations(category, top5),
            this.generateDisclaimer()
        ];

        sections.forEach(section => {
            if (section) {
                reportContainer.appendChild(section);
            }
        });
    }

    // Category Executive Summary
    generateCategoryExecutiveSummary(category, rankedResults, metricsArray) {
        const section = this.createSection('Category Analysis: ' + category, 'fa-chart-bar');
        
        let summary = '<p>';
        
        summary += `This comprehensive analysis evaluates <strong>${rankedResults.length} top mutual fund schemes</strong> `;
        summary += `in the <span class="highlight">${category}</span> category. `;
        summary += `The schemes have been ranked based on a composite scoring algorithm that considers `;
        summary += `returns, risk-adjusted performance, volatility, alpha generation, and downside protection.<br><br>`;
        
        // Calculate category statistics
        const avgCAGR = metricsArray.reduce((sum, m) => sum + m.cagr, 0) / metricsArray.length;
        const avgVolatility = metricsArray.reduce((sum, m) => sum + m.volatility, 0) / metricsArray.length;
        const avgSharpe = metricsArray.reduce((sum, m) => sum + m.sharpeRatio, 0) / metricsArray.length;
        
        summary += `<strong>Category Performance Summary:</strong><br>`;
        summary += `• Average CAGR: <strong>${this.calc.formatPercentage(avgCAGR)}</strong><br>`;
        summary += `• Average Volatility: <strong>${this.calc.formatPercentage(avgVolatility)}</strong><br>`;
        summary += `• Average Sharpe Ratio: <strong>${this.calc.formatNumber(avgSharpe)}</strong><br><br>`;
        
        const topPerformer = rankedResults[0];
        const topMetrics = metricsArray[0];
        
        summary += `The top-ranked scheme, <strong>${topPerformer.scheme.name}</strong>, `;
        summary += `achieves a composite score of <span class="highlight">${topPerformer.overallScore.toFixed(1)}/100</span> `;
        summary += `with a CAGR of <strong>${this.calc.formatPercentage(topMetrics.cagr)}</strong> `;
        summary += `and Sharpe Ratio of <strong>${this.calc.formatNumber(topMetrics.sharpeRatio)}</strong>. `;
        
        summary += '</p>';
        section.innerHTML += summary;
        
        return section;
    }

    // Top 5 Performers Analysis
    generateTop5Analysis(category, top5) {
        const section = this.createSection('Top 5 Performers - Detailed Analysis', 'fa-trophy');
        
        let analysis = '<p>The following schemes represent the best performers in the ' + category + ' category:</p>';
        
        top5.forEach((result, index) => {
            const metrics = Object.values(result.metrics)[0];
            const rank = index + 1;
            const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
            
            analysis += `<div class="recommendation-box" style="margin: 15px 0;">`;
            analysis += `<h5>${medal} Rank ${rank}: ${result.scheme.name}</h5>`;
            analysis += `<p><strong>Overall Score:</strong> ${result.overallScore.toFixed(1)}/100</p>`;
            analysis += `<ul>`;
            analysis += `<li><strong>CAGR:</strong> ${this.calc.formatPercentage(metrics.cagr)} - `;
            analysis += metrics.cagr > 15 ? 'Exceptional returns' : metrics.cagr > 12 ? 'Strong returns' : 'Good returns';
            analysis += `</li>`;
            analysis += `<li><strong>Sharpe Ratio:</strong> ${this.calc.formatNumber(metrics.sharpeRatio)} - `;
            analysis += metrics.sharpeRatio > 1.5 ? 'Excellent risk-adjusted returns' : metrics.sharpeRatio > 1 ? 'Good risk-adjusted returns' : 'Acceptable returns';
            analysis += `</li>`;
            analysis += `<li><strong>Volatility:</strong> ${this.calc.formatPercentage(metrics.volatility)} - `;
            analysis += metrics.volatility < 15 ? 'Low risk' : metrics.volatility < 22 ? 'Moderate risk' : 'Higher risk';
            analysis += `</li>`;
            analysis += `<li><strong>Alpha:</strong> ${this.calc.formatPercentage(metrics.alpha)} - `;
            analysis += metrics.alpha > 2 ? 'Superior benchmark outperformance' : metrics.alpha > 0 ? 'Positive value addition' : 'Underperforming benchmark';
            analysis += `</li>`;
            analysis += `<li><strong>Max Drawdown:</strong> ${this.calc.formatPercentage(metrics.maxDrawdown)} - `;
            analysis += metrics.maxDrawdown < 20 ? 'Excellent downside protection' : metrics.maxDrawdown < 30 ? 'Moderate downside risk' : 'Significant drawdown risk';
            analysis += `</li>`;
            analysis += `</ul>`;
            
            // Key strengths
            const strengths = this.identifyStrengths(metrics);
            if (strengths.length > 0) {
                analysis += `<p><strong style="color: #28a745;">Key Strengths:</strong></p><ul>`;
                strengths.slice(0, 3).forEach(strength => {
                    analysis += `<li>${strength}</li>`;
                });
                analysis += `</ul>`;
            }
            
            analysis += `</div>`;
        });
        
        section.innerHTML += analysis;
        return section;
    }

    // Performance Distribution
    generateCategoryPerformanceDistribution(category, rankedResults, metricsArray) {
        const section = this.createSection('Performance Distribution Analysis', 'fa-chart-area');
        
        // Categorize schemes by performance
        const excellent = rankedResults.filter(r => r.overallScore >= 80);
        const good = rankedResults.filter(r => r.overallScore >= 65 && r.overallScore < 80);
        const average = rankedResults.filter(r => r.overallScore >= 50 && r.overallScore < 65);
        const poor = rankedResults.filter(r => r.overallScore < 50);
        
        let analysis = '<p>Performance distribution across the analyzed schemes:</p>';
        analysis += '<ul>';
        analysis += `<li><strong style="color: #28a745;">Excellent (Score 80+):</strong> ${excellent.length} schemes (${((excellent.length/rankedResults.length)*100).toFixed(1)}%)</li>`;
        analysis += `<li><strong style="color: #00a86b;">Good (Score 65-79):</strong> ${good.length} schemes (${((good.length/rankedResults.length)*100).toFixed(1)}%)</li>`;
        analysis += `<li><strong style="color: #ffc107;">Average (Score 50-64):</strong> ${average.length} schemes (${((average.length/rankedResults.length)*100).toFixed(1)}%)</li>`;
        analysis += `<li><strong style="color: #dc3545;">Below Average (Score <50):</strong> ${poor.length} schemes (${((poor.length/rankedResults.length)*100).toFixed(1)}%)</li>`;
        analysis += '</ul>';
        
        // CAGR distribution
        const cagrValues = metricsArray.map(m => m.cagr);
        const maxCAGR = Math.max(...cagrValues);
        const minCAGR = Math.min(...cagrValues);
        const medianCAGR = cagrValues.sort((a, b) => a - b)[Math.floor(cagrValues.length / 2)];
        
        analysis += '<br><p><strong>Returns Distribution:</strong></p>';
        analysis += '<ul>';
        analysis += `<li>Highest CAGR: <strong>${this.calc.formatPercentage(maxCAGR)}</strong></li>`;
        analysis += `<li>Median CAGR: <strong>${this.calc.formatPercentage(medianCAGR)}</strong></li>`;
        analysis += `<li>Lowest CAGR: <strong>${this.calc.formatPercentage(minCAGR)}</strong></li>`;
        analysis += `<li>Spread: <strong>${this.calc.formatPercentage(maxCAGR - minCAGR)}</strong> - `;
        analysis += (maxCAGR - minCAGR) > 10 ? 'High variation in performance' : 'Relatively consistent performance';
        analysis += '</li>';
        analysis += '</ul>';
        
        section.innerHTML += analysis;
        return section;
    }

    // Category Risk Analysis
    generateCategoryRiskAnalysis(category, rankedResults, metricsArray) {
        const section = this.createSection('Category Risk Profile', 'fa-shield-alt');
        
        const avgVolatility = metricsArray.reduce((sum, m) => sum + m.volatility, 0) / metricsArray.length;
        const avgDrawdown = metricsArray.reduce((sum, m) => sum + m.maxDrawdown, 0) / metricsArray.length;
        const avgBeta = metricsArray.reduce((sum, m) => sum + m.beta, 0) / metricsArray.length;
        
        let risk = '<p>';
        risk += `The <strong>${category}</strong> category exhibits the following risk characteristics:<br><br>`;
        risk += `<strong>Average Volatility:</strong> ${this.calc.formatPercentage(avgVolatility)}<br>`;
        
        if (avgVolatility < 15) {
            risk += 'This category shows <span class="highlight">low volatility</span>, making it suitable for conservative investors seeking stable returns with minimal fluctuations.';
        } else if (avgVolatility < 22) {
            risk += 'This category demonstrates <span class="highlight">moderate volatility</span>, appropriate for balanced investors comfortable with reasonable market fluctuations for growth potential.';
        } else {
            risk += 'This category exhibits <span class="highlight">high volatility</span>, requiring aggressive risk appetite and long-term investment horizon to weather significant market swings.';
        }
        
        risk += `<br><br><strong>Average Maximum Drawdown:</strong> ${this.calc.formatPercentage(avgDrawdown)}<br>`;
        risk += `Investors should be prepared for potential temporary declines of this magnitude. `;
        risk += avgDrawdown < 20 ? 'The category shows strong downside protection.' : 
                avgDrawdown < 30 ? 'Moderate downside risk is typical for this category.' : 
                'Significant drawdown potential requires strong conviction and patience.';
        
        risk += `<br><br><strong>Average Beta:</strong> ${this.calc.formatNumber(avgBeta)}<br>`;
        risk += avgBeta < 0.9 ? 'Lower market sensitivity provides defensive characteristics.' :
                avgBeta <= 1.1 ? 'Market-aligned movement offers balanced exposure.' :
                'Higher beta indicates amplified market movements in both directions.';
        
        risk += '</p>';
        
        section.innerHTML += risk;
        return section;
    }

    // Winners and Laggards
    generateWinnersAndLaggards(top5, bottom5) {
        const section = this.createSection('Category Leaders vs. Laggards', 'fa-exchange-alt');
        
        let comparison = '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">';
        
        // Winners
        comparison += '<div>';
        comparison += '<h5 style="color: #28a745;"><i class="fas fa-arrow-up"></i> Top Performers</h5>';
        comparison += '<ol>';
        top5.forEach(result => {
            const metrics = Object.values(result.metrics)[0];
            comparison += `<li><strong>${result.scheme.name}</strong><br>`;
            comparison += `CAGR: ${this.calc.formatPercentage(metrics.cagr)}, `;
            comparison += `Sharpe: ${this.calc.formatNumber(metrics.sharpeRatio)}`;
            comparison += `</li>`;
        });
        comparison += '</ol>';
        comparison += '</div>';
        
        // Laggards
        comparison += '<div>';
        comparison += '<h5 style="color: #dc3545;"><i class="fas fa-arrow-down"></i> Bottom Performers</h5>';
        comparison += '<ol>';
        bottom5.forEach(result => {
            const metrics = Object.values(result.metrics)[0];
            comparison += `<li><strong>${result.scheme.name}</strong><br>`;
            comparison += `CAGR: ${this.calc.formatPercentage(metrics.cagr)}, `;
            comparison += `Sharpe: ${this.calc.formatNumber(metrics.sharpeRatio)}`;
            comparison += `</li>`;
        });
        comparison += '</ol>';
        comparison += '</div>';
        
        comparison += '</div>';
        
        comparison += '<p style="margin-top: 20px;"><strong>Key Observations:</strong> ';
        comparison += 'The performance gap between top and bottom performers highlights the importance of careful fund selection even within the same category. ';
        comparison += 'Active management quality, portfolio construction, and fund manager expertise significantly impact outcomes.';
        comparison += '</p>';
        
        section.innerHTML += comparison;
        return section;
    }

    // Category Investment Strategy
    generateCategoryInvestmentStrategy(category, rankedResults) {
        const section = this.createSection('Investment Strategy for ' + category, 'fa-bullseye');
        
        let strategy = '<p>';
        
        // Category-specific guidance
        if (category.includes('Large Cap')) {
            strategy += '<strong>Large Cap Strategy:</strong> Focus on stability and consistent returns. ';
            strategy += 'Top 5 schemes offer optimal balance of growth and downside protection. ';
            strategy += 'Suitable for conservative to moderate investors with 3-5 year horizon.';
        } else if (category.includes('Mid Cap')) {
            strategy += '<strong>Mid Cap Strategy:</strong> Target higher growth potential with moderate risk. ';
            strategy += 'Select funds with proven track records in managing volatility. ';
            strategy += 'Best for aggressive investors with 5-7 year horizon.';
        } else if (category.includes('Small Cap')) {
            strategy += '<strong>Small Cap Strategy:</strong> Accept higher volatility for maximum growth. ';
            strategy += 'Prioritize funds with strong risk-adjusted returns (high Sharpe ratio). ';
            strategy += 'Recommended only for aggressive investors with 7+ year horizon.';
        } else if (category.includes('Flexi') || category.includes('Multi')) {
            strategy += '<strong>Flexi/Multi Cap Strategy:</strong> Benefit from flexible allocation across market caps. ';
            strategy += 'Look for funds demonstrating consistent alpha generation. ';
            strategy += 'Suitable for moderate to aggressive investors with 5+ year horizon.';
        } else if (category.includes('Hybrid')) {
            strategy += '<strong>Hybrid Fund Strategy:</strong> Balanced debt-equity allocation for moderate risk. ';
            strategy += 'Focus on funds with stable returns and lower drawdowns. ';
            strategy += 'Ideal for conservative to moderate investors with 3-5 year horizon.';
        } else if (category.includes('ELSS')) {
            strategy += '<strong>ELSS Strategy:</strong> Combine tax savings with equity growth. ';
            strategy += 'Select top-performing funds considering the 3-year lock-in period. ';
            strategy += 'Suitable for tax-saving investors with long-term perspective.';
        } else {
            strategy += 'Focus on top-ranked funds with consistent performance across metrics. ';
            strategy += 'Consider your risk tolerance and investment horizon before selecting.';
        }
        
        strategy += '</p><br>';
        
        strategy += '<p><strong>Selection Criteria:</strong></p>';
        strategy += '<ul>';
        strategy += '<li>Prioritize funds ranked in top 5 for optimal risk-return trade-off</li>';
        strategy += '<li>Verify 3-year and 5-year consistency, not just recent performance</li>';
        strategy += '<li>Check expense ratio - lower costs enhance net returns</li>';
        strategy += '<li>Evaluate fund manager tenure and track record</li>';
        strategy += '<li>Consider SIP for rupee cost averaging benefits</li>';
        strategy += '</ul>';
        
        section.innerHTML += strategy;
        return section;
    }

    // Category Recommendations
    generateCategoryRecommendations(category, top5) {
        const section = this.createSection('Investment Recommendations', 'fa-check-circle');
        
        const recommendationBox = document.createElement('div');
        recommendationBox.className = 'recommendation-box';
        
        let rec = '<h5><i class="fas fa-star"></i> Recommended Schemes from ' + category + '</h5>';
        rec += '<p>Based on comprehensive analysis, the following schemes are recommended for investment:</p>';
        
        rec += '<ol style="line-height: 2;">';
        top5.forEach((result, index) => {
            const metrics = Object.values(result.metrics)[0];
            const badge = index === 0 ? '⭐ BEST CHOICE' : index === 1 ? '🥈 EXCELLENT ALTERNATIVE' : '✓ GOOD OPTION';
            
            rec += `<li><strong>${result.scheme.name}</strong> ${badge}<br>`;
            rec += `<small>`;
            rec += `Score: ${result.overallScore.toFixed(1)} | `;
            rec += `CAGR: ${this.calc.formatPercentage(metrics.cagr)} | `;
            rec += `Sharpe: ${this.calc.formatNumber(metrics.sharpeRatio)} | `;
            rec += `Volatility: ${this.calc.formatPercentage(metrics.volatility)}`;
            rec += `</small>`;
            rec += `</li>`;
        });
        rec += '</ol>';
        
        rec += '<br><p><strong><i class="fas fa-exclamation-triangle"></i> Important Considerations:</strong></p>';
        rec += '<ul>';
        rec += '<li>Verify current fund factsheet and portfolio holdings before investing</li>';
        rec += '<li>Check if Direct Plan is available for lower expense ratio</li>';
        rec += '<li>Consider SIP over lump sum for volatility averaging</li>';
        rec += '<li>Align fund selection with your overall asset allocation</li>';
        rec += '<li>Review performance quarterly, rebalance annually if needed</li>';
        rec += '</ul>';
        
        recommendationBox.innerHTML = rec;
        section.appendChild(recommendationBox);
        
        return section;
    }
}

// Export for use in other modules
window.ReportGenerator = ReportGenerator;
