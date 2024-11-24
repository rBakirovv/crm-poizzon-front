import React, { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import TextInput from "../UI/TextInput/TextInput";
import OrderData from "../../store/order";
import UserData from "../../store/user";
import styles from "./Purchase.module.css";
import {
  ADMIN,
  BASE_URL,
  MAINADMIN,
  MAX_SIZE,
  SUPERADMIN,
} from "../../utils/constants";
import {
  deletePurchaseImage,
  inPurchase,
  updatePurchaseData,
  updatePurchaseImages,
  uploadImages,
  cancelPurchase,
  notLegit,
  setPurchaseImagesDisabled,
  changeVeritableRate,
  changeVeritablePriceCNY,
  getOrderByNumber,
  reorderOrderReset,
  reorderOrderCopy,
  setAddedValue,
  setTakenAwayValue,
  setReturnValue,
} from "../../utils/Order";
import ImagePopup from "../ImagePopup/ImagePopup";
import SubmitPopup from "../SubmitPopup/SubmitPopup";
import { IOrder, IOrderImages } from "../../types/interfaces";
import Preloader from "../UI/Preloader/Preloader";

const dayjs = require("dayjs");

var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone");
var updateLocale = require("dayjs/plugin/updateLocale");

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("Europe/Moscow");

dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  months: [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ],
});

const Purchase = () => {
  const [data, setData] = useState({
    poizon_code: OrderData.order.poizonCode,
    veritableRate: OrderData.order.veritableRate,
    veritablePriceCNY: OrderData.order.veritablePriceCNY,
    reorder: "",
    reorderAmount: "",
    reorderAmountMinus: "",
  });

  const [uploading, setUploading] = useState<boolean>(false);

  const [isImagePopupOpen, setIsImagePopupOpen] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<string>("");

  const [isSubmitPopupOpen, setIsSubmitPopupOpen] = useState<boolean>(false);
  const [isCancelPopupOpen, setIsCancelPopupOpen] = useState<boolean>(false);
  const [isLegitPopupOpen, setIsLegitPopupOpen] = useState<boolean>(false);
  const [isChangeVeritableRatePopupOpen, setIsChangeVeritableRatePopupOpen] =
    useState<boolean>(false);
  const [
    isChangeVeritablePriceCNYPopupOpen,
    setIsChangeVeritablePriceCNYPopupOpen,
  ] = useState<boolean>(false);
  const [isReorderPopupOpen, setIsReorderPopupOpen] = useState<boolean>(false);
  const [isReturnPopupOpen, setIsReturnPopupOpen] = useState<boolean>(false);

  const [isDrag, setIsDrag] = useState(false);

  const [isReorderCheckbox, setIsReorderCheckbox] = useState(true);
  const [isReturnCheckbox, setIsReturnCheckbox] = useState(false);

  function handleChange(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;

    const { name, value } = target;

    setData({
      ...data,
      [name]: value,
    });
  }

  function dragHandler() {
    setIsDrag(true);
  }

  function dragLeaveHandler() {
    setIsDrag(false);
  }

  function openSubmitPopup(e: React.SyntheticEvent) {
    e.preventDefault();
    setIsSubmitPopupOpen(true);
  }

  function closeSubmitPopup() {
    setIsSubmitPopupOpen(false);
  }

  function openCancelPopup(e: React.SyntheticEvent) {
    e.preventDefault();
    setIsCancelPopupOpen(true);
  }

  function closeCancelPopup() {
    setIsCancelPopupOpen(false);
    setIsSubmitPopupOpen(false);
  }

  function openLegitPopup(e: React.SyntheticEvent) {
    e.preventDefault();
    setIsLegitPopupOpen(true);
  }

  function closeLegitPopup() {
    setIsLegitPopupOpen(false);
    setIsSubmitPopupOpen(false);
  }

  function openImagePopup(imageSrc: string) {
    setCurrentImage(imageSrc);
    setIsImagePopupOpen(true);
  }

  function closeImagePopup() {
    setIsImagePopupOpen(false);
  }

  function openChangeVeritableRatePopup(e: React.SyntheticEvent) {
    e.preventDefault();
    setIsChangeVeritableRatePopupOpen(true);
  }

  function closeChangeVeritableRatePopup() {
    setIsChangeVeritableRatePopupOpen(false);
    setIsSubmitPopupOpen(false);
  }

  function openChangeVeritablePriceCNYPopup(e: React.SyntheticEvent) {
    e.preventDefault();
    setIsChangeVeritablePriceCNYPopupOpen(true);
  }

  function closeChangeVeritablePriceCNYPopup() {
    setIsChangeVeritablePriceCNYPopupOpen(false);
    setIsSubmitPopupOpen(false);
  }

  function openReorderPopup(e: React.SyntheticEvent) {
    e.preventDefault();
    setIsReorderPopupOpen(true);
  }

  function closeReorderPopup() {
    setIsReorderPopupOpen(false);
    setIsSubmitPopupOpen(false);
  }

  function openReturnPopup(e: React.SyntheticEvent) {
    e.preventDefault();
    setIsReturnPopupOpen(true);
  }

  function closeReturnPopup() {
    setIsReturnPopupOpen(false);
    setIsSubmitPopupOpen(false);
  }

  const uploadFileHandler = async (
    e: any, // Костыль!
    folder: string,
    setUploading: React.Dispatch<React.SetStateAction<boolean>>,
    multiple = true
  ) => {
    const formData = new FormData();
    if (multiple) {
      const files = e;

      for (let i = 0; i < files.length; i++) {
        formData.append("imagesUp", files[i]);
      }
    } else {
      const file = e;
      formData.append("imagesUp", file[0]);
    }

    setUploading(true);

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
            buyProofImages: OrderData.order.buyProofImages.concat(data.data),
            receiptImages: OrderData.order.receiptImages,
            uploadedBuyProofImages: OrderData.order.uploadedBuyProofImages,
            uploadedReceiptImages: OrderData.order.uploadedReceiptImages,
            isReceiptImages: OrderData.order.isReceiptImages,
            isSplit: OrderData.order.isSplit,
            payment: OrderData.order.payment,
            currentRate: OrderData.order.currentRate,
            veritableRate: OrderData.order.veritableRate,
            priceCNY: OrderData.order.priceCNY,
            veritablePriceCNY: OrderData.order.veritablePriceCNY,
            priceDeliveryChina: OrderData.order.priceDeliveryChina,
            priceDeliveryRussia: OrderData.order.priceDeliveryRussia,
            commission: OrderData.order.commission,
            promoCodePercent: OrderData.order.promoCodePercent,
            comment: OrderData.order.comment,
            poizonCode: data.poizon_code,
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
            paidAtSurcharge: OrderData.order.paidAtSurcharge,
            servicePercentage: OrderData.order.servicePercentage,
            addedValue: OrderData.order.addedValue,
            takenAwayValue: OrderData.order.takenAwayValue,
            returnValue: OrderData.order.returnValue,
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

    await updatePurchaseImages(
      OrderData.order._id,
      OrderData.order.buyProofImages,
      UserData.userData.name
    ).then((order) => OrderData.setOrder(order));
  };

  function deleteImageHandler(imageName: string) {
    deletePurchaseImage(imageName, OrderData.order._id)
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
          buyProofImages: OrderData.order.buyProofImages.filter(
            (imageItem) => imageItem.name !== imageName
          ),
          receiptImages: OrderData.order.receiptImages,
          uploadedBuyProofImages: OrderData.order.uploadedBuyProofImages,
          uploadedReceiptImages: OrderData.order.uploadedReceiptImages,
          isReceiptImages: OrderData.order.isReceiptImages,
          isSplit: OrderData.order.isSplit,
          payment: OrderData.order.payment,
          currentRate: OrderData.order.currentRate,
          veritableRate: OrderData.order.veritableRate,
          priceCNY: OrderData.order.priceCNY,
          veritablePriceCNY: OrderData.order.veritablePriceCNY,
          priceDeliveryChina: OrderData.order.priceDeliveryChina,
          priceDeliveryRussia: OrderData.order.priceDeliveryRussia,
          commission: OrderData.order.commission,
          promoCodePercent: OrderData.order.promoCodePercent,
          comment: OrderData.order.comment,
          poizonCode: data.poizon_code,
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
          paidAtSurcharge: OrderData.order.paidAtSurcharge,
          servicePercentage: OrderData.order.servicePercentage,
          addedValue: OrderData.order.addedValue,
          takenAwayValue: OrderData.order.takenAwayValue,
          returnValue: OrderData.order.returnValue,
          __v: OrderData.order.__v,
        });
      })
      .then(() => {
        updatePurchaseImages(
          OrderData.order._id,
          OrderData.order.buyProofImages,
          UserData.userData.name
        );
      })
      .catch(console.error);
  }

  function handlePurchaseSubmit() {
    if (OrderData.order.buyProofImages.length !== 0) {
      updatePurchaseData(
        OrderData.order._id,
        OrderData.order.poizonCode,
        UserData.userData.name
      )
        .then((order) => {
          OrderData.setOrder(order);
        })
        .then(() => closeSubmitPopup());
    } else {
      alert("Необходимо прикрепить скриншоты чеков закупки");
    }
  }

  function handleAcceptPurchaseSubmit() {
    inPurchase(OrderData.order._id, UserData.userData.name)
      .then((order) => {
        OrderData.setOrder(order);
      })
      .then(() => closeSubmitPopup());
  }

  function handleReorder() {
    cancelPurchase(OrderData.order._id)
      .then((order) => {
        if (order.buyProofImages.length !== 0) {
          order.buyProofImages.forEach((item: IOrderImages) => {
            deleteImageHandler(item.name);
          });
        }

        return order;
      })
      .then((updatedOrder) => {
        OrderData.setOrder(updatedOrder);
      })
      .then(() => setIsCancelPopupOpen(false))
      .then(() => closeCancelPopup());
  }

  function handleNotLegit() {
    notLegit(OrderData.order._id)
      .then((updatedOrder) => {
        OrderData.setOrder(updatedOrder);
      })
      .then(() => {
        setIsCancelPopupOpen(false);
        setIsSubmitPopupOpen(false);
      })
      .then(() => closeCancelPopup());
  }

  function handlePurchaseImagesDisabled() {
    setPurchaseImagesDisabled(
      OrderData.order._id,
      !OrderData.order.isPurchaseImagesDisabled
    ).then((order) => {
      OrderData.setOrder(order);
    });
  }

  function handleChangeVeritableRate() {
    changeVeritableRate(OrderData.order._id, data.veritableRate)
      .then((updatedOrder) => {
        OrderData.setOrder(updatedOrder);
      })
      .then(() => {
        setIsCancelPopupOpen(false);
        setIsSubmitPopupOpen(false);
      })
      .then(() => closeCancelPopup());
  }

  function handleChangeVeritablePriceCNY() {
    changeVeritablePriceCNY(OrderData.order._id, data.veritablePriceCNY)
      .then((updatedOrder) => {
        OrderData.setOrder(updatedOrder);
      })
      .then(() => {
        setIsCancelPopupOpen(false);
        setIsSubmitPopupOpen(false);
      })
      .then(() => closeCancelPopup());
  }

  async function pasteHandler(e: any) {
    // Костыль!
    if (e.clipboardData) {
      var items = e.clipboardData.items;
      if (items) {
        for (var i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image") !== -1) {
            setUploading(true);

            const formData = new FormData();

            formData.append("imagesUp", items[0].getAsFile());

            try {
              await uploadImages(formData, "/order-purchase")
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
                    paymentUUIDSplitSecond:
                      OrderData.order.paymentUUIDSplitSecond,
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
                    buyProofImages: OrderData.order.buyProofImages.concat(
                      data.data
                    ),
                    receiptImages: OrderData.order.receiptImages,
                    uploadedBuyProofImages:
                      OrderData.order.uploadedBuyProofImages,
                    uploadedReceiptImages:
                      OrderData.order.uploadedReceiptImages,
                    isReceiptImages: OrderData.order.isReceiptImages,
                    isSplit: OrderData.order.isSplit,
                    payment: OrderData.order.payment,
                    currentRate: OrderData.order.currentRate,
                    veritableRate: OrderData.order.veritableRate,
                    priceCNY: OrderData.order.priceCNY,
                    veritablePriceCNY: OrderData.order.veritablePriceCNY,
                    priceDeliveryChina: OrderData.order.priceDeliveryChina,
                    priceDeliveryRussia: OrderData.order.priceDeliveryRussia,
                    commission: OrderData.order.commission,
                    promoCodePercent: OrderData.order.promoCodePercent,
                    comment: OrderData.order.comment,
                    poizonCode: OrderData.order.poizonCode,
                    filledPoizonCode: OrderData.order.filledPoizonCode,
                    deliveryCode: OrderData.order.deliveryCode,
                    deliveryName: OrderData.order.deliveryName,
                    deliveryNameRecipient:
                      OrderData.order.deliveryNameRecipient,
                    deliveryPhone: OrderData.order.deliveryPhone,
                    deliveryPhoneRecipient:
                      OrderData.order.deliveryPhoneRecipient,
                    deliveryMethod: OrderData.order.deliveryMethod,
                    deliveryAddress: OrderData.order.deliveryAddress,
                    deliveryEntity: OrderData.order.deliveryEntity,
                    deliveryRelatedEntities:
                      OrderData.order.deliveryRelatedEntities,
                    reorder: OrderData.order.reorder,
                    totalReorder: OrderData.order.totalReorder,
                    payLinksArray: OrderData.order.payLinksArray,
                    splitLinksArray: OrderData.order.splitLinksArray,
                    splitSecondLinksArray:
                      OrderData.order.splitSecondLinksArray,
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
                    splitLinksExpressArray:
                      OrderData.order.splitLinksExpressArray,
                    splitSecondLinksExpressArray:
                      OrderData.order.splitSecondLinksExpressArray,
                    isSurcharge: OrderData.order.isSurcharge,
                    surchargePayLink: OrderData.order.surchargePayLink,
                    surchargeUUID: OrderData.order.surchargeUUID,
                    surchargePayLinksArray:
                      OrderData.order.surchargePayLinksArray,
                    surchargeTotal: OrderData.order.surchargeTotal,
                    paidAtSurcharge: OrderData.order.paidAtSurcharge,
                    servicePercentage: OrderData.order.servicePercentage,
                    addedValue: OrderData.order.addedValue,
                    takenAwayValue: OrderData.order.takenAwayValue,
                    returnValue: OrderData.order.returnValue,
                    __v: OrderData.order.__v,
                  });
                })
                .then(() => {
                  setUploading(false);
                  dragLeaveHandler();
                });
            } catch (error) {
              setUploading(false);
              dragLeaveHandler();
              console.error(error);
            }

            await updatePurchaseImages(
              OrderData.order._id,
              OrderData.order.buyProofImages,
              UserData.userData.name
            ).then((order) => OrderData.setOrder(order));
          }
        }
      }
    }
  }

  useEffect(() => {
    document.addEventListener("paste", pasteHandler);
    return () => document.removeEventListener("paste", pasteHandler);
  }, []);

  const symbolsReg = /(?:[а-яёa-z]\d|\d[в-яёa-z])/i;

  useEffect(() => {
    if (symbolsReg.test(data.veritableRate)) {
      setData({
        poizon_code: data.poizon_code,
        veritableRate: OrderData.order.veritableRate,
        veritablePriceCNY: data.veritablePriceCNY,
        reorder: data.reorder,
        reorderAmount: data.reorderAmount,
        reorderAmountMinus: data.reorderAmountMinus,
      });
    }
  }, [data.veritableRate]);

  useEffect(() => {
    if (symbolsReg.test(data.veritablePriceCNY)) {
      setData({
        poizon_code: data.poizon_code,
        veritableRate: data.veritableRate,
        veritablePriceCNY: OrderData.order.veritablePriceCNY,
        reorder: data.reorder,
        reorderAmount: data.reorderAmount,
        reorderAmountMinus: data.reorderAmountMinus,
      });
    }
  }, [data.veritablePriceCNY]);

  /*
  useEffect(() => {
    setData({
      poizon_code: data.poizon_code,
      veritableRate: data.veritableRate,
      veritablePriceCNY: data.veritablePriceCNY.replace(symbolsReg, ""),
    });
  }, [data.veritablePriceCNY]);
  */

  useEffect(() => {
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
      receiptImages: OrderData.order.receiptImages,
      uploadedBuyProofImages: OrderData.order.uploadedBuyProofImages,
      uploadedReceiptImages: OrderData.order.uploadedReceiptImages,
      isReceiptImages: OrderData.order.isReceiptImages,
      isSplit: OrderData.order.isSplit,
      payment: OrderData.order.payment,
      currentRate: OrderData.order.currentRate,
      veritableRate: data.veritableRate,
      priceCNY: OrderData.order.priceCNY,
      veritablePriceCNY: data.veritablePriceCNY,
      priceDeliveryChina: OrderData.order.priceDeliveryChina,
      priceDeliveryRussia: OrderData.order.priceDeliveryRussia,
      commission: OrderData.order.commission,
      promoCodePercent: OrderData.order.promoCodePercent,
      comment: OrderData.order.comment,
      poizonCode: data.poizon_code,
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
      paidAtSurcharge: OrderData.order.paidAtSurcharge,
      servicePercentage: OrderData.order.servicePercentage,
      addedValue: OrderData.order.addedValue,
      takenAwayValue: OrderData.order.takenAwayValue,
      returnValue: OrderData.order.returnValue,
      __v: OrderData.order.__v,
    });
  }, [data]);

  function handleReorderClick(e: React.SyntheticEvent) {
    if (isReorderCheckbox) {
      openReorderPopup(e);
    } else {
      openReturnPopup(e);
    }
  }

  function reorderHandler() {
    getOrderByNumber(data.reorder).then((order: Array<IOrder>) => {
      const orderItem = order[0];
      reorderOrderReset(orderItem._id).then(() => {
        reorderOrderCopy(
          OrderData.order._id,
          orderItem.servicePercentage,
          data.reorderAmountMinus !== ""
            ? OrderData.order.veritablePriceCNY
            : orderItem.veritablePriceCNY,
          orderItem.veritableRate,
          orderItem.deliveryAddress,
          orderItem.deliveryEntity,
          orderItem.deliveryMethod,
          orderItem.deliveryName,
          orderItem.deliveryNameRecipient,
          orderItem.deliveryPhone,
          orderItem.paidAt,
          orderItem.paidAtSplit,
          orderItem.paidAtSplitSecond,
          /*
          data.reorderAmountMinus !== ""
            ? OrderData.order.priceCNY
            : orderItem.priceCNY,
          */
          orderItem.priceCNY,
          orderItem.priceDeliveryChina,
          orderItem.priceDeliveryRussia,
          orderItem.promoCodePercent,
          orderItem.commission,
          orderItem.currentRate,
          orderItem.expressCost
        ).then(() => {
          if (data.reorderAmount !== "") {
            setAddedValue(OrderData.order._id, data.reorderAmount)
              .then((changedOrder) => {
                OrderData.setOrder(changedOrder);
              })
              .then(() => {
                setIsCancelPopupOpen(false);
                setIsSubmitPopupOpen(false);
              })
              .then(() => {
                closeCancelPopup();
                closeSubmitPopup();
              })
              .then(() => {
                setData({
                  poizon_code: data.poizon_code,
                  veritableRate: data.veritableRate,
                  veritablePriceCNY: OrderData.order.veritablePriceCNY,
                  reorder: "",
                  reorderAmount: "",
                  reorderAmountMinus: "",
                });
              });
          } else if (data.reorderAmountMinus !== "") {
            setTakenAwayValue(
              OrderData.order._id,
              `-${Math.abs(parseInt(data.reorderAmountMinus))}`
            )
              .then((changedOrder) => {
                OrderData.setOrder(changedOrder);
              })
              .then(() => {
                setIsCancelPopupOpen(false);
                setIsSubmitPopupOpen(false);
              })
              .then(() => {
                closeCancelPopup();
                closeSubmitPopup();
              })
              .then(() => {
                setData({
                  poizon_code: data.poizon_code,
                  veritableRate: data.veritableRate,
                  veritablePriceCNY: OrderData.order.veritablePriceCNY,
                  reorder: "",
                  reorderAmount: "",
                  reorderAmountMinus: "",
                });
              });
          }
        });
      });
    });
  }

  function returnHandler() {
    setReturnValue(OrderData.order._id, true)
      .then((changedOrder) => {
        OrderData.setOrder(changedOrder);
      })
      .then(() => {
        setIsCancelPopupOpen(false);
        setIsSubmitPopupOpen(false);
      })
      .then(() => {
        closeCancelPopup();
        closeSubmitPopup();
      });
  }

  function reorderCheckboxHandler() {
    setIsReorderCheckbox(true);
    setIsReturnCheckbox(false);
  }

  function returnCheckboxHandler() {
    setIsReturnCheckbox(true);
    setIsReorderCheckbox(false);
  }

  return (
    <form onSubmit={openSubmitPopup} className={styles["purchase"]}>
      <TextInput
        label="Номер отправки Poizon"
        name="poizon_code"
        value={OrderData.order.poizonCode}
        handleChange={handleChange}
        required={false}
        disabled={UserData.userData.position === "Работник склада"}
      />
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        <TextInput
          label="Ист. крус"
          name="veritableRate"
          value={OrderData.order.veritableRate}
          handleChange={handleChange}
          required={false}
        />
        {(UserData.userData.position === SUPERADMIN ||
          UserData.userData.position === MAINADMIN ||
          UserData.userData.position === ADMIN) && (
          <button
            onClick={openChangeVeritableRatePopup}
            type="button"
            style={{ height: "max-content" }}
          >
            изм. & сохр.
          </button>
        )}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        <TextInput
          label="Юани ист."
          name="veritablePriceCNY"
          value={OrderData.order.veritablePriceCNY}
          handleChange={handleChange}
          required={false}
        />
        {(UserData.userData.position === SUPERADMIN ||
          UserData.userData.position === MAINADMIN ||
          UserData.userData.position === ADMIN) && (
          <button
            onClick={openChangeVeritablePriceCNYPopup}
            type="button"
            style={{ height: "max-content" }}
          >
            изм. & сохр.
          </button>
        )}
      </div>
      {OrderData.order.buyAt && (
        <p>
          Закуплен:{" "}
          {dayjs
            .tz(new Date(OrderData.order.buyAt!))
            .format("DD.MM.YYYY в HH:mm")}
        </p>
      )}
      {OrderData.order.filledPoizonCode !== "" &&
        OrderData.order.filledPoizonCode !== null &&
        OrderData.order.poizonCode !== "" && (
          <p>
            Обновил: <strong>{OrderData.order.filledPoizonCode}</strong>
          </p>
        )}
      {!(
        OrderData.order.status === "Черновик" ||
        OrderData.order.status === "Проверка оплаты" ||
        OrderData.order.status === "Ожидает закупки"
      ) &&
        OrderData.order.uploadedBuyProofImages !== "" &&
        OrderData.order.uploadedBuyProofImages !== null &&
        OrderData.order.buyProofImages.length > 0 && (
          <p>
            Скриншоты чеков закупки{" "}
            <span>
              загрузил:{" "}
              <strong>{OrderData.order.uploadedBuyProofImages}</strong>
            </span>
          </p>
        )}
      {!(
        OrderData.order.status === "Черновик" ||
        OrderData.order.status === "Проверка оплаты"
      ) && (
        <div
          className={styles["purchase__chekbox-container"]}
          style={{ marginBottom: "1rem", marginTop: "1rem" }}
        >
          <input
            type="checkbox"
            checked={OrderData.order.isPurchaseImagesDisabled}
            onChange={handlePurchaseImagesDisabled}
          />
          <label>Скрыть скриншоты</label>
        </div>
      )}
      {OrderData.order.buyProofImages.length > 0 && (
        <ul className={styles["purchase__images-list"]}>
          {OrderData.order.buyProofImages
            .slice()
            .reverse()
            .map((image) => {
              return (
                <li key={image.name} className={styles["purchase__image"]}>
                  {OrderData.order.status === "На закупке" &&
                    UserData.userData.position !== "Работник склада" && (
                      <div
                        className={styles["purchase__delete-image"]}
                        onClick={() => deleteImageHandler(image.name)}
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
                    className={styles["purchase__image-item"]}
                    src={`${BASE_URL}${image.path}`}
                    alt={image.name}
                    crossOrigin="anonymous"
                    onClick={() => openImagePopup(`${BASE_URL}${image.path}`)}
                  />
                </li>
              );
            })}
        </ul>
      )}
      {OrderData.order.status === "На закупке" &&
        UserData.userData.position !== "Менеджер" &&
        UserData.userData.position !== "Работник склада" && (
          <Dropzone
            onDrop={(e: any) =>
              uploadFileHandler(e, "/order-purchase", setUploading)
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
                    {isDrag ? "Перетащите фото" : "Добавить фото или ctrl + v"}
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
      <div>
        {isReorderCheckbox && (
          <div style={{ marginTop: "1rem" }}>
            <TextInput
              label="Номер перезаказа"
              name="reorder"
              value={data.reorder}
              handleChange={handleChange}
              required={false}
            />
            <div
              style={{
                marginTop: "1rem",
              }}
            >
              <TextInput
                label="Сумма перезаказа"
                name="reorderAmount"
                value={data.reorderAmount}
                handleChange={handleChange}
                required={false}
              />
            </div>
            <div style={{ marginTop: "1rem" }}>
              <TextInput
                label="Сумма перезаказа (отрицательная)"
                name="reorderAmountMinus"
                value={data.reorderAmountMinus}
                handleChange={handleChange}
                required={false}
              />
            </div>
          </div>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "1rem",
            gap: "1rem",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
              }}
            >
              <input
                checked={isReorderCheckbox}
                onClick={reorderCheckboxHandler}
                type="checkbox"
              />
              <label>Перезаказ</label>
            </div>
            <div
              style={{
                display: "flex",
                marginTop: "0.5rem",
                gap: "0.5rem",
              }}
            >
              <input
                checked={isReturnCheckbox}
                onClick={returnCheckboxHandler}
                type="checkbox"
              />
              <label>Возврат</label>
            </div>
          </div>
          {(UserData.userData.position === SUPERADMIN ||
            UserData.userData.position === MAINADMIN ||
            UserData.userData.position === ADMIN) && (
            <button
              onClick={handleReorderClick}
              type="button"
              disabled={isReorderCheckbox && data.reorder === ""}
              style={{ height: "max-content" }}
            >
              прим.
            </button>
          )}
        </div>
      </div>
      {UserData.userData.position !== "Менеджер" &&
        UserData.userData.position !== "Работник склада" && (
          <div
            className={`${styles["purchase__buttons-container"]} ${
              UserData.userData.position === "Менеджер" &&
              styles["purchase__button-submit_disable"]
            }`}
          >
            {OrderData.order.status === "Ожидает закупки" && (
              <button
                className={`${styles["purchase__button-submit"]} ${
                  UserData.userData.position === "Менеджер" &&
                  styles["purchase__button-submit_disable"]
                }`}
                type="submit"
              >
                На закупку
              </button>
            )}
            {OrderData.order.status !== "Завершён" && (
              <button
                className={`${styles["purchase__button-submit"]} ${
                  UserData.userData.position === "Менеджер" &&
                  styles["purchase__button-submit_disable"]
                }`}
                type="submit"
              >
                {OrderData.order.status !== "На закупке"
                  ? "Сохранить POIZON"
                  : "Закуплен"}
              </button>
            )}
            {(OrderData.order.status === "На закупке" ||
              OrderData.order.status === "Закуплен") && (
              <button
                className={`${styles["purchase__button-submit"]} ${
                  styles["purchase__button-reorder"]
                } ${
                  UserData.userData.position === "Менеджер" &&
                  styles["purchase__button-submit_disable"]
                }`}
                onClick={openCancelPopup}
              >
                Отменить закупку
              </button>
            )}
            {OrderData.order.status !== "Черновик" &&
              OrderData.order.status !== "Проверка оплаты" &&
              OrderData.order.status !== "Завершён" &&
              UserData.userData.position !== "Работник склада" && (
                <button
                  className={`${styles["purchase__button-submit"]} ${
                    styles["purchase__button-reorder"]
                  } ${
                    UserData.userData.position === "Менеджер" &&
                    styles["purchase__button-submit_disable"]
                  }`}
                  onClick={openLegitPopup}
                >
                  Не легит
                </button>
              )}
          </div>
        )}
      <ImagePopup
        isImagePopupOpen={isImagePopupOpen}
        currentImage={currentImage}
        closePopup={closeImagePopup}
      />
      {OrderData.order.status !== "Ожидает закупки" && isSubmitPopupOpen && (
        <SubmitPopup
          onSubmit={handlePurchaseSubmit}
          isSubmitPopup={isSubmitPopupOpen}
          closeSubmitPopup={closeSubmitPopup}
          submitText="Изменить данные заказа или товар закуплен"
        />
      )}
      {OrderData.order.status === "Ожидает закупки" && isSubmitPopupOpen && (
        <SubmitPopup
          onSubmit={handleAcceptPurchaseSubmit}
          isSubmitPopup={isSubmitPopupOpen}
          closeSubmitPopup={closeSubmitPopup}
          submitText="Изменить статус товара На закупке"
        />
      )}
      {isCancelPopupOpen && (
        <SubmitPopup
          onSubmit={handleReorder}
          isSubmitPopup={isCancelPopupOpen}
          closeSubmitPopup={closeCancelPopup}
          submitText="Изменить статус товара Ожидает закупки"
        />
      )}
      {isLegitPopupOpen && (
        <SubmitPopup
          onSubmit={handleNotLegit}
          isSubmitPopup={isLegitPopupOpen}
          closeSubmitPopup={closeLegitPopup}
          submitText="Товар не легит"
        />
      )}
      {isChangeVeritableRatePopupOpen && (
        <SubmitPopup
          onSubmit={handleChangeVeritableRate}
          isSubmitPopup={isChangeVeritableRatePopupOpen}
          closeSubmitPopup={closeChangeVeritableRatePopup}
          submitText={`Установить ист. курс ${data.veritableRate}₽`}
        />
      )}
      {isChangeVeritablePriceCNYPopupOpen && (
        <SubmitPopup
          onSubmit={handleChangeVeritablePriceCNY}
          isSubmitPopup={isChangeVeritablePriceCNYPopupOpen}
          closeSubmitPopup={closeChangeVeritablePriceCNYPopup}
          submitText={`Установить юани ист. ${data.veritablePriceCNY}₽`}
        />
      )}
      {isReorderPopupOpen && (
        <SubmitPopup
          onSubmit={reorderHandler}
          isSubmitPopup={isReorderPopupOpen}
          closeSubmitPopup={closeReorderPopup}
          submitText={`Перезаказать ${data.reorder} с доплатой ${
            data.reorderAmount !== ""
              ? data.reorderAmount
              : `-${Math.abs(parseInt(data.reorderAmountMinus))}`
          } ₽`}
        />
      )}
      {isReturnPopupOpen && (
        <SubmitPopup
          onSubmit={returnHandler}
          isSubmitPopup={isReturnPopupOpen}
          closeSubmitPopup={closeReturnPopup}
          submitText={`Возврат заказа`}
        />
      )}
      {uploading && <Preloader />}
    </form>
  );
};

export default Purchase;
