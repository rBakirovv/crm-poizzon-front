import Head from "next/head";
import Order from "../../components/Order/Order";
import Header from "../../components/UI/Header/Header";

export default function Home() {
  return (
    <>
      <Head>
        <title>#17253 LiNing CF — купить в POIZZON</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />
      <Order />
    </>
  );
}
