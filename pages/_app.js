import '../styles/globals.css'
import { Provider } from 'next-auth/client'
import {AuthProvider} from '../components/context/AuthContext'

function MyApp({ Component, pageProps }) {
  return (
  <AuthProvider>
    <Provider session={pageProps.session}>
   <Component {...pageProps} />
  </Provider>
  </AuthProvider>
  )
}

export default MyApp
