import React, {useEffect, useState} from 'react'
import {ConversionCurrency, FixedLengthQueue, Rate, RateHistory, RateMap, SymbolPair} from "./models";
import {setupTickerStream} from "./actions";
import {balances, config} from "./config";
import {coinConvertsionPair, conversionCurrencyPair, hasCurrencyComparator} from "./utils";

export interface CryptoProps {
}

const tickerBuffer: RateMap = {};

export default function CryptoPage(props: CryptoProps) {
    const allCoinNames = [...config.coins, config.baseConversionCoin];
    const [currentRates, setCurrentRates] = useState<RateMap>({});
    const [rateHistory, setRateHistory] = useState<RateHistory>(allCoinNames.reduce((h, c) => {
        return {
            ...h,
            [c]: new FixedLengthQueue<number>(config.historyLength)
        }
    }, {}));

    const onTickerUpdate = (rate: Rate) => {
        tickerBuffer[rate.symbol.toLowerCase()] = rate.price;
    }

    const toCurrency = (symbols: SymbolPair, currency: ConversionCurrency): number => {
        if (hasCurrencyComparator(symbols, currency)) {
            return currentRates[symbols];
        }

        const baseRate = currentRates[conversionCurrencyPair(config) as SymbolPair];
        return baseRate * currentRates[symbols];
    }

    const getBalance = (symbPair: SymbolPair): number => {
        const numCurrency = toCurrency(symbPair, config.conversionCurrency);
        const secondToken = hasCurrencyComparator(symbPair, config.conversionCurrency) ? config.conversionCurrency : config.baseConversionCoin;
        const firstToken = symbPair.substring(0, symbPair.length - secondToken.length);
        return balances[firstToken] * numCurrency;
    }

    const updateHistory = (rates: RateMap) => {
        allCoinNames.forEach(c => {
            const symbolPair = c === config.baseConversionCoin ? conversionCurrencyPair(config) : coinConvertsionPair(c, config);
            const rate = rates[symbolPair] || rateHistory[c].data[rateHistory[c].length - 1];
            rateHistory[c].push(rate || 0);
        });
    }


    useEffect(() => {
        const ws = setupTickerStream(config.coins, config.conversionCurrency, onTickerUpdate);

        const interval = setInterval(() => {
            if (Object.keys(tickerBuffer).length === 0) {
                return;
            }
            const rates = {...tickerBuffer};
            setCurrentRates(rates);
            updateHistory(rates)
        }, config.updateFrequency);
        return () => {
            clearInterval(interval);
            ws.close();
        }
    }, [config.conversionCurrency])

    const haveRates = !(Object.keys(currentRates).length === 0 && currentRates.constructor === Object)
    const haveConverter = haveRates && currentRates[conversionCurrencyPair(config)] !== undefined;
    return <div>
        <ul>
            {haveConverter && Object.keys(currentRates)
                .sort()
                .map((symbPair: SymbolPair) =>
                    <li key={`rate_${symbPair}_${config.conversionCurrency}`}><strong>{symbPair}: </strong>
                        {getBalance(symbPair).toFixed(2)}</li>
                )}
        </ul>
    </div>
}