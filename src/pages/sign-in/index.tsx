import Head from 'next/head';
import Login from '../../components/Login/Login';

export default function Home() {
  return (
    <>
      <Head>
        <title>Poizzon CRM - авторизация</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Login />
    </>
  )
}
