import MenuRegistry from "./menu-registry";
import BarChartIcon from "@material-ui/icons/BarChart";
import MonitorPage from "./components/adapters/sysmon";
import SettingsRemoteIcon from "@material-ui/icons/SettingsRemote";
import LGTVRemotePage from "./components/pages/lgtv-remote";
import KasaControllerPage from "./components/adapters/kasa";
import TvIcon from "@material-ui/icons/Tv";

// TODO: Load this from a config file

MenuRegistry.getInstance().register({
    url: "/",
    name: "System Stats",
    icon: BarChartIcon,
    component: MonitorPage,
    props: {
        urls: [
            "http://192.168.1.126:7653",
            // "http://192.168.1.202:7653"
        ]
    }
});

MenuRegistry.getInstance().register({
    url: "/lgtv-remote",
    name: "TV Remote",
    icon: SettingsRemoteIcon,
    component: LGTVRemotePage,
    props: {
        text: "This is some demo text."
    }
});

MenuRegistry.getInstance().register({
    url: "/kasa-controller",
    name: "Kasa Devices",
    icon: TvIcon,
    component: KasaControllerPage,
    props: {
        kasaText: "This is some demo text."
    }
})

export default MenuRegistry.getInstance().getPages();