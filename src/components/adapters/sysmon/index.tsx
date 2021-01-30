import React, {useEffect} from 'react';
import {StatInfo} from './models';
import {BasicColourSpec, CpuStatsUI, DiskStatsUI, MemStatsUI} from './subcomponents'
import {connectSocket, disconnectSocket} from "./socket-connection";
import {Socket} from "socket.io-client/build/socket";
import {Grid, Paper} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

interface SysMonUIProps {
    serverHost: string,
}

const circleWidth = 150;

const cpuColour: BasicColourSpec = {
    trailColor: "#e7e7e7",
    pathColor: "#2db8b8"
}

const memoryColour: BasicColourSpec = {
    trailColor: "#e7e7e7"
}

const diskColour: BasicColourSpec = {
    trailColor: "#e7e7e7",
    pathColor: "#e3907f"
}

const SysMonUI: React.FunctionComponent<SysMonUIProps> = props => {
    const {serverHost} = props;
    const [stats, setStats] = React.useState<StatInfo | null>(null);
    const [socket, setSocket] = React.useState<Socket | null>(null);

    useEffect(() => {
        if (socket === null) {
            const s = connectSocket(serverHost, "/stats", (stat_data: StatInfo) => {
                setStats(stat_data);
            });
            setSocket(s);
        }
        return () => {
            if (socket) {
                disconnectSocket(socket);
                setSocket(null);
            }
        };
    }, [socket, serverHost]);

    return (
        <React.Fragment>
            {stats && (
                <div><h3>{stats.system.hostname} [{stats.system.model}]</h3>
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={6}>
                            <CpuStatsUI
                                {...stats.cpu}
                                width={circleWidth}
                                colours={cpuColour}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <MemStatsUI
                                {...stats.memory.virtual}
                                width={circleWidth}
                                colours={memoryColour}
                            />
                        </Grid>
                        {stats.disk && Object.entries(stats.disk).map(([diskName, diskInfo]) =>
                            <Grid item key={`diskInfoGrid_${diskName}`} xs={12} sm={6}>
                                <DiskStatsUI
                                    {...diskInfo}
                                    diskName={diskName}
                                    width={circleWidth}
                                    colours={diskColour}
                                />
                            </Grid>)}
                    </Grid>
                </div>
            )}
        </React.Fragment>
    )
}


export interface MonitorPageProps {
    urls?: string[]
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

export default function MonitorPage(props: MonitorPageProps) {
    const classes = useStyles();

    return (
        <Grid container spacing={3}>
            {props.urls && props.urls.map((url: string) => (

                <Grid item xs={12} md={6} lg={4} key={`monitorPage_${url}`}>
                    <Paper className={classes.paper}>
                        <SysMonUI serverHost={url}/>
                    </Paper>
                </Grid>

            ))}
        </Grid>)

}