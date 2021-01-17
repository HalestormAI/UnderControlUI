import React from "react";
import {CpuInfo} from "./reponse-types";


const CpuStatsUI: React.FunctionComponent<CpuInfo> = props => {
    return <div>{props.perc.join(", ")}</div>;
}

export {
    CpuStatsUI
}