'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline'

interface SelectOption {
  value: string
  label: string
  icon?: React.ReactNode
  description?: string
}

interface CustomSelectProps {
  options: SelectOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  label?: string
}

export function CustomSelect({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  className = '',
  label,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(defaultValue || '')
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
  const [positionCalculated, setPositionCalculated] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const finalValue = value !== undefined ? value : selectedValue

  const selectedOption = options.find(opt => opt.value === finalValue)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setPositionCalculated(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggle = () => {
    if (disabled) return
    
    if (!isOpen && buttonRef.current) {
      // Calculate position before opening
      const rect = buttonRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const spaceBelow = viewportHeight - rect.bottom - 20 // Add some margin
      const spaceAbove = rect.top - 20 // Add some margin
      const maxDropdownHeight = Math.min(options.length * 52 + 16, 280, Math.max(spaceBelow, spaceAbove) - 20) // Dynamic height based on options and available space
      
      // Position above if there's not enough space below but enough above
      const shouldPositionAbove = spaceBelow < maxDropdownHeight && spaceAbove >= maxDropdownHeight
      
      // Direction calculation can be added here if needed
      
      // For upward positioning, calculate from bottom edge
      const topPosition = shouldPositionAbove 
        ? rect.top + window.scrollY - maxDropdownHeight - 8
        : rect.bottom + window.scrollY + 8
      
      setDropdownPosition({
        top: topPosition,
        left: rect.left + window.scrollX,
        width: Math.max(rect.width, 200), // Minimum width of 200px
      })
      setPositionCalculated(true)
      setIsOpen(true)
    } else {
      setIsOpen(false)
      setPositionCalculated(false)
    }
  }

  const handleSelect = (optionValue: string) => {
    if (disabled) return
    if (value === undefined) {
      setSelectedValue(optionValue)
    }
    onChange?.(optionValue)
    setIsOpen(false)
    setPositionCalculated(false)
  }

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-white/90 mb-2 font-afacad">
          {label}
        </label>
      )}
      <motion.button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`
          w-full px-4 py-3 rounded-2xl
          bg-white/5 backdrop-blur-sm
          border border-white/20
          text-left text-sm font-afacad
          flex items-center justify-between gap-2
          transition-all duration-200
          ${disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-white/10 hover:border-white/30 cursor-pointer'
          }
          ${isOpen ? 'bg-white/10 border-white/30' : ''}
        `}
        whileTap={disabled ? {} : { scale: 0.98 }}
      >
        <div className="flex items-center gap-3 flex-1">
          {selectedOption?.icon && (
            <div className="text-white/70">{selectedOption.icon}</div>
          )}
          <span className={selectedOption ? 'text-white' : 'text-white/50'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDownIcon className="w-4 h-4 text-white/50" />
        </motion.div>
      </motion.button>

      {typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && positionCalculated && (
            <div
              className="fixed z-[9999] py-2 bg-black/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
              style={{
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
              }}
            >
              <div className="max-h-64 overflow-y-auto">
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`
                      w-full px-4 py-3 text-left
                      flex items-center gap-3
                      transition-all duration-200
                      ${option.value === finalValue 
                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white' 
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    {option.icon && (
                      <div className="text-white/70">{option.icon}</div>
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-medium font-afacad">
                        {option.label}
                      </div>
                      {option.description && (
                        <div className="text-xs text-white/60 mt-0.5 font-afacad">
                          {option.description}
                        </div>
                      )}
                    </div>
                    {option.value === finalValue && (
                      <div className="ml-auto">
                        <CheckIcon className="w-4 h-4 text-purple-400" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  )
}