import {CoinSymbol, ConversionCurrency} from "./models";
import configData from '../../../config.json'

type BalanceMap = {
    [key: string]: number;
}
export const balances: BalanceMap = {
    "btc": 0.0020944,
    "eth": 0.02374253,
    "link": 1.33953798,
    "ltc": 0.09401399,
    "doge": 1736
}

type Config = {
    conversionCurrency: ConversionCurrency;
    baseConversionCoin: CoinSymbol;
    coins: Array<CoinSymbol>
}

function loadConfig(): Config {
    const cfg = configData.adapters.crypto;
    cfg.baseConversionCoin = cfg.baseConversionCoin.toLowerCase();
    cfg.conversionCurrency = cfg.conversionCurrency.toLowerCase();
    cfg.coins = cfg.coins.map(c => c.toLowerCase());
    return cfg as Config;
}

export const config: Config = loadConfig();