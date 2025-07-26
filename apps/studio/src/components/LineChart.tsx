'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface DataPoint {
  date: string
  value: number
  label?: string
}

interface LineChartProps {
  data: DataPoint[]
  height?: number
  showGrid?: boolean
  color?: string
  gradientFrom?: string
  gradientTo?: string
  animate?: boolean
}

export default function LineChart({
  data,
  height = 300,
  showGrid = true,
  color = '#9333ea',
  gradientFrom = '#9333ea',
  gradientTo = '#3b82f6',
  animate = true,
}: LineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const rect = container.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = height * window.devicePixelRatio
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${height}px`
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, height)

    if (data.length === 0) return

    // Calculate dimensions
    const padding = { top: 20, right: 20, bottom: 40, left: 50 }
    const chartWidth = rect.width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    // Find min/max values
    const values = data.map(d => d.value)
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)
    const valueRange = maxValue - minValue || 1

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = 'rgba(147, 51, 234, 0.1)'
      ctx.lineWidth = 1

      // Horizontal grid lines
      for (let i = 0; i <= 4; i++) {
        const y = padding.top + (chartHeight / 4) * i
        ctx.beginPath()
        ctx.moveTo(padding.left, y)
        ctx.lineTo(rect.width - padding.right, y)
        ctx.stroke()
      }

      // Vertical grid lines
      const xStep = chartWidth / (data.length - 1)
      for (let i = 0; i < data.length; i++) {
        const x = padding.left + xStep * i
        ctx.beginPath()
        ctx.moveTo(x, padding.top)
        ctx.lineTo(x, height - padding.bottom)
        ctx.stroke()
      }
    }

    // Draw axes
    ctx.strokeStyle = 'rgba(147, 51, 234, 0.3)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(padding.left, padding.top)
    ctx.lineTo(padding.left, height - padding.bottom)
    ctx.lineTo(rect.width - padding.right, height - padding.bottom)
    ctx.stroke()

    // Calculate points
    const points = data.map((d, i) => ({
      x: padding.left + (chartWidth / (data.length - 1)) * i,
      y: padding.top + chartHeight - ((d.value - minValue) / valueRange) * chartHeight,
      data: d,
    }))

    // Create gradient
    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom)
    gradient.addColorStop(0, gradientFrom + '40')
    gradient.addColorStop(1, gradientTo + '00')

    // Draw filled area
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.moveTo(points[0].x, height - padding.bottom)
    points.forEach(p => ctx.lineTo(p.x, p.y))
    ctx.lineTo(points[points.length - 1].x, height - padding.bottom)
    ctx.closePath()
    ctx.fill()

    // Draw line
    const lineGradient = ctx.createLinearGradient(padding.left, 0, rect.width - padding.right, 0)
    lineGradient.addColorStop(0, gradientFrom)
    lineGradient.addColorStop(1, gradientTo)
    
    ctx.strokeStyle = lineGradient
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y)
      else ctx.lineTo(p.x, p.y)
    })
    ctx.stroke()

    // Draw points
    points.forEach(p => {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2)
      ctx.fill()
      
      // Outer ring
      ctx.strokeStyle = color + '40'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2)
      ctx.stroke()
    })

    // Draw labels
    ctx.fillStyle = '#9ca3af'
    ctx.font = '12px Inter'
    ctx.textAlign = 'center'

    // X-axis labels
    points.forEach((p, i) => {
      if (i % Math.ceil(data.length / 6) === 0 || i === data.length - 1) {
        ctx.fillText(p.data.label || p.data.date, p.x, height - padding.bottom + 20)
      }
    })

    // Y-axis labels
    ctx.textAlign = 'right'
    for (let i = 0; i <= 4; i++) {
      const value = minValue + (valueRange / 4) * (4 - i)
      const y = padding.top + (chartHeight / 4) * i
      const label = value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` :
                    value >= 1000 ? `${(value / 1000).toFixed(0)}K` :
                    value.toFixed(0)
      ctx.fillText(label, padding.left - 10, y + 5)
    }
  }, [data, height, showGrid, color, gradientFrom, gradientTo])

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full"
    >
      <canvas ref={canvasRef} className="w-full" />
    </motion.div>
  )
}