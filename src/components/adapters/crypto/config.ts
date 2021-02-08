import {CoinSymbol, ConversionCurrency} from "./models";
import configData from '../../../config.json'

type BalanceMap = {
    [key: string]: number;
}

type ConfigWithDefaults = {
    updateFrequency: number;
    historyLength: number;
}

export type Config = ConfigWithDefaults & {
    conversionCurrency: ConversionCurrency;
    baseConversionCoin: CoinSymbol;
    coins: Array<CoinSymbol>;
    balances: BalanceMap;
    investment?: BalanceMap
}

const defaults: ConfigWithDefaults = {
    updateFrequency: 1000,
    historyLength: 100
};

function loadConfig(): Config {
    const cfg = {
        ...defaults,
        ...configData.adapters.crypto
    };
    cfg.baseConversionCoin = cfg.baseConversionCoin.toLowerCase();
    cfg.conversionCurrency = cfg.conversionCurrency.toLowerCase();
    cfg.coins = cfg.coins.map(c => c.toLowerCase());
    return cfg as Config;
}

export const config: Config = loadConfig();