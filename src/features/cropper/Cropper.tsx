import React, { useState, useRef, ChangeEvent } from 'react'
import ReactCrop, { type Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { getResizedImage } from 'react-image-size'

const Cropper: React.FC = () => {
  const [src, setSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState<Crop>({ aspect: 1 })
  const [croppedImage, setCroppedImage] = useState<string | null>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)

  const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setSrc(event.target?.result as string)
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const onImageLoaded = (image: HTMLImageElement) => {
    console.log("Image loaded")
    imageRef.current = image
  }

  const getCroppedImg = async (image: HTMLImageElement, crop: Crop) => {
    console.log("Get cropped image")
    const resizedImage = await getResizedImage(image.src, crop.width as number, crop.height as number)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    canvas.width = crop.width as number
    canvas.height = crop.height as number

    ctx?.drawImage(
      resizedImage,
      crop.x as number,
      crop.y as number,
      crop.width as number,
      crop.height as number,
      0,
      0,
      crop.width as number,
      crop.height as number
    )

    return new Promise<string>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(URL.createObjectURL(blob))
      }, 'image/jpeg')
    })
  }

  const onCropComplete = async (crop: Crop) => {
    console.log("Crop completed", crop)
    console.log("imageRef.current", imageRef.current)
    if (imageRef.current && crop.width && crop.height) {
      const croppedImageUrl = await getCroppedImg(imageRef.current, crop)
      setCroppedImage(croppedImageUrl)
    }
  }
  
  const downloadCroppedImage = () => {
    console.log("Image download")
    if (croppedImage) {
      const link = document.createElement('a')
      link.href = croppedImage
      link.download = 'cropped-image.jpg'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div>
      <input type="file" accept="image/*" onChange={onSelectFile} />
      {src ? (
        <div>
          <ReactCrop
            crop={crop}
            onImageLoaded={onImageLoaded}
            onComplete={onCropComplete}
            onChange={(newCrop) => setCrop(newCrop)}
          >
            <img src={src} alt="Cropped" style={{ maxWidth: '100%' }} />
          </ReactCrop>
          {croppedImage && (
            <div>
              <h2>Preview:</h2>
              <img src={croppedImage} alt="Cropped" style={{ maxWidth: '100%' }} />
              <button onClick={downloadCroppedImage}>Download Cropped Image</button>
            </div>
          )}
        </div>
      ) : (
          <div>No Image</div>
        )}
    </div>
  )
}

export default Cropper