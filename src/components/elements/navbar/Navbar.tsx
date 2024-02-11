import { Link } from 'react-router-dom'
import { ModeToggle } from '@/components/mode-toggle'
import DesktopMenu from './DesktopMenu'
import MobileMenu from './MobileMenu'
import { Button } from '@/components/ui/button'
import { Github } from 'lucide-react'

export default function Navbar() {
    return (
        <div className="flex items-center justify-between bg-background p-3 md:p-5 font-bold text-xl md:text-2xl shadow-md z-50">
            <div className="flex items-center gap-3">
                <img src="/logo.png" alt="logo" className="w-10 h-10 rounded-md" />
                <h1>
                    <Link to="/">SnapSizeStudio</Link>
                </h1>
            </div>
            <DesktopMenu />
            <div className="flex items-center gap-3">
                <Button size="icon" variant="outline" asChild>
                    <a href="https://github.com/dfsdanimaulana/snap-size-studio" target="_blank">
                        <Github />
                    </a>
                </Button>
                <ModeToggle />
                <MobileMenu />
            </div>
        </div>
    )
}
