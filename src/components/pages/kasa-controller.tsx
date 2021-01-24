import React from "react";

export interface KasaControllerProps {
    kasaText?: string
}

export default function KasaControllerPage(props: KasaControllerProps) {
    return <React.Fragment>
        <p>Kasa Controller Page TODO: {props.kasaText}</p>
    </React.Fragment>
};