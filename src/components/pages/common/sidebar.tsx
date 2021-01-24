import clsx from "clsx";
import IconButton from "@material-ui/core/IconButton";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Drawer from "@material-ui/core/Drawer";
import React, {MouseEventHandler} from "react";
import {useTheme} from "@material-ui/core/styles";
import {useStyles} from "../monitorStyles";
import {Routes} from "../../../routes";
import {Link} from "react-router-dom";


interface SideBarProps {
    onDrawerClose: MouseEventHandler,
    drawerWidth: number,
    open: boolean,
    routes: Routes
}

const SideBar: React.FunctionComponent<SideBarProps> = props => {
    const classes = useStyles({drawerWidth: props.drawerWidth});
    const theme = useTheme();

    return <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
            [classes.drawerOpen]: props.open,
            [classes.drawerClose]: !props.open,
        })}
        classes={{
            paper: clsx({
                [classes.drawerOpen]: props.open,
                [classes.drawerClose]: !props.open,
            }),
        }}
    >
        <div className={classes.toolbar}>
            <IconButton onClick={props.onDrawerClose}>
                {theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
            </IconButton>
        </div>
        <Divider/>
        <List>
            {props.routes && props.routes.map(route => {
                const IconComponent = route.icon;
                return (
                    <ListItem button component={Link} to={route.url} key={`sidebar_link_${route.url}`}>
                        <ListItemIcon><IconComponent/></ListItemIcon>
                        <ListItemText primary={route.name}/>
                    </ListItem>)
            })}
        </List>
        <Divider/>
    </Drawer>
}

export default SideBar;