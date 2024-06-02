import Head from "next/head";
import { NextPage } from "next";
import Order from "../../../../components/Order/Order";
import { IDeliveryMethod, IMergedClientOrders, IOrder } from "../../../../types/interfaces";
import { BASE_URL } from "../../../../utils/constants";

interface ICurrentOrderProps {
  currentOrder: IOrder;
  mergedData: Array<IMergedClientOrders>;
  deliveryMethodData: Array<IDeliveryMethod>;
}

const Page: NextPage<ICurrentOrderProps> = ({ currentOrder, mergedData, deliveryMethodData }) => {
  return (
    <>
      <Head>
        <title>{currentOrder.model} — купить в Poizonqq</title>
        <link
          type="Image/x-icon"
          href="../images/favicon.ico"
          rel="icon"
        ></link>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
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
      <Order currentOrder={currentOrder} mergedData={mergedData} deliveryMethodData={deliveryMethodData}/>
      <style>
        {`
            html {
              background-color: #1B0F22;
            }
          `}
      </style>
    </>
  );
};

Page.getInitialProps = async (ctx) => {
  const orderRes = await fetch(`${BASE_URL}/order/current/${ctx.query.orderId}`);
  const orderData = await orderRes.json();

  const mergedRes = await fetch(
    `${BASE_URL}/order/client-merge-info/${ctx.query.orderId}`
  );
  const mergedData = await mergedRes.json();


  const deliveryMethodRes = await fetch(
    `${BASE_URL}/delivery-method/get`
  )
  const deliveryMethodData = await deliveryMethodRes.json();

  return { currentOrder: orderData, mergedData: mergedData, deliveryMethodData: deliveryMethodData };
};

export default Page;
