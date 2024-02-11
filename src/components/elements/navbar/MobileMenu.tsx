import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import { AlignRight, Github, Mail } from 'lucide-react'
import { menuList } from './menuList'
import { ModeToggle } from '@/components/mode-toggle'

export default function MobileMenu() {
    return (
        <div className="block md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button size="icon" variant="outline">
                        <AlignRight />
                    </Button>
                </SheetTrigger>
                <SheetContent className="flex flex-col items-center justify-center gap-5">
                    {menuList.map((menu) => {
                        return (
                            <SheetClose key={menu.name} asChild>
                                <Button variant="link" asChild className="text-xl tracking-widest">
                                    <Link to={menu.path}>{menu.name}</Link>
                                </Button>
                            </SheetClose>
                        )
                    })}
                    <div className="flex items-center gap-3">
                        <Button size="icon" variant="outline" asChild>
                            <a
                                href="mailto:danimaulana9f@gmail.com?subject=Hello%20Dani%20Maulana%20i%20like%20your%20website%20SnapSizeStudio"
                                target="_blank"
                            >
                                <Mail />
                            </a>
                        </Button>
                        <Button size="icon" variant="outline" asChild>
                            <a href="https://github.com/dfsdanimaulana/snap-size-studio" target="_blank">
                                <Github />
                            </a>
                        </Button>
                        <ModeToggle />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}
