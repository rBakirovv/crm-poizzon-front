import { useEffect } from "react";
import { useRouter } from "next/router";
import { observer } from "mobx-react-lite";
import Head from "next/head";
import Main from "../../components/Main/Main";
import Header from "../../components/UI/Header/Header";
import Preloader from "../../components/UI/Preloader/Preloader";
import UserData from "../../store/user";
import Logged from "../../store/logged";
import Payment from "../../store/payments";
import { getUserInfo } from "../../utils/User";
import { getPayments } from "../../utils/Payment";
import Navigation from "../../components/UI/Navigation/Navigation";
import Payments from "../../components/Payments/Payments";
import { SUPERADMIN, ADMIN, MAINADMIN, MANAGER } from "../../utils/constants";
import { getRate } from "../../utils/Rate";
import RateData from "../../store/rate";

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
    getPayments().then((payments) => {
      Payment.setPaymentsList(payments);
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
        <title>Poizonqq CRM - Способы оплаты</title>
        <link type="Image/x-icon" href="../images/favicon.ico" rel="icon"></link>
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
            {UserData.userData.position === SUPERADMIN || UserData.userData.position === MAINADMIN ||
            UserData.userData.position === ADMIN || UserData.userData.position === MANAGER ? (
              <Payments paymentsList={Payment.paymentsList} />
            ) : (
              <Preloader />
            )}
          </Main>
        </>
      )}
    </>
  );
});

export default Home;
