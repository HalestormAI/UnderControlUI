import MenuRegistry, {PageDef} from "./menu-registry";
import BarChartIcon from "@material-ui/icons/BarChart";
import MonitorPage from "./components/adapters/sysmon";
import SettingsRemoteIcon from "@material-ui/icons/SettingsRemote";
import LGTVRemotePage from "./components/adapters/lgtv-remote";
import KasaControllerPage from "./components/adapters/kasa";
import TvIcon from "@material-ui/icons/Tv";
import CryptoPage from "./components/adapters/crypto";
import {TrendingUp} from "@material-ui/icons";


const pages: Array<PageDef<any>> = [
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
        icon: TvIcon,
        component: LGTVRemotePage,
        props: {
            serverHost: 'http://192.168.1.227:7654/lgtv'
        }
    },
    {
        url: "/kasa-controller",
        name: "Kasa Devices",
        icon: SettingsRemoteIcon,
        component: KasaControllerPage,
        props: {
            serverHost: 'http://192.168.1.227:7654/kasa',
            updateFreq: 60
        }
    },
    {
        url: "/crypto",
        name: "Crypto Values",
        icon: TrendingUp,
        component: CryptoPage,
        props: {}
    }
];

pages.forEach((page) => MenuRegistry.getInstance().register(page));

export default MenuRegistry.getInstance().getPages();