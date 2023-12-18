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
import { getPayments } from "../../utils/Payment";
import PaymentsData from "../../store/payments";
import Cards from "../../components/Cards/Cards";
import OrderData from "../../store/order";
import CardsData from "../../store/cards";
import UsersDataList from "../../store/usersList";
import WarehouseData from "../../store/warehouse";
import {
  getCardsUpdatedAt,
  getOrdersAfterUpdatedAt,
  getOrdersPaidToday,
  getOrdersPaidYesterday,
  getOrdersSplitSecondToday,
  getOrdersSplitSecondYesterday,
  getOrdersSplitToday,
  getOrdersSplitYesterday,
  getRecentlyArrived,
  getSplitDebt,
} from "../../utils/Order";

const Home = observer(() => {
  const router = useRouter();

  const [isPreloader, setIsPreloader] = useState(false);

  useEffect(() => {
    setIsPreloader(true);
    getOrdersAfterUpdatedAt()
      .then((orders) => {
        CardsData.setOrdersAfterUpdatedAt(orders);
      })
      .then(() => {
        getOrdersPaidToday().then((paidOrders) => {
          CardsData.setOrdersTodayPaidAt(paidOrders);
        });
      })
      .then(() => {
        getOrdersSplitToday().then((splitOrders) => {
          CardsData.setOrdersTodaySplitAt(splitOrders);
        });
      })
      .then(() => {
        getOrdersSplitSecondToday().then((splitSecondOrders) => {
          CardsData.setOrdersTodaySplitSecondAt(splitSecondOrders);
        });
      })
      .then(() => {
        getOrdersPaidYesterday().then((splitSecondOrdersYesterday) => {
          CardsData.setOrdersYesterdayPaidAt(splitSecondOrdersYesterday);
        });
      })
      .then(() => {
        getOrdersSplitYesterday().then((splitOrdersYesterday) => {
          CardsData.setOrdersYesterdaySplitAt(splitOrdersYesterday);
        });
      })
      .then(() => {
        getOrdersSplitSecondYesterday().then((splitSecondOrdersYesterday) => {
          CardsData.setOrdersYesterdaySplitSecondAt(splitSecondOrdersYesterday);
        });
      })
      .then(() => {
        getSplitDebt().then((splitDebtOrders) => {
          CardsData.setSplitDebt(splitDebtOrders);
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
    getPayments().then((payments) => {
      PaymentsData.setPaymentsList(payments);
    });
  }, []);

  useEffect(() => {
    getCardsUpdatedAt().then((data) => {
      CardsData.setUpdatedDate(data[0]);
    });
  }, []);

  useEffect(() => {
    getRecentlyArrived().then((orders) => {
      WarehouseData.setordersRecentlyArrived(orders);
    });
  }, []);

  useEffect(() => {
    getUsers().then((users) => UsersDataList.setUsersList(users));
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
            {CardsData.cards.updatedAt &&
              UserData.userData.position !== "Дропшиппер" && (
                <Cards payments={PaymentsData.paymentsList} />
              )}
            {(UserData.userData.position === "Дропшиппер" ||
              (!OrderData.orders.length && !CardsData.cards.updatedAt)) && (
              <Preloader />
            )}
          </Main>
        </>
      )}
    </>
  );
});

export default Home;
