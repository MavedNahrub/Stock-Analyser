import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

async function test() {
    const symbol = 'RELIANCE.NS';
    try {
        const historical = await yahooFinance.chart(symbol, {
            period1: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            interval: '1d',
        });
        console.log('Quotes count:', historical?.quotes?.length);
        if (historical?.quotes) {
            console.log('First 3 quotes:', historical.quotes.slice(0, 3));
            console.log('Last 3 quotes:', historical.quotes.slice(-3));
            const closes = historical.quotes.map(q => q.close).filter(c => c != null);
            console.log('Valid closes count:', closes.length);
        }
    } catch (e) {
        console.error(e);
    }
}

test();
