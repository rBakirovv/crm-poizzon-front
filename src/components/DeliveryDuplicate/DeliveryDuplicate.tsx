import { useState } from "react";
import {
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
  //console.log('2753034-13ae-4ebd-83a7-7a5da8d637b6-dupl-dupl'.includes("dupl"))

  const [isPreloader, setIsPreloader] = useState(false);

  const [isCreateDuplicate, setIsCreateDuplicate] = useState(false);

  function openCreateDuplicate() {
    setIsCreateDuplicate(true);
  }

  function closeCreateDuplicate() {
    setIsCreateDuplicate(false);
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
          OrderData.order.deliveryEntity !== "" && (
            <button
              className={styles["delivery-duplicate__document"]}
              onClick={openPDFHandler}
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
      </div>
      <SubmitPopup
        isSubmitPopup={isCreateDuplicate}
        submitText={`Cоздать дубликат квитанции`}
        onSubmit={handleCreateDuplicate}
        closeSubmitPopup={closeCreateDuplicate}
      />
    </section>
  );
};

export default DeliveryDuplicate;
