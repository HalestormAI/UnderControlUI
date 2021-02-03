import {Button, createMuiTheme, IconButton, MuiThemeProvider} from "@material-ui/core";
import {lightGreen, red} from "@material-ui/core/colors";
import React, {ReactElement} from "react";
import {useTheme} from "@material-ui/core/styles";
import {DeviceUiProps, isOn} from "./models";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";


type PowerControllerProps = {
    type: "large-button" | "text-button"
}

const onOffTheme = createMuiTheme({
    palette: {
        primary: lightGreen,
        secondary: red
    }
});

export default function KasaPowerController(props: DeviceUiProps & PowerControllerProps): ReactElement {
    const theme = useTheme();
    if (props.type === 'large-button') {
        return <IconButton aria-label={isOn(props.device) ? "Switch off" : "Switch on"}
                           onClick={() => props.toggleOnOff(props.name)} edge={false}>
            <PowerSettingsNewIcon
                htmlColor={isOn(props.device) ? theme.palette.success.light : theme.palette.error.light}
                style={{width: '80px', height: '80px'}}/>
        </IconButton>
    } else {
        return <MuiThemeProvider theme={onOffTheme}>
            <Button
                variant="outlined"
                color={isOn(props.device) ? 'primary' : 'secondary'}
                size="large"
                startIcon={<PowerSettingsNewIcon/>}
                onClick={() => props.toggleOnOff(props.name)}
            >
                {props.name}
            </Button>
        </MuiThemeProvider>
    }
}