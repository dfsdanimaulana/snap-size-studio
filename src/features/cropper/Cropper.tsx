import React, { useState, useRef, type ReactNode } from 'react'

import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop, convertToPixelCrop } from 'react-image-crop'
import { canvasPreview } from './canvasPreview'
import { useDebounceEffect } from '../../hooks/useDebounceEffect'

import 'react-image-crop/dist/ReactCrop.css'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { BoxSelect, Circle, RectangleHorizontal, RectangleVertical, Square } from 'lucide-react'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

// This is to demonstrate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    )
}

export default function Cropper() {
    const [imgSrc, setImgSrc] = useState('')
    const previewCanvasRef = useRef<HTMLCanvasElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const hiddenAnchorRef = useRef<HTMLAnchorElement>(null)
    const blobUrlRef = useRef('')
    const [crop, setCrop] = useState<Crop>()
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
    const [scale, setScale] = useState(1)
    const [rotate, setRotate] = useState(0)
    const [aspect, setAspect] = useState<number | undefined>(16 / 9)
    const [circularCrop, setCircularCrop] = useState(false)

    function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            setCrop(undefined) // Makes crop preview update between images.
            const reader = new FileReader()
            reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''))
            reader.readAsDataURL(e.target.files[0])
        }
    }

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        if (aspect) {
            const { width, height } = e.currentTarget
            setCrop(centerAspectCrop(width, height, aspect))
        }
    }

    async function onDownloadCropClick() {
        const image = imgRef.current
        const previewCanvas = previewCanvasRef.current
        if (!image || !previewCanvas || !completedCrop) {
            throw new Error('Crop canvas does not exist')
        }

        // This will size relative to the uploaded image
        // size. If you want to size according to what they
        // are looking at on screen, remove scaleX + scaleY
        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height

        const offscreen = new OffscreenCanvas(completedCrop.width * scaleX, completedCrop.height * scaleY)
        const ctx = offscreen.getContext('2d')
        if (!ctx) {
            throw new Error('No 2d context')
        }

        if (circularCrop) {
            ctx.save()
            // Draw the circular crop
            const centerX = offscreen.width / 2
            const centerY = offscreen.height / 2
            const radius = Math.min(centerX, centerY)
            ctx.beginPath()
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
            ctx.closePath()
            ctx.clip()
        }

        ctx.drawImage(previewCanvas, 0, 0, previewCanvas.width, previewCanvas.height, 0, 0, offscreen.width, offscreen.height)

        // Reset the clip to avoid affecting future draws

        if (circularCrop) {
            ctx.restore()
        }
        // You might want { type: "image/jpeg", quality: <0 to 1> } to
        // reduce image size
        const blob = await offscreen.convertToBlob({
            type: 'image/png',
        })

        if (blobUrlRef.current) {
            URL.revokeObjectURL(blobUrlRef.current)
        }
        blobUrlRef.current = URL.createObjectURL(blob)
        hiddenAnchorRef.current!.href = blobUrlRef.current
        hiddenAnchorRef.current!.click()
    }

    useDebounceEffect(
        async () => {
            if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
                // We use canvasPreview as it's much faster than imgPreview.
                canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop, scale, rotate)
            }
        },
        100,
        [completedCrop, scale, rotate],
    )

    type AspectRatio = 'custom' | 'square' | 'horizontal' | 'vertical' | 'circle'

    function handleToggleAspectClick(value: AspectRatio) {
        setCircularCrop(value === 'circle')

        if (value === 'custom') {
            setAspect(undefined)
        } else if (value === 'square' || value === 'circle') {
            setAspect(1 / 1)
            if (imgRef.current) {
                const { width, height } = imgRef.current

                const newCrop = centerAspectCrop(width, height, 1 / 1)
                setCrop(newCrop)
                // Updates the preview
                setCompletedCrop(convertToPixelCrop(newCrop, width, height))
            }
        } else if (value === 'horizontal') {
            setAspect(16 / 9)
            if (imgRef.current) {
                const { width, height } = imgRef.current

                const newCrop = centerAspectCrop(width, height, 16 / 9)
                setCrop(newCrop)
                // Updates the preview
                setCompletedCrop(convertToPixelCrop(newCrop, width, height))
            }
        } else if (value === 'vertical') {
            setAspect(9 / 16)
            if (imgRef.current) {
                const { width, height } = imgRef.current

                const newCrop = centerAspectCrop(width, height, 9 / 16)
                setCrop(newCrop)
                // Updates the preview
                setCompletedCrop(convertToPixelCrop(newCrop, width, height))
            }
        }
    }

    function aspectButton(aspect: AspectRatio, icon: ReactNode, tooltipText: string) {
        return (
            <Tooltip key={aspect}>
                <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => handleToggleAspectClick(aspect)}>
                        {icon}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{tooltipText}</p>
                </TooltipContent>
            </Tooltip>
        )
    }

    return (
        <>
            {!imgSrc && (
                <div className="flex flex-col items-center gap-5 justify-center h-full">
                    <h1 className="text-5xl tracking-wide font-bold py-5 text-slate-800">Crop IMAGE</h1>
                    <Button size="lg" onClick={() => inputRef.current?.click()}>
                        Select Image
                    </Button>
                    <input ref={inputRef} id="picture" type="file" accept="image/*" onChange={onSelectFile} className="hidden" />
                </div>
            )}

            {!!imgSrc && (
                <div className="flex h-full">
                    <div className="basis-3/4 flex justify-center items-center">
                        <ReactCrop
                            crop={crop}
                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={aspect}
                            // minWidth={400}
                            minHeight={100}
                            // circularCrop
                            style={{
                                maxHeight: '70vh',
                            }}
                            circularCrop={circularCrop}
                        >
                            <img
                                ref={imgRef}
                                alt="Crop me"
                                src={imgSrc}
                                className="w-full h-auto"
                                style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                                onLoad={onImageLoad}
                            />
                        </ReactCrop>
                    </div>

                    <div className="basis-1/4 flex flex-col gap-5 px-5 text-center bg-white">
                        <h2 className="text-2xl text-slate-700 font-bold py-3">Crop Options</h2>
                        <div className="flex items-center justify-between gap-3">
                            <Label htmlFor="scale-input" className="text-lg">
                                Scale:{' '}
                            </Label>
                            <Input
                                id="scale-input"
                                type="number"
                                step="0.1"
                                value={scale}
                                disabled={!imgSrc}
                                onChange={(e) => setScale(Number(e.target.value))}
                                className="w-[80px]"
                            />
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <Label htmlFor="rotate-input" className="text-lg">
                                Rotate:{' '}
                            </Label>
                            <Input
                                id="rotate-input"
                                type="number"
                                value={rotate}
                                disabled={!imgSrc}
                                onChange={(e) => setRotate(Math.min(180, Math.max(-180, Number(e.target.value))))}
                                className="w-[80px]"
                            />
                        </div>

                        <TooltipProvider>
                            <Label htmlFor="rotate-input" className="text-lg flex">
                                Aspect Ratio:{' '}
                            </Label>
                            <div className="flex items-center justify-center gap-5">
                                {aspectButton('custom', <BoxSelect />, 'Custom')}
                                {aspectButton('square', <Square />, '1 / 1')}
                                {aspectButton('horizontal', <RectangleHorizontal />, '16 / 9')}
                                {aspectButton('vertical', <RectangleVertical />, '9 / 16')}
                                {aspectButton('circle', <Circle />, 'Circle')}
                            </div>
                        </TooltipProvider>
                        <div className="mt-auto mb-5">
                            <Button onClick={onDownloadCropClick} size="lg">
                                Download Crop
                            </Button>
                            <a href="#hidden" ref={hiddenAnchorRef} download className="hidden">
                                Hidden download
                            </a>
                        </div>
                    </div>
                </div>
            )}
            {!!completedCrop && (
                <>
                    <div className="hidden">
                        <canvas
                            ref={previewCanvasRef}
                            style={{
                                border: '1px solid black',
                                objectFit: 'contain',
                                width: completedCrop.width,
                                height: completedCrop.height,
                            }}
                        />
                    </div>
                </>
            )}
        </>
    )
}
