import React, {useEffect} from 'react';
import {StatInfo} from './reponse-types';
import {CpuStatsUI} from './subcomponents'
import connectSocket from "./socket-connection.";

interface SysMonUIProps {
    fetch_url: string,
}

const SysMonUI: React.FunctionComponent<SysMonUIProps> = props => {
    const {fetch_url} = props;
    const [stats, setStats] = React.useState<StatInfo | null>(null);

    useEffect(() => {
        connectSocket(fetch_url, "/stats", (stat_data: StatInfo) => {
            setStats(stat_data);
        });
    }, [fetch_url]);

    return (
        <React.Fragment>
            <h2>Fetching from {fetch_url}.</h2>
            {stats && (
                <div><h3>{stats.system.model}</h3>
                    <CpuStatsUI
                        perc={stats.cpu.perc}
                        freq={stats.cpu.freq}
                        temp={stats.cpu.temp}/>
                </div>
            )}
        </React.Fragment>
    )
}

export default SysMonUI;