import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { observer } from "mobx-react-lite";
import Head from "next/head";
import Main from "../../components/Main/Main";
import Header from "../../components/UI/Header/Header";
import Preloader from "../../components/UI/Preloader/Preloader";
import UserData from "../../store/user";
import Logged from "../../store/logged";
import { getUserInfo } from "../../utils/User";
import { getOrders } from "../../utils/Order";
import OrderData from "../../store/order";
import Navigation from "../../components/UI/Navigation/Navigation";
import RateData from "../../store/rate";
import Search from "../../components/Search/Search";
import { getRate } from "../../utils/Rate";

const Home = observer(() => {
  const router = useRouter();

  const [isPreloader, setIsPreloader] = useState(false);

  /*
  useEffect(() => {
    setIsPreloader(true);
    getOrders()
      .then((orders) => OrderData.setOrders(orders))
      .then(() => setIsPreloader(false));
  }, []);
  */

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
      {isPreloader && <Preloader />}
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
            <Search />
          </Main>
        </>
      )}
    </>
  );
});

export default Home;
