import { observer } from "mobx-react-lite";
import Head from "next/head";
import Header from "../../../components/UI/Header/Header";
import OrderPay from "../../../components/OrderPay/OrderPay";
import { useEffect } from "react";
import { getCurrentOrder } from "../../../utils/Order";
import { useRouter } from "next/router";
import OrderData from "../../../store/order";

const Page = observer(() => {
  const router = useRouter();

  useEffect(() => {
    router.query.orderPayId !== "undefined" &&
      getCurrentOrder(router.query.orderPayId!).then((order) => {
        OrderData.setOrder(order);
      });
  }, [router.query.orderPayId]);

  return (
    <>
      <Head>
        {OrderData.order.orderId ? (
          <title>#{OrderData.order.orderId} - Оплата</title>
        ) : <title>Оплата</title>}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <>
        {router.query.orderPayId && OrderData.order._id && (
          <Header
            orderId={OrderData.order.orderId}
            orderStatus={OrderData.order.status}
          />
        )}
        {router.query.orderPayId && OrderData.order._id && <OrderPay />}
      </>
    </>
  );
});

export default Page;
