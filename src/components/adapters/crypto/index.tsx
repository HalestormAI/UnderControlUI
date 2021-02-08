import React, {useEffect, useState} from 'react'
import {CoinSymbol, FixedLengthQueue, Rate, RateHistory, RateMap, SymbolPair} from "./models";
import {setupTickerStream} from "./actions";
import {config} from "./config";
import {
    coinConversionPair,
    coinsFromPair,
    conversionCurrencyPair,
    getBalanceForPair,
    getProfitForPair,
    haveAllCoins,
    minMaxHistoryRateForData
} from "./utils";
import {HorizontalGridLines, LineSeries, makeWidthFlexible, RadialChart, XAxis, XYPlot, YAxis} from 'react-vis';
import {Grid, List, ListItem} from "@material-ui/core";
import {ProfitDisplay, TotalDisplay} from "./subcomponents";

const tickerBuffer: RateMap = {};
const FlexibleXYPlot = makeWidthFlexible(XYPlot);


export default function CryptoPage() {
    const allCoinNames = [...config.coins, config.baseConversionCoin];
    const [currentRates, setCurrentRates] = useState<RateMap>({});
    const [rateHistory,] = useState<RateHistory>(allCoinNames.reduce((h, c) => {
        return {
            ...h,
            [c]: new FixedLengthQueue<number>(config.historyLength)
        }
    }, {}));

    const [totalHistory,] = useState<FixedLengthQueue<number>>(
        new FixedLengthQueue<number>(config.historyLength));

    const onTickerUpdate = (rate: Rate) => {
        tickerBuffer[rate.symbol.toLowerCase()] = rate.price;
    }

    const updateHistory = (rates: RateMap) => {
        allCoinNames.forEach(c => {
            const symbolPair: SymbolPair = c === config.baseConversionCoin ?
                conversionCurrencyPair(config) : coinConversionPair(c, config);
            const bal = getBalanceForPair(symbolPair, rates);
            const rate = bal || rateHistory[c].data[rateHistory[c].length - 1];
            if (rate) {
                rateHistory[c].push(rate);
            }
        });
    }

    useEffect(() => {
        const ws = setupTickerStream(config.coins, config.conversionCurrency, onTickerUpdate);

        const interval = setInterval(() => {
            if (Object.keys(tickerBuffer).length === 0) {
                return;
            }
            const rates = {...tickerBuffer};
            // Set the current rates for the list of coin values
            setCurrentRates(rates);

            // For each coin, if we have its rate, we'll convert to our currency (potenially via another coin if we
            // don't have a direct conversion. e.g. DOGE => BTC => GBP)
            updateHistory(rates)

            if (haveAllCoins(rates, config.coins)) {
                const currentTotal = Object.keys(rates)
                    .reduce((acc, symbPair) => {
                        const d = getBalanceForPair(symbPair, rates)
                        return acc + (d || 0)
                    }, 0);

                totalHistory.push(currentTotal);
            }
        }, config.updateFrequency);
        return () => {
            clearInterval(interval);
            ws.close();
        }
    }, [config.conversionCurrency])

    const haveRates = !(Object.keys(currentRates).length === 0 && currentRates.constructor === Object)
    const haveConverter = haveRates && currentRates[conversionCurrencyPair(config)] !== undefined;
    const haveHistory = haveRates && Object.keys(rateHistory).reduce((prev: boolean, c: CoinSymbol) => prev && rateHistory[c].length > 0, true);

    const totalInvested = config.investment ?
        Object.values(config.investment).reduce((acc, x) => acc + x, 0) : null;

    const totalValue = haveConverter ? (totalHistory.data[totalHistory.length - 1] || 0) : null;
    const totalProfit = (totalValue === null || totalInvested === null) ? null : totalValue - totalInvested;

    const investRadialData = Object.keys(config.investment || {})
        .map((key) => ({
            angle: config.investment !== undefined ? config.investment[key] : 0,
            label: key
        }));

    const valueRadialData = Object.keys(config.investment || {})
        .map((key) => {
            const symbolPair: SymbolPair = key === config.baseConversionCoin ?
                conversionCurrencyPair(config) : coinConversionPair(key, config);
            return {angle: getBalanceForPair(symbolPair, currentRates) || 0, label: key}
        });

    return <div>
        <Grid container>
            {haveConverter && <Grid item xs={12}>
                <div>
                    <TotalDisplay label="Total" value={totalValue}/> |&nbsp;
                    <TotalDisplay label="Invested" value={totalInvested}/> |&nbsp;
                    <TotalDisplay label="Profit" value={totalProfit}/>
                </div>
                <FlexibleXYPlot
                    height={200}>
                    <HorizontalGridLines/>
                    <LineSeries data={totalHistory.data.map((rate, i) => ({x: i, y: rate}))}
                                yDomain={minMaxHistoryRateForData(totalHistory.data, true)}/>
                    <XAxis
                        tickPadding={50}/>
                    <YAxis
                        tickFormat={x => x.toFixed(2)}
                        marginLeft={50}
                    />
                </FlexibleXYPlot>
            </Grid>}
            {haveHistory &&
            Object.keys(rateHistory).sort().map((coin: CoinSymbol) => {
                const plotData = rateHistory[coin].data.map((rate, i) => ({x: i, y: rate}));
                return <Grid item xs={12} md={6} lg={4} key={`rate_plot_${coin}`}>
                    <h4>{coin.toUpperCase()} to {config.conversionCurrency.toUpperCase()}</h4>
                    <FlexibleXYPlot
                        height={200}>
                        <HorizontalGridLines/>
                        <LineSeries data={plotData}
                                    yDomain={minMaxHistoryRateForData(rateHistory[coin].data, true)}/>
                        <XAxis
                            tickPadding={50}/>
                        <YAxis
                            tickFormat={x => x.toFixed(2)}
                            marginLeft={50}
                        />
                    </FlexibleXYPlot>
                </Grid>
            })}
        </Grid>
        <Grid container>
            <Grid xs={12} sm={6} md={3} item alignContent={"flex-start"}>
                <strong>Invested</strong>
                {config.investment && <RadialChart
                    data={investRadialData}
                    innerRadius={100}
                    radius={140}
                    height={300}
                    width={300}
                    showLabels={true}
                    labelsRadiusMultiplier={0.95}
                    labelsStyle={{textAlign: "center", fill: "white"}}
                    padAngle={0.04}
                />}
            </Grid>
            <Grid xs={12} sm={6} md={3} item>
                <strong>Value</strong>
                {config.investment && <RadialChart
                    data={valueRadialData}
                    innerRadius={100}
                    radius={140}
                    height={300}
                    width={300}
                    showLabels={true}
                    labelsRadiusMultiplier={0.95}
                    labelsStyle={{textAlign: "center", fill: "white"}}
                    padAngle={0.04}
                />}
            </Grid>
            <Grid xs={12} sm={6} item>
                <List>
                    {haveConverter && Object.keys(currentRates)
                        .sort()
                        .map((symbPair: SymbolPair) =>
                            <ListItem key={`rate_${symbPair}_${config.conversionCurrency}`}>
                                <strong style={{
                                    display: "inline-block",
                                    width: "4em"
                                }}>{coinsFromPair(symbPair)[0].toUpperCase()}: </strong>
                                {(getBalanceForPair(symbPair, currentRates) || -1).toFixed(2)}
                                &nbsp;({<ProfitDisplay profit={getProfitForPair(symbPair, currentRates)}/>})
                                &nbsp;{config.conversionCurrency.toUpperCase()}
                            </ListItem>
                        )}
                </List>
            </Grid>
        </Grid>
    </div>
}