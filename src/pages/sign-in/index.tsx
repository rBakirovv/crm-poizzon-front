import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import Login from "../../components/Login/Login";
import { authorize } from "../../utils/Auth";
import { getUserInfo } from "../../utils/User";
import UserData from "../../store/user";
import Logged from "../../store/logged";

const Home = observer(() => {
  const router = useRouter();

  const [loginError, setLoginError] = useState<number>(0);

  useEffect(() => {
    !Logged.loggedIn &&
      getUserInfo()
        .then((user) => {
          if (user.email) {
            Logged.setLoggedIn(true);
            router.push("/");
          }
        })
        .catch(() => {
          Logged.setLoggedIn(false);
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

  function handleAuthorization(email: string, password: string) {
    authorize(email, password)
      .then(() => {
        router.push("/");
      })
      .catch((err) => {
        console.log(err);
        setLoginError(err);
      });
  }

  return (
    <>
      <Head>
        <title>Poizonqq CRM - авторизация</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Login
        handleAuthorization={handleAuthorization}
        loginError={loginError}
      />
    </>
  );
});

export default Home;
