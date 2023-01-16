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
        {(currentOrder.brand && currentOrder.model) ? (
          <title>
            #{`${currentOrder.orderId} ${currentOrder.brand} ${currentOrder.model}`} —
            купить в Poizonqq
          </title>
        ) : (
          <title>купить в Poizonqq</title>
        )}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
  const res = await fetch(`${BASE_URL}/order/${ctx.query.orderId}`);
  const data = await res.json();
  return { currentOrder: data };
};

export default Page;
