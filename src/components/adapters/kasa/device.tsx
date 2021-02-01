import React, {useEffect, useState} from "react";
import {currentColour, isBulb, isOn, KasaBulbSysInfo, KasaDevice} from "./models";
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import {IconButton} from "@material-ui/core";
import ColorPicker, {Color, ColorObject} from "react-pick-color";

type SetDeviceColourCallback = (deviceName: string, colour: ColorObject) => void;

type DeviceUiProps = {
    name: string;
    device: KasaDevice;
    toggleOnOff: CallableFunction;
    setDeviceColour: SetDeviceColourCallback;
}

function KasaBulbController(props: DeviceUiProps) {
    const [colour, setColour] = useState<Color>(currentColour(props.device))
    const bulbInfo = props.device._sys_info as KasaBulbSysInfo;

    useEffect(() => {
        setColour(currentColour(props.device));
    }, [bulbInfo.light_state])

    return <div>
        <ColorPicker color={colour} hideAlpha hideInputs onChange={(c) => {
            setColour(c.hsv);
            props.setDeviceColour(props.name, c);
        }}/>
    </div>
}

export default function KasaDeviceUi(props: DeviceUiProps) {
    return <div>
        <h4>{props.name}</h4>
        <IconButton aria-label={isOn(props.device) ? "Switch off" : "Switch on"}
                    onClick={() => props.toggleOnOff(props.name)} edge={false}>
            <PowerSettingsNewIcon htmlColor={isOn(props.device) ? "#21fc21" : "#ffe9e9"}
                                  style={{width: '80px', height: '80px'}}/>
        </IconButton>
        {isBulb(props.device) && <KasaBulbController {...props} />}
    </div>
}