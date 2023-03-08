import { observer } from "mobx-react-lite";
import Head from "next/head";
import Header from "../../../components/UI/Header/Header";
import { useEffect } from "react";
import { getCurrentClientOrder } from "../../../utils/Order";
import { useRouter } from "next/router";
import OrderData from "../../../store/order";
import OrderDeliveryClient from "../../../components/OrderDeliveryClient/OrderDeliveryClient";

const Page = observer(() => {
  const router = useRouter();

  useEffect(() => {
    router.query.deliveryId !== "undefined" &&
      router.query.deliveryId &&
      getCurrentClientOrder(router.query.deliveryId!).then((order) => {
        OrderData.setOrder(order);
      });
  }, [router.query.deliveryId]);

  return (
    <>
      <Head>
        {OrderData.order.orderId ? (
          <title>#{OrderData.order.orderId} - Доставка</title>
        ) : (
          <title>Доставка</title>
        )}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          type="Image/x-icon"
          href="../images/favicon.ico"
          rel="icon"
        ></link>
      </Head>
      <>
        {router.query.deliveryId && OrderData.order._id && (
          <Header
            orderId={OrderData.order.orderId}
            orderStatus={OrderData.order.status}
          />
        )}
        <OrderDeliveryClient />
      </>
    </>
  );
});

export default Page;
