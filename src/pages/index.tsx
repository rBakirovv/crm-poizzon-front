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
import { getLongDrafts, getOrders, getOrdersTable } from "../utils/Order";
import OrderData from "../store/order";
import OrdersBar from "../store/ordersBar";
import Navigation from "../components/UI/Navigation/Navigation";
import { getRate } from "../utils/Rate";
import RateData from "../store/rate";
import OrdersList from "../components/OrdersList/OrdersList";
import { deleteOrder, getCurrentOrder, deleteOrderImage } from "../utils/Order";
import { IOrder, IOrderImages } from "../types/interfaces";
import { getPayments } from "../utils/Payment";
import PaymentsData from "../store/payments";
import { getDeliveryMethod } from "../utils/DeliveryMethod";
import deliveryMethod from "../store/deliveryMethod";

const Home = observer(() => {
  const router = useRouter();

  useEffect(() => {
    getOrdersTable(
      typeof window !== "undefined" && sessionStorage.getItem("ordersTablePage")
        ? parseInt(sessionStorage.getItem("ordersTablePage") as any) - 1
        : 0,
      OrdersBar.orderStatus,
      "",
      "",
      ""
    ).then((orders) => {
      OrderData.setOrders(orders.orders);
      OrderData.setOrdersTableLength(orders.total);
    });
  }, []);

  useEffect(() => {
    getLongDrafts().then((overudeOrders) => {
      overudeOrders.length > 0 &&
        overudeOrders.map((item: IOrder) => {
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

  useEffect(() => {
    getDeliveryMethod().then((data) => {
      deliveryMethod.setDeliveryMethod(data[0]);
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
          <Main>{typeof window !== "undefined" && <OrdersList />}</Main>
        </>
      )}
    </>
  );
});

export default Home;
