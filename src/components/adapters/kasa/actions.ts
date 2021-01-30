import {HSL, hslToColourSpec, isOn, KasaDevice, KasaDeviceMap} from "./models";

export const fetchAllDevices = (url: string, currentInterval: NodeJS.Timeout | null, setDevices: CallableFunction, setError: CallableFunction) => {
    setError(null);
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw Error("Could not update device list. Server error:\n" + response.statusText)
            }
            return response.json();
        })
        .then((response: KasaDeviceMap) => {
            setDevices(response);
        })
        .catch(error => {
            setError(error.toString());
            setDevices(null);
            if (currentInterval != null) {
                clearTimeout(currentInterval);
            }
        })
}

export const updateDevice = (url: string, deviceName: string, devices: KasaDeviceMap | null, setDevices: CallableFunction, setError: CallableFunction) => {
    if (deviceName === undefined || !deviceName) {
        fetchAllDevices(url, null, setDevices, setError);
        return;
    }

    const deviceUri = `${url}/${deviceName}`;
    setError(null);
    fetch(deviceUri)
        .then(response => {
            if (!response.ok) {
                throw Error(`Could not update device list. [${response.status} ${response.statusText}]`)
            }
            return response.json();
        })
        .then((response: KasaDevice) => {
            setDevices({
                ...devices,
                [deviceName]: response
            });
        })
        .catch(error => {
            setError(error.toString());
        })
}

export const toggleDeviceOnOff = (url: string, deviceName: string, device: KasaDevice, setError: CallableFunction | null) => {
    const onOrOff = isOn(device) ? "off" : "on";
    const deviceUri = `${url}/${deviceName}/${onOrOff}`;
    return fetch(deviceUri, {method: "PUT"})
        .then(response => {
            if (!response.ok) {
                throw Error(`Could not toggle device on/off. [${response.status} ${response.statusText}]`)
            }
            return response.json();
        })
        .then((response: { message: string }) => {
            console.debug("Toggled device on/off: ", response.message);
        })
        .catch(error => {
            setError && setError(error.toString());
        });
}

export const setDeviceColour = (colour: HSL, url: string, deviceName: string, device: KasaDevice, setError: CallableFunction | null) => {
    const colourSpec = hslToColourSpec(colour);
    const deviceUri = `${url}/${deviceName}/colour/${colourSpec}`;
    return fetch(deviceUri, {method: "PUT"})
        .then(response => {
            if (!response.ok) {
                throw Error(`Could not set device colour to ${colourSpec}. [${response.status} ${response.statusText}]`)
            }
            return response.json();
        })
        .then((response: { message: string }) => {
            console.debug("Changed device colour: ", response.message);
        })
        .catch(error => {
            setError && setError(error.toString());
        });
}