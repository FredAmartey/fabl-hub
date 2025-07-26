'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface DonutData {
  label: string
  value: number
  color: string
}

interface DonutChartProps {
  data: DonutData[]
  size?: number
  thickness?: number
  showLabels?: boolean
  animate?: boolean
}

export default function DonutChart({
  data,
  size = 200,
  thickness = 40,
  showLabels = true,
  animate = true,
}: DonutChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size for retina displays
    canvas.width = size * window.devicePixelRatio
    canvas.height = size * window.devicePixelRatio
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Clear canvas
    ctx.clearRect(0, 0, size, size)

    // Calculate total
    const total = data.reduce((sum, item) => sum + item.value, 0)
    if (total === 0) return

    // Center and radius
    const centerX = size / 2
    const centerY = size / 2
    const outerRadius = (size - 20) / 2
    const innerRadius = outerRadius - thickness

    // Draw segments
    let currentAngle = -Math.PI / 2 // Start at top

    data.forEach((item, index) => {
      const percentage = item.value / total
      const endAngle = currentAngle + (percentage * Math.PI * 2)

      // Draw segment
      ctx.beginPath()
      ctx.arc(centerX, centerY, outerRadius, currentAngle, endAngle)
      ctx.arc(centerX, centerY, innerRadius, endAngle, currentAngle, true)
      ctx.closePath()
      ctx.fillStyle = item.color
      ctx.fill()

      // Add gap between segments
      ctx.strokeStyle = '#0f0a1e'
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw label if enabled
      if (showLabels && percentage > 0.05) {
        const labelAngle = currentAngle + (endAngle - currentAngle) / 2
        const labelX = centerX + Math.cos(labelAngle) * (outerRadius + 30)
        const labelY = centerY + Math.sin(labelAngle) * (outerRadius + 30)

        // Draw connecting line
        ctx.beginPath()
        ctx.moveTo(
          centerX + Math.cos(labelAngle) * outerRadius,
          centerY + Math.sin(labelAngle) * outerRadius
        )
        ctx.lineTo(
          centerX + Math.cos(labelAngle) * (outerRadius + 15),
          centerY + Math.sin(labelAngle) * (outerRadius + 15)
        )
        ctx.strokeStyle = item.color + '60'
        ctx.lineWidth = 1
        ctx.stroke()

        // Draw label text
        ctx.fillStyle = '#d1d5db'
        ctx.font = '12px Inter'
        ctx.textAlign = labelAngle > Math.PI / 2 && labelAngle < 3 * Math.PI / 2 ? 'right' : 'left'
        ctx.textBaseline = 'middle'
        ctx.fillText(
          `${item.label} (${Math.round(percentage * 100)}%)`,
          labelX,
          labelY
        )
      }

      currentAngle = endAngle
    })

    // Draw center text
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 24px Inter'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(total.toLocaleString(), centerX, centerY - 10)
    
    ctx.fillStyle = '#9ca3af'
    ctx.font = '14px Inter'
    ctx.fillText('Total', centerX, centerY + 15)
  }, [data, size, thickness, showLabels])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative inline-block"
    >
      <canvas ref={canvasRef} />
    </motion.div>
  )
}