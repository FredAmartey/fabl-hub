'use client'

import { motion } from 'framer-motion'

interface BarData {
  label: string
  value: number
  color?: string
}

interface BarChartProps {
  data: BarData[]
  height?: number
  showValues?: boolean
  horizontal?: boolean
  gradient?: boolean
}

export default function BarChart({
  data,
  height = 300,
  showValues = true,
  horizontal = false,
  gradient = true,
}: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value))

  if (horizontal) {
    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="w-24 text-sm text-gray-400 text-right flex-shrink-0">
              {item.label}
            </div>
            <div className="flex-1 relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(item.value / maxValue) * 100}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`h-8 rounded-lg relative overflow-hidden ${
                  gradient
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500'
                    : item.color || 'bg-purple-500'
                }`}
                style={!gradient && item.color ? { backgroundColor: item.color } : {}}
              >
                {showValues && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium">
                    {item.value >= 1000000
                      ? `${(item.value / 1000000).toFixed(1)}M`
                      : item.value >= 1000
                      ? `${(item.value / 1000).toFixed(0)}K`
                      : item.value}
                  </span>
                )}
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div style={{ height }} className="relative">
      <div className="flex items-end justify-between h-full gap-4">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center justify-end">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(item.value / maxValue) * (height - 60)}px` }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`w-full rounded-t-lg relative overflow-hidden ${
                gradient
                  ? 'bg-gradient-to-t from-purple-500 to-blue-500'
                  : item.color || 'bg-purple-500'
              }`}
              style={!gradient && item.color ? { backgroundColor: item.color } : {}}
            >
              {showValues && (
                <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap">
                  {item.value >= 1000000
                    ? `${(item.value / 1000000).toFixed(1)}M`
                    : item.value >= 1000
                    ? `${(item.value / 1000).toFixed(0)}K`
                    : item.value}
                </span>
              )}
            </motion.div>
            <div className="mt-2 text-xs text-gray-400 text-center whitespace-nowrap">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}