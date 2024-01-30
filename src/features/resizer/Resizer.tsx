import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'

import { Loader2 } from 'lucide-react'

import { SelectImageType } from '@/components/ui/select-image-type'

type ImageType = 'image/png' | 'image/jpeg' | 'image/jpg' | 'image/webp' | 'image/gif'

export default function Resizer() {
    const [imgSrc, setImgSrc] = useState('')
    const [imgType, setImgType] = useState<ImageType>('image/png')
    const imgRef = useRef<HTMLImageElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const [isLoading, setIsLoading] = useState(false)
    
    function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0]

            setImgType(selectedFile.type as ImageType)

            const reader = new FileReader()
            reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''))
            reader.readAsDataURL(selectedFile)
        }
    }
    
    function onDownloadResizeClick() {}
    
    return (
        <>
            {!imgSrc && (
                <div className="w-full flex flex-col items-center gap-5 justify-center">
                    <h1 className="text-5xl tracking-wide font-bold py-5">Resize IMAGE</h1>
                    <Button size="lg" onClick={() => inputRef.current?.click()}>
                        Select Image
                    </Button>
                    <input ref={inputRef} id="picture" type="file" accept="image/*" onChange={onSelectFile} className="hidden" />
                </div>
            )}
            {!!imgSrc && (
              <div className="flex flex-col md:flex-row w-full h-full">
                <div className="md:basis-3/5 grid place-items-center bg-slate-200 dark:bg-slate-600 p-3 md:p-0">
                  <img src={imgSrc} className="w-full h-auto"/>
                </div>
                <div className="md:basis-2/5 flex flex-col gap-5 px-5 text-center bg-slate-100 dark:bg-slate-700">
                  <div className="flex items-center justify-center gap-3 pb-5">
                      {isLoading ? (
                          <Button disabled size="lg" className="text-lg">
                              <Loader2 className="mr-2 animate-spin" />
                              Please wait
                          </Button>
                      ) : (
                          <Button onClick={onDownloadResizeClick} size="lg" className="text-lg">
                              Download Crop
                          </Button>
                      )}
                      <SelectImageType imgType={imageType} setImgType={setImgType} />
                      <a href="#hidden" ref={hiddenAnchorRef} download className="hidden">
                          Hidden download
                      </a>
                  </div>
                </div>
              </div>
            )}
        </>
      )
}