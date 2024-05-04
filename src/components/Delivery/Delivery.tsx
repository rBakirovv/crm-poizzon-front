import styles from "./Delivery.module.css";
import OrderData from "../../store/order";
import UserData from "../../store/user";
import WarehouseData from "../../store/warehouse";
import TextInput from "../UI/TextInput/TextInput";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import {
  inStockInRussia,
  orderSent,
  orderСompleted,
  deliveryAuthorization,
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
  updateDeliveryTg,
  uploadImages,
  updateReceiptImages,
  deleteReceiptImage,
  setIsReceiptImages,
  orderDeliveryCode,
  getRecentlyArrived,
  setIsPost,
  setExpressCost,
  changeComment,
} from "../../utils/Order";
import SubmitPopup from "../SubmitPopup/SubmitPopup";
import Preloader from "../UI/Preloader/Preloader";
import ChangeAddress from "../UI/ChangeAddress/ChangeAddress";
import Dropzone from "react-dropzone";
import { BASE_URL, EXPRESS_PRICE } from "../../utils/constants";
import ImagePopup from "../ImagePopup/ImagePopup";

const dayjs = require("dayjs");

var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("Europe/Moscow");

const Delivery = observer(() => {
  const [data, setData] = useState({
    delivery_code: OrderData.order.deliveryCode,
    delivery_address: OrderData.order.deliveryAddress,
    delivery_phone: OrderData.order.deliveryPhone,
    delivery_name: OrderData.order.deliveryNameRecipient,
    delivery_tg: OrderData.order.deliveryName,
    delivery_packages: 1,
    delivery_number:
      OrderData.order.combinedOrder.length > 0 ? 0 : OrderData.order.orderId,
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
    delivery_length: OrderData.order.combinedOrder.length > 0 ? 0 : 37,
    delivery_width: OrderData.order.combinedOrder.length > 0 ? 0 : 27,
    delivery_height: OrderData.order.combinedOrder.length > 0 ? 0 : 17,
  });

  const MAX_SIZE = 5242880 * 4;

  const [uploading, setUploading] = useState<boolean>(false);

  const [isDrag, setIsDrag] = useState(false);

  const [isSubmitPopup, setIsSubmitPopup] = useState(false);
  const [isSubmitChangePopup, setIsSubmitChangePopup] = useState(false);
  const [isSubmitChangePhonePopup, setIsSubmitChangePhonePopup] =
    useState(false);
  const [isSubmitChangeNamePopup, setIsSubmitChangeNamePopup] = useState(false);
  const [isSubmitChangeTgPopup, setIsSubmitChangeTgPopup] = useState(false);
  const [isSubmitChangePackagesPopup, setIsSubmitChangePackagesPopup] =
    useState(false);
  const [isSubmitChangeNumberPopup, setIsSubmitChangeNumberPopup] =
    useState(false);
  const [isSubmitChangeInsurancePopup, setIsSubmitChangeInsurancePopup] =
    useState(false);
  const [isSubmitChangeSizePopup, setIsSubmitChangeSizePopup] = useState(false);
  const [isCombinedCDEKPopup, setIsCombinedCDEKPopup] = useState(false);

  const [isChangePhone, setIsChangePhone] = useState(false);
  const [isChangeName, setIsChangeName] = useState(false);
  const [isChangeTg, setIsChangeTg] = useState(false);

  const [isPreloader, setIsPreloader] = useState(false);

  const [isWidjet, setIsWidjet] = useState(false);

  const [isImagePopupOpen, setIsImagePopupOpen] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<string>("");

  const [isSubmitIsReceiptImagesChange, setIsSubmitIsReceiptImagesChange] =
    useState<boolean>(false);

  const [isSubmitPostChange, setIsSubmitPostChange] = useState<boolean>(false);
  const [isSubmitExpressChange, setIsSubmitExpressChange] =
    useState<boolean>(false);

  function dragHandler() {
    setIsDrag(true);
  }

  function dragLeaveHandler() {
    setIsDrag(false);
  }

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

  function openSubmitChangeTgPopup() {
    setIsSubmitChangeTgPopup(true);
  }

  function closeSubmitChangeTgPopup() {
    setIsSubmitChangeTgPopup(false);
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

  function openSubmitPostChange() {
    setIsSubmitPostChange(true);
  }

  function closeSubmitPostChange() {
    setIsSubmitPostChange(false);
  }

  function openSubmitExpressChange() {
    setIsSubmitExpressChange(true);
  }

  function closeSubmitExpressChange() {
    setIsSubmitExpressChange(false);
  }

  function openCombinedCDEKPopup(e: React.SyntheticEvent) {
    e.preventDefault();
    setIsCombinedCDEKPopup(true);
  }

  function closeCombinedCDEKPopup() {
    setIsCombinedCDEKPopup(false);
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
    inStockInRussia(OrderData.order._id, UserData.userData.name)
      .then((order) => {
        OrderData.setOrder(order);
      })
      .then(() => {
        getRecentlyArrived().then((orders) => {
          WarehouseData.setOrdersRecentlyArrived(orders);
        });
      });
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

  function handleChangeTg() {
    setIsChangeTg(true);
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
    if (OrderData.order.deliveryEntity !== "") {
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
    } else {
      setIsPreloader(true);
      updateDeliveryPhone(OrderData.order._id, data.delivery_phone!)
        .then((order) => {
          OrderData.setOrder(order);
        })
        .then(() => {
          if (OrderData.order.combinedOrder.length > 0) {
            OrderData.order.combinedOrder[0].combinedOrder.map((orderItem) => {
              if (OrderData.order._id !== orderItem) {
                updateDeliveryPhone(orderItem, data.delivery_phone!);
              }
            });
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
    }
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

  function handleUpdateTg() {
    setIsPreloader(true);
    updateDeliveryTg(OrderData.order._id, data.delivery_tg!)
      .then((order) => {
        OrderData.setOrder(order);
      })
      .then(() => {
        if (OrderData.order.combinedOrder.length > 0) {
          OrderData.order.combinedOrder[0].combinedOrder.map((orderItem) => {
            if (OrderData.order._id !== orderItem) {
              updateDeliveryTg(orderItem, data.delivery_tg!);
            }
          });
        }
      })
      .then(() => {
        setIsPreloader(false);
        setIsChangeTg(false);
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

  function openPDFBarcodeHandler() {
    deliveryAuthorization()
      .then((authData) => {
        setIsPreloader(true);

        createDeliveryBarcode(authData.token, OrderData.order.deliveryEntity)
          .then((deliveryDocument) => {
            if (OrderData.order.deliveryCode === "") {
              getDeliveryInfo(authData.token, OrderData.order.deliveryEntity)
                .then((orderData) => {
                  updateDeliveryCDEKCode(
                    OrderData.order._id,
                    orderData.entity.cdek_number
                  )
                    .then((updatedOrderData) => {
                      OrderData.setOrder(updatedOrderData);
                      setData({
                        delivery_code: updatedOrderData.deliveryCode,
                        delivery_address: OrderData.order.deliveryAddress,
                        delivery_phone: OrderData.order.deliveryPhone,
                        delivery_name: OrderData.order.deliveryNameRecipient,
                        delivery_tg: OrderData.order.deliveryName,
                        delivery_packages: 1,
                        delivery_number: data.delivery_number,
                        delivery_insurance: data.delivery_insurance,
                        delivery_length: data.delivery_length,
                        delivery_width: data.delivery_width,
                        delivery_height: data.delivery_height,
                      });
                      if (OrderData.order.combinedOrder.length > 0) {
                        OrderData.order.combinedOrder[0].combinedOrder.map(
                          (orderItem) => {
                            if (OrderData.order._id !== orderItem) {
                              changeComment(
                                orderItem,
                                `Позиция ${OrderData.order.orderId} отправлена, создайте дубликат!`
                              );
                              /*
                              updateDeliveryCDEKCode(
                                orderItem,
                                orderData.entity.cdek_number
                              ).catch((err) => {
                                setIsPreloader(false);
                                console.log(err);
                              });
                              */
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
            }, 2500);
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

  // Изображение квитанции

  const uploadFileHandler = async (
    e: any, // Костыль!
    folder: string,
    setUploading: React.Dispatch<React.SetStateAction<boolean>>,
    multiple = true
  ) => {
    const formData = new FormData();

    setUploading(true);

    const ext = e[0].path.split(".").pop().toLowerCase();

    if (multiple) {
      const files = e;

      for (let i = 0; i < files.length; i++) {
        ext !== "heic" &&
          ext !== "heif" &&
          formData.append("imagesUp", files[i]);
      }
    } else {
      const file = e;
      ext !== "heic" && ext !== "heif" && formData.append("imagesUp", file[0]);
    }

    if (ext !== "heic" && ext !== "heif") {
      try {
        await uploadImages(formData, folder)
          .then((data) => {
            OrderData.setOrder({
              _id: OrderData.order._id,
              creater: OrderData.order.creater,
              buyer: OrderData.order.buyer,
              stockman: OrderData.order.stockman,
              createdAt: OrderData.order.createdAt,
              overudeAfter: OrderData.order.overudeAfter,
              payBeforeSplit: OrderData.order.payBeforeSplit,
              paidAt: OrderData.order.paidAt,
              buyAt: OrderData.order.buyAt,
              inChinaStockAt: OrderData.order.inChinaStockAt,
              inRussiaStockAt: OrderData.order.inRussiaStockAt,
              deliveredAt: OrderData.order.deliveredAt,
              orderId: OrderData.order.orderId,
              combinedOrder: OrderData.order.combinedOrder,
              status: OrderData.order.status,
              link: OrderData.order.link,
              payLink: OrderData.order.payLink,
              payLinkSplit: OrderData.order.payLinkSplit,
              paymentUUID: OrderData.order.paymentUUID,
              paymentUUIDSplit: OrderData.order.paymentUUIDSplit,
              payLinkSplitSecond: OrderData.order.payLinkSplitSecond,
              paymentUUIDSplitSecond: OrderData.order.paymentUUIDSplitSecond,
              isSplitPaid: OrderData.order.isSplitPaid,
              isSplitPaidSecond: OrderData.order.isSplitPaidSecond,
              paidAtSplit: OrderData.order.paidAtSplit,
              paidAtSplitSecond: OrderData.order.paidAtSplitSecond,
              category: OrderData.order.category,
              subcategory: OrderData.order.subcategory,
              brand: OrderData.order.brand,
              model: OrderData.order.model,
              size: OrderData.order.size,
              orderImages: OrderData.order.orderImages,
              payProofImages: OrderData.order.payProofImages,
              buyProofImages: OrderData.order.buyProofImages,
              receiptImages: OrderData.order.receiptImages.concat(data.data),
              uploadedBuyProofImages: OrderData.order.uploadedBuyProofImages,
              uploadedReceiptImages: OrderData.order.uploadedReceiptImages,
              isReceiptImages: OrderData.order.isReceiptImages,
              isSplit: OrderData.order.isSplit,
              payment: OrderData.order.payment,
              currentRate: OrderData.order.currentRate,
              priceCNY: OrderData.order.priceCNY,
              priceDeliveryChina: OrderData.order.priceDeliveryChina,
              priceDeliveryRussia: OrderData.order.priceDeliveryRussia,
              commission: OrderData.order.commission,
              promoCodePercent: OrderData.order.promoCodePercent,
              comment: OrderData.order.comment,
              poizonCode: OrderData.order.poizonCode,
              filledPoizonCode: OrderData.order.filledPoizonCode,
              deliveryCode: OrderData.order.deliveryCode,
              deliveryName: OrderData.order.deliveryName,
              deliveryNameRecipient: OrderData.order.deliveryNameRecipient,
              deliveryPhone: OrderData.order.deliveryPhone,
              deliveryPhoneRecipient: OrderData.order.deliveryPhoneRecipient,
              deliveryMethod: OrderData.order.deliveryMethod,
              deliveryAddress: OrderData.order.deliveryAddress,
              deliveryEntity: OrderData.order.deliveryEntity,
              deliveryRelatedEntities: OrderData.order.deliveryRelatedEntities,
              reorder: OrderData.order.reorder,
              totalReorder: OrderData.order.totalReorder,
              payLinksArray: OrderData.order.payLinksArray,
              splitLinksArray: OrderData.order.splitLinksArray,
              splitSecondLinksArray: OrderData.order.splitSecondLinksArray,
              isPost: OrderData.order.isPost,
              isPurchaseImagesDisabled:
                OrderData.order.isPurchaseImagesDisabled,
              expressCost: OrderData.order.expressCost,
              payLinkExpress: OrderData.order.payLinkExpress,
              payLinkSplitExpress: OrderData.order.payLinkSplitExpress,
              payLinkSplitSecondExpress:
                OrderData.order.payLinkSplitSecondExpress,
              paymentUUIDExpress: OrderData.order.paymentUUIDExpress,
              paymentUUIDSplitExpress: OrderData.order.paymentUUIDSplitExpress,
              paymentUUIDSplitSecondExpress:
                OrderData.order.paymentUUIDSplitSecondExpress,
              payLinksExpressArray: OrderData.order.payLinksExpressArray,
              splitLinksExpressArray: OrderData.order.splitLinksExpressArray,
              splitSecondLinksExpressArray:
                OrderData.order.splitSecondLinksExpressArray,
              isSurcharge: OrderData.order.isSurcharge,
              surchargePayLink: OrderData.order.surchargePayLink,
              surchargeUUID: OrderData.order.surchargeUUID,
              surchargePayLinksArray: OrderData.order.surchargePayLinksArray,
              surchargeTotal: OrderData.order.surchargeTotal,
              __v: OrderData.order.__v,
            });
          })
          .then(() => {
            setUploading(false);
            dragLeaveHandler();
          });
      } catch (error) {
        dragLeaveHandler();
        console.error(error);
      }

      await updateReceiptImages(
        OrderData.order._id,
        OrderData.order.receiptImages,
        UserData.userData.name
      ).then((order) => OrderData.setOrder(order));
    } else {
      const heic2any = await import("heic2any");

      const files = e;

      files.forEach((item: any, index: any) => {
        heic2any
          .default({ blob: e[index], toType: "image/jpeg" })
          .then((fileBlob: any) => {
            const newFile = new File([fileBlob], e[index].name + ".jpg", {
              type: "image/jpeg",
            });

            return newFile;
          })
          .then((newFile) => formData.append("imagesUp", newFile));
      });

      setTimeout(() => {
        try {
          uploadImages(formData, folder)
            .then((data) => {
              setUploading(true);
              OrderData.setOrder({
                _id: OrderData.order._id,
                creater: OrderData.order.creater,
                buyer: OrderData.order.buyer,
                stockman: OrderData.order.stockman,
                createdAt: OrderData.order.createdAt,
                overudeAfter: OrderData.order.overudeAfter,
                payBeforeSplit: OrderData.order.payBeforeSplit,
                paidAt: OrderData.order.paidAt,
                buyAt: OrderData.order.buyAt,
                inChinaStockAt: OrderData.order.inChinaStockAt,
                inRussiaStockAt: OrderData.order.inRussiaStockAt,
                deliveredAt: OrderData.order.deliveredAt,
                orderId: OrderData.order.orderId,
                combinedOrder: OrderData.order.combinedOrder,
                status: OrderData.order.status,
                link: OrderData.order.link,
                payLink: OrderData.order.payLink,
                payLinkSplit: OrderData.order.payLinkSplit,
                paymentUUID: OrderData.order.paymentUUID,
                paymentUUIDSplit: OrderData.order.paymentUUIDSplit,
                payLinkSplitSecond: OrderData.order.payLinkSplitSecond,
                paymentUUIDSplitSecond: OrderData.order.paymentUUIDSplitSecond,
                isSplitPaid: OrderData.order.isSplitPaid,
                isSplitPaidSecond: OrderData.order.isSplitPaidSecond,
                paidAtSplit: OrderData.order.paidAtSplit,
                paidAtSplitSecond: OrderData.order.paidAtSplitSecond,
                category: OrderData.order.category,
                subcategory: OrderData.order.subcategory,
                brand: OrderData.order.brand,
                model: OrderData.order.model,
                size: OrderData.order.size,
                orderImages: OrderData.order.orderImages,
                payProofImages: OrderData.order.payProofImages,
                buyProofImages: OrderData.order.buyProofImages,
                receiptImages: OrderData.order.receiptImages.concat(data.data),
                uploadedBuyProofImages: OrderData.order.uploadedBuyProofImages,
                uploadedReceiptImages: OrderData.order.uploadedReceiptImages,
                isReceiptImages: OrderData.order.isReceiptImages,
                isSplit: OrderData.order.isSplit,
                payment: OrderData.order.payment,
                currentRate: OrderData.order.currentRate,
                priceCNY: OrderData.order.priceCNY,
                priceDeliveryChina: OrderData.order.priceDeliveryChina,
                priceDeliveryRussia: OrderData.order.priceDeliveryRussia,
                commission: OrderData.order.commission,
                promoCodePercent: OrderData.order.promoCodePercent,
                comment: OrderData.order.comment,
                poizonCode: OrderData.order.poizonCode,
                filledPoizonCode: OrderData.order.filledPoizonCode,
                deliveryCode: OrderData.order.deliveryCode,
                deliveryName: OrderData.order.deliveryName,
                deliveryNameRecipient: OrderData.order.deliveryNameRecipient,
                deliveryPhone: OrderData.order.deliveryPhone,
                deliveryPhoneRecipient: OrderData.order.deliveryPhoneRecipient,
                deliveryMethod: OrderData.order.deliveryMethod,
                deliveryAddress: OrderData.order.deliveryAddress,
                deliveryEntity: OrderData.order.deliveryEntity,
                deliveryRelatedEntities:
                  OrderData.order.deliveryRelatedEntities,
                reorder: OrderData.order.reorder,
                totalReorder: OrderData.order.totalReorder,
                payLinksArray: OrderData.order.payLinksArray,
                splitLinksArray: OrderData.order.splitLinksArray,
                splitSecondLinksArray: OrderData.order.splitSecondLinksArray,
                isPost: OrderData.order.isPost,
                isPurchaseImagesDisabled:
                  OrderData.order.isPurchaseImagesDisabled,
                expressCost: OrderData.order.expressCost,
                payLinkExpress: OrderData.order.payLinkExpress,
                payLinkSplitExpress: OrderData.order.payLinkSplitExpress,
                payLinkSplitSecondExpress:
                  OrderData.order.payLinkSplitSecondExpress,
                paymentUUIDExpress: OrderData.order.paymentUUIDExpress,
                paymentUUIDSplitExpress:
                  OrderData.order.paymentUUIDSplitExpress,
                paymentUUIDSplitSecondExpress:
                  OrderData.order.paymentUUIDSplitSecondExpress,
                payLinksExpressArray: OrderData.order.payLinksExpressArray,
                splitLinksExpressArray: OrderData.order.splitLinksExpressArray,
                splitSecondLinksExpressArray:
                  OrderData.order.splitSecondLinksExpressArray,
                isSurcharge: OrderData.order.isSurcharge,
                surchargePayLink: OrderData.order.surchargePayLink,
                surchargeUUID: OrderData.order.surchargeUUID,
                surchargePayLinksArray: OrderData.order.surchargePayLinksArray,
                surchargeTotal: OrderData.order.surchargeTotal,
                __v: OrderData.order.__v,
              });
            })
            .then(() => {
              updateReceiptImages(
                OrderData.order._id,
                OrderData.order.receiptImages,
                UserData.userData.name
              ).then((order) => OrderData.setOrder(order));
            })
            .then(() => {
              setUploading(false);
              dragLeaveHandler();
            });
        } catch (error) {
          dragLeaveHandler();
          console.error(error);
        }
      }, files.length * 5000);
    }
  };

  function deleteImageHandler(imageName: string) {
    deleteReceiptImage(imageName, OrderData.order._id)
      .then(() => {
        OrderData.setOrder({
          _id: OrderData.order._id,
          creater: OrderData.order.creater,
          buyer: OrderData.order.buyer,
          stockman: OrderData.order.stockman,
          createdAt: OrderData.order.createdAt,
          overudeAfter: OrderData.order.overudeAfter,
          payBeforeSplit: OrderData.order.payBeforeSplit,
          paidAt: OrderData.order.paidAt,
          buyAt: OrderData.order.buyAt,
          inChinaStockAt: OrderData.order.inChinaStockAt,
          inRussiaStockAt: OrderData.order.inRussiaStockAt,
          deliveredAt: OrderData.order.deliveredAt,
          orderId: OrderData.order.orderId,
          combinedOrder: OrderData.order.combinedOrder,
          status: OrderData.order.status,
          link: OrderData.order.link,
          payLink: OrderData.order.payLink,
          payLinkSplit: OrderData.order.payLinkSplit,
          paymentUUID: OrderData.order.paymentUUID,
          paymentUUIDSplit: OrderData.order.paymentUUIDSplit,
          payLinkSplitSecond: OrderData.order.payLinkSplitSecond,
          paymentUUIDSplitSecond: OrderData.order.paymentUUIDSplitSecond,
          isSplitPaid: OrderData.order.isSplitPaid,
          isSplitPaidSecond: OrderData.order.isSplitPaidSecond,
          paidAtSplit: OrderData.order.paidAtSplit,
          paidAtSplitSecond: OrderData.order.paidAtSplitSecond,
          category: OrderData.order.category,
          subcategory: OrderData.order.subcategory,
          brand: OrderData.order.brand,
          model: OrderData.order.model,
          size: OrderData.order.size,
          orderImages: OrderData.order.orderImages,
          payProofImages: OrderData.order.payProofImages,
          buyProofImages: OrderData.order.buyProofImages,
          receiptImages: OrderData.order.receiptImages.filter(
            (imageItem) => imageItem.name !== imageName
          ),
          uploadedBuyProofImages: OrderData.order.uploadedBuyProofImages,
          uploadedReceiptImages: OrderData.order.uploadedReceiptImages,
          isReceiptImages: OrderData.order.isReceiptImages,
          isSplit: OrderData.order.isSplit,
          payment: OrderData.order.payment,
          currentRate: OrderData.order.currentRate,
          priceCNY: OrderData.order.priceCNY,
          priceDeliveryChina: OrderData.order.priceDeliveryChina,
          priceDeliveryRussia: OrderData.order.priceDeliveryRussia,
          commission: OrderData.order.commission,
          promoCodePercent: OrderData.order.promoCodePercent,
          comment: OrderData.order.comment,
          poizonCode: OrderData.order.poizonCode,
          filledPoizonCode: OrderData.order.filledPoizonCode,
          deliveryCode: OrderData.order.deliveryCode,
          deliveryName: OrderData.order.deliveryName,
          deliveryNameRecipient: OrderData.order.deliveryNameRecipient,
          deliveryPhone: OrderData.order.deliveryPhone,
          deliveryPhoneRecipient: OrderData.order.deliveryPhoneRecipient,
          deliveryMethod: OrderData.order.deliveryMethod,
          deliveryAddress: OrderData.order.deliveryAddress,
          deliveryEntity: OrderData.order.deliveryEntity,
          deliveryRelatedEntities: OrderData.order.deliveryRelatedEntities,
          reorder: OrderData.order.reorder,
          totalReorder: OrderData.order.totalReorder,
          payLinksArray: OrderData.order.payLinksArray,
          splitLinksArray: OrderData.order.splitLinksArray,
          splitSecondLinksArray: OrderData.order.splitSecondLinksArray,
          isPost: OrderData.order.isPost,
          isPurchaseImagesDisabled: OrderData.order.isPurchaseImagesDisabled,
          expressCost: OrderData.order.expressCost,
          payLinkExpress: OrderData.order.payLinkExpress,
          payLinkSplitExpress: OrderData.order.payLinkSplitExpress,
          payLinkSplitSecondExpress: OrderData.order.payLinkSplitSecondExpress,
          paymentUUIDExpress: OrderData.order.paymentUUIDExpress,
          paymentUUIDSplitExpress: OrderData.order.paymentUUIDSplitExpress,
          paymentUUIDSplitSecondExpress:
            OrderData.order.paymentUUIDSplitSecondExpress,
          payLinksExpressArray: OrderData.order.payLinksExpressArray,
          splitLinksExpressArray: OrderData.order.splitLinksExpressArray,
          splitSecondLinksExpressArray:
            OrderData.order.splitSecondLinksExpressArray,
          isSurcharge: OrderData.order.isSurcharge,
          surchargePayLink: OrderData.order.surchargePayLink,
          surchargeUUID: OrderData.order.surchargeUUID,
          surchargePayLinksArray: OrderData.order.surchargePayLinksArray,
          surchargeTotal: OrderData.order.surchargeTotal,
          __v: OrderData.order.__v,
        });
      })
      .then(() => {
        updateReceiptImages(
          OrderData.order._id,
          OrderData.order.receiptImages,
          ""
        );
      })
      .catch(console.error);
  }

  function openImagePopup(imageSrc: string) {
    setCurrentImage(imageSrc);
    setIsImagePopupOpen(true);
  }

  function closeImagePopup() {
    setIsImagePopupOpen(false);
  }

  function handlesIsReceiptImagesChange() {
    setIsReceiptImages(
      OrderData.order._id,
      !OrderData.order.isReceiptImages
    ).then((data) => {
      OrderData.setOrder(data);
    });
  }

  function openSubmitIsReceiptImagesPopup(e: React.SyntheticEvent) {
    e.preventDefault();
    setIsSubmitIsReceiptImagesChange(true);
  }

  function closeSubmitIsReceiptImagesPopup() {
    setIsSubmitIsReceiptImagesChange(false);
  }

  function handleChangeCombinedCDEK() {
    OrderData.order.combinedOrder[0].combinedOrder.map((orderItem) => {
      if (OrderData.order._id !== orderItem) {
        orderDeliveryCode(orderItem, data.delivery_code);
      }
    });
  }

  function handleChangePost() {
    setIsPost(OrderData.order._id, !OrderData.order.isPost).then((order) => {
      OrderData.setOrder(order);
    });
  }

  function handleChangeExpress() {
    setExpressCost(
      OrderData.order._id,
      OrderData.order.expressCost === 0 ? EXPRESS_PRICE : 0
    ).then((order) => {
      OrderData.setOrder(order);
    });
  }

  return (
    <section className={styles["delivery"]}>
      {isPreloader && <Preloader />}
      <div className={styles["delivery__container"]}>
        {OrderData.order.inRussiaStockAt && (
          <p>
            На складе в РФ:{" "}
            {dayjs
              .tz(new Date(OrderData.order.inRussiaStockAt!))
              .format("DD.MM.YYYY в HH:mm")}
          </p>
        )}
        {OrderData.order.deliveryAddress !== "" &&
          OrderData.order.deliveryEntity !== "" &&
          OrderData.order.payment !== "Сплит -" &&
          !OrderData.order.isPost && (
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
          OrderData.order.deliveryEntity !== "" &&
          OrderData.order.payment === "Сплит -" &&
          OrderData.order.isSplit &&
          OrderData.order.isSplitPaid &&
          OrderData.order.isSplitPaidSecond &&
          !OrderData.order.isPost && (
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
          OrderData.order.deliveryEntity !== "" &&
          OrderData.order.payment === "Сплит -" &&
          !OrderData.order.isSplit &&
          !OrderData.order.isPost && (
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
        <div
          className={styles["delivery-receipt__chekbox-container"]}
          style={{ marginBottom: 0, marginTop: "0.5rem" }}
        >
          <input
            type="checkbox"
            checked={OrderData.order.isPost}
            onChange={openSubmitPostChange}
            disabled={
              OrderData.order.status === "Завершён" ||
              OrderData.order.status === "Доставляется"
            }
          />
          <label>Почта РФ</label>
        </div>
        <div
          className={styles["delivery-receipt__chekbox-container"]}
          style={{ marginBottom: 0, marginTop: "0.5rem" }}
        >
          <input
            type="checkbox"
            checked={OrderData.order.expressCost > 0}
            onChange={openSubmitExpressChange}
            disabled={
              OrderData.order.status === "Завершён" ||
              OrderData.order.status === "Доставляется"
            }
          />
          <label>Экспресс</label>
        </div>
        <div className={styles["delivery-packages__container"]}>
          {OrderData.order.deliveryAddress !== "" &&
            OrderData.order.deliveryEntity !== "" && (
              <div>
                <h4 style={{ marginTop: 0 }}>Размеры коробки</h4>
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
                    <option value="extra_large">
                      Extra Large 45 * 36 * 21
                    </option>
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
              </div>
            )}
          {OrderData.order.deliveryAddress !== "" &&
            OrderData.order.deliveryEntity !== "" && (
              <div>
                <div className={styles["delivery-packages"]}>
                  <h4 style={{ marginTop: 0 }}>Cумма страховки</h4>
                  <input
                    className={styles["delivery-packages-number-input"]}
                    type="number"
                    name="delivery_insurance"
                    value={data.delivery_insurance}
                    onChange={handleChange}
                  />
                  <button
                    onClick={openSubmitChangeInsurancePopup}
                    style={{ marginTop: "0.5rem" }}
                  >
                    Cохр.
                  </button>
                </div>
                <div className={styles["delivery-packages"]}>
                  <h4>Номер на коробке</h4>
                  <input
                    className={styles["delivery-packages-number-input"]}
                    type="number"
                    name="delivery_number"
                    value={data.delivery_number}
                    onChange={handleChange}
                  />
                  {OrderData.order.combinedOrder.length > 0 && (
                    <button onClick={openSubmitChangeNumberPopup}>Cохр.</button>
                  )}
                </div>
                <div className={styles["delivery-packages"]}>
                  <h4>Кол-во мест</h4>
                  <input
                    className={styles["delivery-packages-number-input"]}
                    type="number"
                    name="delivery_packages"
                    value={data.delivery_packages}
                    onChange={handleChange}
                  />
                  {OrderData.order.combinedOrder.length > 0 && (
                    <button onClick={openSubmitChangePackagesPopup}>
                      Cохр.
                    </button>
                  )}
                </div>
              </div>
            )}
          <div className={styles["delivery-warehouseworker__extra-info"]}>
            {UserData.userData.position === "Работник склада" && (
              <div>
                <TextInput
                  name="deliveryName"
                  label="@Tg"
                  value={OrderData.order.deliveryName as any}
                  handleChange={handleChange}
                  required={false}
                  disabled={true}
                />
                <div className={styles["delivery-copy"]} onClick={copyTg}>
                  Скопировать
                </div>
              </div>
            )}
            {UserData.userData.position === "Работник склада" && (
              <div>
                <TextInput
                  name="deliveryNameRecipient"
                  label="ФИО"
                  value={OrderData.order.deliveryNameRecipient as any}
                  handleChange={handleChange}
                  required={false}
                  disabled={true}
                />
                <div className={styles["delivery-copy"]} onClick={copyName}>
                  Скопировать
                </div>
              </div>
            )}
            {UserData.userData.position === "Работник склада" && (
              <div>
                <TextInput
                  name="deliveryNameRecipient"
                  label="Номер телефона"
                  value={OrderData.order.deliveryPhone as any}
                  handleChange={handleChange}
                  required={false}
                  disabled={true}
                />
                <div className={styles["delivery-copy"]} onClick={copyPhone}>
                  Скопировать
                </div>
              </div>
            )}
            <TextInput
              name="model"
              label="Модель"
              value={OrderData.order.model}
              handleChange={handleChange}
              required={false}
              disabled={true}
            />
            <TextInput
              name="size"
              label="Размер"
              value={OrderData.order.size}
              handleChange={handleChange}
              required={false}
              disabled={true}
            />
          </div>
        </div>
        <div className={styles["delivery__data-container"]}>
          {UserData.userData.position !== "Менеджер" &&
            UserData.userData.position !== "Байер" &&
            OrderData.order.deliveryNameRecipient && (
              <form
                className={`${styles["delivery-form"]} ${
                  UserData.userData.position === "Работник склада" &&
                  styles["delivery-form_warehouse"]
                }`}
              >
                {(OrderData.order.status === "На складе в РФ" ||
                  OrderData.order.status === "Доставляется" ||
                  OrderData.order.status === "Завершён") && (
                  <>
                    <h4>Фотографии квитанции</h4>
                    {OrderData.order.receiptImages.length > 0 &&
                      OrderData.order.uploadedReceiptImages !== "" && (
                        <p>
                          Фотографии квитанции{" "}
                          <span>
                            загрузил:{" "}
                            <strong>
                              {OrderData.order.uploadedReceiptImages}
                            </strong>
                          </span>
                        </p>
                      )}
                    {OrderData.order.receiptImages.length > 0 && (
                      <ul className={styles["delivery-receipt__images-list"]}>
                        {OrderData.order.receiptImages
                          .slice()
                          .reverse()
                          .map((image) => {
                            return (
                              <li
                                key={image.name}
                                className={styles["delivery-receipt__image"]}
                              >
                                {OrderData.order.status !== "Завершён" && (
                                  <div
                                    className={
                                      styles["delivery-receipt__delete-image"]
                                    }
                                    onClick={() =>
                                      deleteImageHandler(image.name)
                                    }
                                  >
                                    <svg
                                      width="18"
                                      height="20"
                                      viewBox="0 0 18 20"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M2.45763 18.1422C2.51857 18.8126 3.06711 19.3002 3.73754 19.3002H14.2612C14.9317 19.3002 15.4802 18.7923 15.5411 18.1422L16.7195 5.79004H1.2793L2.45763 18.1422Z"
                                        fill="black"
                                      />
                                      <path
                                        d="M16.7201 1.93002H11.5801V1.27991C11.5801 0.568849 11.0113 0 10.3002 0H7.72009C7.00903 0 6.44018 0.568849 6.44018 1.27991V1.93002H1.27991C0.568849 1.93002 0 2.49887 0 3.20993C0 3.92099 0.568849 4.48984 1.27991 4.48984H16.7201C17.4312 4.48984 18 3.92099 18 3.20993C18 2.49887 17.4312 1.93002 16.7201 1.93002Z"
                                        fill="black"
                                      />
                                    </svg>
                                  </div>
                                )}
                                <img
                                  className={
                                    styles["delivery-receipt__image-item"]
                                  }
                                  src={`${BASE_URL}${image.path}`}
                                  alt={image.name}
                                  crossOrigin="anonymous"
                                  onClick={() =>
                                    openImagePopup(`${BASE_URL}${image.path}`)
                                  }
                                />
                              </li>
                            );
                          })}
                      </ul>
                    )}
                    {OrderData.order.status !== "Завершён" && (
                      <Dropzone
                        onDrop={(e: any) =>
                          uploadFileHandler(e, "/order-receipt", setUploading)
                        }
                        onDragEnter={dragHandler}
                        onDragLeave={dragLeaveHandler}
                        maxSize={MAX_SIZE}
                        multiple={true}
                      >
                        {({ getRootProps, getInputProps }) => (
                          <div
                            className={`${styles["drag-n-drop-container"]} ${
                              isDrag && styles["drag-n-drop-container_active"]
                            }`}
                          >
                            <div {...getRootProps()}>
                              <input {...getInputProps()} />
                              <p className={styles["drag-n-drop-text"]}>
                                {isDrag
                                  ? "Перетащите фото"
                                  : "Добавить фото или ctrl + v"}
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
                              </p>
                            </div>
                          </div>
                        )}
                      </Dropzone>
                    )}
                    {OrderData.order.receiptImages.length !== 0 && (
                      <div
                        className={
                          styles["delivery-receipt__chekbox-container"]
                        }
                      >
                        <input
                          type="checkbox"
                          checked={OrderData.order.isReceiptImages}
                          onChange={openSubmitIsReceiptImagesPopup}
                          disabled={OrderData.order.status === "Завершён"}
                        />
                        <label>квитанция видна пользователю</label>
                      </div>
                    )}
                  </>
                )}
                <TextInput
                  label="Трек-номер CDEK"
                  name="delivery_code"
                  value={data.delivery_code}
                  required={false}
                  handleChange={handleChange}
                />
              </form>
            )}
          <div>
            <h4>Изображения товара</h4>
            <ul
              className={`${styles["delivery-receipt__images-list"]} ${styles["order"]}`}
            >
              {OrderData.order.orderImages
                .slice()
                .reverse()
                .map((image) => {
                  return (
                    <li
                      key={image.name}
                      className={styles["delivery-receipt__image"]}
                    >
                      <img
                        className={styles["delivery-receipt__image-item"]}
                        src={`${BASE_URL}${image.path}`}
                        alt={image.name}
                        crossOrigin="anonymous"
                        onClick={() =>
                          openImagePopup(`${BASE_URL}${image.path}`)
                        }
                      />
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
        {UserData.userData.position !== "Работник склада" && (
          <div>
            {OrderData.order.deliveryCode !== "" && (
              <div>
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
              </div>
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
                <div className={styles["delivery__input-container"]}>
                  {!isChangeTg && OrderData.order.deliveryName !== "" && (
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
                  )}
                  {isChangeTg && (
                    <input
                      className={styles["delivery__input"]}
                      type="text"
                      name="delivery_tg"
                      value={data.delivery_tg}
                      onChange={handleChange}
                      readOnly={!isChangeTg}
                    />
                  )}
                  {!isChangeTg && (
                    <button
                      className={styles["delivery__change"]}
                      onClick={handleChangeTg}
                    >
                      {"Изм."}
                    </button>
                  )}
                  {isChangeTg && (
                    <button
                      className={styles["delivery__change"]}
                      onClick={openSubmitChangeTgPopup}
                    >
                      {"Сохр."}
                    </button>
                  )}
                </div>
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
              {!isChangePhone && (
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
          </div>
        )}
        {OrderData.order.status !== "Завершён" && (
          <button
            onClick={openSubmitChangePopup}
            className={styles["delivery__submit-button"]}
            type="button"
          >
            {OrderData.order.status === "На складе в РФ"
              ? "Отправлено"
              : "Сохранить CDEK"}
          </button>
        )}
        {OrderData.order.combinedOrder.length > 0 &&
          OrderData.order.status !== "Завершён" && (
            <button
              onClick={openCombinedCDEKPopup}
              className={styles["delivery__submit-button"]}
              type="button"
            >
              CDEK ко всем закзам
            </button>
          )}
        {OrderData.order.status === "Закуплен" &&
          UserData.userData.position !== "Менеджер" &&
          UserData.userData.position !== "Байер" && (
            <button
              onClick={openSubmitPopup}
              className={`${styles["delivery__submit-button"]} ${styles["delivery__submit-button_status"]}`}
              type="button"
            >
              На складе в РФ
            </button>
          )}
        {OrderData.order.status === "Доставляется" &&
          UserData.userData.position !== "Менеджер" &&
          UserData.userData.position !== "Байер" && (
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
      <SubmitPopup
        isSubmitPopup={isSubmitChangeTgPopup}
        submitText={`Изменить Телеграм на ${data.delivery_tg}`}
        onSubmit={handleUpdateTg}
        closeSubmitPopup={closeSubmitChangeTgPopup}
      />
      <SubmitPopup
        isSubmitPopup={isSubmitIsReceiptImagesChange}
        submitText={`Квитанция ${
          OrderData.order.isReceiptImages ? "не" : ""
        } видна пользователю`}
        onSubmit={handlesIsReceiptImagesChange}
        closeSubmitPopup={closeSubmitIsReceiptImagesPopup}
      />
      <SubmitPopup
        isSubmitPopup={isCombinedCDEKPopup}
        submitText={`Изменить трек-номер CDEK ${data.delivery_code} всем объединённым заказам`}
        onSubmit={handleChangeCombinedCDEK}
        closeSubmitPopup={closeCombinedCDEKPopup}
      />
      <SubmitPopup
        isSubmitPopup={isSubmitPostChange}
        submitText={
          !OrderData.order.isPost
            ? "Изменить доставку на почту"
            : "Изменить доставку на СДЭК"
        }
        onSubmit={handleChangePost}
        closeSubmitPopup={closeSubmitPostChange}
      />
      <SubmitPopup
        isSubmitPopup={isSubmitExpressChange}
        submitText={
          OrderData.order.expressCost > 0
            ? "Изменить доставку на экспресс"
            : "Изменить доставку на экспресс"
        }
        onSubmit={handleChangeExpress}
        closeSubmitPopup={closeSubmitExpressChange}
      />
      <ChangeAddress isWidjet={isWidjet} closeWidjet={closeWidjet} />
      <ImagePopup
        isImagePopupOpen={isImagePopupOpen}
        currentImage={currentImage}
        closePopup={closeImagePopup}
      />
      {uploading && <Preloader />}
    </section>
  );
});

export default Delivery;
