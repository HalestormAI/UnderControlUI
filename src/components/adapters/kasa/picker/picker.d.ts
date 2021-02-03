///<reference path="./picker.jsx" />
import {Component} from "react";
import {ColorChangeHandler, ColorPickerProps, HSLColor} from "react-color";
import {ActiveSettingName} from "../models";

type HSVColor = { h: number, s: number, v: number }

interface HueSatPickerProps extends ColorPickerProps<typeof HueSatPicker> {
    bulbColour: HSLColor
    onChange: ColorChangeHandler;
    activeSetting: ActiveSettingName;
    onSetCustomActive: (customName: ActiveSettingName, colour: HSLColor) => void;
}

export default class HueSatPicker extends Component<HueSatPickerProps> {
}

export const customPickerSwatchName: ActiveSettingName;

export type {HSVColor};