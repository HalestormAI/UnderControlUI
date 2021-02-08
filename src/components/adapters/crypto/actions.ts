import {CoinSymbol, ConversionCurrency, RateTickerMessage, TickerUpdateCallback} from "./models";
import {config} from "./config";
import {coinConversionPair, conversionCurrencyPair} from "./utils";

export function setupTickerStream(symbols: Array<CoinSymbol>, currency: ConversionCurrency, onUpdate: TickerUpdateCallback) {
    const url = 'wss://stream.binance.com:9443/ws/stream';
    const ws = new WebSocket(url);

    const tickers = [`${conversionCurrencyPair(config)}@ticker`];
    symbols.forEach(symbol => tickers.push(`${coinConversionPair(symbol, config)}@ticker`));

    ws.onopen = function (event) {
        console.log("open: ", event);
        ws.send(JSON.stringify({
            "method": "SUBSCRIBE",
            "params": tickers,
            "combined": true,
            "id": 1
        }))
    }
    //
    ws.onclose = function (event) {
        console.log("close:", event);
    }

    ws.onmessage = function (event) {
        const message: RateTickerMessage = JSON.parse(event.data);
        if (message.s === undefined) {
            return;
        }
        onUpdate({
            symbol: message.s,
            price: parseFloat(message.c)
        });
    }

    return ws;
}