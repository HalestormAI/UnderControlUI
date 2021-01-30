import React from "react";
import {buildStyles, CircularProgressbar, CircularProgressbarWithChildren} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import {CpuInfo, DiskInfo, VirtualMemoryInfo,} from "./models";

interface BasicColourSpec {
    pathColor?: string;
    trailColor?: string;
    textColor?: string;
}

function styleBuilder(colours: BasicColourSpec | undefined) {
    if (!colours) {
        colours = {};
    }
    return buildStyles(colours)
}

function multiCpuRecursiveProgressBar(percentages: number[], colours?: BasicColourSpec, meanPerc?: number): any {

    if (percentages.length === 1) {
        return <CircularProgressbar
            value={percentages[0]}
            strokeWidth={7}
            styles={styleBuilder(colours)}
            text={`${meanPerc}%`}/>
    }

    const latestPercentage = percentages.pop() as number;
    return <CircularProgressbarWithChildren value={latestPercentage}
                                            styles={styleBuilder(colours)}>
        <div style={{width: "80%"}}>{multiCpuRecursiveProgressBar(percentages, colours, meanPerc)}</div>
    </CircularProgressbarWithChildren>
}

interface CirclePlotProps {
    width?: number;
    colours?: BasicColourSpec
}


const CpuStatsUI: React.FunctionComponent<CpuInfo & CirclePlotProps> = props => {
    const meanPerc = props.perc.reduce((acc, x) => acc + x, 0) / props.perc.length || 0;
    return <div style={{width: props.width}}>
        <h4>CPU</h4>
        {multiCpuRecursiveProgressBar([...props.perc], props.colours, meanPerc)}
        <p>Temperature: {props.temp}</p>
    </div>;
}

enum ByteUnit {
    KB = 1024,
    MB = 1024 * 1024,
    GB = 1024 * 1024 * 1024
}

const bytesDisplay = (bytes: number, unit: ByteUnit = ByteUnit.MB, precision: number = 0) => {
    const mb = bytes / unit;
    if (precision) {
        return Number(mb.toPrecision(precision));
    }
    return Math.round(mb);

}

const MemStatsUI: React.FunctionComponent<VirtualMemoryInfo & CirclePlotProps> = props => {
    return <div style={{width: props.width}}>
        <h4>Memory</h4>
        <CircularProgressbar
            value={props.percent}
            text={`${props.percent}%`}
            styles={styleBuilder(props.colours)}
            strokeWidth={7}/>
        <p>{bytesDisplay(props.available, ByteUnit.GB, 3)}GB of {bytesDisplay(props.total, ByteUnit.GB, 3)}GB free</p>
    </div>
}

interface DiskNameInterface {
    diskName: string
}

type NamedDiskInfo = DiskInfo & DiskNameInterface & CirclePlotProps;

const DiskStatsUI: React.FunctionComponent<NamedDiskInfo> = props => {
    return <div style={{width: props.width}}>
        <h4>Disk: {props.diskName}</h4>
        <CircularProgressbar
            value={props.percent}
            text={`${props.percent}%`}
            styles={styleBuilder(props.colours)}
            strokeWidth={7}/>
        <p>{}</p>
        <p>{bytesDisplay(props.free, ByteUnit.GB, 3)}GB of {bytesDisplay(props.total, ByteUnit.GB, 3)}GB free</p>
    </div>
}
export {
    CpuStatsUI,
    MemStatsUI,
    DiskStatsUI
};
export type {BasicColourSpec};
