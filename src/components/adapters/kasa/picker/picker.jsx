import React, {useState} from "react";
import {Hue, Saturation} from "react-color/lib/components/common";
import {CustomPicker} from "react-color";
import ChromePointer from "react-color/lib/components/chrome/ChromePointer";
import ChromePointerCircle from "react-color/lib/components/chrome/ChromePointerCircle";
import {makeStyles} from "@material-ui/core/styles";
import PickerSwatch from "../swatch";
import {hslToHsv, hsvToHsl} from "../colour-convert";

export const customPickerSwatchName = "customPicker";

const useStyles = makeStyles({
    colour: {
        width: '36px',
        height: '14px',
        borderRadius: '2px',
        background: colour => `hsla(${colour.h}, ${Math.round(100 * colour.s)}%, ${Math.round(100 * colour.l)}%, 1)`,
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
    },
    saturationContainer: {
        height: 100,
        width: '75%',
        margin: '5px auto',
        position: 'relative',
        borderRadius: 1,
        background: '#fff',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
    },
    hueContainer: {
        height: 12,
        width: '75%',
        margin: 'auto',
        position: 'relative',
        borderRadius: 1,
        background: '#fff',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
    }
});

function HueSatPicker(props) {
    // const [show, setShow] = useState(false);

    const [colour, setColour] = useState(props.bulbColour);

    const classes = useStyles(colour);
    const hsv = hslToHsv(colour);

    const onChange = (c) => {
        // The hue bar sends NaN for the luminance value, so we'll read it from the existing colour.
        if (c.hasOwnProperty('l') && !isNaN(c.l)) {
            setColour(c);
        } else if (c.hasOwnProperty('l')) {
            setColour({
                ...c,
                l: colour.l
            });
        } else {
            setColour(hsvToHsl(c));
        }
        props.onChange(c);
    }

    const isActive = props.activeSetting === customPickerSwatchName;

    return <div>
        <PickerSwatch
            onClick={() => props.onSetCustomActive(customPickerSwatchName, colour)}
            hsl={colour}
            text="Custom"
            buttonName={customPickerSwatchName}
            isActive={isActive}/>
        {isActive && <React.Fragment>
            <div className={classes.saturationContainer}>
                <Saturation hsv={hsv} hsl={colour} onChange={onChange} pointer={ChromePointerCircle}/>
            </div>
            <div className={classes.hueContainer}>
                <Hue hsl={colour} onChange={onChange} pointer={ChromePointer}/>
            </div>
        </React.Fragment>
        }
    </div>

}

export default CustomPicker(HueSatPicker)