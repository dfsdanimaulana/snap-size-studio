import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import { AlignRight } from 'lucide-react'
import { menuList } from './menuList'

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
                                <Button variant="link" asChild className="text-xl font-mono tracking-widest">
                                    <Link to={menu.path}>{menu.name}</Link>
                                </Button>
                            </SheetClose>
                        )
                    })}
                </SheetContent>
            </Sheet>
        </div>
    )
}
