import React, {useEffect, useState} from "react";
import {KasaDeviceMap} from "./models";
import {Alert, AlertTitle} from '@material-ui/lab';
import {Grid, Paper} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import KasaDeviceUi from "./device";
import {fetchAllDevices, toggleDeviceOnOff, updateDevice} from "./actions";

export interface KasaControllerProps {
    serverHost: string,
    updateFreq: number
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));


export default function KasaUi(props: KasaControllerProps) {
    const classes = useStyles();

    const [devices, setDevices] = useState<KasaDeviceMap | null>(null);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        fetchAllDevices(props.serverHost, null, setDevices, setError);
        const interval = setInterval(() => {
            fetchAllDevices(props.serverHost, interval, setDevices, setError);
        }, props.updateFreq * 1000);
        return () => clearInterval(interval);
    }, [props.serverHost, props.updateFreq]);

    const toggleOnOff = async (deviceName: string) => {
        if (!devices || !devices[deviceName]) {
            throw Error("Could not find device named: " + deviceName);
        }
        await toggleDeviceOnOff(props.serverHost, deviceName, devices[deviceName], setError)
        updateDevice(props.serverHost, deviceName, devices, setDevices, setError)
    }

    return <React.Fragment>
        <p>TP-Link Kasa Controller</p>

        {error &&
        <Grid container spacing={4}>
            <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                <p>{error}</p>
            </Alert>
        </Grid>}

        <Grid container spacing={3}>
            {devices && Object.entries(devices)
                .map(([name, data]) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={`device_${name}`}>
                        <Paper className={classes.paper}>
                            <KasaDeviceUi name={name} device={data} toggleOnOff={toggleOnOff}/>
                        </Paper>
                    </Grid>
                ))}
        </Grid>
    </React.Fragment>
};