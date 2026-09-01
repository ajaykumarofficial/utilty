import { Loader } from 'lucide-react'
import { cn } from '@/utils/helpers'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

export function LoadingSpinner({
  size = 'md',
  className,
  text,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Loader
        className={cn('animate-spin text-blue-500', sizeClasses[size], className)}
      />
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  )
}

export default LoadingSpinner
