import { useState } from "react";
import {
  changeOrderDeliveryPackages,
  changeTotalSum,
  createDeliveryBarcode,
  createDeliveryDocument,
  createOrderDeliveryDuplicate,
  deliveryAuthorization,
  getDeliveryBarcode,
  getDeliveryDocument,
  getDeliveryInfo,
  updateDeliveryCDEKCode,
  updateDeliveryDuplicate,
} from "../../utils/Order";
import SubmitPopup from "../SubmitPopup/SubmitPopup";
import styles from "./DeliveryDuplicate.module.css";
import OrderData from "../../store/order";
import Preloader from "../UI/Preloader/Preloader";

const DeliveryDuplicate = () => {
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

  const [isPreloader, setIsPreloader] = useState(false);

  const [isCreateDuplicate, setIsCreateDuplicate] = useState(false);
  const [isSubmitChangePackagesPopup, setIsSubmitChangePackagesPopup] =
    useState(false);
  const [isSubmitChangeNumberPopup, setIsSubmitChangeNumberPopup] =
    useState(false);
  const [isSubmitChangeInsurancePopup, setIsSubmitChangeInsurancePopup] =
    useState(false);
  const [isSubmitChangeSizePopup, setIsSubmitChangeSizePopup] = useState(false);

  const [isAccordion, setIsAccordion] = useState(false);

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

  function openCreateDuplicate() {
    setIsCreateDuplicate(true);
  }

  function closeCreateDuplicate() {
    setIsCreateDuplicate(false);
  }

  function accordionHandler() {
    setIsAccordion(!isAccordion);
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

  function handleCreateDuplicate() {
    deliveryAuthorization()
      .then((authData) => {
        getDeliveryInfo(authData.token, OrderData.order.deliveryEntity)
          .then((deliveryInfo) => {
            createOrderDeliveryDuplicate(
              authData.token,
              OrderData.order.deliveryRelatedEntities.includes("dupl")
                ? `${OrderData.order.deliveryRelatedEntities}-dupl`
                : `${deliveryInfo.entity.number}-dupl-${Math.floor(
                    Math.random() * 1000
                  )}`,
              deliveryInfo.entity.comment,
              deliveryInfo.entity.delivery_point,
              deliveryInfo.entity.packages,
              deliveryInfo.entity.delivery_recipient_cost.value,
              OrderData.order.deliveryPhone,
              OrderData.order.deliveryNameRecipient!,
              deliveryInfo.entity.tariff_code
            )
              .then((orderInfo) => {
                getDeliveryInfo(authData.token, orderInfo.entity.uuid)
                  .then((orderCheckInfo) => {
                    if (orderCheckInfo.requests[0].state !== "INVALID") {
                      updateDeliveryDuplicate(
                        OrderData.order._id,
                        orderInfo.entity.uuid
                      ).then((orderData) => {
                        OrderData.setOrder(orderData);
                        if (OrderData.order.combinedOrder.length > 0) {
                          OrderData.order.combinedOrder[0].combinedOrder.map(
                            (orderItem) => {
                              if (OrderData.order._id !== orderItem) {
                                updateDeliveryCDEKCode(
                                  orderItem,
                                  orderCheckInfo.entity.cdek_number
                                ).catch((err) => console.log(err));
                                updateDeliveryDuplicate(
                                  orderItem,
                                  orderInfo.entity.uuid
                                ).catch((err) => console.log(err));
                              }
                            }
                          );
                        }
                      });
                    }
                  })
                  .catch((err) => console.log(err));
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }

  function handleChangePackages() {
    deliveryAuthorization()
      .then((authData) => {
        getDeliveryInfo(authData.token, OrderData.order.deliveryRelatedEntities)
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
            getDeliveryInfo(
              authData.token,
              OrderData.order.deliveryRelatedEntities
            )
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
                    OrderData.order.deliveryRelatedEntities,
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
        getDeliveryInfo(authData.token, OrderData.order.deliveryRelatedEntities)
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
            getDeliveryInfo(
              authData.token,
              OrderData.order.deliveryRelatedEntities
            )
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
                    OrderData.order.deliveryRelatedEntities,
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
        getDeliveryInfo(authData.token, OrderData.order.deliveryRelatedEntities)
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
            getDeliveryInfo(
              authData.token,
              OrderData.order.deliveryRelatedEntities
            )
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
                    OrderData.order.deliveryRelatedEntities,
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
        getDeliveryInfo(authData.token, OrderData.order.deliveryRelatedEntities)
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
            getDeliveryInfo(
              authData.token,
              OrderData.order.deliveryRelatedEntities
            )
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
                    OrderData.order.deliveryRelatedEntities,
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
        createDeliveryDocument(
          authData.token,
          OrderData.order.deliveryRelatedEntities
        )
          .then((deliveryDocument) => {
            getDeliveryInfo(
              authData.token,
              OrderData.order.deliveryRelatedEntities
            )
              .then((orderData) => {
                if (
                  OrderData.order.deliveryCode !== orderData.entity.cdek_number
                ) {
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
                }
              })
              .catch((err) => {
                setIsPreloader(false);
                console.log(err);
              });
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
        createDeliveryBarcode(
          authData.token,
          OrderData.order.deliveryRelatedEntities
        )
          .then((deliveryDocument) => {
            getDeliveryInfo(
              authData.token,
              OrderData.order.deliveryRelatedEntities
            )
              .then((orderData) => {
                if (
                  OrderData.order.deliveryCode !== orderData.entity.cdek_number
                ) {
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
                }
              })
              .catch((err) => {
                setIsPreloader(false);
                console.log(err);
              });
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
    <section className={styles["delivery-duplicate"]}>
      {isPreloader && <Preloader />}
      <div className={styles["delivery-duplicate__container"]}>
        {OrderData.order.deliveryAddress !== "" &&
          OrderData.order.deliveryEntity !== "" && (
            <button
              onClick={openCreateDuplicate}
              className={styles["delivery-duplicate__create"]}
            >
              Cоздать дубликат квитанции
            </button>
          )}
        {OrderData.order.deliveryAddress !== "" &&
          OrderData.order.deliveryEntity !== "" &&
          OrderData.order.payment !== "Сплит -" && (
            <button
              className={styles["delivery-duplicate__document"]}
              onClick={openPDFBarcodeHandler}
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
          OrderData.order.isSplitPaid &&
          OrderData.order.isSplitPaidSecond &&
          OrderData.order.isSplit && (
            <button
              className={styles["delivery-duplicate__document"]}
              onClick={openPDFBarcodeHandler}
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
          !OrderData.order.isSplit && (
            <button
              className={styles["delivery-duplicate__document"]}
              onClick={openPDFBarcodeHandler}
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
            <div
              className={`${styles["accordion"]} ${
                isAccordion && styles["accordion_active"]
              }`}
            >
              <div
                className={styles["accordion-head"]}
                onClick={accordionHandler}
              >
                Редактировать дубликат
                <svg
                  className={styles["accordion-head-arrow"]}
                  width="18px"
                  height="18px"
                  viewBox="0 0 48 48"
                  focusable="false"
                  fill="black"
                >
                  <path fill="none" d="M0 0h48v48H0V0z"></path>
                  <path d="M40 24l-2.82-2.82L26 32.34V8h-4v24.34L10.84 21.16 8 24l16 16 16-16z"></path>
                </svg>
              </div>
              <div className={styles["accordion-body"]}>
                <div>
                  <div className={styles["delivery-packages"]}>
                    <h4>Кол-во мест</h4>
                    <input
                      className={styles["delivery-packages-number-input"]}
                      type="number"
                      name="delivery_packages"
                      value={data.delivery_packages}
                      onChange={handleChange}
                    />
                    <button onClick={openSubmitChangePackagesPopup}>
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
                    <button onClick={openSubmitChangeNumberPopup}>Cохр.</button>
                  </div>
                  <div className={styles["delivery-packages"]}>
                    <h4>Cумма страховки</h4>
                    <input
                      className={styles["delivery-packages-number-input"]}
                      type="number"
                      name="delivery_insurance"
                      value={data.delivery_insurance}
                      onChange={handleChange}
                    />
                    <button onClick={openSubmitChangeInsurancePopup}>
                      Cохр.
                    </button>
                  </div>
                </div>
                <div>
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
              </div>
            </div>
          )}
      </div>
      <SubmitPopup
        isSubmitPopup={isCreateDuplicate}
        submitText={`Cоздать дубликат квитанции`}
        onSubmit={handleCreateDuplicate}
        closeSubmitPopup={closeCreateDuplicate}
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
    </section>
  );
};

export default DeliveryDuplicate;
