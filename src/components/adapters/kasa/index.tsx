import React from "react";

const serverHost = 'http://127.0.0.1:7654/kasa'

export interface KasaControllerProps {
    kasaText?: string
}


export default function KasaUi(props: KasaControllerProps) {

    return <React.Fragment>
        <p>Kasa Controller Page TODO: {props.kasaText}</p>
    </React.Fragment>
};