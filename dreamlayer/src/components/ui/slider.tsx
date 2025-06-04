"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps {
    value?: number[]
    defaultValue?: number[]
    className?: string
    min?: number
    max?: number
    step?: number
    onValueChange?: (value: number[]) => void
}

type SliderPropsWithHTMLProps = SliderProps & Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'value' | 'onChange'>

const Slider = React.forwardRef<HTMLDivElement, SliderPropsWithHTMLProps>(
    ({ className, min = 0, max = 100, step = 1, value, defaultValue, onValueChange, ...props }, ref) => {
        const [values, setValues] = React.useState<number[]>(value || defaultValue || [min])
        const trackRef = React.useRef<HTMLDivElement>(null)
        const thumbRefs = React.useRef<(HTMLDivElement | null)[]>([])

        React.useEffect(() => {
            if (value !== undefined) {
                setValues(value)
            }
        }, [value])

        const handleTrackClick = (event: React.MouseEvent<HTMLDivElement>) => {
            if (!trackRef.current) return
            const trackRect = trackRef.current.getBoundingClientRect()
            const percent = (event.clientX - trackRect.left) / trackRect.width
            const newValue = min + Math.round((max - min) * percent / step) * step
            const clampedValue = Math.max(min, Math.min(max, newValue))

            const newValues = [...values]
            newValues[0] = clampedValue

            setValues(newValues)
            onValueChange?.(newValues)
        }

        const handleThumbDrag = (index: number) => {
            const thumbEl = thumbRefs.current[index]
            if (!thumbEl || !trackRef.current) return

            const trackRect = trackRef.current.getBoundingClientRect()

            const handleMove = (event: MouseEvent) => {
                const percent = (event.clientX - trackRect.left) / trackRect.width
                const newValue = min + Math.round((max - min) * percent / step) * step
                const clampedValue = Math.max(min, Math.min(max, newValue))

                const newValues = [...values]
                newValues[index] = clampedValue

                setValues(newValues)
                onValueChange?.(newValues)
            }

            const handleUp = () => {
                document.removeEventListener("mousemove", handleMove)
                document.removeEventListener("mouseup", handleUp)
            }

            document.addEventListener("mousemove", handleMove)
            document.addEventListener("mouseup", handleUp)
        }

        return (
            <div
                ref={ref}
                className={cn("relative flex w-full touch-none select-none items-center", className)}
                {...props}
            >
                <div
                    ref={trackRef}
                    className="relative h-2 w-full rounded-full bg-neutral-800" // <== Stronger opaque track
                    onClick={handleTrackClick}
                >
                    <div
                        className="absolute h-full rounded-full bg-gradient-to-r from-primary to-accent" // <== Gradient-filled progress bar
                        style={{
                            width: `${((values[0] - min) / (max - min)) * 100}%`,
                        }}
                    />
                </div>
                {values.map((value, index) => (
                    <div
                        key={index}
                        ref={(el) => (thumbRefs.current[index] = el)}
                        className="absolute h-5 w-5 rounded-full border-2 border-primary shadow-lg bg-gradient-to-br from-[#0ea5e9] via-[#818cf8] to-[#9333ea] hover:scale-105 transition-transform ring-2 ring-primary/30 cursor-pointer"
                        style={{
                            left: `calc(${((value - min) / (max - min)) * 100}% - 0.5rem)`,
                        }}
                        onMouseDown={() => handleThumbDrag(index)}
                    />
                ))}
            </div>
        )
    }
)
Slider.displayName = "Slider"

export { Slider }
