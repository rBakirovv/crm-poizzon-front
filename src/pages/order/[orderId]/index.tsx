import { NextPage } from "next";
import { IOrder } from "../../../types/interfaces";
import { BASE_URL } from "../../../utils/constants";
import { useRouter } from "next/router";
import PreloaderClient from "../../../components/UI/PreloaderClient/PreloaderClient";

interface ICurrentOrderProps {
  currentOrder: IOrder;
}

const Page: NextPage<ICurrentOrderProps> = ({ currentOrder }) => {
  const router = useRouter();

  typeof window !== "undefined" && router.push(`${currentOrder._id}/${currentOrder.orderId}`);

  return (
    <>
      <PreloaderClient />
    </>
  );
};

Page.getInitialProps = async (ctx) => {
  const res = await fetch(`${BASE_URL}/order/current/${ctx.query.orderId}`);
  const data = await res.json();

  return { currentOrder: data };
};

export default Page;
