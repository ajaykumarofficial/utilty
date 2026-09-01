import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useLogout } from '@/services/authService'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'

export function DashboardPage() {
  const { user } = useSelector((state: RootState) => state.auth)
  const logoutMutation = useLogout()

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync()
      toast.success('Logged out successfully')
    } catch (error) {
      toast.error('Logout failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Admin Portal</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">{user?.email}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                isLoading={logoutMutation.isPending}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-8 shadow">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Welcome, {user?.name}!
          </h2>
          <p className="text-gray-600">
            You are successfully authenticated. This is your dashboard.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Users', count: '1,234' },
              { title: 'Orders', count: '567' },
              { title: 'Revenue', count: '$42,500' },
            ].map((card) => (
              <div key={card.title} className="rounded-lg border border-gray-200 p-6">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {card.count}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-lg bg-blue-50 p-4">
            <p className="text-sm text-blue-900">
              ℹ️ This is a template dashboard. Replace this with your actual
              features and components.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
