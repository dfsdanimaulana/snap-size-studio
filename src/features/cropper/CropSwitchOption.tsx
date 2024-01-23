import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import React from 'react'

interface CustomInputProps {
    id: string
    label: string
    checked: boolean
    onCheckedChange: (checked: boolean) => void
}

export const CropSwitchOption: React.FC<CustomInputProps> = ({ id, label, checked, onCheckedChange }) => (
    <div className="flex items-center justify-between mt-3">
        <Label htmlFor={id} className="text-md">
            {label}
        </Label>
        <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} className="mr-3" />
    </div>
)
