import React from "react";
import {Button} from "@material-ui/core";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {HSLColor} from "react-color";
import {ActiveSettingName} from "./models";

type PickerSwatchProps = {
    hsl: HSLColor;
    buttonName: ActiveSettingName;
    isActive: boolean;
    onClick: (buttonName: ActiveSettingName) => void;
    text?: string;
}

const useStyles = makeStyles<Theme, PickerSwatchProps>(() => ({
    colour: {
        width: '36px',
        height: '14px',
        borderRadius: '2px',
        background: props => `hsla(${props.hsl.h}, ${Math.round(100 * props.hsl.s)}%, ${Math.round(100 * props.hsl.l)}%, 1)`,
        display: 'inline-block',
        marginRight: '5px'
    },
    swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
        marginBottom: '5px',
    }
}));

export default function Swatch(props: PickerSwatchProps) {
    const classes = useStyles(props);
    return <Button variant={props.isActive ? "contained" : "outlined"} onClick={() => props.onClick(props.buttonName)}
                   color="primary">
        <div className={classes.colour}/>
        {props.text}
    </Button>
}