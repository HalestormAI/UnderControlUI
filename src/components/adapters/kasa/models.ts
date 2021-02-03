import {Color, HSLColor} from "react-color";
import {hsvToHsl, kasaColourToHSV} from "./colour-convert";

export type TimeStat = {
    year: number;
    month: number;
    day: number;
    energy: number;
}

export type TimeStatList = Array<TimeStat>;

export type KasaBulbLightStateData = {
    hue: number;
    saturation: number;
    color_temp: number;
    brightness: number;
}

export type KasaBulbPreferredState = KasaBulbLightStateData & {
    index: number;
}

export type KasaBulbLightState = KasaBulbLightStateData & {
    on_off: boolean;
}


interface GeneralSysInfo {
    model: string;
    alias: string;
    description: string;
    err_code: number;
    dev_name: string;
    latitude: number;
    longitude: number;
}

export type KasaBulbSysInfo = GeneralSysInfo & {
    is_dimmable: boolean;
    is_color: boolean;
    is_variable_color_temp: boolean;
    preferred_state: Array<KasaBulbPreferredState>
    light_state: KasaBulbLightState
}

export type KasaSocketSysInfo = GeneralSysInfo & {
    relay_state: boolean;
}

export type AnySysInfo = KasaSocketSysInfo | KasaBulbSysInfo;

export interface EmeterRealtime {
    current: number;
    voltage: number;
    power: number;
    total: number;
    err_code: number;
}

export interface IoTEmeterRealtime {
    power_mw: number;
    err_code: number;
}

export interface KasaEmeter<RealTimeType extends EmeterRealtime | IoTEmeterRealtime> {
    get_realtime: RealTimeType
    get_monthstat: {
        month_list: TimeStatList
        err_code: number;
    }
    get_daystat: {
        day_list: TimeStatList;
        err_code: number;
    }
}

export interface KasaDevice {
    host: string;
    emeter_type: string;
    _last_update: {
        system: {
            get_sysinfo: AnySysInfo;
            "smartlife.iot.common.emeter"?: KasaEmeter<IoTEmeterRealtime>;
            emeter?: KasaEmeter<EmeterRealtime>;
        }
    };
    _sys_info: AnySysInfo;
}

export const isBulb = (device: KasaDevice) => {
    return (device._sys_info as KasaBulbSysInfo).light_state !== undefined;
}

export const isSocket = (device: KasaDevice) => {
    return (device._sys_info as KasaSocketSysInfo).relay_state !== undefined;
}

export const isOn = (device: KasaDevice) => {
    if (isSocket(device)) {
        return (device._sys_info as KasaSocketSysInfo).relay_state;
    } else if (isBulb(device)) {
        return (device._sys_info as KasaBulbSysInfo).light_state.on_off;
    }
    throw Error("Could not determine device type for power state detection.");
}

export const currentColour = (device: KasaDevice): HSLColor => {
    const bulbInfo = device._sys_info as KasaBulbSysInfo;

    if (bulbInfo.light_state === undefined) {
        throw Error(`Attempted to get colour from a device [${device._sys_info.alias}] that does not appear to be a bulb.`);
    }

    return hsvToHsl(kasaColourToHSV(bulbInfo.light_state));
}

export type KasaDeviceMap = {
    [deviceName: string]: KasaDevice
}

type SetDeviceColourCallback = (deviceName: string, colour: Color) => void;
export type DeviceUiProps = {
    name: string;
    device: KasaDevice;
    toggleOnOff: CallableFunction;
    setDeviceColour: SetDeviceColourCallback;
}

export type ActiveSettingName = string | null;