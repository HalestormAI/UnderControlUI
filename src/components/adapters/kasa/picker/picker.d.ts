///<reference path="./picker.jsx" />
import {Component} from "react";
import {ColorChangeHandler, ColorPickerProps, HSLColor} from "react-color";

type HSVColor = { h: number, s: number, v: number }

interface HueSatPickerProps extends ColorPickerProps<typeof HueSatPicker> {
    color: HSLColor
    onChange: ColorChangeHandler;
}

export function hsl2hsv(hsl: HSLColor): HSVColor;

export default class HueSatPicker extends Component<HueSatPickerProps> {
}

export type {HSVColor};