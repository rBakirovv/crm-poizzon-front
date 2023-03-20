import { useEffect } from "react";
import { useRouter } from "next/router";
import { observer } from "mobx-react-lite";
import Head from "next/head";
import Main from "../components/Main/Main";
import Header from "../components/UI/Header/Header";
import Preloader from "../components/UI/Preloader/Preloader";
import UserData from "../store/user";
import Logged from "../store/logged";
import { getUserInfo } from "../utils/User";
import { getOrders } from "../utils/Order";
import OrderData from "../store/order";
import Navigation from "../components/UI/Navigation/Navigation";
import { getRate } from "../utils/Rate";
import RateData from "../store/rate";
import OrdersList from "../components/OrdersList/OrdersList";
import { deleteOrder, getCurrentOrder, deleteOrderImage } from "../utils/Order";
import { IOrderImages } from "../types/interfaces";
import { getPayments } from "../utils/Payment";
import PaymentsData from "../store/payments";

const Home = observer(() => {
  const router = useRouter();

  useEffect(() => {
    getOrders()
      .then((orders) => OrderData.setOrders(orders))
      .then(() => {
        return OrderData.orders.filter((item) => {
          if (
            item.status === "Черновик" &&
            Math.ceil(
              Math.round(
                new Date(item.overudeAfter).getTime() -
                  new Date(Date.now()).getTime()
              ) / 1000
            ) <= -172800
          ) {
            return true;
          }
        });
      })
      .then((overudeOrders) => {
        overudeOrders.length > 0 &&
          overudeOrders.map((item) => {
            getCurrentOrder(item._id)
              .then((order) => {
                if (order.orderImages.length !== 0) {
                  order.orderImages.map((imageItem: IOrderImages) => {
                    order.orderImages.length !== 0 &&
                      deleteOrderImage(imageItem.name, order._id).catch((err) =>
                        console.log(err)
                      );
                  });
                }
              })
              .then(() => {
                deleteOrder(item._id);
              })
              .then(() => {
                OrderData.deleteOrder(item._id);
              })
              .catch((err) => {
                console.log(err);
              });
          });
      });
  }, []);

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
  });

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
    getPayments()
      .then((payments) => {
        PaymentsData.setPaymentsList(payments);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    getRate()
      .then((rates) => {
        RateData.setNewRate(rates[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <Head>
        <title>Poizonqq CRM</title>
        <link
          type="Image/x-icon"
          href="../images/favicon.ico"
          rel="icon"
        ></link>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {!Logged.loggedIn && <Preloader />}
      {Logged.loggedIn && (
        <>
          <Header
            userPosition={UserData.userData.position}
            userName={UserData.userData.name}
            currentRate={RateData.rate.rate}
          />
          <Navigation />
          <Main>
            {(OrderData.orders.length === 0 || !OrderData.orders.length) && (
              <Preloader />
            )}
            {OrderData.orders.length > 0 && typeof window !== "undefined" && (
              <OrdersList />
            )}
          </Main>
        </>
      )}
    </>
  );
});

export default Home;
