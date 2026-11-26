import { useMemo } from 'react'

interface LineWarpProps {
  width: number
  height: number
  lineCount?: number
  color?: string
  opacity?: number
  strokeWidth?: number
  className?: string
}

/**
 * A field of parallel lines sharing one smooth warp — the device from the
 * user's pinned "Bauhaus Ausstellung 1923" wave poster: every stripe is the
 * IDENTICAL waveform, just offset vertically, so the field reads as one
 * continuous flowing surface rather than independent squiggles. Two
 * low-frequency sine terms only (never a tight/noisy one) keep it a calm
 * background material, not a thing to read in its own right — the lesson
 * from the scattered-shapes/photo-collage decor it replaces in the
 * Timeline, which read as clutter rather than a composition.
 */
export default function LineWarp({
  width,
  height,
  lineCount = 16,
  color = 'var(--teal)',
  opacity = 0.1,
  strokeWidth = 2,
  className,
}: LineWarpProps) {
  const path = useMemo(() => {
    if (width <= 0 || height <= 0) return ''
    const amplitude = Math.min(height, width) * 0.07
    const steps = 48
    const points: string[] = []
    for (let s = 0; s <= steps; s++) {
      const x = (s / steps) * width
      const t = x / width
      const y =
        Math.sin(t * Math.PI * 1.5 + 0.3) * amplitude +
        Math.sin(t * Math.PI * 2.7 + 2.0) * amplitude * 0.3
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`)
    }
    return `M${points.join(' L')}`
  }, [width, height])

  if (!path) return null

  const spacing = height / (lineCount + 1)

  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {Array.from({ length: lineCount }, (_, i) => (
        <path
          key={i}
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeOpacity={opacity}
          vectorEffect="non-scaling-stroke"
          transform={`translate(0, ${(spacing * (i + 1)).toFixed(1)})`}
        />
      ))}
    </svg>
  )
}
