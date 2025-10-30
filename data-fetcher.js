// Data Fetcher Module - MFApi.in Integration for Real Indian MF Data

class DataFetcher {
    constructor() {
        this.cachedData = null;
        this.lastFetchTime = null;
        this.cacheExpiry = 1000 * 60 * 60; // 60 minutes for scheme list
        this.mfApiBaseUrl = 'https://api.mfapi.in';
        this.historicalCache = {}; // Cache for historical NAV data
    }

    async fetchAMFIData() {
        try {
            // Check cache
            if (this.cachedData && this.lastFetchTime && 
                (Date.now() - this.lastFetchTime < this.cacheExpiry)) {
                console.log('Using cached MF data');
                return this.cachedData;
            }

            console.log('Fetching fresh data from MFApi.in...');
            
            // Fetch all mutual fund schemes from MFApi
            const response = await fetch(`${this.mfApiBaseUrl}/mf`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const schemes = await response.json();
            const parsedData = this.parseAndCategorizeSchemes(schemes);
            
            // Cache the data
            this.cachedData = parsedData;
            this.lastFetchTime = Date.now();
            
            console.log(`Successfully fetched ${parsedData.schemes.length} schemes from MFApi.in`);
            return parsedData;
            
        } catch (error) {
            console.error('Error fetching MFApi data:', error);
            
            // If fetch fails and no cache, use sample data
            if (!this.cachedData) {
                console.log('Using sample data as fallback');
                return this.getSampleData();
            }
            
            return this.cachedData;
        }
    }

    parseAndCategorizeSchemes(schemes) {
        const categorizedSchemes = [];
        const amcs = new Set();
        
        schemes.forEach(scheme => {
            // Parse scheme name and categorize
            const category = this.categorizeScheme(scheme.schemeName);
            const amc = this.extractAMC(scheme.schemeName);
            
            if (amc) amcs.add(amc);
            
            categorizedSchemes.push({
                code: scheme.schemeCode.toString(),
                isin: '', // MFApi doesn't provide ISIN
                name: scheme.schemeName,
                nav: 0, // Will be fetched separately for latest NAV
                date: new Date().toLocaleDateString('en-GB'),
                amc: amc || 'Unknown',
                category: category,
                schemeCode: scheme.schemeCode
            });
        });
        
        return {
            schemes: categorizedSchemes,
            amcs: Array.from(amcs).sort(),
            lastUpdated: new Date()
        };
    }

    extractAMC(schemeName) {
        // Extract AMC name from scheme name
        // Common patterns: "AMC Name - Fund Name - Plan - Option"
        
        const amcPatterns = [
            'Aditya Birla Sun Life',
            'HDFC',
            'ICICI Prudential',
            'SBI',
            'Axis',
            'Kotak',
            'Mirae Asset',
            'Nippon India',
            'DSP',
            'Tata',
            'UTI',
            'Franklin Templeton',
            'L&T',
            'Invesco',
            'Canara Robeco',
            'HSBC',
            'Edelweiss',
            'IDFC',
            'Mahindra Manulife',
            'Motilal Oswal',
            'Quant',
            'Sundaram',
            'Union',
            'Principal',
            'Parag Parikh',
            'PPFAS',
            'Baroda BNP Paribas',
            'Bank of India',
            'JM Financial',
            'Quantum'
        ];
        
        for (const amc of amcPatterns) {
            if (schemeName.includes(amc)) {
                return amc + (amc.includes('Management') ? '' : ' Asset Management Company Limited');
            }
        }
        
        // If no pattern matched, extract first part before hyphen
        const parts = schemeName.split('-');
        if (parts.length > 0) {
            return parts[0].trim() + ' Asset Management Company Limited';
        }
        
        return 'Unknown AMC';
    }

    categorizeScheme(schemeName) {
        const name = schemeName.toLowerCase();
        
        // Equity Funds
        if (name.includes('large cap')) return 'Large Cap Fund';
        if (name.includes('mid cap') || name.includes('midcap')) return 'Mid Cap Fund';
        if (name.includes('small cap') || name.includes('smallcap')) return 'Small Cap Fund';
        if (name.includes('multi cap') || name.includes('multicap')) return 'Multi Cap Fund';
        if (name.includes('flexi cap') || name.includes('flexicap')) return 'Flexi Cap Fund';
        if (name.includes('large & mid cap') || name.includes('large and mid cap')) 
            return 'Large & Mid Cap Fund';
        
        // Debt Funds
        if (name.includes('liquid')) return 'Liquid Fund';
        if (name.includes('ultra short')) return 'Ultra Short Duration Fund';
        if (name.includes('short duration')) return 'Short Duration Fund';
        if (name.includes('medium duration')) return 'Medium Duration Fund';
        if (name.includes('long duration')) return 'Long Duration Fund';
        if (name.includes('gilt')) return 'Gilt Fund';
        if (name.includes('credit risk')) return 'Credit Risk Fund';
        
        // Hybrid Funds
        if (name.includes('conservative hybrid')) return 'Conservative Hybrid Fund';
        if (name.includes('balanced hybrid') || name.includes('balanced advantage')) 
            return 'Balanced Hybrid Fund';
        if (name.includes('aggressive hybrid')) return 'Aggressive Hybrid Fund';
        if (name.includes('equity savings')) return 'Equity Savings Fund';
        
        // Other Categories
        if (name.includes('index') && !name.includes('sensex') && !name.includes('nifty')) 
            return 'Index Fund';
        if (name.includes('elss') || name.includes('tax saver') || name.includes('tax saving')) 
            return 'ELSS';
        if (name.includes('sector') || name.includes('thematic') || 
            name.includes('banking') || name.includes('pharma') || 
            name.includes('technology') || name.includes('infrastructure') ||
            name.includes('consumption') || name.includes('energy')) 
            return 'Sectoral';
        if (name.includes('focused') || name.includes('focus')) return 'Focused Fund';
        if (name.includes('value')) return 'Value Fund';
        if (name.includes('dividend yield')) return 'Dividend Yield Fund';
        
        return 'Other';
    }

    filterSchemes(data, amc, category) {
        if (!data || !data.schemes) return [];
        
        return data.schemes.filter(scheme => {
            const amcMatch = !amc || scheme.amc === amc;
            const categoryMatch = !category || scheme.category === category;
            return amcMatch && categoryMatch;
        });
    }

    async getLatestNAV(schemeCode) {
        try {
            const response = await fetch(`${this.mfApiBaseUrl}/mf/${schemeCode}`);
            if (!response.ok) throw new Error('Failed to fetch NAV');
            
            const data = await response.json();
            
            if (data && data.data && data.data.length > 0) {
                const latestData = data.data[0];
                return {
                    nav: parseFloat(latestData.nav),
                    date: latestData.date
                };
            }
            
            return null;
        } catch (error) {
            console.error(`Error fetching NAV for scheme ${schemeCode}:`, error);
            return null;
        }
    }

    async getHistoricalNAV(schemeCode, days = 252) {
        // Check cache first
        const cacheKey = `${schemeCode}_${days}`;
        if (this.historicalCache[cacheKey]) {
            console.log(`Using cached historical data for ${schemeCode}`);
            return this.historicalCache[cacheKey];
        }

        try {
            console.log(`Fetching historical NAV for scheme ${schemeCode}...`);
            const response = await fetch(`${this.mfApiBaseUrl}/mf/${schemeCode}`);
            
            if (!response.ok) throw new Error('Failed to fetch historical NAV');
            
            const result = await response.json();
            
            if (!result || !result.data || result.data.length === 0) {
                console.warn(`No historical data available for scheme ${schemeCode}`);
                return null;
            }
            
            // MFApi returns data in reverse chronological order (latest first)
            const allData = result.data;
            
            // Take the required number of days
            const historicalData = allData.slice(0, Math.min(days, allData.length));
            
            // Convert to our format (reverse to chronological order)
            const navData = historicalData.reverse().map(item => ({
                date: item.date,
                nav: parseFloat(item.nav)
            })).filter(item => !isNaN(item.nav) && item.nav > 0);
            
            // Cache the result
            this.historicalCache[cacheKey] = navData;
            
            console.log(`Fetched ${navData.length} days of historical NAV for scheme ${schemeCode}`);
            return navData;
            
        } catch (error) {
            console.error(`Error fetching historical NAV for scheme ${schemeCode}:`, error);
            return null;
        }
    }

    async fetchMultipleLatestNAVs(schemes) {
        console.log(`Fetching latest NAVs for ${schemes.length} schemes...`);
        
        const batchSize = 10; // Process in batches to avoid overwhelming the API
        const results = [];
        
        for (let i = 0; i < schemes.length; i += batchSize) {
            const batch = schemes.slice(i, i + batchSize);
            const batchPromises = batch.map(scheme => 
                this.getLatestNAV(scheme.schemeCode || scheme.code)
                    .then(navData => ({ scheme, navData }))
            );
            
            const batchResults = await Promise.all(batchPromises);
            results.push(...batchResults);
            
            // Small delay between batches
            if (i + batchSize < schemes.length) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
        
        // Update schemes with latest NAV
        results.forEach(({ scheme, navData }) => {
            if (navData) {
                scheme.nav = navData.nav;
                scheme.date = navData.date;
            }
        });
        
        return schemes;
    }

    getSampleData() {
        // Fallback sample data (same as before but minimal)
        console.log('Loading minimal sample data as fallback');
        
        const sampleSchemes = [
            {
                code: '118989',
                schemeCode: 118989,
                name: 'Aditya Birla Sun Life Flexi Cap Fund - Direct Plan - Growth',
                nav: 872.45,
                date: new Date().toLocaleDateString('en-GB'),
                amc: 'Aditya Birla Sun Life Asset Management Company Limited',
                category: 'Flexi Cap Fund'
            },
            {
                code: '120503',
                schemeCode: 120503,
                name: 'HDFC Flexi Cap Fund - Direct Plan - Growth',
                nav: 985.67,
                date: new Date().toLocaleDateString('en-GB'),
                amc: 'HDFC Asset Management Company Limited',
                category: 'Flexi Cap Fund'
            }
        ];

        return {
            schemes: sampleSchemes,
            amcs: [...new Set(sampleSchemes.map(s => s.amc))].sort(),
            lastUpdated: new Date()
        };
    }

    // Helper method to get period in days
    getPeriodDays(period) {
        const periodDays = {
            '1M': 30,
            '3M': 90,
            '6M': 180,
            '1Y': 365,
            '3Y': 1095,
            '5Y': 1825
        };
        return periodDays[period] || 365;
    }

    // Clear cache (useful for manual refresh)
    clearCache() {
        this.cachedData = null;
        this.lastFetchTime = null;
        this.historicalCache = {};
        console.log('Cache cleared');
    }
}

// Export for use in other modules
window.DataFetcher = DataFetcher;
