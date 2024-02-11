import { Link } from 'react-router-dom'

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { menuList } from './menuList'

export default function DesktopMenu() {
    return (
        <div className="flex-1 hidden md:flex justify-end items-center pr-5">
            <NavigationMenu>
                <NavigationMenuList>
                    {menuList.map((menu) => {
                        return (
                            <NavigationMenuItem key={menu.name}>
                                <NavigationMenuLink
                                    className={`font-mono tracking-widest font-semibold ${navigationMenuTriggerStyle()}`}
                                    asChild
                                >
                                    <Link to={menu.path}>{menu.name}</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        )
                    })}
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    )
}
