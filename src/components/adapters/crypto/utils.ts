import {config, Config} from "./config";
import {CoinSymbol, ConversionCurrency, RateMap, SymbolPair} from "./models";

export const conversionCurrencyPair = (config: Config) => `${config.baseConversionCoin}${config.conversionCurrency}`;
export const coinConversionPair = (c: CoinSymbol, config: Config) => `${c}${config.baseConversionCoin}`;

export const coinsFromPair = (symbPair: SymbolPair): [CoinSymbol, CoinSymbol] => {
    const secondToken = hasCurrencyComparator(symbPair, config.conversionCurrency) ? config.conversionCurrency : config.baseConversionCoin;
    const firstToken = symbPair.substring(0, symbPair.length - secondToken.length);
    return [firstToken, secondToken];
}

export const hasCurrencyComparator = (symbols: SymbolPair, currency: ConversionCurrency): boolean => {
    const currencyNameLength = currency.length;
    return symbols.substring(symbols.length - currencyNameLength).toLowerCase() === currency;
}

export const toCurrency = (symbols: SymbolPair, currency: ConversionCurrency, rates: RateMap): number => {
    if (hasCurrencyComparator(symbols, currency)) {
        return rates[symbols];
    }

    const baseRate = rates[conversionCurrencyPair(config) as SymbolPair];
    return baseRate * rates[symbols];
}

export const getBalanceForPair = (symbPair: SymbolPair, rates: RateMap): number | null => {
    const numCurrency = toCurrency(symbPair, config.conversionCurrency, rates);
    if (numCurrency === undefined) {
        return null;
    }
    const [firstToken,] = coinsFromPair(symbPair);
    return config.balances[firstToken] * numCurrency;
}

export const haveAllCoins = (rates: RateMap, coins: Array<CoinSymbol>): boolean => {
    const haveAll = coins.reduce((haveAll, coin) =>
        haveAll && rates[coinConversionPair(coin, config)] !== undefined, true);
    return haveAll && rates[conversionCurrencyPair(config)] !== undefined;
}

export const minMaxHistoryRateForData = (rateData: number[], pad: boolean = false): [number, number] => {
    if (rateData.length == 0) {
        return [NaN, NaN];
    }
    const minval = Math.min(...rateData);
    const maxval = Math.max(...rateData);
    let padding = 0;
    if (pad) {
        const mean = rateData.reduce((a, v) => a + v, 0) / rateData.length;
        const variance = rateData.reduce((a, v) => a + Math.pow(v - mean, 2) / rateData.length, 0)
        padding = Math.sqrt(variance) * 0.5;
    }
    return [
        minval - padding,
        maxval + padding
    ]
}

export const getInvestmentForPair = (symbPair: SymbolPair): number => {
    const [firstToken,] = coinsFromPair(symbPair);
    if (!config.investment) {
        return 0;
    }
    return config.investment[firstToken] || 0;
}

export const getProfitForPair = (symbPair: SymbolPair, rates: RateMap): number => {
    const investment = getInvestmentForPair(symbPair);
    const balance = getBalanceForPair(symbPair, rates) || 0;
    return balance - investment;
}