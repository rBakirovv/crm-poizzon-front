import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { observer } from "mobx-react-lite";
import Head from "next/head";
import Main from "../../components/Main/Main";
import Header from "../../components/UI/Header/Header";
import Preloader from "../../components/UI/Preloader/Preloader";
import UserData from "../../store/user";
import Logged from "../../store/logged";
import { getUserInfo, getUsers } from "../../utils/User";
import Navigation from "../../components/UI/Navigation/Navigation";
import RateData from "../../store/rate";
import { getRate } from "../../utils/Rate";
import OrderData from "../../store/order";
import CardsData from "../../store/cards";
import UsersDataList from "../../store/usersList";
import {
  getOrdersSplitSecondToday,
  getOrdersSplitSecondYesterday,
} from "../../utils/Order";
import Split from "../../components/Split/Split";

const Home = observer(() => {
  const router = useRouter();

  const [isPreloader, setIsPreloader] = useState(false);

  useEffect(() => {
    setIsPreloader(true);
    getOrdersSplitSecondToday()
      .then((splitSecondOrders) => {
        CardsData.setOrdersTodaySplitSecondAt(splitSecondOrders);
      })
      .then(() => {
        getOrdersSplitSecondYesterday().then((splitSecondOrdersYesterday) => {
          CardsData.setOrdersYesterdaySplitSecondAt(splitSecondOrdersYesterday);
        });
      })
      .then(() => setIsPreloader(false))
      .catch((err) => {
        setIsPreloader(false);
        console.log(err);
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
    getUsers().then((users) => UsersDataList.setUsersList(users));
  }, []);

  return (
    <>
      <Head>
        <title>poizonqq crm - статистика сплита</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          type="Image/x-icon"
          href="../images/favicon.ico"
          rel="icon"
        ></link>
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
            {UserData.userData.position !== "Байер" &&
              UserData.userData.position !== "Работник склада" &&
              UserData.userData.position !== "Дропшиппер" && <Split />}
          </Main>
        </>
      )}
    </>
  );
});

export default Home;
