export interface KasaSysInfo {
    latitude: number;
    longitude: number;
    model: string;
    err_code: number;
    dev_name: string;
}

export type TimeStat = {
    year: number;
    month: number;
    day: number;
    energy: number;
}

export type TimeStatList = Array<TimeStat>;

export type KasaBulbLightState = {
    index: number;
    hue: number;
    saturation: number;
    color_temp: number;
    brightness: number;
}

export interface KasaBulbSysInfo {
    light_state: {
        on_off: boolean;
        is_dimmable: boolean;
        is_color: boolean;
        is_variable_color_temp: boolean;
        preferred_state: Array<KasaBulbLightState>
    }
}

export interface KasaEmeter {
    get_realtime: {
        current: number;
        voltage: number;
        power: number;
        total: number;
        err_code: number;
    }
    get_monthstat: {
        month_list: TimeStatList
        err_code: number;
    }
    get_daystat: {
        day_list: TimeStatList;
        err_code: number;
    }
}

export interface KasaResponse {
    host: string;
    emeter_type: string;
    _last_update: {
        system: {
            get_sysinfo: KasaSysInfo;
            emeter?: KasaEmeter
        }
    };
    _sys_info: KasaSysInfo;

}