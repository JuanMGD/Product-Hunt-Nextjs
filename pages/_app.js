import '../styles/globals.css'
import firebase, { firebaseContext } from '../firebase'
import useAutenticacion from '../hooks/useAutenticacion'

export default function App({ Component, pageProps }) {
  const usuario = useAutenticacion(); 

  return (
    <firebaseContext.Provider
      value={{
        firebase,
        usuario
      }}
    >
      <Component {...pageProps} />
    </firebaseContext.Provider>
  )
}
