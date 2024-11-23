import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Container } from 'react-bootstrap';
import Heading from '../components/shared/Heading';
import { ToastProvider } from 'react-toast-notifications';
import { Provider } from '../context';
import 'bootstrap/dist/css/bootstrap.min.css';

import TopHeader from '../components/shared/TopHeader';
import Footer from '../components/shared/Footer';

export default function App({ Component, pageProps }: AppProps) {
  return (
  <Provider>
    <Heading />
    <Container>
      <ToastProvider>
        <TopHeader />
        <Component {...pageProps} /> 
        <Footer/>
      </ToastProvider>
    </Container>

  </Provider>
  )
}
