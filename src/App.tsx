import React from 'react';
import './App.css';
import clsx from 'clsx';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SideBar from './components/pages/common/sidebar';
import {useStyles} from './components/pages/common/sidebar-styles';
import {BrowserRouter as Router, Route,} from "react-router-dom";
import pages from './pages'

const drawerWidth = 240;


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
        <Router>
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
                                Under Control
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <SideBar onDrawerClose={handleDrawerClose} drawerWidth={drawerWidth} open={open} pages={pages}/>
                    <main className={classes.content}>
                        <div className={classes.toolbar}/>
                        {pages.map((route) => {
                            const PageComponent = route.component;
                            return <Route exact path={route.url} key={`route_${route.url}`}>
                                <PageComponent {...route.props} />
                            </Route>
                        })}
                    </main>
                </div>
            </div>
        </Router>)
}

export default App;
