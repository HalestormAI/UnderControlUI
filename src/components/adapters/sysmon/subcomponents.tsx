import React from "react";
import {
    CircularProgressbar,
    CircularProgressbarWithChildren,
    buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import {CpuInfo} from "./reponse-types";

function multiCpuRecursiveProgressBar(percentages: number[]): any {
    if (percentages.length == 1) {
        return <CircularProgressbar
            value={percentages[0]}
            strokeWidth={7}/>
    }

    const latestPercentage = percentages.pop() as number;
    return <CircularProgressbarWithChildren value={latestPercentage}>
        <div style={{width: "80%"}}>{multiCpuRecursiveProgressBar(percentages)}</div>
    </CircularProgressbarWithChildren>
}

const CpuStatsUI: React.FunctionComponent<CpuInfo> = props => {
    return <div style={{width: 200, height: 200}}>
        <p>{props.perc.join(", ")}</p>
        {multiCpuRecursiveProgressBar([...props.perc])}
    </div>;
}

export {
    CpuStatsUI
}