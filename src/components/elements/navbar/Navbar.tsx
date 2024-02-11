import { Link } from 'react-router-dom'
import { ModeToggle } from '@/components/mode-toggle'
import DesktopMenu from './DesktopMenu'
import MobileMenu from './MobileMenu'
import { Button } from '@/components/ui/button'
import { Github, Mail } from 'lucide-react'

export default function Navbar() {
    return (
        <div className="flex items-center justify-between text-slate-800 dark:text-slate-300 bg-background p-3 md:p-5 font-bold text-xl md:text-2xl shadow-md z-50">
            <div className="flex items-center gap-3">
                <img src="/logo-sm.webp" alt="logo" className="w-10 h-10 rounded-md" />
                <h1>
                    <Link to="/">SnapSizeStudio</Link>
                </h1>
            </div>
            <DesktopMenu />
            <div className="hidden md:flex items-center gap-3">
                <Button size="icon" variant="outline" asChild>
                    <a
                        href="mailto:danimaulana9f@gmail.com?subject=Hello%20Dani%20Maulana%20i%20like%20your%20website%20SnapSizeStudio"
                        target="_blank"
                        aria-label="Send me an email"
                    >
                        <Mail />
                    </a>
                </Button>
                <Button size="icon" variant="outline" asChild>
                    <a href="https://github.com/dfsdanimaulana/snap-size-studio" target="_blank" aria-label="Visit my GitHub">
                        <Github />
                    </a>
                </Button>
                <ModeToggle />
            </div>
            <MobileMenu />
        </div>
    )
}
