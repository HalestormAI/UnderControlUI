import {FunctionComponent} from "react";
import MonitorPage, {MonitorPageProps} from "./components/pages/monitor";
import LGTVRemotePage, {LGTVRemotePageProps} from "./components/pages/lgtv-remote";
import KasaControllerPage, {KasaControllerProps} from "./components/pages/kasa-controller";
import {OverridableComponent} from "@material-ui/core/OverridableComponent";
import BarChartIcon from "@material-ui/icons/BarChart";
import SettingsRemoteIcon from "@material-ui/icons/SettingsRemote";
import TvIcon from "@material-ui/icons/Tv";

type PageDef<T> = {
    url: string;
    name: string;
    icon: OverridableComponent<any>;
    component: FunctionComponent<T>;
    props: T;
}

type SupportedPages = PageDef<MonitorPageProps> | PageDef<LGTVRemotePageProps> | PageDef<KasaControllerProps>;

export type Routes = Array<SupportedPages>;

const pages: Array<SupportedPages> = [
    {
        url: "/",
        name: "System Stats",
        icon: BarChartIcon,
        component: MonitorPage,
        props: {
            urls: [
                "http://192.168.1.126:7653",
                "http://192.168.1.202:7653"
            ]
        }
    },
    {
        url: "/lgtv-remote",
        name: "TV Remote",
        icon: SettingsRemoteIcon,
        component: LGTVRemotePage,
        props: {
            text: "This is some demo text."
        }
    },
    {
        url: "/kasa-controller",
        name: "Kasa Devices",
        icon: TvIcon,
        component: KasaControllerPage,
        props: {
            kasaText: "This is some demo text."
        }
    }
]

export default pages;