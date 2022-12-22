import '../styles/globals.css'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
TimeAgo.addDefaultLocale(en)

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
