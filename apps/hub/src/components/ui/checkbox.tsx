'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckIcon } from '@heroicons/react/24/solid'

interface CheckboxProps {
  id?: string
  name?: string
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  label?: string
  description?: string
  className?: string
}

export function Checkbox({
  id,
  name,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  label,
  description,
  className = '',
}: CheckboxProps) {
  const [isChecked, setIsChecked] = useState(defaultChecked || false)
  const finalChecked = checked !== undefined ? checked : isChecked

  const handleChange = () => {
    if (disabled) return
    const newValue = !finalChecked
    if (checked === undefined) {
      setIsChecked(newValue)
    }
    onChange?.(newValue)
  }

  return (
    <label
      htmlFor={id}
      className={`flex items-start gap-3 cursor-pointer select-none ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      <div className="relative mt-0.5">
        <input
          type="checkbox"
          id={id}
          name={name}
          checked={finalChecked}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
        />
        <motion.div
          className={`
            w-5 h-5 rounded-lg border-2 relative overflow-hidden
            ${finalChecked 
              ? 'bg-gradient-to-br from-purple-500 to-pink-500 border-transparent' 
              : 'bg-white/5 border-white/20 hover:border-white/40'
            }
            ${disabled ? '' : 'hover:scale-105 active:scale-95'}
            transition-all duration-200
          `}
          whileTap={disabled ? {} : { scale: 0.9 }}
        >
          <AnimatePresence mode="wait">
            {finalChecked && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 30,
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <CheckIcon className="w-3 h-3 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
          {!disabled && (
            <motion.div
              className="absolute inset-0 bg-white/10"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </motion.div>
      </div>
      {(label || description) && (
        <div className="flex-1">
          {label && (
            <span className="text-sm font-medium text-white/90 font-afacad">
              {label}
            </span>
          )}
          {description && (
            <p className="text-xs text-white/60 mt-0.5 font-afacad">
              {description}
            </p>
          )}
        </div>
      )}
    </label>
  )
}