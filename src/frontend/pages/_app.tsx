import type { AppProps } from 'next/app'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6B46C1', // CineVivid purple
    },
    secondary: {
      main: '#00A3E0', // CineVivid blue
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    h1: {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 600,
    },
    h2: {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 600,
    },
    h3: {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 600,
    },
  },
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}