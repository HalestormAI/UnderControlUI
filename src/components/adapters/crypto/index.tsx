import React, {useEffect, useState} from 'react'
import {Rate, ConversionCurrency, SymbolPair, RateMap, CoinSymbol} from "./models";
import {setupTickerStream} from "./actions";
import {balances, config} from "./config";


export interface CryptoProps {
}

const tickerBuffer: RateMap = {};



export default function CryptoPage(props: CryptoProps) {
    const [rates, setRates] = useState<RateMap>({});
    const onTickerUpdate = (rate: Rate) => {
        tickerBuffer[rate.symbol.toLowerCase()] = rate.price;
    }

    const hasCurrencyComparator = (symbols: SymbolPair, currency: ConversionCurrency): boolean => {
        const currencyNameLength = currency.length;
        return symbols.substring(symbols.length - currencyNameLength).toLowerCase() === currency;
    }

    const toCurrency = (symbols: SymbolPair, currency: ConversionCurrency): number => {
        if (hasCurrencyComparator(symbols, currency)) {
            return rates[symbols];
        }

        const baseRate = rates[`${config.baseConversionCoin}${currency}` as SymbolPair];
        return baseRate * rates[symbols];
    }

    const getBalance = (symbPair: SymbolPair): number => {
        const numCurrency = toCurrency(symbPair, config.conversionCurrency);
        const secondToken = hasCurrencyComparator(symbPair, config.conversionCurrency) ? config.conversionCurrency : config.baseConversionCoin;
        const firstToken = symbPair.substring(0, symbPair.length - secondToken.length);
        return balances[firstToken] * numCurrency;
    }

    useEffect(() => {
        const ws = setupTickerStream(config.coins, config.conversionCurrency, onTickerUpdate);

        const interval = setInterval(() => {
            setRates({...tickerBuffer});
            console.log("Updating buffer", tickerBuffer)
        }, 2000);
        return () => {
            clearInterval(interval);
            ws.close();
        }
    }, [config.conversionCurrency])

    const haveRates = !(Object.keys(rates).length === 0 && rates.constructor === Object)
    const haveConverter = haveRates && rates[`${config.baseConversionCoin}${config.conversionCurrency}`] !== undefined;
    console.log(haveRates,rates)

    return <div>
        <ul>
            {haveConverter && Object.keys(rates)
                .sort()
                .map((symbPair) =>
                <li key={`rate_${symbPair}_${config.conversionCurrency}`}><strong>{symbPair}: </strong>
                    {getBalance(symbPair).toFixed(2)}</li>
            )}
        </ul>
    </div>
}