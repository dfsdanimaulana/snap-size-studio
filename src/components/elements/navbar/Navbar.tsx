import { ModeToggle } from '@/components/mode-toggle'

export default function Navbar() {
    return (
        <div className="flex w-full items-center bg-white dark:bg-slate-900 justify-between p-3 md:p-5 font-bold text-xl md:text-2xl shadow-md z-50">
            <h1>SnapSizeStudio</h1>
            <ModeToggle />
        </div>
    )
}
