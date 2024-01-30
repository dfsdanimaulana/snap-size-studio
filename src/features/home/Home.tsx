import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export default function Home() {
    return (
        <div className="flex flex-col gap-10 items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold">Welcome to SnapSizeStudio</h1>
            <p className="text-xl">
                Your Go-To for Easy Image Cropping and Resizing! Elevate your photos in just a few clicks. Let simplicity meet creativity!
            </p>
            <div className="flex items-center gap-5">
                <Button size="lg" asChild>
                    <Link to="/cropper">Cropper</Link>
                </Button>
                {/* <Button size="lg" asChild>
                    <Link to="/resizer">Resizer</Link>
                </Button> */}
            </div>
        </div>
    )
}
