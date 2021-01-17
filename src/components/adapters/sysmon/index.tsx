import React, {useState, useEffect} from 'react';
import {SysResponse} from './reponse-types';
import {CpuStatsUI} from './subcomponents'

interface SysMonUIProps {
    fetch_url: string,
    update_freq: number
}

interface RequestState<T> {
    status: string;
    payload: T | null;
    error?: string;
}

const SysMonUI: React.FunctionComponent<SysMonUIProps> = props => {

    const {fetch_url, update_freq} = props;

    const [response, setResponse] = React.useState<RequestState<SysResponse>>({
        status: "init",
        payload: null
    });

    const fetch_stats = (url: string, currentInterval: NodeJS.Timeout | null) => {
        fetch(url)
            .then(response => response.json())
            .then(response => {
                setResponse({
                    status: "success",
                    payload: response,
                });
            })
            .catch(error => {
                setResponse({
                    status: "error",
                    payload: null,
                    error: error.toString()
                });
                if (currentInterval != null) {
                    clearTimeout(currentInterval);
                }
            })
    }


    useEffect(() => {
        fetch_stats(fetch_url, null);
        const interval = setInterval(() => {
            fetch_stats(fetch_url, interval);
        }, update_freq * 1000);
        return () => clearInterval(interval);
    }, [fetch_url, update_freq]);

    return (
        <React.Fragment>
            <h2>Fetching from {fetch_url}.</h2>
            {response.payload && (
                <div><h3>{response.payload.stats.system.model}</h3>
                    <CpuStatsUI
                        perc={response.payload.stats.cpu.perc}
                        freq={response.payload.stats.cpu.freq}
                        temp={response.payload.stats.cpu.temp}/>
                </div>
            )}
            {response.error && (<div>Error: {response.error}</div>)}
        </React.Fragment>
    )
}

export default SysMonUI;