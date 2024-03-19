import * as Toast from '@radix-ui/react-toast'
import { Cross2Icon } from '@radix-ui/react-icons'

interface Props {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  isTemp: number
  action: () => void
}

export function ModalTime({
  isOpen,
  setIsOpen,
  isTemp,
  action,
}: Props): JSX.Element {
  function secondsToHours(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    let formattedTime = ''
    if (hours > 0) {
      formattedTime += `${hours} hora${hours !== 1 ? 's' : ''}`
    }
    if (minutes > 0) {
      formattedTime += ` ${minutes} minuto${minutes !== 1 ? 's' : ''}`
    }
    if (remainingSeconds > 0) {
      formattedTime += ` ${remainingSeconds} segundo${remainingSeconds !== 1 ? 's' : ''}`
    }

    return formattedTime.trim()
  }
  return (
    <Toast.Provider swipeDirection="up">
      <Toast.Root
        open={isOpen}
        onOpenChange={setIsOpen}
        className="fixed top-[120px] left-1/2 transform -translate-x-1/2 bg-gray-600 rounded-lg h-28 px-6"
      >
        <Toast.Title className="mt-4 mb-2 font-medium text-slate-200 text-sm">
          Quer continuar de onde parou?
        </Toast.Title>
        <Toast.Description className="mb-2 font-mono text-slate-200 text-sm">
          Voce parou em {secondsToHours(isTemp)}
        </Toast.Description>
        <Toast.Action altText="d" className="flex gap-2">
          <button className="inline-flex items-center justify-center rounded font-medium text-xs px-[10px] leading-[25px] h-[25px] bg-black-400 text-red-text shadow-[inset_0_0_0_1px] shadow-red-text hover:shadow-[inset_0_0_0_1px] hover:shadow-green8 focus:shadow-[0_0_0_2px] focus:shadow-green8">
            Não
          </button>
          <button
            onClick={() => {
              action()
            }}
            className="inline-flex items-center justify-center rounded font-medium text-xs px-[10px] leading-[25px] h-[25px] bg-black-400 text-red-text shadow-[inset_0_0_0_1px] shadow-red-text hover:shadow-[inset_0_0_0_1px] hover:shadow-green8 focus:shadow-[0_0_0_2px] focus:shadow-green8"
          >
            Continuar
          </button>
        </Toast.Action>
        <Toast.Close>
          <button className="absolute top-[5px] right-[5px] p-1 bg-transparent rounded-md focus:outline-none">
            <Cross2Icon />
          </button>
        </Toast.Close>
      </Toast.Root>
      <Toast.Viewport className="fixed bottom-0 right-0 flex flex-col w-[390px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none" />
    </Toast.Provider>
  )
}
