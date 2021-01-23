import SysMonUI from "../adapters/sysmon";
import React from "react";
import {Grid, Paper} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";


interface MonitorPageProps {
    urls: string[]
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
            {props.urls.map((url: string) => (

                <Grid item xs={4} key={`monitorPage_${url}`}>
                    <Paper className={classes.paper}>
                        <SysMonUI fetch_url={url}/>
                    </Paper>
                </Grid>

            ))}
        </Grid>)

}