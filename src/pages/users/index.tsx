import { useEffect } from "react";
import { useRouter } from "next/router";
import { observer } from "mobx-react-lite";
import Head from "next/head";
import Main from "../../components/Main/Main";
import Header from "../../components/UI/Header/Header";
import Preloader from "../../components/UI/Preloader/Preloader";
import UserData from "../../store/user";
import Logged from "../../store/logged";
import UsersDataList from "../../store/usersList";
import { getUserInfo, getUsers } from "../../utils/User";
import Navigation from "../../components/UI/Navigation/Navigation";
import Users from "../../components/Users/Users";
import { SUPERADMIN, ADMIN, MAINADMIN } from "../../utils/constants";
import RateData from "../../store/rate";
import { getRate } from "../../utils/Rate";

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
    getUsers().then((usersResponse) =>
      UsersDataList.setUsersList(usersResponse)
    );
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
        <title>Poizonqq CRM - Пользователи</title>
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
            UserData.userData.position === ADMIN ? (
              <Users
                userPosition={UserData.userData.position}
                userId={UserData.userData._id}
                users={UsersDataList.usersList}
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
