"use strict";
exports.__esModule = true;
exports.orderСompleted = exports.orderSent = exports.inStockInRussia = exports.deliveryToMoscow = exports.deletePurchaseImage = exports.updatePurchaseImages = exports.updatePurchaseData = exports.cancelPurchase = exports.inPurchase = exports.acceptPayment = exports.uploadImages = exports.deletePayProofImage = exports.deleteOrderImage = exports.updatePayProofImages = exports.updateOrderImages = exports.updateDeliveryData = exports.updateOrderDraft = exports.deleteOrder = exports.createOrder = exports.getCurrentOrder = exports.getCurrentClientOrder = exports.getOrders = void 0;
var constants_1 = require("./constants");
var HEADERS = {
    "Content-Type": "application/json"
};
exports.getOrders = function () {
    return fetch(constants_1.BASE_URL + "/orders", {
        credentials: "include",
        method: "GET",
        headers: HEADERS
    }).then(checkResponse);
};
exports.getCurrentClientOrder = function (orderId) {
    return fetch(constants_1.BASE_URL + "/order/current/" + orderId, {
        credentials: "include",
        method: "GET",
        headers: HEADERS
    }).then(checkResponse);
};
exports.getCurrentOrder = function (orderId) {
    return fetch(constants_1.BASE_URL + "/order/" + orderId, {
        credentials: "include",
        method: "GET",
        headers: HEADERS
    }).then(checkResponse);
};
exports.createOrder = function (creater, link, category, subcategory, brand, model, size, orderImages, payment, currentRate, priceCNY, priceDeliveryChina, priceDeliveryRussia, commission, promoCodePercent, comment) {
    return fetch(constants_1.BASE_URL + "/orders/create", {
        credentials: "include",
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify({
            creater: creater,
            link: link,
            category: category,
            subcategory: subcategory,
            brand: brand,
            model: model,
            size: size,
            orderImages: orderImages,
            payment: payment,
            currentRate: currentRate,
            priceCNY: priceCNY,
            priceDeliveryChina: priceDeliveryChina,
            priceDeliveryRussia: priceDeliveryRussia,
            commission: commission,
            promoCodePercent: promoCodePercent,
            comment: comment
        })
    }).then(checkResponse);
};
exports.deleteOrder = function (id) {
    return fetch(constants_1.BASE_URL + "/orders/" + id, {
        credentials: "include",
        method: "DELETE",
        headers: HEADERS
    }).then(checkResponse);
};
exports.updateOrderDraft = function (id, link, category, subcategory, brand, model, size, payment, priceCNY, priceDeliveryChina, priceDeliveryRussia, commission, promoCodePercent, comment) {
    return fetch(constants_1.BASE_URL + "/order/draft/" + id, {
        credentials: "include",
        method: "PATCH",
        headers: HEADERS,
        body: JSON.stringify({
            link: link,
            category: category,
            subcategory: subcategory,
            brand: brand,
            model: model,
            size: size,
            payment: payment,
            priceCNY: priceCNY,
            priceDeliveryChina: priceDeliveryChina,
            priceDeliveryRussia: priceDeliveryRussia,
            commission: commission,
            promoCodePercent: promoCodePercent,
            comment: comment
        })
    }).then(checkResponse);
};
exports.updateDeliveryData = function (id, deliveryName, deliveryNameRecipient, deliveryPhone, deliveryPhoneRecipient, deliveryMethod, deliveryAddress) {
    return fetch(constants_1.BASE_URL + "/order/delivery-data/" + id, {
        credentials: "include",
        method: "PATCH",
        headers: HEADERS,
        body: JSON.stringify({
            deliveryName: deliveryName,
            deliveryNameRecipient: deliveryNameRecipient,
            deliveryPhone: deliveryPhone,
            deliveryPhoneRecipient: deliveryPhoneRecipient,
            deliveryMethod: deliveryMethod,
            deliveryAddress: deliveryAddress
        })
    }).then(checkResponse);
};
exports.updateOrderImages = function (id, orderImages) {
    return fetch(constants_1.BASE_URL + "/order/order-images/" + id, {
        credentials: "include",
        method: "PATCH",
        headers: HEADERS,
        body: JSON.stringify({
            orderImages: orderImages
        })
    }).then(checkResponse);
};
exports.updatePayProofImages = function (id, payProofImages) {
    return fetch(constants_1.BASE_URL + "/order/pay-proof-images/" + id, {
        credentials: "include",
        method: "PATCH",
        headers: HEADERS,
        body: JSON.stringify({
            payProofImages: payProofImages
        })
    }).then(checkResponse);
};
exports.deleteOrderImage = function (imageName, id) {
    return fetch(constants_1.BASE_URL + "/order/order-images/" + id, {
        credentials: "include",
        method: "DELETE",
        headers: HEADERS,
        body: JSON.stringify({
            imageName: imageName
        })
    }).then(checkResponse);
};
exports.deletePayProofImage = function (imageName, id) {
    return fetch(constants_1.BASE_URL + "/order/pay-proof-images/" + id, {
        credentials: "include",
        method: "DELETE",
        headers: HEADERS,
        body: JSON.stringify({
            imageName: imageName
        })
    }).then(checkResponse);
};
exports.uploadImages = function (files, folder) {
    return fetch(constants_1.BASE_URL + "/images-upload/", {
        method: "POST",
        headers: {
            Folder: folder
        },
        body: files
    }).then(checkResponse);
};
exports.acceptPayment = function (id) {
    return fetch(constants_1.BASE_URL + "/order/order-accept-pay/" + id, {
        credentials: "include",
        method: "PATCH",
        headers: HEADERS
    }).then(checkResponse);
};
exports.inPurchase = function (id, buyer) {
    return fetch(constants_1.BASE_URL + "/order/in-purchase/" + id, {
        credentials: "include",
        method: "PATCH",
        headers: HEADERS,
        body: JSON.stringify({
            buyer: buyer
        })
    }).then(checkResponse);
};
exports.cancelPurchase = function (id) {
    return fetch(constants_1.BASE_URL + "/order/cancel-purchase/" + id, {
        credentials: "include",
        method: "PATCH",
        headers: HEADERS
    }).then(checkResponse);
};
exports.updatePurchaseData = function (id, poizonCode) {
    return fetch(constants_1.BASE_URL + "/order/purchase/" + id, {
        credentials: "include",
        method: "PATCH",
        headers: HEADERS,
        body: JSON.stringify({
            poizonCode: poizonCode
        })
    }).then(checkResponse);
};
exports.updatePurchaseImages = function (id, buyProofImages) {
    return fetch(constants_1.BASE_URL + "/order/purchase-images/" + id, {
        credentials: "include",
        method: "PATCH",
        headers: HEADERS,
        body: JSON.stringify({
            buyProofImages: buyProofImages
        })
    }).then(checkResponse);
};
exports.deletePurchaseImage = function (imageName, id) {
    return fetch(constants_1.BASE_URL + "/order/purchase-images/" + id, {
        credentials: "include",
        method: "DELETE",
        headers: HEADERS,
        body: JSON.stringify({
            imageName: imageName
        })
    }).then(checkResponse);
};
exports.deliveryToMoscow = function (id) {
    return fetch(constants_1.BASE_URL + "/order/delivery-to-Moscow/" + id, {
        credentials: "include",
        method: "PATCH",
        headers: HEADERS
    }).then(checkResponse);
};
exports.inStockInRussia = function (id, stockman) {
    return fetch(constants_1.BASE_URL + "/order/in-stock-in-Russia/" + id, {
        credentials: "include",
        method: "PATCH",
        headers: HEADERS,
        body: JSON.stringify({
            stockman: stockman
        })
    }).then(checkResponse);
};
exports.orderSent = function (id, deliveryCode) {
    return fetch(constants_1.BASE_URL + "/order/order-sent/" + id, {
        credentials: "include",
        method: "PATCH",
        headers: HEADERS,
        body: JSON.stringify({
            deliveryCode: deliveryCode
        })
    }).then(checkResponse);
};
exports.orderСompleted = function (id) {
    return fetch(constants_1.BASE_URL + "/order/order-completed/" + id, {
        credentials: "include",
        method: "PATCH",
        headers: HEADERS
    }).then(checkResponse);
};
var checkResponse = function (res) {
    if (res.ok) {
        return res.json();
    }
    else {
        return Promise.reject(res.status);
    }
};
