import React from "react";

export interface LGTVRemotePageProps {
    text?: string
}

export default function LGTVRemotePage(props: LGTVRemotePageProps) {
    return <React.Fragment>
        <p>LGTV Remote Page TODO: {props.text}</p>
    </React.Fragment>
};