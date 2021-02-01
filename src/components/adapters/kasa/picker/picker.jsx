import React from "react";
import {Hue, Saturation} from "react-color/lib/components/common";
import {CustomPicker} from "react-color";

// Thanks as ever to wikipedia: https://en.wikipedia.org/wiki/HSL_and_HSV#HSL_to_HSV
const hsl2hsv = (hsl) => {
    const v = hsl.l + hsl.s * Math.min(hsl.l, 1 - hsl.l);
    const s = v === 0 ? 0 : 2 * (1 - hsl.l / v);
    return {
        h: hsl.h,
        s,
        v
    }
}

function HueSatPicker(props) {
    const {color, onChange, onChangeComplete} = props;

    const hsv = hsl2hsv(color);

    return <div>
        <div style={{height: 100, width: '75%', margin: 'auto', position: 'relative'}}>
            <Saturation hsv={hsv} hsl={color} onChange={onChange} onChangeComplete={onChangeComplete}/>
        </div>
        <div style={{height: 12, width: '75%', margin: 'auto', position: 'relative'}}>
            <Hue hsl={color} onChange={onChange} onChangeComplete={onChangeComplete}/>
        </div>
    </div>

}

export default CustomPicker(HueSatPicker)