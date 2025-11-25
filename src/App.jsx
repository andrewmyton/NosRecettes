import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthContextProvider } from './contexts/AuthContext.jsx'
import PropTypes from 'prop-types'
import { HelmetProvider } from 'react-helmet-async'
import { io } from 'socket.io-client'

const queryClient = new QueryClient()

const socket = io(import.meta.env.VITE_SOCKET_HOST)
socket.on('connect', () => {
  console.log('connected to socket.io as', socket.id)
})
socket.on('connect_error', (err) => {
  console.error('socket.io connect error:', err)
})

export function App({ children }) {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>{children}</AuthContextProvider>
      </QueryClientProvider>
    </HelmetProvider>
  )
}

App.propTypes = {
  children: PropTypes.element.isRequired,
}
