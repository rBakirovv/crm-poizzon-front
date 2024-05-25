import { observer } from "mobx-react-lite";
import Head from "next/head";
import Header from "../../../components/UI/Header/Header";
import OrderPay from "../../../components/OrderPay/OrderPay";
import { useEffect } from "react";
import { getCurrentClientOrder } from "../../../utils/Order";
import { useRouter } from "next/router";
import OrderData from "../../../store/order";

const Page = observer(() => {
  const router = useRouter();

  useEffect(() => {
    router.query.orderPayId !== "undefined" &&
      getCurrentClientOrder(router.query.orderPayId!).then((order) => {
        OrderData.setOrder(order);
      });
  }, [router.query.orderPayId]);

  return (
    <>
      <Head>
        {OrderData.order.orderId ? (
          <title>#{OrderData.order.orderId} - Оплата</title>
        ) : (
          <title>Оплата</title>
        )}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
      </Head>
      <>{router.query.orderPayId && OrderData.order._id && <OrderPay />}</>
    </>
  );
});

export default Page;
