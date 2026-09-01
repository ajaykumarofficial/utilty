import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'
import { ROUTES } from '@/utils/constants'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <p className="mt-2 text-xl text-gray-600">Page not found</p>
        <p className="mt-2 text-gray-500">
          Sorry, the page you're looking for doesn't exist.
        </p>
        <Link to={ROUTES.DASHBOARD}>
          <Button className="mt-6">Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
