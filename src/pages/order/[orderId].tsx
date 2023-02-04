import Head from "next/head";
import { NextPage } from "next";
import Order from "../../components/Order/Order";
import Header from "../../components/UI/Header/Header";
import { IOrder } from "../../types/interfaces";
import { BASE_URL } from "../../utils/constants";
import { getCurrentClientOrder } from "../../utils/Order";
import { useEffect, useState } from "react";

interface ICurrentOrderProps {
  currentOrder: IOrder;
}

const Page: NextPage<ICurrentOrderProps> = ({ currentOrder }) => {

  return (
    <>
      <Head>
        <title>
          {currentOrder.combinedOrder.length === 0
            ? `${currentOrder.model} — купить в Poizonqq`
            : `Poizonqq заказ №${currentOrder.orderId}`}
        </title>
        <link
          type="Image/x-icon"
          href="../images/favicon.ico"
          rel="icon"
        ></link>
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
  const res = await fetch(`${BASE_URL}/order/current/${ctx.query.orderId}`);
  const data = await res.json();
  return { currentOrder: data };
};

export default Page;
