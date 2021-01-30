import React from "react";
import {isOn, KasaDevice} from "./models";
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import {IconButton} from "@material-ui/core";

type DeviceProps = {
    name: string;
    device: KasaDevice;
    toggleOnOff: CallableFunction;
}

export default function KasaDeviceUi(props: DeviceProps) {
    return <div>
        <h4>{props.name}</h4>
        <IconButton aria-label={isOn(props.device) ? "Switch off" : "Switch on"}
                    onClick={() => props.toggleOnOff(props.name)} edge={false}>
            <PowerSettingsNewIcon htmlColor={isOn(props.device) ? "#21fc21" : "#ffe9e9"}
                                  style={{width: '80px', height: '80px'}}/>
        </IconButton>
    </div>
}