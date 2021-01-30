import {FunctionComponent} from "react";
import {OverridableComponent} from "@material-ui/core/OverridableComponent";

export interface PageDef<T> {
    url: string;
    name: string;
    icon: OverridableComponent<any>;
    component: FunctionComponent<T>;
    props: T;
}

type PageMap = {
    [key: string]: PageDef<any>
}
export type PageList = Array<PageDef<any>>;

class MenuRegistry {
    private static instance: MenuRegistry;
    private readonly pages: PageMap;

    private constructor() {
        this.pages = {};
    }

    public static getInstance(): MenuRegistry {
        if (!MenuRegistry.instance) {
            MenuRegistry.instance = new MenuRegistry();
        }

        return MenuRegistry.instance;
    }

    public register(page: PageDef<any>) {
        this.pages[page.url] = page;
    }

    public deregister(page: PageDef<any>) {
        delete this.pages[page.url]
    }

    public getPages(): PageList {
        return Object.values(this.pages);
    }
}

export default MenuRegistry;