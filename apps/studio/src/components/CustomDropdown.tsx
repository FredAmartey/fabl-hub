'use client'

import { useState } from 'react'

interface DropdownOption {
  value: string
  label: string
  icon?: string
}

interface CustomDropdownProps {
  options: DropdownOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function CustomDropdown({ options, value, onChange, placeholder }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const selectedOption = options.find(option => option.value === value)

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      {/* Gradient glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur-lg opacity-10"></div>
      
      {/* Dropdown trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-full p-3 bg-white/80 backdrop-blur-xl border border-white/50 rounded-xl text-left font-medium text-gray-900 focus:ring-2 focus:ring-purple-300 focus:border-purple-300 focus:outline-none transition-all"
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            {selectedOption ? (
              <>
                {selectedOption.icon && <span>{selectedOption.icon}</span>}
                {selectedOption.label}
              </>
            ) : (
              <span className="text-gray-500">{placeholder || 'Select option...'}</span>
            )}
          </span>
          <svg 
            className={`w-5 h-5 text-purple-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-[100]" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute z-[110] w-full mt-2">
            {/* Gradient glow for menu */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur-lg opacity-20"></div>
            
            <div className="relative bg-white/90 backdrop-blur-xl border border-white/50 rounded-xl shadow-2xl overflow-hidden">
              <div className="max-h-60 overflow-y-auto">
                {options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left font-medium text-gray-900 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 transition-all focus:outline-none focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50"
                  >
                    {option.icon && <span className="text-lg">{option.icon}</span>}
                    <span>{option.label}</span>
                    {option.value === value && (
                      <span className="ml-auto text-purple-600">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}