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
import { getCurrentOrder } from "../../utils/Order";
import OrderData from "../../store/order";
import RateData from "../../store/rate";
import { getRate } from "../../utils/Rate";
import { getPayments } from "../../utils/Payment";
import { getPoromoCodes } from "../../utils/PoromoCode";
import PaymentsData from "../../store/payments";
import PromoCodeData from "../../store/promo-code";
import CreateOrder from "../../components/CreateOrder/CreateOrder";

const Home = observer(() => {
  const router = useRouter();

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
      getCurrentOrder(router.query.orderChangeId)
        .then((order) => {
          OrderData.setOrder(order);
        })
        .catch((err) => {
          console.log(err);
        });
  }, [router.query.orderChangeId]);

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
    getPoromoCodes().then((promoCodes) => {
      PromoCodeData.setPromoCodeList(promoCodes);
    });
  }, []);

  return (
    <>
      <Head>
        <title>poizonqq crm - создать заказ</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link type="Image/x-icon" href="../images/favicon.ico" rel="icon"></link>
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
            <CreateOrder payments={PaymentsData.paymentsList} />
          </Main>
        </>
      )}
    </>
  );
});

export default Home;
