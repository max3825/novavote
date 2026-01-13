'use client'

interface Step {
  id: number
  title: string
  description: string
}

interface ProgressStepsProps {
  steps: Step[]
  currentStep: number
}

export function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id
          const isCompleted = currentStep > step.id
          const isLast = index === steps.length - 1

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center relative">
                {/* Circle */}
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300
                    ${
                      isCompleted
                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/50'
                        : isActive
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50 animate-pulse'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>

                {/* Labels */}
                <div className="mt-3 text-center">
                  <p
                    className={`text-sm font-semibold ${
                      isActive || isCompleted
                        ? 'text-slate-900 dark:text-slate-100'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div className="flex-1 h-1 mx-4 mb-12 relative">
                  <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                  <div
                    className={`absolute inset-0 rounded-full transition-all duration-500 ${
                      isCompleted ? 'bg-green-500 w-full' : 'w-0'
                    }`}
                  ></div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
