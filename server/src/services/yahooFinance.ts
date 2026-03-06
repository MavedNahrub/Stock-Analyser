import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

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

function formatMarketCap(value: number): string {
    if (!value || isNaN(value)) return 'N/A';
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toFixed(0)}`;
}

function safe(val: number | undefined | null, fallback: number = 0): number {
    if (val === undefined || val === null || isNaN(val)) return fallback;
    return val;
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

export async function fetchStockData(symbol: string): Promise<StockData> {
    // Fetch quote and historical data in parallel
    const [quote, historical] = await Promise.all([
        yahooFinance.quoteSummary(symbol, {
            modules: ['price', 'summaryDetail', 'defaultKeyStatistics', 'financialData'],
        }),
        yahooFinance.chart(symbol, {
            period1: Math.floor((Date.now() - 90 * 24 * 60 * 60 * 1000) / 1000),
            period2: Math.floor(Date.now() / 1000),
            interval: '1d',
        }),
    ]);

    const price = quote.price;
    const summary = quote.summaryDetail;
    const keyStats = quote.defaultKeyStatistics;
    const financial = quote.financialData;

    if (!price || !price.regularMarketPrice) {
        throw new Error(`No data found for symbol "${symbol}". Check the symbol and try again.`);
    }

    const currentPrice = safe(price.regularMarketPrice);
    const change = safe(price.regularMarketChange);
    const changePercent = safe(price.regularMarketChangePercent);

    // Parse chart data from historical quotes
    const chartData: Array<{ date: string; price: number }> = [];
    if (historical?.quotes) {
        for (const bar of historical.quotes) {
            if (bar.date && bar.close != null) {
                chartData.push({
                    date: bar.date.toISOString().split('T')[0],
                    price: bar.close,
                });
            }
        }
    }

    // Calculate max drawdown
    const prices = chartData.map((d) => d.price);
    const maxDrawdown = calculateMaxDrawdown(prices);

    // Fundamentals
    const peRatio = safe(summary?.trailingPE);
    const pbRatio = safe(keyStats?.priceToBook);
    const dividendYield = safe(summary?.dividendYield) * 100;
    const marketCap = formatMarketCap(safe(price.marketCap));

    // Health metrics
    const roe = safe(financial?.returnOnEquity) * 100;
    const profitMargin = safe(financial?.profitMargins) * 100;
    const revenueGrowth = safe(financial?.revenueGrowth) * 100;
    const debtToEquity = safe(financial?.debtToEquity);
    const currentRatio = safe(financial?.currentRatio);

    // Intrinsic value (simplified Graham Number)
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
        companyName: price.shortName || price.longName || symbol.toUpperCase(),
        currentPrice,
        change,
        changePercent,
        fundamentals: {
            peRatio,
            pbRatio,
            marketCap,
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
