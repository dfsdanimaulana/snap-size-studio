import { Button } from '@/components/ui/button'
import { Crop } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Home() {
    return (
        <div className="flex flex-col gap-10 items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold">Welcome to SnapSizeStudio</h1>
            <p className="text-xl">
                Effortless image editing. Crop and resize with precision for your creative vision. Your canvas, your rules.{' '}
            </p>
            <div className="flex items-center gap-5">
                <Button size="lg" asChild>
                    <Link to="/cropper">
                        Cropper
                        <Crop className="ml-3" />
                    </Link>
                </Button>
                {/* <Button size="lg" asChild>
                    <Link to="/resizer">Resizer</Link>
                </Button> */}
            </div>
        </div>
    )
}
