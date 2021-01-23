import React from 'react';
import './App.css';
import clsx from 'clsx';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MonitorPage from "./components/pages/monitor";
import SideBar from "./components/pages/common/sidebar";
import {useStyles} from "./components/pages/monitorStyles";

const drawerWidth = 240;


const urls = [
    "http://192.168.1.126:7653",
    "http://192.168.1.202:7653"
];

function App() {
    const classes = useStyles({drawerWidth});
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <div className="App">
            <div className={classes.root}>
                <CssBaseline/>
                <AppBar
                    position="fixed"
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: open,
                    })}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            className={clsx(classes.menuButton, {
                                [classes.hide]: open,
                            })}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="h6" noWrap>
                            Mini variant drawer
                        </Typography>
                    </Toolbar>
                </AppBar>
                <SideBar onDrawerClose={handleDrawerClose} drawerWidth={drawerWidth} open={open}/>
                <main className={classes.content}>
                    <div className={classes.toolbar}/>
                    <MonitorPage urls={urls}/>
                </main>
            </div>
        </div>
    );
}

export default App;
