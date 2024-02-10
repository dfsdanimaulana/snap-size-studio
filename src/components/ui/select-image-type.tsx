import React from 'react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from './select'
import { ImageType } from '@/type'

interface SelectImageTypeProps {
    imgType: ImageType
    setImgType: (value: ImageType) => void
}

const SelectImageType: React.FC<SelectImageTypeProps> = ({ imgType, setImgType }) => {
    return (
        <Select onValueChange={(value) => setImgType(value as ImageType)} defaultValue={imgType}>
            <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="PNG" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Image Type</SelectLabel>
                    <SelectItem value="image/png">PNG</SelectItem>
                    <SelectItem value="image/jpg">JPG</SelectItem>
                    <SelectItem value="image/jpeg">JPEG</SelectItem>
                    <SelectItem value="image/webp">WEBP</SelectItem>
                    {/* <SelectItem value="image/gif">GIF</SelectItem> */}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

export { SelectImageType }
