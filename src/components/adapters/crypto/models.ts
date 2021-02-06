export type CoinSymbol = string;
export type SymbolPair = string;
export type TickerUpdateCallback = (rate: Rate) => void;

export type ConversionCurrency = "gbp" | "usd";

export type RateMap = {
    [symbolPair: string]: number
}

export type RateHistory = {
    [symbolPair: string]: FixedLengthQueue<number>;
}

// The API gives us a bunch of floats as strings - this is to demarcate them.
type StringFloat = string;

export type RateTickerMessage = {
    "e": string
    "E": number,
    "s": SymbolPair,
    "p": StringFloat,
    "P": StringFloat,
    "w": StringFloat,
    "x": StringFloat,
    "c": StringFloat,
    "Q": StringFloat,
    "b": StringFloat,
    "B": StringFloat,
    "a": StringFloat,
    "A": StringFloat,
    "o": StringFloat,
    "h": StringFloat,
    "l": StringFloat,
    "v": StringFloat,
    "q": StringFloat,
    "O": number,
    "C": number,
    "F": number,
    "L": number,
    "n": number
}

export type Rate = {
    symbol: SymbolPair;
    price: number;
}

export class FixedLengthQueue<T> {
    private _maxLength: number;

    constructor(maxLength: number) {
        this._maxLength = maxLength;
    }

    private _data: T[] = [];

    public get data(): T[] {
        return [...this._data];
    }

    public get length(): number {
        return this._data.length;
    }

    public push(val: T): T | null {
        this._data.push(val);
        if (this._data.length > this._maxLength) {
            return this.pop() || null;
        }
        return null;
    }

    public pop(): T | undefined {
        return this._data.shift();
    }
}