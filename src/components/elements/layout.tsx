import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './navbar'
import Footer from './footer'

export default function Layout() {
    useEffect(() => {
        if (import.meta.env.DEV && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            import('eruda')
                .then((eruda) => {
                    // @ts-expect-error
                    eruda.init()
                })
                .catch((error) => {
                    console.error('Error loading eruda:', error)
                })
        }
    }, [])

    return (
        <>
            <div className="min-h-screen md:h-screen flex flex-col bg-slate-100 dark:bg-slate-800 text-foreground">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <Outlet />
                </div>
                <Footer />
            </div>
        </>
    )
}
