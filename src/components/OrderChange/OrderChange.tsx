import React, { FC, useEffect, useState } from "react";
import {
  BASE_URL_FRONT,
  DROPSHIPPER,
  EXPRESS_PRICE,
} from "../../utils/constants";
import TextInput from "../UI/TextInput/TextInput";
import styles from "./OrderChange.styles.module.css";
import { IMergedOrders, IPayments } from "../../types/interfaces";
import OrderData from "../../store/order";
import UserData from "../../store/user";
import PromoCodeData from "../../store/promo-code";
import CommissionData from "../../store/commission";
import { observer } from "mobx-react-lite";
import {
  updateOrderDraft,
  updateOrderImages,
  uploadImages,
  deleteOrderImage,
  setIsSplitHandler,
} from "../../utils/Order";
import SubmitPopup from "../SubmitPopup/SubmitPopup";
import { BASE_URL } from "../../utils/constants";
import Dropzone from "react-dropzone";
import ImagePopup from "../ImagePopup/ImagePopup";
import AcceptPayment from "../AcceptPayment/AcceptPayment";
import Client from "../Client/Client";
import Purchase from "../Purchase/Purchase";
import Delivery from "../Delivery/Delivery";
import Preloader from "../UI/Preloader/Preloader";
import DeliveryDuplicate from "../DeliveryDuplicate/DeliveryDuplicate";
import Link from "next/link";

const dayjs = require("dayjs");

var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("Europe/Moscow");

interface IOrderChangeProps {
  payments: Array<IPayments>;
}

const OrderChange: FC<IOrderChangeProps> = observer(({ payments }) => {
  const [data, setData] = useState({
    _id: OrderData.order._id,
    link: OrderData.order.link,
    payLink: OrderData.order.payLink,
    paymentUUID: OrderData.order.paymentUUID,
    payLinkSplit: OrderData.order.payLinkSplit,
    paymentUUIDSplit: OrderData.order.paymentUUIDSplit,
    payLinkSplitSecond: OrderData.order.payLinkSplitSecond,
    paymentUUIDSplitSecond: OrderData.order.paymentUUIDSplitSecond,
    category: OrderData.order.category,
    subcategory: OrderData.order.subcategory,
    brand: OrderData.order.brand,
    model: OrderData.order.model,
    size: OrderData.order.size,
    payment: OrderData.order.payment,
    priceCNY: OrderData.order.priceCNY,
    priceDeliveryChina: OrderData.order.priceDeliveryChina,
    priceDeliveryRussia: OrderData.order.priceDeliveryRussia,
    commission: OrderData.order.commission,
    promoCodePercent: OrderData.order.promoCodePercent,
    comment: OrderData.order.comment,
  });

  const [isSplit, setIsSplit] = useState(OrderData.order.isSplit || false);

  const [orderСhapter, setOrderСhapter] = useState<string | null>(
    typeof window !== "undefined" && sessionStorage.getItem("orderСhapter")
      ? sessionStorage.getItem("orderСhapter")
      : "Order"
  );

  const [isSubmitPopup, setIsSubmitPopup] = useState<boolean>(false);
  const [isImageSubmitPopup, setIsImageSubmitPopup] = useState<boolean>(false);

  const [uploading, setUploading] = useState<boolean>(false);

  const [isImagePopupOpen, setIsImagePopupOpen] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<string>("");
  const [currentDeletedImage, setCurrentDeletedImage] = useState<string>("");

  const [isDrag, setIsDrag] = useState(false);

  const [isCopy, setIsCopy] = useState(false);
  const [isCopyNumberLink, setIsCopyNumberLink] = useState(false);
  const [isCopySizePhoto, setIsCopySizePhoto] = useState(false);

  const priceRub = Math.ceil(
    parseFloat(OrderData.order.priceCNY) *
      parseFloat(OrderData.order.currentRate)
  );
  const totalPrice = Math.ceil(
    priceRub +
      parseFloat(OrderData.order.priceDeliveryChina) +
      parseFloat(OrderData.order.priceDeliveryRussia) +
      parseFloat(OrderData.order.commission) +
      OrderData.order.expressCost
  );
  const totalPriceWithPromo = Math.ceil(
    priceRub +
      parseFloat(OrderData.order.priceDeliveryChina) +
      parseFloat(OrderData.order.priceDeliveryRussia) +
      parseFloat(OrderData.order.commission) -
      data.promoCodePercent +
      OrderData.order.expressCost
  );

  const combinedOrdersFiltered = OrderData.mergedOrders.filter((item) => {
    if (item.orderStatus !== "Завершён") {
      return true;
    }
  });

  const combinedOrdersTotal =
    combinedOrdersFiltered.length &&
    Math.ceil(
      combinedOrdersFiltered.reduce(function (sum, current) {
        return (
          sum +
          (parseFloat(current.priceCNY) * parseFloat(current.currentRate) +
            parseFloat(current.priceDeliveryChina) +
            parseFloat(current.priceDeliveryRussia) +
            parseFloat(current.commission) -
            current.promoCodePercent +
            current.expressCost)
        );
      }, 0)
    );

  const MAX_SIZE = 5242880;

  data._id !== OrderData.order._id &&
    setData({
      _id: OrderData.order._id,
      link: OrderData.order.link,
      payLink: OrderData.order.payLink,
      payLinkSplit: OrderData.order.payLinkSplit,
      paymentUUID: OrderData.order.paymentUUID,
      paymentUUIDSplit: OrderData.order.paymentUUIDSplit,
      payLinkSplitSecond: OrderData.order.payLinkSplitSecond,
      paymentUUIDSplitSecond: OrderData.order.paymentUUIDSplitSecond,
      category: OrderData.order.category,
      subcategory: OrderData.order.subcategory,
      brand: OrderData.order.brand,
      model: OrderData.order.model,
      size: OrderData.order.size,
      payment: OrderData.order.payment,
      priceCNY: OrderData.order.priceCNY,
      priceDeliveryChina: OrderData.order.priceDeliveryChina,
      priceDeliveryRussia: OrderData.order.priceDeliveryRussia,
      commission: OrderData.order.commission,
      promoCodePercent: OrderData.order.promoCodePercent,
      comment: OrderData.order.comment,
    });

  function dragHandler() {
    setIsDrag(true);
  }

  function dragLeaveHandler() {
    setIsDrag(false);
  }

  function copyLink() {
    navigator.clipboard.writeText(
      `${BASE_URL_FRONT}/order/${OrderData.order._id}/${OrderData.order.orderId}`
    );

    setIsCopy(true);

    setTimeout(() => {
      setIsCopy(false);
    }, 2000);
  }

  function copyNumberLink() {
    navigator.clipboard.writeText(
      `${OrderData.order.orderId}\n${OrderData.order.link}`
    );

    setIsCopyNumberLink(true);

    setTimeout(() => {
      setIsCopyNumberLink(false);
    }, 2000);
  }

  async function copyImage() {
    try {
      setIsCopySizePhoto(true);
      const response = await fetch(
        `${BASE_URL}${OrderData.order.orderImages[1].path}`
      );
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
    } catch (err) {
      setIsCopySizePhoto(false);
      console.error(err);
    }

    setTimeout(() => {
      setIsCopySizePhoto(false);
    }, 2000);
  }

  function openImagePopup(imageSrc: string) {
    setCurrentImage(imageSrc);
    setIsImagePopupOpen(true);
  }

  function closeImagePopup() {
    setIsImagePopupOpen(false);
  }

  function closeSubmitPopup() {
    setIsSubmitPopup(false);
  }

  function openSubmitPopup(e: React.SyntheticEvent) {
    e.preventDefault();
    setIsSubmitPopup(true);
  }

  function openImageSubmitPopup(image: string) {
    setIsImageSubmitPopup(true);
    setCurrentDeletedImage(image);
  }

  function closeImageSubmitPopup() {
    setIsImageSubmitPopup(false);
    setCurrentDeletedImage("");
  }

  function openOrder() {
    setOrderСhapter("Order");
    sessionStorage.setItem("orderСhapter", "Order");
  }

  function openPayment() {
    setOrderСhapter("Pay");
    sessionStorage.setItem("orderСhapter", "Pay");
  }

  function openClientData() {
    setOrderСhapter("Client");
    sessionStorage.setItem("orderСhapter", "Client");
  }

  function openPurchaseData() {
    setOrderСhapter("Purchase");
    sessionStorage.setItem("orderСhapter", "Purchase");
  }

  function openDelivery() {
    setOrderСhapter("Delivery");
    sessionStorage.setItem("orderСhapter", "Delivery");
  }

  function openDeliveryDuplicate() {
    setOrderСhapter("DeliveryDuplicate");
    sessionStorage.setItem("orderСhapter", "DeliveryDuplicate");
  }

  function handleChange(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;

    const { name, value } = target;

    setData({
      ...data,
      [name]: value,
    });

    if (target.value === "Сплит -") {
      setData({
        ...data,
        payment: "Сплит -",
        payLink: OrderData.order.payLink,
        payLinkSplit: OrderData.order.payLinkSplit,
        paymentUUID: OrderData.order.paymentUUID,
        paymentUUIDSplit: OrderData.order.paymentUUIDSplit,
        payLinkSplitSecond: OrderData.order.payLinkSplitSecond,
        paymentUUIDSplitSecond: OrderData.order.paymentUUIDSplitSecond,
      });
    }

    if (target.value === "Сплит Onepay") {
      setData({
        ...data,
        payment: "Сплит Onepay",
        payLink: OrderData.order.payLink,
        payLinkSplit: OrderData.order.payLinkSplit,
        paymentUUID: OrderData.order.paymentUUID,
        paymentUUIDSplit: OrderData.order.paymentUUIDSplit,
        payLinkSplitSecond: OrderData.order.payLinkSplitSecond,
        paymentUUIDSplitSecond: OrderData.order.paymentUUIDSplitSecond,
      });
    }

    if (target.value === "Сплит Anypayments") {
      setData({
        ...data,
        payment: "Сплит Anypayments",
        payLink: OrderData.order.payLink,
        payLinkSplit: OrderData.order.payLinkSplit,
        paymentUUID: OrderData.order.paymentUUID,
        paymentUUIDSplit: OrderData.order.paymentUUIDSplit,
        payLinkSplitSecond: OrderData.order.payLinkSplitSecond,
        paymentUUIDSplitSecond: OrderData.order.paymentUUIDSplitSecond,
      });
    }

    if (target.value === "Перейти по ссылке Onepay") {
      setData({
        ...data,
        payment: "Перейти по ссылке -",
        payLink: OrderData.order.payLink,
        payLinkSplit: OrderData.order.payLinkSplit,
        paymentUUID: OrderData.order.paymentUUID,
        paymentUUIDSplit: OrderData.order.paymentUUIDSplit,
        payLinkSplitSecond: OrderData.order.payLinkSplitSecond,
        paymentUUIDSplitSecond: OrderData.order.paymentUUIDSplitSecond,
      });
    }

    if (target.value === "Перейти по ссылке Anypayments") {
      setData({
        ...data,
        payment: "Перейти по ссылке -",
        payLink: OrderData.order.payLink,
        payLinkSplit: OrderData.order.payLinkSplit,
        paymentUUID: OrderData.order.paymentUUID,
        paymentUUIDSplit: OrderData.order.paymentUUIDSplit,
        payLinkSplitSecond: OrderData.order.payLinkSplitSecond,
        paymentUUIDSplitSecond: OrderData.order.paymentUUIDSplitSecond,
      });
    }

    if (target.value === "Перейти по ссылке -") {
      setData({
        ...data,
        payment: "Перейти по ссылке -",
        payLink: OrderData.order.payLink,
        payLinkSplit: OrderData.order.payLinkSplit,
        paymentUUID: OrderData.order.paymentUUID,
        paymentUUIDSplit: OrderData.order.paymentUUIDSplit,
        payLinkSplitSecond: OrderData.order.payLinkSplitSecond,
        paymentUUIDSplitSecond: OrderData.order.paymentUUIDSplitSecond,
      });
    }

    if (target.value === "Кроссовки") {
      setData({
        ...data,
        subcategory: "Кроссовки",
        priceDeliveryRussia: CommissionData.commission.sneakersRussia,
        priceDeliveryChina: CommissionData.commission.sneakersChina,
      });
    }

    if (target.value === "Зимняя обувь") {
      setData({
        ...data,
        subcategory: "Зимняя обувь",
        priceDeliveryRussia: CommissionData.commission.winterShoesRussia,
        priceDeliveryChina: CommissionData.commission.winterShoesChina,
      });
    }

    if (target.value === "Куртка") {
      setData({
        ...data,
        subcategory: "Куртка",
        priceDeliveryRussia: CommissionData.commission.jacketRussia,
        priceDeliveryChina: CommissionData.commission.jacketChina,
      });
    }

    if (target.value === "Толстовка") {
      setData({
        ...data,
        subcategory: "Толстовка",
        priceDeliveryRussia: CommissionData.commission.sweatshirtRussia,
        priceDeliveryChina: CommissionData.commission.sweatshirtChina,
      });
    }

    if (target.value === "Футболка") {
      setData({
        ...data,
        subcategory: "Футболка",
        priceDeliveryRussia: CommissionData.commission.tShirtRussia,
        priceDeliveryChina: CommissionData.commission.tShirtChina,
      });
    }

    if (target.value === "Носки") {
      setData({
        ...data,
        subcategory: "Носки",
        priceDeliveryRussia: CommissionData.commission.socksRussia,
        priceDeliveryChina: CommissionData.commission.socksChina,
      });
    }

    if (target.value === "Сумка") {
      setData({
        ...data,
        subcategory: "Сумка",
        priceDeliveryRussia: CommissionData.commission.bagRussia,
        priceDeliveryChina: CommissionData.commission.bagChina,
      });
    }

    if (target.value === "Духи") {
      setData({
        ...data,
        subcategory: "Духи",
        priceDeliveryRussia: CommissionData.commission.perfumeRussia,
        priceDeliveryChina: CommissionData.commission.perfumeChina,
      });
    }

    if (target.value === "Штаны") {
      setData({
        ...data,
        subcategory: "Штаны",
        priceDeliveryRussia: CommissionData.commission.pantsRussia,
        priceDeliveryChina: CommissionData.commission.pantsChina,
      });
    }

    if (target.value === "Головной убор") {
      setData({
        ...data,
        subcategory: "Головной убор",
        priceDeliveryRussia: CommissionData.commission.headdressRussia,
        priceDeliveryChina: CommissionData.commission.headdressChina,
      });
    }

    if (target.value === "Техника") {
      setData({
        ...data,
        subcategory: "Техника",
        priceDeliveryRussia: CommissionData.commission.techniqueRussia,
        priceDeliveryChina: CommissionData.commission.techniqueChina,
      });
    }

    if (target.value === "Прочее") {
      setData({
        ...data,
        subcategory: "Прочее",
        priceDeliveryRussia: CommissionData.commission.otherRussia,
        priceDeliveryChina: CommissionData.commission.otherChina,
      });
    }
  }

  function handleIsSplitChange() {
    setIsSplit(!isSplit);

    setIsSplitHandler(OrderData.order._id, !isSplit).then(() => {
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
        isSplit: !isSplit,
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
        paymentUUIDExpress: OrderData.order.paymentUUIDExpress,
        payLinkSplitExpress: OrderData.order.payLinkSplitExpress,
        paymentUUIDSplitExpress: OrderData.order.paymentUUIDSplitExpress,
        payLinkSplitSecondExpress: OrderData.order.payLinkSplitSecondExpress,
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
        __v: OrderData.order.__v,
      });
    });
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
      formData.append("imagesUp", e.target.files[0]);
    }

    setUploading(true);

    try {
      await uploadImages(formData, folder).then((data) => {
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
          orderImages: OrderData.order.orderImages.concat(data.data),
          payProofImages: OrderData.order.payProofImages,
          buyProofImages: OrderData.order.buyProofImages,
          receiptImages: OrderData.order.receiptImages,
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
          paymentUUIDExpress: OrderData.order.paymentUUIDExpress,
          payLinkSplitExpress: OrderData.order.payLinkSplitExpress,
          paymentUUIDSplitExpress: OrderData.order.paymentUUIDSplitExpress,
          payLinkSplitSecondExpress: OrderData.order.payLinkSplitSecondExpress,
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
          __v: OrderData.order.__v,
        });
        setUploading(false);
        dragLeaveHandler();
      });
    } catch (error) {
      console.error(error);
      setUploading(false);
      dragLeaveHandler();
    }

    await updateOrderImages(OrderData.order._id, OrderData.order.orderImages);
  };

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
              await uploadImages(formData, "/order-images").then((data) => {
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
                  orderImages: OrderData.order.orderImages.concat(data.data),
                  payProofImages: OrderData.order.payProofImages,
                  buyProofImages: OrderData.order.buyProofImages,
                  receiptImages: OrderData.order.receiptImages,
                  uploadedBuyProofImages:
                    OrderData.order.uploadedBuyProofImages,
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
                  splitSecondLinksArray: OrderData.order.splitSecondLinksArray,
                  isPost: OrderData.order.isPost,
                  isPurchaseImagesDisabled:
                    OrderData.order.isPurchaseImagesDisabled,
                  expressCost: OrderData.order.expressCost,
                  payLinkExpress: OrderData.order.payLinkExpress,
                  paymentUUIDExpress: OrderData.order.paymentUUIDExpress,
                  payLinkSplitExpress: OrderData.order.payLinkSplitExpress,
                  paymentUUIDSplitExpress:
                    OrderData.order.paymentUUIDSplitExpress,
                  payLinkSplitSecondExpress:
                    OrderData.order.payLinkSplitSecondExpress,
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
                  __v: OrderData.order.__v,
                });
                setUploading(false);
                dragLeaveHandler();
              });
            } catch (error) {
              console.error(error);
              setUploading(false);
              dragLeaveHandler();
            }

            await updateOrderImages(
              OrderData.order._id,
              OrderData.order.orderImages
            );
          }
        }
      }
    }
  }

  useEffect(() => {
    document.addEventListener("paste", pasteHandler);
    return () => document.removeEventListener("paste", pasteHandler);
  }, []);

  function deleteImageHandler(imageName: string) {
    deleteOrderImage(imageName, OrderData.order._id)
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
          orderImages: OrderData.order.orderImages.filter(
            (imageItem) => imageItem.name !== imageName
          ),
          payProofImages: OrderData.order.payProofImages,
          buyProofImages: OrderData.order.buyProofImages,
          receiptImages: OrderData.order.receiptImages,
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
          paymentUUIDExpress: OrderData.order.paymentUUIDExpress,
          payLinkSplitExpress: OrderData.order.payLinkSplitExpress,
          paymentUUIDSplitExpress: OrderData.order.paymentUUIDSplitExpress,
          payLinkSplitSecondExpress: OrderData.order.payLinkSplitSecondExpress,
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
          __v: OrderData.order.__v,
        });
      })
      .then(() => {
        updateOrderImages(OrderData.order._id, OrderData.order.orderImages);
      })
      .catch(console.error);
  }

  function handleSubmitUpdate() {
    updateOrderDraft(
      OrderData.order._id,
      OrderData.order.link,
      OrderData.order.payLink,
      OrderData.order.paymentUUID,
      OrderData.order.payLinkSplit,
      OrderData.order.paymentUUIDSplit,
      OrderData.order.payLinkSplitSecond,
      OrderData.order.paymentUUIDSplitSecond,
      OrderData.order.payLinkExpress,
      OrderData.order.paymentUUIDExpress,
      OrderData.order.payLinkSplitExpress,
      OrderData.order.paymentUUIDSplitExpress,
      OrderData.order.payLinkSplitSecondExpress,
      OrderData.order.paymentUUIDSplitSecondExpress,
      OrderData.order.category,
      OrderData.order.subcategory,
      OrderData.order.brand,
      OrderData.order.model,
      OrderData.order.size,
      OrderData.order.payment,
      OrderData.order.priceCNY,
      OrderData.order.priceDeliveryChina,
      OrderData.order.priceDeliveryRussia,
      OrderData.order.commission,
      OrderData.order.promoCodePercent,
      OrderData.order.comment
    ).then((order) => {
      OrderData.setOrder(order);
    });

    window.scrollTo({
      left: 0,
      top: 0,
      behavior: "smooth",
    });
  }

  function handleSubmitDeleteImage() {
    deleteImageHandler(currentDeletedImage);
  }

  const sortCards = (a: IPayments, b: IPayments) => {
    if (a.paymentOrder > b.paymentOrder) {
      return 1;
    } else {
      return -1;
    }
  };

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
      link: data.link,
      payLink: data.payLink,
      payLinkSplit: data.payLinkSplit,
      paymentUUID: data.paymentUUID,
      paymentUUIDSplit: data.paymentUUIDSplit,
      payLinkSplitSecond: data.payLinkSplitSecond,
      paymentUUIDSplitSecond: data.paymentUUIDSplitSecond,
      isSplitPaid: OrderData.order.isSplitPaid,
      isSplitPaidSecond: OrderData.order.isSplitPaidSecond,
      paidAtSplit: OrderData.order.paidAtSplit,
      paidAtSplitSecond: OrderData.order.paidAtSplitSecond,
      category: data.category,
      subcategory: data.subcategory,
      brand: data.brand,
      model: data.model,
      size: data.size,
      orderImages: OrderData.order.orderImages,
      payProofImages: OrderData.order.payProofImages,
      buyProofImages: OrderData.order.buyProofImages,
      receiptImages: OrderData.order.receiptImages,
      uploadedBuyProofImages: OrderData.order.uploadedBuyProofImages,
      uploadedReceiptImages: OrderData.order.uploadedReceiptImages,
      isReceiptImages: OrderData.order.isReceiptImages,
      isSplit: OrderData.order.isSplit,
      payment: data.payment,
      currentRate: OrderData.order.currentRate,
      priceCNY: data.priceCNY,
      priceDeliveryChina: data.priceDeliveryChina,
      priceDeliveryRussia: data.priceDeliveryRussia,
      commission: data.commission,
      promoCodePercent: data.promoCodePercent,
      comment: data.comment,
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
      paymentUUIDExpress: OrderData.order.paymentUUIDExpress,
      payLinkSplitExpress: OrderData.order.payLinkSplitExpress,
      paymentUUIDSplitExpress: OrderData.order.paymentUUIDSplitExpress,
      payLinkSplitSecondExpress: OrderData.order.payLinkSplitSecondExpress,
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
      __v: OrderData.order.__v,
    });
  }, [data]);

  useEffect(() => {
    if (data.priceCNY.length > 1) {
      if (data.priceCNY[0] === "0" && data.priceCNY[1] !== ".") {
        setData({
          _id: OrderData.order._id,
          link: OrderData.order.link,
          payLink: OrderData.order.payLink,
          payLinkSplit: OrderData.order.payLinkSplit,
          paymentUUID: OrderData.order.paymentUUID,
          paymentUUIDSplit: OrderData.order.paymentUUIDSplit,
          payLinkSplitSecond: OrderData.order.payLinkSplitSecond,
          paymentUUIDSplitSecond: OrderData.order.paymentUUIDSplitSecond,
          category: OrderData.order.category,
          subcategory: OrderData.order.subcategory,
          brand: OrderData.order.brand,
          model: OrderData.order.model,
          size: OrderData.order.size,
          payment: OrderData.order.payment,
          priceCNY: "0",
          priceDeliveryChina: OrderData.order.priceDeliveryChina,
          priceDeliveryRussia: OrderData.order.priceDeliveryRussia,
          commission: OrderData.order.commission,
          promoCodePercent: OrderData.order.promoCodePercent,
          comment: OrderData.order.comment,
        });
      }
    }

    if (data.priceDeliveryChina.length > 1) {
      if (
        data.priceDeliveryChina[0] === "0" &&
        data.priceDeliveryChina[1] !== "."
      ) {
        setData({
          _id: OrderData.order._id,
          link: OrderData.order.link,
          payLink: OrderData.order.payLink,
          payLinkSplit: OrderData.order.payLinkSplit,
          paymentUUID: OrderData.order.paymentUUID,
          paymentUUIDSplit: OrderData.order.paymentUUIDSplit,
          payLinkSplitSecond: OrderData.order.payLinkSplitSecond,
          paymentUUIDSplitSecond: OrderData.order.paymentUUIDSplitSecond,
          category: OrderData.order.category,
          subcategory: OrderData.order.subcategory,
          brand: OrderData.order.brand,
          model: OrderData.order.model,
          size: OrderData.order.size,
          payment: OrderData.order.payment,
          priceCNY: OrderData.order.priceCNY,
          priceDeliveryChina: "0",
          priceDeliveryRussia: OrderData.order.priceDeliveryRussia,
          commission: OrderData.order.commission,
          promoCodePercent: OrderData.order.promoCodePercent,
          comment: OrderData.order.comment,
        });
      }
    }

    if (data.priceDeliveryRussia.length > 1) {
      if (
        data.priceDeliveryRussia[0] === "0" &&
        data.priceDeliveryRussia[1] !== "."
      ) {
        setData({
          _id: OrderData.order._id,
          link: OrderData.order.link,
          payLink: OrderData.order.payLink,
          payLinkSplit: OrderData.order.payLinkSplit,
          paymentUUID: OrderData.order.paymentUUID,
          paymentUUIDSplit: OrderData.order.paymentUUIDSplit,
          payLinkSplitSecond: OrderData.order.payLinkSplitSecond,
          paymentUUIDSplitSecond: OrderData.order.paymentUUIDSplitSecond,
          category: OrderData.order.category,
          subcategory: OrderData.order.subcategory,
          brand: OrderData.order.brand,
          model: OrderData.order.model,
          size: OrderData.order.size,
          payment: OrderData.order.payment,
          priceCNY: OrderData.order.priceCNY,
          priceDeliveryChina: OrderData.order.priceDeliveryChina,
          priceDeliveryRussia: "0",
          commission: OrderData.order.commission,
          promoCodePercent: OrderData.order.promoCodePercent,
          comment: OrderData.order.comment,
        });
      }
    }

    if (data.commission.length > 1) {
      if (data.commission[0] === "0" && data.commission[1] !== ".") {
        setData({
          _id: OrderData.order._id,
          link: OrderData.order.link,
          payLink: OrderData.order.payLink,
          payLinkSplit: OrderData.order.payLinkSplit,
          paymentUUID: OrderData.order.paymentUUID,
          paymentUUIDSplit: OrderData.order.paymentUUIDSplit,
          payLinkSplitSecond: OrderData.order.payLinkSplitSecond,
          paymentUUIDSplitSecond: OrderData.order.paymentUUIDSplitSecond,
          category: OrderData.order.category,
          subcategory: OrderData.order.subcategory,
          brand: OrderData.order.brand,
          model: OrderData.order.model,
          size: OrderData.order.size,
          payment: OrderData.order.payment,
          priceCNY: OrderData.order.priceCNY,
          priceDeliveryChina: OrderData.order.priceDeliveryChina,
          priceDeliveryRussia: OrderData.order.priceDeliveryRussia,
          commission: "0",
          promoCodePercent: OrderData.order.promoCodePercent,
          comment: OrderData.order.comment,
        });
      }
    }
  }, [
    data.priceCNY,
    data.priceDeliveryChina,
    data.priceDeliveryRussia,
    data.commission,
  ]);

  return (
    <section className={styles["order-change"]}>
      {uploading && <Preloader />}
      <h2 className={styles["order-change__title"]}>
        Заказ #{OrderData.order.orderId}
      </h2>
      <p className={styles["order-change__status"]}>
        Статус: {OrderData.order.status}
        {OrderData.order.totalReorder && ", перезаказан"}
        {OrderData.order.isPost && ", почта РФ"}
      </p>
      {OrderData.order.deliveredAt && OrderData.order.deliveredAt !== "" && (
        <p className={styles["order-change__status"]}>
          Доставлен:{" "}
          {dayjs
            .tz(new Date(OrderData.order.deliveredAt!))
            .format("DD-MM-YYYY в HH:mm")}
        </p>
      )}
      {(!OrderData.order.isSplitPaid || !OrderData.order.isSplitPaidSecond) &&
        (OrderData.order.payment === "Сплит -" ||
          OrderData.order.payment === "Сплит Anypayments" ||
          OrderData.order.payment === "Сплит Onepay") &&
        OrderData.order.isSplit && (
          <p>
            <span className={styles["order-change__status_red"]}>
              Сплит не погашен
            </span>
          </p>
        )}
      {OrderData.order.isSurcharge && (
        <p>
          <span className={styles["order-change__status_red"]}>
            Доплата не погашена
          </span>
        </p>
      )}
      {OrderData.order.reorder === true && (
        <p className={styles["order-change__status_red"]}>Перезаказ</p>
      )}
      {OrderData.order.expressCost === EXPRESS_PRICE && (
        <p className={styles["order-change__status_red"]}>Экспресс-доставка</p>
      )}
      {OrderData.order.poizonCode !== "" &&
        OrderData.order.inChinaStockAt !== null &&
        OrderData.order.deliveryAddress === "" &&
        OrderData.order.status !== "Завершён" && (
          <p className={styles["order-change__status_orange"]}>
            Необходимо заполнить данные для доставки
          </p>
        )}
      {OrderData.order.combinedOrder.length > 0 && (
        <p
          className={`${styles["order-change__status"]} ${styles["order-change__flex-status"]}`}
        >
          <span className={styles["order-change__status_orange"]}>
            Объединён с:
          </span>
          {OrderData.mergedOrders.map((item: IMergedOrders) => {
            return (
              item.orderId !== OrderData.order.orderId && (
                <Link
                  className={`${styles["order-change__order-link"]} ${
                    item.orderStatus === "На складе в РФ" &&
                    styles["green-status"]
                  } ${item.orderStatus === "Завершён" && styles["red-status"]}`}
                  href={`${BASE_URL_FRONT}/order/change/${item._id}`}
                  key={item.orderId}
                >
                  Заказ {item.orderId}
                  {item.orderStatus === "На складе в РФ" &&
                    `: ${item.subcategory}`}
                </Link>
              )
            );
          })}
        </p>
      )}
      {OrderData.order.combinedOrder.length > 0 && (
        <p>
          Общая сумма: <span>{combinedOrdersTotal}</span>
        </p>
      )}
      {OrderData.order.comment !== "" && (
        <p>
          Комментарий:{" "}
          <span className={styles["order-change__status_red"]}>
            {OrderData.order.comment}
          </span>
        </p>
      )}
      {OrderData.order.combinedOrder.length > 0 &&
        OrderData.mergedOrders.map((item: IMergedOrders) => {
          if (
            item._id !== OrderData.order._id &&
            item.isSplitPaid === true &&
            item.isSplitPaidSecond === false
          ) {
            return (
              <p className={styles["order-change__status_red"]}>
                В позиции {item.orderId} сплит не погашен
              </p>
            );
          }
        })}
      <div className={styles["order-change__nav-bar"]}>
        <p
          className={`${styles["order-change__nav-item"]} ${
            orderСhapter === "Order" && styles["order-change__nav-item_active"]
          }`}
          onClick={openOrder}
        >
          Заказ
        </p>
        {UserData.userData.position !== "Работник склада" && (
          <p
            className={`${styles["order-change__nav-item"]} ${
              orderСhapter === "Pay" && styles["order-change__nav-item_active"]
            }`}
            onClick={openPayment}
          >
            Оплата
          </p>
        )}
        {UserData.userData.position !== "Работник склада" && (
          <p
            className={`${styles["order-change__nav-item"]} ${
              orderСhapter === "Client" &&
              styles["order-change__nav-item_active"]
            }`}
            onClick={openClientData}
          >
            Клиент
          </p>
        )}
        {UserData.userData.position !== DROPSHIPPER && (
          <p
            className={`${styles["order-change__nav-item"]} ${
              orderСhapter === "Purchase" &&
              styles["order-change__nav-item_active"]
            }`}
            onClick={openPurchaseData}
          >
            Закупка
          </p>
        )}
        {UserData.userData.position !== DROPSHIPPER && (
          <p
            className={`${styles["order-change__nav-item"]} ${
              orderСhapter === "Delivery" &&
              styles["order-change__nav-item_active"]
            }`}
            onClick={openDelivery}
          >
            Доставка
          </p>
        )}
        {UserData.userData.position !== DROPSHIPPER && (
          <p
            className={`${styles["order-change__nav-item"]} ${
              orderСhapter === "DeliveryDuplicate" &&
              styles["order-change__nav-item_active"]
            }`}
            onClick={openDeliveryDuplicate}
          >
            Дубликат
          </p>
        )}
      </div>
      {orderСhapter === "Order" && (
        <div className={styles["order-change__order-container"]}>
          {UserData.userData.position !== "Работник склада" && (
            <div className={styles["order-change__public-link-container"]}>
              <p className={styles["order-change__public-link-text"]}>
                Публичная ссылка
              </p>
              <a
                className={styles["order-change__public-link"]}
                href={`${BASE_URL_FRONT}/order/${OrderData.order._id}/${OrderData.order.orderId}`}
                target="_blank"
                rel="noreferrer"
              >
                {BASE_URL_FRONT}/order/{OrderData.order._id}/
                {OrderData.order.orderId}
              </a>
              <div
                onClick={copyLink}
                className={styles["order-change__public-link-text-copy"]}
              >
                {!isCopy ? "Скопировать" : "Cкопировано в буфер обмена"}{" "}
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
              </div>
              {UserData.userData.position !== DROPSHIPPER && (
                <div
                  className={styles["order-change__public-link-text-copy"]}
                  onClick={copyNumberLink}
                >
                  {!isCopyNumberLink
                    ? "Скопировать номер + ссылку"
                    : "Cкопировано в буфер обмена"}{" "}
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
                </div>
              )}
              {UserData.userData.position !== DROPSHIPPER && (
                <div
                  className={styles["order-change__public-link-text-copy"]}
                  onClick={copyImage}
                >
                  {!isCopySizePhoto
                    ? "Скопировать фото с размером"
                    : "Cкопировано в буфер обмена"}{" "}
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
                </div>
              )}
            </div>
          )}
          <form
            onSubmit={openSubmitPopup}
            className={styles["order-change__order-form"]}
          >
            <h2 className={styles["order-change__order-title"]}>Товар</h2>
            <TextInput
              name="link"
              label="Ссылка"
              value={OrderData.order.link}
              handleChange={handleChange}
              disabled={
                UserData.userData.position === DROPSHIPPER &&
                OrderData.order.status !== "Черновик"
              }
              required={true}
            />
            {OrderData.order.link !== "" && (
              <a
                className={styles["order-change__public-link"]}
                href={OrderData.order.link}
                target="_blank"
                rel="noreferrer"
              >
                Перейти
              </a>
            )}
            {(OrderData.order.payment === "Сплит -" ||
              OrderData.order.payment === "Сплит Anypayments" ||
              OrderData.order.payment === "Сплит Onepay") && (
              <div className={styles["checkbox__container"]}>
                <input
                  className={styles["checkbox__button"]}
                  type="checkbox"
                  disabled={OrderData.order.status !== "Черновик"}
                  checked={OrderData.order.isSplit}
                  onChange={handleIsSplitChange}
                />
                <label className={styles["checkbox__title"]}>
                  Оплатить в сплит
                </label>
              </div>
            )}
            {(OrderData.order.payment === "Перейти по ссылке -" ||
              OrderData.order.payment === "Перейти по ссылке Onepay" ||
              OrderData.order.payment === "Перейти по ссылке Anypayments" ||
              OrderData.order.payment === "Сплит -" ||
              OrderData.order.payment === "Сплит Onepay" ||
              OrderData.order.payment === "Сплит Anypayments") &&
              UserData.userData.position !== "Работник склада" && (
                <TextInput
                  name="payLink"
                  label="Cсылка на оплату"
                  value={OrderData.order.payLink}
                  handleChange={handleChange}
                  required={false}
                  disabled={true}
                />
              )}
            {(OrderData.order.payment === "Перейти по ссылке -" ||
              OrderData.order.payment === "Перейти по ссылке Onepay" ||
              OrderData.order.payment === "Перейти по ссылке Anypayments" ||
              OrderData.order.payment === "Сплит -" ||
              OrderData.order.payment === "Сплит Onepay" ||
              OrderData.order.payment === "Сплит Anypayments") &&
              UserData.userData.position !== "Работник склада" && (
                <TextInput
                  name="paymentUUID"
                  label="UUID оплаты"
                  value={OrderData.order.paymentUUID}
                  handleChange={handleChange}
                  required={false}
                  disabled={true}
                />
              )}
            {OrderData.order.isSurcharge &&
              UserData.userData.position !== "Работник склада" && (
                <TextInput
                  name="payLink"
                  label="Cсылка на доплату"
                  value={OrderData.order.surchargePayLink}
                  handleChange={handleChange}
                  required={false}
                  disabled={true}
                />
              )}
            {OrderData.order.isSurcharge &&
              UserData.userData.position !== "Работник склада" && (
                <TextInput
                  name="paymentUUID"
                  label="UUID доплаты"
                  value={OrderData.order.surchargeUUID}
                  handleChange={handleChange}
                  required={false}
                  disabled={true}
                />
              )}
            {(OrderData.order.payment === "Перейти по ссылке -" ||
              OrderData.order.payment === "Перейти по ссылке Onepay" ||
              OrderData.order.payment === "Перейти по ссылке Anypayments" ||
              OrderData.order.payment === "Сплит -" ||
              OrderData.order.payment === "Сплит Onepay" ||
              OrderData.order.payment === "Сплит Anypayments") &&
              UserData.userData.position !== "Работник склада" && (
                <TextInput
                  name="payLinkExpress"
                  label="Cсылка на оплату (экспресс)"
                  value={OrderData.order.payLinkExpress}
                  handleChange={handleChange}
                  required={false}
                  disabled={true}
                />
              )}
            {(OrderData.order.payment === "Перейти по ссылке -" ||
              OrderData.order.payment === "Перейти по ссылке Onepay" ||
              OrderData.order.payment === "Перейти по ссылке Anypayments" ||
              OrderData.order.payment === "Сплит -" ||
              OrderData.order.payment === "Сплит Onepay" ||
              OrderData.order.payment === "Сплит Anypayments") &&
              UserData.userData.position !== "Работник склада" && (
                <TextInput
                  name="paymentUUIDExpress"
                  label="UUID оплаты (экспресс)"
                  value={OrderData.order.paymentUUIDExpress}
                  handleChange={handleChange}
                  required={false}
                  disabled={true}
                />
              )}
            {(OrderData.order.payment === "Сплит -" ||
              OrderData.order.payment === "Сплит Onepay" ||
              OrderData.order.payment === "Сплит Anypayments") &&
              UserData.userData.position !== "Работник склада" && (
                <TextInput
                  name="payLinkSplit"
                  label="Cсылка на оплату (сплит 1/2)"
                  value={OrderData.order.payLinkSplit}
                  handleChange={handleChange}
                  required={false}
                  disabled={true}
                />
              )}
            {(OrderData.order.payment === "Сплит -" ||
              OrderData.order.payment === "Сплит Onepay" ||
              OrderData.order.payment === "Сплит Anypayments") &&
              UserData.userData.position !== "Работник склада" && (
                <TextInput
                  name="paymentUUIDSplit"
                  label="UUID оплаты (сплит 1/2)"
                  value={OrderData.order.paymentUUIDSplit}
                  handleChange={handleChange}
                  required={false}
                  disabled={true}
                />
              )}
            {(OrderData.order.payment === "Сплит -" ||
              OrderData.order.payment === "Сплит Onepay" ||
              OrderData.order.payment === "Сплит Anypayments") &&
              UserData.userData.position !== "Работник склада" && (
                <TextInput
                  name="payLinkSplitSecond"
                  label="Cсылка на оплату (сплит 2/2)"
                  value={OrderData.order.payLinkSplitSecond}
                  handleChange={handleChange}
                  required={false}
                  disabled={true}
                />
              )}
            {(OrderData.order.payment === "Сплит -" ||
              OrderData.order.payment === "Сплит Onepay") &&
              UserData.userData.position !== "Работник склада" && (
                <TextInput
                  name="paymentUUIDSplitSecond"
                  label="UUID оплаты (сплит 2/2)"
                  value={OrderData.order.paymentUUIDSplitSecond}
                  handleChange={handleChange}
                  required={false}
                  disabled={true}
                />
              )}
            {(OrderData.order.payment === "Сплит -" ||
              OrderData.order.payment === "Сплит Onepay") &&
              UserData.userData.position !== "Работник склада" && (
                <TextInput
                  name="payLinkSplitExpress"
                  label="Cсылка на оплату (экспресс & сплит 1/2)"
                  value={OrderData.order.payLinkSplitExpress}
                  handleChange={handleChange}
                  required={false}
                  disabled={true}
                />
              )}
            {(OrderData.order.payment === "Сплит -" ||
              OrderData.order.payment === "Сплит Onepay" ||
              OrderData.order.payment === "Сплит Anypayments") &&
              UserData.userData.position !== "Работник склада" && (
                <TextInput
                  name="paymentUUIDSplitExpress"
                  label="UUID оплаты (экспресс & сплит 1/2)"
                  value={OrderData.order.paymentUUIDSplitExpress}
                  handleChange={handleChange}
                  required={false}
                  disabled={true}
                />
              )}
            {(OrderData.order.payment === "Сплит -" ||
              OrderData.order.payment === "Сплит Onepay" ||
              OrderData.order.payment === "Сплит Anypayments") &&
              UserData.userData.position !== "Работник склада" && (
                <TextInput
                  name="payLinkSplitSecondExpress"
                  label="Cсылка на оплату (экспресс & сплит 2/2)"
                  value={OrderData.order.payLinkSplitSecondExpress}
                  handleChange={handleChange}
                  required={false}
                  disabled={true}
                />
              )}
            {(OrderData.order.payment === "Сплит -" ||
              OrderData.order.payment === "Сплит Onepay" ||
              OrderData.order.payment === "Сплит Anypayments") &&
              UserData.userData.position !== "Работник склада" && (
                <TextInput
                  name="paymentUUIDSplitSecondExpress"
                  label="UUID оплаты (экспресс & сплит 2/2)"
                  value={OrderData.order.paymentUUIDSplitSecondExpress}
                  handleChange={handleChange}
                  required={false}
                  disabled={true}
                />
              )}
            <div className={styles["order-change__input-container"]}>
              <label>
                Категория<span className={styles["red-star"]}>*</span>
              </label>
              <select
                className={`${styles["order-change__select"]}`}
                name="subcategory"
                value={OrderData.order.subcategory}
                onChange={handleChange}
                disabled={
                  UserData.userData.position === DROPSHIPPER &&
                  OrderData.order.status !== "Черновик"
                }
                required
              >
                <option value="" selected disabled>
                  -- Выберите --
                </option>
                <option value="Кроссовки">Кроссовки</option>
                <option value="Зимняя обувь">Зимняя обувь</option>
                <option value="Куртка">Куртка</option>
                <option value="Толстовка">Толстовка</option>
                <option value="Футболка">Футболка</option>
                <option value="Носки">Носки</option>
                <option value="Сумка">Сумка</option>
                <option value="Духи">Духи</option>
                <option value="Штаны">Штаны</option>
                <option value="Головной убор">Головной убор</option>
                <option value="Техника">Техника</option>
                <option value="Прочее">Прочее</option>
              </select>
            </div>
            <TextInput
              name="model"
              label="Модель"
              value={OrderData.order.model}
              handleChange={handleChange}
              disabled={
                UserData.userData.position === DROPSHIPPER &&
                OrderData.order.status !== "Черновик"
              }
              required={true}
            />
            <TextInput
              name="size"
              label="Размер"
              value={OrderData.order.size}
              handleChange={handleChange}
              disabled={
                UserData.userData.position === DROPSHIPPER &&
                OrderData.order.status !== "Черновик"
              }
              required={true}
            />
            <label>
              Изображения товара<span className={styles["red-star"]}>*</span>
            </label>
            <ul className={styles["order-change__images-list"]}>
              {OrderData.order.orderImages
                .slice()
                .reverse()
                .map((image) => {
                  return (
                    <li
                      key={image.name}
                      className={styles["order-change__image"]}
                    >
                      {UserData.userData.position !== "Работник склада" &&
                        UserData.userData.position !== DROPSHIPPER && (
                          <div
                            className={styles["order-change__delete-image"]}
                            onClick={() => openImageSubmitPopup(image.name)}
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
                        className={styles["order-change__image-item"]}
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

            {UserData.userData.position !== "Работник склада" &&
              UserData.userData.position !== DROPSHIPPER && (
                <Dropzone
                  onDrop={(e: any) =>
                    uploadFileHandler(e, "/order-images", setUploading)
                  }
                  onDragEnter={dragHandler}
                  onDragLeave={dragLeaveHandler}
                  maxSize={MAX_SIZE}
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

            {UserData.userData.position !== "Работник склада" && (
              <>
                <h2 className={styles["order-change__order-title"]}>Расчёт</h2>
                <div className={styles["order-change__input-container"]}>
                  <label>
                    Способ оплаты<span className={styles["red-star"]}>*</span>
                  </label>
                  <select
                    className={`${styles["order-change__select"]}`}
                    name="payment"
                    value={OrderData.order.payment}
                    onChange={handleChange}
                    disabled={OrderData.order.status !== "Черновик"}
                    required
                  >
                    <option value="" selected disabled>
                      -- Выберите --
                    </option>
                    {payments
                      .slice()
                      .sort(sortCards)
                      .map((paymentItem) => {
                        return (
                          <option
                            key={paymentItem._id}
                            value={`${paymentItem.title} ${paymentItem.number}`}
                          >
                            {paymentItem.title} {paymentItem.number}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <TextInput
                  name="currentRate"
                  label="Курс RUB/CNY"
                  value={OrderData.order.currentRate}
                  required={true}
                  readonly={true}
                />
                <TextInput
                  name="priceCNY"
                  label="Цена CNY"
                  value={OrderData.order.priceCNY}
                  handleChange={handleChange}
                  disabled={
                    UserData.userData.position === DROPSHIPPER &&
                    OrderData.order.status !== "Черновик"
                  }
                  required={true}
                />
                <TextInput
                  name="priceRUB"
                  label="Цена RUB"
                  value={priceRub.toString()}
                  disabled={
                    UserData.userData.position === DROPSHIPPER &&
                    OrderData.order.status !== "Черновик"
                  }
                  required={true}
                  readonly={true}
                />
                <TextInput
                  name="priceDeliveryChina"
                  label="Стоимость доставки POIZON - Cклад в Китае"
                  value={OrderData.order.priceDeliveryChina}
                  handleChange={handleChange}
                  disabled={
                    UserData.userData.position === DROPSHIPPER &&
                    OrderData.order.status !== "Черновик"
                  }
                  required={true}
                />
                <TextInput
                  name="priceDeliveryRussia"
                  label="Стоимость доставки Cклад в Китае - Cклад в РФ"
                  value={OrderData.order.priceDeliveryRussia}
                  handleChange={handleChange}
                  disabled={
                    UserData.userData.position === DROPSHIPPER &&
                    OrderData.order.status !== "Черновик"
                  }
                  required={true}
                />
                <TextInput
                  name="commission"
                  label="Комиссия сервиса"
                  value={OrderData.order.commission}
                  handleChange={handleChange}
                  disabled={
                    UserData.userData.position === DROPSHIPPER &&
                    OrderData.order.status !== "Черновик"
                  }
                  required={true}
                />
                <div className={styles["order-change__input-container"]}>
                  <label>Промо-код</label>
                  <select
                    className={`${styles["order-change__select"]}`}
                    name="promoCodePercent"
                    value={
                      data.promoCodePercent > 0 ||
                      OrderData.order.promoCodePercent > 0
                        ? OrderData.order.promoCodePercent
                        : ""
                    }
                    onChange={handleChange}
                    disabled={
                      UserData.userData.position === DROPSHIPPER &&
                      OrderData.order.status !== "Черновик"
                    }
                  >
                    <option value="" selected disabled>
                      -- Выберите --
                    </option>
                    {PromoCodeData.promoCodeList.map((promoCodeItem) => {
                      return (
                        <option
                          key={promoCodeItem._id}
                          value={`${promoCodeItem.percent}`}
                        >
                          {promoCodeItem.code} {promoCodeItem.percent}₽
                        </option>
                      );
                    })}
                  </select>
                  {OrderData.order.promoCodePercent > 0 && (
                    <span className={styles["order-change__promo-code_active"]}>
                      Промо-код применён
                    </span>
                  )}
                  {OrderData.order.promoCodePercent === 0 && (
                    <span
                      className={styles["order-change__promo-code_not-active"]}
                    >
                      Промо-код НЕ применён
                    </span>
                  )}
                </div>
                <TextInput
                  name="totalPrice"
                  label="Общая стоимость"
                  value={
                    data.promoCodePercent > 0 ||
                    OrderData.order.promoCodePercent > 0
                      ? totalPriceWithPromo.toString()
                      : totalPrice.toString()
                  }
                  required={true}
                  readonly={true}
                />
                <div className={styles["order-change__input-container"]}>
                  <label>Комментарий</label>
                  <textarea
                    className={`${styles["order-change__textarea"]}`}
                    name="comment"
                    onChange={handleChange}
                    value={OrderData.order.comment}
                  ></textarea>
                </div>
                <button
                  className={`${styles["order-change__order-submit"]}`}
                  type="submit"
                >
                  Cохранить
                </button>
              </>
            )}
          </form>
        </div>
      )}
      {orderСhapter === "Pay" && <AcceptPayment />}
      {orderСhapter === "Client" && <Client />}
      {orderСhapter === "Purchase" && <Purchase />}
      {orderСhapter === "Delivery" && <Delivery />}
      {orderСhapter === "DeliveryDuplicate" && <DeliveryDuplicate />}
      <ImagePopup
        isImagePopupOpen={isImagePopupOpen}
        currentImage={currentImage}
        closePopup={closeImagePopup}
      />
      <SubmitPopup
        submitText="Обновить данные в заказе"
        isSubmitPopup={isSubmitPopup}
        closeSubmitPopup={closeSubmitPopup}
        onSubmit={handleSubmitUpdate}
      />
      <SubmitPopup
        submitText="Удалить изображение"
        isSubmitPopup={isImageSubmitPopup}
        closeSubmitPopup={closeImageSubmitPopup}
        onSubmit={handleSubmitDeleteImage}
      />
    </section>
  );
});

export default OrderChange;
