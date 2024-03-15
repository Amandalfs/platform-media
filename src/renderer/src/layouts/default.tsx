import { Header } from '@renderer/components/Header/Header'
import { Outlet } from 'react-router-dom'

export function Default(): JSX.Element {
  return (
    <div className="flex-1 flex flex-col max-h-screen">
      <Header />
      <Outlet />
    </div>
  )
}
