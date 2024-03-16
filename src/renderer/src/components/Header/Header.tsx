import clsx from 'clsx'
import { NavLink } from 'react-router-dom'

export function Header(): JSX.Element {
  return (
    <header className="bg-gray-800 py-4">
      <nav className="flex justify-center gap-2">
        <NavLink
          to={'/'}
          className={({ isActive }) => {
            return clsx(
              'flex items-center text-sm gap-2 text-black-100 hover:text-black-50 py-1 px-3 rounded group hover:bg-red-text',
              {
                'bg-black-700': isActive,
              },
            )
          }}
        >
          Home
        </NavLink>
        <NavLink
          to={'/series'}
          className={({ isActive }) => {
            return clsx(
              'flex items-center text-sm gap-2 text-black-100 hover:text-black-50 py-1 px-3 rounded group hover:bg-red-text',
              {
                'bg-black-700': isActive,
              },
            )
          }}
        >
          Series
        </NavLink>
        <NavLink
          to={'/animes'}
          className={({ isActive }) => {
            return clsx(
              'flex items-center text-sm gap-2 text-black-100 hover:text-black-50 py-1 px-3 rounded group hover:bg-red-text',
              {
                'bg-black-700': isActive,
              },
            )
          }}
        >
          Animes
        </NavLink>
        <NavLink
          to={'/movies'}
          className={({ isActive }) => {
            return clsx(
              'flex items-center text-sm gap-2 text-black-100 hover:text-black-50 py-1 px-3 rounded group hover:bg-red-text',
              {
                'bg-black-700': isActive,
              },
            )
          }}
        >
          Filmes
        </NavLink>
        <NavLink
          to={'/register'}
          className={({ isActive }) => {
            return clsx(
              'flex items-center text-sm gap-2 text-black-100 hover:text-black-50 py-1 px-3 rounded group hover:bg-red-text',
              {
                'bg-black-700': isActive,
              },
            )
          }}
        >
          Cadastrar videos
        </NavLink>
      </nav>
    </header>
  )
}
