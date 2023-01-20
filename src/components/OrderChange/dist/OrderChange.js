"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_1 = require("react");
var constants_1 = require("../../utils/constants");
var TextInput_1 = require("../UI/TextInput/TextInput");
var OrderChange_styles_module_css_1 = require("./OrderChange.styles.module.css");
var order_1 = require("../../store/order");
var promo_code_1 = require("../../store/promo-code");
var Order_1 = require("../../utils/Order");
var SubmitPopup_1 = require("../SubmitPopup/SubmitPopup");
var constants_2 = require("../../utils/constants");
var react_dropzone_1 = require("react-dropzone");
var ImagePopup_1 = require("../ImagePopup/ImagePopup");
var AcceptPayment_1 = require("../AcceptPayment/AcceptPayment");
var Client_1 = require("../Client/Client");
var Purchase_1 = require("../Purchase/Purchase");
var Delivery_1 = require("../Delivery/Delivery");
var OrderChange = function (_a) {
    var payments = _a.payments;
    var _b = react_1.useState({
        _id: order_1["default"].order._id,
        link: order_1["default"].order.link,
        category: order_1["default"].order.category,
        subcategory: order_1["default"].order.subcategory,
        brand: order_1["default"].order.brand,
        model: order_1["default"].order.model,
        size: order_1["default"].order.size,
        payment: order_1["default"].order.payment,
        priceCNY: order_1["default"].order.priceCNY,
        priceDeliveryChina: order_1["default"].order.priceDeliveryChina,
        priceDeliveryRussia: order_1["default"].order.priceDeliveryRussia,
        commission: order_1["default"].order.commission,
        promoCodePercent: order_1["default"].order.promoCodePercent,
        comment: order_1["default"].order.comment
    }), data = _b[0], setData = _b[1];
    var _c = react_1.useState("Order"), orderСhapter = _c[0], setOrderСhapter = _c[1];
    var _d = react_1.useState(false), isSubmitPopup = _d[0], setIsSubmitPopup = _d[1];
    var _e = react_1.useState(false), uploading = _e[0], setUploading = _e[1];
    var _f = react_1.useState(false), isImagePopupOpen = _f[0], setIsImagePopupOpen = _f[1];
    var _g = react_1.useState(""), currentImage = _g[0], setCurrentImage = _g[1];
    var _h = react_1.useState(false), isCopy = _h[0], setIsCopy = _h[1];
    var priceRub = Math.ceil(parseFloat(order_1["default"].order.priceCNY) *
        parseFloat(order_1["default"].order.currentRate));
    var totalPrice = Math.ceil(priceRub +
        parseFloat(order_1["default"].order.priceDeliveryChina) +
        parseFloat(order_1["default"].order.priceDeliveryRussia) +
        parseFloat(order_1["default"].order.commission));
    var totalPriceWithPromo = Math.ceil(priceRub +
        parseFloat(order_1["default"].order.priceDeliveryChina) +
        parseFloat(order_1["default"].order.priceDeliveryRussia) +
        parseFloat(order_1["default"].order.commission) -
        data.promoCodePercent);
    var MAX_SIZE = 5242880;
    data._id !== order_1["default"].order._id &&
        setData({
            _id: order_1["default"].order._id,
            link: order_1["default"].order.link,
            category: order_1["default"].order.category,
            subcategory: order_1["default"].order.subcategory,
            brand: order_1["default"].order.brand,
            model: order_1["default"].order.model,
            size: order_1["default"].order.size,
            payment: order_1["default"].order.payment,
            priceCNY: order_1["default"].order.priceCNY,
            priceDeliveryChina: order_1["default"].order.priceDeliveryChina,
            priceDeliveryRussia: order_1["default"].order.priceDeliveryRussia,
            commission: order_1["default"].order.commission,
            promoCodePercent: order_1["default"].order.promoCodePercent,
            comment: order_1["default"].order.comment
        });
    function copyLink() {
        navigator.clipboard.writeText(constants_1.BASE_URL_FRONT + "/order/" + order_1["default"].order._id);
        setIsCopy(true);
        setTimeout(function () {
            setIsCopy(false);
        }, 2000);
    }
    function openImagePopup(imageSrc) {
        setCurrentImage(imageSrc);
        setIsImagePopupOpen(true);
    }
    function closeImagePopup() {
        setIsImagePopupOpen(false);
    }
    function closeSubmitPopup() {
        setIsSubmitPopup(false);
    }
    function openSubmitPopup(e) {
        e.preventDefault();
        setIsSubmitPopup(true);
    }
    function openOrder() {
        setOrderСhapter("Order");
    }
    function openPayment() {
        setOrderСhapter("Pay");
    }
    function openClientData() {
        setOrderСhapter("Client");
    }
    function openPurchaseData() {
        setOrderСhapter("Purchase");
    }
    function openDelivery() {
        setOrderСhapter("Delivery");
    }
    function handleChange(e) {
        var _a;
        var target = e.target;
        var name = target.name, value = target.value;
        setData(__assign(__assign({}, data), (_a = {}, _a[name] = value, _a)));
    }
    var uploadFileHandler = function (e, // Костыль!
    folder, setUploading, multiple) {
        if (multiple === void 0) { multiple = true; }
        return __awaiter(void 0, void 0, void 0, function () {
            var formData, files, i, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        formData = new FormData();
                        if (multiple) {
                            files = e;
                            for (i = 0; i < files.length; i++) {
                                formData.append("imagesUp", files[i]);
                            }
                        }
                        else {
                            formData.append("imagesUp", e.target.files[0]);
                        }
                        setUploading(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, Order_1.uploadImages(formData, folder).then(function (data) {
                                order_1["default"].setOrder({
                                    _id: order_1["default"].order._id,
                                    creater: order_1["default"].order.creater,
                                    buyer: order_1["default"].order.buyer,
                                    stockman: order_1["default"].order.stockman,
                                    createdAt: order_1["default"].order.createdAt,
                                    overudeAfter: order_1["default"].order.overudeAfter,
                                    buyAt: order_1["default"].order.buyAt,
                                    inChinaStockAt: order_1["default"].order.inChinaStockAt,
                                    orderId: order_1["default"].order.orderId,
                                    combinedOrder: order_1["default"].order.combinedOrder,
                                    status: order_1["default"].order.status,
                                    link: order_1["default"].order.link,
                                    category: order_1["default"].order.category,
                                    subcategory: order_1["default"].order.subcategory,
                                    brand: order_1["default"].order.brand,
                                    model: order_1["default"].order.model,
                                    size: order_1["default"].order.size,
                                    orderImages: order_1["default"].order.orderImages.concat(data.data),
                                    payProofImages: order_1["default"].order.payProofImages,
                                    buyProofImages: order_1["default"].order.buyProofImages,
                                    payment: order_1["default"].order.payment,
                                    currentRate: order_1["default"].order.currentRate,
                                    priceCNY: order_1["default"].order.priceCNY,
                                    priceDeliveryChina: order_1["default"].order.priceDeliveryChina,
                                    priceDeliveryRussia: order_1["default"].order.priceDeliveryRussia,
                                    commission: order_1["default"].order.commission,
                                    promoCodePercent: order_1["default"].order.promoCodePercent,
                                    comment: order_1["default"].order.comment,
                                    poizonCode: order_1["default"].order.poizonCode,
                                    deliveryCode: order_1["default"].order.deliveryCode,
                                    deliveryName: order_1["default"].order.deliveryName,
                                    deliveryNameRecipient: order_1["default"].order.deliveryNameRecipient,
                                    deliveryPhone: order_1["default"].order.deliveryPhone,
                                    deliveryPhoneRecipient: order_1["default"].order.deliveryPhoneRecipient,
                                    deliveryMethod: order_1["default"].order.deliveryMethod,
                                    deliveryAddress: order_1["default"].order.deliveryAddress,
                                    __v: order_1["default"].order.__v
                                });
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error(error_1);
                        setUploading(false);
                        return [3 /*break*/, 4];
                    case 4: return [4 /*yield*/, Order_1.updateOrderImages(order_1["default"].order._id, order_1["default"].order.orderImages)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    function deleteImageHandler(imageName) {
        Order_1.deleteOrderImage(imageName, order_1["default"].order._id)
            .then(function () {
            order_1["default"].setOrder({
                _id: order_1["default"].order._id,
                creater: order_1["default"].order.creater,
                buyer: order_1["default"].order.buyer,
                stockman: order_1["default"].order.stockman,
                createdAt: order_1["default"].order.createdAt,
                overudeAfter: order_1["default"].order.overudeAfter,
                buyAt: order_1["default"].order.buyAt,
                inChinaStockAt: order_1["default"].order.inChinaStockAt,
                orderId: order_1["default"].order.orderId,
                combinedOrder: order_1["default"].order.combinedOrder,
                status: order_1["default"].order.status,
                link: order_1["default"].order.link,
                category: order_1["default"].order.category,
                subcategory: order_1["default"].order.subcategory,
                brand: order_1["default"].order.brand,
                model: order_1["default"].order.model,
                size: order_1["default"].order.size,
                orderImages: order_1["default"].order.orderImages.filter(function (imageItem) { return imageItem.name !== imageName; }),
                payProofImages: order_1["default"].order.payProofImages,
                buyProofImages: order_1["default"].order.buyProofImages,
                payment: order_1["default"].order.payment,
                currentRate: order_1["default"].order.currentRate,
                priceCNY: order_1["default"].order.priceCNY,
                priceDeliveryChina: order_1["default"].order.priceDeliveryChina,
                priceDeliveryRussia: order_1["default"].order.priceDeliveryRussia,
                commission: order_1["default"].order.commission,
                promoCodePercent: order_1["default"].order.promoCodePercent,
                comment: order_1["default"].order.comment,
                poizonCode: order_1["default"].order.poizonCode,
                deliveryCode: order_1["default"].order.deliveryCode,
                deliveryName: order_1["default"].order.deliveryName,
                deliveryNameRecipient: order_1["default"].order.deliveryNameRecipient,
                deliveryPhone: order_1["default"].order.deliveryPhone,
                deliveryPhoneRecipient: order_1["default"].order.deliveryPhoneRecipient,
                deliveryMethod: order_1["default"].order.deliveryMethod,
                deliveryAddress: order_1["default"].order.deliveryAddress,
                __v: order_1["default"].order.__v
            });
        })
            .then(function () {
            Order_1.updateOrderImages(order_1["default"].order._id, order_1["default"].order.orderImages);
        })["catch"](console.error);
    }
    function handleSubmitUpdate() {
        Order_1.updateOrderDraft(order_1["default"].order._id, order_1["default"].order.link, order_1["default"].order.category, order_1["default"].order.subcategory, order_1["default"].order.brand, order_1["default"].order.model, order_1["default"].order.size, order_1["default"].order.payment, order_1["default"].order.priceCNY, order_1["default"].order.priceDeliveryChina, order_1["default"].order.priceDeliveryRussia, order_1["default"].order.commission, order_1["default"].order.promoCodePercent, order_1["default"].order.comment).then(function (order) {
            order_1["default"].setOrder(order);
        });
        window.scrollTo({
            left: 0,
            top: 0,
            behavior: "smooth"
        });
    }
    react_1.useEffect(function () {
        order_1["default"].setOrder({
            _id: order_1["default"].order._id,
            creater: order_1["default"].order.creater,
            buyer: order_1["default"].order.buyer,
            stockman: order_1["default"].order.stockman,
            createdAt: order_1["default"].order.createdAt,
            overudeAfter: order_1["default"].order.overudeAfter,
            buyAt: order_1["default"].order.buyAt,
            inChinaStockAt: order_1["default"].order.inChinaStockAt,
            orderId: order_1["default"].order.orderId,
            combinedOrder: order_1["default"].order.combinedOrder,
            status: order_1["default"].order.status,
            link: data.link,
            category: data.category,
            subcategory: data.subcategory,
            brand: data.brand,
            model: data.model,
            size: data.size,
            orderImages: order_1["default"].order.orderImages,
            payProofImages: order_1["default"].order.payProofImages,
            buyProofImages: order_1["default"].order.buyProofImages,
            payment: data.payment,
            currentRate: order_1["default"].order.currentRate,
            priceCNY: data.priceCNY,
            priceDeliveryChina: data.priceDeliveryChina,
            priceDeliveryRussia: data.priceDeliveryRussia,
            commission: data.commission,
            promoCodePercent: data.promoCodePercent,
            comment: data.comment,
            poizonCode: order_1["default"].order.poizonCode,
            deliveryCode: order_1["default"].order.deliveryCode,
            deliveryName: order_1["default"].order.deliveryName,
            deliveryNameRecipient: order_1["default"].order.deliveryNameRecipient,
            deliveryPhone: order_1["default"].order.deliveryPhone,
            deliveryPhoneRecipient: order_1["default"].order.deliveryPhoneRecipient,
            deliveryMethod: order_1["default"].order.deliveryMethod,
            deliveryAddress: order_1["default"].order.deliveryAddress,
            __v: order_1["default"].order.__v
        });
    }, [data]);
    return (react_1["default"].createElement("section", { className: OrderChange_styles_module_css_1["default"]["order-change"] },
        react_1["default"].createElement("h2", { className: OrderChange_styles_module_css_1["default"]["order-change__title"] },
            "\u0417\u0430\u043A\u0430\u0437 #",
            order_1["default"].order.orderId),
        react_1["default"].createElement("p", { className: OrderChange_styles_module_css_1["default"]["order-change__status"] },
            "\u0421\u0442\u0430\u0442\u0443\u0441: ",
            order_1["default"].order.status),
        react_1["default"].createElement("div", { className: OrderChange_styles_module_css_1["default"]["order-change__nav-bar"] },
            react_1["default"].createElement("p", { className: OrderChange_styles_module_css_1["default"]["order-change__nav-item"] + " " + (orderСhapter === "Order" && OrderChange_styles_module_css_1["default"]["order-change__nav-item_active"]), onClick: openOrder }, "\u0417\u0430\u043A\u0430\u0437"),
            react_1["default"].createElement("p", { className: OrderChange_styles_module_css_1["default"]["order-change__nav-item"] + " " + (orderСhapter === "Pay" && OrderChange_styles_module_css_1["default"]["order-change__nav-item_active"]), onClick: openPayment }, "\u041E\u043F\u043B\u0430\u0442\u0430"),
            react_1["default"].createElement("p", { className: OrderChange_styles_module_css_1["default"]["order-change__nav-item"] + " " + (orderСhapter === "Client" && OrderChange_styles_module_css_1["default"]["order-change__nav-item_active"]), onClick: openClientData }, "\u041A\u043B\u0438\u0435\u043D\u0442"),
            react_1["default"].createElement("p", { className: OrderChange_styles_module_css_1["default"]["order-change__nav-item"] + " " + (orderСhapter === "Purchase" &&
                    OrderChange_styles_module_css_1["default"]["order-change__nav-item_active"]), onClick: openPurchaseData }, "\u0417\u0430\u043A\u0443\u043F\u043A\u0430"),
            react_1["default"].createElement("p", { className: OrderChange_styles_module_css_1["default"]["order-change__nav-item"] + " " + (orderСhapter === "Delivery" &&
                    OrderChange_styles_module_css_1["default"]["order-change__nav-item_active"]), onClick: openDelivery }, "\u0414\u043E\u0441\u0442\u0430\u0432\u043A\u0430")),
        orderСhapter === "Order" && (react_1["default"].createElement("div", { className: OrderChange_styles_module_css_1["default"]["order-change__order-container"] },
            react_1["default"].createElement("div", { className: OrderChange_styles_module_css_1["default"]["order-change__public-link-container"] },
                react_1["default"].createElement("p", { className: OrderChange_styles_module_css_1["default"]["order-change__public-link-text"] }, "\u041F\u0443\u0431\u043B\u0438\u0447\u043D\u0430\u044F \u0441\u0441\u044B\u043B\u043A\u0430"),
                react_1["default"].createElement("a", { className: OrderChange_styles_module_css_1["default"]["order-change__public-link"], href: constants_1.BASE_URL_FRONT + "/order/" + order_1["default"].order._id, target: "_blank", rel: "noreferrer" },
                    constants_1.BASE_URL_FRONT,
                    "/order/",
                    order_1["default"].order._id),
                react_1["default"].createElement("div", { onClick: copyLink, className: OrderChange_styles_module_css_1["default"]["order-change__public-link-text-copy"] },
                    !isCopy ? "Скопировать" : "Cкопировано в буфер обмена",
                    " ",
                    react_1["default"].createElement("svg", { x: "0px", y: "0px", width: "24px", height: "24px", viewBox: "0 0 24 24", focusable: "false", fill: "currentColor" },
                        react_1["default"].createElement("path", { d: "M3.9,12c0-1.7,1.4-3.1,3.1-3.1h4V7H7c-2.8,0-5,2.2-5,5s2.2,5,5,5h4v-1.9H7C5.3,15.1,3.9,13.7,3.9,12z M8,13h8v-2H8V13zM17,7h-4v1.9h4c1.7,0,3.1,1.4,3.1,3.1s-1.4,3.1-3.1,3.1h-4V17h4c2.8,0,5-2.2,5-5S19.8,7,17,7z" })))),
            react_1["default"].createElement("form", { onSubmit: openSubmitPopup, className: OrderChange_styles_module_css_1["default"]["order-change__order-form"] },
                react_1["default"].createElement("h2", { className: OrderChange_styles_module_css_1["default"]["order-change__order-title"] }, "\u0422\u043E\u0432\u0430\u0440"),
                react_1["default"].createElement(TextInput_1["default"], { name: "link", label: "C\u0441\u044B\u043B\u043A\u0430", value: order_1["default"].order.link, handleChange: handleChange, readonly: order_1["default"].order.status !== "Черновик", required: true }),
                react_1["default"].createElement("div", { className: OrderChange_styles_module_css_1["default"]["order-change__input-container"] },
                    react_1["default"].createElement("label", null,
                        "\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F",
                        react_1["default"].createElement("span", { className: OrderChange_styles_module_css_1["default"]["red-star"] }, "*")),
                    react_1["default"].createElement("select", { className: OrderChange_styles_module_css_1["default"]["order-change__select"] + " " + (order_1["default"].order.status !== "Черновик" &&
                            OrderChange_styles_module_css_1["default"]["order-change__select_disabled"]), name: "category", value: order_1["default"].order.category, onChange: handleChange, disabled: order_1["default"].order.status !== "Черновик", required: true },
                        react_1["default"].createElement("option", { value: "", selected: true, disabled: true }, "-- \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 --"),
                        react_1["default"].createElement("option", { value: "\u041E\u0431\u0443\u0432\u044C" }, "\u041E\u0431\u0443\u0432\u044C"),
                        react_1["default"].createElement("option", { value: "\u041E\u0434\u0435\u0436\u0434\u0430" }, "\u041E\u0434\u0435\u0436\u0434\u0430"),
                        react_1["default"].createElement("option", { value: "\u0410\u043A\u0441\u0435\u0441\u0443\u0430\u0440\u044B" }, "\u0410\u043A\u0441\u0435\u0441\u0443\u0430\u0440\u044B"),
                        react_1["default"].createElement("option", { value: "\u041F\u0440\u043E\u0447\u0435\u0435" }, "\u041F\u0440\u043E\u0447\u0435\u0435"))),
                react_1["default"].createElement("div", { className: OrderChange_styles_module_css_1["default"]["order-change__input-container"] },
                    react_1["default"].createElement("label", null,
                        "\u041F\u043E\u0434\u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F",
                        react_1["default"].createElement("span", { className: OrderChange_styles_module_css_1["default"]["red-star"] }, "*")),
                    react_1["default"].createElement("select", { className: OrderChange_styles_module_css_1["default"]["order-change__select"] + " " + (order_1["default"].order.status !== "Черновик" &&
                            OrderChange_styles_module_css_1["default"]["order-change__select_disabled"]), name: "subcategory", value: order_1["default"].order.subcategory, onChange: handleChange, disabled: order_1["default"].order.status !== "Черновик", required: true },
                        react_1["default"].createElement("option", { value: "", selected: true, disabled: true }, "-- \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 --"),
                        react_1["default"].createElement("option", { value: "\u041A\u0440\u043E\u0441\u0441\u043E\u0432\u043A\u0438" }, "\u041A\u0440\u043E\u0441\u0441\u043E\u0432\u043A\u0438"),
                        react_1["default"].createElement("option", { value: "\u0417\u0438\u043C\u043D\u044F\u044F \u043E\u0431\u0443\u0432\u044C" }, "\u0417\u0438\u043C\u043D\u044F\u044F \u043E\u0431\u0443\u0432\u044C"),
                        react_1["default"].createElement("option", { value: "\u041A\u0443\u0440\u0442\u043A\u0430" }, "\u041A\u0443\u0440\u0442\u043A\u0430"),
                        react_1["default"].createElement("option", { value: "\u0422\u043E\u043B\u0441\u0442\u043E\u0432\u043A\u0430" }, "\u0422\u043E\u043B\u0441\u0442\u043E\u0432\u043A\u0430"),
                        react_1["default"].createElement("option", { value: "\u0424\u0443\u0442\u0431\u043E\u043B\u043A\u0430" }, "\u0424\u0443\u0442\u0431\u043E\u043B\u043A\u0430"),
                        react_1["default"].createElement("option", { value: "\u041D\u043E\u0441\u043A\u0438" }, "\u041D\u043E\u0441\u043A\u0438"),
                        react_1["default"].createElement("option", { value: "\u0421\u0443\u043C\u043A\u0430" }, "\u0421\u0443\u043C\u043A\u0430"),
                        react_1["default"].createElement("option", { value: "\u0422\u0435\u0445\u043D\u0438\u043A\u0430" }, "\u0422\u0435\u0445\u043D\u0438\u043A\u0430"),
                        react_1["default"].createElement("option", { value: "\u041F\u0440\u043E\u0447\u0435\u0435" }, "\u041F\u0440\u043E\u0447\u0435\u0435"))),
                react_1["default"].createElement(TextInput_1["default"], { name: "brand", label: "\u0411\u0440\u044D\u043D\u0434", value: order_1["default"].order.brand, handleChange: handleChange, readonly: order_1["default"].order.status !== "Черновик", required: true }),
                react_1["default"].createElement(TextInput_1["default"], { name: "model", label: "\u041C\u043E\u0434\u0435\u043B\u044C", value: order_1["default"].order.model, handleChange: handleChange, readonly: order_1["default"].order.status !== "Черновик", required: true }),
                react_1["default"].createElement(TextInput_1["default"], { name: "size", label: "\u0420\u0430\u0437\u043C\u0435\u0440", value: order_1["default"].order.size, handleChange: handleChange, readonly: order_1["default"].order.status !== "Черновик", required: true }),
                react_1["default"].createElement("label", null,
                    "\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F \u0442\u043E\u0432\u0430\u0440\u0430",
                    react_1["default"].createElement("span", { className: OrderChange_styles_module_css_1["default"]["red-star"] }, "*")),
                react_1["default"].createElement("ul", { className: OrderChange_styles_module_css_1["default"]["order-change__images-list"] }, order_1["default"].order.orderImages
                    .slice()
                    .reverse()
                    .map(function (image) {
                    return (react_1["default"].createElement("li", { key: image.name, className: OrderChange_styles_module_css_1["default"]["order-change__image"] },
                        order_1["default"].order.status === "Черновик" && (react_1["default"].createElement("div", { className: OrderChange_styles_module_css_1["default"]["order-change__delete-image"], onClick: function () { return deleteImageHandler(image.name); } },
                            react_1["default"].createElement("svg", { width: "18", height: "20", viewBox: "0 0 18 20", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
                                react_1["default"].createElement("path", { d: "M2.45763 18.1422C2.51857 18.8126 3.06711 19.3002 3.73754 19.3002H14.2612C14.9317 19.3002 15.4802 18.7923 15.5411 18.1422L16.7195 5.79004H1.2793L2.45763 18.1422Z", fill: "black" }),
                                react_1["default"].createElement("path", { d: "M16.7201 1.93002H11.5801V1.27991C11.5801 0.568849 11.0113 0 10.3002 0H7.72009C7.00903 0 6.44018 0.568849 6.44018 1.27991V1.93002H1.27991C0.568849 1.93002 0 2.49887 0 3.20993C0 3.92099 0.568849 4.48984 1.27991 4.48984H16.7201C17.4312 4.48984 18 3.92099 18 3.20993C18 2.49887 17.4312 1.93002 16.7201 1.93002Z", fill: "black" })))),
                        react_1["default"].createElement("img", { className: OrderChange_styles_module_css_1["default"]["order-change__image-item"], src: "" + constants_2.BASE_URL + image.path, alt: image.name, crossOrigin: "anonymous", onClick: function () {
                                return openImagePopup("" + constants_2.BASE_URL + image.path);
                            } })));
                })),
                order_1["default"].order.status === "Черновик" && (react_1["default"].createElement(react_dropzone_1["default"], { onDrop: function (e) {
                        return uploadFileHandler(e, "/order-images", setUploading);
                    }, maxSize: MAX_SIZE }, function (_a) {
                    var getRootProps = _a.getRootProps, getInputProps = _a.getInputProps;
                    return (react_1["default"].createElement("div", { className: OrderChange_styles_module_css_1["default"]["drag-n-drop-container"] },
                        react_1["default"].createElement("div", __assign({}, getRootProps()),
                            react_1["default"].createElement("input", __assign({}, getInputProps())),
                            react_1["default"].createElement("p", { className: OrderChange_styles_module_css_1["default"]["drag-n-drop-text"] },
                                "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0444\u043E\u0442\u043E",
                                " ",
                                react_1["default"].createElement("svg", { width: "18px", height: "18px", viewBox: "0 0 48 48", focusable: "false", fill: "black" },
                                    react_1["default"].createElement("path", { fill: "none", d: "M0 0h48v48H0V0z" }),
                                    react_1["default"].createElement("path", { d: "M40 24l-2.82-2.82L26 32.34V8h-4v24.34L10.84 21.16 8 24l16 16 16-16z" }))))));
                })),
                react_1["default"].createElement("h2", { className: OrderChange_styles_module_css_1["default"]["order-change__order-title"] }, "\u0420\u0430\u0441\u0447\u0451\u0442"),
                react_1["default"].createElement("div", { className: OrderChange_styles_module_css_1["default"]["order-change__input-container"] },
                    react_1["default"].createElement("label", null,
                        "\u0421\u043F\u043E\u0441\u043E\u0431 \u043E\u043F\u043B\u0430\u0442\u044B",
                        react_1["default"].createElement("span", { className: OrderChange_styles_module_css_1["default"]["red-star"] }, "*")),
                    react_1["default"].createElement("select", { className: OrderChange_styles_module_css_1["default"]["order-change__select"] + " " + (order_1["default"].order.status !== "Черновик" &&
                            OrderChange_styles_module_css_1["default"]["order-change__select_disabled"]), name: "payment", value: order_1["default"].order.payment, onChange: handleChange, disabled: order_1["default"].order.status !== "Черновик", required: true },
                        react_1["default"].createElement("option", { value: "", selected: true, disabled: true }, "-- \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 --"),
                        payments.map(function (paymentItem) {
                            return (react_1["default"].createElement("option", { key: paymentItem._id, value: paymentItem.title + " " + paymentItem.number },
                                paymentItem.title,
                                " ",
                                paymentItem.number));
                        }))),
                react_1["default"].createElement(TextInput_1["default"], { name: "currentRate", label: "\u041A\u0443\u0440\u0441 RUB/CNY", value: order_1["default"].order.currentRate, required: true, readonly: true }),
                react_1["default"].createElement(TextInput_1["default"], { name: "priceCNY", label: "\u0426\u0435\u043D\u0430 CNY", value: order_1["default"].order.priceCNY, handleChange: handleChange, readonly: order_1["default"].order.status !== "Черновик", required: true }),
                react_1["default"].createElement(TextInput_1["default"], { name: "priceRUB", label: "\u0426\u0435\u043D\u0430 RUB", value: priceRub.toString(), required: true, readonly: true }),
                react_1["default"].createElement(TextInput_1["default"], { name: "priceDeliveryChina", label: "\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438 POIZON - C\u043A\u043B\u0430\u0434 \u0432 \u041A\u0438\u0442\u0430\u0435", value: order_1["default"].order.priceDeliveryChina, handleChange: handleChange, readonly: order_1["default"].order.status !== "Черновик", required: true }),
                react_1["default"].createElement(TextInput_1["default"], { name: "priceDeliveryRussia", label: "\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438 C\u043A\u043B\u0430\u0434 \u0432 \u041A\u0438\u0442\u0430\u0435 - C\u043A\u043B\u0430\u0434 \u0432 \u0420\u0424", value: order_1["default"].order.priceDeliveryRussia, handleChange: handleChange, readonly: order_1["default"].order.status !== "Черновик", required: true }),
                react_1["default"].createElement(TextInput_1["default"], { name: "commission", label: "\u041A\u043E\u043C\u0438\u0441\u0441\u0438\u044F \u0441\u0435\u0440\u0432\u0438\u0441\u0430", value: order_1["default"].order.commission, handleChange: handleChange, readonly: order_1["default"].order.status !== "Черновик", required: true }),
                react_1["default"].createElement("div", { className: OrderChange_styles_module_css_1["default"]["order-change__input-container"] },
                    react_1["default"].createElement("label", null, "\u041F\u0440\u043E\u043C\u043E-\u043A\u043E\u0434"),
                    react_1["default"].createElement("select", { className: OrderChange_styles_module_css_1["default"]["order-change__select"] + " " + ((order_1["default"].order.status !== "Черновик" ||
                            order_1["default"].order.promoCodePercent > 0) &&
                            OrderChange_styles_module_css_1["default"]["order-change__select_disabled"]), name: "promoCodePercent", disabled: data.promoCodePercent > 0 ||
                            order_1["default"].order.promoCodePercent > 0, value: data.promoCodePercent > 0 ||
                            order_1["default"].order.promoCodePercent > 0
                            ? order_1["default"].order.promoCodePercent
                            : "", onChange: handleChange },
                        react_1["default"].createElement("option", { value: "", selected: true, disabled: true }, "-- \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 --"),
                        promo_code_1["default"].promoCodeList.map(function (promoCodeItem) {
                            return (react_1["default"].createElement("option", { key: promoCodeItem._id, value: "" + promoCodeItem.percent },
                                promoCodeItem.code,
                                " ",
                                promoCodeItem.percent,
                                "\u20BD"));
                        })),
                    order_1["default"].order.promoCodePercent > 0 && (react_1["default"].createElement("span", { className: OrderChange_styles_module_css_1["default"]["order-change__promo-code_active"] }, "\u041F\u0440\u043E\u043C\u043E-\u043A\u043E\u0434 \u043F\u0440\u0438\u043C\u0435\u043D\u0451\u043D")),
                    order_1["default"].order.promoCodePercent === 0 && (react_1["default"].createElement("span", { className: OrderChange_styles_module_css_1["default"]["order-change__promo-code_not-active"] }, "\u041F\u0440\u043E\u043C\u043E-\u043A\u043E\u0434 \u041D\u0415 \u043F\u0440\u0438\u043C\u0435\u043D\u0451\u043D"))),
                react_1["default"].createElement(TextInput_1["default"], { name: "totalPrice", label: "\u041E\u0431\u0449\u0430\u044F \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C", value: data.promoCodePercent > 0 ||
                        order_1["default"].order.promoCodePercent > 0
                        ? totalPriceWithPromo.toString()
                        : totalPrice.toString(), required: true, readonly: true }),
                react_1["default"].createElement("div", { className: OrderChange_styles_module_css_1["default"]["order-change__input-container"] },
                    react_1["default"].createElement("label", null, "\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439"),
                    react_1["default"].createElement("textarea", { className: "" + OrderChange_styles_module_css_1["default"]["order-change__textarea"], name: "comment", onChange: handleChange, value: order_1["default"].order.comment })),
                react_1["default"].createElement("button", { className: "" + OrderChange_styles_module_css_1["default"]["order-change__order-submit"], type: "submit" }, "C\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C")))),
        orderСhapter === "Pay" && react_1["default"].createElement(AcceptPayment_1["default"], null),
        orderСhapter === "Client" && react_1["default"].createElement(Client_1["default"], null),
        orderСhapter === "Purchase" && react_1["default"].createElement(Purchase_1["default"], null),
        orderСhapter === "Delivery" && react_1["default"].createElement(Delivery_1["default"], null),
        react_1["default"].createElement(ImagePopup_1["default"], { isImagePopupOpen: isImagePopupOpen, currentImage: currentImage, closePopup: closeImagePopup }),
        react_1["default"].createElement(SubmitPopup_1["default"], { submitText: "\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435 \u0432 \u0437\u0430\u043A\u0430\u0437\u0435", isSubmitPopup: isSubmitPopup, closeSubmitPopup: closeSubmitPopup, onSubmit: handleSubmitUpdate })));
};
exports["default"] = OrderChange;
