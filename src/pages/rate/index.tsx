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
import { getRate } from "../../utils/Rate";
import RateData from "../../store/rate";
import Navigation from "../../components/UI/Navigation/Navigation";
import { SUPERADMIN } from "../../utils/constants";
import RateComponent from "../../components/RateComponent/RateComponent";

const Home = observer(() => {
  const router = useRouter();

  const [isFirstRate, setIsFirstRate] = useState(false);

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
    getRate().then((rates) => {
      rates.length > 0 ? RateData.setNewRate(rates[0]) : setIsFirstRate(true);
    });
  }, []);

  return (
    <>
      <Head>
        <title>Poizonqq CRM - Курс СNY</title>
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
            {UserData.userData.position === SUPERADMIN ? (
              <RateComponent
                currentRate={RateData.rate}
                isFirstRate={isFirstRate}
              />
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
