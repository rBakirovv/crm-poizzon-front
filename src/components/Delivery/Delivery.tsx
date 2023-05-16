import styles from "./Delivery.module.css";
import OrderData from "../../store/order";
import UserData from "../../store/user";
import TextInput from "../UI/TextInput/TextInput";
import React, { useState } from "react";
import {
  inStockInRussia,
  orderSent,
  orderСompleted,
  deliveryAuthorization,
  createDeliveryDocument,
  getDeliveryDocument,
  createDeliveryBarcode,
  getDeliveryBarcode,
  getDeliveryInfo,
  changeOrderDeliveryPhone,
  updateDeliveryPhone,
  changeOrderDeliveryName,
  updateDeliveryName,
  changeOrderDeliveryPackages,
  updateDeliveryCDEKCode,
  changeTotalSum,
} from "../../utils/Order";
import SubmitPopup from "../SubmitPopup/SubmitPopup";
import Preloader from "../UI/Preloader/Preloader";
import ChangeAddress from "../UI/ChangeAddress/ChangeAddress";

const Delivery = () => {
  const [data, setData] = useState({
    delivery_code: OrderData.order.deliveryCode,
    delivery_address: OrderData.order.deliveryAddress,
    delivery_phone: OrderData.order.deliveryPhone,
    delivery_name: OrderData.order.deliveryNameRecipient,
    delivery_packages: 1,
    delivery_number: 0,
    delivery_insurance:
      OrderData.order.combinedOrder.length > 0
        ? 0
        : Math.ceil(
            parseFloat(OrderData.order.priceCNY) *
              parseFloat(OrderData.order.currentRate) +
              parseFloat(OrderData.order.priceDeliveryChina) +
              parseFloat(OrderData.order.priceDeliveryRussia) +
              parseFloat(OrderData.order.commission) -
              OrderData.order.promoCodePercent
          ),
    delivery_length: 0,
    delivery_width: 0,
    delivery_height: 0,
  });

  const [isSubmitPopup, setIsSubmitPopup] = useState(false);
  const [isSubmitChangePopup, setIsSubmitChangePopup] = useState(false);
  const [isSubmitChangePhonePopup, setIsSubmitChangePhonePopup] =
    useState(false);
  const [isSubmitChangeNamePopup, setIsSubmitChangeNamePopup] = useState(false);
  const [isSubmitChangePackagesPopup, setIsSubmitChangePackagesPopup] =
    useState(false);
  const [isSubmitChangeNumberPopup, setIsSubmitChangeNumberPopup] =
    useState(false);
  const [isSubmitChangeInsurancePopup, setIsSubmitChangeInsurancePopup] =
    useState(false);
  const [isSubmitChangeSizePopup, setIsSubmitChangeSizePopup] = useState(false);

  const [isChangePhone, setIsChangePhone] = useState(false);
  const [isChangeName, setIsChangeName] = useState(false);

  const [isPreloader, setIsPreloader] = useState(false);

  const [isWidjet, setIsWidjet] = useState(false);

  function openSubmitPopup(e: React.SyntheticEvent) {
    e.preventDefault();
    setIsSubmitPopup(true);
  }

  function closeSubmitPopup() {
    setIsSubmitPopup(false);
  }

  function openSubmitChangePopup(e: React.SyntheticEvent) {
    e.preventDefault();
    setIsSubmitChangePopup(true);
  }

  function closeSubmitChangePopup() {
    setIsSubmitChangePopup(false);
  }

  function openSubmitChangePhonePopup() {
    setIsSubmitChangePhonePopup(true);
  }

  function closeSubmitChangePhonePopup() {
    setIsSubmitChangePhonePopup(false);
  }

  function openSubmitChangeNamePopup() {
    setIsSubmitChangeNamePopup(true);
  }

  function closeSubmitChangeNamePopup() {
    setIsSubmitChangeNamePopup(false);
  }

  function openSubmitChangePackagesPopup() {
    setIsSubmitChangePackagesPopup(true);
  }

  function closeSubmitChangePackagesPopup() {
    setIsSubmitChangePackagesPopup(false);
  }

  function openSubmitChangeNumberPopup() {
    setIsSubmitChangeNumberPopup(true);
  }

  function closeSubmitChangeNumberPopup() {
    setIsSubmitChangeNumberPopup(false);
  }

  function openSubmitChangeInsurancePopup() {
    setIsSubmitChangeInsurancePopup(true);
  }

  function closeSubmitChangeInsurancePopup() {
    setIsSubmitChangeInsurancePopup(false);
  }

  function openSubmitChangeSizePopup() {
    setIsSubmitChangeSizePopup(true);
  }

  function closeSubmitChangeSizePopup() {
    setIsSubmitChangeSizePopup(false);
  }

  function openWidjet() {
    setIsWidjet(true);
  }

  function closeWidjet() {
    setIsWidjet(false);
  }

  function handleChange(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;

    const { name, value } = target;

    setData({
      ...data,
      [name]: value,
    });

    if (target.value === "medium") {
      setData({
        ...data,
        delivery_length: 37,
        delivery_width: 27,
        delivery_height: 16,
      });
    }

    if (target.value === "large") {
      setData({
        ...data,
        delivery_length: 41,
        delivery_width: 31,
        delivery_height: 18,
      });
    }

    if (target.value === "extra_large") {
      setData({
        ...data,
        delivery_length: 45,
        delivery_width: 36,
        delivery_height: 21,
      });
    }

    if (target.value === "y_01") {
      setData({
        ...data,
        delivery_length: 49,
        delivery_width: 40,
        delivery_height: 32,
      });
    }

    if (target.value === "y_03") {
      setData({
        ...data,
        delivery_length: 60,
        delivery_width: 44,
        delivery_height: 31,
      });
    }

    if (target.value === "y_06") {
      setData({
        ...data,
        delivery_length: 66,
        delivery_width: 57,
        delivery_height: 29,
      });
    }

    if (target.value === "y_08") {
      setData({
        ...data,
        delivery_length: 39,
        delivery_width: 30,
        delivery_height: 31,
      });
    }

    if (target.value === "y_08") {
      setData({
        ...data,
        delivery_length: 39,
        delivery_width: 30,
        delivery_height: 31,
      });
    }

    if (target.value === "y_10") {
      setData({
        ...data,
        delivery_length: 48,
        delivery_width: 40,
        delivery_height: 32,
      });
    }

    if (target.value === "y_13") {
      setData({
        ...data,
        delivery_length: 56,
        delivery_width: 49,
        delivery_height: 22,
      });
    }

    if (target.value === "y_37") {
      setData({
        ...data,
        delivery_length: 27,
        delivery_width: 29,
        delivery_height: 32,
      });
    }

    if (target.value === "small") {
      setData({
        ...data,
        delivery_length: 34,
        delivery_width: 21,
        delivery_height: 16,
      });
    }

    if (target.value === "mini") {
      setData({
        ...data,
        delivery_length: 24,
        delivery_width: 18,
        delivery_height: 15,
      });
    }
  }

  function handleInStockInRussia() {
    inStockInRussia(OrderData.order._id, UserData.userData.name).then(
      (order) => {
        OrderData.setOrder(order);
      }
    );
  }

  function handleOrderSent() {
    orderSent(OrderData.order._id, data.delivery_code).then((order) => {
      OrderData.setOrder(order);
    });
  }

  function handleOrderСompleted() {
    orderСompleted(OrderData.order._id).then((order) => {
      OrderData.setOrder(order);
    });
  }

  function copyNumberCDEK() {
    navigator.clipboard.writeText(OrderData.order.deliveryCode);
  }

  function copyTg() {
    if (OrderData.order.deliveryName![0] === "@") {
      navigator.clipboard.writeText(OrderData.order.deliveryName!.slice(1));
    } else {
      navigator.clipboard.writeText(OrderData.order.deliveryName!);
    }
  }

  function copyName() {
    navigator.clipboard.writeText(OrderData.order.deliveryNameRecipient!);
  }

  function handleChangePhone() {
    setIsChangePhone(true);
  }

  function handleChangeName() {
    setIsChangeName(true);
  }

  function copyPhone() {
    navigator.clipboard.writeText(OrderData.order.deliveryPhone!);
  }

  function copyAddress() {
    navigator.clipboard.writeText(OrderData.order.deliveryAddress!);
  }

  function handleUpdateDeliveryPhone() {
    setIsPreloader(true);
    deliveryAuthorization()
      .then((authData) => {
        getDeliveryInfo(authData.token, OrderData.order.deliveryEntity)
          .then((orderInfo) => {
            changeOrderDeliveryPhone(
              authData.token,
              orderInfo.entity.uuid,
              data.delivery_phone
            )
              .then(() => {
                updateDeliveryPhone(OrderData.order._id, data.delivery_phone!)
                  .then((order) => {
                    OrderData.setOrder(order);
                  })
                  .then(() => {
                    if (OrderData.order.combinedOrder.length > 0) {
                      OrderData.order.combinedOrder[0].combinedOrder.map(
                        (orderItem) => {
                          if (OrderData.order._id !== orderItem) {
                            updateDeliveryPhone(
                              orderItem,
                              data.delivery_phone!
                            );
                          }
                        }
                      );
                    }
                  })
                  .then(() => {
                    setIsPreloader(false);
                    setIsChangePhone(false);
                  })
                  .catch((err) => {
                    console.log(err);
                    setIsPreloader(false);
                    alert("Произошла ошибка!");
                  });
              })
              .catch((err) => {
                console.log(err);
                setIsPreloader(false);
                alert("Произошла ошибка!");
              });
          })
          .catch((err) => {
            console.log(err);
            setIsPreloader(false);
            alert("Произошла ошибка!");
          });
      })
      .catch((err) => {
        console.log(err);
        setIsPreloader(false);
        alert("Произошла ошибка!");
      });
  }

  function handleUpdateDeliveryName() {
    setIsPreloader(true);
    deliveryAuthorization()
      .then((authData) => {
        getDeliveryInfo(authData.token, OrderData.order.deliveryEntity)
          .then((orderInfo) => {
            changeOrderDeliveryName(
              authData.token,
              orderInfo.entity.uuid,
              data.delivery_name
            )
              .then(() => {
                updateDeliveryName(OrderData.order._id, data.delivery_name!)
                  .then((order) => {
                    OrderData.setOrder(order);
                  })
                  .then(() => {
                    if (OrderData.order.combinedOrder.length > 0) {
                      OrderData.order.combinedOrder[0].combinedOrder.map(
                        (orderItem) => {
                          if (OrderData.order._id !== orderItem) {
                            updateDeliveryName(orderItem, data.delivery_name!);
                          }
                        }
                      );
                    }
                  })
                  .then(() => {
                    setIsPreloader(false);
                    setIsChangeName(false);
                  })
                  .catch((err) => {
                    console.log(err);
                    setIsPreloader(false);
                    alert("Произошла ошибка!");
                  });
              })
              .catch((err) => {
                console.log(err);
                setIsPreloader(false);
                alert("Произошла ошибка!");
              });
          })
          .catch((err) => {
            console.log(err);
            setIsPreloader(false);
            alert("Произошла ошибка!");
          });
      })
      .catch((err) => {
        console.log(err);
        setIsPreloader(false);
        alert("Произошла ошибка!");
      });
  }

  function handleChangePackages() {
    deliveryAuthorization()
      .then((authData) => {
        getDeliveryInfo(authData.token, OrderData.order.deliveryEntity)
          .then((orderInfo) => {
            return orderInfo.entity.packages[0];
          })
          .then((packageItem) => {
            let packagesArray: any = [];

            for (let i = 0; i < data.delivery_packages; i++) {
              if (i === 0) {
                packagesArray.push({
                  number: `${packageItem.number}-1`,
                  weight: "100",
                  length: packageItem.length,
                  width: packageItem.width,
                  height: packageItem.height,
                  items: [
                    {
                      ware_key: `${packageItem.number}-1`,
                      payment: {
                        value: 0,
                      },
                      name: packageItem.items[0].name,
                      cost: packageItem.items[0].cost,
                      amount: 1,
                      weight: 100,
                    },
                  ],
                });
              } else {
                packagesArray.push({
                  number: `${packageItem.number}-${i + 1}`,
                  weight: "100",
                  length: packageItem.length,
                  width: packageItem.width,
                  height: packageItem.height,
                  items: [
                    {
                      ware_key: `${packageItem.number}-${i + 1}`,
                      payment: {
                        value: 0,
                      },
                      name: packageItem.items[0].name,
                      cost: packageItem.items[0].cost,
                      amount: 1,
                      weight: 100,
                    },
                  ],
                });
              }
            }
            return packagesArray;
          })
          .then((packagesArray) => {
            getDeliveryInfo(authData.token, OrderData.order.deliveryEntity)
              .then((orderInfoForSum) => {
                changeTotalSum(
                  authData.token,
                  orderInfoForSum.entity.tariff_code,
                  orderInfoForSum.entity.from_location.code,
                  orderInfoForSum.entity.to_location.code,
                  packagesArray,
                  orderInfoForSum.entity.packages[0].items[0].cost
                ).then((sumInfo) => {
                  changeOrderDeliveryPackages(
                    authData.token,
                    OrderData.order.deliveryEntity,
                    sumInfo.total_sum + 100,
                    packagesArray
                  ).catch((err) => {
                    console.log(err);
                  });
                });
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleChangeNumber() {
    deliveryAuthorization()
      .then((authData) => {
        getDeliveryInfo(authData.token, OrderData.order.deliveryEntity)
          .then((orderInfo) => {
            return orderInfo.entity.packages;
          })
          .then((packages) => {
            let packagesArray: any = [];

            for (let i = 0; i < packages.length; i++) {
              if (i === 0) {
                packagesArray.push({
                  number: `${data.delivery_number}-${i + 1}`,
                  weight: "100",
                  length: packages[0].length,
                  width: packages[0].width,
                  height: packages[0].height,
                  items: [
                    {
                      ware_key: `${data.delivery_number}`,
                      payment: {
                        value: 0,
                      },
                      name: packages[i].items[0].name,
                      cost: packages[i].items[0].cost,
                      amount: 1,
                      weight: 100,
                    },
                  ],
                });
              } else {
                packagesArray.push({
                  number: `${data.delivery_number}-${i + 1}`,
                  weight: "100",
                  length: packages[i].length,
                  width: packages[i].width,
                  height: packages[i].height,
                  items: [
                    {
                      ware_key: `${data.delivery_number}`,
                      payment: {
                        value: 0,
                      },
                      name: packages[i].items[0].name,
                      cost: packages[i].items[0].cost,
                      amount: 1,
                      weight: 100,
                    },
                  ],
                });
              }
            }

            return packagesArray;
          })
          .then((packagesArray) => {
            getDeliveryInfo(authData.token, OrderData.order.deliveryEntity)
              .then((orderInfoForSum) => {
                changeTotalSum(
                  authData.token,
                  orderInfoForSum.entity.tariff_code,
                  orderInfoForSum.entity.from_location.code,
                  orderInfoForSum.entity.to_location.code,
                  packagesArray,
                  orderInfoForSum.entity.packages[0].items[0].cost
                ).then((sumInfo) => {
                  changeOrderDeliveryPackages(
                    authData.token,
                    OrderData.order.deliveryEntity,
                    sumInfo.total_sum + 100,
                    packagesArray
                  ).catch((err) => {
                    console.log(err);
                  });
                });
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleChangeInsurance() {
    deliveryAuthorization()
      .then((authData) => {
        getDeliveryInfo(authData.token, OrderData.order.deliveryEntity)
          .then((orderInfo) => {
            return orderInfo.entity.packages;
          })
          .then((packages) => {
            let packagesArray: any = [];

            for (let i = 0; i < packages.length; i++) {
              if (i === 0) {
                packagesArray.push({
                  number: `${packages[0].number}-1`,
                  weight: "100",
                  length: packages[0].length,
                  width: packages[0].width,
                  height: packages[0].height,
                  items: [
                    {
                      ware_key: `${data.delivery_number}`,
                      payment: {
                        value: 0,
                      },
                      name: packages[i].items[0].name,
                      cost: data.delivery_insurance,
                      amount: 1,
                      weight: 100,
                    },
                  ],
                });
              } else {
                packagesArray.push({
                  number: `${packages[0].number}-1`,
                  weight: "100",
                  length: packages[i].length,
                  width: packages[i].width,
                  height: packages[i].height,
                  items: [
                    {
                      ware_key: `${data.delivery_number}`,
                      payment: {
                        value: 0,
                      },
                      name: packages[i].items[0].name,
                      cost: data.delivery_insurance,
                      amount: 1,
                      weight: 100,
                    },
                  ],
                });
              }
            }

            return packagesArray;
          })
          .then((packagesArray) => {
            getDeliveryInfo(authData.token, OrderData.order.deliveryEntity)
              .then((orderInfoForSum) => {
                changeTotalSum(
                  authData.token,
                  orderInfoForSum.entity.tariff_code,
                  orderInfoForSum.entity.from_location.code,
                  orderInfoForSum.entity.to_location.code,
                  packagesArray,
                  data.delivery_insurance
                ).then((sumInfo) => {
                  changeOrderDeliveryPackages(
                    authData.token,
                    OrderData.order.deliveryEntity,
                    sumInfo.total_sum + 100,
                    packagesArray
                  ).catch((err) => {
                    console.log(err);
                  });
                });
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleChangeSize() {
    deliveryAuthorization()
      .then((authData) => {
        getDeliveryInfo(authData.token, OrderData.order.deliveryEntity)
          .then((orderInfo) => {
            return orderInfo.entity.packages;
          })
          .then((packages) => {
            let packagesArray: any = [];

            for (let i = 0; i < packages.length; i++) {
              if (i === 0) {
                packagesArray.push({
                  number: `${packages[0].number}-1`,
                  weight: "100",
                  length: data.delivery_length,
                  width: data.delivery_width,
                  height: data.delivery_height,
                  items: [
                    {
                      ware_key: `${data.delivery_number}`,
                      payment: {
                        value: 0,
                      },
                      name: packages[i].items[0].name,
                      cost: packages[i].items[0].cost,
                      amount: 1,
                      weight: 100,
                    },
                  ],
                });
              } else {
                packagesArray.push({
                  number: `${packages[0].number}-1`,
                  weight: "100",
                  length: data.delivery_length,
                  width: data.delivery_width,
                  height: data.delivery_height,
                  items: [
                    {
                      ware_key: `${data.delivery_number}`,
                      payment: {
                        value: 0,
                      },
                      name: packages[i].items[0].name,
                      cost: packages[i].items[0].cost,
                      amount: 1,
                      weight: 100,
                    },
                  ],
                });
              }
            }

            return packagesArray;
          })
          .then((packagesArray) => {
            getDeliveryInfo(authData.token, OrderData.order.deliveryEntity)
              .then((orderInfoForSum) => {
                changeTotalSum(
                  authData.token,
                  orderInfoForSum.entity.tariff_code,
                  orderInfoForSum.entity.from_location.code,
                  orderInfoForSum.entity.to_location.code,
                  packagesArray,
                  orderInfoForSum.entity.packages[0].items[0].cost
                ).then((sumInfo) => {
                  changeOrderDeliveryPackages(
                    authData.token,
                    OrderData.order.deliveryEntity,
                    sumInfo.total_sum + 100,
                    packagesArray
                  ).catch((err) => {
                    console.log(err);
                  });
                });
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function openPDFHandler() {
    deliveryAuthorization()
      .then((authData) => {
        createDeliveryDocument(authData.token, OrderData.order.deliveryEntity)
          .then((deliveryDocument) => {
            if (OrderData.order.deliveryCode === "") {
              getDeliveryInfo(authData.token, OrderData.order.deliveryEntity)
                .then((orderData) => {
                  updateDeliveryCDEKCode(
                    OrderData.order._id,
                    orderData.entity.cdek_number
                  )
                    .then((orderData) => {
                      OrderData.setOrder(orderData);
                      if (OrderData.order.combinedOrder.length > 0) {
                        OrderData.order.combinedOrder[0].combinedOrder.map(
                          (orderItem) => {
                            if (OrderData.order._id !== orderItem) {
                              updateDeliveryCDEKCode(
                                orderItem,
                                orderData.entity.cdek_number
                              ).catch((err) => {
                                setIsPreloader(false);
                                console.log(err);
                              });
                            }
                          }
                        );
                      }
                    })
                    .catch((err) => {
                      setIsPreloader(false);
                      console.log(err);
                    });
                })
                .catch((err) => {
                  setIsPreloader(false);
                  console.log(err);
                });
            }
            setIsPreloader(true);
            setTimeout(() => {
              getDeliveryDocument(authData.token, deliveryDocument.entity.uuid)
                .then((pdfData) => {
                  setIsPreloader(false);
                  openPDF(pdfData.pdf);
                })
                .catch((err) => {
                  setIsPreloader(false);
                  console.log(err);
                });
            }, 5000);
          })
          .catch((err) => {
            setIsPreloader(false);
            console.log(err);
          });
      })
      .catch((err) => {
        setIsPreloader(false);
        console.log(err);
      });
  }

  function openPDFBarcodeHandler() {
    deliveryAuthorization()
      .then((authData) => {
        createDeliveryBarcode(authData.token, OrderData.order.deliveryEntity)
          .then((deliveryDocument) => {
            if (OrderData.order.deliveryCode === "") {
              getDeliveryInfo(authData.token, OrderData.order.deliveryEntity)
                .then((orderData) => {
                  updateDeliveryCDEKCode(
                    OrderData.order._id,
                    orderData.entity.cdek_number
                  )
                    .then((orderData) => {
                      OrderData.setOrder(orderData);
                      if (OrderData.order.combinedOrder.length > 0) {
                        OrderData.order.combinedOrder[0].combinedOrder.map(
                          (orderItem) => {
                            if (OrderData.order._id !== orderItem) {
                              updateDeliveryCDEKCode(
                                orderItem,
                                orderData.entity.cdek_number
                              ).catch((err) => {
                                setIsPreloader(false);
                                console.log(err);
                              });
                            }
                          }
                        );
                      }
                    })
                    .catch((err) => {
                      setIsPreloader(false);
                      console.log(err);
                    });
                })
                .catch((err) => {
                  setIsPreloader(false);
                  console.log(err);
                });
            }
            setIsPreloader(true);
            setTimeout(() => {
              getDeliveryBarcode(authData.token, deliveryDocument.entity.uuid)
                .then((pdfData) => {
                  setIsPreloader(false);
                  openPDF(pdfData.pdf);
                })
                .catch((err) => {
                  setIsPreloader(false);
                  console.log(err);
                });
            }, 5000);
          })
          .catch((err) => {
            setIsPreloader(false);
            console.log(err);
          });
      })
      .catch((err) => {
        setIsPreloader(false);
        console.log(err);
      });
  }

  function openPDF(pdfInBase64: string) {
    var URL = window.URL || window.webkitURL,
      byteChars = atob(pdfInBase64),
      bytes = [],
      i = 0;

    for (; i < byteChars.length; i++) bytes[i] = byteChars.charCodeAt(i);

    var blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });

    var downloadUrl = URL.createObjectURL(blob);

    var newWin = window.open(
      downloadUrl,
      "_blank",
      "width=500,height=300,menubar=yes,scrollbars=yes,status=yes,resizable=yes"
    );

    URL.revokeObjectURL(downloadUrl);
  }

  return (
    <section className={styles["delivery"]}>
      {isPreloader && <Preloader />}
      <div className={styles["delivery__container"]}>
        <h2 className={styles["delivery-title"]}>Доставка</h2>
        {OrderData.order.deliveryAddress !== "" &&
          OrderData.order.deliveryEntity !== "" && (
            <button
              onClick={openPDFHandler}
              disabled={isPreloader}
              className={styles["delivery-receipt"]}
            >
              Получить квитанцию
              <svg
                width="18px"
                height="18px"
                viewBox="0 0 48 48"
                focusable="false"
                fill="black"
              >
                <path fill="none" d="M0 0h48v48H0V0z"></path>
                <path d="M40 24l-2.82-2.82L26 32.34V8h-4v24.34L10.84 21.16 8 24l16 16 16-16z"></path>
              </svg>
            </button>
          )}
        {OrderData.order.deliveryAddress !== "" &&
          OrderData.order.deliveryEntity !== "" && (
            <button
              onClick={openPDFBarcodeHandler}
              disabled={isPreloader}
              className={styles["delivery-receipt"]}
            >
              Получить штрихкод
              <svg
                width="18px"
                height="18px"
                viewBox="0 0 48 48"
                focusable="false"
                fill="black"
              >
                <path fill="none" d="M0 0h48v48H0V0z"></path>
                <path d="M40 24l-2.82-2.82L26 32.34V8h-4v24.34L10.84 21.16 8 24l16 16 16-16z"></path>
              </svg>
            </button>
          )}
        {OrderData.order.deliveryAddress !== "" &&
          OrderData.order.deliveryEntity !== "" && (
            <>
              <h4>Размеры коробки</h4>
              <div
                className={`${styles["delivery-packages"]} ${styles["delivery-packages-size"]}`}
              >
                <select
                  onChange={handleChange}
                  className={styles["delivery-packages-select"]}
                >
                  <option value="" selected disabled>
                    Выберите
                  </option>
                  <option value="medium">Medium 37 * 27 * 16</option>
                  <option value="large">Large 41 * 31 * 18</option>
                  <option value="extra_large">Extra Large 45 * 36 * 21</option>
                  <option value="y_01">Y-01 49 * 40 * 32</option>
                  <option value="y_03">Y-03 60 * 44 * 31</option>
                  <option value="y_06">Y-06 66 * 57 * 29</option>
                  <option value="y_08">Y-08 39 * 30 * 31</option>
                  <option value="y_10">Y-10 48 * 40 * 32</option>
                  <option value="y_13">Y-13 56 * 49 * 22</option>
                  <option value="y_37">Y-37 27 * 29 * 32</option>
                  <option value="small">Small 34 * 21 * 16</option>
                  <option value="mini">Mini 24 * 18 * 15</option>
                </select>
                <h4>length</h4>
                <input
                  className={styles["delivery-packages-number-input"]}
                  type="number"
                  name="delivery_length"
                  value={data.delivery_length}
                  onChange={handleChange}
                />
                <h4>width</h4>
                <input
                  className={styles["delivery-packages-number-input"]}
                  type="number"
                  name="delivery_width"
                  value={data.delivery_width}
                  onChange={handleChange}
                />
                <h4>height</h4>
                <input
                  className={styles["delivery-packages-number-input"]}
                  type="number"
                  name="delivery_height"
                  value={data.delivery_height}
                  onChange={handleChange}
                />
                <button
                  className={styles["delivery-packages-size-button"]}
                  onClick={openSubmitChangeSizePopup}
                >
                  Cохр.
                </button>
              </div>
            </>
          )}
        {OrderData.order.deliveryAddress !== "" &&
          OrderData.order.deliveryEntity !== "" && (
            <div className={styles["delivery-packages"]}>
              <h4>Номер на коробке</h4>
              <input
                className={styles["delivery-packages-number-input"]}
                type="number"
                name="delivery_number"
                value={data.delivery_number}
                onChange={handleChange}
              />
              <button onClick={openSubmitChangeNumberPopup}>Cохр.</button>
            </div>
          )}
        {OrderData.order.deliveryAddress !== "" &&
          OrderData.order.deliveryEntity !== "" && (
            <div className={styles["delivery-packages"]}>
              <h4>Cумма страховки</h4>
              <input
                className={styles["delivery-packages-number-input"]}
                type="number"
                name="delivery_insurance"
                value={data.delivery_insurance}
                onChange={handleChange}
              />
              <button onClick={openSubmitChangeInsurancePopup}>Cохр.</button>
            </div>
          )}
        {OrderData.order.deliveryAddress !== "" &&
          OrderData.order.deliveryEntity !== "" && (
            <div className={styles["delivery-packages"]}>
              <h4>Кол-во мест</h4>
              <input
                className={styles["delivery-packages-number-input"]}
                type="number"
                name="delivery_packages"
                value={data.delivery_packages}
                onChange={handleChange}
              />
              <button onClick={openSubmitChangePackagesPopup}>Cохр.</button>
            </div>
          )}
        {OrderData.order.comment !== "" && (
          <>
            <h4>Комментарий</h4>
            <p className={styles["delivery-span"]}>{OrderData.order.comment}</p>
          </>
        )}
        {OrderData.order.deliveryCode !== "" && (
          <>
            <h4>Номер CDEK</h4>
            <p className={styles["delivery-copy"]} onClick={copyNumberCDEK}>
              {OrderData.order.deliveryCode}{" "}
              <svg
                x="0px"
                y="0px"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                focusable="false"
                fill="currentColor"
              >
                <path d="M3.9,12c0-1.7,1.4-3.1,3.1-3.1h4V7H7c-2.8,0-5,2.2-5,5s2.2,5,5,5h4v-1.9H7C5.3,15.1,3.9,13.7,3.9,12z M8,13h8v-2H8V13zM17,7h-4v1.9h4c1.7,0,3.1,1.4,3.1,3.1s-1.4,3.1-3.1,3.1h-4V17h4c2.8,0,5-2.2,5-5S19.8,7,17,7z"></path>
              </svg>
            </p>
          </>
        )}
        <h4>Адрес доставки</h4>
        {OrderData.order.deliveryAddress !== "" && (
          <div className={styles["delivery__input-container"]}>
            <p className={styles["delivery-copy"]} onClick={copyAddress}>
              {OrderData.order.deliveryAddress}{" "}
              <svg
                x="0px"
                y="0px"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                focusable="false"
                fill="currentColor"
              >
                <path d="M3.9,12c0-1.7,1.4-3.1,3.1-3.1h4V7H7c-2.8,0-5,2.2-5,5s2.2,5,5,5h4v-1.9H7C5.3,15.1,3.9,13.7,3.9,12z M8,13h8v-2H8V13zM17,7h-4v1.9h4c1.7,0,3.1,1.4,3.1,3.1s-1.4,3.1-3.1,3.1h-4V17h4c2.8,0,5-2.2,5-5S19.8,7,17,7z"></path>
              </svg>
            </p>
            {OrderData.order.deliveryEntity !== "" && (
              <button
                className={styles["delivery__change"]}
                onClick={openWidjet}
              >
                {"Изм."}
              </button>
            )}
          </div>
        )}
        {OrderData.order.deliveryName !== "" && (
          <>
            <h4>Telegram</h4>
            <p className={styles["delivery-copy"]} onClick={copyTg}>
              {OrderData.order.deliveryName}{" "}
              <svg
                x="0px"
                y="0px"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                focusable="false"
                fill="currentColor"
              >
                <path d="M3.9,12c0-1.7,1.4-3.1,3.1-3.1h4V7H7c-2.8,0-5,2.2-5,5s2.2,5,5,5h4v-1.9H7C5.3,15.1,3.9,13.7,3.9,12z M8,13h8v-2H8V13zM17,7h-4v1.9h4c1.7,0,3.1,1.4,3.1,3.1s-1.4,3.1-3.1,3.1h-4V17h4c2.8,0,5-2.2,5-5S19.8,7,17,7z"></path>
              </svg>
            </p>
          </>
        )}
        <h4>ФИО получателя</h4>
        {OrderData.order.deliveryNameRecipient !== "" && (
          <div className={styles["delivery__input-container"]}>
            {!isChangeName && (
              <p className={styles["delivery-copy"]} onClick={copyName}>
                {OrderData.order.deliveryNameRecipient}
                <svg
                  x="0px"
                  y="0px"
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  focusable="false"
                  fill="currentColor"
                >
                  <path d="M3.9,12c0-1.7,1.4-3.1,3.1-3.1h4V7H7c-2.8,0-5,2.2-5,5s2.2,5,5,5h4v-1.9H7C5.3,15.1,3.9,13.7,3.9,12z M8,13h8v-2H8V13zM17,7h-4v1.9h4c1.7,0,3.1,1.4,3.1,3.1s-1.4,3.1-3.1,3.1h-4V17h4c2.8,0,5-2.2,5-5S19.8,7,17,7z"></path>
                </svg>
              </p>
            )}
            {isChangeName && (
              <input
                className={styles["delivery__input"]}
                type="text"
                name="delivery_name"
                value={data.delivery_name}
                onChange={handleChange}
                readOnly={!isChangeName}
              />
            )}
            {!isChangeName &&
              OrderData.order.deliveryEntity !== "" &&
              OrderData.order.deliveryAddress !== "" && (
                <button
                  className={styles["delivery__change"]}
                  onClick={handleChangeName}
                >
                  {"Изм."}
                </button>
              )}
            {isChangeName && (
              <button
                className={styles["delivery__change"]}
                onClick={openSubmitChangeNamePopup}
              >
                {"Сохр."}
              </button>
            )}
          </div>
        )}
        <h4>Номер телефона получателя</h4>
        <div className={styles["delivery__input-container"]}>
          {!isChangePhone && OrderData.order.deliveryPhone !== "" && (
            <p className={styles["delivery-copy"]} onClick={copyPhone}>
              {OrderData.order.deliveryPhone}
              <svg
                x="0px"
                y="0px"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                focusable="false"
                fill="currentColor"
              >
                <path d="M3.9,12c0-1.7,1.4-3.1,3.1-3.1h4V7H7c-2.8,0-5,2.2-5,5s2.2,5,5,5h4v-1.9H7C5.3,15.1,3.9,13.7,3.9,12z M8,13h8v-2H8V13zM17,7h-4v1.9h4c1.7,0,3.1,1.4,3.1,3.1s-1.4,3.1-3.1,3.1h-4V17h4c2.8,0,5-2.2,5-5S19.8,7,17,7z"></path>
              </svg>
            </p>
          )}
          {isChangePhone && (
            <input
              className={styles["delivery__input"]}
              type="text"
              name="delivery_phone"
              value={data.delivery_phone}
              onChange={handleChange}
              readOnly={!isChangePhone}
            />
          )}
          {!isChangePhone &&
            OrderData.order.deliveryEntity !== "" &&
            OrderData.order.deliveryAddress !== "" && (
              <button
                className={styles["delivery__change"]}
                onClick={handleChangePhone}
              >
                {"Изм."}
              </button>
            )}
          {isChangePhone && (
            <button
              className={styles["delivery__change"]}
              onClick={openSubmitChangePhonePopup}
            >
              {"Сохр."}
            </button>
          )}
        </div>
        {(UserData.userData.position === "Администратор" ||
          UserData.userData.position === "Создатель") && (
          <form
            onSubmit={openSubmitChangePopup}
            className={styles["delivery-form"]}
          >
            <h2 className={styles["delivery-title"]}>Управление доставкой</h2>
            <TextInput
              label="Трек-номер CDEK"
              name="delivery_code"
              value={data.delivery_code}
              required={false}
              handleChange={handleChange}
            />
            <button className={styles["delivery__submit-button"]} type="submit">
              {OrderData.order.status === "На складе в РФ"
                ? "Отправлено"
                : "Сохранить CDEK"}
            </button>
          </form>
        )}
        {OrderData.order.status === "Закуплен" &&
          (UserData.userData.position === "Администратор" ||
            UserData.userData.position === "Создатель") && (
            <button
              onClick={openSubmitPopup}
              className={`${styles["delivery__submit-button"]} ${styles["delivery__submit-button_status"]}`}
              type="button"
            >
              На складе в РФ
            </button>
          )}
        {OrderData.order.status === "Доставляется" &&
          (UserData.userData.position === "Администратор" ||
            UserData.userData.position === "Создатель") && (
            <button
              onClick={openSubmitPopup}
              className={styles["delivery__submit-button"]}
              type="button"
            >
              Завершён
            </button>
          )}
      </div>
      {OrderData.order.status === "Закуплен" && (
        <SubmitPopup
          isSubmitPopup={isSubmitPopup}
          submitText="Изменить статус на На складе в РФ"
          onSubmit={handleInStockInRussia}
          closeSubmitPopup={closeSubmitPopup}
        />
      )}
      <SubmitPopup
        isSubmitPopup={isSubmitChangePopup}
        submitText="Сохранить код или изменить статус на Доставляется"
        onSubmit={handleOrderSent}
        closeSubmitPopup={closeSubmitChangePopup}
      />
      <SubmitPopup
        isSubmitPopup={isSubmitChangePhonePopup}
        submitText="Изменить номер телефона получателя"
        onSubmit={handleUpdateDeliveryPhone}
        closeSubmitPopup={closeSubmitChangePhonePopup}
      />
      <SubmitPopup
        isSubmitPopup={isSubmitChangeNamePopup}
        submitText="Изменить ФИО получателя"
        onSubmit={handleUpdateDeliveryName}
        closeSubmitPopup={closeSubmitChangeNamePopup}
      />
      <SubmitPopup
        isSubmitPopup={isSubmitChangePackagesPopup}
        submitText={`Изменить кол-во мест на ${data.delivery_packages}`}
        onSubmit={handleChangePackages}
        closeSubmitPopup={closeSubmitChangePackagesPopup}
      />
      <SubmitPopup
        isSubmitPopup={isSubmitChangeNumberPopup}
        submitText={`Изменить номер на ${data.delivery_number}`}
        onSubmit={handleChangeNumber}
        closeSubmitPopup={closeSubmitChangeNumberPopup}
      />
      <SubmitPopup
        isSubmitPopup={isSubmitChangeInsurancePopup}
        submitText={`Изменить cумму страховки заказа на ${data.delivery_insurance}₽`}
        onSubmit={handleChangeInsurance}
        closeSubmitPopup={closeSubmitChangeInsurancePopup}
      />
      <SubmitPopup
        isSubmitPopup={isSubmitChangeSizePopup}
        submitText={`Изменить размеры коробок на ${data.delivery_length} x ${data.delivery_width} x ${data.delivery_height}`}
        onSubmit={handleChangeSize}
        closeSubmitPopup={closeSubmitChangeSizePopup}
      />
      {OrderData.order.status === "Доставляется" && (
        <SubmitPopup
          isSubmitPopup={isSubmitPopup}
          submitText="Изменить статус на Завершён"
          onSubmit={handleOrderСompleted}
          closeSubmitPopup={closeSubmitPopup}
        />
      )}
      <ChangeAddress isWidjet={isWidjet} closeWidjet={closeWidjet} />
    </section>
  );
};

export default Delivery;
