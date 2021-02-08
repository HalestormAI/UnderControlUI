import React, {ReactElement} from "react";
import {config} from "./config";

type TotalDisplayProps = {
    value: number | null;
    label: string
}

export const TotalDisplay = (props: TotalDisplayProps): ReactElement => {
    if (props.value === null) {
        return <React.Fragment/>;
    }
    return <React.Fragment>
        <strong>{props.label}</strong>: {props.value.toFixed(2)} {config.conversionCurrency.toUpperCase()}
    </React.Fragment>
}

export const ProfitDisplay = (props: { profit: number }): ReactElement => {
    const sign = props.profit > 0 ? "+" : "";
    const colour = props.profit > 0 ? "green" : "red";
    return <span style={{color: colour}}>
        {sign}{props.profit.toFixed(2)}
    </span>
};