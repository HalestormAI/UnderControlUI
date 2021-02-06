import {Config} from "./config";
import {CoinSymbol, ConversionCurrency, SymbolPair} from "./models";

export const conversionCurrencyPair = (config: Config) => `${config.baseConversionCoin}${config.conversionCurrency}`;
export const coinConvertsionPair = (c: CoinSymbol, config: Config) => `${c}${config.baseConversionCoin}`;

export const hasCurrencyComparator = (symbols: SymbolPair, currency: ConversionCurrency): boolean => {
    const currencyNameLength = currency.length;
    return symbols.substring(symbols.length - currencyNameLength).toLowerCase() === currency;
}