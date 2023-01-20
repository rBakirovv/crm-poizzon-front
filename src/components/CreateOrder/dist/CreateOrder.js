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
var TextInput_1 = require("../UI/TextInput/TextInput");
var CreateOrder_module_css_1 = require("./CreateOrder.module.css");
var promo_code_1 = require("../../store/promo-code");
var rate_1 = require("../../store/rate");
var user_1 = require("../../store/user");
var order_1 = require("../../store/order");
var react_dropzone_1 = require("react-dropzone");
var constants_1 = require("../../utils/constants");
var Order_1 = require("../../utils/Order");
var ImagePopup_1 = require("../ImagePopup/ImagePopup");
var SubmitPopup_1 = require("../SubmitPopup/SubmitPopup");
var router_1 = require("next/router");
var CreateOrder = function (_a) {
    var payments = _a.payments;
    var router = router_1.useRouter();
    var _b = react_1.useState({
        link: "",
        category: "",
        subcategory: "",
        brand: "",
        model: "",
        size: "",
        payment: "",
        currentRate: rate_1["default"].rate.rate,
        priceCNY: "0",
        priceDeliveryChina: "0",
        priceDeliveryRussia: "0",
        commission: "0",
        promoCodePercent: 0,
        comment: ""
    }), data = _b[0], setData = _b[1];
    var _c = react_1.useState([]), images = _c[0], setImages = _c[1];
    var _d = react_1.useState(false), uploading = _d[0], setUploading = _d[1];
    var _e = react_1.useState(false), isSubmitPopup = _e[0], setIsSubmitPopup = _e[1];
    var _f = react_1.useState(""), currentImage = _f[0], setCurrentImage = _f[1];
    var _g = react_1.useState(false), isImagePopupOpen = _g[0], setIsImagePopupOpen = _g[1];
    var priceRub = Math.ceil(parseFloat(data.priceCNY) * parseFloat(data.currentRate));
    var totalPrice = Math.ceil(priceRub +
        parseFloat(data.priceDeliveryChina) +
        parseFloat(data.priceDeliveryRussia) +
        parseFloat(data.commission));
    var totalPriceWithPromo = Math.ceil(priceRub +
        parseFloat(data.priceDeliveryChina) +
        parseFloat(data.priceDeliveryRussia) +
        parseFloat(data.commission) -
        data.promoCodePercent);
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
                                setImages(images.concat(data.data));
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error(error_1);
                        setUploading(false);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    function deleteImageHandler(imageName) {
        setImages(images.filter(function (item) { return item.name !== imageName; }));
    }
    function openImagePopup(imageSrc) {
        setCurrentImage(imageSrc);
        setIsImagePopupOpen(true);
    }
    function closeImagePopup() {
        setIsImagePopupOpen(false);
    }
    function openSubmitPopup(e) {
        e.preventDefault();
        setIsSubmitPopup(true);
    }
    function closeSubmitPopup() {
        setIsSubmitPopup(false);
    }
    function handleSubmitCreate() {
        Order_1.createOrder(user_1["default"].userData.name, data.link, data.category, data.subcategory, data.brand, data.model, data.size, images, data.payment, rate_1["default"].rate.rate, data.priceCNY, data.priceDeliveryChina, data.priceDeliveryRussia, data.commission, data.promoCodePercent, data.comment)
            .then(function (order) {
            order_1["default"].setOrder(order);
        })
            .then(function () {
            setData({
                link: "",
                category: "",
                subcategory: "",
                brand: "",
                model: "",
                size: "",
                payment: "",
                currentRate: rate_1["default"].rate.rate,
                priceCNY: "0",
                priceDeliveryChina: "0",
                priceDeliveryRussia: "0",
                commission: "0",
                promoCodePercent: 0,
                comment: ""
            });
            setImages([]);
            setUploading(false);
        })
            .then(function () {
            router.replace("/order/change/" + order_1["default"].order._id);
        });
    }
    return (React.createElement("section", { className: CreateOrder_module_css_1["default"]["create-order"] },
        React.createElement("div", { className: CreateOrder_module_css_1["default"]["create-order__container"] },
            React.createElement("form", { onSubmit: openSubmitPopup, className: CreateOrder_module_css_1["default"]["order-change__order-form"] },
                React.createElement("h2", { className: CreateOrder_module_css_1["default"]["order-change__order-title"] }, "\u0417\u0430\u043A\u0430\u0437"),
                React.createElement(TextInput_1["default"], { name: "link", label: "C\u0441\u044B\u043B\u043A\u0430", value: data.link, handleChange: handleChange, required: true }),
                React.createElement("div", { className: CreateOrder_module_css_1["default"]["order-change__input-container"] },
                    React.createElement("label", null,
                        "\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F",
                        React.createElement("span", { className: CreateOrder_module_css_1["default"]["red-star"] }, "*")),
                    React.createElement("select", { className: "" + CreateOrder_module_css_1["default"]["order-change__select"], name: "category", value: data.category, onChange: handleChange, required: true },
                        React.createElement("option", { value: "", selected: true, disabled: true }, "-- \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 --"),
                        React.createElement("option", { value: "\u041E\u0431\u0443\u0432\u044C" }, "\u041E\u0431\u0443\u0432\u044C"),
                        React.createElement("option", { value: "\u041E\u0434\u0435\u0436\u0434\u0430" }, "\u041E\u0434\u0435\u0436\u0434\u0430"),
                        React.createElement("option", { value: "\u0410\u043A\u0441\u0435\u0441\u0443\u0430\u0440\u044B" }, "\u0410\u043A\u0441\u0435\u0441\u0443\u0430\u0440\u044B"),
                        React.createElement("option", { value: "\u041F\u0440\u043E\u0447\u0435\u0435" }, "\u041F\u0440\u043E\u0447\u0435\u0435"))),
                React.createElement("div", { className: CreateOrder_module_css_1["default"]["order-change__input-container"] },
                    React.createElement("label", null,
                        "\u041F\u043E\u0434\u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F",
                        React.createElement("span", { className: CreateOrder_module_css_1["default"]["red-star"] }, "*")),
                    React.createElement("select", { className: "" + CreateOrder_module_css_1["default"]["order-change__select"], name: "subcategory", value: data.subcategory, onChange: handleChange, required: true },
                        React.createElement("option", { value: "", selected: true, disabled: true }, "-- \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 --"),
                        React.createElement("option", { value: "\u041A\u0440\u043E\u0441\u0441\u043E\u0432\u043A\u0438" }, "\u041A\u0440\u043E\u0441\u0441\u043E\u0432\u043A\u0438"),
                        React.createElement("option", { value: "\u0417\u0438\u043C\u043D\u044F\u044F \u043E\u0431\u0443\u0432\u044C" }, "\u0417\u0438\u043C\u043D\u044F\u044F \u043E\u0431\u0443\u0432\u044C"),
                        React.createElement("option", { value: "\u041A\u0443\u0440\u0442\u043A\u0430" }, "\u041A\u0443\u0440\u0442\u043A\u0430"),
                        React.createElement("option", { value: "\u0422\u043E\u043B\u0441\u0442\u043E\u0432\u043A\u0430" }, "\u0422\u043E\u043B\u0441\u0442\u043E\u0432\u043A\u0430"),
                        React.createElement("option", { value: "\u0424\u0443\u0442\u0431\u043E\u043B\u043A\u0430" }, "\u0424\u0443\u0442\u0431\u043E\u043B\u043A\u0430"),
                        React.createElement("option", { value: "\u041D\u043E\u0441\u043A\u0438" }, "\u041D\u043E\u0441\u043A\u0438"),
                        React.createElement("option", { value: "\u0421\u0443\u043C\u043A\u0430" }, "\u0421\u0443\u043C\u043A\u0430"),
                        React.createElement("option", { value: "\u0422\u0435\u0445\u043D\u0438\u043A\u0430" }, "\u0422\u0435\u0445\u043D\u0438\u043A\u0430"),
                        React.createElement("option", { value: "\u041F\u0440\u043E\u0447\u0435\u0435" }, "\u041F\u0440\u043E\u0447\u0435\u0435"))),
                React.createElement(TextInput_1["default"], { name: "brand", label: "\u0411\u0440\u044D\u043D\u0434", value: data.brand, handleChange: handleChange, required: true }),
                React.createElement(TextInput_1["default"], { name: "model", label: "\u041C\u043E\u0434\u0435\u043B\u044C", value: data.model, handleChange: handleChange, required: true }),
                React.createElement(TextInput_1["default"], { name: "size", label: "\u0420\u0430\u0437\u043C\u0435\u0440", value: data.size, handleChange: handleChange, required: true }),
                React.createElement("label", null,
                    "\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F \u0442\u043E\u0432\u0430\u0440\u0430",
                    React.createElement("span", { className: CreateOrder_module_css_1["default"]["red-star"] }, "*")),
                React.createElement("ul", { className: CreateOrder_module_css_1["default"]["order-change__images-list"] }, images
                    .slice()
                    .reverse()
                    .map(function (image) {
                    return (React.createElement("li", { key: image.name, className: CreateOrder_module_css_1["default"]["order-change__image"] },
                        React.createElement("div", { className: CreateOrder_module_css_1["default"]["order-change__delete-image"], onClick: function () { return deleteImageHandler(image.name); } },
                            React.createElement("svg", { width: "18", height: "20", viewBox: "0 0 18 20", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
                                React.createElement("path", { d: "M2.45763 18.1422C2.51857 18.8126 3.06711 19.3002 3.73754 19.3002H14.2612C14.9317 19.3002 15.4802 18.7923 15.5411 18.1422L16.7195 5.79004H1.2793L2.45763 18.1422Z", fill: "black" }),
                                React.createElement("path", { d: "M16.7201 1.93002H11.5801V1.27991C11.5801 0.568849 11.0113 0 10.3002 0H7.72009C7.00903 0 6.44018 0.568849 6.44018 1.27991V1.93002H1.27991C0.568849 1.93002 0 2.49887 0 3.20993C0 3.92099 0.568849 4.48984 1.27991 4.48984H16.7201C17.4312 4.48984 18 3.92099 18 3.20993C18 2.49887 17.4312 1.93002 16.7201 1.93002Z", fill: "black" }))),
                        React.createElement("img", { className: CreateOrder_module_css_1["default"]["order-change__image-item"], src: "" + constants_1.BASE_URL + image.path, alt: image.name, crossOrigin: "anonymous", onClick: function () { return openImagePopup("" + constants_1.BASE_URL + image.path); } })));
                })),
                React.createElement(react_dropzone_1["default"], { onDrop: function (e) {
                        return uploadFileHandler(e, "/order-images", setUploading);
                    }, maxSize: constants_1.MAX_SIZE }, function (_a) {
                    var getRootProps = _a.getRootProps, getInputProps = _a.getInputProps;
                    return (React.createElement("div", { className: CreateOrder_module_css_1["default"]["drag-n-drop-container"] },
                        React.createElement("div", __assign({}, getRootProps()),
                            React.createElement("input", __assign({}, getInputProps())),
                            React.createElement("p", { className: CreateOrder_module_css_1["default"]["drag-n-drop-text"] },
                                "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0444\u043E\u0442\u043E",
                                " ",
                                React.createElement("svg", { width: "18px", height: "18px", viewBox: "0 0 48 48", focusable: "false", fill: "black" },
                                    React.createElement("path", { fill: "none", d: "M0 0h48v48H0V0z" }),
                                    React.createElement("path", { d: "M40 24l-2.82-2.82L26 32.34V8h-4v24.34L10.84 21.16 8 24l16 16 16-16z" }))))));
                }),
                React.createElement("h2", { className: CreateOrder_module_css_1["default"]["order-change__order-title"] }, "\u0420\u0430\u0441\u0447\u0451\u0442"),
                React.createElement("div", { className: CreateOrder_module_css_1["default"]["order-change__input-container"] },
                    React.createElement("label", null,
                        "\u0421\u043F\u043E\u0441\u043E\u0431 \u043E\u043F\u043B\u0430\u0442\u044B",
                        React.createElement("span", { className: CreateOrder_module_css_1["default"]["red-star"] }, "*")),
                    React.createElement("select", { className: "" + CreateOrder_module_css_1["default"]["order-change__select"], name: "payment", value: data.payment, onChange: handleChange, required: true },
                        React.createElement("option", { value: "", selected: true, disabled: true }, "-- \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 --"),
                        payments.map(function (paymentItem) {
                            return (React.createElement("option", { key: paymentItem._id, value: paymentItem.title + " " + paymentItem.number },
                                paymentItem.title,
                                " ",
                                paymentItem.number));
                        }))),
                React.createElement(TextInput_1["default"], { name: "currentRate", label: "\u041A\u0443\u0440\u0441 RUB/CNY", value: data.currentRate, required: true, readonly: true }),
                React.createElement(TextInput_1["default"], { name: "priceCNY", label: "\u0426\u0435\u043D\u0430 CNY", value: data.priceCNY, handleChange: handleChange, required: true }),
                React.createElement(TextInput_1["default"], { name: "priceRUB", label: "\u0426\u0435\u043D\u0430 RUB", value: priceRub.toString(), required: true, readonly: true }),
                React.createElement(TextInput_1["default"], { name: "priceDeliveryChina", label: "\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438 POIZON - C\u043A\u043B\u0430\u0434 \u0432 \u041A\u0438\u0442\u0430\u0435", value: data.priceDeliveryChina, handleChange: handleChange, required: true }),
                React.createElement(TextInput_1["default"], { name: "priceDeliveryRussia", label: "\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438 C\u043A\u043B\u0430\u0434 \u0432 \u041A\u0438\u0442\u0430\u0435 - C\u043A\u043B\u0430\u0434 \u0432 \u0420\u0424", value: data.priceDeliveryRussia, handleChange: handleChange, required: true }),
                React.createElement(TextInput_1["default"], { name: "commission", label: "\u041A\u043E\u043C\u0438\u0441\u0441\u0438\u044F \u0441\u0435\u0440\u0432\u0438\u0441\u0430", value: data.commission, handleChange: handleChange, required: true }),
                React.createElement("div", { className: CreateOrder_module_css_1["default"]["order-change__input-container"] },
                    React.createElement("label", null, "\u041F\u0440\u043E\u043C\u043E-\u043A\u043E\u0434"),
                    React.createElement("select", { className: "" + CreateOrder_module_css_1["default"]["order-change__select"], name: "promoCodePercent", value: data.promoCodePercent > 0 ? data.promoCodePercent : "", onChange: handleChange },
                        React.createElement("option", { value: "", selected: true, disabled: true }, "-- \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 --"),
                        promo_code_1["default"].promoCodeList.map(function (promoCodeItem) {
                            return (React.createElement("option", { key: promoCodeItem._id, value: "" + promoCodeItem.percent },
                                promoCodeItem.code,
                                " ",
                                promoCodeItem.percent,
                                "\u20BD"));
                        })),
                    data.promoCodePercent > 0 && (React.createElement("span", { className: CreateOrder_module_css_1["default"]["order-change__promo-code_active"] }, "\u041F\u0440\u043E\u043C\u043E-\u043A\u043E\u0434 \u043F\u0440\u0438\u043C\u0435\u043D\u0451\u043D")),
                    data.promoCodePercent === 0 && (React.createElement("span", { className: CreateOrder_module_css_1["default"]["order-change__promo-code_not-active"] }, "\u041F\u0440\u043E\u043C\u043E-\u043A\u043E\u0434 \u041D\u0415 \u043F\u0440\u0438\u043C\u0435\u043D\u0451\u043D"))),
                React.createElement(TextInput_1["default"], { name: "totalPrice", label: "\u041E\u0431\u0449\u0430\u044F \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C", value: data.promoCodePercent > 0
                        ? totalPriceWithPromo.toString()
                        : totalPrice.toString(), required: true, readonly: true }),
                React.createElement("div", { className: CreateOrder_module_css_1["default"]["order-change__input-container"] },
                    React.createElement("label", null, "\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439"),
                    React.createElement("textarea", { className: "" + CreateOrder_module_css_1["default"]["order-change__textarea"], name: "comment", onChange: handleChange, value: data.comment })),
                React.createElement("button", { className: "" + CreateOrder_module_css_1["default"]["order-change__order-submit"], type: "submit" }, "C\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C"))),
        React.createElement(ImagePopup_1["default"], { isImagePopupOpen: isImagePopupOpen, currentImage: currentImage, closePopup: closeImagePopup }),
        React.createElement(SubmitPopup_1["default"], { submitText: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0437\u0430\u043A\u0430\u0437", isSubmitPopup: isSubmitPopup, closeSubmitPopup: closeSubmitPopup, onSubmit: handleSubmitCreate })));
};
exports["default"] = CreateOrder;
