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
    getUsers().then((usersResponse) => UsersDataList.setUsersList(usersResponse));
  }, []);

  return (
    <>
      <Head>
        <title>Poizonqq CRM - Пользователи</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {!Logged.loggedIn && <Preloader />}
      {Logged.loggedIn && (
        <>
          <Header userPosition={UserData.userData.position} />
          <Navigation />
          <Main>
            <Users userPosition={UserData.userData.position} userId={UserData.userData._id} users={UsersDataList.usersList} />
          </Main>
        </>
      )}
    </>
  );
});

export default Home;
