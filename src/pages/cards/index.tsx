import { useEffect } from "react";
import { useRouter } from "next/router";
import { observer } from "mobx-react-lite";
import Head from "next/head";
import Main from "../../components/Main/Main";
import Header from "../../components/UI/Header/Header";
import Preloader from "../../components/UI/Preloader/Preloader";
import UserData from "../../store/user";
import Logged from "../../store/logged";
import { getUserInfo } from "../../utils/User";
import Navigation from "../../components/UI/Navigation/Navigation";
import RateData from "../../store/rate";
import { getRate } from "../../utils/Rate";
import { getPayments } from "../../utils/Payment";
import PaymentsData from "../../store/payments";
import Cards from "../../components/Cards/Cards";
import OrderData from "../../store/order";
import CardsData from "../../store/cards";
import { getCardsUpdatedAt, getOrders } from "../../utils/Order";

const Home = observer(() => {
  const router = useRouter();

  useEffect(() => {
    getOrders().then((orders) => OrderData.setOrders(orders));
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
    getRate()
      .then((rates) => {
        RateData.setNewRate(rates[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    getPayments().then((payments) => {
      PaymentsData.setPaymentsList(payments);
    });
  }, []);

  useEffect(() => {
    getCardsUpdatedAt().then((data) => {
      CardsData.setUpdatedDate(data[0]);
    });
  }, []);

  return (
    <>
      <Head>
        <title>poizonqq crm - статистика оплаты</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          type="Image/x-icon"
          href="../images/favicon.ico"
          rel="icon"
        ></link>
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
            {OrderData.orders.length > 0 && (
              <Cards payments={PaymentsData.paymentsList} />
            )}
            {(OrderData.orders.length === 0 || !OrderData.orders.length) && (
              <Preloader />
            )}
          </Main>
        </>
      )}
    </>
  );
});

export default Home;
