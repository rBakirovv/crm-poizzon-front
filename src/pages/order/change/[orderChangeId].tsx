import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { observer } from "mobx-react-lite";
import Head from "next/head";
import Main from "../../../components/Main/Main";
import Header from "../../../components/UI/Header/Header";
import Preloader from "../../../components/UI/Preloader/Preloader";
import UserData from "../../../store/user";
import Logged from "../../../store/logged";
import { getUserInfo } from "../../../utils/User";
import Navigation from "../../../components/UI/Navigation/Navigation";
import { getCurrentOrder } from "../../../utils/Order";
import OrderChange from "../../../components/OrderChange/OrderChange";

const Home = observer(() => {
  const router = useRouter();

  const [order, setOrder] = useState({});

  useEffect(() => {
    !Logged.loggedIn &&
      getUserInfo()
        .then((user) => {
          if (user) {
            Logged.setLoggedIn(true);
          }
        })
        .catch(() => {
          Logged.setLoggedIn(false);
          router.push("/sign-in");
        });
  }, []);

  useEffect(() => {
    if (Logged.loggedIn) {
      getUserInfo()
        .then((user) => {
          UserData.setUserData({
            email: user.email,
            name: user.name,
            position: user.position,
            _id: user._id,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [Logged.loggedIn]);

  useEffect(() => {
    router.query.orderChangeId &&
      getCurrentOrder(router.query.orderChangeId).then((order) => {
        setOrder(order);
      });
  }, [router.query.orderChangeId]);

  return (
    <>
      <Head>
        <title>{`Заказ #${order.orderId}`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {!Logged.loggedIn && <Preloader />}
      {Logged.loggedIn && (
        <>
          <Header
            userPosition={UserData.userData.position}
            userName={UserData.userData.name}
          />
          <Navigation />
          <Main>
            {router.query.orderChangeId && <OrderChange order={order} />}
          </Main>
        </>
      )}
    </>
  );
});

export default Home;
