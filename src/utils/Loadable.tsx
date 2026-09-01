import { Suspense, ComponentType, ReactNode } from 'react'
import { Loader } from 'lucide-react'

/**
 * HOC for lazy loading components with suspense
 * Usage: const LazyPage = Loadable(MyPage)
 */
function Loadable(
  Component: ComponentType<any>,
  fallback: ReactNode = (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-sm text-gray-600">Loading...</p>
      </div>
    </div>
  )
) {
  return (props: any) => (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  )
}

export default Loadable
