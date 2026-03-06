import axios from 'axios';

const BASE_URL = 'https://www.alphavantage.co/query';

interface AlphaVantageQuote {
    'Global Quote': {
        '01. symbol': string;
        '02. open': string;
        '03. high': string;
        '04. low': string;
        '05. price': string;
        '06. volume': string;
        '07. latest trading day': string;
        '08. previous close': string;
        '09. change': string;
        '10. change percent': string;
    };
}

interface AlphaVantageOverview {
    Symbol: string;
    Name: string;
    MarketCapitalization: string;
    PERatio: string;
    PriceToBookRatio: string;
    DividendYield: string;
    ReturnOnEquityTTM: string;
    ProfitMargin: string;
    RevenueGrowthYOY: string;
    DebtToEquity: string;
    CurrentRatio: string;
}

interface AlphaVantageTimeSeries {
    'Meta Data': {
        '2. Symbol': string;
    };
    'Time Series (Daily)': Record<string, {
        '1. open': string;
        '2. high': string;
        '3. low': string;
        '4. close': string;
        '5. volume': string;
    }>;
}

export interface StockData {
    symbol: string;
    companyName: string;
    currentPrice: number;
    change: number;
    changePercent: number;
    fundamentals: {
        peRatio: number;
        pbRatio: number;
        marketCap: string;
        dividendYield: number;
    };
    healthMetrics: {
        revenueGrowth: { value: number; isHealthy: boolean; label: string };
        profitMargin: { value: number; isHealthy: boolean; label: string };
        debtToEquity: { value: number; isHealthy: boolean; label: string };
        roe: { value: number; isHealthy: boolean; label: string };
        currentRatio: { value: number; isHealthy: boolean; label: string };
    };
    intrinsicValue: {
        current: number;
        intrinsic: number;
        percentage: number;
    };
    risk: {
        maxDrawdown: number;
        riskLevel: 'Low' | 'Medium' | 'High';
    };
    chartData: Array<{ date: string; price: number }>;
}

function formatMarketCap(value: string): string {
    const num = parseFloat(value);
    if (isNaN(num)) return 'N/A';
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toFixed(0)}`;
}

function safeFloat(val: string | undefined, fallback: number = 0): number {
    if (!val || val === 'None' || val === '-') return fallback;
    const parsed = parseFloat(val);
    return isNaN(parsed) ? fallback : parsed;
}

function calculateRiskLevel(maxDrawdown: number): 'Low' | 'Medium' | 'High' {
    const abs = Math.abs(maxDrawdown);
    if (abs < 20) return 'Low';
    if (abs < 35) return 'Medium';
    return 'High';
}

function calculateMaxDrawdown(prices: number[]): number {
    if (prices.length < 2) return 0;
    let maxDraw = 0;
    let peak = prices[0];
    for (const price of prices) {
        if (price > peak) peak = price;
        const drawdown = ((price - peak) / peak) * 100;
        if (drawdown < maxDraw) maxDraw = drawdown;
    }
    return Math.round(maxDraw * 10) / 10;
}

export async function fetchStockData(symbol: string, apiKey: string): Promise<StockData> {
    // Fetch quote, overview, and time series in parallel
    const [quoteRes, overviewRes, timeSeriesRes] = await Promise.all([
        axios.get<AlphaVantageQuote>(BASE_URL, {
            params: { function: 'GLOBAL_QUOTE', symbol, apikey: apiKey },
        }),
        axios.get<AlphaVantageOverview>(BASE_URL, {
            params: { function: 'OVERVIEW', symbol, apikey: apiKey },
        }),
        axios.get<AlphaVantageTimeSeries>(BASE_URL, {
            params: { function: 'TIME_SERIES_DAILY', symbol, apikey: apiKey, outputsize: 'compact' },
        }),
    ]);

    const quote = quoteRes.data['Global Quote'];
    const overview = overviewRes.data;
    const timeSeries = timeSeriesRes.data['Time Series (Daily)'];

    // Check for API errors
    if (!quote || !quote['05. price']) {
        throw new Error(`No quote data found for symbol: ${symbol}. API may be rate-limited.`);
    }

    const currentPrice = safeFloat(quote['05. price']);
    const change = safeFloat(quote['09. change']);
    const changePercentRaw = quote['10. change percent'] || '0%';
    const changePercent = safeFloat(changePercentRaw.replace('%', ''));

    // Parse chart data (last 30 days)
    const chartData: Array<{ date: string; price: number }> = [];
    if (timeSeries) {
        const dates = Object.keys(timeSeries).sort().slice(-30);
        for (const date of dates) {
            chartData.push({
                date,
                price: safeFloat(timeSeries[date]['4. close']),
            });
        }
    }

    // Calculate max drawdown from chart prices
    const prices = chartData.map((d) => d.price);
    const maxDrawdown = calculateMaxDrawdown(prices);

    // Parse fundamentals
    const peRatio = safeFloat(overview.PERatio);
    const pbRatio = safeFloat(overview.PriceToBookRatio);
    const dividendYield = safeFloat(overview.DividendYield) * 100;
    const roe = safeFloat(overview.ReturnOnEquityTTM) * 100;
    const profitMargin = safeFloat(overview.ProfitMargin) * 100;
    const revenueGrowth = safeFloat(overview.RevenueGrowthYOY) * 100;
    const debtToEquity = safeFloat(overview.DebtToEquity);
    const currentRatio = safeFloat(overview.CurrentRatio);

    // Estimate intrinsic value (simplified Graham Number approach)
    const eps = peRatio > 0 ? currentPrice / peRatio : 0;
    const bookValue = pbRatio > 0 ? currentPrice / pbRatio : 0;
    const grahamNumber = eps > 0 && bookValue > 0
        ? Math.sqrt(22.5 * eps * bookValue)
        : currentPrice * 1.1;
    const intrinsicPercentage = currentPrice > 0
        ? ((currentPrice - grahamNumber) / grahamNumber) * 100
        : 0;

    return {
        symbol: symbol.toUpperCase(),
        companyName: overview.Name || symbol.toUpperCase(),
        currentPrice,
        change,
        changePercent,
        fundamentals: {
            peRatio,
            pbRatio,
            marketCap: formatMarketCap(overview.MarketCapitalization || '0'),
            dividendYield,
        },
        healthMetrics: {
            revenueGrowth: {
                value: Math.round(revenueGrowth * 10) / 10,
                isHealthy: revenueGrowth > 5,
                label: 'Revenue Growth',
            },
            profitMargin: {
                value: Math.round(profitMargin * 10) / 10,
                isHealthy: profitMargin > 10,
                label: 'Profit Margin',
            },
            debtToEquity: {
                value: Math.round(debtToEquity * 100) / 100,
                isHealthy: debtToEquity < 2,
                label: 'Debt/Equity',
            },
            roe: {
                value: Math.round(roe * 10) / 10,
                isHealthy: roe > 15,
                label: 'Return on Equity',
            },
            currentRatio: {
                value: Math.round(currentRatio * 100) / 100,
                isHealthy: currentRatio > 1,
                label: 'Current Ratio',
            },
        },
        intrinsicValue: {
            current: currentPrice,
            intrinsic: Math.round(grahamNumber * 100) / 100,
            percentage: Math.round(intrinsicPercentage * 10) / 10,
        },
        risk: {
            maxDrawdown,
            riskLevel: calculateRiskLevel(maxDrawdown),
        },
        chartData,
    };
}
