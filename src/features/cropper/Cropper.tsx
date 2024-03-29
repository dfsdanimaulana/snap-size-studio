import React, { useState, useRef, type ReactNode } from 'react'

import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop, convertToPixelCrop } from 'react-image-crop'
import {
    BoxSelect,
    Circle,
    CircleDashed,
    ImageDown,
    ImagePlus,
    Loader2,
    Square,
} from 'lucide-react'

import type { ImageType, AspectRatio } from '@/type'

import { canvasPreview } from './canvasPreview'
import { useDebounceEffect } from '@/hooks/useDebounceEffect'

import 'react-image-crop/dist/ReactCrop.css'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import { SelectImageType } from '@/components/ui/select-image-type'
import { CropInputOption } from './CropInputOption'
import { CropSwitchOption } from './CropSwitchOption'
import { Slider } from '@/components/ui/slider'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from '@/components/ui/select'

// This is to demonstrate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
    // check which one is greater width or height
    let width = 0
    if (mediaWidth / aspect > mediaHeight) {
        width = mediaHeight * aspect
    } else {
        width = mediaWidth
    }

    return centerCrop(
        makeAspectCrop(
            {
                unit: 'px',
                width,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    )
}

const aspectRatioValues: Record<AspectRatio, number | undefined> = {
    custom: undefined,
    custom_circle: undefined,
    square: 1,
    circle: 1,
    landscape: 5 / 4,
    portrait: 4 / 5,
    horizontal: 16 / 9,
    vertical: 9 / 16,
    grid: 1.91 / 1,
    header: 3 / 1,
    board: 20 / 9,
    cover: 4 / 1,
    pint: 2 / 3,
}

export default function Cropper() {
    const [imgSrc, setImgSrc] = useState('')
    const [imgType, setImgType] = useState<ImageType>('image/png')
    const previewCanvasRef = useRef<HTMLCanvasElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const hiddenAnchorRef = useRef<HTMLAnchorElement>(null)
    const blobUrlRef = useRef('')
    const [crop, setCrop] = useState<Crop>()
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
    const [scale, setScale] = useState(1)
    const [rotate, setRotate] = useState(0)
    const [aspect, setAspect] = useState<number | undefined>(1)
    const [circularCrop, setCircularCrop] = useState(false)
    const [flip, setFlip] = useState({ horizontal: false, vertical: false })
    const [isLoading, setIsLoading] = useState(false)
    const [chosenAspect, setChosenAspect] = useState<AspectRatio>('square')
    const [quality, setQuality] = useState(100)

    function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0]

            setImgType(selectedFile.type as ImageType)

            setCrop(undefined) // Makes crop preview update between images.
            const reader = new FileReader()
            reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''))
            reader.readAsDataURL(selectedFile)
        }
    }

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        if (aspect) {
            const { width, height } = e.currentTarget
            setCrop(centerAspectCrop(width, height, aspect))
        }
    }

    async function onDownloadCropClick() {
        setIsLoading(true)
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

        ctx.drawImage(previewCanvas, 0, 0, previewCanvas.width, previewCanvas.height, 0, 0, offscreen.width, offscreen.height)

        // You might want { type: "image/jpeg", quality: <0 to 1> } to
        // reduce image size
        const blob = await offscreen.convertToBlob({
            type: imgType,
            quality: quality / 100,
        })

        if (blobUrlRef.current) {
            URL.revokeObjectURL(blobUrlRef.current)
        }
        blobUrlRef.current = URL.createObjectURL(blob)
        hiddenAnchorRef.current!.href = blobUrlRef.current
        hiddenAnchorRef.current!.click()
        setIsLoading(false)
    }

    useDebounceEffect(
        async () => {
            if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
                // We use canvasPreview as it's much faster than imgPreview.
                canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop, scale, rotate, flip, circularCrop)
            }
        },
        100,
        [completedCrop, scale, rotate, flip],
    )

    function handleToggleAspectClick(value: AspectRatio) {
        const resetTransformations = () => {
            setScale(1)
            setRotate(0)
            setFlip({ horizontal: false, vertical: false })
        }

        const setAspectAndCrop = (aspect: number | undefined) => {
            setAspect(aspect)

            if (aspect === undefined) return

            if (imgRef.current) {
                const { width, height } = imgRef.current
                const newCrop = centerAspectCrop(width, height, aspect)
                setCrop(newCrop)
                setCompletedCrop(convertToPixelCrop(newCrop, width, height))
            }
        }

        setCircularCrop(value === 'circle' || value === 'custom_circle')

        if (value === 'circle' || value === 'custom_circle') resetTransformations()

        setAspectAndCrop(aspectRatioValues[value])
    }

    function handleCropWidthChange(e: React.ChangeEvent<HTMLInputElement>) {
        let { value } = e.target

        if (Number(value) < 0) value = '0'

        if (imgRef.current && Number(value) > imgRef.current?.width) {
            value = imgRef.current?.width.toString()
        }

        setCrop({ ...crop, width: Number(value) } as Crop)
    }
    function handleCropHeightChange(e: React.ChangeEvent<HTMLInputElement>) {
        let { value } = e.target

        if (Number(value) < 0) value = '0'

        if (imgRef.current && Number(value) > imgRef.current?.height) {
            value = imgRef.current?.height.toString()
        }

        setCrop({ ...crop, height: Number(value) } as Crop)
    }
    function handleCropXChange(e: React.ChangeEvent<HTMLInputElement>) {
        let { value } = e.target

        if (Number(value) < 0) value = '0'

        if (crop && imgRef.current && Number(value) + crop?.width > imgRef.current?.width) {
            value = (imgRef.current?.width - crop?.width).toString()
        }

        setCrop({ ...crop, x: Number(value) } as Crop)
    }
    function handleCropYChange(e: React.ChangeEvent<HTMLInputElement>) {
        let { value } = e.target

        if (Number(value) < 0) value = '0'

        if (crop && imgRef.current && Number(value) + crop?.height > imgRef.current?.height) {
            value = (imgRef.current?.height - crop?.height).toString()
        }

        setCrop({ ...crop, y: Number(value) } as Crop)
    }

    function setAspectRatio(value: string) {
        const aspect = value.split(':')[1] as AspectRatio

        setChosenAspect(aspect)
        handleToggleAspectClick(aspect)
    }

    function aspectButton(asp: AspectRatio, icon: ReactNode, tooltipText: string) {
        const handleClick = () => {
            setChosenAspect(asp)
            handleToggleAspectClick(asp)
        }

        return (
            <Tooltip key={asp}>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className={asp === chosenAspect ? 'border border-slate-900 dark:border-white/80' : ''}
                        onClick={handleClick}
                    >
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
                <div className="w-full flex flex-col items-center gap-5 justify-center">
                    <h1 className="text-5xl tracking-wide font-bold py-5">Crop IMAGE</h1>
                    <Button size="lg" onClick={() => inputRef.current?.click()}>
                        Select Image
                        <ImagePlus className="ml-3" />
                    </Button>
                    <input ref={inputRef} id="picture" type="file" accept="image/*" onChange={onSelectFile} className="hidden" />
                </div>
            )}

            {!!imgSrc && (
                <div className="flex flex-col md:flex-row h-full w-full">
                    <div className="md:basis-3/5 grid place-items-center bg-slate-200 dark:bg-slate-600 p-3 md:p-0">
                        <ReactCrop
                            crop={crop}
                            ruleOfThirds
                            onChange={(c) => setCrop(c)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={aspect}
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
                                style={{
                                    transform: `scale(${flip.horizontal ? -scale : scale},${flip.vertical ? -scale : scale}) rotate(${rotate}deg)`,
                                }}
                                onLoad={onImageLoad}
                            />
                        </ReactCrop>
                    </div>
                    <div className="md:basis-2/5 flex flex-col gap-5 px-5 text-center bg-slate-100 dark:bg-slate-700">
                        <h2 className="text-2xl font-bold mt-3">Crop Options</h2>
                        <Separator />
                        <div className="flex-1 flex flex-col">
                            <div className="flex mb-7">
                                <div className="basis-1/2 px-3 flex flex-col gap-2">
                                    <CropInputOption
                                        id="width-crop-input"
                                        label="Width (px)"
                                        value={Math.round(crop?.width ?? 0)}
                                        onChange={handleCropWidthChange}
                                    />
                                    <CropInputOption
                                        id="height-crop-input"
                                        label="Height (px)"
                                        value={Math.round(crop?.height ?? 0)}
                                        onChange={handleCropHeightChange}
                                    />
                                    <CropInputOption
                                        id="x-crop-input"
                                        label="Position X (px)"
                                        value={Math.round(crop?.x ?? 0)}
                                        onChange={handleCropXChange}
                                    />
                                    <CropInputOption
                                        id="y-crop-input"
                                        label="Position Y (px)"
                                        value={Math.round(crop?.y ?? 0)}
                                        onChange={handleCropYChange}
                                    />
                                </div>
                                <div className="basis-1/2 px-3 flex flex-col gap-2">
                                    <CropInputOption
                                        id="scale-input"
                                        label="Scale:"
                                        value={scale}
                                        disabled={!imgSrc || circularCrop}
                                        onChange={(e) => setScale(Number(e.target.value))}
                                        step="0.1"
                                    />
                                    <CropInputOption
                                        id="rotate-input"
                                        label="Rotate:"
                                        value={rotate}
                                        disabled={!imgSrc || circularCrop}
                                        onChange={(e) => setRotate(Math.min(180, Math.max(-180, Number(e.target.value))))}
                                    />
                                    <CropSwitchOption
                                        id="flip-horizontal"
                                        label="Flip X"
                                        checked={flip.horizontal}
                                        disabled={circularCrop}
                                        onCheckedChange={(checked) => setFlip({ horizontal: checked, vertical: flip.vertical })}
                                    />
                                    <CropSwitchOption
                                        id="flip-vertical"
                                        label="Flip Y"
                                        checked={flip.vertical}
                                        disabled={circularCrop}
                                        onCheckedChange={(checked) => setFlip({ horizontal: flip.horizontal, vertical: checked })}
                                    />
                                </div>
                            </div>
                            <div className="px-3 mb-5 hidden">
                                <div className="flex items-center gap-3">
                                    <Label htmlFor="rotate-input" className="text-md flex mb-2 basis-2/5">
                                        Image Quality:
                                    </Label>
                                    <Slider
                                        defaultValue={[quality]}
                                        min={10}
                                        max={100}
                                        step={1}
                                        disabled={!['image/jpg', 'image/jpeg'].includes(imgType)}
                                        className="basis-3/5"
                                        onValueChange={(value) => setQuality(value[0])}
                                    />
                                    {`${quality}%`}
                                </div>
                                <div className="flex justify-end">
                                    <span className="italic text-xs text-slate-400">
                                        Change image type to JPEG/JPG to reduce image quality
                                    </span>
                                </div>
                            </div>
                            <div className="px-3">
                                <Label htmlFor="rotate-input" className="text-md flex mb-2">
                                    Aspect Ratio:{' '}
                                </Label>

                                <div className="flex flex-col md:flex-row md:items-center justify-center gap-3 md:gap-1 md:gap-5">
                                    <div className="flex items-center justify-around md:basis-2/5">
                                        {aspectButton('square', <Square />, '1 / 1')}
                                        {aspectButton('custom', <BoxSelect />, 'Custom Rectangle')}
                                        {aspectButton('circle', <Circle />, 'Circle')}
                                        {aspectButton('custom_circle', <CircleDashed />, 'Custom Circle')}
                                    </div>
                                    <div className="flex md:basis-3/5">
                                        <Select onValueChange={setAspectRatio}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Other Aspect Ratio" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Aspect Ratio</SelectLabel>
                                                    <SelectItem value="fa:square">Facebook Profile Picture (1:1)</SelectItem>
                                                    <SelectItem value="fa:horizontal">Facebook Cover Photo (16:9)</SelectItem>
                                                    <SelectItem value="ins:square">Instagram Profile Picture (1:1)</SelectItem>
                                                    <SelectItem value="ins:grid">Instagram Post Grid (1.91:1)</SelectItem>
                                                    <SelectItem value="ins:portrait">Instagram Post Portrait (4:5)</SelectItem>
                                                    <SelectItem value="ins:vertical">Instagram Story (9:16)</SelectItem>
                                                    <SelectItem value="twit:square">Twitter Profile Picture (1:1)</SelectItem>
                                                    <SelectItem value="twit:header">Twitter Header Photo (3:1)</SelectItem>
                                                    <SelectItem value="link:square">LinkedIn Profile Picture (1:1)</SelectItem>
                                                    <SelectItem value="link:cover">LinkedIn Cover Photo (4:1)</SelectItem>
                                                    <SelectItem value="link:grid">LinkedIn Link Preview (1.91:1)</SelectItem>
                                                    <SelectItem value="link:horizontal">LinkedIn Post (16:9)</SelectItem>
                                                    <SelectItem value="pint:pint">Pinterest Pin (2:3)</SelectItem>
                                                    <SelectItem value="pint:board">Pinterest Board Cover (20:9)</SelectItem>
                                                    <SelectItem value="ytc:horizontal">YouTube Channel Cover (16:9)</SelectItem>
                                                    <SelectItem value="ytt:horizontal">YouTube Video Thumbnail (16:9)</SelectItem>
                                                    <SelectItem value="snap:vertical">Snapchat Story (9:16)</SelectItem>
                                                    <SelectItem value="tik:square">TikTok Profile Picture (1:1)</SelectItem>
                                                    <SelectItem value="tik:vertical">TikTok Video (9:16)</SelectItem>
                                                    <SelectItem value="wa:square">WhatsApp Profile Picture (1:1)</SelectItem>
                                                    <SelectItem value="tmb:square">Tumblr Profile Picture (1:1)</SelectItem>
                                                    <SelectItem value="tmb:horizontal">Tumblr Post (16:9)</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />
                        <div className="flex items-center justify-center gap-3 pb-5">
                            {isLoading ? (
                                <Button disabled size="lg" className="text-lg">
                                    <Loader2 className="mr-2 animate-spin" />
                                    Please wait
                                </Button>
                            ) : (
                                <Button onClick={onDownloadCropClick} size="lg" className="text-lg">
                                    Download Crop
                                    <ImageDown className="ml-3" />
                                </Button>
                            )}
                            <SelectImageType imgType={imgType} setImgType={setImgType} />
                            <a href="#hidden" ref={hiddenAnchorRef} download className="hidden">
                                Hidden download
                            </a>
                        </div>
                    </div>
                    {!!completedCrop && (
                        <div className="hidden items-center justify-center p-3">
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
                    )}
                </div>
            )}
        </>
    )
}
