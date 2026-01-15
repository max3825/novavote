'use client'

import { forwardRef } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface DateTimePickerProps {
  selected: Date | null
  onChange: (date: Date | null) => void
  label?: string
  minDate?: Date
  placeholder?: string
  showTimeSelect?: boolean
}

const CustomInput = forwardRef<HTMLButtonElement, any>(
  ({ value, onClick, placeholder }, ref) => (
    <button
      type="button"
      onClick={onClick}
      ref={ref}
      className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 hover:border-blue-500 dark:hover:border-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
    >
      <div className="flex items-center justify-between">
        <span className={value ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'}>
          {value || placeholder}
        </span>
        <svg className="w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </button>
  )
)

CustomInput.displayName = 'CustomInput'

export function DateTimePicker({
  selected,
  onChange,
  label,
  minDate,
  placeholder = 'Sélectionner une date et heure',
  showTimeSelect = true,
}: DateTimePickerProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <DatePicker
        selected={selected}
        onChange={onChange}
        showTimeSelect={showTimeSelect}
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="dd/MM/yyyy HH:mm"
        minDate={minDate}
        locale={fr}
        customInput={<CustomInput placeholder={placeholder} />}
        calendarClassName="!bg-white dark:!bg-slate-800 !border-slate-200 dark:!border-slate-700 !rounded-lg !shadow-xl"
        dayClassName={(date) =>
          'hover:!bg-blue-100 dark:hover:!bg-blue-900 !text-slate-900 dark:!text-slate-100 !rounded-lg'
        }
        timeClassName={() =>
          'hover:!bg-blue-100 dark:hover:!bg-blue-900 !text-slate-900 dark:!text-slate-100'
        }
      />
    </div>
  )
}
