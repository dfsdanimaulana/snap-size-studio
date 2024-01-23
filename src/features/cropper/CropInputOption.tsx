import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { ChangeEvent } from 'react'

interface CustomInputProps {
    id: string
    label: string
    value: number
    onChange: (event: ChangeEvent<HTMLInputElement>) => void
    disabled?: boolean
    step?: string
}

export const CropInputOption: React.FC<CustomInputProps> = ({ id, label, value, onChange, disabled = false, step = '1' }) => (
    <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-md">
            {label}
        </Label>
        <Input id={id} type="number" step={step} value={value} onChange={onChange} disabled={disabled} className="w-[80px]" />
    </div>
)
