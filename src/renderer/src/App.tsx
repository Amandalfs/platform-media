import { ThemeProvider } from 'next-themes'
import { Routes } from './Route'
import './index.css'
import { Theme } from '@radix-ui/themes'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/reactQuery'

function App(): JSX.Element {
  return (
    <ThemeProvider attribute="class">
      <Theme
        appearance="dark"
        accentColor="crimson"
        scaling="90%"
        hasBackground={true}
        grayColor="sand"
      >
        <QueryClientProvider client={queryClient}>
          <Routes />
        </QueryClientProvider>
      </Theme>
    </ThemeProvider>
  )
}

export default App
