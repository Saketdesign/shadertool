
"use client"

import React, { useCallback, useRef, useState } from "react"
import { Upload, FileImage } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
    onImageSelect: (file: File) => void
    currentImage?: string | null
    className?: string
}

export function ImageUpload({ onImageSelect, currentImage, className }: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            setIsDragging(false)
            const file = e.dataTransfer.files[0]
            if (file && file.type.startsWith("image/")) {
                onImageSelect(file)
            }
        },
        [onImageSelect]
    )

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0]
            if (file) {
                onImageSelect(file)
            }
        },
        [onImageSelect]
    )

    const triggerSelect = () => {
        fileInputRef.current?.click()
    }

    return (
        <div
            className={cn(
                "relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-colors cursor-pointer p-8 text-center",
                isDragging
                    ? "border-primary bg-primary/10"
                    : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
                className
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerSelect}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleChange}
                accept="image/*"
                className="hidden"
            />

            {currentImage ? (
                // In a real app we might show a preview or just the text "Change Image" on hover
                <div className="flex flex-col items-center gap-2">
                    <FileImage className="w-10 h-10 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click or drop to replace image</p>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-2">
                    <Upload className="w-10 h-10 text-muted-foreground" />
                    <p className="text-sm font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground">Supports PNG, JPG, WEBP</p>
                </div>
            )}
        </div>
    )
}
