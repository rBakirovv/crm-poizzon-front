import Head from "next/head";
import { NextPage } from "next";
import Order from "../../components/Order/Order";
import Header from "../../components/UI/Header/Header";
import { IOrder } from "../../types/interfaces";
import { BASE_URL } from "../../utils/constants";

interface ICurrentOrderProps {
  currentOrder: IOrder;
}

const Page: NextPage<ICurrentOrderProps> = ({ currentOrder }) => {
  return (
    <>
      <Head>
        <title>{currentOrder.model} — купить в Poizonqq</title>
        <link
          type="Image/x-icon"
          href="../images/favicon.ico"
          rel="icon"
        ></link>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          property="og:title"
          content={`${currentOrder.model} — купить в Poizonqq`}
        ></meta>
        <meta
          property="og:image"
          content={`${BASE_URL}${currentOrder.orderImages[0].path}`}
        ></meta>
        <meta name="next-head-count" content="5"></meta>
      </Head>
      <Header
        orderId={currentOrder.orderId}
        orderStatus={currentOrder.status}
      />
      <Order currentOrder={currentOrder} />
    </>
  );
};

Page.getInitialProps = async (ctx) => {
  const res = await fetch(`${BASE_URL}/order/current/${ctx.query.orderId}`);
  const data = await res.json();
  return { currentOrder: data };
};

export default Page;
