import React, {ReactElement, useEffect, useState} from "react";
import {ColorResult, HSLColor} from "react-color";
import HueSatPicker, {customPickerSwatchName} from "./picker/picker";
import {colourTempToRGB, hsvToHsl, kasaColourToHSV, rgbToHsl} from "./colour-convert";
import PickerSwatch from "./swatch";
import {
    ActiveSettingName,
    currentColour,
    DeviceUiProps,
    isBulb,
    isOn,
    KasaBulbPreferredState,
    KasaBulbSysInfo
} from "./models";
import KasaPowerController from "./power-control";


type PreferredStatesOptionsProps = {
    activeSetting: ActiveSettingName;
    options: Array<KasaBulbPreferredState>;
    onClick?: (caller: ActiveSettingName, colour: HSLColor) => void;
}
// TODO: At the moment, this will convert colour temp to HSL and use that to update. This should really use the
// colour_temp endpoint.
function PreferredStatesOptions(props: PreferredStatesOptionsProps): ReactElement {
    const optionColours = props.options.map(x => {
        if (x.color_temp === 0) {
            return hsvToHsl(kasaColourToHSV(x));
        } else {
            return rgbToHsl(colourTempToRGB(x.color_temp));
        }
    })

    return <React.Fragment>
        {optionColours.map((colour, index) =>
            <PickerSwatch
                hsl={colour}
                key={`swatch_preset_${index}`}
                isActive={props.activeSetting === `preset_${index}`}
                buttonName={`preset_${index}`}
                onClick={(buttonName) => {
                    if (props.onClick) {
                        props.onClick(buttonName, colour);
                    }
                }}/>)}
    </React.Fragment>
}

function KasaBulbController(props: DeviceUiProps): ReactElement {

    const [colour, setColour] = useState<HSLColor>(currentColour(props.device));
    const [activeSetting, setActiveSetting] = useState<ActiveSettingName>(null);
    const bulbInfo = props.device._sys_info as KasaBulbSysInfo;

    useEffect(() => {
        setColour(currentColour(props.device));
    }, [props.device, bulbInfo.light_state])

    const setDeviceColour = (colour: HSLColor): void => {
        setColour(colour);
        props.setDeviceColour(props.name, colour);
    }

    const preferredStates = (props.device._sys_info as KasaBulbSysInfo).preferred_state;

    return <div>
        {preferredStates.length > 0
        && <PreferredStatesOptions
            options={preferredStates}
            activeSetting={activeSetting}
            onClick={(caller, colour) => {
                setActiveSetting(caller);
                setDeviceColour(colour);
            }}/>}

        <HueSatPicker
            bulbColour={colour}
            activeSetting={activeSetting}
            onSetCustomActive={(name, colour) => {
                setDeviceColour(colour);
                setActiveSetting(name);
            }}
            onChange={(c: ColorResult) => {
                setColour(c.hsl);
            }}
            onChangeComplete={(c: ColorResult) => {
                setDeviceColour(c.hsl);
                setActiveSetting(customPickerSwatchName);
            }}/>

    </div>
}

export default function KasaDeviceUi(props: DeviceUiProps) {
    return <div>
        <KasaPowerController {...props} type={'text-button'}/>
        {isBulb(props.device) && isOn(props.device) ? <KasaBulbController {...props}/> : ''}
    </div>
}