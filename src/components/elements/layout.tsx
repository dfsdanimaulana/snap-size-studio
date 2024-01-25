import eruda from 'eruda'

import Footer from './footer'
import Navbar from './navbar'
import { Outlet } from 'react-router-dom'

export default function Layout() {
    return (
        <>
            <div className="min-h-screen md:h-screen flex flex-col bg-slate-100 dark:bg-slate-800 text-foreground">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <Outlet />
                </div>
                <Footer />
            </div>
            {import.meta.env.DEV &&
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) &&
                eruda.init()}
        </>
    )
}
