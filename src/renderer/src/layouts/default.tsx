import { Outlet } from 'react-router-dom'
import { Header } from '../components/Header/Header'
import { IsUpdatedAppReponse } from './../../../shared/types/ipc-types'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
// import { shell } from 'electron'

interface UpdatedAppLatestProps {
  latestVersion: string
  onClose: (isOpen: boolean) => void
  link: string
}

function UpdatedAppLatest({
  latestVersion,
  onClose,
  link,
}: UpdatedAppLatestProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-black-700 opacity-85 p-6 rounded-lg shadow-lg border-black-500 border-[0.5px]">
        <div className="text-xl font-semibold mb-4">
          Nova versão disponível!
        </div>
        <div className="mb-4">
          A versão {latestVersion} está disponível. Deseja baixar agora?
        </div>
        <div className="flex justify-end">
          <button
            className="px-4 py-2 mr-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => onClose(false)}
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              window.open(link, '_black')
              onClose(false)
            }}
            className="flex px-2 py-2 bg-red-text text-white rounded hover:bg-red-900"
          >
            Baixar
          </button>
        </div>
      </div>
    </div>
  )
}

export function Default(): JSX.Element {
  const [isUpdatedAppOpen, setIsUpdatedAppOpen] = useState(false)

  const { data } = useQuery({
    queryKey: ['updatedApp'],
    queryFn: async (): Promise<IsUpdatedAppReponse> => {
      const response = await window.api.isAppUpdated()
      if (response.isUpdate) setIsUpdatedAppOpen(true)
      return response
    },
    refetchOnWindowFocus: false,
  })

  return (
    <div className="flex-1 flex flex-col max-h-screen">
      <Header />
      {data &&
        data.isUpdate &&
        data.link &&
        isUpdatedAppOpen &&
        data.version && (
          <UpdatedAppLatest
            latestVersion={data.version}
            link={data.link}
            onClose={() => setIsUpdatedAppOpen(false)}
            key="updated_app"
          />
        )}
      <Outlet />
    </div>
  )
}
