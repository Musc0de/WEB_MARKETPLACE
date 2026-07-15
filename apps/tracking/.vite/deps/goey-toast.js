import { r as __toESM, t as __commonJSMin } from "./rolldown-runtime-B-1-B7_t.js";
import { t as require_react } from "./react.js";
import { t as require_react_dom } from "./react-dom-Dm2xnJd2.js";
import { t as require_jsx_runtime } from "./react_jsx-runtime.js";
//#region ../../node_modules/.deno/sonner@2.0.7/node_modules/sonner/dist/index.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom(), 1);
function __insertCSS(code) {
	if (!code || typeof document == "undefined") return;
	let head = document.head || document.getElementsByTagName("head")[0];
	let style = document.createElement("style");
	style.type = "text/css";
	head.appendChild(style);
	style.styleSheet ? style.styleSheet.cssText = code : style.appendChild(document.createTextNode(code));
}
var getAsset = (type) => {
	switch (type) {
		case "success": return SuccessIcon$1;
		case "info": return InfoIcon$1;
		case "warning": return WarningIcon$1;
		case "error": return ErrorIcon$1;
		default: return null;
	}
};
var bars = Array(12).fill(0);
var Loader = ({ visible, className }) => {
	return /*#__PURE__*/ import_react.createElement("div", {
		className: ["sonner-loading-wrapper", className].filter(Boolean).join(" "),
		"data-visible": visible
	}, /*#__PURE__*/ import_react.createElement("div", { className: "sonner-spinner" }, bars.map((_, i) => /*#__PURE__*/ import_react.createElement("div", {
		className: "sonner-loading-bar",
		key: `spinner-bar-${i}`
	}))));
};
var SuccessIcon$1 = /*#__PURE__*/ import_react.createElement("svg", {
	xmlns: "http://www.w3.org/2000/svg",
	viewBox: "0 0 20 20",
	fill: "currentColor",
	height: "20",
	width: "20"
}, /*#__PURE__*/ import_react.createElement("path", {
	fillRule: "evenodd",
	d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z",
	clipRule: "evenodd"
}));
var WarningIcon$1 = /*#__PURE__*/ import_react.createElement("svg", {
	xmlns: "http://www.w3.org/2000/svg",
	viewBox: "0 0 24 24",
	fill: "currentColor",
	height: "20",
	width: "20"
}, /*#__PURE__*/ import_react.createElement("path", {
	fillRule: "evenodd",
	d: "M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z",
	clipRule: "evenodd"
}));
var InfoIcon$1 = /*#__PURE__*/ import_react.createElement("svg", {
	xmlns: "http://www.w3.org/2000/svg",
	viewBox: "0 0 20 20",
	fill: "currentColor",
	height: "20",
	width: "20"
}, /*#__PURE__*/ import_react.createElement("path", {
	fillRule: "evenodd",
	d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z",
	clipRule: "evenodd"
}));
var ErrorIcon$1 = /*#__PURE__*/ import_react.createElement("svg", {
	xmlns: "http://www.w3.org/2000/svg",
	viewBox: "0 0 20 20",
	fill: "currentColor",
	height: "20",
	width: "20"
}, /*#__PURE__*/ import_react.createElement("path", {
	fillRule: "evenodd",
	d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z",
	clipRule: "evenodd"
}));
var CloseIcon = /*#__PURE__*/ import_react.createElement("svg", {
	xmlns: "http://www.w3.org/2000/svg",
	width: "12",
	height: "12",
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: "1.5",
	strokeLinecap: "round",
	strokeLinejoin: "round"
}, /*#__PURE__*/ import_react.createElement("line", {
	x1: "18",
	y1: "6",
	x2: "6",
	y2: "18"
}), /*#__PURE__*/ import_react.createElement("line", {
	x1: "6",
	y1: "6",
	x2: "18",
	y2: "18"
}));
var useIsDocumentHidden = () => {
	const [isDocumentHidden, setIsDocumentHidden] = import_react.useState(document.hidden);
	import_react.useEffect(() => {
		const callback = () => {
			setIsDocumentHidden(document.hidden);
		};
		document.addEventListener("visibilitychange", callback);
		return () => window.removeEventListener("visibilitychange", callback);
	}, []);
	return isDocumentHidden;
};
var toastsCounter = 1;
var Observer = class {
	constructor() {
		this.subscribe = (subscriber) => {
			this.subscribers.push(subscriber);
			return () => {
				const index = this.subscribers.indexOf(subscriber);
				this.subscribers.splice(index, 1);
			};
		};
		this.publish = (data) => {
			this.subscribers.forEach((subscriber) => subscriber(data));
		};
		this.addToast = (data) => {
			this.publish(data);
			this.toasts = [...this.toasts, data];
		};
		this.create = (data) => {
			var _data_id;
			const { message, ...rest } = data;
			const id = typeof (data == null ? void 0 : data.id) === "number" || ((_data_id = data.id) == null ? void 0 : _data_id.length) > 0 ? data.id : toastsCounter++;
			const alreadyExists = this.toasts.find((toast) => {
				return toast.id === id;
			});
			const dismissible = data.dismissible === void 0 ? true : data.dismissible;
			if (this.dismissedToasts.has(id)) this.dismissedToasts.delete(id);
			if (alreadyExists) this.toasts = this.toasts.map((toast) => {
				if (toast.id === id) {
					this.publish({
						...toast,
						...data,
						id,
						title: message
					});
					return {
						...toast,
						...data,
						id,
						dismissible,
						title: message
					};
				}
				return toast;
			});
			else this.addToast({
				title: message,
				...rest,
				dismissible,
				id
			});
			return id;
		};
		this.dismiss = (id) => {
			if (id) {
				this.dismissedToasts.add(id);
				requestAnimationFrame(() => this.subscribers.forEach((subscriber) => subscriber({
					id,
					dismiss: true
				})));
			} else this.toasts.forEach((toast) => {
				this.subscribers.forEach((subscriber) => subscriber({
					id: toast.id,
					dismiss: true
				}));
			});
			return id;
		};
		this.message = (message, data) => {
			return this.create({
				...data,
				message
			});
		};
		this.error = (message, data) => {
			return this.create({
				...data,
				message,
				type: "error"
			});
		};
		this.success = (message, data) => {
			return this.create({
				...data,
				type: "success",
				message
			});
		};
		this.info = (message, data) => {
			return this.create({
				...data,
				type: "info",
				message
			});
		};
		this.warning = (message, data) => {
			return this.create({
				...data,
				type: "warning",
				message
			});
		};
		this.loading = (message, data) => {
			return this.create({
				...data,
				type: "loading",
				message
			});
		};
		this.promise = (promise, data) => {
			if (!data) return;
			let id = void 0;
			if (data.loading !== void 0) id = this.create({
				...data,
				promise,
				type: "loading",
				message: data.loading,
				description: typeof data.description !== "function" ? data.description : void 0
			});
			const p = Promise.resolve(promise instanceof Function ? promise() : promise);
			let shouldDismiss = id !== void 0;
			let result;
			const originalPromise = p.then(async (response) => {
				result = ["resolve", response];
				if (import_react.isValidElement(response)) {
					shouldDismiss = false;
					this.create({
						id,
						type: "default",
						message: response
					});
				} else if (isHttpResponse(response) && !response.ok) {
					shouldDismiss = false;
					const promiseData = typeof data.error === "function" ? await data.error(`HTTP error! status: ${response.status}`) : data.error;
					const description = typeof data.description === "function" ? await data.description(`HTTP error! status: ${response.status}`) : data.description;
					const toastSettings = typeof promiseData === "object" && !import_react.isValidElement(promiseData) ? promiseData : { message: promiseData };
					this.create({
						id,
						type: "error",
						description,
						...toastSettings
					});
				} else if (response instanceof Error) {
					shouldDismiss = false;
					const promiseData = typeof data.error === "function" ? await data.error(response) : data.error;
					const description = typeof data.description === "function" ? await data.description(response) : data.description;
					const toastSettings = typeof promiseData === "object" && !import_react.isValidElement(promiseData) ? promiseData : { message: promiseData };
					this.create({
						id,
						type: "error",
						description,
						...toastSettings
					});
				} else if (data.success !== void 0) {
					shouldDismiss = false;
					const promiseData = typeof data.success === "function" ? await data.success(response) : data.success;
					const description = typeof data.description === "function" ? await data.description(response) : data.description;
					const toastSettings = typeof promiseData === "object" && !import_react.isValidElement(promiseData) ? promiseData : { message: promiseData };
					this.create({
						id,
						type: "success",
						description,
						...toastSettings
					});
				}
			}).catch(async (error) => {
				result = ["reject", error];
				if (data.error !== void 0) {
					shouldDismiss = false;
					const promiseData = typeof data.error === "function" ? await data.error(error) : data.error;
					const description = typeof data.description === "function" ? await data.description(error) : data.description;
					const toastSettings = typeof promiseData === "object" && !import_react.isValidElement(promiseData) ? promiseData : { message: promiseData };
					this.create({
						id,
						type: "error",
						description,
						...toastSettings
					});
				}
			}).finally(() => {
				if (shouldDismiss) {
					this.dismiss(id);
					id = void 0;
				}
				data.finally == null || data.finally.call(data);
			});
			const unwrap = () => new Promise((resolve, reject) => originalPromise.then(() => result[0] === "reject" ? reject(result[1]) : resolve(result[1])).catch(reject));
			if (typeof id !== "string" && typeof id !== "number") return { unwrap };
			else return Object.assign(id, { unwrap });
		};
		this.custom = (jsx, data) => {
			const id = (data == null ? void 0 : data.id) || toastsCounter++;
			this.create({
				jsx: jsx(id),
				id,
				...data
			});
			return id;
		};
		this.getActiveToasts = () => {
			return this.toasts.filter((toast) => !this.dismissedToasts.has(toast.id));
		};
		this.subscribers = [];
		this.toasts = [];
		this.dismissedToasts = /* @__PURE__ */ new Set();
	}
};
var ToastState = new Observer();
var toastFunction = (message, data) => {
	const id = (data == null ? void 0 : data.id) || toastsCounter++;
	ToastState.addToast({
		title: message,
		...data,
		id
	});
	return id;
};
var isHttpResponse = (data) => {
	return data && typeof data === "object" && "ok" in data && typeof data.ok === "boolean" && "status" in data && typeof data.status === "number";
};
var basicToast = toastFunction;
var getHistory = () => ToastState.toasts;
var getToasts = () => ToastState.getActiveToasts();
var toast = Object.assign(basicToast, {
	success: ToastState.success,
	info: ToastState.info,
	warning: ToastState.warning,
	error: ToastState.error,
	custom: ToastState.custom,
	message: ToastState.message,
	promise: ToastState.promise,
	dismiss: ToastState.dismiss,
	loading: ToastState.loading
}, {
	getHistory,
	getToasts
});
__insertCSS("[data-sonner-toaster][dir=ltr],html[dir=ltr]{--toast-icon-margin-start:-3px;--toast-icon-margin-end:4px;--toast-svg-margin-start:-1px;--toast-svg-margin-end:0px;--toast-button-margin-start:auto;--toast-button-margin-end:0;--toast-close-button-start:0;--toast-close-button-end:unset;--toast-close-button-transform:translate(-35%, -35%)}[data-sonner-toaster][dir=rtl],html[dir=rtl]{--toast-icon-margin-start:4px;--toast-icon-margin-end:-3px;--toast-svg-margin-start:0px;--toast-svg-margin-end:-1px;--toast-button-margin-start:0;--toast-button-margin-end:auto;--toast-close-button-start:unset;--toast-close-button-end:0;--toast-close-button-transform:translate(35%, -35%)}[data-sonner-toaster]{position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1:hsl(0, 0%, 99%);--gray2:hsl(0, 0%, 97.3%);--gray3:hsl(0, 0%, 95.1%);--gray4:hsl(0, 0%, 93%);--gray5:hsl(0, 0%, 90.9%);--gray6:hsl(0, 0%, 88.7%);--gray7:hsl(0, 0%, 85.8%);--gray8:hsl(0, 0%, 78%);--gray9:hsl(0, 0%, 56.1%);--gray10:hsl(0, 0%, 52.3%);--gray11:hsl(0, 0%, 43.5%);--gray12:hsl(0, 0%, 9%);--border-radius:8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:0;z-index:999999999;transition:transform .4s ease}@media (hover:none) and (pointer:coarse){[data-sonner-toaster][data-lifted=true]{transform:none}}[data-sonner-toaster][data-x-position=right]{right:var(--offset-right)}[data-sonner-toaster][data-x-position=left]{left:var(--offset-left)}[data-sonner-toaster][data-x-position=center]{left:50%;transform:translateX(-50%)}[data-sonner-toaster][data-y-position=top]{top:var(--offset-top)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--offset-bottom)}[data-sonner-toast]{--y:translateY(100%);--lift-amount:calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:0;overflow-wrap:anywhere}[data-sonner-toast][data-styled=true]{padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px rgba(0,0,0,.1);width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}[data-sonner-toast]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-y-position=top]{top:0;--y:translateY(-100%);--lift:1;--lift-amount:calc(1 * var(--gap))}[data-sonner-toast][data-y-position=bottom]{bottom:0;--y:translateY(100%);--lift:-1;--lift-amount:calc(var(--lift) * var(--gap))}[data-sonner-toast][data-styled=true] [data-description]{font-weight:400;line-height:1.4;color:#3f3f3f}[data-rich-colors=true][data-sonner-toast][data-styled=true] [data-description]{color:inherit}[data-sonner-toaster][data-sonner-theme=dark] [data-description]{color:#e8e8e8}[data-sonner-toast][data-styled=true] [data-title]{font-weight:500;line-height:1.5;color:inherit}[data-sonner-toast][data-styled=true] [data-icon]{display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}[data-sonner-toast][data-promise=true] [data-icon]>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}[data-sonner-toast][data-styled=true] [data-icon]>*{flex-shrink:0}[data-sonner-toast][data-styled=true] [data-icon] svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}[data-sonner-toast][data-styled=true] [data-content]{display:flex;flex-direction:column;gap:2px}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;font-weight:500;cursor:pointer;outline:0;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}[data-sonner-toast][data-styled=true] [data-button]:focus-visible{box-shadow:0 0 0 2px rgba(0,0,0,.4)}[data-sonner-toast][data-styled=true] [data-button]:first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}[data-sonner-toast][data-styled=true] [data-cancel]{color:var(--normal-text);background:rgba(0,0,0,.08)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-styled=true] [data-cancel]{background:rgba(255,255,255,.3)}[data-sonner-toast][data-styled=true] [data-close-button]{position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--gray12);background:var(--normal-bg);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast][data-styled=true] [data-close-button]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-styled=true] [data-disabled=true]{cursor:not-allowed}[data-sonner-toast][data-styled=true]:hover [data-close-button]:hover{background:var(--gray2);border-color:var(--gray5)}[data-sonner-toast][data-swiping=true]::before{content:'';position:absolute;left:-100%;right:-100%;height:100%;z-index:-1}[data-sonner-toast][data-y-position=top][data-swiping=true]::before{bottom:50%;transform:scaleY(3) translateY(50%)}[data-sonner-toast][data-y-position=bottom][data-swiping=true]::before{top:50%;transform:scaleY(3) translateY(-50%)}[data-sonner-toast][data-swiping=false][data-removed=true]::before{content:'';position:absolute;inset:0;transform:scaleY(2)}[data-sonner-toast][data-expanded=true]::after{content:'';position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}[data-sonner-toast][data-mounted=true]{--y:translateY(0);opacity:1}[data-sonner-toast][data-expanded=false][data-front=false]{--scale:var(--toasts-before) * 0.05 + 1;--y:translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}[data-sonner-toast]>*{transition:opacity .4s}[data-sonner-toast][data-x-position=right]{right:0}[data-sonner-toast][data-x-position=left]{left:0}[data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]>*{opacity:0}[data-sonner-toast][data-visible=false]{opacity:0;pointer-events:none}[data-sonner-toast][data-mounted=true][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}[data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]{--y:translateY(calc(var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]{--y:translateY(40%);opacity:0;transition:transform .5s,opacity .2s}[data-sonner-toast][data-removed=true][data-front=false]::before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y,0)) translateX(var(--swipe-amount-x,0));transition:none}[data-sonner-toast][data-swiped=true]{user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width:600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-sonner-theme=light]{--normal-bg:#fff;--normal-border:var(--gray4);--normal-text:var(--gray12);--success-bg:hsl(143, 85%, 96%);--success-border:hsl(145, 92%, 87%);--success-text:hsl(140, 100%, 27%);--info-bg:hsl(208, 100%, 97%);--info-border:hsl(221, 91%, 93%);--info-text:hsl(210, 92%, 45%);--warning-bg:hsl(49, 100%, 97%);--warning-border:hsl(49, 91%, 84%);--warning-text:hsl(31, 92%, 45%);--error-bg:hsl(359, 100%, 97%);--error-border:hsl(359, 100%, 94%);--error-text:hsl(360, 100%, 45%)}[data-sonner-toaster][data-sonner-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg:#fff;--normal-border:var(--gray3);--normal-text:var(--gray12)}[data-sonner-toaster][data-sonner-theme=dark]{--normal-bg:#000;--normal-bg-hover:hsl(0, 0%, 12%);--normal-border:hsl(0, 0%, 20%);--normal-border-hover:hsl(0, 0%, 25%);--normal-text:var(--gray1);--success-bg:hsl(150, 100%, 6%);--success-border:hsl(147, 100%, 12%);--success-text:hsl(150, 86%, 65%);--info-bg:hsl(215, 100%, 6%);--info-border:hsl(223, 43%, 17%);--info-text:hsl(216, 87%, 65%);--warning-bg:hsl(64, 100%, 6%);--warning-border:hsl(60, 100%, 9%);--warning-text:hsl(46, 87%, 65%);--error-bg:hsl(358, 76%, 10%);--error-border:hsl(357, 89%, 16%);--error-text:hsl(358, 100%, 81%)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size:16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:first-child{animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}100%{opacity:.15}}@media (prefers-reduced-motion){.sonner-loading-bar,[data-sonner-toast],[data-sonner-toast]>*{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}");
function isAction(action) {
	return action.label !== void 0;
}
var VISIBLE_TOASTS_AMOUNT = 3;
var VIEWPORT_OFFSET = "24px";
var MOBILE_VIEWPORT_OFFSET = "16px";
var TOAST_LIFETIME = 4e3;
var TOAST_WIDTH = 356;
var GAP = 14;
var SWIPE_THRESHOLD = 45;
var TIME_BEFORE_UNMOUNT = 200;
function cn(...classes) {
	return classes.filter(Boolean).join(" ");
}
function getDefaultSwipeDirections(position) {
	const [y, x] = position.split("-");
	const directions = [];
	if (y) directions.push(y);
	if (x) directions.push(x);
	return directions;
}
var Toast = (props) => {
	var _toast_classNames, _toast_classNames1, _toast_classNames2, _toast_classNames3, _toast_classNames4, _toast_classNames5, _toast_classNames6, _toast_classNames7, _toast_classNames8;
	const { invert: ToasterInvert, toast, unstyled, interacting, setHeights, visibleToasts, heights, index, toasts, expanded, removeToast, defaultRichColors, closeButton: closeButtonFromToaster, style, cancelButtonStyle, actionButtonStyle, className = "", descriptionClassName = "", duration: durationFromToaster, position, gap, expandByDefault, classNames, icons, closeButtonAriaLabel = "Close toast" } = props;
	const [swipeDirection, setSwipeDirection] = import_react.useState(null);
	const [swipeOutDirection, setSwipeOutDirection] = import_react.useState(null);
	const [mounted, setMounted] = import_react.useState(false);
	const [removed, setRemoved] = import_react.useState(false);
	const [swiping, setSwiping] = import_react.useState(false);
	const [swipeOut, setSwipeOut] = import_react.useState(false);
	const [isSwiped, setIsSwiped] = import_react.useState(false);
	const [offsetBeforeRemove, setOffsetBeforeRemove] = import_react.useState(0);
	const [initialHeight, setInitialHeight] = import_react.useState(0);
	const remainingTime = import_react.useRef(toast.duration || durationFromToaster || TOAST_LIFETIME);
	const dragStartTime = import_react.useRef(null);
	const toastRef = import_react.useRef(null);
	const isFront = index === 0;
	const isVisible = index + 1 <= visibleToasts;
	const toastType = toast.type;
	const dismissible = toast.dismissible !== false;
	const toastClassname = toast.className || "";
	const toastDescriptionClassname = toast.descriptionClassName || "";
	const heightIndex = import_react.useMemo(() => heights.findIndex((height) => height.toastId === toast.id) || 0, [heights, toast.id]);
	const closeButton = import_react.useMemo(() => {
		var _toast_closeButton;
		return (_toast_closeButton = toast.closeButton) != null ? _toast_closeButton : closeButtonFromToaster;
	}, [toast.closeButton, closeButtonFromToaster]);
	const duration = import_react.useMemo(() => toast.duration || durationFromToaster || TOAST_LIFETIME, [toast.duration, durationFromToaster]);
	const closeTimerStartTimeRef = import_react.useRef(0);
	const offset = import_react.useRef(0);
	const lastCloseTimerStartTimeRef = import_react.useRef(0);
	const pointerStartRef = import_react.useRef(null);
	const [y, x] = position.split("-");
	const toastsHeightBefore = import_react.useMemo(() => {
		return heights.reduce((prev, curr, reducerIndex) => {
			if (reducerIndex >= heightIndex) return prev;
			return prev + curr.height;
		}, 0);
	}, [heights, heightIndex]);
	const isDocumentHidden = useIsDocumentHidden();
	const invert = toast.invert || ToasterInvert;
	const disabled = toastType === "loading";
	offset.current = import_react.useMemo(() => heightIndex * gap + toastsHeightBefore, [heightIndex, toastsHeightBefore]);
	import_react.useEffect(() => {
		remainingTime.current = duration;
	}, [duration]);
	import_react.useEffect(() => {
		setMounted(true);
	}, []);
	import_react.useEffect(() => {
		const toastNode = toastRef.current;
		if (toastNode) {
			const height = toastNode.getBoundingClientRect().height;
			setInitialHeight(height);
			setHeights((h) => [{
				toastId: toast.id,
				height,
				position: toast.position
			}, ...h]);
			return () => setHeights((h) => h.filter((height) => height.toastId !== toast.id));
		}
	}, [setHeights, toast.id]);
	import_react.useLayoutEffect(() => {
		if (!mounted) return;
		const toastNode = toastRef.current;
		const originalHeight = toastNode.style.height;
		toastNode.style.height = "auto";
		const newHeight = toastNode.getBoundingClientRect().height;
		toastNode.style.height = originalHeight;
		setInitialHeight(newHeight);
		setHeights((heights) => {
			if (!heights.find((height) => height.toastId === toast.id)) return [{
				toastId: toast.id,
				height: newHeight,
				position: toast.position
			}, ...heights];
			else return heights.map((height) => height.toastId === toast.id ? {
				...height,
				height: newHeight
			} : height);
		});
	}, [
		mounted,
		toast.title,
		toast.description,
		setHeights,
		toast.id,
		toast.jsx,
		toast.action,
		toast.cancel
	]);
	const deleteToast = import_react.useCallback(() => {
		setRemoved(true);
		setOffsetBeforeRemove(offset.current);
		setHeights((h) => h.filter((height) => height.toastId !== toast.id));
		setTimeout(() => {
			removeToast(toast);
		}, TIME_BEFORE_UNMOUNT);
	}, [
		toast,
		removeToast,
		setHeights,
		offset
	]);
	import_react.useEffect(() => {
		if (toast.promise && toastType === "loading" || toast.duration === Infinity || toast.type === "loading") return;
		let timeoutId;
		const pauseTimer = () => {
			if (lastCloseTimerStartTimeRef.current < closeTimerStartTimeRef.current) {
				const elapsedTime = (/* @__PURE__ */ new Date()).getTime() - closeTimerStartTimeRef.current;
				remainingTime.current = remainingTime.current - elapsedTime;
			}
			lastCloseTimerStartTimeRef.current = (/* @__PURE__ */ new Date()).getTime();
		};
		const startTimer = () => {
			if (remainingTime.current === Infinity) return;
			closeTimerStartTimeRef.current = (/* @__PURE__ */ new Date()).getTime();
			timeoutId = setTimeout(() => {
				toast.onAutoClose == null || toast.onAutoClose.call(toast, toast);
				deleteToast();
			}, remainingTime.current);
		};
		if (expanded || interacting || isDocumentHidden) pauseTimer();
		else startTimer();
		return () => clearTimeout(timeoutId);
	}, [
		expanded,
		interacting,
		toast,
		toastType,
		isDocumentHidden,
		deleteToast
	]);
	import_react.useEffect(() => {
		if (toast.delete) {
			deleteToast();
			toast.onDismiss == null || toast.onDismiss.call(toast, toast);
		}
	}, [deleteToast, toast.delete]);
	function getLoadingIcon() {
		var _toast_classNames;
		if (icons == null ? void 0 : icons.loading) {
			var _toast_classNames1;
			return /*#__PURE__*/ import_react.createElement("div", {
				className: cn(classNames == null ? void 0 : classNames.loader, toast == null ? void 0 : (_toast_classNames1 = toast.classNames) == null ? void 0 : _toast_classNames1.loader, "sonner-loader"),
				"data-visible": toastType === "loading"
			}, icons.loading);
		}
		return /*#__PURE__*/ import_react.createElement(Loader, {
			className: cn(classNames == null ? void 0 : classNames.loader, toast == null ? void 0 : (_toast_classNames = toast.classNames) == null ? void 0 : _toast_classNames.loader),
			visible: toastType === "loading"
		});
	}
	const icon = toast.icon || (icons == null ? void 0 : icons[toastType]) || getAsset(toastType);
	var _toast_richColors, _icons_close;
	return /*#__PURE__*/ import_react.createElement("li", {
		tabIndex: 0,
		ref: toastRef,
		className: cn(className, toastClassname, classNames == null ? void 0 : classNames.toast, toast == null ? void 0 : (_toast_classNames = toast.classNames) == null ? void 0 : _toast_classNames.toast, classNames == null ? void 0 : classNames.default, classNames == null ? void 0 : classNames[toastType], toast == null ? void 0 : (_toast_classNames1 = toast.classNames) == null ? void 0 : _toast_classNames1[toastType]),
		"data-sonner-toast": "",
		"data-rich-colors": (_toast_richColors = toast.richColors) != null ? _toast_richColors : defaultRichColors,
		"data-styled": !Boolean(toast.jsx || toast.unstyled || unstyled),
		"data-mounted": mounted,
		"data-promise": Boolean(toast.promise),
		"data-swiped": isSwiped,
		"data-removed": removed,
		"data-visible": isVisible,
		"data-y-position": y,
		"data-x-position": x,
		"data-index": index,
		"data-front": isFront,
		"data-swiping": swiping,
		"data-dismissible": dismissible,
		"data-type": toastType,
		"data-invert": invert,
		"data-swipe-out": swipeOut,
		"data-swipe-direction": swipeOutDirection,
		"data-expanded": Boolean(expanded || expandByDefault && mounted),
		"data-testid": toast.testId,
		style: {
			"--index": index,
			"--toasts-before": index,
			"--z-index": toasts.length - index,
			"--offset": `${removed ? offsetBeforeRemove : offset.current}px`,
			"--initial-height": expandByDefault ? "auto" : `${initialHeight}px`,
			...style,
			...toast.style
		},
		onDragEnd: () => {
			setSwiping(false);
			setSwipeDirection(null);
			pointerStartRef.current = null;
		},
		onPointerDown: (event) => {
			if (event.button === 2) return;
			if (disabled || !dismissible) return;
			dragStartTime.current = /* @__PURE__ */ new Date();
			setOffsetBeforeRemove(offset.current);
			event.target.setPointerCapture(event.pointerId);
			if (event.target.tagName === "BUTTON") return;
			setSwiping(true);
			pointerStartRef.current = {
				x: event.clientX,
				y: event.clientY
			};
		},
		onPointerUp: () => {
			var _toastRef_current, _toastRef_current1, _dragStartTime_current;
			if (swipeOut || !dismissible) return;
			pointerStartRef.current = null;
			const swipeAmountX = Number(((_toastRef_current = toastRef.current) == null ? void 0 : _toastRef_current.style.getPropertyValue("--swipe-amount-x").replace("px", "")) || 0);
			const swipeAmountY = Number(((_toastRef_current1 = toastRef.current) == null ? void 0 : _toastRef_current1.style.getPropertyValue("--swipe-amount-y").replace("px", "")) || 0);
			const timeTaken = (/* @__PURE__ */ new Date()).getTime() - ((_dragStartTime_current = dragStartTime.current) == null ? void 0 : _dragStartTime_current.getTime());
			const swipeAmount = swipeDirection === "x" ? swipeAmountX : swipeAmountY;
			const velocity = Math.abs(swipeAmount) / timeTaken;
			if (Math.abs(swipeAmount) >= SWIPE_THRESHOLD || velocity > .11) {
				setOffsetBeforeRemove(offset.current);
				toast.onDismiss == null || toast.onDismiss.call(toast, toast);
				if (swipeDirection === "x") setSwipeOutDirection(swipeAmountX > 0 ? "right" : "left");
				else setSwipeOutDirection(swipeAmountY > 0 ? "down" : "up");
				deleteToast();
				setSwipeOut(true);
				return;
			} else {
				var _toastRef_current2, _toastRef_current3;
				(_toastRef_current2 = toastRef.current) == null || _toastRef_current2.style.setProperty("--swipe-amount-x", `0px`);
				(_toastRef_current3 = toastRef.current) == null || _toastRef_current3.style.setProperty("--swipe-amount-y", `0px`);
			}
			setIsSwiped(false);
			setSwiping(false);
			setSwipeDirection(null);
		},
		onPointerMove: (event) => {
			var _window_getSelection, _toastRef_current, _toastRef_current1;
			if (!pointerStartRef.current || !dismissible) return;
			if (((_window_getSelection = window.getSelection()) == null ? void 0 : _window_getSelection.toString().length) > 0) return;
			const yDelta = event.clientY - pointerStartRef.current.y;
			const xDelta = event.clientX - pointerStartRef.current.x;
			var _props_swipeDirections;
			const swipeDirections = (_props_swipeDirections = props.swipeDirections) != null ? _props_swipeDirections : getDefaultSwipeDirections(position);
			if (!swipeDirection && (Math.abs(xDelta) > 1 || Math.abs(yDelta) > 1)) setSwipeDirection(Math.abs(xDelta) > Math.abs(yDelta) ? "x" : "y");
			let swipeAmount = {
				x: 0,
				y: 0
			};
			const getDampening = (delta) => {
				return 1 / (1.5 + Math.abs(delta) / 20);
			};
			if (swipeDirection === "y") {
				if (swipeDirections.includes("top") || swipeDirections.includes("bottom")) if (swipeDirections.includes("top") && yDelta < 0 || swipeDirections.includes("bottom") && yDelta > 0) swipeAmount.y = yDelta;
				else {
					const dampenedDelta = yDelta * getDampening(yDelta);
					swipeAmount.y = Math.abs(dampenedDelta) < Math.abs(yDelta) ? dampenedDelta : yDelta;
				}
			} else if (swipeDirection === "x") {
				if (swipeDirections.includes("left") || swipeDirections.includes("right")) if (swipeDirections.includes("left") && xDelta < 0 || swipeDirections.includes("right") && xDelta > 0) swipeAmount.x = xDelta;
				else {
					const dampenedDelta = xDelta * getDampening(xDelta);
					swipeAmount.x = Math.abs(dampenedDelta) < Math.abs(xDelta) ? dampenedDelta : xDelta;
				}
			}
			if (Math.abs(swipeAmount.x) > 0 || Math.abs(swipeAmount.y) > 0) setIsSwiped(true);
			(_toastRef_current = toastRef.current) == null || _toastRef_current.style.setProperty("--swipe-amount-x", `${swipeAmount.x}px`);
			(_toastRef_current1 = toastRef.current) == null || _toastRef_current1.style.setProperty("--swipe-amount-y", `${swipeAmount.y}px`);
		}
	}, closeButton && !toast.jsx && toastType !== "loading" ? /*#__PURE__*/ import_react.createElement("button", {
		"aria-label": closeButtonAriaLabel,
		"data-disabled": disabled,
		"data-close-button": true,
		onClick: disabled || !dismissible ? () => {} : () => {
			deleteToast();
			toast.onDismiss == null || toast.onDismiss.call(toast, toast);
		},
		className: cn(classNames == null ? void 0 : classNames.closeButton, toast == null ? void 0 : (_toast_classNames2 = toast.classNames) == null ? void 0 : _toast_classNames2.closeButton)
	}, (_icons_close = icons == null ? void 0 : icons.close) != null ? _icons_close : CloseIcon) : null, (toastType || toast.icon || toast.promise) && toast.icon !== null && ((icons == null ? void 0 : icons[toastType]) !== null || toast.icon) ? /*#__PURE__*/ import_react.createElement("div", {
		"data-icon": "",
		className: cn(classNames == null ? void 0 : classNames.icon, toast == null ? void 0 : (_toast_classNames3 = toast.classNames) == null ? void 0 : _toast_classNames3.icon)
	}, toast.promise || toast.type === "loading" && !toast.icon ? toast.icon || getLoadingIcon() : null, toast.type !== "loading" ? icon : null) : null, /*#__PURE__*/ import_react.createElement("div", {
		"data-content": "",
		className: cn(classNames == null ? void 0 : classNames.content, toast == null ? void 0 : (_toast_classNames4 = toast.classNames) == null ? void 0 : _toast_classNames4.content)
	}, /*#__PURE__*/ import_react.createElement("div", {
		"data-title": "",
		className: cn(classNames == null ? void 0 : classNames.title, toast == null ? void 0 : (_toast_classNames5 = toast.classNames) == null ? void 0 : _toast_classNames5.title)
	}, toast.jsx ? toast.jsx : typeof toast.title === "function" ? toast.title() : toast.title), toast.description ? /*#__PURE__*/ import_react.createElement("div", {
		"data-description": "",
		className: cn(descriptionClassName, toastDescriptionClassname, classNames == null ? void 0 : classNames.description, toast == null ? void 0 : (_toast_classNames6 = toast.classNames) == null ? void 0 : _toast_classNames6.description)
	}, typeof toast.description === "function" ? toast.description() : toast.description) : null), /*#__PURE__*/ import_react.isValidElement(toast.cancel) ? toast.cancel : toast.cancel && isAction(toast.cancel) ? /*#__PURE__*/ import_react.createElement("button", {
		"data-button": true,
		"data-cancel": true,
		style: toast.cancelButtonStyle || cancelButtonStyle,
		onClick: (event) => {
			if (!isAction(toast.cancel)) return;
			if (!dismissible) return;
			toast.cancel.onClick == null || toast.cancel.onClick.call(toast.cancel, event);
			deleteToast();
		},
		className: cn(classNames == null ? void 0 : classNames.cancelButton, toast == null ? void 0 : (_toast_classNames7 = toast.classNames) == null ? void 0 : _toast_classNames7.cancelButton)
	}, toast.cancel.label) : null, /*#__PURE__*/ import_react.isValidElement(toast.action) ? toast.action : toast.action && isAction(toast.action) ? /*#__PURE__*/ import_react.createElement("button", {
		"data-button": true,
		"data-action": true,
		style: toast.actionButtonStyle || actionButtonStyle,
		onClick: (event) => {
			if (!isAction(toast.action)) return;
			toast.action.onClick == null || toast.action.onClick.call(toast.action, event);
			if (event.defaultPrevented) return;
			deleteToast();
		},
		className: cn(classNames == null ? void 0 : classNames.actionButton, toast == null ? void 0 : (_toast_classNames8 = toast.classNames) == null ? void 0 : _toast_classNames8.actionButton)
	}, toast.action.label) : null);
};
function getDocumentDirection() {
	if (typeof window === "undefined") return "ltr";
	if (typeof document === "undefined") return "ltr";
	const dirAttribute = document.documentElement.getAttribute("dir");
	if (dirAttribute === "auto" || !dirAttribute) return window.getComputedStyle(document.documentElement).direction;
	return dirAttribute;
}
function assignOffset(defaultOffset, mobileOffset) {
	const styles = {};
	[defaultOffset, mobileOffset].forEach((offset, index) => {
		const isMobile = index === 1;
		const prefix = isMobile ? "--mobile-offset" : "--offset";
		const defaultValue = isMobile ? MOBILE_VIEWPORT_OFFSET : VIEWPORT_OFFSET;
		function assignAll(offset) {
			[
				"top",
				"right",
				"bottom",
				"left"
			].forEach((key) => {
				styles[`${prefix}-${key}`] = typeof offset === "number" ? `${offset}px` : offset;
			});
		}
		if (typeof offset === "number" || typeof offset === "string") assignAll(offset);
		else if (typeof offset === "object") [
			"top",
			"right",
			"bottom",
			"left"
		].forEach((key) => {
			if (offset[key] === void 0) styles[`${prefix}-${key}`] = defaultValue;
			else styles[`${prefix}-${key}`] = typeof offset[key] === "number" ? `${offset[key]}px` : offset[key];
		});
		else assignAll(defaultValue);
	});
	return styles;
}
var Toaster = /*#__PURE__*/ import_react.forwardRef(function Toaster(props, ref) {
	const { id, invert, position = "bottom-right", hotkey = ["altKey", "KeyT"], expand, closeButton, className, offset, mobileOffset, theme = "light", richColors, duration, style, visibleToasts = VISIBLE_TOASTS_AMOUNT, toastOptions, dir = getDocumentDirection(), gap = GAP, icons, containerAriaLabel = "Notifications" } = props;
	const [toasts, setToasts] = import_react.useState([]);
	const filteredToasts = import_react.useMemo(() => {
		if (id) return toasts.filter((toast) => toast.toasterId === id);
		return toasts.filter((toast) => !toast.toasterId);
	}, [toasts, id]);
	const possiblePositions = import_react.useMemo(() => {
		return Array.from(new Set([position].concat(filteredToasts.filter((toast) => toast.position).map((toast) => toast.position))));
	}, [filteredToasts, position]);
	const [heights, setHeights] = import_react.useState([]);
	const [expanded, setExpanded] = import_react.useState(false);
	const [interacting, setInteracting] = import_react.useState(false);
	const [actualTheme, setActualTheme] = import_react.useState(theme !== "system" ? theme : typeof window !== "undefined" ? window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light" : "light");
	const listRef = import_react.useRef(null);
	const hotkeyLabel = hotkey.join("+").replace(/Key/g, "").replace(/Digit/g, "");
	const lastFocusedElementRef = import_react.useRef(null);
	const isFocusWithinRef = import_react.useRef(false);
	const removeToast = import_react.useCallback((toastToRemove) => {
		setToasts((toasts) => {
			var _toasts_find;
			if (!((_toasts_find = toasts.find((toast) => toast.id === toastToRemove.id)) == null ? void 0 : _toasts_find.delete)) ToastState.dismiss(toastToRemove.id);
			return toasts.filter(({ id }) => id !== toastToRemove.id);
		});
	}, []);
	import_react.useEffect(() => {
		return ToastState.subscribe((toast) => {
			if (toast.dismiss) {
				requestAnimationFrame(() => {
					setToasts((toasts) => toasts.map((t) => t.id === toast.id ? {
						...t,
						delete: true
					} : t));
				});
				return;
			}
			setTimeout(() => {
				import_react_dom.flushSync(() => {
					setToasts((toasts) => {
						const indexOfExistingToast = toasts.findIndex((t) => t.id === toast.id);
						if (indexOfExistingToast !== -1) return [
							...toasts.slice(0, indexOfExistingToast),
							{
								...toasts[indexOfExistingToast],
								...toast
							},
							...toasts.slice(indexOfExistingToast + 1)
						];
						return [toast, ...toasts];
					});
				});
			});
		});
	}, [toasts]);
	import_react.useEffect(() => {
		if (theme !== "system") {
			setActualTheme(theme);
			return;
		}
		if (theme === "system") if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) setActualTheme("dark");
		else setActualTheme("light");
		if (typeof window === "undefined") return;
		const darkMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		try {
			darkMediaQuery.addEventListener("change", ({ matches }) => {
				if (matches) setActualTheme("dark");
				else setActualTheme("light");
			});
		} catch (error) {
			darkMediaQuery.addListener(({ matches }) => {
				try {
					if (matches) setActualTheme("dark");
					else setActualTheme("light");
				} catch (e) {
					console.error(e);
				}
			});
		}
	}, [theme]);
	import_react.useEffect(() => {
		if (toasts.length <= 1) setExpanded(false);
	}, [toasts]);
	import_react.useEffect(() => {
		const handleKeyDown = (event) => {
			var _listRef_current;
			if (hotkey.every((key) => event[key] || event.code === key)) {
				var _listRef_current1;
				setExpanded(true);
				(_listRef_current1 = listRef.current) == null || _listRef_current1.focus();
			}
			if (event.code === "Escape" && (document.activeElement === listRef.current || ((_listRef_current = listRef.current) == null ? void 0 : _listRef_current.contains(document.activeElement)))) setExpanded(false);
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [hotkey]);
	import_react.useEffect(() => {
		if (listRef.current) return () => {
			if (lastFocusedElementRef.current) {
				lastFocusedElementRef.current.focus({ preventScroll: true });
				lastFocusedElementRef.current = null;
				isFocusWithinRef.current = false;
			}
		};
	}, [listRef.current]);
	return /*#__PURE__*/ import_react.createElement("section", {
		ref,
		"aria-label": `${containerAriaLabel} ${hotkeyLabel}`,
		tabIndex: -1,
		"aria-live": "polite",
		"aria-relevant": "additions text",
		"aria-atomic": "false",
		suppressHydrationWarning: true
	}, possiblePositions.map((position, index) => {
		var _heights_;
		const [y, x] = position.split("-");
		if (!filteredToasts.length) return null;
		return /*#__PURE__*/ import_react.createElement("ol", {
			key: position,
			dir: dir === "auto" ? getDocumentDirection() : dir,
			tabIndex: -1,
			ref: listRef,
			className,
			"data-sonner-toaster": true,
			"data-sonner-theme": actualTheme,
			"data-y-position": y,
			"data-x-position": x,
			style: {
				"--front-toast-height": `${((_heights_ = heights[0]) == null ? void 0 : _heights_.height) || 0}px`,
				"--width": `${TOAST_WIDTH}px`,
				"--gap": `${gap}px`,
				...style,
				...assignOffset(offset, mobileOffset)
			},
			onBlur: (event) => {
				if (isFocusWithinRef.current && !event.currentTarget.contains(event.relatedTarget)) {
					isFocusWithinRef.current = false;
					if (lastFocusedElementRef.current) {
						lastFocusedElementRef.current.focus({ preventScroll: true });
						lastFocusedElementRef.current = null;
					}
				}
			},
			onFocus: (event) => {
				if (event.target instanceof HTMLElement && event.target.dataset.dismissible === "false") return;
				if (!isFocusWithinRef.current) {
					isFocusWithinRef.current = true;
					lastFocusedElementRef.current = event.relatedTarget;
				}
			},
			onMouseEnter: () => setExpanded(true),
			onMouseMove: () => setExpanded(true),
			onMouseLeave: () => {
				if (!interacting) setExpanded(false);
			},
			onDragEnd: () => setExpanded(false),
			onPointerDown: (event) => {
				if (event.target instanceof HTMLElement && event.target.dataset.dismissible === "false") return;
				setInteracting(true);
			},
			onPointerUp: () => setInteracting(false)
		}, filteredToasts.filter((toast) => !toast.position && index === 0 || toast.position === position).map((toast, index) => {
			var _toastOptions_duration, _toastOptions_closeButton;
			return /*#__PURE__*/ import_react.createElement(Toast, {
				key: toast.id,
				icons,
				index,
				toast,
				defaultRichColors: richColors,
				duration: (_toastOptions_duration = toastOptions == null ? void 0 : toastOptions.duration) != null ? _toastOptions_duration : duration,
				className: toastOptions == null ? void 0 : toastOptions.className,
				descriptionClassName: toastOptions == null ? void 0 : toastOptions.descriptionClassName,
				invert,
				visibleToasts,
				closeButton: (_toastOptions_closeButton = toastOptions == null ? void 0 : toastOptions.closeButton) != null ? _toastOptions_closeButton : closeButton,
				interacting,
				position,
				style: toastOptions == null ? void 0 : toastOptions.style,
				unstyled: toastOptions == null ? void 0 : toastOptions.unstyled,
				classNames: toastOptions == null ? void 0 : toastOptions.classNames,
				cancelButtonStyle: toastOptions == null ? void 0 : toastOptions.cancelButtonStyle,
				actionButtonStyle: toastOptions == null ? void 0 : toastOptions.actionButtonStyle,
				closeButtonAriaLabel: toastOptions == null ? void 0 : toastOptions.closeButtonAriaLabel,
				removeToast,
				toasts: filteredToasts.filter((t) => t.position == toast.position),
				heights: heights.filter((h) => h.position == toast.position),
				setHeights,
				expandByDefault: expand,
				gap,
				expanded,
				swipeDirections: props.swipeDirections
			});
		}));
	}));
});
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/context/LayoutGroupContext.mjs
var import_jsx_runtime = require_jsx_runtime();
var LayoutGroupContext = (0, import_react.createContext)({});
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/utils/use-constant.mjs
/**
* Creates a constant value over the lifecycle of a component.
*
* Even if `useMemo` is provided an empty array as its final argument, it doesn't offer
* a guarantee that it won't re-run for performance reasons later on. By using `useConstant`
* you can ensure that initialisers don't execute twice or more.
*/
function useConstant(init) {
	const ref = (0, import_react.useRef)(null);
	if (ref.current === null) ref.current = init();
	return ref.current;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/context/PresenceContext.mjs
/**
* @public
*/
var PresenceContext = (0, import_react.createContext)(null);
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/context/MotionConfigContext.mjs
/**
* @public
*/
var MotionConfigContext = (0, import_react.createContext)({
	transformPagePoint: (p) => p,
	isStatic: false,
	reducedMotion: "never"
});
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/components/AnimatePresence/PopChild.mjs
/**
* Measurement functionality has to be within a separate component
* to leverage snapshot lifecycle.
*/
var PopChildMeasure = class extends import_react.Component {
	getSnapshotBeforeUpdate(prevProps) {
		const element = this.props.childRef.current;
		if (element && prevProps.isPresent && !this.props.isPresent) {
			const size = this.props.sizeRef.current;
			size.height = element.offsetHeight || 0;
			size.width = element.offsetWidth || 0;
			size.top = element.offsetTop;
			size.left = element.offsetLeft;
		}
		return null;
	}
	/**
	* Required with getSnapshotBeforeUpdate to stop React complaining.
	*/
	componentDidUpdate() {}
	render() {
		return this.props.children;
	}
};
function PopChild({ children, isPresent }) {
	const id = (0, import_react.useId)();
	const ref = (0, import_react.useRef)(null);
	const size = (0, import_react.useRef)({
		width: 0,
		height: 0,
		top: 0,
		left: 0
	});
	const { nonce } = (0, import_react.useContext)(MotionConfigContext);
	/**
	* We create and inject a style block so we can apply this explicit
	* sizing in a non-destructive manner by just deleting the style block.
	*
	* We can't apply size via render as the measurement happens
	* in getSnapshotBeforeUpdate (post-render), likewise if we apply the
	* styles directly on the DOM node, we might be overwriting
	* styles set via the style prop.
	*/
	(0, import_react.useInsertionEffect)(() => {
		const { width, height, top, left } = size.current;
		if (isPresent || !ref.current || !width || !height) return;
		ref.current.dataset.motionPopId = id;
		const style = document.createElement("style");
		if (nonce) style.nonce = nonce;
		document.head.appendChild(style);
		if (style.sheet) style.sheet.insertRule(`
          [data-motion-pop-id="${id}"] {
            position: absolute !important;
            width: ${width}px !important;
            height: ${height}px !important;
            top: ${top}px !important;
            left: ${left}px !important;
          }
        `);
		return () => {
			document.head.removeChild(style);
		};
	}, [isPresent]);
	return (0, import_jsx_runtime.jsx)(PopChildMeasure, {
		isPresent,
		childRef: ref,
		sizeRef: size,
		children: import_react.cloneElement(children, { ref })
	});
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/components/AnimatePresence/PresenceChild.mjs
var PresenceChild = ({ children, initial, isPresent, onExitComplete, custom, presenceAffectsLayout, mode }) => {
	const presenceChildren = useConstant(newChildrenMap);
	const id = (0, import_react.useId)();
	const memoizedOnExitComplete = (0, import_react.useCallback)((childId) => {
		presenceChildren.set(childId, true);
		for (const isComplete of presenceChildren.values()) if (!isComplete) return;
		onExitComplete && onExitComplete();
	}, [presenceChildren, onExitComplete]);
	const context = (0, import_react.useMemo)(
		() => ({
			id,
			initial,
			isPresent,
			custom,
			onExitComplete: memoizedOnExitComplete,
			register: (childId) => {
				presenceChildren.set(childId, false);
				return () => presenceChildren.delete(childId);
			}
		}),
		/**
		* If the presence of a child affects the layout of the components around it,
		* we want to make a new context value to ensure they get re-rendered
		* so they can detect that layout change.
		*/
		presenceAffectsLayout ? [Math.random(), memoizedOnExitComplete] : [isPresent, memoizedOnExitComplete]
	);
	(0, import_react.useMemo)(() => {
		presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
	}, [isPresent]);
	/**
	* If there's no `motion` components to fire exit animations, we want to remove this
	* component immediately.
	*/
	import_react.useEffect(() => {
		!isPresent && !presenceChildren.size && onExitComplete && onExitComplete();
	}, [isPresent]);
	if (mode === "popLayout") children = (0, import_jsx_runtime.jsx)(PopChild, {
		isPresent,
		children
	});
	return (0, import_jsx_runtime.jsx)(PresenceContext.Provider, {
		value: context,
		children
	});
};
function newChildrenMap() {
	return /* @__PURE__ */ new Map();
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/components/AnimatePresence/use-presence.mjs
/**
* When a component is the child of `AnimatePresence`, it can use `usePresence`
* to access information about whether it's still present in the React tree.
*
* ```jsx
* import { usePresence } from "framer-motion"
*
* export const Component = () => {
*   const [isPresent, safeToRemove] = usePresence()
*
*   useEffect(() => {
*     !isPresent && setTimeout(safeToRemove, 1000)
*   }, [isPresent])
*
*   return <div />
* }
* ```
*
* If `isPresent` is `false`, it means that a component has been removed the tree, but
* `AnimatePresence` won't really remove it until `safeToRemove` has been called.
*
* @public
*/
function usePresence(subscribe = true) {
	const context = (0, import_react.useContext)(PresenceContext);
	if (context === null) return [true, null];
	const { isPresent, onExitComplete, register } = context;
	const id = (0, import_react.useId)();
	(0, import_react.useEffect)(() => {
		if (subscribe) register(id);
	}, [subscribe]);
	const safeToRemove = (0, import_react.useCallback)(() => subscribe && onExitComplete && onExitComplete(id), [
		id,
		onExitComplete,
		subscribe
	]);
	return !isPresent && onExitComplete ? [false, safeToRemove] : [true];
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/components/AnimatePresence/utils.mjs
var getChildKey = (child) => child.key || "";
function onlyElements(children) {
	const filtered = [];
	import_react.Children.forEach(children, (child) => {
		if ((0, import_react.isValidElement)(child)) filtered.push(child);
	});
	return filtered;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/utils/is-browser.mjs
var isBrowser = typeof window !== "undefined";
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/utils/use-isomorphic-effect.mjs
var useIsomorphicLayoutEffect$1 = isBrowser ? import_react.useLayoutEffect : import_react.useEffect;
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs
/**
* `AnimatePresence` enables the animation of components that have been removed from the tree.
*
* When adding/removing more than a single child, every child **must** be given a unique `key` prop.
*
* Any `motion` components that have an `exit` property defined will animate out when removed from
* the tree.
*
* ```jsx
* import { motion, AnimatePresence } from 'framer-motion'
*
* export const Items = ({ items }) => (
*   <AnimatePresence>
*     {items.map(item => (
*       <motion.div
*         key={item.id}
*         initial={{ opacity: 0 }}
*         animate={{ opacity: 1 }}
*         exit={{ opacity: 0 }}
*       />
*     ))}
*   </AnimatePresence>
* )
* ```
*
* You can sequence exit animations throughout a tree using variants.
*
* If a child contains multiple `motion` components with `exit` props, it will only unmount the child
* once all `motion` components have finished animating out. Likewise, any components using
* `usePresence` all need to call `safeToRemove`.
*
* @public
*/
var AnimatePresence = ({ children, custom, initial = true, onExitComplete, presenceAffectsLayout = true, mode = "sync", propagate = false }) => {
	const [isParentPresent, safeToRemove] = usePresence(propagate);
	/**
	* Filter any children that aren't ReactElements. We can only track components
	* between renders with a props.key.
	*/
	const presentChildren = (0, import_react.useMemo)(() => onlyElements(children), [children]);
	/**
	* Track the keys of the currently rendered children. This is used to
	* determine which children are exiting.
	*/
	const presentKeys = propagate && !isParentPresent ? [] : presentChildren.map(getChildKey);
	/**
	* If `initial={false}` we only want to pass this to components in the first render.
	*/
	const isInitialRender = (0, import_react.useRef)(true);
	/**
	* A ref containing the currently present children. When all exit animations
	* are complete, we use this to re-render the component with the latest children
	* *committed* rather than the latest children *rendered*.
	*/
	const pendingPresentChildren = (0, import_react.useRef)(presentChildren);
	/**
	* Track which exiting children have finished animating out.
	*/
	const exitComplete = useConstant(() => /* @__PURE__ */ new Map());
	/**
	* Save children to render as React state. To ensure this component is concurrent-safe,
	* we check for exiting children via an effect.
	*/
	const [diffedChildren, setDiffedChildren] = (0, import_react.useState)(presentChildren);
	const [renderedChildren, setRenderedChildren] = (0, import_react.useState)(presentChildren);
	useIsomorphicLayoutEffect$1(() => {
		isInitialRender.current = false;
		pendingPresentChildren.current = presentChildren;
		/**
		* Update complete status of exiting children.
		*/
		for (let i = 0; i < renderedChildren.length; i++) {
			const key = getChildKey(renderedChildren[i]);
			if (!presentKeys.includes(key)) {
				if (exitComplete.get(key) !== true) exitComplete.set(key, false);
			} else exitComplete.delete(key);
		}
	}, [
		renderedChildren,
		presentKeys.length,
		presentKeys.join("-")
	]);
	const exitingChildren = [];
	if (presentChildren !== diffedChildren) {
		let nextChildren = [...presentChildren];
		/**
		* Loop through all the currently rendered components and decide which
		* are exiting.
		*/
		for (let i = 0; i < renderedChildren.length; i++) {
			const child = renderedChildren[i];
			const key = getChildKey(child);
			if (!presentKeys.includes(key)) {
				nextChildren.splice(i, 0, child);
				exitingChildren.push(child);
			}
		}
		/**
		* If we're in "wait" mode, and we have exiting children, we want to
		* only render these until they've all exited.
		*/
		if (mode === "wait" && exitingChildren.length) nextChildren = exitingChildren;
		setRenderedChildren(onlyElements(nextChildren));
		setDiffedChildren(presentChildren);
		/**
		* Early return to ensure once we've set state with the latest diffed
		* children, we can immediately re-render.
		*/
		return;
	}
	if (mode === "wait" && renderedChildren.length > 1) console.warn(`You're attempting to animate multiple children within AnimatePresence, but its mode is set to "wait". This will lead to odd visual behaviour.`);
	/**
	* If we've been provided a forceRender function by the LayoutGroupContext,
	* we can use it to force a re-render amongst all surrounding components once
	* all components have finished animating out.
	*/
	const { forceRender } = (0, import_react.useContext)(LayoutGroupContext);
	return (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: renderedChildren.map((child) => {
		const key = getChildKey(child);
		const isPresent = propagate && !isParentPresent ? false : presentChildren === renderedChildren || presentKeys.includes(key);
		const onExit = () => {
			if (exitComplete.has(key)) exitComplete.set(key, true);
			else return;
			let isEveryExitComplete = true;
			exitComplete.forEach((isExitComplete) => {
				if (!isExitComplete) isEveryExitComplete = false;
			});
			if (isEveryExitComplete) {
				forceRender === null || forceRender === void 0 || forceRender();
				setRenderedChildren(pendingPresentChildren.current);
				propagate && (safeToRemove === null || safeToRemove === void 0 || safeToRemove());
				onExitComplete && onExitComplete();
			}
		};
		return (0, import_jsx_runtime.jsx)(PresenceChild, {
			isPresent,
			initial: !isInitialRender.current || initial ? void 0 : false,
			custom: isPresent ? void 0 : custom,
			presenceAffectsLayout,
			mode,
			onExitComplete: isPresent ? void 0 : onExit,
			children: child
		}, key);
	}) });
};
//#endregion
//#region ../../node_modules/.deno/motion-utils@11.18.1/node_modules/motion-utils/dist/es/noop.mjs
var noop = /* @__NO_SIDE_EFFECTS__ */ (any) => any;
//#endregion
//#region ../../node_modules/.deno/motion-utils@11.18.1/node_modules/motion-utils/dist/es/errors.mjs
var warning = noop;
var invariant = noop;
warning = (check, message) => {
	if (!check && typeof console !== "undefined") console.warn(message);
};
invariant = (check, message) => {
	if (!check) throw new Error(message);
};
//#endregion
//#region ../../node_modules/.deno/motion-utils@11.18.1/node_modules/motion-utils/dist/es/memo.mjs
/*#__NO_SIDE_EFFECTS__*/
function memo(callback) {
	let result;
	return () => {
		if (result === void 0) result = callback();
		return result;
	};
}
//#endregion
//#region ../../node_modules/.deno/motion-utils@11.18.1/node_modules/motion-utils/dist/es/progress.mjs
var progress = /* @__NO_SIDE_EFFECTS__ */ (from, to, value) => {
	const toFromDifference = to - from;
	return toFromDifference === 0 ? 1 : (value - from) / toFromDifference;
};
//#endregion
//#region ../../node_modules/.deno/motion-utils@11.18.1/node_modules/motion-utils/dist/es/time-conversion.mjs
/**
* Converts seconds to milliseconds
*
* @param seconds - Time in seconds.
* @return milliseconds - Converted time in milliseconds.
*/
var secondsToMilliseconds = /* @__NO_SIDE_EFFECTS__ */ (seconds) => seconds * 1e3;
var millisecondsToSeconds = /* @__NO_SIDE_EFFECTS__ */ (milliseconds) => milliseconds / 1e3;
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/utils/GlobalConfig.mjs
var MotionGlobalConfig = {
	skipAnimations: false,
	useManualTiming: false
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/frameloop/render-step.mjs
function createRenderStep(runNextFrame) {
	/**
	* We create and reuse two queues, one to queue jobs for the current frame
	* and one for the next. We reuse to avoid triggering GC after x frames.
	*/
	let thisFrame = /* @__PURE__ */ new Set();
	let nextFrame = /* @__PURE__ */ new Set();
	/**
	* Track whether we're currently processing jobs in this step. This way
	* we can decide whether to schedule new jobs for this frame or next.
	*/
	let isProcessing = false;
	let flushNextFrame = false;
	/**
	* A set of processes which were marked keepAlive when scheduled.
	*/
	const toKeepAlive = /* @__PURE__ */ new WeakSet();
	let latestFrameData = {
		delta: 0,
		timestamp: 0,
		isProcessing: false
	};
	function triggerCallback(callback) {
		if (toKeepAlive.has(callback)) {
			step.schedule(callback);
			runNextFrame();
		}
		callback(latestFrameData);
	}
	const step = {
		/**
		* Schedule a process to run on the next frame.
		*/
		schedule: (callback, keepAlive = false, immediate = false) => {
			const queue = immediate && isProcessing ? thisFrame : nextFrame;
			if (keepAlive) toKeepAlive.add(callback);
			if (!queue.has(callback)) queue.add(callback);
			return callback;
		},
		/**
		* Cancel the provided callback from running on the next frame.
		*/
		cancel: (callback) => {
			nextFrame.delete(callback);
			toKeepAlive.delete(callback);
		},
		/**
		* Execute all schedule callbacks.
		*/
		process: (frameData) => {
			latestFrameData = frameData;
			/**
			* If we're already processing we've probably been triggered by a flushSync
			* inside an existing process. Instead of executing, mark flushNextFrame
			* as true and ensure we flush the following frame at the end of this one.
			*/
			if (isProcessing) {
				flushNextFrame = true;
				return;
			}
			isProcessing = true;
			[thisFrame, nextFrame] = [nextFrame, thisFrame];
			thisFrame.forEach(triggerCallback);
			thisFrame.clear();
			isProcessing = false;
			if (flushNextFrame) {
				flushNextFrame = false;
				step.process(frameData);
			}
		}
	};
	return step;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/frameloop/batcher.mjs
var stepsOrder = [
	"read",
	"resolveKeyframes",
	"update",
	"preRender",
	"render",
	"postRender"
];
var maxElapsed = 40;
function createRenderBatcher(scheduleNextBatch, allowKeepAlive) {
	let runNextFrame = false;
	let useDefaultElapsed = true;
	const state = {
		delta: 0,
		timestamp: 0,
		isProcessing: false
	};
	const flagRunNextFrame = () => runNextFrame = true;
	const steps = stepsOrder.reduce((acc, key) => {
		acc[key] = createRenderStep(flagRunNextFrame);
		return acc;
	}, {});
	const { read, resolveKeyframes, update, preRender, render, postRender } = steps;
	const processBatch = () => {
		const timestamp = MotionGlobalConfig.useManualTiming ? state.timestamp : performance.now();
		runNextFrame = false;
		state.delta = useDefaultElapsed ? 1e3 / 60 : Math.max(Math.min(timestamp - state.timestamp, maxElapsed), 1);
		state.timestamp = timestamp;
		state.isProcessing = true;
		read.process(state);
		resolveKeyframes.process(state);
		update.process(state);
		preRender.process(state);
		render.process(state);
		postRender.process(state);
		state.isProcessing = false;
		if (runNextFrame && allowKeepAlive) {
			useDefaultElapsed = false;
			scheduleNextBatch(processBatch);
		}
	};
	const wake = () => {
		runNextFrame = true;
		useDefaultElapsed = true;
		if (!state.isProcessing) scheduleNextBatch(processBatch);
	};
	const schedule = stepsOrder.reduce((acc, key) => {
		const step = steps[key];
		acc[key] = (process, keepAlive = false, immediate = false) => {
			if (!runNextFrame) wake();
			return step.schedule(process, keepAlive, immediate);
		};
		return acc;
	}, {});
	const cancel = (process) => {
		for (let i = 0; i < stepsOrder.length; i++) steps[stepsOrder[i]].cancel(process);
	};
	return {
		schedule,
		cancel,
		state,
		steps
	};
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/frameloop/frame.mjs
var { schedule: frame, cancel: cancelFrame, state: frameData, steps: frameSteps } = createRenderBatcher(typeof requestAnimationFrame !== "undefined" ? requestAnimationFrame : noop, true);
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/context/LazyContext.mjs
var LazyContext = (0, import_react.createContext)({ strict: false });
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/motion/features/definitions.mjs
var featureProps = {
	animation: [
		"animate",
		"variants",
		"whileHover",
		"whileTap",
		"exit",
		"whileInView",
		"whileFocus",
		"whileDrag"
	],
	exit: ["exit"],
	drag: ["drag", "dragControls"],
	focus: ["whileFocus"],
	hover: [
		"whileHover",
		"onHoverStart",
		"onHoverEnd"
	],
	tap: [
		"whileTap",
		"onTap",
		"onTapStart",
		"onTapCancel"
	],
	pan: [
		"onPan",
		"onPanStart",
		"onPanSessionStart",
		"onPanEnd"
	],
	inView: [
		"whileInView",
		"onViewportEnter",
		"onViewportLeave"
	],
	layout: ["layout", "layoutId"]
};
var featureDefinitions = {};
for (const key in featureProps) featureDefinitions[key] = { isEnabled: (props) => featureProps[key].some((name) => !!props[name]) };
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/motion/features/load-features.mjs
function loadFeatures(features) {
	for (const key in features) featureDefinitions[key] = {
		...featureDefinitions[key],
		...features[key]
	};
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/motion/utils/valid-prop.mjs
/**
* A list of all valid MotionProps.
*
* @privateRemarks
* This doesn't throw if a `MotionProp` name is missing - it should.
*/
var validMotionProps = /* @__PURE__ */ new Set([
	"animate",
	"exit",
	"variants",
	"initial",
	"style",
	"values",
	"variants",
	"transition",
	"transformTemplate",
	"custom",
	"inherit",
	"onBeforeLayoutMeasure",
	"onAnimationStart",
	"onAnimationComplete",
	"onUpdate",
	"onDragStart",
	"onDrag",
	"onDragEnd",
	"onMeasureDragConstraints",
	"onDirectionLock",
	"onDragTransitionEnd",
	"_dragX",
	"_dragY",
	"onHoverStart",
	"onHoverEnd",
	"onViewportEnter",
	"onViewportLeave",
	"globalTapTarget",
	"ignoreStrict",
	"viewport"
]);
/**
* Check whether a prop name is a valid `MotionProp` key.
*
* @param key - Name of the property to check
* @returns `true` is key is a valid `MotionProp`.
*
* @public
*/
function isValidMotionProp(key) {
	return key.startsWith("while") || key.startsWith("drag") && key !== "draggable" || key.startsWith("layout") || key.startsWith("onTap") || key.startsWith("onPan") || key.startsWith("onLayout") || validMotionProps.has(key);
}
//#endregion
//#region optional-peer-dep:__vite-optional-peer-dep:@emotion/is-prop-valid:framer-motion
var require_is_prop_valid_framer_motion = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {};
	throw new Error(`Could not resolve "@emotion/is-prop-valid" imported by "framer-motion". Is it installed?`);
}));
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/dom/utils/filter-props.mjs
var shouldForward = (key) => !isValidMotionProp(key);
function loadExternalIsValidProp(isValidProp) {
	if (!isValidProp) return;
	shouldForward = (key) => key.startsWith("on") ? !isValidMotionProp(key) : isValidProp(key);
}
/**
* Emotion and Styled Components both allow users to pass through arbitrary props to their components
* to dynamically generate CSS. They both use the `@emotion/is-prop-valid` package to determine which
* of these should be passed to the underlying DOM node.
*
* However, when styling a Motion component `styled(motion.div)`, both packages pass through *all* props
* as it's seen as an arbitrary component rather than a DOM node. Motion only allows arbitrary props
* passed through the `custom` prop so it doesn't *need* the payload or computational overhead of
* `@emotion/is-prop-valid`, however to fix this problem we need to use it.
*
* By making it an optionalDependency we can offer this functionality only in the situations where it's
* actually required.
*/
try {
	/**
	* We attempt to import this package but require won't be defined in esm environments, in that case
	* isPropValid will have to be provided via `MotionContext`. In a 6.0.0 this should probably be removed
	* in favour of explicit injection.
	*/
	loadExternalIsValidProp(require_is_prop_valid_framer_motion().default);
} catch (_a) {}
function filterProps(props, isDom, forwardMotionProps) {
	const filteredProps = {};
	for (const key in props) {
		/**
		* values is considered a valid prop by Emotion, so if it's present
		* this will be rendered out to the DOM unless explicitly filtered.
		*
		* We check the type as it could be used with the `feColorMatrix`
		* element, which we support.
		*/
		if (key === "values" && typeof props.values === "object") continue;
		if (shouldForward(key) || forwardMotionProps === true && isValidMotionProp(key) || !isDom && !isValidMotionProp(key) || props["draggable"] && key.startsWith("onDrag")) filteredProps[key] = props[key];
	}
	return filteredProps;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/utils/warn-once.mjs
var warned = /* @__PURE__ */ new Set();
function warnOnce(condition, message, element) {
	if (condition || warned.has(message)) return;
	console.warn(message);
	if (element) console.warn(element);
	warned.add(message);
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/components/create-proxy.mjs
function createDOMMotionComponentProxy(componentFactory) {
	if (typeof Proxy === "undefined") return componentFactory;
	/**
	* A cache of generated `motion` components, e.g `motion.div`, `motion.input` etc.
	* Rather than generating them anew every render.
	*/
	const componentCache = /* @__PURE__ */ new Map();
	const deprecatedFactoryFunction = (...args) => {
		warnOnce(false, "motion() is deprecated. Use motion.create() instead.");
		return componentFactory(...args);
	};
	return new Proxy(deprecatedFactoryFunction, { 
	/**
	* Called when `motion` is referenced with a prop: `motion.div`, `motion.input` etc.
	* The prop name is passed through as `key` and we can use that to generate a `motion`
	* DOM component with that name.
	*/
get: (_target, key) => {
		if (key === "create") return componentFactory;
		/**
		* If this element doesn't exist in the component cache, create it and cache.
		*/
		if (!componentCache.has(key)) componentCache.set(key, componentFactory(key));
		return componentCache.get(key);
	} });
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/context/MotionContext/index.mjs
var MotionContext = (0, import_react.createContext)({});
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/utils/is-variant-label.mjs
/**
* Decides if the supplied variable is variant label
*/
function isVariantLabel(v) {
	return typeof v === "string" || Array.isArray(v);
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/animation/utils/is-animation-controls.mjs
function isAnimationControls(v) {
	return v !== null && typeof v === "object" && typeof v.start === "function";
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/utils/variant-props.mjs
var variantPriorityOrder = [
	"animate",
	"whileInView",
	"whileFocus",
	"whileHover",
	"whileTap",
	"whileDrag",
	"exit"
];
var variantProps = ["initial", ...variantPriorityOrder];
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/utils/is-controlling-variants.mjs
function isControllingVariants(props) {
	return isAnimationControls(props.animate) || variantProps.some((name) => isVariantLabel(props[name]));
}
function isVariantNode(props) {
	return Boolean(isControllingVariants(props) || props.variants);
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/context/MotionContext/utils.mjs
function getCurrentTreeVariants(props, context) {
	if (isControllingVariants(props)) {
		const { initial, animate } = props;
		return {
			initial: initial === false || isVariantLabel(initial) ? initial : void 0,
			animate: isVariantLabel(animate) ? animate : void 0
		};
	}
	return props.inherit !== false ? context : {};
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/context/MotionContext/create.mjs
function useCreateMotionContext(props) {
	const { initial, animate } = getCurrentTreeVariants(props, (0, import_react.useContext)(MotionContext));
	return (0, import_react.useMemo)(() => ({
		initial,
		animate
	}), [variantLabelsAsDependency(initial), variantLabelsAsDependency(animate)]);
}
function variantLabelsAsDependency(prop) {
	return Array.isArray(prop) ? prop.join(" ") : prop;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/motion/utils/symbol.mjs
var motionComponentSymbol = Symbol.for("motionComponentSymbol");
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/utils/is-ref-object.mjs
function isRefObject(ref) {
	return ref && typeof ref === "object" && Object.prototype.hasOwnProperty.call(ref, "current");
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/motion/utils/use-motion-ref.mjs
/**
* Creates a ref function that, when called, hydrates the provided
* external ref and VisualElement.
*/
function useMotionRef(visualState, visualElement, externalRef) {
	return (0, import_react.useCallback)(
		(instance) => {
			if (instance) visualState.onMount && visualState.onMount(instance);
			if (visualElement) if (instance) visualElement.mount(instance);
			else visualElement.unmount();
			if (externalRef) {
				if (typeof externalRef === "function") externalRef(instance);
				else if (isRefObject(externalRef)) externalRef.current = instance;
			}
		},
		/**
		* Only pass a new ref callback to React if we've received a visual element
		* factory. Otherwise we'll be mounting/remounting every time externalRef
		* or other dependencies change.
		*/
		[visualElement]
	);
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/dom/utils/camel-to-dash.mjs
/**
* Convert camelCase to dash-case properties.
*/
var camelToDash = (str) => str.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase();
var optimizedAppearDataAttribute = "data-" + camelToDash("framerAppearId");
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/frameloop/microtask.mjs
var { schedule: microtask, cancel: cancelMicrotask } = createRenderBatcher(queueMicrotask, false);
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/context/SwitchLayoutGroupContext.mjs
/**
* Internal, exported only for usage in Framer
*/
var SwitchLayoutGroupContext = (0, import_react.createContext)({});
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/motion/utils/use-visual-element.mjs
function useVisualElement(Component, visualState, props, createVisualElement, ProjectionNodeConstructor) {
	var _a, _b;
	const { visualElement: parent } = (0, import_react.useContext)(MotionContext);
	const lazyContext = (0, import_react.useContext)(LazyContext);
	const presenceContext = (0, import_react.useContext)(PresenceContext);
	const reducedMotionConfig = (0, import_react.useContext)(MotionConfigContext).reducedMotion;
	const visualElementRef = (0, import_react.useRef)(null);
	/**
	* If we haven't preloaded a renderer, check to see if we have one lazy-loaded
	*/
	createVisualElement = createVisualElement || lazyContext.renderer;
	if (!visualElementRef.current && createVisualElement) visualElementRef.current = createVisualElement(Component, {
		visualState,
		parent,
		props,
		presenceContext,
		blockInitialAnimation: presenceContext ? presenceContext.initial === false : false,
		reducedMotionConfig
	});
	const visualElement = visualElementRef.current;
	/**
	* Load Motion gesture and animation features. These are rendered as renderless
	* components so each feature can optionally make use of React lifecycle methods.
	*/
	const initialLayoutGroupConfig = (0, import_react.useContext)(SwitchLayoutGroupContext);
	if (visualElement && !visualElement.projection && ProjectionNodeConstructor && (visualElement.type === "html" || visualElement.type === "svg")) createProjectionNode$1(visualElementRef.current, props, ProjectionNodeConstructor, initialLayoutGroupConfig);
	const isMounted = (0, import_react.useRef)(false);
	(0, import_react.useInsertionEffect)(() => {
		/**
		* Check the component has already mounted before calling
		* `update` unnecessarily. This ensures we skip the initial update.
		*/
		if (visualElement && isMounted.current) visualElement.update(props, presenceContext);
	});
	/**
	* Cache this value as we want to know whether HandoffAppearAnimations
	* was present on initial render - it will be deleted after this.
	*/
	const optimisedAppearId = props[optimizedAppearDataAttribute];
	const wantsHandoff = (0, import_react.useRef)(Boolean(optimisedAppearId) && !((_a = window.MotionHandoffIsComplete) === null || _a === void 0 ? void 0 : _a.call(window, optimisedAppearId)) && ((_b = window.MotionHasOptimisedAnimation) === null || _b === void 0 ? void 0 : _b.call(window, optimisedAppearId)));
	useIsomorphicLayoutEffect$1(() => {
		if (!visualElement) return;
		isMounted.current = true;
		window.MotionIsMounted = true;
		visualElement.updateFeatures();
		microtask.render(visualElement.render);
		/**
		* Ideally this function would always run in a useEffect.
		*
		* However, if we have optimised appear animations to handoff from,
		* it needs to happen synchronously to ensure there's no flash of
		* incorrect styles in the event of a hydration error.
		*
		* So if we detect a situtation where optimised appear animations
		* are running, we use useLayoutEffect to trigger animations.
		*/
		if (wantsHandoff.current && visualElement.animationState) visualElement.animationState.animateChanges();
	});
	(0, import_react.useEffect)(() => {
		if (!visualElement) return;
		if (!wantsHandoff.current && visualElement.animationState) visualElement.animationState.animateChanges();
		if (wantsHandoff.current) {
			queueMicrotask(() => {
				var _a;
				(_a = window.MotionHandoffMarkAsComplete) === null || _a === void 0 || _a.call(window, optimisedAppearId);
			});
			wantsHandoff.current = false;
		}
	});
	return visualElement;
}
function createProjectionNode$1(visualElement, props, ProjectionNodeConstructor, initialPromotionConfig) {
	const { layoutId, layout, drag, dragConstraints, layoutScroll, layoutRoot } = props;
	visualElement.projection = new ProjectionNodeConstructor(visualElement.latestValues, props["data-framer-portal-id"] ? void 0 : getClosestProjectingNode(visualElement.parent));
	visualElement.projection.setOptions({
		layoutId,
		layout,
		alwaysMeasureLayout: Boolean(drag) || dragConstraints && isRefObject(dragConstraints),
		visualElement,
		/**
		* TODO: Update options in an effect. This could be tricky as it'll be too late
		* to update by the time layout animations run.
		* We also need to fix this safeToRemove by linking it up to the one returned by usePresence,
		* ensuring it gets called if there's no potential layout animations.
		*
		*/
		animationType: typeof layout === "string" ? layout : "both",
		initialPromotionConfig,
		layoutScroll,
		layoutRoot
	});
}
function getClosestProjectingNode(visualElement) {
	if (!visualElement) return void 0;
	return visualElement.options.allowProjection !== false ? visualElement.projection : getClosestProjectingNode(visualElement.parent);
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/motion/index.mjs
/**
* Create a `motion` component.
*
* This function accepts a Component argument, which can be either a string (ie "div"
* for `motion.div`), or an actual React component.
*
* Alongside this is a config option which provides a way of rendering the provided
* component "offline", or outside the React render cycle.
*/
function createRendererMotionComponent({ preloadedFeatures, createVisualElement, useRender, useVisualState, Component }) {
	var _a, _b;
	preloadedFeatures && loadFeatures(preloadedFeatures);
	function MotionComponent(props, externalRef) {
		/**
		* If we need to measure the element we load this functionality in a
		* separate class component in order to gain access to getSnapshotBeforeUpdate.
		*/
		let MeasureLayout;
		const configAndProps = {
			...(0, import_react.useContext)(MotionConfigContext),
			...props,
			layoutId: useLayoutId(props)
		};
		const { isStatic } = configAndProps;
		const context = useCreateMotionContext(props);
		const visualState = useVisualState(props, isStatic);
		if (!isStatic && isBrowser) {
			useStrictMode(configAndProps, preloadedFeatures);
			const layoutProjection = getProjectionFunctionality(configAndProps);
			MeasureLayout = layoutProjection.MeasureLayout;
			/**
			* Create a VisualElement for this component. A VisualElement provides a common
			* interface to renderer-specific APIs (ie DOM/Three.js etc) as well as
			* providing a way of rendering to these APIs outside of the React render loop
			* for more performant animations and interactions
			*/
			context.visualElement = useVisualElement(Component, visualState, configAndProps, createVisualElement, layoutProjection.ProjectionNode);
		}
		/**
		* The mount order and hierarchy is specific to ensure our element ref
		* is hydrated by the time features fire their effects.
		*/
		return (0, import_jsx_runtime.jsxs)(MotionContext.Provider, {
			value: context,
			children: [MeasureLayout && context.visualElement ? (0, import_jsx_runtime.jsx)(MeasureLayout, {
				visualElement: context.visualElement,
				...configAndProps
			}) : null, useRender(Component, props, useMotionRef(visualState, context.visualElement, externalRef), visualState, isStatic, context.visualElement)]
		});
	}
	MotionComponent.displayName = `motion.${typeof Component === "string" ? Component : `create(${(_b = (_a = Component.displayName) !== null && _a !== void 0 ? _a : Component.name) !== null && _b !== void 0 ? _b : ""})`}`;
	const ForwardRefMotionComponent = (0, import_react.forwardRef)(MotionComponent);
	ForwardRefMotionComponent[motionComponentSymbol] = Component;
	return ForwardRefMotionComponent;
}
function useLayoutId({ layoutId }) {
	const layoutGroupId = (0, import_react.useContext)(LayoutGroupContext).id;
	return layoutGroupId && layoutId !== void 0 ? layoutGroupId + "-" + layoutId : layoutId;
}
function useStrictMode(configAndProps, preloadedFeatures) {
	const isStrict = (0, import_react.useContext)(LazyContext).strict;
	/**
	* If we're in development mode, check to make sure we're not rendering a motion component
	* as a child of LazyMotion, as this will break the file-size benefits of using it.
	*/
	if (preloadedFeatures && isStrict) {
		const strictMessage = "You have rendered a `motion` component within a `LazyMotion` component. This will break tree shaking. Import and render a `m` component instead.";
		configAndProps.ignoreStrict ? warning(false, strictMessage) : invariant(false, strictMessage);
	}
}
function getProjectionFunctionality(props) {
	const { drag, layout } = featureDefinitions;
	if (!drag && !layout) return {};
	const combined = {
		...drag,
		...layout
	};
	return {
		MeasureLayout: (drag === null || drag === void 0 ? void 0 : drag.isEnabled(props)) || (layout === null || layout === void 0 ? void 0 : layout.isEnabled(props)) ? combined.MeasureLayout : void 0,
		ProjectionNode: combined.ProjectionNode
	};
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/svg/lowercase-elements.mjs
/**
* We keep these listed separately as we use the lowercase tag names as part
* of the runtime bundle to detect SVG components
*/
var lowercaseSVGElements = [
	"animate",
	"circle",
	"defs",
	"desc",
	"ellipse",
	"g",
	"image",
	"line",
	"filter",
	"marker",
	"mask",
	"metadata",
	"path",
	"pattern",
	"polygon",
	"polyline",
	"rect",
	"stop",
	"switch",
	"symbol",
	"svg",
	"text",
	"tspan",
	"use",
	"view"
];
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/dom/utils/is-svg-component.mjs
function isSVGComponent(Component) {
	if (typeof Component !== "string" || Component.includes("-")) return false;
	else if (lowercaseSVGElements.indexOf(Component) > -1 || /[A-Z]/u.test(Component)) return true;
	return false;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/utils/resolve-variants.mjs
function getValueState(visualElement) {
	const state = [{}, {}];
	visualElement === null || visualElement === void 0 || visualElement.values.forEach((value, key) => {
		state[0][key] = value.get();
		state[1][key] = value.getVelocity();
	});
	return state;
}
function resolveVariantFromProps(props, definition, custom, visualElement) {
	/**
	* If the variant definition is a function, resolve.
	*/
	if (typeof definition === "function") {
		const [current, velocity] = getValueState(visualElement);
		definition = definition(custom !== void 0 ? custom : props.custom, current, velocity);
	}
	/**
	* If the variant definition is a variant label, or
	* the function returned a variant label, resolve.
	*/
	if (typeof definition === "string") definition = props.variants && props.variants[definition];
	/**
	* At this point we've resolved both functions and variant labels,
	* but the resolved variant label might itself have been a function.
	* If so, resolve. This can only have returned a valid target object.
	*/
	if (typeof definition === "function") {
		const [current, velocity] = getValueState(visualElement);
		definition = definition(custom !== void 0 ? custom : props.custom, current, velocity);
	}
	return definition;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/animation/utils/is-keyframes-target.mjs
var isKeyframesTarget = (v) => {
	return Array.isArray(v);
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/utils/resolve-value.mjs
var isCustomValue = (v) => {
	return Boolean(v && typeof v === "object" && v.mix && v.toValue);
};
var resolveFinalValueInKeyframes = (v) => {
	return isKeyframesTarget(v) ? v[v.length - 1] || 0 : v;
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/value/utils/is-motion-value.mjs
var isMotionValue = (value) => Boolean(value && value.getVelocity);
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/value/utils/resolve-motion-value.mjs
/**
* If the provided value is a MotionValue, this returns the actual value, otherwise just the value itself
*
* TODO: Remove and move to library
*/
function resolveMotionValue(value) {
	const unwrappedValue = isMotionValue(value) ? value.get() : value;
	return isCustomValue(unwrappedValue) ? unwrappedValue.toValue() : unwrappedValue;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/motion/utils/use-visual-state.mjs
function makeState({ scrapeMotionValuesFromProps, createRenderState, onUpdate }, props, context, presenceContext) {
	const state = {
		latestValues: makeLatestValues(props, context, presenceContext, scrapeMotionValuesFromProps),
		renderState: createRenderState()
	};
	if (onUpdate) {
		/**
		* onMount works without the VisualElement because it could be
		* called before the VisualElement payload has been hydrated.
		* (e.g. if someone is using m components <m.circle />)
		*/
		state.onMount = (instance) => onUpdate({
			props,
			current: instance,
			...state
		});
		state.onUpdate = (visualElement) => onUpdate(visualElement);
	}
	return state;
}
var makeUseVisualState = (config) => (props, isStatic) => {
	const context = (0, import_react.useContext)(MotionContext);
	const presenceContext = (0, import_react.useContext)(PresenceContext);
	const make = () => makeState(config, props, context, presenceContext);
	return isStatic ? make() : useConstant(make);
};
function makeLatestValues(props, context, presenceContext, scrapeMotionValues) {
	const values = {};
	const motionValues = scrapeMotionValues(props, {});
	for (const key in motionValues) values[key] = resolveMotionValue(motionValues[key]);
	let { initial, animate } = props;
	const isControllingVariants$1 = isControllingVariants(props);
	const isVariantNode$1 = isVariantNode(props);
	if (context && isVariantNode$1 && !isControllingVariants$1 && props.inherit !== false) {
		if (initial === void 0) initial = context.initial;
		if (animate === void 0) animate = context.animate;
	}
	let isInitialAnimationBlocked = presenceContext ? presenceContext.initial === false : false;
	isInitialAnimationBlocked = isInitialAnimationBlocked || initial === false;
	const variantToSet = isInitialAnimationBlocked ? animate : initial;
	if (variantToSet && typeof variantToSet !== "boolean" && !isAnimationControls(variantToSet)) {
		const list = Array.isArray(variantToSet) ? variantToSet : [variantToSet];
		for (let i = 0; i < list.length; i++) {
			const resolved = resolveVariantFromProps(props, list[i]);
			if (resolved) {
				const { transitionEnd, transition, ...target } = resolved;
				for (const key in target) {
					let valueTarget = target[key];
					if (Array.isArray(valueTarget)) {
						/**
						* Take final keyframe if the initial animation is blocked because
						* we want to initialise at the end of that blocked animation.
						*/
						const index = isInitialAnimationBlocked ? valueTarget.length - 1 : 0;
						valueTarget = valueTarget[index];
					}
					if (valueTarget !== null) values[key] = valueTarget;
				}
				for (const key in transitionEnd) values[key] = transitionEnd[key];
			}
		}
	}
	return values;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/html/utils/keys-transform.mjs
/**
* Generate a list of every possible transform key.
*/
var transformPropOrder = [
	"transformPerspective",
	"x",
	"y",
	"z",
	"translateX",
	"translateY",
	"translateZ",
	"scale",
	"scaleX",
	"scaleY",
	"rotate",
	"rotateX",
	"rotateY",
	"rotateZ",
	"skew",
	"skewX",
	"skewY"
];
/**
* A quick lookup for transform props.
*/
var transformProps = new Set(transformPropOrder);
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/dom/utils/is-css-variable.mjs
var checkStringStartsWith = (token) => (key) => typeof key === "string" && key.startsWith(token);
var isCSSVariableName = /*@__PURE__*/ checkStringStartsWith("--");
var startsAsVariableToken = /*@__PURE__*/ checkStringStartsWith("var(--");
var isCSSVariableToken = (value) => {
	if (!startsAsVariableToken(value)) return false;
	return singleCssVariableRegex.test(value.split("/*")[0].trim());
};
var singleCssVariableRegex = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/dom/value-types/get-as-type.mjs
/**
* Provided a value and a ValueType, returns the value as that value type.
*/
var getValueAsType = (value, type) => {
	return type && typeof value === "number" ? type.transform(value) : value;
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/utils/clamp.mjs
var clamp = (min, max, v) => {
	if (v > max) return max;
	if (v < min) return min;
	return v;
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/value/types/numbers/index.mjs
var number = {
	test: (v) => typeof v === "number",
	parse: parseFloat,
	transform: (v) => v
};
var alpha = {
	...number,
	transform: (v) => clamp(0, 1, v)
};
var scale = {
	...number,
	default: 1
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/value/types/numbers/units.mjs
var createUnitType = (unit) => ({
	test: (v) => typeof v === "string" && v.endsWith(unit) && v.split(" ").length === 1,
	parse: parseFloat,
	transform: (v) => `${v}${unit}`
});
var degrees = /*@__PURE__*/ createUnitType("deg");
var percent = /*@__PURE__*/ createUnitType("%");
var px = /*@__PURE__*/ createUnitType("px");
var vh = /*@__PURE__*/ createUnitType("vh");
var vw = /*@__PURE__*/ createUnitType("vw");
var progressPercentage = {
	...percent,
	parse: (v) => percent.parse(v) / 100,
	transform: (v) => percent.transform(v * 100)
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/dom/value-types/number-browser.mjs
var browserNumberValueTypes = {
	borderWidth: px,
	borderTopWidth: px,
	borderRightWidth: px,
	borderBottomWidth: px,
	borderLeftWidth: px,
	borderRadius: px,
	radius: px,
	borderTopLeftRadius: px,
	borderTopRightRadius: px,
	borderBottomRightRadius: px,
	borderBottomLeftRadius: px,
	width: px,
	maxWidth: px,
	height: px,
	maxHeight: px,
	top: px,
	right: px,
	bottom: px,
	left: px,
	padding: px,
	paddingTop: px,
	paddingRight: px,
	paddingBottom: px,
	paddingLeft: px,
	margin: px,
	marginTop: px,
	marginRight: px,
	marginBottom: px,
	marginLeft: px,
	backgroundPositionX: px,
	backgroundPositionY: px
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/dom/value-types/transform.mjs
var transformValueTypes = {
	rotate: degrees,
	rotateX: degrees,
	rotateY: degrees,
	rotateZ: degrees,
	scale,
	scaleX: scale,
	scaleY: scale,
	scaleZ: scale,
	skew: degrees,
	skewX: degrees,
	skewY: degrees,
	distance: px,
	translateX: px,
	translateY: px,
	translateZ: px,
	x: px,
	y: px,
	z: px,
	perspective: px,
	transformPerspective: px,
	opacity: alpha,
	originX: progressPercentage,
	originY: progressPercentage,
	originZ: px
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/dom/value-types/type-int.mjs
var int = {
	...number,
	transform: Math.round
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/dom/value-types/number.mjs
var numberValueTypes = {
	...browserNumberValueTypes,
	...transformValueTypes,
	zIndex: int,
	size: px,
	fillOpacity: alpha,
	strokeOpacity: alpha,
	numOctaves: int
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/html/utils/build-transform.mjs
var translateAlias = {
	x: "translateX",
	y: "translateY",
	z: "translateZ",
	transformPerspective: "perspective"
};
var numTransforms = transformPropOrder.length;
/**
* Build a CSS transform style from individual x/y/scale etc properties.
*
* This outputs with a default order of transforms/scales/rotations, this can be customised by
* providing a transformTemplate function.
*/
function buildTransform(latestValues, transform, transformTemplate) {
	let transformString = "";
	let transformIsDefault = true;
	/**
	* Loop over all possible transforms in order, adding the ones that
	* are present to the transform string.
	*/
	for (let i = 0; i < numTransforms; i++) {
		const key = transformPropOrder[i];
		const value = latestValues[key];
		if (value === void 0) continue;
		let valueIsDefault = true;
		if (typeof value === "number") valueIsDefault = value === (key.startsWith("scale") ? 1 : 0);
		else valueIsDefault = parseFloat(value) === 0;
		if (!valueIsDefault || transformTemplate) {
			const valueAsType = getValueAsType(value, numberValueTypes[key]);
			if (!valueIsDefault) {
				transformIsDefault = false;
				const transformName = translateAlias[key] || key;
				transformString += `${transformName}(${valueAsType}) `;
			}
			if (transformTemplate) transform[key] = valueAsType;
		}
	}
	transformString = transformString.trim();
	if (transformTemplate) transformString = transformTemplate(transform, transformIsDefault ? "" : transformString);
	else if (transformIsDefault) transformString = "none";
	return transformString;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/html/utils/build-styles.mjs
function buildHTMLStyles(state, latestValues, transformTemplate) {
	const { style, vars, transformOrigin } = state;
	let hasTransform = false;
	let hasTransformOrigin = false;
	/**
	* Loop over all our latest animated values and decide whether to handle them
	* as a style or CSS variable.
	*
	* Transforms and transform origins are kept separately for further processing.
	*/
	for (const key in latestValues) {
		const value = latestValues[key];
		if (transformProps.has(key)) {
			hasTransform = true;
			continue;
		} else if (isCSSVariableName(key)) {
			vars[key] = value;
			continue;
		} else {
			const valueAsType = getValueAsType(value, numberValueTypes[key]);
			if (key.startsWith("origin")) {
				hasTransformOrigin = true;
				transformOrigin[key] = valueAsType;
			} else style[key] = valueAsType;
		}
	}
	if (!latestValues.transform) {
		if (hasTransform || transformTemplate) style.transform = buildTransform(latestValues, state.transform, transformTemplate);
		else if (style.transform)
 /**
		* If we have previously created a transform but currently don't have any,
		* reset transform style to none.
		*/
		style.transform = "none";
	}
	/**
	* Build a transformOrigin style. Uses the same defaults as the browser for
	* undefined origins.
	*/
	if (hasTransformOrigin) {
		const { originX = "50%", originY = "50%", originZ = 0 } = transformOrigin;
		style.transformOrigin = `${originX} ${originY} ${originZ}`;
	}
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/svg/utils/path.mjs
var dashKeys = {
	offset: "stroke-dashoffset",
	array: "stroke-dasharray"
};
var camelKeys = {
	offset: "strokeDashoffset",
	array: "strokeDasharray"
};
/**
* Build SVG path properties. Uses the path's measured length to convert
* our custom pathLength, pathSpacing and pathOffset into stroke-dashoffset
* and stroke-dasharray attributes.
*
* This function is mutative to reduce per-frame GC.
*/
function buildSVGPath(attrs, length, spacing = 1, offset = 0, useDashCase = true) {
	attrs.pathLength = 1;
	const keys = useDashCase ? dashKeys : camelKeys;
	attrs[keys.offset] = px.transform(-offset);
	const pathLength = px.transform(length);
	const pathSpacing = px.transform(spacing);
	attrs[keys.array] = `${pathLength} ${pathSpacing}`;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/svg/utils/transform-origin.mjs
function calcOrigin$1(origin, offset, size) {
	return typeof origin === "string" ? origin : px.transform(offset + size * origin);
}
/**
* The SVG transform origin defaults are different to CSS and is less intuitive,
* so we use the measured dimensions of the SVG to reconcile these.
*/
function calcSVGTransformOrigin(dimensions, originX, originY) {
	return `${calcOrigin$1(originX, dimensions.x, dimensions.width)} ${calcOrigin$1(originY, dimensions.y, dimensions.height)}`;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/svg/utils/build-attrs.mjs
/**
* Build SVG visual attrbutes, like cx and style.transform
*/
function buildSVGAttrs(state, { attrX, attrY, attrScale, originX, originY, pathLength, pathSpacing = 1, pathOffset = 0, ...latest }, isSVGTag, transformTemplate) {
	buildHTMLStyles(state, latest, transformTemplate);
	/**
	* For svg tags we just want to make sure viewBox is animatable and treat all the styles
	* as normal HTML tags.
	*/
	if (isSVGTag) {
		if (state.style.viewBox) state.attrs.viewBox = state.style.viewBox;
		return;
	}
	state.attrs = state.style;
	state.style = {};
	const { attrs, style, dimensions } = state;
	/**
	* However, we apply transforms as CSS transforms. So if we detect a transform we take it from attrs
	* and copy it into style.
	*/
	if (attrs.transform) {
		if (dimensions) style.transform = attrs.transform;
		delete attrs.transform;
	}
	if (dimensions && (originX !== void 0 || originY !== void 0 || style.transform)) style.transformOrigin = calcSVGTransformOrigin(dimensions, originX !== void 0 ? originX : .5, originY !== void 0 ? originY : .5);
	if (attrX !== void 0) attrs.x = attrX;
	if (attrY !== void 0) attrs.y = attrY;
	if (attrScale !== void 0) attrs.scale = attrScale;
	if (pathLength !== void 0) buildSVGPath(attrs, pathLength, pathSpacing, pathOffset, false);
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/html/utils/create-render-state.mjs
var createHtmlRenderState = () => ({
	style: {},
	transform: {},
	transformOrigin: {},
	vars: {}
});
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/svg/utils/create-render-state.mjs
var createSvgRenderState = () => ({
	...createHtmlRenderState(),
	attrs: {}
});
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/svg/utils/is-svg-tag.mjs
var isSVGTag = (tag) => typeof tag === "string" && tag.toLowerCase() === "svg";
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/html/utils/render.mjs
function renderHTML(element, { style, vars }, styleProp, projection) {
	Object.assign(element.style, style, projection && projection.getProjectionStyles(styleProp));
	for (const key in vars) element.style.setProperty(key, vars[key]);
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/svg/utils/camel-case-attrs.mjs
/**
* A set of attribute names that are always read/written as camel case.
*/
var camelCaseAttributes = /* @__PURE__ */ new Set([
	"baseFrequency",
	"diffuseConstant",
	"kernelMatrix",
	"kernelUnitLength",
	"keySplines",
	"keyTimes",
	"limitingConeAngle",
	"markerHeight",
	"markerWidth",
	"numOctaves",
	"targetX",
	"targetY",
	"surfaceScale",
	"specularConstant",
	"specularExponent",
	"stdDeviation",
	"tableValues",
	"viewBox",
	"gradientTransform",
	"pathLength",
	"startOffset",
	"textLength",
	"lengthAdjust"
]);
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/svg/utils/render.mjs
function renderSVG(element, renderState, _styleProp, projection) {
	renderHTML(element, renderState, void 0, projection);
	for (const key in renderState.attrs) element.setAttribute(!camelCaseAttributes.has(key) ? camelToDash(key) : key, renderState.attrs[key]);
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/projection/styles/scale-correction.mjs
var scaleCorrectors = {};
function addScaleCorrector(correctors) {
	Object.assign(scaleCorrectors, correctors);
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/motion/utils/is-forced-motion-value.mjs
function isForcedMotionValue(key, { layout, layoutId }) {
	return transformProps.has(key) || key.startsWith("origin") || (layout || layoutId !== void 0) && (!!scaleCorrectors[key] || key === "opacity");
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/html/utils/scrape-motion-values.mjs
function scrapeMotionValuesFromProps$1(props, prevProps, visualElement) {
	var _a;
	const { style } = props;
	const newValues = {};
	for (const key in style) if (isMotionValue(style[key]) || prevProps.style && isMotionValue(prevProps.style[key]) || isForcedMotionValue(key, props) || ((_a = visualElement === null || visualElement === void 0 ? void 0 : visualElement.getValue(key)) === null || _a === void 0 ? void 0 : _a.liveStyle) !== void 0) newValues[key] = style[key];
	return newValues;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/svg/utils/scrape-motion-values.mjs
function scrapeMotionValuesFromProps(props, prevProps, visualElement) {
	const newValues = scrapeMotionValuesFromProps$1(props, prevProps, visualElement);
	for (const key in props) if (isMotionValue(props[key]) || isMotionValue(prevProps[key])) {
		const targetKey = transformPropOrder.indexOf(key) !== -1 ? "attr" + key.charAt(0).toUpperCase() + key.substring(1) : key;
		newValues[targetKey] = props[key];
	}
	return newValues;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/svg/config-motion.mjs
function updateSVGDimensions(instance, renderState) {
	try {
		renderState.dimensions = typeof instance.getBBox === "function" ? instance.getBBox() : instance.getBoundingClientRect();
	} catch (e) {
		renderState.dimensions = {
			x: 0,
			y: 0,
			width: 0,
			height: 0
		};
	}
}
var layoutProps = [
	"x",
	"y",
	"width",
	"height",
	"cx",
	"cy",
	"r"
];
var svgMotionConfig = { useVisualState: makeUseVisualState({
	scrapeMotionValuesFromProps,
	createRenderState: createSvgRenderState,
	onUpdate: ({ props, prevProps, current, renderState, latestValues }) => {
		if (!current) return;
		let hasTransform = !!props.drag;
		if (!hasTransform) {
			for (const key in latestValues) if (transformProps.has(key)) {
				hasTransform = true;
				break;
			}
		}
		if (!hasTransform) return;
		let needsMeasure = !prevProps;
		if (prevProps)
 /**
		* Check the layout props for changes, if any are found we need to
		* measure the element again.
		*/
		for (let i = 0; i < layoutProps.length; i++) {
			const key = layoutProps[i];
			if (props[key] !== prevProps[key]) needsMeasure = true;
		}
		if (!needsMeasure) return;
		frame.read(() => {
			updateSVGDimensions(current, renderState);
			frame.render(() => {
				buildSVGAttrs(renderState, latestValues, isSVGTag(current.tagName), props.transformTemplate);
				renderSVG(current, renderState);
			});
		});
	}
}) };
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/html/config-motion.mjs
var htmlMotionConfig = { useVisualState: makeUseVisualState({
	scrapeMotionValuesFromProps: scrapeMotionValuesFromProps$1,
	createRenderState: createHtmlRenderState
}) };
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/html/use-props.mjs
function copyRawValuesOnly(target, source, props) {
	for (const key in source) if (!isMotionValue(source[key]) && !isForcedMotionValue(key, props)) target[key] = source[key];
}
function useInitialMotionValues({ transformTemplate }, visualState) {
	return (0, import_react.useMemo)(() => {
		const state = createHtmlRenderState();
		buildHTMLStyles(state, visualState, transformTemplate);
		return Object.assign({}, state.vars, state.style);
	}, [visualState]);
}
function useStyle(props, visualState) {
	const styleProp = props.style || {};
	const style = {};
	/**
	* Copy non-Motion Values straight into style
	*/
	copyRawValuesOnly(style, styleProp, props);
	Object.assign(style, useInitialMotionValues(props, visualState));
	return style;
}
function useHTMLProps(props, visualState) {
	const htmlProps = {};
	const style = useStyle(props, visualState);
	if (props.drag && props.dragListener !== false) {
		htmlProps.draggable = false;
		style.userSelect = style.WebkitUserSelect = style.WebkitTouchCallout = "none";
		style.touchAction = props.drag === true ? "none" : `pan-${props.drag === "x" ? "y" : "x"}`;
	}
	if (props.tabIndex === void 0 && (props.onTap || props.onTapStart || props.whileTap)) htmlProps.tabIndex = 0;
	htmlProps.style = style;
	return htmlProps;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/svg/use-props.mjs
function useSVGProps(props, visualState, _isStatic, Component) {
	const visualProps = (0, import_react.useMemo)(() => {
		const state = createSvgRenderState();
		buildSVGAttrs(state, visualState, isSVGTag(Component), props.transformTemplate);
		return {
			...state.attrs,
			style: { ...state.style }
		};
	}, [visualState]);
	if (props.style) {
		const rawStyles = {};
		copyRawValuesOnly(rawStyles, props.style, props);
		visualProps.style = {
			...rawStyles,
			...visualProps.style
		};
	}
	return visualProps;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/dom/use-render.mjs
function createUseRender(forwardMotionProps = false) {
	const useRender = (Component, props, ref, { latestValues }, isStatic) => {
		const visualProps = (isSVGComponent(Component) ? useSVGProps : useHTMLProps)(props, latestValues, isStatic, Component);
		const filteredProps = filterProps(props, typeof Component === "string", forwardMotionProps);
		const elementProps = Component !== import_react.Fragment ? {
			...filteredProps,
			...visualProps,
			ref
		} : {};
		/**
		* If component has been handed a motion value as its child,
		* memoise its initial value and render that. Subsequent updates
		* will be handled by the onChange handler
		*/
		const { children } = props;
		const renderedChildren = (0, import_react.useMemo)(() => isMotionValue(children) ? children.get() : children, [children]);
		return (0, import_react.createElement)(Component, {
			...elementProps,
			children: renderedChildren
		});
	};
	return useRender;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/components/create-factory.mjs
function createMotionComponentFactory(preloadedFeatures, createVisualElement) {
	return function createMotionComponent(Component, { forwardMotionProps } = { forwardMotionProps: false }) {
		return createRendererMotionComponent({
			...isSVGComponent(Component) ? svgMotionConfig : htmlMotionConfig,
			preloadedFeatures,
			useRender: createUseRender(forwardMotionProps),
			createVisualElement,
			Component
		});
	};
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/utils/shallow-compare.mjs
function shallowCompare(next, prev) {
	if (!Array.isArray(prev)) return false;
	const prevLength = prev.length;
	if (prevLength !== next.length) return false;
	for (let i = 0; i < prevLength; i++) if (prev[i] !== next[i]) return false;
	return true;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/utils/resolve-dynamic-variants.mjs
function resolveVariant(visualElement, definition, custom) {
	const props = visualElement.getProps();
	return resolveVariantFromProps(props, definition, custom !== void 0 ? custom : props.custom, visualElement);
}
//#endregion
//#region ../../node_modules/.deno/motion-dom@11.18.1/node_modules/motion-dom/dist/es/utils/supports/scroll-timeline.mjs
var supportsScrollTimeline = /* @__PURE__ */ memo(() => window.ScrollTimeline !== void 0);
//#endregion
//#region ../../node_modules/.deno/motion-dom@11.18.1/node_modules/motion-dom/dist/es/animation/controls/BaseGroup.mjs
var BaseGroupPlaybackControls = class {
	constructor(animations) {
		this.stop = () => this.runAll("stop");
		this.animations = animations.filter(Boolean);
	}
	get finished() {
		return Promise.all(this.animations.map((animation) => "finished" in animation ? animation.finished : animation));
	}
	/**
	* TODO: Filter out cancelled or stopped animations before returning
	*/
	getAll(propName) {
		return this.animations[0][propName];
	}
	setAll(propName, newValue) {
		for (let i = 0; i < this.animations.length; i++) this.animations[i][propName] = newValue;
	}
	attachTimeline(timeline, fallback) {
		const subscriptions = this.animations.map((animation) => {
			if (supportsScrollTimeline() && animation.attachTimeline) return animation.attachTimeline(timeline);
			else if (typeof fallback === "function") return fallback(animation);
		});
		return () => {
			subscriptions.forEach((cancel, i) => {
				cancel && cancel();
				this.animations[i].stop();
			});
		};
	}
	get time() {
		return this.getAll("time");
	}
	set time(time) {
		this.setAll("time", time);
	}
	get speed() {
		return this.getAll("speed");
	}
	set speed(speed) {
		this.setAll("speed", speed);
	}
	get startTime() {
		return this.getAll("startTime");
	}
	get duration() {
		let max = 0;
		for (let i = 0; i < this.animations.length; i++) max = Math.max(max, this.animations[i].duration);
		return max;
	}
	runAll(methodName) {
		this.animations.forEach((controls) => controls[methodName]());
	}
	flatten() {
		this.runAll("flatten");
	}
	play() {
		this.runAll("play");
	}
	pause() {
		this.runAll("pause");
	}
	cancel() {
		this.runAll("cancel");
	}
	complete() {
		this.runAll("complete");
	}
};
//#endregion
//#region ../../node_modules/.deno/motion-dom@11.18.1/node_modules/motion-dom/dist/es/animation/controls/Group.mjs
/**
* TODO: This is a temporary class to support the legacy
* thennable API
*/
var GroupPlaybackControls = class extends BaseGroupPlaybackControls {
	then(onResolve, onReject) {
		return Promise.all(this.animations).then(onResolve).catch(onReject);
	}
};
//#endregion
//#region ../../node_modules/.deno/motion-dom@11.18.1/node_modules/motion-dom/dist/es/animation/utils/get-value-transition.mjs
function getValueTransition$1(transition, key) {
	return transition ? transition[key] || transition["default"] || transition : void 0;
}
//#endregion
//#region ../../node_modules/.deno/motion-dom@11.18.1/node_modules/motion-dom/dist/es/animation/generators/utils/calc-duration.mjs
/**
* Implement a practical max duration for keyframe generation
* to prevent infinite loops
*/
var maxGeneratorDuration = 2e4;
function calcGeneratorDuration(generator) {
	let duration = 0;
	const timeStep = 50;
	let state = generator.next(duration);
	while (!state.done && duration < 2e4) {
		duration += timeStep;
		state = generator.next(duration);
	}
	return duration >= 2e4 ? Infinity : duration;
}
//#endregion
//#region ../../node_modules/.deno/motion-dom@11.18.1/node_modules/motion-dom/dist/es/animation/generators/utils/create-generator-easing.mjs
/**
* Create a progress => progress easing function from a generator.
*/
function createGeneratorEasing(options, scale = 100, createGenerator) {
	const generator = createGenerator({
		...options,
		keyframes: [0, scale]
	});
	const duration = Math.min(calcGeneratorDuration(generator), maxGeneratorDuration);
	return {
		type: "keyframes",
		ease: (progress) => {
			return generator.next(duration * progress).value / scale;
		},
		duration: /* @__PURE__ */ millisecondsToSeconds(duration)
	};
}
//#endregion
//#region ../../node_modules/.deno/motion-dom@11.18.1/node_modules/motion-dom/dist/es/animation/generators/utils/is-generator.mjs
function isGenerator(type) {
	return typeof type === "function";
}
//#endregion
//#region ../../node_modules/.deno/motion-dom@11.18.1/node_modules/motion-dom/dist/es/animation/waapi/utils/attach-timeline.mjs
function attachTimeline(animation, timeline) {
	animation.timeline = timeline;
	animation.onfinish = null;
}
//#endregion
//#region ../../node_modules/.deno/motion-dom@11.18.1/node_modules/motion-dom/dist/es/utils/is-bezier-definition.mjs
var isBezierDefinition = (easing) => Array.isArray(easing) && typeof easing[0] === "number";
//#endregion
//#region ../../node_modules/.deno/motion-dom@11.18.1/node_modules/motion-dom/dist/es/utils/supports/flags.mjs
/**
* Add the ability for test suites to manually set support flags
* to better test more environments.
*/
var supportsFlags = { linearEasing: void 0 };
//#endregion
//#region ../../node_modules/.deno/motion-dom@11.18.1/node_modules/motion-dom/dist/es/utils/supports/memo.mjs
function memoSupports(callback, supportsFlag) {
	const memoized = /* @__PURE__ */ memo(callback);
	return () => {
		var _a;
		return (_a = supportsFlags[supportsFlag]) !== null && _a !== void 0 ? _a : memoized();
	};
}
//#endregion
//#region ../../node_modules/.deno/motion-dom@11.18.1/node_modules/motion-dom/dist/es/utils/supports/linear-easing.mjs
var supportsLinearEasing = /*@__PURE__*/ memoSupports(() => {
	try {
		document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
	} catch (e) {
		return false;
	}
	return true;
}, "linearEasing");
//#endregion
//#region ../../node_modules/.deno/motion-dom@11.18.1/node_modules/motion-dom/dist/es/animation/waapi/utils/linear.mjs
var generateLinearEasing = (easing, duration, resolution = 10) => {
	let points = "";
	const numPoints = Math.max(Math.round(duration / resolution), 2);
	for (let i = 0; i < numPoints; i++) points += easing(/* @__PURE__ */ progress(0, numPoints - 1, i)) + ", ";
	return `linear(${points.substring(0, points.length - 2)})`;
};
//#endregion
//#region ../../node_modules/.deno/motion-dom@11.18.1/node_modules/motion-dom/dist/es/animation/waapi/utils/easing.mjs
function isWaapiSupportedEasing(easing) {
	return Boolean(typeof easing === "function" && supportsLinearEasing() || !easing || typeof easing === "string" && (easing in supportedWaapiEasing || supportsLinearEasing()) || isBezierDefinition(easing) || Array.isArray(easing) && easing.every(isWaapiSupportedEasing));
}
var cubicBezierAsString = ([a, b, c, d]) => `cubic-bezier(${a}, ${b}, ${c}, ${d})`;
var supportedWaapiEasing = {
	linear: "linear",
	ease: "ease",
	easeIn: "ease-in",
	easeOut: "ease-out",
	easeInOut: "ease-in-out",
	circIn: /*@__PURE__*/ cubicBezierAsString([
		0,
		.65,
		.55,
		1
	]),
	circOut: /*@__PURE__*/ cubicBezierAsString([
		.55,
		0,
		1,
		.45
	]),
	backIn: /*@__PURE__*/ cubicBezierAsString([
		.31,
		.01,
		.66,
		-.59
	]),
	backOut: /*@__PURE__*/ cubicBezierAsString([
		.33,
		1.53,
		.69,
		.99
	])
};
function mapEasingToNativeEasing(easing, duration) {
	if (!easing) return;
	else if (typeof easing === "function" && supportsLinearEasing()) return generateLinearEasing(easing, duration);
	else if (isBezierDefinition(easing)) return cubicBezierAsString(easing);
	else if (Array.isArray(easing)) return easing.map((segmentEasing) => mapEasingToNativeEasing(segmentEasing, duration) || supportedWaapiEasing.easeOut);
	else return supportedWaapiEasing[easing];
}
//#endregion
//#region ../../node_modules/.deno/motion-dom@11.18.1/node_modules/motion-dom/dist/es/gestures/drag/state/is-active.mjs
var isDragging = {
	x: false,
	y: false
};
function isDragActive() {
	return isDragging.x || isDragging.y;
}
//#endregion
//#region ../../node_modules/.deno/motion-dom@11.18.1/node_modules/motion-dom/dist/es/utils/resolve-elements.mjs
function resolveElements(elementOrSelector, scope, selectorCache) {
	var _a;
	if (elementOrSelector instanceof Element) return [elementOrSelector];
	else if (typeof elementOrSelector === "string") {
		let root = document;
		if (scope) root = scope.current;
		const elements = (_a = selectorCache === null || selectorCache === void 0 ? void 0 : selectorCache[elementOrSelector]) !== null && _a !== void 0 ? _a : root.querySelectorAll(elementOrSelector);
		return elements ? Array.from(elements) : [];
	}
	return Array.from(elementOrSelector);
}
//#endregion
//#region ../../node_modules/.deno/motion-dom@11.18.1/node_modules/motion-dom/dist/es/gestures/utils/setup.mjs
function setupGesture(elementOrSelector, options) {
	const elements = resolveElements(elementOrSelector);
	const gestureAbortController = new AbortController();
	const eventOptions = {
		passive: true,
		...options,
		signal: gestureAbortController.signal
	};
	const cancel = () => gestureAbortController.abort();
	return [
		elements,
		eventOptions,
		cancel
	];
}
//#endregion
//#region ../../node_modules/.deno/motion-dom@11.18.1/node_modules/motion-dom/dist/es/gestures/hover.mjs
/**
* Filter out events that are not pointer events, or are triggering
* while a Motion gesture is active.
*/
function filterEvents$1(callback) {
	return (event) => {
		if (event.pointerType === "touch" || isDragActive()) return;
		callback(event);
	};
}
/**
* Create a hover gesture. hover() is different to .addEventListener("pointerenter")
* in that it has an easier syntax, filters out polyfilled touch events, interoperates
* with drag gestures, and automatically removes the "pointerennd" event listener when the hover ends.
*
* @public
*/
function hover(elementOrSelector, onHoverStart, options = {}) {
	const [elements, eventOptions, cancel] = setupGesture(elementOrSelector, options);
	const onPointerEnter = filterEvents$1((enterEvent) => {
		const { target } = enterEvent;
		const onHoverEnd = onHoverStart(enterEvent);
		if (typeof onHoverEnd !== "function" || !target) return;
		const onPointerLeave = filterEvents$1((leaveEvent) => {
			onHoverEnd(leaveEvent);
			target.removeEventListener("pointerleave", onPointerLeave);
		});
		target.addEventListener("pointerleave", onPointerLeave, eventOptions);
	});
	elements.forEach((element) => {
		element.addEventListener("pointerenter", onPointerEnter, eventOptions);
	});
	return cancel;
}
//#endregion
//#region ../../node_modules/.deno/motion-dom@11.18.1/node_modules/motion-dom/dist/es/gestures/utils/is-node-or-child.mjs
/**
* Recursively traverse up the tree to check whether the provided child node
* is the parent or a descendant of it.
*
* @param parent - Element to find
* @param child - Element to test against parent
*/
var isNodeOrChild = (parent, child) => {
	if (!child) return false;
	else if (parent === child) return true;
	else return isNodeOrChild(parent, child.parentElement);
};
//#endregion
//#region ../../node_modules/.deno/motion-dom@11.18.1/node_modules/motion-dom/dist/es/gestures/utils/is-primary-pointer.mjs
var isPrimaryPointer = (event) => {
	if (event.pointerType === "mouse") return typeof event.button !== "number" || event.button <= 0;
	else
 /**
	* isPrimary is true for all mice buttons, whereas every touch point
	* is regarded as its own input. So subsequent concurrent touch points
	* will be false.
	*
	* Specifically match against false here as incomplete versions of
	* PointerEvents in very old browser might have it set as undefined.
	*/
	return event.isPrimary !== false;
};
//#endregion
//#region ../../node_modules/.deno/motion-dom@11.18.1/node_modules/motion-dom/dist/es/gestures/press/utils/is-keyboard-accessible.mjs
var focusableElements = /* @__PURE__ */ new Set([
	"BUTTON",
	"INPUT",
	"SELECT",
	"TEXTAREA",
	"A"
]);
function isElementKeyboardAccessible(element) {
	return focusableElements.has(element.tagName) || element.tabIndex !== -1;
}
//#endregion
//#region ../../node_modules/.deno/motion-dom@11.18.1/node_modules/motion-dom/dist/es/gestures/press/utils/state.mjs
var isPressing = /* @__PURE__ */ new WeakSet();
//#endregion
//#region ../../node_modules/.deno/motion-dom@11.18.1/node_modules/motion-dom/dist/es/gestures/press/utils/keyboard.mjs
/**
* Filter out events that are not "Enter" keys.
*/
function filterEvents(callback) {
	return (event) => {
		if (event.key !== "Enter") return;
		callback(event);
	};
}
function firePointerEvent(target, type) {
	target.dispatchEvent(new PointerEvent("pointer" + type, {
		isPrimary: true,
		bubbles: true
	}));
}
var enableKeyboardPress = (focusEvent, eventOptions) => {
	const element = focusEvent.currentTarget;
	if (!element) return;
	const handleKeydown = filterEvents(() => {
		if (isPressing.has(element)) return;
		firePointerEvent(element, "down");
		const handleKeyup = filterEvents(() => {
			firePointerEvent(element, "up");
		});
		const handleBlur = () => firePointerEvent(element, "cancel");
		element.addEventListener("keyup", handleKeyup, eventOptions);
		element.addEventListener("blur", handleBlur, eventOptions);
	});
	element.addEventListener("keydown", handleKeydown, eventOptions);
	/**
	* Add an event listener that fires on blur to remove the keydown events.
	*/
	element.addEventListener("blur", () => element.removeEventListener("keydown", handleKeydown), eventOptions);
};
//#endregion
//#region ../../node_modules/.deno/motion-dom@11.18.1/node_modules/motion-dom/dist/es/gestures/press/index.mjs
/**
* Filter out events that are not primary pointer events, or are triggering
* while a Motion gesture is active.
*/
function isValidPressEvent(event) {
	return isPrimaryPointer(event) && !isDragActive();
}
/**
* Create a press gesture.
*
* Press is different to `"pointerdown"`, `"pointerup"` in that it
* automatically filters out secondary pointer events like right
* click and multitouch.
*
* It also adds accessibility support for keyboards, where
* an element with a press gesture will receive focus and
*  trigger on Enter `"keydown"` and `"keyup"` events.
*
* This is different to a browser's `"click"` event, which does
* respond to keyboards but only for the `"click"` itself, rather
* than the press start and end/cancel. The element also needs
* to be focusable for this to work, whereas a press gesture will
* make an element focusable by default.
*
* @public
*/
function press(elementOrSelector, onPressStart, options = {}) {
	const [elements, eventOptions, cancelEvents] = setupGesture(elementOrSelector, options);
	const startPress = (startEvent) => {
		const element = startEvent.currentTarget;
		if (!isValidPressEvent(startEvent) || isPressing.has(element)) return;
		isPressing.add(element);
		const onPressEnd = onPressStart(startEvent);
		const onPointerEnd = (endEvent, success) => {
			window.removeEventListener("pointerup", onPointerUp);
			window.removeEventListener("pointercancel", onPointerCancel);
			if (!isValidPressEvent(endEvent) || !isPressing.has(element)) return;
			isPressing.delete(element);
			if (typeof onPressEnd === "function") onPressEnd(endEvent, { success });
		};
		const onPointerUp = (upEvent) => {
			onPointerEnd(upEvent, options.useGlobalTarget || isNodeOrChild(element, upEvent.target));
		};
		const onPointerCancel = (cancelEvent) => {
			onPointerEnd(cancelEvent, false);
		};
		window.addEventListener("pointerup", onPointerUp, eventOptions);
		window.addEventListener("pointercancel", onPointerCancel, eventOptions);
	};
	elements.forEach((element) => {
		if (!isElementKeyboardAccessible(element) && element.getAttribute("tabindex") === null) element.tabIndex = 0;
		(options.useGlobalTarget ? window : element).addEventListener("pointerdown", startPress, eventOptions);
		element.addEventListener("focus", (event) => enableKeyboardPress(event, eventOptions), eventOptions);
	});
	return cancelEvents;
}
//#endregion
//#region ../../node_modules/.deno/motion-dom@11.18.1/node_modules/motion-dom/dist/es/gestures/drag/state/set-active.mjs
function setDragLock(axis) {
	if (axis === "x" || axis === "y") if (isDragging[axis]) return null;
	else {
		isDragging[axis] = true;
		return () => {
			isDragging[axis] = false;
		};
	}
	else if (isDragging.x || isDragging.y) return null;
	else {
		isDragging.x = isDragging.y = true;
		return () => {
			isDragging.x = isDragging.y = false;
		};
	}
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/html/utils/keys-position.mjs
var positionalKeys = /* @__PURE__ */ new Set([
	"width",
	"height",
	"top",
	"left",
	"right",
	"bottom",
	...transformPropOrder
]);
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/frameloop/sync-time.mjs
var now;
function clearTime() {
	now = void 0;
}
/**
* An eventloop-synchronous alternative to performance.now().
*
* Ensures that time measurements remain consistent within a synchronous context.
* Usually calling performance.now() twice within the same synchronous context
* will return different values which isn't useful for animations when we're usually
* trying to sync animations to the same frame.
*/
var time = {
	now: () => {
		if (now === void 0) time.set(frameData.isProcessing || MotionGlobalConfig.useManualTiming ? frameData.timestamp : performance.now());
		return now;
	},
	set: (newTime) => {
		now = newTime;
		queueMicrotask(clearTime);
	}
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/utils/array.mjs
function addUniqueItem(arr, item) {
	if (arr.indexOf(item) === -1) arr.push(item);
}
function removeItem(arr, item) {
	const index = arr.indexOf(item);
	if (index > -1) arr.splice(index, 1);
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/utils/subscription-manager.mjs
var SubscriptionManager = class {
	constructor() {
		this.subscriptions = [];
	}
	add(handler) {
		addUniqueItem(this.subscriptions, handler);
		return () => removeItem(this.subscriptions, handler);
	}
	notify(a, b, c) {
		const numSubscriptions = this.subscriptions.length;
		if (!numSubscriptions) return;
		if (numSubscriptions === 1)
 /**
		* If there's only a single handler we can just call it without invoking a loop.
		*/
		this.subscriptions[0](a, b, c);
		else for (let i = 0; i < numSubscriptions; i++) {
			/**
			* Check whether the handler exists before firing as it's possible
			* the subscriptions were modified during this loop running.
			*/
			const handler = this.subscriptions[i];
			handler && handler(a, b, c);
		}
	}
	getSize() {
		return this.subscriptions.length;
	}
	clear() {
		this.subscriptions.length = 0;
	}
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/utils/velocity-per-second.mjs
function velocityPerSecond(velocity, frameDuration) {
	return frameDuration ? velocity * (1e3 / frameDuration) : 0;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/value/index.mjs
/**
* Maximum time between the value of two frames, beyond which we
* assume the velocity has since been 0.
*/
var MAX_VELOCITY_DELTA = 30;
var isFloat = (value) => {
	return !isNaN(parseFloat(value));
};
var collectMotionValues = { current: void 0 };
/**
* `MotionValue` is used to track the state and velocity of motion values.
*
* @public
*/
var MotionValue = class {
	/**
	* @param init - The initiating value
	* @param config - Optional configuration options
	*
	* -  `transformer`: A function to transform incoming values with.
	*
	* @internal
	*/
	constructor(init, options = {}) {
		/**
		* This will be replaced by the build step with the latest version number.
		* When MotionValues are provided to motion components, warn if versions are mixed.
		*/
		this.version = "11.18.2";
		/**
		* Tracks whether this value can output a velocity. Currently this is only true
		* if the value is numerical, but we might be able to widen the scope here and support
		* other value types.
		*
		* @internal
		*/
		this.canTrackVelocity = null;
		/**
		* An object containing a SubscriptionManager for each active event.
		*/
		this.events = {};
		this.updateAndNotify = (v, render = true) => {
			const currentTime = time.now();
			/**
			* If we're updating the value during another frame or eventloop
			* than the previous frame, then the we set the previous frame value
			* to current.
			*/
			if (this.updatedAt !== currentTime) this.setPrevFrameValue();
			this.prev = this.current;
			this.setCurrent(v);
			if (this.current !== this.prev && this.events.change) this.events.change.notify(this.current);
			if (render && this.events.renderRequest) this.events.renderRequest.notify(this.current);
		};
		this.hasAnimated = false;
		this.setCurrent(init);
		this.owner = options.owner;
	}
	setCurrent(current) {
		this.current = current;
		this.updatedAt = time.now();
		if (this.canTrackVelocity === null && current !== void 0) this.canTrackVelocity = isFloat(this.current);
	}
	setPrevFrameValue(prevFrameValue = this.current) {
		this.prevFrameValue = prevFrameValue;
		this.prevUpdatedAt = this.updatedAt;
	}
	/**
	* Adds a function that will be notified when the `MotionValue` is updated.
	*
	* It returns a function that, when called, will cancel the subscription.
	*
	* When calling `onChange` inside a React component, it should be wrapped with the
	* `useEffect` hook. As it returns an unsubscribe function, this should be returned
	* from the `useEffect` function to ensure you don't add duplicate subscribers..
	*
	* ```jsx
	* export const MyComponent = () => {
	*   const x = useMotionValue(0)
	*   const y = useMotionValue(0)
	*   const opacity = useMotionValue(1)
	*
	*   useEffect(() => {
	*     function updateOpacity() {
	*       const maxXY = Math.max(x.get(), y.get())
	*       const newOpacity = transform(maxXY, [0, 100], [1, 0])
	*       opacity.set(newOpacity)
	*     }
	*
	*     const unsubscribeX = x.on("change", updateOpacity)
	*     const unsubscribeY = y.on("change", updateOpacity)
	*
	*     return () => {
	*       unsubscribeX()
	*       unsubscribeY()
	*     }
	*   }, [])
	*
	*   return <motion.div style={{ x }} />
	* }
	* ```
	*
	* @param subscriber - A function that receives the latest value.
	* @returns A function that, when called, will cancel this subscription.
	*
	* @deprecated
	*/
	onChange(subscription) {
		warnOnce(false, `value.onChange(callback) is deprecated. Switch to value.on("change", callback).`);
		return this.on("change", subscription);
	}
	on(eventName, callback) {
		if (!this.events[eventName]) this.events[eventName] = new SubscriptionManager();
		const unsubscribe = this.events[eventName].add(callback);
		if (eventName === "change") return () => {
			unsubscribe();
			/**
			* If we have no more change listeners by the start
			* of the next frame, stop active animations.
			*/
			frame.read(() => {
				if (!this.events.change.getSize()) this.stop();
			});
		};
		return unsubscribe;
	}
	clearListeners() {
		for (const eventManagers in this.events) this.events[eventManagers].clear();
	}
	/**
	* Attaches a passive effect to the `MotionValue`.
	*
	* @internal
	*/
	attach(passiveEffect, stopPassiveEffect) {
		this.passiveEffect = passiveEffect;
		this.stopPassiveEffect = stopPassiveEffect;
	}
	/**
	* Sets the state of the `MotionValue`.
	*
	* @remarks
	*
	* ```jsx
	* const x = useMotionValue(0)
	* x.set(10)
	* ```
	*
	* @param latest - Latest value to set.
	* @param render - Whether to notify render subscribers. Defaults to `true`
	*
	* @public
	*/
	set(v, render = true) {
		if (!render || !this.passiveEffect) this.updateAndNotify(v, render);
		else this.passiveEffect(v, this.updateAndNotify);
	}
	setWithVelocity(prev, current, delta) {
		this.set(current);
		this.prev = void 0;
		this.prevFrameValue = prev;
		this.prevUpdatedAt = this.updatedAt - delta;
	}
	/**
	* Set the state of the `MotionValue`, stopping any active animations,
	* effects, and resets velocity to `0`.
	*/
	jump(v, endAnimation = true) {
		this.updateAndNotify(v);
		this.prev = v;
		this.prevUpdatedAt = this.prevFrameValue = void 0;
		endAnimation && this.stop();
		if (this.stopPassiveEffect) this.stopPassiveEffect();
	}
	/**
	* Returns the latest state of `MotionValue`
	*
	* @returns - The latest state of `MotionValue`
	*
	* @public
	*/
	get() {
		if (collectMotionValues.current) collectMotionValues.current.push(this);
		return this.current;
	}
	/**
	* @public
	*/
	getPrevious() {
		return this.prev;
	}
	/**
	* Returns the latest velocity of `MotionValue`
	*
	* @returns - The latest velocity of `MotionValue`. Returns `0` if the state is non-numerical.
	*
	* @public
	*/
	getVelocity() {
		const currentTime = time.now();
		if (!this.canTrackVelocity || this.prevFrameValue === void 0 || currentTime - this.updatedAt > MAX_VELOCITY_DELTA) return 0;
		const delta = Math.min(this.updatedAt - this.prevUpdatedAt, MAX_VELOCITY_DELTA);
		return velocityPerSecond(parseFloat(this.current) - parseFloat(this.prevFrameValue), delta);
	}
	/**
	* Registers a new animation to control this `MotionValue`. Only one
	* animation can drive a `MotionValue` at one time.
	*
	* ```jsx
	* value.start()
	* ```
	*
	* @param animation - A function that starts the provided animation
	*
	* @internal
	*/
	start(startAnimation) {
		this.stop();
		return new Promise((resolve) => {
			this.hasAnimated = true;
			this.animation = startAnimation(resolve);
			if (this.events.animationStart) this.events.animationStart.notify();
		}).then(() => {
			if (this.events.animationComplete) this.events.animationComplete.notify();
			this.clearAnimation();
		});
	}
	/**
	* Stop the currently active animation.
	*
	* @public
	*/
	stop() {
		if (this.animation) {
			this.animation.stop();
			if (this.events.animationCancel) this.events.animationCancel.notify();
		}
		this.clearAnimation();
	}
	/**
	* Returns `true` if this value is currently animating.
	*
	* @public
	*/
	isAnimating() {
		return !!this.animation;
	}
	clearAnimation() {
		delete this.animation;
	}
	/**
	* Destroy and clean up subscribers to this `MotionValue`.
	*
	* The `MotionValue` hooks like `useMotionValue` and `useTransform` automatically
	* handle the lifecycle of the returned `MotionValue`, so this method is only necessary if you've manually
	* created a `MotionValue` via the `motionValue` function.
	*
	* @public
	*/
	destroy() {
		this.clearListeners();
		this.stop();
		if (this.stopPassiveEffect) this.stopPassiveEffect();
	}
};
function motionValue(init, options) {
	return new MotionValue(init, options);
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/utils/setters.mjs
/**
* Set VisualElement's MotionValue, creating a new MotionValue for it if
* it doesn't exist.
*/
function setMotionValue(visualElement, key, value) {
	if (visualElement.hasValue(key)) visualElement.getValue(key).set(value);
	else visualElement.addValue(key, motionValue(value));
}
function setTarget(visualElement, definition) {
	let { transitionEnd = {}, transition = {}, ...target } = resolveVariant(visualElement, definition) || {};
	target = {
		...target,
		...transitionEnd
	};
	for (const key in target) setMotionValue(visualElement, key, resolveFinalValueInKeyframes(target[key]));
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/value/use-will-change/is.mjs
function isWillChangeMotionValue(value) {
	return Boolean(isMotionValue(value) && value.add);
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/value/use-will-change/add-will-change.mjs
function addValueToWillChange(visualElement, key) {
	const willChange = visualElement.getValue("willChange");
	/**
	* It could be that a user has set willChange to a regular MotionValue,
	* in which case we can't add the value to it.
	*/
	if (isWillChangeMotionValue(willChange)) return willChange.add(key);
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/animation/optimized-appear/get-appear-id.mjs
function getOptimisedAppearId(visualElement) {
	return visualElement.props[optimizedAppearDataAttribute];
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/utils/use-instant-transition-state.mjs
var instantAnimationState = { current: false };
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/easing/cubic-bezier.mjs
var calcBezier = (t, a1, a2) => (((1 - 3 * a2 + 3 * a1) * t + (3 * a2 - 6 * a1)) * t + 3 * a1) * t;
var subdivisionPrecision = 1e-7;
var subdivisionMaxIterations = 12;
function binarySubdivide(x, lowerBound, upperBound, mX1, mX2) {
	let currentX;
	let currentT;
	let i = 0;
	do {
		currentT = lowerBound + (upperBound - lowerBound) / 2;
		currentX = calcBezier(currentT, mX1, mX2) - x;
		if (currentX > 0) upperBound = currentT;
		else lowerBound = currentT;
	} while (Math.abs(currentX) > subdivisionPrecision && ++i < subdivisionMaxIterations);
	return currentT;
}
function cubicBezier(mX1, mY1, mX2, mY2) {
	if (mX1 === mY1 && mX2 === mY2) return noop;
	const getTForX = (aX) => binarySubdivide(aX, 0, 1, mX1, mX2);
	return (t) => t === 0 || t === 1 ? t : calcBezier(getTForX(t), mY1, mY2);
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/easing/modifiers/mirror.mjs
var mirrorEasing = (easing) => (p) => p <= .5 ? easing(2 * p) / 2 : (2 - easing(2 * (1 - p))) / 2;
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/easing/modifiers/reverse.mjs
var reverseEasing = (easing) => (p) => 1 - easing(1 - p);
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/easing/back.mjs
var backOut = /*@__PURE__*/ cubicBezier(.33, 1.53, .69, .99);
var backIn = /*@__PURE__*/ reverseEasing(backOut);
var backInOut = /*@__PURE__*/ mirrorEasing(backIn);
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/easing/anticipate.mjs
var anticipate = (p) => (p *= 2) < 1 ? .5 * backIn(p) : .5 * (2 - Math.pow(2, -10 * (p - 1)));
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/easing/circ.mjs
var circIn = (p) => 1 - Math.sin(Math.acos(p));
var circOut = reverseEasing(circIn);
var circInOut = mirrorEasing(circIn);
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/utils/is-zero-value-string.mjs
/**
* Check if the value is a zero value string like "0px" or "0%"
*/
var isZeroValueString = (v) => /^0[^.\s]+$/u.test(v);
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/animation/utils/is-none.mjs
function isNone(value) {
	if (typeof value === "number") return value === 0;
	else if (value !== null) return value === "none" || value === "0" || isZeroValueString(value);
	else return true;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/value/types/utils/sanitize.mjs
var sanitize = (v) => Math.round(v * 1e5) / 1e5;
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/value/types/utils/float-regex.mjs
var floatRegex = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/value/types/utils/is-nullish.mjs
function isNullish(v) {
	return v == null;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/value/types/utils/single-color-regex.mjs
var singleColorRegex = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu;
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/value/types/color/utils.mjs
/**
* Returns true if the provided string is a color, ie rgba(0,0,0,0) or #000,
* but false if a number or multiple colors
*/
var isColorString = (type, testProp) => (v) => {
	return Boolean(typeof v === "string" && singleColorRegex.test(v) && v.startsWith(type) || testProp && !isNullish(v) && Object.prototype.hasOwnProperty.call(v, testProp));
};
var splitColor = (aName, bName, cName) => (v) => {
	if (typeof v !== "string") return v;
	const [a, b, c, alpha] = v.match(floatRegex);
	return {
		[aName]: parseFloat(a),
		[bName]: parseFloat(b),
		[cName]: parseFloat(c),
		alpha: alpha !== void 0 ? parseFloat(alpha) : 1
	};
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/value/types/color/rgba.mjs
var clampRgbUnit = (v) => clamp(0, 255, v);
var rgbUnit = {
	...number,
	transform: (v) => Math.round(clampRgbUnit(v))
};
var rgba = {
	test: /*@__PURE__*/ isColorString("rgb", "red"),
	parse: /*@__PURE__*/ splitColor("red", "green", "blue"),
	transform: ({ red, green, blue, alpha: alpha$1 = 1 }) => "rgba(" + rgbUnit.transform(red) + ", " + rgbUnit.transform(green) + ", " + rgbUnit.transform(blue) + ", " + sanitize(alpha.transform(alpha$1)) + ")"
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/value/types/color/hex.mjs
function parseHex(v) {
	let r = "";
	let g = "";
	let b = "";
	let a = "";
	if (v.length > 5) {
		r = v.substring(1, 3);
		g = v.substring(3, 5);
		b = v.substring(5, 7);
		a = v.substring(7, 9);
	} else {
		r = v.substring(1, 2);
		g = v.substring(2, 3);
		b = v.substring(3, 4);
		a = v.substring(4, 5);
		r += r;
		g += g;
		b += b;
		a += a;
	}
	return {
		red: parseInt(r, 16),
		green: parseInt(g, 16),
		blue: parseInt(b, 16),
		alpha: a ? parseInt(a, 16) / 255 : 1
	};
}
var hex = {
	test: /*@__PURE__*/ isColorString("#"),
	parse: parseHex,
	transform: rgba.transform
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/value/types/color/hsla.mjs
var hsla = {
	test: /*@__PURE__*/ isColorString("hsl", "hue"),
	parse: /*@__PURE__*/ splitColor("hue", "saturation", "lightness"),
	transform: ({ hue, saturation, lightness, alpha: alpha$1 = 1 }) => {
		return "hsla(" + Math.round(hue) + ", " + percent.transform(sanitize(saturation)) + ", " + percent.transform(sanitize(lightness)) + ", " + sanitize(alpha.transform(alpha$1)) + ")";
	}
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/value/types/color/index.mjs
var color = {
	test: (v) => rgba.test(v) || hex.test(v) || hsla.test(v),
	parse: (v) => {
		if (rgba.test(v)) return rgba.parse(v);
		else if (hsla.test(v)) return hsla.parse(v);
		else return hex.parse(v);
	},
	transform: (v) => {
		return typeof v === "string" ? v : v.hasOwnProperty("red") ? rgba.transform(v) : hsla.transform(v);
	}
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/value/types/utils/color-regex.mjs
var colorRegex = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/value/types/complex/index.mjs
function test(v) {
	var _a, _b;
	return isNaN(v) && typeof v === "string" && (((_a = v.match(floatRegex)) === null || _a === void 0 ? void 0 : _a.length) || 0) + (((_b = v.match(colorRegex)) === null || _b === void 0 ? void 0 : _b.length) || 0) > 0;
}
var NUMBER_TOKEN = "number";
var COLOR_TOKEN = "color";
var VAR_TOKEN = "var";
var VAR_FUNCTION_TOKEN = "var(";
var SPLIT_TOKEN = "${}";
var complexRegex = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function analyseComplexValue(value) {
	const originalValue = value.toString();
	const values = [];
	const indexes = {
		color: [],
		number: [],
		var: []
	};
	const types = [];
	let i = 0;
	return {
		values,
		split: originalValue.replace(complexRegex, (parsedValue) => {
			if (color.test(parsedValue)) {
				indexes.color.push(i);
				types.push(COLOR_TOKEN);
				values.push(color.parse(parsedValue));
			} else if (parsedValue.startsWith(VAR_FUNCTION_TOKEN)) {
				indexes.var.push(i);
				types.push(VAR_TOKEN);
				values.push(parsedValue);
			} else {
				indexes.number.push(i);
				types.push(NUMBER_TOKEN);
				values.push(parseFloat(parsedValue));
			}
			++i;
			return SPLIT_TOKEN;
		}).split(SPLIT_TOKEN),
		indexes,
		types
	};
}
function parseComplexValue(v) {
	return analyseComplexValue(v).values;
}
function createTransformer(source) {
	const { split, types } = analyseComplexValue(source);
	const numSections = split.length;
	return (v) => {
		let output = "";
		for (let i = 0; i < numSections; i++) {
			output += split[i];
			if (v[i] !== void 0) {
				const type = types[i];
				if (type === NUMBER_TOKEN) output += sanitize(v[i]);
				else if (type === COLOR_TOKEN) output += color.transform(v[i]);
				else output += v[i];
			}
		}
		return output;
	};
}
var convertNumbersToZero = (v) => typeof v === "number" ? 0 : v;
function getAnimatableNone$1(v) {
	const parsed = parseComplexValue(v);
	return createTransformer(v)(parsed.map(convertNumbersToZero));
}
var complex = {
	test,
	parse: parseComplexValue,
	createTransformer,
	getAnimatableNone: getAnimatableNone$1
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/value/types/complex/filter.mjs
/**
* Properties that should default to 1 or 100%
*/
var maxDefaults = /* @__PURE__ */ new Set([
	"brightness",
	"contrast",
	"saturate",
	"opacity"
]);
function applyDefaultFilter(v) {
	const [name, value] = v.slice(0, -1).split("(");
	if (name === "drop-shadow") return v;
	const [number] = value.match(floatRegex) || [];
	if (!number) return v;
	const unit = value.replace(number, "");
	let defaultValue = maxDefaults.has(name) ? 1 : 0;
	if (number !== value) defaultValue *= 100;
	return name + "(" + defaultValue + unit + ")";
}
var functionRegex = /\b([a-z-]*)\(.*?\)/gu;
var filter = {
	...complex,
	getAnimatableNone: (v) => {
		const functions = v.match(functionRegex);
		return functions ? functions.map(applyDefaultFilter).join(" ") : v;
	}
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/dom/value-types/defaults.mjs
/**
* A map of default value types for common values
*/
var defaultValueTypes = {
	...numberValueTypes,
	color,
	backgroundColor: color,
	outlineColor: color,
	fill: color,
	stroke: color,
	borderColor: color,
	borderTopColor: color,
	borderRightColor: color,
	borderBottomColor: color,
	borderLeftColor: color,
	filter,
	WebkitFilter: filter
};
/**
* Gets the default ValueType for the provided value key
*/
var getDefaultValueType = (key) => defaultValueTypes[key];
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/dom/value-types/animatable-none.mjs
function getAnimatableNone(key, value) {
	let defaultValueType = getDefaultValueType(key);
	if (defaultValueType !== filter) defaultValueType = complex;
	return defaultValueType.getAnimatableNone ? defaultValueType.getAnimatableNone(value) : void 0;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/html/utils/make-none-animatable.mjs
/**
* If we encounter keyframes like "none" or "0" and we also have keyframes like
* "#fff" or "200px 200px" we want to find a keyframe to serve as a template for
* the "none" keyframes. In this case "#fff" or "200px 200px" - then these get turned into
* zero equivalents, i.e. "#fff0" or "0px 0px".
*/
var invalidTemplates = /* @__PURE__ */ new Set([
	"auto",
	"none",
	"0"
]);
function makeNoneKeyframesAnimatable(unresolvedKeyframes, noneKeyframeIndexes, name) {
	let i = 0;
	let animatableTemplate = void 0;
	while (i < unresolvedKeyframes.length && !animatableTemplate) {
		const keyframe = unresolvedKeyframes[i];
		if (typeof keyframe === "string" && !invalidTemplates.has(keyframe) && analyseComplexValue(keyframe).values.length) animatableTemplate = unresolvedKeyframes[i];
		i++;
	}
	if (animatableTemplate && name) for (const noneIndex of noneKeyframeIndexes) unresolvedKeyframes[noneIndex] = getAnimatableNone(name, animatableTemplate);
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/dom/utils/unit-conversion.mjs
var isNumOrPxType = (v) => v === number || v === px;
var getPosFromMatrix = (matrix, pos) => parseFloat(matrix.split(", ")[pos]);
var getTranslateFromMatrix = (pos2, pos3) => (_bbox, { transform }) => {
	if (transform === "none" || !transform) return 0;
	const matrix3d = transform.match(/^matrix3d\((.+)\)$/u);
	if (matrix3d) return getPosFromMatrix(matrix3d[1], pos3);
	else {
		const matrix = transform.match(/^matrix\((.+)\)$/u);
		if (matrix) return getPosFromMatrix(matrix[1], pos2);
		else return 0;
	}
};
var transformKeys = /* @__PURE__ */ new Set([
	"x",
	"y",
	"z"
]);
var nonTranslationalTransformKeys = transformPropOrder.filter((key) => !transformKeys.has(key));
function removeNonTranslationalTransform(visualElement) {
	const removedTransforms = [];
	nonTranslationalTransformKeys.forEach((key) => {
		const value = visualElement.getValue(key);
		if (value !== void 0) {
			removedTransforms.push([key, value.get()]);
			value.set(key.startsWith("scale") ? 1 : 0);
		}
	});
	return removedTransforms;
}
var positionalValues = {
	width: ({ x }, { paddingLeft = "0", paddingRight = "0" }) => x.max - x.min - parseFloat(paddingLeft) - parseFloat(paddingRight),
	height: ({ y }, { paddingTop = "0", paddingBottom = "0" }) => y.max - y.min - parseFloat(paddingTop) - parseFloat(paddingBottom),
	top: (_bbox, { top }) => parseFloat(top),
	left: (_bbox, { left }) => parseFloat(left),
	bottom: ({ y }, { top }) => parseFloat(top) + (y.max - y.min),
	right: ({ x }, { left }) => parseFloat(left) + (x.max - x.min),
	x: getTranslateFromMatrix(4, 13),
	y: getTranslateFromMatrix(5, 14)
};
positionalValues.translateX = positionalValues.x;
positionalValues.translateY = positionalValues.y;
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/utils/KeyframesResolver.mjs
var toResolve = /* @__PURE__ */ new Set();
var isScheduled = false;
var anyNeedsMeasurement = false;
function measureAllKeyframes() {
	if (anyNeedsMeasurement) {
		const resolversToMeasure = Array.from(toResolve).filter((resolver) => resolver.needsMeasurement);
		const elementsToMeasure = new Set(resolversToMeasure.map((resolver) => resolver.element));
		const transformsToRestore = /* @__PURE__ */ new Map();
		/**
		* Write pass
		* If we're measuring elements we want to remove bounding box-changing transforms.
		*/
		elementsToMeasure.forEach((element) => {
			const removedTransforms = removeNonTranslationalTransform(element);
			if (!removedTransforms.length) return;
			transformsToRestore.set(element, removedTransforms);
			element.render();
		});
		resolversToMeasure.forEach((resolver) => resolver.measureInitialState());
		elementsToMeasure.forEach((element) => {
			element.render();
			const restore = transformsToRestore.get(element);
			if (restore) restore.forEach(([key, value]) => {
				var _a;
				(_a = element.getValue(key)) === null || _a === void 0 || _a.set(value);
			});
		});
		resolversToMeasure.forEach((resolver) => resolver.measureEndState());
		resolversToMeasure.forEach((resolver) => {
			if (resolver.suspendedScrollY !== void 0) window.scrollTo(0, resolver.suspendedScrollY);
		});
	}
	anyNeedsMeasurement = false;
	isScheduled = false;
	toResolve.forEach((resolver) => resolver.complete());
	toResolve.clear();
}
function readAllKeyframes() {
	toResolve.forEach((resolver) => {
		resolver.readKeyframes();
		if (resolver.needsMeasurement) anyNeedsMeasurement = true;
	});
}
function flushKeyframeResolvers() {
	readAllKeyframes();
	measureAllKeyframes();
}
var KeyframeResolver = class {
	constructor(unresolvedKeyframes, onComplete, name, motionValue, element, isAsync = false) {
		/**
		* Track whether this resolver has completed. Once complete, it never
		* needs to attempt keyframe resolution again.
		*/
		this.isComplete = false;
		/**
		* Track whether this resolver is async. If it is, it'll be added to the
		* resolver queue and flushed in the next frame. Resolvers that aren't going
		* to trigger read/write thrashing don't need to be async.
		*/
		this.isAsync = false;
		/**
		* Track whether this resolver needs to perform a measurement
		* to resolve its keyframes.
		*/
		this.needsMeasurement = false;
		/**
		* Track whether this resolver is currently scheduled to resolve
		* to allow it to be cancelled and resumed externally.
		*/
		this.isScheduled = false;
		this.unresolvedKeyframes = [...unresolvedKeyframes];
		this.onComplete = onComplete;
		this.name = name;
		this.motionValue = motionValue;
		this.element = element;
		this.isAsync = isAsync;
	}
	scheduleResolve() {
		this.isScheduled = true;
		if (this.isAsync) {
			toResolve.add(this);
			if (!isScheduled) {
				isScheduled = true;
				frame.read(readAllKeyframes);
				frame.resolveKeyframes(measureAllKeyframes);
			}
		} else {
			this.readKeyframes();
			this.complete();
		}
	}
	readKeyframes() {
		const { unresolvedKeyframes, name, element, motionValue } = this;
		/**
		* If a keyframe is null, we hydrate it either by reading it from
		* the instance, or propagating from previous keyframes.
		*/
		for (let i = 0; i < unresolvedKeyframes.length; i++) if (unresolvedKeyframes[i] === null)
 /**
		* If the first keyframe is null, we need to find its value by sampling the element
		*/
		if (i === 0) {
			const currentValue = motionValue === null || motionValue === void 0 ? void 0 : motionValue.get();
			const finalKeyframe = unresolvedKeyframes[unresolvedKeyframes.length - 1];
			if (currentValue !== void 0) unresolvedKeyframes[0] = currentValue;
			else if (element && name) {
				const valueAsRead = element.readValue(name, finalKeyframe);
				if (valueAsRead !== void 0 && valueAsRead !== null) unresolvedKeyframes[0] = valueAsRead;
			}
			if (unresolvedKeyframes[0] === void 0) unresolvedKeyframes[0] = finalKeyframe;
			if (motionValue && currentValue === void 0) motionValue.set(unresolvedKeyframes[0]);
		} else unresolvedKeyframes[i] = unresolvedKeyframes[i - 1];
	}
	setFinalKeyframe() {}
	measureInitialState() {}
	renderEndStyles() {}
	measureEndState() {}
	complete() {
		this.isComplete = true;
		this.onComplete(this.unresolvedKeyframes, this.finalKeyframe);
		toResolve.delete(this);
	}
	cancel() {
		if (!this.isComplete) {
			this.isScheduled = false;
			toResolve.delete(this);
		}
	}
	resume() {
		if (!this.isComplete) this.scheduleResolve();
	}
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/utils/is-numerical-string.mjs
/**
* Check if value is a numerical string, ie a string that is purely a number eg "100" or "-100.1"
*/
var isNumericalString = (v) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(v);
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/dom/utils/css-variables-conversion.mjs
/**
* Parse Framer's special CSS variable format into a CSS token and a fallback.
*
* ```
* `var(--foo, #fff)` => [`--foo`, '#fff']
* ```
*
* @param current
*/
var splitCSSVariableRegex = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;
function parseCSSVariable(current) {
	const match = splitCSSVariableRegex.exec(current);
	if (!match) return [,];
	const [, token1, token2, fallback] = match;
	return [`--${token1 !== null && token1 !== void 0 ? token1 : token2}`, fallback];
}
var maxDepth = 4;
function getVariableValue(current, element, depth = 1) {
	invariant(depth <= maxDepth, `Max CSS variable fallback depth detected in property "${current}". This may indicate a circular fallback dependency.`);
	const [token, fallback] = parseCSSVariable(current);
	if (!token) return;
	const resolved = window.getComputedStyle(element).getPropertyValue(token);
	if (resolved) {
		const trimmed = resolved.trim();
		return isNumericalString(trimmed) ? parseFloat(trimmed) : trimmed;
	}
	return isCSSVariableToken(fallback) ? getVariableValue(fallback, element, depth + 1) : fallback;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/dom/value-types/test.mjs
/**
* Tests a provided value against a ValueType
*/
var testValueType = (v) => (type) => type.test(v);
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/dom/value-types/dimensions.mjs
/**
* A list of value types commonly used for dimensions
*/
var dimensionValueTypes = [
	number,
	px,
	percent,
	degrees,
	vw,
	vh,
	{
		test: (v) => v === "auto",
		parse: (v) => v
	}
];
/**
* Tests a dimensional value against the list of dimension ValueTypes
*/
var findDimensionValueType = (v) => dimensionValueTypes.find(testValueType(v));
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/dom/DOMKeyframesResolver.mjs
var DOMKeyframesResolver = class extends KeyframeResolver {
	constructor(unresolvedKeyframes, onComplete, name, motionValue, element) {
		super(unresolvedKeyframes, onComplete, name, motionValue, element, true);
	}
	readKeyframes() {
		const { unresolvedKeyframes, element, name } = this;
		if (!element || !element.current) return;
		super.readKeyframes();
		/**
		* If any keyframe is a CSS variable, we need to find its value by sampling the element
		*/
		for (let i = 0; i < unresolvedKeyframes.length; i++) {
			let keyframe = unresolvedKeyframes[i];
			if (typeof keyframe === "string") {
				keyframe = keyframe.trim();
				if (isCSSVariableToken(keyframe)) {
					const resolved = getVariableValue(keyframe, element.current);
					if (resolved !== void 0) unresolvedKeyframes[i] = resolved;
					if (i === unresolvedKeyframes.length - 1) this.finalKeyframe = keyframe;
				}
			}
		}
		/**
		* Resolve "none" values. We do this potentially twice - once before and once after measuring keyframes.
		* This could be seen as inefficient but it's a trade-off to avoid measurements in more situations, which
		* have a far bigger performance impact.
		*/
		this.resolveNoneKeyframes();
		/**
		* Check to see if unit type has changed. If so schedule jobs that will
		* temporarily set styles to the destination keyframes.
		* Skip if we have more than two keyframes or this isn't a positional value.
		* TODO: We can throw if there are multiple keyframes and the value type changes.
		*/
		if (!positionalKeys.has(name) || unresolvedKeyframes.length !== 2) return;
		const [origin, target] = unresolvedKeyframes;
		const originType = findDimensionValueType(origin);
		const targetType = findDimensionValueType(target);
		/**
		* Either we don't recognise these value types or we can animate between them.
		*/
		if (originType === targetType) return;
		/**
		* If both values are numbers or pixels, we can animate between them by
		* converting them to numbers.
		*/
		if (isNumOrPxType(originType) && isNumOrPxType(targetType)) for (let i = 0; i < unresolvedKeyframes.length; i++) {
			const value = unresolvedKeyframes[i];
			if (typeof value === "string") unresolvedKeyframes[i] = parseFloat(value);
		}
		else
 /**
		* Else, the only way to resolve this is by measuring the element.
		*/
		this.needsMeasurement = true;
	}
	resolveNoneKeyframes() {
		const { unresolvedKeyframes, name } = this;
		const noneKeyframeIndexes = [];
		for (let i = 0; i < unresolvedKeyframes.length; i++) if (isNone(unresolvedKeyframes[i])) noneKeyframeIndexes.push(i);
		if (noneKeyframeIndexes.length) makeNoneKeyframesAnimatable(unresolvedKeyframes, noneKeyframeIndexes, name);
	}
	measureInitialState() {
		const { element, unresolvedKeyframes, name } = this;
		if (!element || !element.current) return;
		if (name === "height") this.suspendedScrollY = window.pageYOffset;
		this.measuredOrigin = positionalValues[name](element.measureViewportBox(), window.getComputedStyle(element.current));
		unresolvedKeyframes[0] = this.measuredOrigin;
		const measureKeyframe = unresolvedKeyframes[unresolvedKeyframes.length - 1];
		if (measureKeyframe !== void 0) element.getValue(name, measureKeyframe).jump(measureKeyframe, false);
	}
	measureEndState() {
		var _a;
		const { element, name, unresolvedKeyframes } = this;
		if (!element || !element.current) return;
		const value = element.getValue(name);
		value && value.jump(this.measuredOrigin, false);
		const finalKeyframeIndex = unresolvedKeyframes.length - 1;
		const finalKeyframe = unresolvedKeyframes[finalKeyframeIndex];
		unresolvedKeyframes[finalKeyframeIndex] = positionalValues[name](element.measureViewportBox(), window.getComputedStyle(element.current));
		if (finalKeyframe !== null && this.finalKeyframe === void 0) this.finalKeyframe = finalKeyframe;
		if ((_a = this.removedTransforms) === null || _a === void 0 ? void 0 : _a.length) this.removedTransforms.forEach(([unsetTransformName, unsetTransformValue]) => {
			element.getValue(unsetTransformName).set(unsetTransformValue);
		});
		this.resolveNoneKeyframes();
	}
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/animation/utils/is-animatable.mjs
/**
* Check if a value is animatable. Examples:
*
* ✅: 100, "100px", "#fff"
* ❌: "block", "url(2.jpg)"
* @param value
*
* @internal
*/
var isAnimatable = (value, name) => {
	if (name === "zIndex") return false;
	if (typeof value === "number" || Array.isArray(value)) return true;
	if (typeof value === "string" && (complex.test(value) || value === "0") && !value.startsWith("url(")) return true;
	return false;
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/animation/animators/utils/can-animate.mjs
function hasKeyframesChanged(keyframes) {
	const current = keyframes[0];
	if (keyframes.length === 1) return true;
	for (let i = 0; i < keyframes.length; i++) if (keyframes[i] !== current) return true;
}
function canAnimate(keyframes, name, type, velocity) {
	/**
	* Check if we're able to animate between the start and end keyframes,
	* and throw a warning if we're attempting to animate between one that's
	* animatable and another that isn't.
	*/
	const originKeyframe = keyframes[0];
	if (originKeyframe === null) return false;
	/**
	* These aren't traditionally animatable but we do support them.
	* In future we could look into making this more generic or replacing
	* this function with mix() === mixImmediate
	*/
	if (name === "display" || name === "visibility") return true;
	const targetKeyframe = keyframes[keyframes.length - 1];
	const isOriginAnimatable = isAnimatable(originKeyframe, name);
	const isTargetAnimatable = isAnimatable(targetKeyframe, name);
	warning(isOriginAnimatable === isTargetAnimatable, `You are trying to animate ${name} from "${originKeyframe}" to "${targetKeyframe}". ${originKeyframe} is not an animatable value - to enable this animation set ${originKeyframe} to a value animatable to ${targetKeyframe} via the \`style\` property.`);
	if (!isOriginAnimatable || !isTargetAnimatable) return false;
	return hasKeyframesChanged(keyframes) || (type === "spring" || isGenerator(type)) && velocity;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/animation/animators/waapi/utils/get-final-keyframe.mjs
var isNotNull = (value) => value !== null;
function getFinalKeyframe(keyframes, { repeat, repeatType = "loop" }, finalKeyframe) {
	const resolvedKeyframes = keyframes.filter(isNotNull);
	const index = repeat && repeatType !== "loop" && repeat % 2 === 1 ? 0 : resolvedKeyframes.length - 1;
	return !index || finalKeyframe === void 0 ? resolvedKeyframes[index] : finalKeyframe;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/animation/animators/BaseAnimation.mjs
/**
* Maximum time allowed between an animation being created and it being
* resolved for us to use the latter as the start time.
*
* This is to ensure that while we prefer to "start" an animation as soon
* as it's triggered, we also want to avoid a visual jump if there's a big delay
* between these two moments.
*/
var MAX_RESOLVE_DELAY = 40;
var BaseAnimation = class {
	constructor({ autoplay = true, delay = 0, type = "keyframes", repeat = 0, repeatDelay = 0, repeatType = "loop", ...options }) {
		this.isStopped = false;
		this.hasAttemptedResolve = false;
		this.createdAt = time.now();
		this.options = {
			autoplay,
			delay,
			type,
			repeat,
			repeatDelay,
			repeatType,
			...options
		};
		this.updateFinishedPromise();
	}
	/**
	* This method uses the createdAt and resolvedAt to calculate the
	* animation startTime. *Ideally*, we would use the createdAt time as t=0
	* as the following frame would then be the first frame of the animation in
	* progress, which would feel snappier.
	*
	* However, if there's a delay (main thread work) between the creation of
	* the animation and the first commited frame, we prefer to use resolvedAt
	* to avoid a sudden jump into the animation.
	*/
	calcStartTime() {
		if (!this.resolvedAt) return this.createdAt;
		return this.resolvedAt - this.createdAt > MAX_RESOLVE_DELAY ? this.resolvedAt : this.createdAt;
	}
	/**
	* A getter for resolved data. If keyframes are not yet resolved, accessing
	* this.resolved will synchronously flush all pending keyframe resolvers.
	* This is a deoptimisation, but at its worst still batches read/writes.
	*/
	get resolved() {
		if (!this._resolved && !this.hasAttemptedResolve) flushKeyframeResolvers();
		return this._resolved;
	}
	/**
	* A method to be called when the keyframes resolver completes. This method
	* will check if its possible to run the animation and, if not, skip it.
	* Otherwise, it will call initPlayback on the implementing class.
	*/
	onKeyframesResolved(keyframes, finalKeyframe) {
		this.resolvedAt = time.now();
		this.hasAttemptedResolve = true;
		const { name, type, velocity, delay, onComplete, onUpdate, isGenerator } = this.options;
		/**
		* If we can't animate this value with the resolved keyframes
		* then we should complete it immediately.
		*/
		if (!isGenerator && !canAnimate(keyframes, name, type, velocity)) if (instantAnimationState.current || !delay) {
			onUpdate && onUpdate(getFinalKeyframe(keyframes, this.options, finalKeyframe));
			onComplete && onComplete();
			this.resolveFinishedPromise();
			return;
		} else this.options.duration = 0;
		const resolvedAnimation = this.initPlayback(keyframes, finalKeyframe);
		if (resolvedAnimation === false) return;
		this._resolved = {
			keyframes,
			finalKeyframe,
			...resolvedAnimation
		};
		this.onPostResolved();
	}
	onPostResolved() {}
	/**
	* Allows the returned animation to be awaited or promise-chained. Currently
	* resolves when the animation finishes at all but in a future update could/should
	* reject if its cancels.
	*/
	then(resolve, reject) {
		return this.currentFinishedPromise.then(resolve, reject);
	}
	flatten() {
		this.options.type = "keyframes";
		this.options.ease = "linear";
	}
	updateFinishedPromise() {
		this.currentFinishedPromise = new Promise((resolve) => {
			this.resolveFinishedPromise = resolve;
		});
	}
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/utils/mix/number.mjs
var mixNumber$1 = (from, to, progress) => {
	return from + (to - from) * progress;
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/utils/hsla-to-rgba.mjs
function hueToRgb(p, q, t) {
	if (t < 0) t += 1;
	if (t > 1) t -= 1;
	if (t < 1 / 6) return p + (q - p) * 6 * t;
	if (t < 1 / 2) return q;
	if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
	return p;
}
function hslaToRgba({ hue, saturation, lightness, alpha }) {
	hue /= 360;
	saturation /= 100;
	lightness /= 100;
	let red = 0;
	let green = 0;
	let blue = 0;
	if (!saturation) red = green = blue = lightness;
	else {
		const q = lightness < .5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
		const p = 2 * lightness - q;
		red = hueToRgb(p, q, hue + 1 / 3);
		green = hueToRgb(p, q, hue);
		blue = hueToRgb(p, q, hue - 1 / 3);
	}
	return {
		red: Math.round(red * 255),
		green: Math.round(green * 255),
		blue: Math.round(blue * 255),
		alpha
	};
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/utils/mix/immediate.mjs
function mixImmediate(a, b) {
	return (p) => p > 0 ? b : a;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/utils/mix/color.mjs
var mixLinearColor = (from, to, v) => {
	const fromExpo = from * from;
	const expo = v * (to * to - fromExpo) + fromExpo;
	return expo < 0 ? 0 : Math.sqrt(expo);
};
var colorTypes = [
	hex,
	rgba,
	hsla
];
var getColorType = (v) => colorTypes.find((type) => type.test(v));
function asRGBA(color) {
	const type = getColorType(color);
	warning(Boolean(type), `'${color}' is not an animatable color. Use the equivalent color code instead.`);
	if (!Boolean(type)) return false;
	let model = type.parse(color);
	if (type === hsla) model = hslaToRgba(model);
	return model;
}
var mixColor = (from, to) => {
	const fromRGBA = asRGBA(from);
	const toRGBA = asRGBA(to);
	if (!fromRGBA || !toRGBA) return mixImmediate(from, to);
	const blended = { ...fromRGBA };
	return (v) => {
		blended.red = mixLinearColor(fromRGBA.red, toRGBA.red, v);
		blended.green = mixLinearColor(fromRGBA.green, toRGBA.green, v);
		blended.blue = mixLinearColor(fromRGBA.blue, toRGBA.blue, v);
		blended.alpha = mixNumber$1(fromRGBA.alpha, toRGBA.alpha, v);
		return rgba.transform(blended);
	};
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/utils/pipe.mjs
/**
* Pipe
* Compose other transformers to run linearily
* pipe(min(20), max(40))
* @param  {...functions} transformers
* @return {function}
*/
var combineFunctions = (a, b) => (v) => b(a(v));
var pipe = (...transformers) => transformers.reduce(combineFunctions);
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/utils/mix/visibility.mjs
var invisibleValues = /* @__PURE__ */ new Set(["none", "hidden"]);
/**
* Returns a function that, when provided a progress value between 0 and 1,
* will return the "none" or "hidden" string only when the progress is that of
* the origin or target.
*/
function mixVisibility(origin, target) {
	if (invisibleValues.has(origin)) return (p) => p <= 0 ? origin : target;
	else return (p) => p >= 1 ? target : origin;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/utils/mix/complex.mjs
function mixNumber(a, b) {
	return (p) => mixNumber$1(a, b, p);
}
function getMixer(a) {
	if (typeof a === "number") return mixNumber;
	else if (typeof a === "string") return isCSSVariableToken(a) ? mixImmediate : color.test(a) ? mixColor : mixComplex;
	else if (Array.isArray(a)) return mixArray;
	else if (typeof a === "object") return color.test(a) ? mixColor : mixObject;
	return mixImmediate;
}
function mixArray(a, b) {
	const output = [...a];
	const numValues = output.length;
	const blendValue = a.map((v, i) => getMixer(v)(v, b[i]));
	return (p) => {
		for (let i = 0; i < numValues; i++) output[i] = blendValue[i](p);
		return output;
	};
}
function mixObject(a, b) {
	const output = {
		...a,
		...b
	};
	const blendValue = {};
	for (const key in output) if (a[key] !== void 0 && b[key] !== void 0) blendValue[key] = getMixer(a[key])(a[key], b[key]);
	return (v) => {
		for (const key in blendValue) output[key] = blendValue[key](v);
		return output;
	};
}
function matchOrder(origin, target) {
	var _a;
	const orderedOrigin = [];
	const pointers = {
		color: 0,
		var: 0,
		number: 0
	};
	for (let i = 0; i < target.values.length; i++) {
		const type = target.types[i];
		const originIndex = origin.indexes[type][pointers[type]];
		orderedOrigin[i] = (_a = origin.values[originIndex]) !== null && _a !== void 0 ? _a : 0;
		pointers[type]++;
	}
	return orderedOrigin;
}
var mixComplex = (origin, target) => {
	const template = complex.createTransformer(target);
	const originStats = analyseComplexValue(origin);
	const targetStats = analyseComplexValue(target);
	if (originStats.indexes.var.length === targetStats.indexes.var.length && originStats.indexes.color.length === targetStats.indexes.color.length && originStats.indexes.number.length >= targetStats.indexes.number.length) {
		if (invisibleValues.has(origin) && !targetStats.values.length || invisibleValues.has(target) && !originStats.values.length) return mixVisibility(origin, target);
		return pipe(mixArray(matchOrder(originStats, targetStats), targetStats.values), template);
	} else {
		warning(true, `Complex values '${origin}' and '${target}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`);
		return mixImmediate(origin, target);
	}
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/utils/mix/index.mjs
function mix(from, to, p) {
	if (typeof from === "number" && typeof to === "number" && typeof p === "number") return mixNumber$1(from, to, p);
	return getMixer(from)(from, to);
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/animation/generators/utils/velocity.mjs
var velocitySampleDuration = 5;
function calcGeneratorVelocity(resolveValue, t, current) {
	const prevT = Math.max(t - velocitySampleDuration, 0);
	return velocityPerSecond(current - resolveValue(prevT), t - prevT);
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/animation/generators/spring/defaults.mjs
var springDefaults = {
	stiffness: 100,
	damping: 10,
	mass: 1,
	velocity: 0,
	duration: 800,
	bounce: .3,
	visualDuration: .3,
	restSpeed: {
		granular: .01,
		default: 2
	},
	restDelta: {
		granular: .005,
		default: .5
	},
	minDuration: .01,
	maxDuration: 10,
	minDamping: .05,
	maxDamping: 1
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/animation/generators/spring/find.mjs
var safeMin = .001;
function findSpring({ duration = springDefaults.duration, bounce = springDefaults.bounce, velocity = springDefaults.velocity, mass = springDefaults.mass }) {
	let envelope;
	let derivative;
	warning(duration <= /* @__PURE__ */ secondsToMilliseconds(springDefaults.maxDuration), "Spring duration must be 10 seconds or less");
	let dampingRatio = 1 - bounce;
	/**
	* Restrict dampingRatio and duration to within acceptable ranges.
	*/
	dampingRatio = clamp(springDefaults.minDamping, springDefaults.maxDamping, dampingRatio);
	duration = clamp(springDefaults.minDuration, springDefaults.maxDuration, /* @__PURE__ */ millisecondsToSeconds(duration));
	if (dampingRatio < 1) {
		/**
		* Underdamped spring
		*/
		envelope = (undampedFreq) => {
			const exponentialDecay = undampedFreq * dampingRatio;
			const delta = exponentialDecay * duration;
			const a = exponentialDecay - velocity;
			const b = calcAngularFreq(undampedFreq, dampingRatio);
			const c = Math.exp(-delta);
			return safeMin - a / b * c;
		};
		derivative = (undampedFreq) => {
			const delta = undampedFreq * dampingRatio * duration;
			const d = delta * velocity + velocity;
			const e = Math.pow(dampingRatio, 2) * Math.pow(undampedFreq, 2) * duration;
			const f = Math.exp(-delta);
			const g = calcAngularFreq(Math.pow(undampedFreq, 2), dampingRatio);
			return (-envelope(undampedFreq) + safeMin > 0 ? -1 : 1) * ((d - e) * f) / g;
		};
	} else {
		/**
		* Critically-damped spring
		*/
		envelope = (undampedFreq) => {
			return -.001 + Math.exp(-undampedFreq * duration) * ((undampedFreq - velocity) * duration + 1);
		};
		derivative = (undampedFreq) => {
			return Math.exp(-undampedFreq * duration) * ((velocity - undampedFreq) * (duration * duration));
		};
	}
	const initialGuess = 5 / duration;
	const undampedFreq = approximateRoot(envelope, derivative, initialGuess);
	duration = /* @__PURE__ */ secondsToMilliseconds(duration);
	if (isNaN(undampedFreq)) return {
		stiffness: springDefaults.stiffness,
		damping: springDefaults.damping,
		duration
	};
	else {
		const stiffness = Math.pow(undampedFreq, 2) * mass;
		return {
			stiffness,
			damping: dampingRatio * 2 * Math.sqrt(mass * stiffness),
			duration
		};
	}
}
var rootIterations = 12;
function approximateRoot(envelope, derivative, initialGuess) {
	let result = initialGuess;
	for (let i = 1; i < rootIterations; i++) result = result - envelope(result) / derivative(result);
	return result;
}
function calcAngularFreq(undampedFreq, dampingRatio) {
	return undampedFreq * Math.sqrt(1 - dampingRatio * dampingRatio);
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/animation/generators/spring/index.mjs
var durationKeys = ["duration", "bounce"];
var physicsKeys = [
	"stiffness",
	"damping",
	"mass"
];
function isSpringType(options, keys) {
	return keys.some((key) => options[key] !== void 0);
}
function getSpringOptions(options) {
	let springOptions = {
		velocity: springDefaults.velocity,
		stiffness: springDefaults.stiffness,
		damping: springDefaults.damping,
		mass: springDefaults.mass,
		isResolvedFromDuration: false,
		...options
	};
	if (!isSpringType(options, physicsKeys) && isSpringType(options, durationKeys)) if (options.visualDuration) {
		const visualDuration = options.visualDuration;
		const root = 2 * Math.PI / (visualDuration * 1.2);
		const stiffness = root * root;
		const damping = 2 * clamp(.05, 1, 1 - (options.bounce || 0)) * Math.sqrt(stiffness);
		springOptions = {
			...springOptions,
			mass: springDefaults.mass,
			stiffness,
			damping
		};
	} else {
		const derived = findSpring(options);
		springOptions = {
			...springOptions,
			...derived,
			mass: springDefaults.mass
		};
		springOptions.isResolvedFromDuration = true;
	}
	return springOptions;
}
function spring(optionsOrVisualDuration = springDefaults.visualDuration, bounce = springDefaults.bounce) {
	const options = typeof optionsOrVisualDuration !== "object" ? {
		visualDuration: optionsOrVisualDuration,
		keyframes: [0, 1],
		bounce
	} : optionsOrVisualDuration;
	let { restSpeed, restDelta } = options;
	const origin = options.keyframes[0];
	const target = options.keyframes[options.keyframes.length - 1];
	/**
	* This is the Iterator-spec return value. We ensure it's mutable rather than using a generator
	* to reduce GC during animation.
	*/
	const state = {
		done: false,
		value: origin
	};
	const { stiffness, damping, mass, duration, velocity, isResolvedFromDuration } = getSpringOptions({
		...options,
		velocity: -/* @__PURE__ */ millisecondsToSeconds(options.velocity || 0)
	});
	const initialVelocity = velocity || 0;
	const dampingRatio = damping / (2 * Math.sqrt(stiffness * mass));
	const initialDelta = target - origin;
	const undampedAngularFreq = /* @__PURE__ */ millisecondsToSeconds(Math.sqrt(stiffness / mass));
	/**
	* If we're working on a granular scale, use smaller defaults for determining
	* when the spring is finished.
	*
	* These defaults have been selected emprically based on what strikes a good
	* ratio between feeling good and finishing as soon as changes are imperceptible.
	*/
	const isGranularScale = Math.abs(initialDelta) < 5;
	restSpeed || (restSpeed = isGranularScale ? springDefaults.restSpeed.granular : springDefaults.restSpeed.default);
	restDelta || (restDelta = isGranularScale ? springDefaults.restDelta.granular : springDefaults.restDelta.default);
	let resolveSpring;
	if (dampingRatio < 1) {
		const angularFreq = calcAngularFreq(undampedAngularFreq, dampingRatio);
		resolveSpring = (t) => {
			const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
			return target - envelope * ((initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) / angularFreq * Math.sin(angularFreq * t) + initialDelta * Math.cos(angularFreq * t));
		};
	} else if (dampingRatio === 1) resolveSpring = (t) => target - Math.exp(-undampedAngularFreq * t) * (initialDelta + (initialVelocity + undampedAngularFreq * initialDelta) * t);
	else {
		const dampedAngularFreq = undampedAngularFreq * Math.sqrt(dampingRatio * dampingRatio - 1);
		resolveSpring = (t) => {
			const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
			const freqForT = Math.min(dampedAngularFreq * t, 300);
			return target - envelope * ((initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) * Math.sinh(freqForT) + dampedAngularFreq * initialDelta * Math.cosh(freqForT)) / dampedAngularFreq;
		};
	}
	const generator = {
		calculatedDuration: isResolvedFromDuration ? duration || null : null,
		next: (t) => {
			const current = resolveSpring(t);
			if (!isResolvedFromDuration) {
				let currentVelocity = 0;
				/**
				* We only need to calculate velocity for under-damped springs
				* as over- and critically-damped springs can't overshoot, so
				* checking only for displacement is enough.
				*/
				if (dampingRatio < 1) currentVelocity = t === 0 ? /* @__PURE__ */ secondsToMilliseconds(initialVelocity) : calcGeneratorVelocity(resolveSpring, t, current);
				const isBelowVelocityThreshold = Math.abs(currentVelocity) <= restSpeed;
				const isBelowDisplacementThreshold = Math.abs(target - current) <= restDelta;
				state.done = isBelowVelocityThreshold && isBelowDisplacementThreshold;
			} else state.done = t >= duration;
			state.value = state.done ? target : current;
			return state;
		},
		toString: () => {
			const calculatedDuration = Math.min(calcGeneratorDuration(generator), maxGeneratorDuration);
			const easing = generateLinearEasing((progress) => generator.next(calculatedDuration * progress).value, calculatedDuration, 30);
			return calculatedDuration + "ms " + easing;
		}
	};
	return generator;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/animation/generators/inertia.mjs
function inertia({ keyframes, velocity = 0, power = .8, timeConstant = 325, bounceDamping = 10, bounceStiffness = 500, modifyTarget, min, max, restDelta = .5, restSpeed }) {
	const origin = keyframes[0];
	const state = {
		done: false,
		value: origin
	};
	const isOutOfBounds = (v) => min !== void 0 && v < min || max !== void 0 && v > max;
	const nearestBoundary = (v) => {
		if (min === void 0) return max;
		if (max === void 0) return min;
		return Math.abs(min - v) < Math.abs(max - v) ? min : max;
	};
	let amplitude = power * velocity;
	const ideal = origin + amplitude;
	const target = modifyTarget === void 0 ? ideal : modifyTarget(ideal);
	/**
	* If the target has changed we need to re-calculate the amplitude, otherwise
	* the animation will start from the wrong position.
	*/
	if (target !== ideal) amplitude = target - origin;
	const calcDelta = (t) => -amplitude * Math.exp(-t / timeConstant);
	const calcLatest = (t) => target + calcDelta(t);
	const applyFriction = (t) => {
		const delta = calcDelta(t);
		const latest = calcLatest(t);
		state.done = Math.abs(delta) <= restDelta;
		state.value = state.done ? target : latest;
	};
	/**
	* Ideally this would resolve for t in a stateless way, we could
	* do that by always precalculating the animation but as we know
	* this will be done anyway we can assume that spring will
	* be discovered during that.
	*/
	let timeReachedBoundary;
	let spring$1;
	const checkCatchBoundary = (t) => {
		if (!isOutOfBounds(state.value)) return;
		timeReachedBoundary = t;
		spring$1 = spring({
			keyframes: [state.value, nearestBoundary(state.value)],
			velocity: calcGeneratorVelocity(calcLatest, t, state.value),
			damping: bounceDamping,
			stiffness: bounceStiffness,
			restDelta,
			restSpeed
		});
	};
	checkCatchBoundary(0);
	return {
		calculatedDuration: null,
		next: (t) => {
			/**
			* We need to resolve the friction to figure out if we need a
			* spring but we don't want to do this twice per frame. So here
			* we flag if we updated for this frame and later if we did
			* we can skip doing it again.
			*/
			let hasUpdatedFrame = false;
			if (!spring$1 && timeReachedBoundary === void 0) {
				hasUpdatedFrame = true;
				applyFriction(t);
				checkCatchBoundary(t);
			}
			/**
			* If we have a spring and the provided t is beyond the moment the friction
			* animation crossed the min/max boundary, use the spring.
			*/
			if (timeReachedBoundary !== void 0 && t >= timeReachedBoundary) return spring$1.next(t - timeReachedBoundary);
			else {
				!hasUpdatedFrame && applyFriction(t);
				return state;
			}
		}
	};
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/easing/ease.mjs
var easeIn = /*@__PURE__*/ cubicBezier(.42, 0, 1, 1);
var easeOut = /*@__PURE__*/ cubicBezier(0, 0, .58, 1);
var easeInOut = /*@__PURE__*/ cubicBezier(.42, 0, .58, 1);
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/easing/utils/is-easing-array.mjs
var isEasingArray = (ease) => {
	return Array.isArray(ease) && typeof ease[0] !== "number";
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/easing/utils/map.mjs
var easingLookup = {
	linear: noop,
	easeIn,
	easeInOut,
	easeOut,
	circIn,
	circInOut,
	circOut,
	backIn,
	backInOut,
	backOut,
	anticipate
};
var easingDefinitionToFunction = (definition) => {
	if (isBezierDefinition(definition)) {
		invariant(definition.length === 4, `Cubic bezier arrays must contain four numerical values.`);
		const [x1, y1, x2, y2] = definition;
		return cubicBezier(x1, y1, x2, y2);
	} else if (typeof definition === "string") {
		invariant(easingLookup[definition] !== void 0, `Invalid easing type '${definition}'`);
		return easingLookup[definition];
	}
	return definition;
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/utils/interpolate.mjs
function createMixers(output, ease, customMixer) {
	const mixers = [];
	const mixerFactory = customMixer || mix;
	const numMixers = output.length - 1;
	for (let i = 0; i < numMixers; i++) {
		let mixer = mixerFactory(output[i], output[i + 1]);
		if (ease) mixer = pipe(Array.isArray(ease) ? ease[i] || noop : ease, mixer);
		mixers.push(mixer);
	}
	return mixers;
}
/**
* Create a function that maps from a numerical input array to a generic output array.
*
* Accepts:
*   - Numbers
*   - Colors (hex, hsl, hsla, rgb, rgba)
*   - Complex (combinations of one or more numbers or strings)
*
* ```jsx
* const mixColor = interpolate([0, 1], ['#fff', '#000'])
*
* mixColor(0.5) // 'rgba(128, 128, 128, 1)'
* ```
*
* TODO Revist this approach once we've moved to data models for values,
* probably not needed to pregenerate mixer functions.
*
* @public
*/
function interpolate(input, output, { clamp: isClamp = true, ease, mixer } = {}) {
	const inputLength = input.length;
	invariant(inputLength === output.length, "Both input and output ranges must be the same length");
	/**
	* If we're only provided a single input, we can just make a function
	* that returns the output.
	*/
	if (inputLength === 1) return () => output[0];
	if (inputLength === 2 && output[0] === output[1]) return () => output[1];
	const isZeroDeltaRange = input[0] === input[1];
	if (input[0] > input[inputLength - 1]) {
		input = [...input].reverse();
		output = [...output].reverse();
	}
	const mixers = createMixers(output, ease, mixer);
	const numMixers = mixers.length;
	const interpolator = (v) => {
		if (isZeroDeltaRange && v < input[0]) return output[0];
		let i = 0;
		if (numMixers > 1) {
			for (; i < input.length - 2; i++) if (v < input[i + 1]) break;
		}
		const progressInRange = /* @__PURE__ */ progress(input[i], input[i + 1], v);
		return mixers[i](progressInRange);
	};
	return isClamp ? (v) => interpolator(clamp(input[0], input[inputLength - 1], v)) : interpolator;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/utils/offsets/fill.mjs
function fillOffset(offset, remaining) {
	const min = offset[offset.length - 1];
	for (let i = 1; i <= remaining; i++) {
		const offsetProgress = /* @__PURE__ */ progress(0, remaining, i);
		offset.push(mixNumber$1(min, 1, offsetProgress));
	}
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/utils/offsets/default.mjs
function defaultOffset(arr) {
	const offset = [0];
	fillOffset(offset, arr.length - 1);
	return offset;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/utils/offsets/time.mjs
function convertOffsetToTimes(offset, duration) {
	return offset.map((o) => o * duration);
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/animation/generators/keyframes.mjs
function defaultEasing(values, easing) {
	return values.map(() => easing || easeInOut).splice(0, values.length - 1);
}
function keyframes({ duration = 300, keyframes: keyframeValues, times, ease = "easeInOut" }) {
	/**
	* Easing functions can be externally defined as strings. Here we convert them
	* into actual functions.
	*/
	const easingFunctions = isEasingArray(ease) ? ease.map(easingDefinitionToFunction) : easingDefinitionToFunction(ease);
	/**
	* This is the Iterator-spec return value. We ensure it's mutable rather than using a generator
	* to reduce GC during animation.
	*/
	const state = {
		done: false,
		value: keyframeValues[0]
	};
	const mapTimeToKeyframe = interpolate(convertOffsetToTimes(times && times.length === keyframeValues.length ? times : defaultOffset(keyframeValues), duration), keyframeValues, { ease: Array.isArray(easingFunctions) ? easingFunctions : defaultEasing(keyframeValues, easingFunctions) });
	return {
		calculatedDuration: duration,
		next: (t) => {
			state.value = mapTimeToKeyframe(t);
			state.done = t >= duration;
			return state;
		}
	};
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/animation/animators/drivers/driver-frameloop.mjs
var frameloopDriver = (update) => {
	const passTimestamp = ({ timestamp }) => update(timestamp);
	return {
		start: () => frame.update(passTimestamp, true),
		stop: () => cancelFrame(passTimestamp),
		/**
		* If we're processing this frame we can use the
		* framelocked timestamp to keep things in sync.
		*/
		now: () => frameData.isProcessing ? frameData.timestamp : time.now()
	};
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/animation/animators/MainThreadAnimation.mjs
var generators = {
	decay: inertia,
	inertia,
	tween: keyframes,
	keyframes,
	spring
};
var percentToProgress = (percent) => percent / 100;
/**
* Animation that runs on the main thread. Designed to be WAAPI-spec in the subset of
* features we expose publically. Mostly the compatibility is to ensure visual identity
* between both WAAPI and main thread animations.
*/
var MainThreadAnimation = class extends BaseAnimation {
	constructor(options) {
		super(options);
		/**
		* The time at which the animation was paused.
		*/
		this.holdTime = null;
		/**
		* The time at which the animation was cancelled.
		*/
		this.cancelTime = null;
		/**
		* The current time of the animation.
		*/
		this.currentTime = 0;
		/**
		* Playback speed as a factor. 0 would be stopped, -1 reverse and 2 double speed.
		*/
		this.playbackSpeed = 1;
		/**
		* The state of the animation to apply when the animation is resolved. This
		* allows calls to the public API to control the animation before it is resolved,
		* without us having to resolve it first.
		*/
		this.pendingPlayState = "running";
		/**
		* The time at which the animation was started.
		*/
		this.startTime = null;
		this.state = "idle";
		/**
		* This method is bound to the instance to fix a pattern where
		* animation.stop is returned as a reference from a useEffect.
		*/
		this.stop = () => {
			this.resolver.cancel();
			this.isStopped = true;
			if (this.state === "idle") return;
			this.teardown();
			const { onStop } = this.options;
			onStop && onStop();
		};
		const { name, motionValue, element, keyframes } = this.options;
		const KeyframeResolver$1 = (element === null || element === void 0 ? void 0 : element.KeyframeResolver) || KeyframeResolver;
		const onResolved = (resolvedKeyframes, finalKeyframe) => this.onKeyframesResolved(resolvedKeyframes, finalKeyframe);
		this.resolver = new KeyframeResolver$1(keyframes, onResolved, name, motionValue, element);
		this.resolver.scheduleResolve();
	}
	flatten() {
		super.flatten();
		if (this._resolved) Object.assign(this._resolved, this.initPlayback(this._resolved.keyframes));
	}
	initPlayback(keyframes$1) {
		const { type = "keyframes", repeat = 0, repeatDelay = 0, repeatType, velocity = 0 } = this.options;
		const generatorFactory = isGenerator(type) ? type : generators[type] || keyframes;
		/**
		* If our generator doesn't support mixing numbers, we need to replace keyframes with
		* [0, 100] and then make a function that maps that to the actual keyframes.
		*
		* 100 is chosen instead of 1 as it works nicer with spring animations.
		*/
		let mapPercentToKeyframes;
		let mirroredGenerator;
		if (generatorFactory !== keyframes && typeof keyframes$1[0] !== "number") {
			invariant(keyframes$1.length === 2, `Only two keyframes currently supported with spring and inertia animations. Trying to animate ${keyframes$1}`);
			mapPercentToKeyframes = pipe(percentToProgress, mix(keyframes$1[0], keyframes$1[1]));
			keyframes$1 = [0, 100];
		}
		const generator = generatorFactory({
			...this.options,
			keyframes: keyframes$1
		});
		/**
		* If we have a mirror repeat type we need to create a second generator that outputs the
		* mirrored (not reversed) animation and later ping pong between the two generators.
		*/
		if (repeatType === "mirror") mirroredGenerator = generatorFactory({
			...this.options,
			keyframes: [...keyframes$1].reverse(),
			velocity: -velocity
		});
		/**
		* If duration is undefined and we have repeat options,
		* we need to calculate a duration from the generator.
		*
		* We set it to the generator itself to cache the duration.
		* Any timeline resolver will need to have already precalculated
		* the duration by this step.
		*/
		if (generator.calculatedDuration === null) generator.calculatedDuration = calcGeneratorDuration(generator);
		const { calculatedDuration } = generator;
		const resolvedDuration = calculatedDuration + repeatDelay;
		const totalDuration = resolvedDuration * (repeat + 1) - repeatDelay;
		return {
			generator,
			mirroredGenerator,
			mapPercentToKeyframes,
			calculatedDuration,
			resolvedDuration,
			totalDuration
		};
	}
	onPostResolved() {
		const { autoplay = true } = this.options;
		this.play();
		if (this.pendingPlayState === "paused" || !autoplay) this.pause();
		else this.state = this.pendingPlayState;
	}
	tick(timestamp, sample = false) {
		const { resolved } = this;
		if (!resolved) {
			const { keyframes } = this.options;
			return {
				done: true,
				value: keyframes[keyframes.length - 1]
			};
		}
		const { finalKeyframe, generator, mirroredGenerator, mapPercentToKeyframes, keyframes, calculatedDuration, totalDuration, resolvedDuration } = resolved;
		if (this.startTime === null) return generator.next(0);
		const { delay, repeat, repeatType, repeatDelay, onUpdate } = this.options;
		/**
		* requestAnimationFrame timestamps can come through as lower than
		* the startTime as set by performance.now(). Here we prevent this,
		* though in the future it could be possible to make setting startTime
		* a pending operation that gets resolved here.
		*/
		if (this.speed > 0) this.startTime = Math.min(this.startTime, timestamp);
		else if (this.speed < 0) this.startTime = Math.min(timestamp - totalDuration / this.speed, this.startTime);
		if (sample) this.currentTime = timestamp;
		else if (this.holdTime !== null) this.currentTime = this.holdTime;
		else this.currentTime = Math.round(timestamp - this.startTime) * this.speed;
		const timeWithoutDelay = this.currentTime - delay * (this.speed >= 0 ? 1 : -1);
		const isInDelayPhase = this.speed >= 0 ? timeWithoutDelay < 0 : timeWithoutDelay > totalDuration;
		this.currentTime = Math.max(timeWithoutDelay, 0);
		if (this.state === "finished" && this.holdTime === null) this.currentTime = totalDuration;
		let elapsed = this.currentTime;
		let frameGenerator = generator;
		if (repeat) {
			/**
			* Get the current progress (0-1) of the animation. If t is >
			* than duration we'll get values like 2.5 (midway through the
			* third iteration)
			*/
			const progress = Math.min(this.currentTime, totalDuration) / resolvedDuration;
			/**
			* Get the current iteration (0 indexed). For instance the floor of
			* 2.5 is 2.
			*/
			let currentIteration = Math.floor(progress);
			/**
			* Get the current progress of the iteration by taking the remainder
			* so 2.5 is 0.5 through iteration 2
			*/
			let iterationProgress = progress % 1;
			/**
			* If iteration progress is 1 we count that as the end
			* of the previous iteration.
			*/
			if (!iterationProgress && progress >= 1) iterationProgress = 1;
			iterationProgress === 1 && currentIteration--;
			currentIteration = Math.min(currentIteration, repeat + 1);
			if (Boolean(currentIteration % 2)) {
				if (repeatType === "reverse") {
					iterationProgress = 1 - iterationProgress;
					if (repeatDelay) iterationProgress -= repeatDelay / resolvedDuration;
				} else if (repeatType === "mirror") frameGenerator = mirroredGenerator;
			}
			elapsed = clamp(0, 1, iterationProgress) * resolvedDuration;
		}
		/**
		* If we're in negative time, set state as the initial keyframe.
		* This prevents delay: x, duration: 0 animations from finishing
		* instantly.
		*/
		const state = isInDelayPhase ? {
			done: false,
			value: keyframes[0]
		} : frameGenerator.next(elapsed);
		if (mapPercentToKeyframes) state.value = mapPercentToKeyframes(state.value);
		let { done } = state;
		if (!isInDelayPhase && calculatedDuration !== null) done = this.speed >= 0 ? this.currentTime >= totalDuration : this.currentTime <= 0;
		const isAnimationFinished = this.holdTime === null && (this.state === "finished" || this.state === "running" && done);
		if (isAnimationFinished && finalKeyframe !== void 0) state.value = getFinalKeyframe(keyframes, this.options, finalKeyframe);
		if (onUpdate) onUpdate(state.value);
		if (isAnimationFinished) this.finish();
		return state;
	}
	get duration() {
		const { resolved } = this;
		return resolved ? /* @__PURE__ */ millisecondsToSeconds(resolved.calculatedDuration) : 0;
	}
	get time() {
		return /* @__PURE__ */ millisecondsToSeconds(this.currentTime);
	}
	set time(newTime) {
		newTime = /* @__PURE__ */ secondsToMilliseconds(newTime);
		this.currentTime = newTime;
		if (this.holdTime !== null || this.speed === 0) this.holdTime = newTime;
		else if (this.driver) this.startTime = this.driver.now() - newTime / this.speed;
	}
	get speed() {
		return this.playbackSpeed;
	}
	set speed(newSpeed) {
		const hasChanged = this.playbackSpeed !== newSpeed;
		this.playbackSpeed = newSpeed;
		if (hasChanged) this.time = /* @__PURE__ */ millisecondsToSeconds(this.currentTime);
	}
	play() {
		if (!this.resolver.isScheduled) this.resolver.resume();
		if (!this._resolved) {
			this.pendingPlayState = "running";
			return;
		}
		if (this.isStopped) return;
		const { driver = frameloopDriver, onPlay, startTime } = this.options;
		if (!this.driver) this.driver = driver((timestamp) => this.tick(timestamp));
		onPlay && onPlay();
		const now = this.driver.now();
		if (this.holdTime !== null) this.startTime = now - this.holdTime;
		else if (!this.startTime) this.startTime = startTime !== null && startTime !== void 0 ? startTime : this.calcStartTime();
		else if (this.state === "finished") this.startTime = now;
		if (this.state === "finished") this.updateFinishedPromise();
		this.cancelTime = this.startTime;
		this.holdTime = null;
		/**
		* Set playState to running only after we've used it in
		* the previous logic.
		*/
		this.state = "running";
		this.driver.start();
	}
	pause() {
		var _a;
		if (!this._resolved) {
			this.pendingPlayState = "paused";
			return;
		}
		this.state = "paused";
		this.holdTime = (_a = this.currentTime) !== null && _a !== void 0 ? _a : 0;
	}
	complete() {
		if (this.state !== "running") this.play();
		this.pendingPlayState = this.state = "finished";
		this.holdTime = null;
	}
	finish() {
		this.teardown();
		this.state = "finished";
		const { onComplete } = this.options;
		onComplete && onComplete();
	}
	cancel() {
		if (this.cancelTime !== null) this.tick(this.cancelTime);
		this.teardown();
		this.updateFinishedPromise();
	}
	teardown() {
		this.state = "idle";
		this.stopDriver();
		this.resolveFinishedPromise();
		this.updateFinishedPromise();
		this.startTime = this.cancelTime = null;
		this.resolver.cancel();
	}
	stopDriver() {
		if (!this.driver) return;
		this.driver.stop();
		this.driver = void 0;
	}
	sample(time) {
		this.startTime = 0;
		return this.tick(time, true);
	}
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/animation/animators/utils/accelerated-values.mjs
/**
* A list of values that can be hardware-accelerated.
*/
var acceleratedValues = /* @__PURE__ */ new Set([
	"opacity",
	"clipPath",
	"filter",
	"transform"
]);
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/animation/animators/waapi/index.mjs
function startWaapiAnimation(element, valueName, keyframes, { delay = 0, duration = 300, repeat = 0, repeatType = "loop", ease = "easeInOut", times } = {}) {
	const keyframeOptions = { [valueName]: keyframes };
	if (times) keyframeOptions.offset = times;
	const easing = mapEasingToNativeEasing(ease, duration);
	/**
	* If this is an easing array, apply to keyframes, not animation as a whole
	*/
	if (Array.isArray(easing)) keyframeOptions.easing = easing;
	return element.animate(keyframeOptions, {
		delay,
		duration,
		easing: !Array.isArray(easing) ? easing : "linear",
		fill: "both",
		iterations: repeat + 1,
		direction: repeatType === "reverse" ? "alternate" : "normal"
	});
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/animation/animators/waapi/utils/supports-waapi.mjs
var supportsWaapi = /*@__PURE__*/ memo(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/animation/animators/AcceleratedAnimation.mjs
/**
* 10ms is chosen here as it strikes a balance between smooth
* results (more than one keyframe per frame at 60fps) and
* keyframe quantity.
*/
var sampleDelta = 10;
/**
* Implement a practical max duration for keyframe generation
* to prevent infinite loops
*/
var maxDuration = 2e4;
/**
* Check if an animation can run natively via WAAPI or requires pregenerated keyframes.
* WAAPI doesn't support spring or function easings so we run these as JS animation before
* handing off.
*/
function requiresPregeneratedKeyframes(options) {
	return isGenerator(options.type) || options.type === "spring" || !isWaapiSupportedEasing(options.ease);
}
function pregenerateKeyframes(keyframes, options) {
	/**
	* Create a main-thread animation to pregenerate keyframes.
	* We sample this at regular intervals to generate keyframes that we then
	* linearly interpolate between.
	*/
	const sampleAnimation = new MainThreadAnimation({
		...options,
		keyframes,
		repeat: 0,
		delay: 0,
		isGenerator: true
	});
	let state = {
		done: false,
		value: keyframes[0]
	};
	const pregeneratedKeyframes = [];
	/**
	* Bail after 20 seconds of pre-generated keyframes as it's likely
	* we're heading for an infinite loop.
	*/
	let t = 0;
	while (!state.done && t < maxDuration) {
		state = sampleAnimation.sample(t);
		pregeneratedKeyframes.push(state.value);
		t += sampleDelta;
	}
	return {
		times: void 0,
		keyframes: pregeneratedKeyframes,
		duration: t - sampleDelta,
		ease: "linear"
	};
}
var unsupportedEasingFunctions = {
	anticipate,
	backInOut,
	circInOut
};
function isUnsupportedEase(key) {
	return key in unsupportedEasingFunctions;
}
var AcceleratedAnimation = class extends BaseAnimation {
	constructor(options) {
		super(options);
		const { name, motionValue, element, keyframes } = this.options;
		this.resolver = new DOMKeyframesResolver(keyframes, (resolvedKeyframes, finalKeyframe) => this.onKeyframesResolved(resolvedKeyframes, finalKeyframe), name, motionValue, element);
		this.resolver.scheduleResolve();
	}
	initPlayback(keyframes, finalKeyframe) {
		let { duration = 300, times, ease, type, motionValue, name, startTime } = this.options;
		/**
		* If element has since been unmounted, return false to indicate
		* the animation failed to initialised.
		*/
		if (!motionValue.owner || !motionValue.owner.current) return false;
		/**
		* If the user has provided an easing function name that isn't supported
		* by WAAPI (like "anticipate"), we need to provide the corressponding
		* function. This will later get converted to a linear() easing function.
		*/
		if (typeof ease === "string" && supportsLinearEasing() && isUnsupportedEase(ease)) ease = unsupportedEasingFunctions[ease];
		/**
		* If this animation needs pre-generated keyframes then generate.
		*/
		if (requiresPregeneratedKeyframes(this.options)) {
			const { onComplete, onUpdate, motionValue, element, ...options } = this.options;
			const pregeneratedAnimation = pregenerateKeyframes(keyframes, options);
			keyframes = pregeneratedAnimation.keyframes;
			if (keyframes.length === 1) keyframes[1] = keyframes[0];
			duration = pregeneratedAnimation.duration;
			times = pregeneratedAnimation.times;
			ease = pregeneratedAnimation.ease;
			type = "keyframes";
		}
		const animation = startWaapiAnimation(motionValue.owner.current, name, keyframes, {
			...this.options,
			duration,
			times,
			ease
		});
		animation.startTime = startTime !== null && startTime !== void 0 ? startTime : this.calcStartTime();
		if (this.pendingTimeline) {
			attachTimeline(animation, this.pendingTimeline);
			this.pendingTimeline = void 0;
		} else
 /**
		* Prefer the `onfinish` prop as it's more widely supported than
		* the `finished` promise.
		*
		* Here, we synchronously set the provided MotionValue to the end
		* keyframe. If we didn't, when the WAAPI animation is finished it would
		* be removed from the element which would then revert to its old styles.
		*/
		animation.onfinish = () => {
			const { onComplete } = this.options;
			motionValue.set(getFinalKeyframe(keyframes, this.options, finalKeyframe));
			onComplete && onComplete();
			this.cancel();
			this.resolveFinishedPromise();
		};
		return {
			animation,
			duration,
			times,
			type,
			ease,
			keyframes
		};
	}
	get duration() {
		const { resolved } = this;
		if (!resolved) return 0;
		const { duration } = resolved;
		return /* @__PURE__ */ millisecondsToSeconds(duration);
	}
	get time() {
		const { resolved } = this;
		if (!resolved) return 0;
		const { animation } = resolved;
		return /* @__PURE__ */ millisecondsToSeconds(animation.currentTime || 0);
	}
	set time(newTime) {
		const { resolved } = this;
		if (!resolved) return;
		const { animation } = resolved;
		animation.currentTime = /* @__PURE__ */ secondsToMilliseconds(newTime);
	}
	get speed() {
		const { resolved } = this;
		if (!resolved) return 1;
		const { animation } = resolved;
		return animation.playbackRate;
	}
	set speed(newSpeed) {
		const { resolved } = this;
		if (!resolved) return;
		const { animation } = resolved;
		animation.playbackRate = newSpeed;
	}
	get state() {
		const { resolved } = this;
		if (!resolved) return "idle";
		const { animation } = resolved;
		return animation.playState;
	}
	get startTime() {
		const { resolved } = this;
		if (!resolved) return null;
		const { animation } = resolved;
		return animation.startTime;
	}
	/**
	* Replace the default DocumentTimeline with another AnimationTimeline.
	* Currently used for scroll animations.
	*/
	attachTimeline(timeline) {
		if (!this._resolved) this.pendingTimeline = timeline;
		else {
			const { resolved } = this;
			if (!resolved) return noop;
			const { animation } = resolved;
			attachTimeline(animation, timeline);
		}
		return noop;
	}
	play() {
		if (this.isStopped) return;
		const { resolved } = this;
		if (!resolved) return;
		const { animation } = resolved;
		if (animation.playState === "finished") this.updateFinishedPromise();
		animation.play();
	}
	pause() {
		const { resolved } = this;
		if (!resolved) return;
		const { animation } = resolved;
		animation.pause();
	}
	stop() {
		this.resolver.cancel();
		this.isStopped = true;
		if (this.state === "idle") return;
		this.resolveFinishedPromise();
		this.updateFinishedPromise();
		const { resolved } = this;
		if (!resolved) return;
		const { animation, keyframes, duration, type, ease, times } = resolved;
		if (animation.playState === "idle" || animation.playState === "finished") return;
		/**
		* WAAPI doesn't natively have any interruption capabilities.
		*
		* Rather than read commited styles back out of the DOM, we can
		* create a renderless JS animation and sample it twice to calculate
		* its current value, "previous" value, and therefore allow
		* Motion to calculate velocity for any subsequent animation.
		*/
		if (this.time) {
			const { motionValue, onUpdate, onComplete, element, ...options } = this.options;
			const sampleAnimation = new MainThreadAnimation({
				...options,
				keyframes,
				duration,
				type,
				ease,
				times,
				isGenerator: true
			});
			const sampleTime = /* @__PURE__ */ secondsToMilliseconds(this.time);
			motionValue.setWithVelocity(sampleAnimation.sample(sampleTime - sampleDelta).value, sampleAnimation.sample(sampleTime).value, sampleDelta);
		}
		const { onStop } = this.options;
		onStop && onStop();
		this.cancel();
	}
	complete() {
		const { resolved } = this;
		if (!resolved) return;
		resolved.animation.finish();
	}
	cancel() {
		const { resolved } = this;
		if (!resolved) return;
		resolved.animation.cancel();
	}
	static supports(options) {
		const { motionValue, name, repeatDelay, repeatType, damping, type } = options;
		if (!motionValue || !motionValue.owner || !(motionValue.owner.current instanceof HTMLElement)) return false;
		const { onUpdate, transformTemplate } = motionValue.owner.getProps();
		return supportsWaapi() && name && acceleratedValues.has(name) && !onUpdate && !transformTemplate && !repeatDelay && repeatType !== "mirror" && damping !== 0 && type !== "inertia";
	}
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/animation/utils/default-transitions.mjs
var underDampedSpring = {
	type: "spring",
	stiffness: 500,
	damping: 25,
	restSpeed: 10
};
var criticallyDampedSpring = (target) => ({
	type: "spring",
	stiffness: 550,
	damping: target === 0 ? 2 * Math.sqrt(550) : 30,
	restSpeed: 10
});
var keyframesTransition = {
	type: "keyframes",
	duration: .8
};
/**
* Default easing curve is a slightly shallower version of
* the default browser easing curve.
*/
var ease = {
	type: "keyframes",
	ease: [
		.25,
		.1,
		.35,
		1
	],
	duration: .3
};
var getDefaultTransition = (valueKey, { keyframes }) => {
	if (keyframes.length > 2) return keyframesTransition;
	else if (transformProps.has(valueKey)) return valueKey.startsWith("scale") ? criticallyDampedSpring(keyframes[1]) : underDampedSpring;
	return ease;
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/animation/utils/is-transition-defined.mjs
/**
* Decide whether a transition is defined on a given Transition.
* This filters out orchestration options and returns true
* if any options are left.
*/
function isTransitionDefined({ when, delay: _delay, delayChildren, staggerChildren, staggerDirection, repeat, repeatType, repeatDelay, from, elapsed, ...transition }) {
	return !!Object.keys(transition).length;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/animation/interfaces/motion-value.mjs
var animateMotionValue = (name, value, target, transition = {}, element, isHandoff) => (onComplete) => {
	const valueTransition = getValueTransition$1(transition, name) || {};
	/**
	* Most transition values are currently completely overwritten by value-specific
	* transitions. In the future it'd be nicer to blend these transitions. But for now
	* delay actually does inherit from the root transition if not value-specific.
	*/
	const delay = valueTransition.delay || transition.delay || 0;
	/**
	* Elapsed isn't a public transition option but can be passed through from
	* optimized appear effects in milliseconds.
	*/
	let { elapsed = 0 } = transition;
	elapsed = elapsed - /* @__PURE__ */ secondsToMilliseconds(delay);
	let options = {
		keyframes: Array.isArray(target) ? target : [null, target],
		ease: "easeOut",
		velocity: value.getVelocity(),
		...valueTransition,
		delay: -elapsed,
		onUpdate: (v) => {
			value.set(v);
			valueTransition.onUpdate && valueTransition.onUpdate(v);
		},
		onComplete: () => {
			onComplete();
			valueTransition.onComplete && valueTransition.onComplete();
		},
		name,
		motionValue: value,
		element: isHandoff ? void 0 : element
	};
	/**
	* If there's no transition defined for this value, we can generate
	* unqiue transition settings for this value.
	*/
	if (!isTransitionDefined(valueTransition)) options = {
		...options,
		...getDefaultTransition(name, options)
	};
	/**
	* Both WAAPI and our internal animation functions use durations
	* as defined by milliseconds, while our external API defines them
	* as seconds.
	*/
	if (options.duration) options.duration = /* @__PURE__ */ secondsToMilliseconds(options.duration);
	if (options.repeatDelay) options.repeatDelay = /* @__PURE__ */ secondsToMilliseconds(options.repeatDelay);
	if (options.from !== void 0) options.keyframes[0] = options.from;
	let shouldSkip = false;
	if (options.type === false || options.duration === 0 && !options.repeatDelay) {
		options.duration = 0;
		if (options.delay === 0) shouldSkip = true;
	}
	if (instantAnimationState.current || MotionGlobalConfig.skipAnimations) {
		shouldSkip = true;
		options.duration = 0;
		options.delay = 0;
	}
	/**
	* If we can or must skip creating the animation, and apply only
	* the final keyframe, do so. We also check once keyframes are resolved but
	* this early check prevents the need to create an animation at all.
	*/
	if (shouldSkip && !isHandoff && value.get() !== void 0) {
		const finalKeyframe = getFinalKeyframe(options.keyframes, valueTransition);
		if (finalKeyframe !== void 0) {
			frame.update(() => {
				options.onUpdate(finalKeyframe);
				options.onComplete();
			});
			return new GroupPlaybackControls([]);
		}
	}
	/**
	* Animate via WAAPI if possible. If this is a handoff animation, the optimised animation will be running via
	* WAAPI. Therefore, this animation must be JS to ensure it runs "under" the
	* optimised animation.
	*/
	if (!isHandoff && AcceleratedAnimation.supports(options)) return new AcceleratedAnimation(options);
	else return new MainThreadAnimation(options);
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/animation/interfaces/visual-element-target.mjs
/**
* Decide whether we should block this animation. Previously, we achieved this
* just by checking whether the key was listed in protectedKeys, but this
* posed problems if an animation was triggered by afterChildren and protectedKeys
* had been set to true in the meantime.
*/
function shouldBlockAnimation({ protectedKeys, needsAnimating }, key) {
	const shouldBlock = protectedKeys.hasOwnProperty(key) && needsAnimating[key] !== true;
	needsAnimating[key] = false;
	return shouldBlock;
}
function animateTarget(visualElement, targetAndTransition, { delay = 0, transitionOverride, type } = {}) {
	var _a;
	let { transition = visualElement.getDefaultTransition(), transitionEnd, ...target } = targetAndTransition;
	if (transitionOverride) transition = transitionOverride;
	const animations = [];
	const animationTypeState = type && visualElement.animationState && visualElement.animationState.getState()[type];
	for (const key in target) {
		const value = visualElement.getValue(key, (_a = visualElement.latestValues[key]) !== null && _a !== void 0 ? _a : null);
		const valueTarget = target[key];
		if (valueTarget === void 0 || animationTypeState && shouldBlockAnimation(animationTypeState, key)) continue;
		const valueTransition = {
			delay,
			...getValueTransition$1(transition || {}, key)
		};
		/**
		* If this is the first time a value is being animated, check
		* to see if we're handling off from an existing animation.
		*/
		let isHandoff = false;
		if (window.MotionHandoffAnimation) {
			const appearId = getOptimisedAppearId(visualElement);
			if (appearId) {
				const startTime = window.MotionHandoffAnimation(appearId, key, frame);
				if (startTime !== null) {
					valueTransition.startTime = startTime;
					isHandoff = true;
				}
			}
		}
		addValueToWillChange(visualElement, key);
		value.start(animateMotionValue(key, value, valueTarget, visualElement.shouldReduceMotion && positionalKeys.has(key) ? { type: false } : valueTransition, visualElement, isHandoff));
		const animation = value.animation;
		if (animation) animations.push(animation);
	}
	if (transitionEnd) Promise.all(animations).then(() => {
		frame.update(() => {
			transitionEnd && setTarget(visualElement, transitionEnd);
		});
	});
	return animations;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/animation/interfaces/visual-element-variant.mjs
function animateVariant(visualElement, variant, options = {}) {
	var _a;
	const resolved = resolveVariant(visualElement, variant, options.type === "exit" ? (_a = visualElement.presenceContext) === null || _a === void 0 ? void 0 : _a.custom : void 0);
	let { transition = visualElement.getDefaultTransition() || {} } = resolved || {};
	if (options.transitionOverride) transition = options.transitionOverride;
	/**
	* If we have a variant, create a callback that runs it as an animation.
	* Otherwise, we resolve a Promise immediately for a composable no-op.
	*/
	const getAnimation = resolved ? () => Promise.all(animateTarget(visualElement, resolved, options)) : () => Promise.resolve();
	/**
	* If we have children, create a callback that runs all their animations.
	* Otherwise, we resolve a Promise immediately for a composable no-op.
	*/
	const getChildAnimations = visualElement.variantChildren && visualElement.variantChildren.size ? (forwardDelay = 0) => {
		const { delayChildren = 0, staggerChildren, staggerDirection } = transition;
		return animateChildren(visualElement, variant, delayChildren + forwardDelay, staggerChildren, staggerDirection, options);
	} : () => Promise.resolve();
	/**
	* If the transition explicitly defines a "when" option, we need to resolve either
	* this animation or all children animations before playing the other.
	*/
	const { when } = transition;
	if (when) {
		const [first, last] = when === "beforeChildren" ? [getAnimation, getChildAnimations] : [getChildAnimations, getAnimation];
		return first().then(() => last());
	} else return Promise.all([getAnimation(), getChildAnimations(options.delay)]);
}
function animateChildren(visualElement, variant, delayChildren = 0, staggerChildren = 0, staggerDirection = 1, options) {
	const animations = [];
	const maxStaggerDuration = (visualElement.variantChildren.size - 1) * staggerChildren;
	const generateStaggerDuration = staggerDirection === 1 ? (i = 0) => i * staggerChildren : (i = 0) => maxStaggerDuration - i * staggerChildren;
	Array.from(visualElement.variantChildren).sort(sortByTreeOrder).forEach((child, i) => {
		child.notify("AnimationStart", variant);
		animations.push(animateVariant(child, variant, {
			...options,
			delay: delayChildren + generateStaggerDuration(i)
		}).then(() => child.notify("AnimationComplete", variant)));
	});
	return Promise.all(animations);
}
function sortByTreeOrder(a, b) {
	return a.sortNodePosition(b);
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/animation/interfaces/visual-element.mjs
function animateVisualElement(visualElement, definition, options = {}) {
	visualElement.notify("AnimationStart", definition);
	let animation;
	if (Array.isArray(definition)) {
		const animations = definition.map((variant) => animateVariant(visualElement, variant, options));
		animation = Promise.all(animations);
	} else if (typeof definition === "string") animation = animateVariant(visualElement, definition, options);
	else {
		const resolvedDefinition = typeof definition === "function" ? resolveVariant(visualElement, definition, options.custom) : definition;
		animation = Promise.all(animateTarget(visualElement, resolvedDefinition, options));
	}
	return animation.then(() => {
		visualElement.notify("AnimationComplete", definition);
	});
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/utils/get-variant-context.mjs
var numVariantProps = variantProps.length;
function getVariantContext(visualElement) {
	if (!visualElement) return void 0;
	if (!visualElement.isControllingVariants) {
		const context = visualElement.parent ? getVariantContext(visualElement.parent) || {} : {};
		if (visualElement.props.initial !== void 0) context.initial = visualElement.props.initial;
		return context;
	}
	const context = {};
	for (let i = 0; i < numVariantProps; i++) {
		const name = variantProps[i];
		const prop = visualElement.props[name];
		if (isVariantLabel(prop) || prop === false) context[name] = prop;
	}
	return context;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/utils/animation-state.mjs
var reversePriorityOrder = [...variantPriorityOrder].reverse();
var numAnimationTypes = variantPriorityOrder.length;
function animateList(visualElement) {
	return (animations) => Promise.all(animations.map(({ animation, options }) => animateVisualElement(visualElement, animation, options)));
}
function createAnimationState(visualElement) {
	let animate = animateList(visualElement);
	let state = createState();
	let isInitialRender = true;
	/**
	* This function will be used to reduce the animation definitions for
	* each active animation type into an object of resolved values for it.
	*/
	const buildResolvedTypeValues = (type) => (acc, definition) => {
		var _a;
		const resolved = resolveVariant(visualElement, definition, type === "exit" ? (_a = visualElement.presenceContext) === null || _a === void 0 ? void 0 : _a.custom : void 0);
		if (resolved) {
			const { transition, transitionEnd, ...target } = resolved;
			acc = {
				...acc,
				...target,
				...transitionEnd
			};
		}
		return acc;
	};
	/**
	* This just allows us to inject mocked animation functions
	* @internal
	*/
	function setAnimateFunction(makeAnimator) {
		animate = makeAnimator(visualElement);
	}
	/**
	* When we receive new props, we need to:
	* 1. Create a list of protected keys for each type. This is a directory of
	*    value keys that are currently being "handled" by types of a higher priority
	*    so that whenever an animation is played of a given type, these values are
	*    protected from being animated.
	* 2. Determine if an animation type needs animating.
	* 3. Determine if any values have been removed from a type and figure out
	*    what to animate those to.
	*/
	function animateChanges(changedActiveType) {
		const { props } = visualElement;
		const context = getVariantContext(visualElement.parent) || {};
		/**
		* A list of animations that we'll build into as we iterate through the animation
		* types. This will get executed at the end of the function.
		*/
		const animations = [];
		/**
		* Keep track of which values have been removed. Then, as we hit lower priority
		* animation types, we can check if they contain removed values and animate to that.
		*/
		const removedKeys = /* @__PURE__ */ new Set();
		/**
		* A dictionary of all encountered keys. This is an object to let us build into and
		* copy it without iteration. Each time we hit an animation type we set its protected
		* keys - the keys its not allowed to animate - to the latest version of this object.
		*/
		let encounteredKeys = {};
		/**
		* If a variant has been removed at a given index, and this component is controlling
		* variant animations, we want to ensure lower-priority variants are forced to animate.
		*/
		let removedVariantIndex = Infinity;
		/**
		* Iterate through all animation types in reverse priority order. For each, we want to
		* detect which values it's handling and whether or not they've changed (and therefore
		* need to be animated). If any values have been removed, we want to detect those in
		* lower priority props and flag for animation.
		*/
		for (let i = 0; i < numAnimationTypes; i++) {
			const type = reversePriorityOrder[i];
			const typeState = state[type];
			const prop = props[type] !== void 0 ? props[type] : context[type];
			const propIsVariant = isVariantLabel(prop);
			/**
			* If this type has *just* changed isActive status, set activeDelta
			* to that status. Otherwise set to null.
			*/
			const activeDelta = type === changedActiveType ? typeState.isActive : null;
			if (activeDelta === false) removedVariantIndex = i;
			/**
			* If this prop is an inherited variant, rather than been set directly on the
			* component itself, we want to make sure we allow the parent to trigger animations.
			*
			* TODO: Can probably change this to a !isControllingVariants check
			*/
			let isInherited = prop === context[type] && prop !== props[type] && propIsVariant;
			/**
			*
			*/
			if (isInherited && isInitialRender && visualElement.manuallyAnimateOnMount) isInherited = false;
			/**
			* Set all encountered keys so far as the protected keys for this type. This will
			* be any key that has been animated or otherwise handled by active, higher-priortiy types.
			*/
			typeState.protectedKeys = { ...encounteredKeys };
			if (!typeState.isActive && activeDelta === null || !prop && !typeState.prevProp || isAnimationControls(prop) || typeof prop === "boolean") continue;
			/**
			* As we go look through the values defined on this type, if we detect
			* a changed value or a value that was removed in a higher priority, we set
			* this to true and add this prop to the animation list.
			*/
			const variantDidChange = checkVariantsDidChange(typeState.prevProp, prop);
			let shouldAnimateType = variantDidChange || type === changedActiveType && typeState.isActive && !isInherited && propIsVariant || i > removedVariantIndex && propIsVariant;
			let handledRemovedValues = false;
			/**
			* As animations can be set as variant lists, variants or target objects, we
			* coerce everything to an array if it isn't one already
			*/
			const definitionList = Array.isArray(prop) ? prop : [prop];
			/**
			* Build an object of all the resolved values. We'll use this in the subsequent
			* animateChanges calls to determine whether a value has changed.
			*/
			let resolvedValues = definitionList.reduce(buildResolvedTypeValues(type), {});
			if (activeDelta === false) resolvedValues = {};
			/**
			* Now we need to loop through all the keys in the prev prop and this prop,
			* and decide:
			* 1. If the value has changed, and needs animating
			* 2. If it has been removed, and needs adding to the removedKeys set
			* 3. If it has been removed in a higher priority type and needs animating
			* 4. If it hasn't been removed in a higher priority but hasn't changed, and
			*    needs adding to the type's protectedKeys list.
			*/
			const { prevResolvedValues = {} } = typeState;
			const allKeys = {
				...prevResolvedValues,
				...resolvedValues
			};
			const markToAnimate = (key) => {
				shouldAnimateType = true;
				if (removedKeys.has(key)) {
					handledRemovedValues = true;
					removedKeys.delete(key);
				}
				typeState.needsAnimating[key] = true;
				const motionValue = visualElement.getValue(key);
				if (motionValue) motionValue.liveStyle = false;
			};
			for (const key in allKeys) {
				const next = resolvedValues[key];
				const prev = prevResolvedValues[key];
				if (encounteredKeys.hasOwnProperty(key)) continue;
				/**
				* If the value has changed, we probably want to animate it.
				*/
				let valueHasChanged = false;
				if (isKeyframesTarget(next) && isKeyframesTarget(prev)) valueHasChanged = !shallowCompare(next, prev);
				else valueHasChanged = next !== prev;
				if (valueHasChanged) if (next !== void 0 && next !== null) markToAnimate(key);
				else removedKeys.add(key);
				else if (next !== void 0 && removedKeys.has(key))
 /**
				* If next hasn't changed and it isn't undefined, we want to check if it's
				* been removed by a higher priority
				*/
				markToAnimate(key);
				else
 /**
				* If it hasn't changed, we add it to the list of protected values
				* to ensure it doesn't get animated.
				*/
				typeState.protectedKeys[key] = true;
			}
			/**
			* Update the typeState so next time animateChanges is called we can compare the
			* latest prop and resolvedValues to these.
			*/
			typeState.prevProp = prop;
			typeState.prevResolvedValues = resolvedValues;
			/**
			*
			*/
			if (typeState.isActive) encounteredKeys = {
				...encounteredKeys,
				...resolvedValues
			};
			if (isInitialRender && visualElement.blockInitialAnimation) shouldAnimateType = false;
			if (shouldAnimateType && (!(isInherited && variantDidChange) || handledRemovedValues)) animations.push(...definitionList.map((animation) => ({
				animation,
				options: { type }
			})));
		}
		/**
		* If there are some removed value that haven't been dealt with,
		* we need to create a new animation that falls back either to the value
		* defined in the style prop, or the last read value.
		*/
		if (removedKeys.size) {
			const fallbackAnimation = {};
			removedKeys.forEach((key) => {
				const fallbackTarget = visualElement.getBaseTarget(key);
				const motionValue = visualElement.getValue(key);
				if (motionValue) motionValue.liveStyle = true;
				fallbackAnimation[key] = fallbackTarget !== null && fallbackTarget !== void 0 ? fallbackTarget : null;
			});
			animations.push({ animation: fallbackAnimation });
		}
		let shouldAnimate = Boolean(animations.length);
		if (isInitialRender && (props.initial === false || props.initial === props.animate) && !visualElement.manuallyAnimateOnMount) shouldAnimate = false;
		isInitialRender = false;
		return shouldAnimate ? animate(animations) : Promise.resolve();
	}
	/**
	* Change whether a certain animation type is active.
	*/
	function setActive(type, isActive) {
		var _a;
		if (state[type].isActive === isActive) return Promise.resolve();
		(_a = visualElement.variantChildren) === null || _a === void 0 || _a.forEach((child) => {
			var _a;
			return (_a = child.animationState) === null || _a === void 0 ? void 0 : _a.setActive(type, isActive);
		});
		state[type].isActive = isActive;
		const animations = animateChanges(type);
		for (const key in state) state[key].protectedKeys = {};
		return animations;
	}
	return {
		animateChanges,
		setActive,
		setAnimateFunction,
		getState: () => state,
		reset: () => {
			state = createState();
			isInitialRender = true;
		}
	};
}
function checkVariantsDidChange(prev, next) {
	if (typeof next === "string") return next !== prev;
	else if (Array.isArray(next)) return !shallowCompare(next, prev);
	return false;
}
function createTypeState(isActive = false) {
	return {
		isActive,
		protectedKeys: {},
		needsAnimating: {},
		prevResolvedValues: {}
	};
}
function createState() {
	return {
		animate: createTypeState(true),
		whileInView: createTypeState(),
		whileHover: createTypeState(),
		whileTap: createTypeState(),
		whileDrag: createTypeState(),
		whileFocus: createTypeState(),
		exit: createTypeState()
	};
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/motion/features/Feature.mjs
var Feature = class {
	constructor(node) {
		this.isMounted = false;
		this.node = node;
	}
	update() {}
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/motion/features/animation/index.mjs
var AnimationFeature = class extends Feature {
	/**
	* We dynamically generate the AnimationState manager as it contains a reference
	* to the underlying animation library. We only want to load that if we load this,
	* so people can optionally code split it out using the `m` component.
	*/
	constructor(node) {
		super(node);
		node.animationState || (node.animationState = createAnimationState(node));
	}
	updateAnimationControlsSubscription() {
		const { animate } = this.node.getProps();
		if (isAnimationControls(animate)) this.unmountControls = animate.subscribe(this.node);
	}
	/**
	* Subscribe any provided AnimationControls to the component's VisualElement
	*/
	mount() {
		this.updateAnimationControlsSubscription();
	}
	update() {
		const { animate } = this.node.getProps();
		const { animate: prevAnimate } = this.node.prevProps || {};
		if (animate !== prevAnimate) this.updateAnimationControlsSubscription();
	}
	unmount() {
		var _a;
		this.node.animationState.reset();
		(_a = this.unmountControls) === null || _a === void 0 || _a.call(this);
	}
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/motion/features/animation/exit.mjs
var id$1 = 0;
var ExitAnimationFeature = class extends Feature {
	constructor() {
		super(...arguments);
		this.id = id$1++;
	}
	update() {
		if (!this.node.presenceContext) return;
		const { isPresent, onExitComplete } = this.node.presenceContext;
		const { isPresent: prevIsPresent } = this.node.prevPresenceContext || {};
		if (!this.node.animationState || isPresent === prevIsPresent) return;
		const exitAnimation = this.node.animationState.setActive("exit", !isPresent);
		if (onExitComplete && !isPresent) exitAnimation.then(() => onExitComplete(this.id));
	}
	mount() {
		const { register } = this.node.presenceContext || {};
		if (register) this.unmount = register(this.id);
	}
	unmount() {}
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/motion/features/animations.mjs
var animations = {
	animation: { Feature: AnimationFeature },
	exit: { Feature: ExitAnimationFeature }
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/events/add-dom-event.mjs
function addDomEvent(target, eventName, handler, options = { passive: true }) {
	target.addEventListener(eventName, handler, options);
	return () => target.removeEventListener(eventName, handler);
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/events/event-info.mjs
function extractEventInfo(event) {
	return { point: {
		x: event.pageX,
		y: event.pageY
	} };
}
var addPointerInfo = (handler) => {
	return (event) => isPrimaryPointer(event) && handler(event, extractEventInfo(event));
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/events/add-pointer-event.mjs
function addPointerEvent(target, eventName, handler, options) {
	return addDomEvent(target, eventName, addPointerInfo(handler), options);
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/utils/distance.mjs
var distance = (a, b) => Math.abs(a - b);
function distance2D(a, b) {
	const xDelta = distance(a.x, b.x);
	const yDelta = distance(a.y, b.y);
	return Math.sqrt(xDelta ** 2 + yDelta ** 2);
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/gestures/pan/PanSession.mjs
/**
* @internal
*/
var PanSession = class {
	constructor(event, handlers, { transformPagePoint, contextWindow, dragSnapToOrigin = false } = {}) {
		/**
		* @internal
		*/
		this.startEvent = null;
		/**
		* @internal
		*/
		this.lastMoveEvent = null;
		/**
		* @internal
		*/
		this.lastMoveEventInfo = null;
		/**
		* @internal
		*/
		this.handlers = {};
		/**
		* @internal
		*/
		this.contextWindow = window;
		this.updatePoint = () => {
			if (!(this.lastMoveEvent && this.lastMoveEventInfo)) return;
			const info = getPanInfo(this.lastMoveEventInfo, this.history);
			const isPanStarted = this.startEvent !== null;
			const isDistancePastThreshold = distance2D(info.offset, {
				x: 0,
				y: 0
			}) >= 3;
			if (!isPanStarted && !isDistancePastThreshold) return;
			const { point } = info;
			const { timestamp } = frameData;
			this.history.push({
				...point,
				timestamp
			});
			const { onStart, onMove } = this.handlers;
			if (!isPanStarted) {
				onStart && onStart(this.lastMoveEvent, info);
				this.startEvent = this.lastMoveEvent;
			}
			onMove && onMove(this.lastMoveEvent, info);
		};
		this.handlePointerMove = (event, info) => {
			this.lastMoveEvent = event;
			this.lastMoveEventInfo = transformPoint(info, this.transformPagePoint);
			frame.update(this.updatePoint, true);
		};
		this.handlePointerUp = (event, info) => {
			this.end();
			const { onEnd, onSessionEnd, resumeAnimation } = this.handlers;
			if (this.dragSnapToOrigin) resumeAnimation && resumeAnimation();
			if (!(this.lastMoveEvent && this.lastMoveEventInfo)) return;
			const panInfo = getPanInfo(event.type === "pointercancel" ? this.lastMoveEventInfo : transformPoint(info, this.transformPagePoint), this.history);
			if (this.startEvent && onEnd) onEnd(event, panInfo);
			onSessionEnd && onSessionEnd(event, panInfo);
		};
		if (!isPrimaryPointer(event)) return;
		this.dragSnapToOrigin = dragSnapToOrigin;
		this.handlers = handlers;
		this.transformPagePoint = transformPagePoint;
		this.contextWindow = contextWindow || window;
		const initialInfo = transformPoint(extractEventInfo(event), this.transformPagePoint);
		const { point } = initialInfo;
		const { timestamp } = frameData;
		this.history = [{
			...point,
			timestamp
		}];
		const { onSessionStart } = handlers;
		onSessionStart && onSessionStart(event, getPanInfo(initialInfo, this.history));
		this.removeListeners = pipe(addPointerEvent(this.contextWindow, "pointermove", this.handlePointerMove), addPointerEvent(this.contextWindow, "pointerup", this.handlePointerUp), addPointerEvent(this.contextWindow, "pointercancel", this.handlePointerUp));
	}
	updateHandlers(handlers) {
		this.handlers = handlers;
	}
	end() {
		this.removeListeners && this.removeListeners();
		cancelFrame(this.updatePoint);
	}
};
function transformPoint(info, transformPagePoint) {
	return transformPagePoint ? { point: transformPagePoint(info.point) } : info;
}
function subtractPoint(a, b) {
	return {
		x: a.x - b.x,
		y: a.y - b.y
	};
}
function getPanInfo({ point }, history) {
	return {
		point,
		delta: subtractPoint(point, lastDevicePoint(history)),
		offset: subtractPoint(point, startDevicePoint(history)),
		velocity: getVelocity(history, .1)
	};
}
function startDevicePoint(history) {
	return history[0];
}
function lastDevicePoint(history) {
	return history[history.length - 1];
}
function getVelocity(history, timeDelta) {
	if (history.length < 2) return {
		x: 0,
		y: 0
	};
	let i = history.length - 1;
	let timestampedPoint = null;
	const lastPoint = lastDevicePoint(history);
	while (i >= 0) {
		timestampedPoint = history[i];
		if (lastPoint.timestamp - timestampedPoint.timestamp > /* @__PURE__ */ secondsToMilliseconds(timeDelta)) break;
		i--;
	}
	if (!timestampedPoint) return {
		x: 0,
		y: 0
	};
	const time = /* @__PURE__ */ millisecondsToSeconds(lastPoint.timestamp - timestampedPoint.timestamp);
	if (time === 0) return {
		x: 0,
		y: 0
	};
	const currentVelocity = {
		x: (lastPoint.x - timestampedPoint.x) / time,
		y: (lastPoint.y - timestampedPoint.y) / time
	};
	if (currentVelocity.x === Infinity) currentVelocity.x = 0;
	if (currentVelocity.y === Infinity) currentVelocity.y = 0;
	return currentVelocity;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/projection/geometry/delta-calc.mjs
var SCALE_MIN = .9999;
var SCALE_MAX = 1.0001;
var TRANSLATE_MIN = -.01;
var TRANSLATE_MAX = .01;
function calcLength(axis) {
	return axis.max - axis.min;
}
function isNear(value, target, maxDistance) {
	return Math.abs(value - target) <= maxDistance;
}
function calcAxisDelta(delta, source, target, origin = .5) {
	delta.origin = origin;
	delta.originPoint = mixNumber$1(source.min, source.max, delta.origin);
	delta.scale = calcLength(target) / calcLength(source);
	delta.translate = mixNumber$1(target.min, target.max, delta.origin) - delta.originPoint;
	if (delta.scale >= SCALE_MIN && delta.scale <= SCALE_MAX || isNaN(delta.scale)) delta.scale = 1;
	if (delta.translate >= TRANSLATE_MIN && delta.translate <= TRANSLATE_MAX || isNaN(delta.translate)) delta.translate = 0;
}
function calcBoxDelta(delta, source, target, origin) {
	calcAxisDelta(delta.x, source.x, target.x, origin ? origin.originX : void 0);
	calcAxisDelta(delta.y, source.y, target.y, origin ? origin.originY : void 0);
}
function calcRelativeAxis(target, relative, parent) {
	target.min = parent.min + relative.min;
	target.max = target.min + calcLength(relative);
}
function calcRelativeBox(target, relative, parent) {
	calcRelativeAxis(target.x, relative.x, parent.x);
	calcRelativeAxis(target.y, relative.y, parent.y);
}
function calcRelativeAxisPosition(target, layout, parent) {
	target.min = layout.min - parent.min;
	target.max = target.min + calcLength(layout);
}
function calcRelativePosition(target, layout, parent) {
	calcRelativeAxisPosition(target.x, layout.x, parent.x);
	calcRelativeAxisPosition(target.y, layout.y, parent.y);
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/gestures/drag/utils/constraints.mjs
/**
* Apply constraints to a point. These constraints are both physical along an
* axis, and an elastic factor that determines how much to constrain the point
* by if it does lie outside the defined parameters.
*/
function applyConstraints(point, { min, max }, elastic) {
	if (min !== void 0 && point < min) point = elastic ? mixNumber$1(min, point, elastic.min) : Math.max(point, min);
	else if (max !== void 0 && point > max) point = elastic ? mixNumber$1(max, point, elastic.max) : Math.min(point, max);
	return point;
}
/**
* Calculate constraints in terms of the viewport when defined relatively to the
* measured axis. This is measured from the nearest edge, so a max constraint of 200
* on an axis with a max value of 300 would return a constraint of 500 - axis length
*/
function calcRelativeAxisConstraints(axis, min, max) {
	return {
		min: min !== void 0 ? axis.min + min : void 0,
		max: max !== void 0 ? axis.max + max - (axis.max - axis.min) : void 0
	};
}
/**
* Calculate constraints in terms of the viewport when
* defined relatively to the measured bounding box.
*/
function calcRelativeConstraints(layoutBox, { top, left, bottom, right }) {
	return {
		x: calcRelativeAxisConstraints(layoutBox.x, left, right),
		y: calcRelativeAxisConstraints(layoutBox.y, top, bottom)
	};
}
/**
* Calculate viewport constraints when defined as another viewport-relative axis
*/
function calcViewportAxisConstraints(layoutAxis, constraintsAxis) {
	let min = constraintsAxis.min - layoutAxis.min;
	let max = constraintsAxis.max - layoutAxis.max;
	if (constraintsAxis.max - constraintsAxis.min < layoutAxis.max - layoutAxis.min) [min, max] = [max, min];
	return {
		min,
		max
	};
}
/**
* Calculate viewport constraints when defined as another viewport-relative box
*/
function calcViewportConstraints(layoutBox, constraintsBox) {
	return {
		x: calcViewportAxisConstraints(layoutBox.x, constraintsBox.x),
		y: calcViewportAxisConstraints(layoutBox.y, constraintsBox.y)
	};
}
/**
* Calculate a transform origin relative to the source axis, between 0-1, that results
* in an asthetically pleasing scale/transform needed to project from source to target.
*/
function calcOrigin(source, target) {
	let origin = .5;
	const sourceLength = calcLength(source);
	const targetLength = calcLength(target);
	if (targetLength > sourceLength) origin = /* @__PURE__ */ progress(target.min, target.max - sourceLength, source.min);
	else if (sourceLength > targetLength) origin = /* @__PURE__ */ progress(source.min, source.max - targetLength, target.min);
	return clamp(0, 1, origin);
}
/**
* Rebase the calculated viewport constraints relative to the layout.min point.
*/
function rebaseAxisConstraints(layout, constraints) {
	const relativeConstraints = {};
	if (constraints.min !== void 0) relativeConstraints.min = constraints.min - layout.min;
	if (constraints.max !== void 0) relativeConstraints.max = constraints.max - layout.min;
	return relativeConstraints;
}
var defaultElastic = .35;
/**
* Accepts a dragElastic prop and returns resolved elastic values for each axis.
*/
function resolveDragElastic(dragElastic = defaultElastic) {
	if (dragElastic === false) dragElastic = 0;
	else if (dragElastic === true) dragElastic = defaultElastic;
	return {
		x: resolveAxisElastic(dragElastic, "left", "right"),
		y: resolveAxisElastic(dragElastic, "top", "bottom")
	};
}
function resolveAxisElastic(dragElastic, minLabel, maxLabel) {
	return {
		min: resolvePointElastic(dragElastic, minLabel),
		max: resolvePointElastic(dragElastic, maxLabel)
	};
}
function resolvePointElastic(dragElastic, label) {
	return typeof dragElastic === "number" ? dragElastic : dragElastic[label] || 0;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/projection/geometry/models.mjs
var createAxisDelta = () => ({
	translate: 0,
	scale: 1,
	origin: 0,
	originPoint: 0
});
var createDelta = () => ({
	x: createAxisDelta(),
	y: createAxisDelta()
});
var createAxis = () => ({
	min: 0,
	max: 0
});
var createBox = () => ({
	x: createAxis(),
	y: createAxis()
});
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/projection/utils/each-axis.mjs
function eachAxis(callback) {
	return [callback("x"), callback("y")];
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/projection/geometry/conversion.mjs
/**
* Bounding boxes tend to be defined as top, left, right, bottom. For various operations
* it's easier to consider each axis individually. This function returns a bounding box
* as a map of single-axis min/max values.
*/
function convertBoundingBoxToBox({ top, left, right, bottom }) {
	return {
		x: {
			min: left,
			max: right
		},
		y: {
			min: top,
			max: bottom
		}
	};
}
function convertBoxToBoundingBox({ x, y }) {
	return {
		top: y.min,
		right: x.max,
		bottom: y.max,
		left: x.min
	};
}
/**
* Applies a TransformPoint function to a bounding box. TransformPoint is usually a function
* provided by Framer to allow measured points to be corrected for device scaling. This is used
* when measuring DOM elements and DOM event points.
*/
function transformBoxPoints(point, transformPoint) {
	if (!transformPoint) return point;
	const topLeft = transformPoint({
		x: point.left,
		y: point.top
	});
	const bottomRight = transformPoint({
		x: point.right,
		y: point.bottom
	});
	return {
		top: topLeft.y,
		left: topLeft.x,
		bottom: bottomRight.y,
		right: bottomRight.x
	};
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/projection/utils/has-transform.mjs
function isIdentityScale(scale) {
	return scale === void 0 || scale === 1;
}
function hasScale({ scale, scaleX, scaleY }) {
	return !isIdentityScale(scale) || !isIdentityScale(scaleX) || !isIdentityScale(scaleY);
}
function hasTransform(values) {
	return hasScale(values) || has2DTranslate(values) || values.z || values.rotate || values.rotateX || values.rotateY || values.skewX || values.skewY;
}
function has2DTranslate(values) {
	return is2DTranslate(values.x) || is2DTranslate(values.y);
}
function is2DTranslate(value) {
	return value && value !== "0%";
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/projection/geometry/delta-apply.mjs
/**
* Scales a point based on a factor and an originPoint
*/
function scalePoint(point, scale, originPoint) {
	return originPoint + scale * (point - originPoint);
}
/**
* Applies a translate/scale delta to a point
*/
function applyPointDelta(point, translate, scale, originPoint, boxScale) {
	if (boxScale !== void 0) point = scalePoint(point, boxScale, originPoint);
	return scalePoint(point, scale, originPoint) + translate;
}
/**
* Applies a translate/scale delta to an axis
*/
function applyAxisDelta(axis, translate = 0, scale = 1, originPoint, boxScale) {
	axis.min = applyPointDelta(axis.min, translate, scale, originPoint, boxScale);
	axis.max = applyPointDelta(axis.max, translate, scale, originPoint, boxScale);
}
/**
* Applies a translate/scale delta to a box
*/
function applyBoxDelta(box, { x, y }) {
	applyAxisDelta(box.x, x.translate, x.scale, x.originPoint);
	applyAxisDelta(box.y, y.translate, y.scale, y.originPoint);
}
var TREE_SCALE_SNAP_MIN = .999999999999;
var TREE_SCALE_SNAP_MAX = 1.0000000000001;
/**
* Apply a tree of deltas to a box. We do this to calculate the effect of all the transforms
* in a tree upon our box before then calculating how to project it into our desired viewport-relative box
*
* This is the final nested loop within updateLayoutDelta for future refactoring
*/
function applyTreeDeltas(box, treeScale, treePath, isSharedTransition = false) {
	const treeLength = treePath.length;
	if (!treeLength) return;
	treeScale.x = treeScale.y = 1;
	let node;
	let delta;
	for (let i = 0; i < treeLength; i++) {
		node = treePath[i];
		delta = node.projectionDelta;
		/**
		* TODO: Prefer to remove this, but currently we have motion components with
		* display: contents in Framer.
		*/
		const { visualElement } = node.options;
		if (visualElement && visualElement.props.style && visualElement.props.style.display === "contents") continue;
		if (isSharedTransition && node.options.layoutScroll && node.scroll && node !== node.root) transformBox(box, {
			x: -node.scroll.offset.x,
			y: -node.scroll.offset.y
		});
		if (delta) {
			treeScale.x *= delta.x.scale;
			treeScale.y *= delta.y.scale;
			applyBoxDelta(box, delta);
		}
		if (isSharedTransition && hasTransform(node.latestValues)) transformBox(box, node.latestValues);
	}
	/**
	* Snap tree scale back to 1 if it's within a non-perceivable threshold.
	* This will help reduce useless scales getting rendered.
	*/
	if (treeScale.x < TREE_SCALE_SNAP_MAX && treeScale.x > TREE_SCALE_SNAP_MIN) treeScale.x = 1;
	if (treeScale.y < TREE_SCALE_SNAP_MAX && treeScale.y > TREE_SCALE_SNAP_MIN) treeScale.y = 1;
}
function translateAxis(axis, distance) {
	axis.min = axis.min + distance;
	axis.max = axis.max + distance;
}
/**
* Apply a transform to an axis from the latest resolved motion values.
* This function basically acts as a bridge between a flat motion value map
* and applyAxisDelta
*/
function transformAxis(axis, axisTranslate, axisScale, boxScale, axisOrigin = .5) {
	applyAxisDelta(axis, axisTranslate, axisScale, mixNumber$1(axis.min, axis.max, axisOrigin), boxScale);
}
/**
* Apply a transform to a box from the latest resolved motion values.
*/
function transformBox(box, transform) {
	transformAxis(box.x, transform.x, transform.scaleX, transform.scale, transform.originX);
	transformAxis(box.y, transform.y, transform.scaleY, transform.scale, transform.originY);
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/projection/utils/measure.mjs
function measureViewportBox(instance, transformPoint) {
	return convertBoundingBoxToBox(transformBoxPoints(instance.getBoundingClientRect(), transformPoint));
}
function measurePageBox(element, rootProjectionNode, transformPagePoint) {
	const viewportBox = measureViewportBox(element, transformPagePoint);
	const { scroll } = rootProjectionNode;
	if (scroll) {
		translateAxis(viewportBox.x, scroll.offset.x);
		translateAxis(viewportBox.y, scroll.offset.y);
	}
	return viewportBox;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/utils/get-context-window.mjs
var getContextWindow = ({ current }) => {
	return current ? current.ownerDocument.defaultView : null;
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/gestures/drag/VisualElementDragControls.mjs
var elementDragControls = /* @__PURE__ */ new WeakMap();
/**
*
*/
var VisualElementDragControls = class {
	constructor(visualElement) {
		this.openDragLock = null;
		this.isDragging = false;
		this.currentDirection = null;
		this.originPoint = {
			x: 0,
			y: 0
		};
		/**
		* The permitted boundaries of travel, in pixels.
		*/
		this.constraints = false;
		this.hasMutatedConstraints = false;
		/**
		* The per-axis resolved elastic values.
		*/
		this.elastic = createBox();
		this.visualElement = visualElement;
	}
	start(originEvent, { snapToCursor = false } = {}) {
		/**
		* Don't start dragging if this component is exiting
		*/
		const { presenceContext } = this.visualElement;
		if (presenceContext && presenceContext.isPresent === false) return;
		const onSessionStart = (event) => {
			const { dragSnapToOrigin } = this.getProps();
			dragSnapToOrigin ? this.pauseAnimation() : this.stopAnimation();
			if (snapToCursor) this.snapToCursor(extractEventInfo(event).point);
		};
		const onStart = (event, info) => {
			const { drag, dragPropagation, onDragStart } = this.getProps();
			if (drag && !dragPropagation) {
				if (this.openDragLock) this.openDragLock();
				this.openDragLock = setDragLock(drag);
				if (!this.openDragLock) return;
			}
			this.isDragging = true;
			this.currentDirection = null;
			this.resolveConstraints();
			if (this.visualElement.projection) {
				this.visualElement.projection.isAnimationBlocked = true;
				this.visualElement.projection.target = void 0;
			}
			/**
			* Record gesture origin
			*/
			eachAxis((axis) => {
				let current = this.getAxisMotionValue(axis).get() || 0;
				/**
				* If the MotionValue is a percentage value convert to px
				*/
				if (percent.test(current)) {
					const { projection } = this.visualElement;
					if (projection && projection.layout) {
						const measuredAxis = projection.layout.layoutBox[axis];
						if (measuredAxis) current = calcLength(measuredAxis) * (parseFloat(current) / 100);
					}
				}
				this.originPoint[axis] = current;
			});
			if (onDragStart) frame.postRender(() => onDragStart(event, info));
			addValueToWillChange(this.visualElement, "transform");
			const { animationState } = this.visualElement;
			animationState && animationState.setActive("whileDrag", true);
		};
		const onMove = (event, info) => {
			const { dragPropagation, dragDirectionLock, onDirectionLock, onDrag } = this.getProps();
			if (!dragPropagation && !this.openDragLock) return;
			const { offset } = info;
			if (dragDirectionLock && this.currentDirection === null) {
				this.currentDirection = getCurrentDirection(offset);
				if (this.currentDirection !== null) onDirectionLock && onDirectionLock(this.currentDirection);
				return;
			}
			this.updateAxis("x", info.point, offset);
			this.updateAxis("y", info.point, offset);
			/**
			* Ideally we would leave the renderer to fire naturally at the end of
			* this frame but if the element is about to change layout as the result
			* of a re-render we want to ensure the browser can read the latest
			* bounding box to ensure the pointer and element don't fall out of sync.
			*/
			this.visualElement.render();
			/**
			* This must fire after the render call as it might trigger a state
			* change which itself might trigger a layout update.
			*/
			onDrag && onDrag(event, info);
		};
		const onSessionEnd = (event, info) => this.stop(event, info);
		const resumeAnimation = () => eachAxis((axis) => {
			var _a;
			return this.getAnimationState(axis) === "paused" && ((_a = this.getAxisMotionValue(axis).animation) === null || _a === void 0 ? void 0 : _a.play());
		});
		const { dragSnapToOrigin } = this.getProps();
		this.panSession = new PanSession(originEvent, {
			onSessionStart,
			onStart,
			onMove,
			onSessionEnd,
			resumeAnimation
		}, {
			transformPagePoint: this.visualElement.getTransformPagePoint(),
			dragSnapToOrigin,
			contextWindow: getContextWindow(this.visualElement)
		});
	}
	stop(event, info) {
		const isDragging = this.isDragging;
		this.cancel();
		if (!isDragging) return;
		const { velocity } = info;
		this.startAnimation(velocity);
		const { onDragEnd } = this.getProps();
		if (onDragEnd) frame.postRender(() => onDragEnd(event, info));
	}
	cancel() {
		this.isDragging = false;
		const { projection, animationState } = this.visualElement;
		if (projection) projection.isAnimationBlocked = false;
		this.panSession && this.panSession.end();
		this.panSession = void 0;
		const { dragPropagation } = this.getProps();
		if (!dragPropagation && this.openDragLock) {
			this.openDragLock();
			this.openDragLock = null;
		}
		animationState && animationState.setActive("whileDrag", false);
	}
	updateAxis(axis, _point, offset) {
		const { drag } = this.getProps();
		if (!offset || !shouldDrag(axis, drag, this.currentDirection)) return;
		const axisValue = this.getAxisMotionValue(axis);
		let next = this.originPoint[axis] + offset[axis];
		if (this.constraints && this.constraints[axis]) next = applyConstraints(next, this.constraints[axis], this.elastic[axis]);
		axisValue.set(next);
	}
	resolveConstraints() {
		var _a;
		const { dragConstraints, dragElastic } = this.getProps();
		const layout = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(false) : (_a = this.visualElement.projection) === null || _a === void 0 ? void 0 : _a.layout;
		const prevConstraints = this.constraints;
		if (dragConstraints && isRefObject(dragConstraints)) {
			if (!this.constraints) this.constraints = this.resolveRefConstraints();
		} else if (dragConstraints && layout) this.constraints = calcRelativeConstraints(layout.layoutBox, dragConstraints);
		else this.constraints = false;
		this.elastic = resolveDragElastic(dragElastic);
		/**
		* If we're outputting to external MotionValues, we want to rebase the measured constraints
		* from viewport-relative to component-relative.
		*/
		if (prevConstraints !== this.constraints && layout && this.constraints && !this.hasMutatedConstraints) eachAxis((axis) => {
			if (this.constraints !== false && this.getAxisMotionValue(axis)) this.constraints[axis] = rebaseAxisConstraints(layout.layoutBox[axis], this.constraints[axis]);
		});
	}
	resolveRefConstraints() {
		const { dragConstraints: constraints, onMeasureDragConstraints } = this.getProps();
		if (!constraints || !isRefObject(constraints)) return false;
		const constraintsElement = constraints.current;
		invariant(constraintsElement !== null, "If `dragConstraints` is set as a React ref, that ref must be passed to another component's `ref` prop.");
		const { projection } = this.visualElement;
		if (!projection || !projection.layout) return false;
		const constraintsBox = measurePageBox(constraintsElement, projection.root, this.visualElement.getTransformPagePoint());
		let measuredConstraints = calcViewportConstraints(projection.layout.layoutBox, constraintsBox);
		/**
		* If there's an onMeasureDragConstraints listener we call it and
		* if different constraints are returned, set constraints to that
		*/
		if (onMeasureDragConstraints) {
			const userConstraints = onMeasureDragConstraints(convertBoxToBoundingBox(measuredConstraints));
			this.hasMutatedConstraints = !!userConstraints;
			if (userConstraints) measuredConstraints = convertBoundingBoxToBox(userConstraints);
		}
		return measuredConstraints;
	}
	startAnimation(velocity) {
		const { drag, dragMomentum, dragElastic, dragTransition, dragSnapToOrigin, onDragTransitionEnd } = this.getProps();
		const constraints = this.constraints || {};
		const momentumAnimations = eachAxis((axis) => {
			if (!shouldDrag(axis, drag, this.currentDirection)) return;
			let transition = constraints && constraints[axis] || {};
			if (dragSnapToOrigin) transition = {
				min: 0,
				max: 0
			};
			/**
			* Overdamp the boundary spring if `dragElastic` is disabled. There's still a frame
			* of spring animations so we should look into adding a disable spring option to `inertia`.
			* We could do something here where we affect the `bounceStiffness` and `bounceDamping`
			* using the value of `dragElastic`.
			*/
			const bounceStiffness = dragElastic ? 200 : 1e6;
			const bounceDamping = dragElastic ? 40 : 1e7;
			const inertia = {
				type: "inertia",
				velocity: dragMomentum ? velocity[axis] : 0,
				bounceStiffness,
				bounceDamping,
				timeConstant: 750,
				restDelta: 1,
				restSpeed: 10,
				...dragTransition,
				...transition
			};
			return this.startAxisValueAnimation(axis, inertia);
		});
		return Promise.all(momentumAnimations).then(onDragTransitionEnd);
	}
	startAxisValueAnimation(axis, transition) {
		const axisValue = this.getAxisMotionValue(axis);
		addValueToWillChange(this.visualElement, axis);
		return axisValue.start(animateMotionValue(axis, axisValue, 0, transition, this.visualElement, false));
	}
	stopAnimation() {
		eachAxis((axis) => this.getAxisMotionValue(axis).stop());
	}
	pauseAnimation() {
		eachAxis((axis) => {
			var _a;
			return (_a = this.getAxisMotionValue(axis).animation) === null || _a === void 0 ? void 0 : _a.pause();
		});
	}
	getAnimationState(axis) {
		var _a;
		return (_a = this.getAxisMotionValue(axis).animation) === null || _a === void 0 ? void 0 : _a.state;
	}
	/**
	* Drag works differently depending on which props are provided.
	*
	* - If _dragX and _dragY are provided, we output the gesture delta directly to those motion values.
	* - Otherwise, we apply the delta to the x/y motion values.
	*/
	getAxisMotionValue(axis) {
		const dragKey = `_drag${axis.toUpperCase()}`;
		const props = this.visualElement.getProps();
		const externalMotionValue = props[dragKey];
		return externalMotionValue ? externalMotionValue : this.visualElement.getValue(axis, (props.initial ? props.initial[axis] : void 0) || 0);
	}
	snapToCursor(point) {
		eachAxis((axis) => {
			const { drag } = this.getProps();
			if (!shouldDrag(axis, drag, this.currentDirection)) return;
			const { projection } = this.visualElement;
			const axisValue = this.getAxisMotionValue(axis);
			if (projection && projection.layout) {
				const { min, max } = projection.layout.layoutBox[axis];
				axisValue.set(point[axis] - mixNumber$1(min, max, .5));
			}
		});
	}
	/**
	* When the viewport resizes we want to check if the measured constraints
	* have changed and, if so, reposition the element within those new constraints
	* relative to where it was before the resize.
	*/
	scalePositionWithinConstraints() {
		if (!this.visualElement.current) return;
		const { drag, dragConstraints } = this.getProps();
		const { projection } = this.visualElement;
		if (!isRefObject(dragConstraints) || !projection || !this.constraints) return;
		/**
		* Stop current animations as there can be visual glitching if we try to do
		* this mid-animation
		*/
		this.stopAnimation();
		/**
		* Record the relative position of the dragged element relative to the
		* constraints box and save as a progress value.
		*/
		const boxProgress = {
			x: 0,
			y: 0
		};
		eachAxis((axis) => {
			const axisValue = this.getAxisMotionValue(axis);
			if (axisValue && this.constraints !== false) {
				const latest = axisValue.get();
				boxProgress[axis] = calcOrigin({
					min: latest,
					max: latest
				}, this.constraints[axis]);
			}
		});
		/**
		* Update the layout of this element and resolve the latest drag constraints
		*/
		const { transformTemplate } = this.visualElement.getProps();
		this.visualElement.current.style.transform = transformTemplate ? transformTemplate({}, "") : "none";
		projection.root && projection.root.updateScroll();
		projection.updateLayout();
		this.resolveConstraints();
		/**
		* For each axis, calculate the current progress of the layout axis
		* within the new constraints.
		*/
		eachAxis((axis) => {
			if (!shouldDrag(axis, drag, null)) return;
			/**
			* Calculate a new transform based on the previous box progress
			*/
			const axisValue = this.getAxisMotionValue(axis);
			const { min, max } = this.constraints[axis];
			axisValue.set(mixNumber$1(min, max, boxProgress[axis]));
		});
	}
	addListeners() {
		if (!this.visualElement.current) return;
		elementDragControls.set(this.visualElement, this);
		const element = this.visualElement.current;
		/**
		* Attach a pointerdown event listener on this DOM element to initiate drag tracking.
		*/
		const stopPointerListener = addPointerEvent(element, "pointerdown", (event) => {
			const { drag, dragListener = true } = this.getProps();
			drag && dragListener && this.start(event);
		});
		const measureDragConstraints = () => {
			const { dragConstraints } = this.getProps();
			if (isRefObject(dragConstraints) && dragConstraints.current) this.constraints = this.resolveRefConstraints();
		};
		const { projection } = this.visualElement;
		const stopMeasureLayoutListener = projection.addEventListener("measure", measureDragConstraints);
		if (projection && !projection.layout) {
			projection.root && projection.root.updateScroll();
			projection.updateLayout();
		}
		frame.read(measureDragConstraints);
		/**
		* Attach a window resize listener to scale the draggable target within its defined
		* constraints as the window resizes.
		*/
		const stopResizeListener = addDomEvent(window, "resize", () => this.scalePositionWithinConstraints());
		/**
		* If the element's layout changes, calculate the delta and apply that to
		* the drag gesture's origin point.
		*/
		const stopLayoutUpdateListener = projection.addEventListener("didUpdate", (({ delta, hasLayoutChanged }) => {
			if (this.isDragging && hasLayoutChanged) {
				eachAxis((axis) => {
					const motionValue = this.getAxisMotionValue(axis);
					if (!motionValue) return;
					this.originPoint[axis] += delta[axis].translate;
					motionValue.set(motionValue.get() + delta[axis].translate);
				});
				this.visualElement.render();
			}
		}));
		return () => {
			stopResizeListener();
			stopPointerListener();
			stopMeasureLayoutListener();
			stopLayoutUpdateListener && stopLayoutUpdateListener();
		};
	}
	getProps() {
		const props = this.visualElement.getProps();
		const { drag = false, dragDirectionLock = false, dragPropagation = false, dragConstraints = false, dragElastic = defaultElastic, dragMomentum = true } = props;
		return {
			...props,
			drag,
			dragDirectionLock,
			dragPropagation,
			dragConstraints,
			dragElastic,
			dragMomentum
		};
	}
};
function shouldDrag(direction, drag, currentDirection) {
	return (drag === true || drag === direction) && (currentDirection === null || currentDirection === direction);
}
/**
* Based on an x/y offset determine the current drag direction. If both axis' offsets are lower
* than the provided threshold, return `null`.
*
* @param offset - The x/y offset from origin.
* @param lockThreshold - (Optional) - the minimum absolute offset before we can determine a drag direction.
*/
function getCurrentDirection(offset, lockThreshold = 10) {
	let direction = null;
	if (Math.abs(offset.y) > lockThreshold) direction = "y";
	else if (Math.abs(offset.x) > lockThreshold) direction = "x";
	return direction;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/gestures/drag/index.mjs
var DragGesture = class extends Feature {
	constructor(node) {
		super(node);
		this.removeGroupControls = noop;
		this.removeListeners = noop;
		this.controls = new VisualElementDragControls(node);
	}
	mount() {
		const { dragControls } = this.node.getProps();
		if (dragControls) this.removeGroupControls = dragControls.subscribe(this.controls);
		this.removeListeners = this.controls.addListeners() || noop;
	}
	unmount() {
		this.removeGroupControls();
		this.removeListeners();
	}
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/gestures/pan/index.mjs
var asyncHandler = (handler) => (event, info) => {
	if (handler) frame.postRender(() => handler(event, info));
};
var PanGesture = class extends Feature {
	constructor() {
		super(...arguments);
		this.removePointerDownListener = noop;
	}
	onPointerDown(pointerDownEvent) {
		this.session = new PanSession(pointerDownEvent, this.createPanHandlers(), {
			transformPagePoint: this.node.getTransformPagePoint(),
			contextWindow: getContextWindow(this.node)
		});
	}
	createPanHandlers() {
		const { onPanSessionStart, onPanStart, onPan, onPanEnd } = this.node.getProps();
		return {
			onSessionStart: asyncHandler(onPanSessionStart),
			onStart: asyncHandler(onPanStart),
			onMove: onPan,
			onEnd: (event, info) => {
				delete this.session;
				if (onPanEnd) frame.postRender(() => onPanEnd(event, info));
			}
		};
	}
	mount() {
		this.removePointerDownListener = addPointerEvent(this.node.current, "pointerdown", (event) => this.onPointerDown(event));
	}
	update() {
		this.session && this.session.updateHandlers(this.createPanHandlers());
	}
	unmount() {
		this.removePointerDownListener();
		this.session && this.session.end();
	}
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/projection/node/state.mjs
/**
* This should only ever be modified on the client otherwise it'll
* persist through server requests. If we need instanced states we
* could lazy-init via root.
*/
var globalProjectionState = {
	/**
	* Global flag as to whether the tree has animated since the last time
	* we resized the window
	*/
	hasAnimatedSinceResize: true,
	/**
	* We set this to true once, on the first update. Any nodes added to the tree beyond that
	* update will be given a `data-projection-id` attribute.
	*/
	hasEverUpdated: false
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/projection/styles/scale-border-radius.mjs
function pixelsToPercent(pixels, axis) {
	if (axis.max === axis.min) return 0;
	return pixels / (axis.max - axis.min) * 100;
}
/**
* We always correct borderRadius as a percentage rather than pixels to reduce paints.
* For example, if you are projecting a box that is 100px wide with a 10px borderRadius
* into a box that is 200px wide with a 20px borderRadius, that is actually a 10%
* borderRadius in both states. If we animate between the two in pixels that will trigger
* a paint each time. If we animate between the two in percentage we'll avoid a paint.
*/
var correctBorderRadius = { correct: (latest, node) => {
	if (!node.target) return latest;
	/**
	* If latest is a string, if it's a percentage we can return immediately as it's
	* going to be stretched appropriately. Otherwise, if it's a pixel, convert it to a number.
	*/
	if (typeof latest === "string") if (px.test(latest)) latest = parseFloat(latest);
	else return latest;
	return `${pixelsToPercent(latest, node.target.x)}% ${pixelsToPercent(latest, node.target.y)}%`;
} };
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/projection/styles/scale-box-shadow.mjs
var correctBoxShadow = { correct: (latest, { treeScale, projectionDelta }) => {
	const original = latest;
	const shadow = complex.parse(latest);
	if (shadow.length > 5) return original;
	const template = complex.createTransformer(latest);
	const offset = typeof shadow[0] !== "number" ? 1 : 0;
	const xScale = projectionDelta.x.scale * treeScale.x;
	const yScale = projectionDelta.y.scale * treeScale.y;
	shadow[0 + offset] /= xScale;
	shadow[1 + offset] /= yScale;
	/**
	* Ideally we'd correct x and y scales individually, but because blur and
	* spread apply to both we have to take a scale average and apply that instead.
	* We could potentially improve the outcome of this by incorporating the ratio between
	* the two scales.
	*/
	const averageScale = mixNumber$1(xScale, yScale, .5);
	if (typeof shadow[2 + offset] === "number") shadow[2 + offset] /= averageScale;
	if (typeof shadow[3 + offset] === "number") shadow[3 + offset] /= averageScale;
	return template(shadow);
} };
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/motion/features/layout/MeasureLayout.mjs
var MeasureLayoutWithContext = class extends import_react.Component {
	/**
	* This only mounts projection nodes for components that
	* need measuring, we might want to do it for all components
	* in order to incorporate transforms
	*/
	componentDidMount() {
		const { visualElement, layoutGroup, switchLayoutGroup, layoutId } = this.props;
		const { projection } = visualElement;
		addScaleCorrector(defaultScaleCorrectors);
		if (projection) {
			if (layoutGroup.group) layoutGroup.group.add(projection);
			if (switchLayoutGroup && switchLayoutGroup.register && layoutId) switchLayoutGroup.register(projection);
			projection.root.didUpdate();
			projection.addEventListener("animationComplete", () => {
				this.safeToRemove();
			});
			projection.setOptions({
				...projection.options,
				onExitComplete: () => this.safeToRemove()
			});
		}
		globalProjectionState.hasEverUpdated = true;
	}
	getSnapshotBeforeUpdate(prevProps) {
		const { layoutDependency, visualElement, drag, isPresent } = this.props;
		const projection = visualElement.projection;
		if (!projection) return null;
		/**
		* TODO: We use this data in relegate to determine whether to
		* promote a previous element. There's no guarantee its presence data
		* will have updated by this point - if a bug like this arises it will
		* have to be that we markForRelegation and then find a new lead some other way,
		* perhaps in didUpdate
		*/
		projection.isPresent = isPresent;
		if (drag || prevProps.layoutDependency !== layoutDependency || layoutDependency === void 0) projection.willUpdate();
		else this.safeToRemove();
		if (prevProps.isPresent !== isPresent) {
			if (isPresent) projection.promote();
			else if (!projection.relegate())
 /**
			* If there's another stack member taking over from this one,
			* it's in charge of the exit animation and therefore should
			* be in charge of the safe to remove. Otherwise we call it here.
			*/
			frame.postRender(() => {
				const stack = projection.getStack();
				if (!stack || !stack.members.length) this.safeToRemove();
			});
		}
		return null;
	}
	componentDidUpdate() {
		const { projection } = this.props.visualElement;
		if (projection) {
			projection.root.didUpdate();
			microtask.postRender(() => {
				if (!projection.currentAnimation && projection.isLead()) this.safeToRemove();
			});
		}
	}
	componentWillUnmount() {
		const { visualElement, layoutGroup, switchLayoutGroup: promoteContext } = this.props;
		const { projection } = visualElement;
		if (projection) {
			projection.scheduleCheckAfterUnmount();
			if (layoutGroup && layoutGroup.group) layoutGroup.group.remove(projection);
			if (promoteContext && promoteContext.deregister) promoteContext.deregister(projection);
		}
	}
	safeToRemove() {
		const { safeToRemove } = this.props;
		safeToRemove && safeToRemove();
	}
	render() {
		return null;
	}
};
function MeasureLayout(props) {
	const [isPresent, safeToRemove] = usePresence();
	const layoutGroup = (0, import_react.useContext)(LayoutGroupContext);
	return (0, import_jsx_runtime.jsx)(MeasureLayoutWithContext, {
		...props,
		layoutGroup,
		switchLayoutGroup: (0, import_react.useContext)(SwitchLayoutGroupContext),
		isPresent,
		safeToRemove
	});
}
var defaultScaleCorrectors = {
	borderRadius: {
		...correctBorderRadius,
		applyTo: [
			"borderTopLeftRadius",
			"borderTopRightRadius",
			"borderBottomLeftRadius",
			"borderBottomRightRadius"
		]
	},
	borderTopLeftRadius: correctBorderRadius,
	borderTopRightRadius: correctBorderRadius,
	borderBottomLeftRadius: correctBorderRadius,
	borderBottomRightRadius: correctBorderRadius,
	boxShadow: correctBoxShadow
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/animation/animate/single-value.mjs
function animateSingleValue(value, keyframes, options) {
	const motionValue$1 = isMotionValue(value) ? value : motionValue(value);
	motionValue$1.start(animateMotionValue("", motionValue$1, keyframes, options));
	return motionValue$1.animation;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/dom/utils/is-svg-element.mjs
function isSVGElement(element) {
	return element instanceof SVGElement && element.tagName !== "svg";
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/utils/compare-by-depth.mjs
var compareByDepth = (a, b) => a.depth - b.depth;
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/utils/flat-tree.mjs
var FlatTree = class {
	constructor() {
		this.children = [];
		this.isDirty = false;
	}
	add(child) {
		addUniqueItem(this.children, child);
		this.isDirty = true;
	}
	remove(child) {
		removeItem(this.children, child);
		this.isDirty = true;
	}
	forEach(callback) {
		this.isDirty && this.children.sort(compareByDepth);
		this.isDirty = false;
		this.children.forEach(callback);
	}
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/utils/delay.mjs
/**
* Timeout defined in ms
*/
function delay(callback, timeout) {
	const start = time.now();
	const checkElapsed = ({ timestamp }) => {
		const elapsed = timestamp - start;
		if (elapsed >= timeout) {
			cancelFrame(checkElapsed);
			callback(elapsed - timeout);
		}
	};
	frame.read(checkElapsed, true);
	return () => cancelFrame(checkElapsed);
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/projection/animation/mix-values.mjs
var borders = [
	"TopLeft",
	"TopRight",
	"BottomLeft",
	"BottomRight"
];
var numBorders = borders.length;
var asNumber = (value) => typeof value === "string" ? parseFloat(value) : value;
var isPx = (value) => typeof value === "number" || px.test(value);
function mixValues(target, follow, lead, progress, shouldCrossfadeOpacity, isOnlyMember) {
	if (shouldCrossfadeOpacity) {
		target.opacity = mixNumber$1(0, lead.opacity !== void 0 ? lead.opacity : 1, easeCrossfadeIn(progress));
		target.opacityExit = mixNumber$1(follow.opacity !== void 0 ? follow.opacity : 1, 0, easeCrossfadeOut(progress));
	} else if (isOnlyMember) target.opacity = mixNumber$1(follow.opacity !== void 0 ? follow.opacity : 1, lead.opacity !== void 0 ? lead.opacity : 1, progress);
	/**
	* Mix border radius
	*/
	for (let i = 0; i < numBorders; i++) {
		const borderLabel = `border${borders[i]}Radius`;
		let followRadius = getRadius(follow, borderLabel);
		let leadRadius = getRadius(lead, borderLabel);
		if (followRadius === void 0 && leadRadius === void 0) continue;
		followRadius || (followRadius = 0);
		leadRadius || (leadRadius = 0);
		if (followRadius === 0 || leadRadius === 0 || isPx(followRadius) === isPx(leadRadius)) {
			target[borderLabel] = Math.max(mixNumber$1(asNumber(followRadius), asNumber(leadRadius), progress), 0);
			if (percent.test(leadRadius) || percent.test(followRadius)) target[borderLabel] += "%";
		} else target[borderLabel] = leadRadius;
	}
	/**
	* Mix rotation
	*/
	if (follow.rotate || lead.rotate) target.rotate = mixNumber$1(follow.rotate || 0, lead.rotate || 0, progress);
}
function getRadius(values, radiusName) {
	return values[radiusName] !== void 0 ? values[radiusName] : values.borderRadius;
}
var easeCrossfadeIn = /*@__PURE__*/ compress(0, .5, circOut);
var easeCrossfadeOut = /*@__PURE__*/ compress(.5, .95, noop);
function compress(min, max, easing) {
	return (p) => {
		if (p < min) return 0;
		if (p > max) return 1;
		return easing(/* @__PURE__ */ progress(min, max, p));
	};
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/projection/geometry/copy.mjs
/**
* Reset an axis to the provided origin box.
*
* This is a mutative operation.
*/
function copyAxisInto(axis, originAxis) {
	axis.min = originAxis.min;
	axis.max = originAxis.max;
}
/**
* Reset a box to the provided origin box.
*
* This is a mutative operation.
*/
function copyBoxInto(box, originBox) {
	copyAxisInto(box.x, originBox.x);
	copyAxisInto(box.y, originBox.y);
}
/**
* Reset a delta to the provided origin box.
*
* This is a mutative operation.
*/
function copyAxisDeltaInto(delta, originDelta) {
	delta.translate = originDelta.translate;
	delta.scale = originDelta.scale;
	delta.originPoint = originDelta.originPoint;
	delta.origin = originDelta.origin;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/projection/geometry/delta-remove.mjs
/**
* Remove a delta from a point. This is essentially the steps of applyPointDelta in reverse
*/
function removePointDelta(point, translate, scale, originPoint, boxScale) {
	point -= translate;
	point = scalePoint(point, 1 / scale, originPoint);
	if (boxScale !== void 0) point = scalePoint(point, 1 / boxScale, originPoint);
	return point;
}
/**
* Remove a delta from an axis. This is essentially the steps of applyAxisDelta in reverse
*/
function removeAxisDelta(axis, translate = 0, scale = 1, origin = .5, boxScale, originAxis = axis, sourceAxis = axis) {
	if (percent.test(translate)) {
		translate = parseFloat(translate);
		translate = mixNumber$1(sourceAxis.min, sourceAxis.max, translate / 100) - sourceAxis.min;
	}
	if (typeof translate !== "number") return;
	let originPoint = mixNumber$1(originAxis.min, originAxis.max, origin);
	if (axis === originAxis) originPoint -= translate;
	axis.min = removePointDelta(axis.min, translate, scale, originPoint, boxScale);
	axis.max = removePointDelta(axis.max, translate, scale, originPoint, boxScale);
}
/**
* Remove a transforms from an axis. This is essentially the steps of applyAxisTransforms in reverse
* and acts as a bridge between motion values and removeAxisDelta
*/
function removeAxisTransforms(axis, transforms, [key, scaleKey, originKey], origin, sourceAxis) {
	removeAxisDelta(axis, transforms[key], transforms[scaleKey], transforms[originKey], transforms.scale, origin, sourceAxis);
}
/**
* The names of the motion values we want to apply as translation, scale and origin.
*/
var xKeys = [
	"x",
	"scaleX",
	"originX"
];
var yKeys = [
	"y",
	"scaleY",
	"originY"
];
/**
* Remove a transforms from an box. This is essentially the steps of applyAxisBox in reverse
* and acts as a bridge between motion values and removeAxisDelta
*/
function removeBoxTransforms(box, transforms, originBox, sourceBox) {
	removeAxisTransforms(box.x, transforms, xKeys, originBox ? originBox.x : void 0, sourceBox ? sourceBox.x : void 0);
	removeAxisTransforms(box.y, transforms, yKeys, originBox ? originBox.y : void 0, sourceBox ? sourceBox.y : void 0);
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/projection/geometry/utils.mjs
function isAxisDeltaZero(delta) {
	return delta.translate === 0 && delta.scale === 1;
}
function isDeltaZero(delta) {
	return isAxisDeltaZero(delta.x) && isAxisDeltaZero(delta.y);
}
function axisEquals(a, b) {
	return a.min === b.min && a.max === b.max;
}
function boxEquals(a, b) {
	return axisEquals(a.x, b.x) && axisEquals(a.y, b.y);
}
function axisEqualsRounded(a, b) {
	return Math.round(a.min) === Math.round(b.min) && Math.round(a.max) === Math.round(b.max);
}
function boxEqualsRounded(a, b) {
	return axisEqualsRounded(a.x, b.x) && axisEqualsRounded(a.y, b.y);
}
function aspectRatio(box) {
	return calcLength(box.x) / calcLength(box.y);
}
function axisDeltaEquals(a, b) {
	return a.translate === b.translate && a.scale === b.scale && a.originPoint === b.originPoint;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/projection/shared/stack.mjs
var NodeStack = class {
	constructor() {
		this.members = [];
	}
	add(node) {
		addUniqueItem(this.members, node);
		node.scheduleRender();
	}
	remove(node) {
		removeItem(this.members, node);
		if (node === this.prevLead) this.prevLead = void 0;
		if (node === this.lead) {
			const prevLead = this.members[this.members.length - 1];
			if (prevLead) this.promote(prevLead);
		}
	}
	relegate(node) {
		const indexOfNode = this.members.findIndex((member) => node === member);
		if (indexOfNode === 0) return false;
		/**
		* Find the next projection node that is present
		*/
		let prevLead;
		for (let i = indexOfNode; i >= 0; i--) {
			const member = this.members[i];
			if (member.isPresent !== false) {
				prevLead = member;
				break;
			}
		}
		if (prevLead) {
			this.promote(prevLead);
			return true;
		} else return false;
	}
	promote(node, preserveFollowOpacity) {
		const prevLead = this.lead;
		if (node === prevLead) return;
		this.prevLead = prevLead;
		this.lead = node;
		node.show();
		if (prevLead) {
			prevLead.instance && prevLead.scheduleRender();
			node.scheduleRender();
			node.resumeFrom = prevLead;
			if (preserveFollowOpacity) node.resumeFrom.preserveOpacity = true;
			if (prevLead.snapshot) {
				node.snapshot = prevLead.snapshot;
				node.snapshot.latestValues = prevLead.animationValues || prevLead.latestValues;
			}
			if (node.root && node.root.isUpdating) node.isLayoutDirty = true;
			const { crossfade } = node.options;
			if (crossfade === false) prevLead.hide();
		}
	}
	exitAnimationComplete() {
		this.members.forEach((node) => {
			const { options, resumingFrom } = node;
			options.onExitComplete && options.onExitComplete();
			if (resumingFrom) resumingFrom.options.onExitComplete && resumingFrom.options.onExitComplete();
		});
	}
	scheduleRender() {
		this.members.forEach((node) => {
			node.instance && node.scheduleRender(false);
		});
	}
	/**
	* Clear any leads that have been removed this render to prevent them from being
	* used in future animations and to prevent memory leaks
	*/
	removeLeadSnapshot() {
		if (this.lead && this.lead.snapshot) this.lead.snapshot = void 0;
	}
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/projection/styles/transform.mjs
function buildProjectionTransform(delta, treeScale, latestTransform) {
	let transform = "";
	/**
	* The translations we use to calculate are always relative to the viewport coordinate space.
	* But when we apply scales, we also scale the coordinate space of an element and its children.
	* For instance if we have a treeScale (the culmination of all parent scales) of 0.5 and we need
	* to move an element 100 pixels, we actually need to move it 200 in within that scaled space.
	*/
	const xTranslate = delta.x.translate / treeScale.x;
	const yTranslate = delta.y.translate / treeScale.y;
	const zTranslate = (latestTransform === null || latestTransform === void 0 ? void 0 : latestTransform.z) || 0;
	if (xTranslate || yTranslate || zTranslate) transform = `translate3d(${xTranslate}px, ${yTranslate}px, ${zTranslate}px) `;
	/**
	* Apply scale correction for the tree transform.
	* This will apply scale to the screen-orientated axes.
	*/
	if (treeScale.x !== 1 || treeScale.y !== 1) transform += `scale(${1 / treeScale.x}, ${1 / treeScale.y}) `;
	if (latestTransform) {
		const { transformPerspective, rotate, rotateX, rotateY, skewX, skewY } = latestTransform;
		if (transformPerspective) transform = `perspective(${transformPerspective}px) ${transform}`;
		if (rotate) transform += `rotate(${rotate}deg) `;
		if (rotateX) transform += `rotateX(${rotateX}deg) `;
		if (rotateY) transform += `rotateY(${rotateY}deg) `;
		if (skewX) transform += `skewX(${skewX}deg) `;
		if (skewY) transform += `skewY(${skewY}deg) `;
	}
	/**
	* Apply scale to match the size of the element to the size we want it.
	* This will apply scale to the element-orientated axes.
	*/
	const elementScaleX = delta.x.scale * treeScale.x;
	const elementScaleY = delta.y.scale * treeScale.y;
	if (elementScaleX !== 1 || elementScaleY !== 1) transform += `scale(${elementScaleX}, ${elementScaleY})`;
	return transform || "none";
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/projection/node/create-projection-node.mjs
var metrics = {
	type: "projectionFrame",
	totalNodes: 0,
	resolvedTargetDeltas: 0,
	recalculatedProjection: 0
};
var isDebug = typeof window !== "undefined" && window.MotionDebug !== void 0;
var transformAxes = [
	"",
	"X",
	"Y",
	"Z"
];
var hiddenVisibility = { visibility: "hidden" };
/**
* We use 1000 as the animation target as 0-1000 maps better to pixels than 0-1
* which has a noticeable difference in spring animations
*/
var animationTarget = 1e3;
var id = 0;
function resetDistortingTransform(key, visualElement, values, sharedAnimationValues) {
	const { latestValues } = visualElement;
	if (latestValues[key]) {
		values[key] = latestValues[key];
		visualElement.setStaticValue(key, 0);
		if (sharedAnimationValues) sharedAnimationValues[key] = 0;
	}
}
function cancelTreeOptimisedTransformAnimations(projectionNode) {
	projectionNode.hasCheckedOptimisedAppear = true;
	if (projectionNode.root === projectionNode) return;
	const { visualElement } = projectionNode.options;
	if (!visualElement) return;
	const appearId = getOptimisedAppearId(visualElement);
	if (window.MotionHasOptimisedAnimation(appearId, "transform")) {
		const { layout, layoutId } = projectionNode.options;
		window.MotionCancelOptimisedAnimation(appearId, "transform", frame, !(layout || layoutId));
	}
	const { parent } = projectionNode;
	if (parent && !parent.hasCheckedOptimisedAppear) cancelTreeOptimisedTransformAnimations(parent);
}
function createProjectionNode({ attachResizeListener, defaultParent, measureScroll, checkIsScrollRoot, resetTransform }) {
	return class ProjectionNode {
		constructor(latestValues = {}, parent = defaultParent === null || defaultParent === void 0 ? void 0 : defaultParent()) {
			/**
			* A unique ID generated for every projection node.
			*/
			this.id = id++;
			/**
			* An id that represents a unique session instigated by startUpdate.
			*/
			this.animationId = 0;
			/**
			* A Set containing all this component's children. This is used to iterate
			* through the children.
			*
			* TODO: This could be faster to iterate as a flat array stored on the root node.
			*/
			this.children = /* @__PURE__ */ new Set();
			/**
			* Options for the node. We use this to configure what kind of layout animations
			* we should perform (if any).
			*/
			this.options = {};
			/**
			* We use this to detect when its safe to shut down part of a projection tree.
			* We have to keep projecting children for scale correction and relative projection
			* until all their parents stop performing layout animations.
			*/
			this.isTreeAnimating = false;
			this.isAnimationBlocked = false;
			/**
			* Flag to true if we think this layout has been changed. We can't always know this,
			* currently we set it to true every time a component renders, or if it has a layoutDependency
			* if that has changed between renders. Additionally, components can be grouped by LayoutGroup
			* and if one node is dirtied, they all are.
			*/
			this.isLayoutDirty = false;
			/**
			* Flag to true if we think the projection calculations for this node needs
			* recalculating as a result of an updated transform or layout animation.
			*/
			this.isProjectionDirty = false;
			/**
			* Flag to true if the layout *or* transform has changed. This then gets propagated
			* throughout the projection tree, forcing any element below to recalculate on the next frame.
			*/
			this.isSharedProjectionDirty = false;
			/**
			* Flag transform dirty. This gets propagated throughout the whole tree but is only
			* respected by shared nodes.
			*/
			this.isTransformDirty = false;
			/**
			* Block layout updates for instant layout transitions throughout the tree.
			*/
			this.updateManuallyBlocked = false;
			this.updateBlockedByResize = false;
			/**
			* Set to true between the start of the first `willUpdate` call and the end of the `didUpdate`
			* call.
			*/
			this.isUpdating = false;
			/**
			* If this is an SVG element we currently disable projection transforms
			*/
			this.isSVG = false;
			/**
			* Flag to true (during promotion) if a node doing an instant layout transition needs to reset
			* its projection styles.
			*/
			this.needsReset = false;
			/**
			* Flags whether this node should have its transform reset prior to measuring.
			*/
			this.shouldResetTransform = false;
			/**
			* Store whether this node has been checked for optimised appear animations. As
			* effects fire bottom-up, and we want to look up the tree for appear animations,
			* this makes sure we only check each path once, stopping at nodes that
			* have already been checked.
			*/
			this.hasCheckedOptimisedAppear = false;
			/**
			* An object representing the calculated contextual/accumulated/tree scale.
			* This will be used to scale calculcated projection transforms, as these are
			* calculated in screen-space but need to be scaled for elements to layoutly
			* make it to their calculated destinations.
			*
			* TODO: Lazy-init
			*/
			this.treeScale = {
				x: 1,
				y: 1
			};
			/**
			*
			*/
			this.eventHandlers = /* @__PURE__ */ new Map();
			this.hasTreeAnimated = false;
			this.updateScheduled = false;
			this.scheduleUpdate = () => this.update();
			this.projectionUpdateScheduled = false;
			this.checkUpdateFailed = () => {
				if (this.isUpdating) {
					this.isUpdating = false;
					this.clearAllSnapshots();
				}
			};
			/**
			* This is a multi-step process as shared nodes might be of different depths. Nodes
			* are sorted by depth order, so we need to resolve the entire tree before moving to
			* the next step.
			*/
			this.updateProjection = () => {
				this.projectionUpdateScheduled = false;
				/**
				* Reset debug counts. Manually resetting rather than creating a new
				* object each frame.
				*/
				if (isDebug) metrics.totalNodes = metrics.resolvedTargetDeltas = metrics.recalculatedProjection = 0;
				this.nodes.forEach(propagateDirtyNodes);
				this.nodes.forEach(resolveTargetDelta);
				this.nodes.forEach(calcProjection);
				this.nodes.forEach(cleanDirtyNodes);
				if (isDebug) window.MotionDebug.record(metrics);
			};
			/**
			* Frame calculations
			*/
			this.resolvedRelativeTargetAt = 0;
			this.hasProjected = false;
			this.isVisible = true;
			this.animationProgress = 0;
			/**
			* Shared layout
			*/
			this.sharedNodes = /* @__PURE__ */ new Map();
			this.latestValues = latestValues;
			this.root = parent ? parent.root || parent : this;
			this.path = parent ? [...parent.path, parent] : [];
			this.parent = parent;
			this.depth = parent ? parent.depth + 1 : 0;
			for (let i = 0; i < this.path.length; i++) this.path[i].shouldResetTransform = true;
			if (this.root === this) this.nodes = new FlatTree();
		}
		addEventListener(name, handler) {
			if (!this.eventHandlers.has(name)) this.eventHandlers.set(name, new SubscriptionManager());
			return this.eventHandlers.get(name).add(handler);
		}
		notifyListeners(name, ...args) {
			const subscriptionManager = this.eventHandlers.get(name);
			subscriptionManager && subscriptionManager.notify(...args);
		}
		hasListeners(name) {
			return this.eventHandlers.has(name);
		}
		/**
		* Lifecycles
		*/
		mount(instance, isLayoutDirty = this.root.hasTreeAnimated) {
			if (this.instance) return;
			this.isSVG = isSVGElement(instance);
			this.instance = instance;
			const { layoutId, layout, visualElement } = this.options;
			if (visualElement && !visualElement.current) visualElement.mount(instance);
			this.root.nodes.add(this);
			this.parent && this.parent.children.add(this);
			if (isLayoutDirty && (layout || layoutId)) this.isLayoutDirty = true;
			if (attachResizeListener) {
				let cancelDelay;
				const resizeUnblockUpdate = () => this.root.updateBlockedByResize = false;
				attachResizeListener(instance, () => {
					this.root.updateBlockedByResize = true;
					cancelDelay && cancelDelay();
					cancelDelay = delay(resizeUnblockUpdate, 250);
					if (globalProjectionState.hasAnimatedSinceResize) {
						globalProjectionState.hasAnimatedSinceResize = false;
						this.nodes.forEach(finishAnimation);
					}
				});
			}
			if (layoutId) this.root.registerSharedNode(layoutId, this);
			if (this.options.animate !== false && visualElement && (layoutId || layout)) this.addEventListener("didUpdate", ({ delta, hasLayoutChanged, hasRelativeTargetChanged, layout: newLayout }) => {
				if (this.isTreeAnimationBlocked()) {
					this.target = void 0;
					this.relativeTarget = void 0;
					return;
				}
				const layoutTransition = this.options.transition || visualElement.getDefaultTransition() || defaultLayoutTransition;
				const { onLayoutAnimationStart, onLayoutAnimationComplete } = visualElement.getProps();
				/**
				* The target layout of the element might stay the same,
				* but its position relative to its parent has changed.
				*/
				const targetChanged = !this.targetLayout || !boxEqualsRounded(this.targetLayout, newLayout) || hasRelativeTargetChanged;
				/**
				* If the layout hasn't seemed to have changed, it might be that the
				* element is visually in the same place in the document but its position
				* relative to its parent has indeed changed. So here we check for that.
				*/
				const hasOnlyRelativeTargetChanged = !hasLayoutChanged && hasRelativeTargetChanged;
				if (this.options.layoutRoot || this.resumeFrom && this.resumeFrom.instance || hasOnlyRelativeTargetChanged || hasLayoutChanged && (targetChanged || !this.currentAnimation)) {
					if (this.resumeFrom) {
						this.resumingFrom = this.resumeFrom;
						this.resumingFrom.resumingFrom = void 0;
					}
					this.setAnimationOrigin(delta, hasOnlyRelativeTargetChanged);
					const animationOptions = {
						...getValueTransition$1(layoutTransition, "layout"),
						onPlay: onLayoutAnimationStart,
						onComplete: onLayoutAnimationComplete
					};
					if (visualElement.shouldReduceMotion || this.options.layoutRoot) {
						animationOptions.delay = 0;
						animationOptions.type = false;
					}
					this.startAnimation(animationOptions);
				} else {
					/**
					* If the layout hasn't changed and we have an animation that hasn't started yet,
					* finish it immediately. Otherwise it will be animating from a location
					* that was probably never commited to screen and look like a jumpy box.
					*/
					if (!hasLayoutChanged) finishAnimation(this);
					if (this.isLead() && this.options.onExitComplete) this.options.onExitComplete();
				}
				this.targetLayout = newLayout;
			});
		}
		unmount() {
			this.options.layoutId && this.willUpdate();
			this.root.nodes.remove(this);
			const stack = this.getStack();
			stack && stack.remove(this);
			this.parent && this.parent.children.delete(this);
			this.instance = void 0;
			cancelFrame(this.updateProjection);
		}
		blockUpdate() {
			this.updateManuallyBlocked = true;
		}
		unblockUpdate() {
			this.updateManuallyBlocked = false;
		}
		isUpdateBlocked() {
			return this.updateManuallyBlocked || this.updateBlockedByResize;
		}
		isTreeAnimationBlocked() {
			return this.isAnimationBlocked || this.parent && this.parent.isTreeAnimationBlocked() || false;
		}
		startUpdate() {
			if (this.isUpdateBlocked()) return;
			this.isUpdating = true;
			this.nodes && this.nodes.forEach(resetSkewAndRotation);
			this.animationId++;
		}
		getTransformTemplate() {
			const { visualElement } = this.options;
			return visualElement && visualElement.getProps().transformTemplate;
		}
		willUpdate(shouldNotifyListeners = true) {
			this.root.hasTreeAnimated = true;
			if (this.root.isUpdateBlocked()) {
				this.options.onExitComplete && this.options.onExitComplete();
				return;
			}
			/**
			* If we're running optimised appear animations then these must be
			* cancelled before measuring the DOM. This is so we can measure
			* the true layout of the element rather than the WAAPI animation
			* which will be unaffected by the resetSkewAndRotate step.
			*
			* Note: This is a DOM write. Worst case scenario is this is sandwiched
			* between other snapshot reads which will cause unnecessary style recalculations.
			* This has to happen here though, as we don't yet know which nodes will need
			* snapshots in startUpdate(), but we only want to cancel optimised animations
			* if a layout animation measurement is actually going to be affected by them.
			*/
			if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear) cancelTreeOptimisedTransformAnimations(this);
			!this.root.isUpdating && this.root.startUpdate();
			if (this.isLayoutDirty) return;
			this.isLayoutDirty = true;
			for (let i = 0; i < this.path.length; i++) {
				const node = this.path[i];
				node.shouldResetTransform = true;
				node.updateScroll("snapshot");
				if (node.options.layoutRoot) node.willUpdate(false);
			}
			const { layoutId, layout } = this.options;
			if (layoutId === void 0 && !layout) return;
			const transformTemplate = this.getTransformTemplate();
			this.prevTransformTemplateValue = transformTemplate ? transformTemplate(this.latestValues, "") : void 0;
			this.updateSnapshot();
			shouldNotifyListeners && this.notifyListeners("willUpdate");
		}
		update() {
			this.updateScheduled = false;
			if (this.isUpdateBlocked()) {
				this.unblockUpdate();
				this.clearAllSnapshots();
				this.nodes.forEach(clearMeasurements);
				return;
			}
			if (!this.isUpdating) this.nodes.forEach(clearIsLayoutDirty);
			this.isUpdating = false;
			/**
			* Write
			*/
			this.nodes.forEach(resetTransformStyle);
			/**
			* Read ==================
			*/
			this.nodes.forEach(updateLayout);
			/**
			* Write
			*/
			this.nodes.forEach(notifyLayoutUpdate);
			this.clearAllSnapshots();
			/**
			* Manually flush any pending updates. Ideally
			* we could leave this to the following requestAnimationFrame but this seems
			* to leave a flash of incorrectly styled content.
			*/
			const now = time.now();
			frameData.delta = clamp(0, 1e3 / 60, now - frameData.timestamp);
			frameData.timestamp = now;
			frameData.isProcessing = true;
			frameSteps.update.process(frameData);
			frameSteps.preRender.process(frameData);
			frameSteps.render.process(frameData);
			frameData.isProcessing = false;
		}
		didUpdate() {
			if (!this.updateScheduled) {
				this.updateScheduled = true;
				microtask.read(this.scheduleUpdate);
			}
		}
		clearAllSnapshots() {
			this.nodes.forEach(clearSnapshot);
			this.sharedNodes.forEach(removeLeadSnapshots);
		}
		scheduleUpdateProjection() {
			if (!this.projectionUpdateScheduled) {
				this.projectionUpdateScheduled = true;
				frame.preRender(this.updateProjection, false, true);
			}
		}
		scheduleCheckAfterUnmount() {
			/**
			* If the unmounting node is in a layoutGroup and did trigger a willUpdate,
			* we manually call didUpdate to give a chance to the siblings to animate.
			* Otherwise, cleanup all snapshots to prevents future nodes from reusing them.
			*/
			frame.postRender(() => {
				if (this.isLayoutDirty) this.root.didUpdate();
				else this.root.checkUpdateFailed();
			});
		}
		/**
		* Update measurements
		*/
		updateSnapshot() {
			if (this.snapshot || !this.instance) return;
			this.snapshot = this.measure();
		}
		updateLayout() {
			if (!this.instance) return;
			this.updateScroll();
			if (!(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty) return;
			/**
			* When a node is mounted, it simply resumes from the prevLead's
			* snapshot instead of taking a new one, but the ancestors scroll
			* might have updated while the prevLead is unmounted. We need to
			* update the scroll again to make sure the layout we measure is
			* up to date.
			*/
			if (this.resumeFrom && !this.resumeFrom.instance) for (let i = 0; i < this.path.length; i++) this.path[i].updateScroll();
			const prevLayout = this.layout;
			this.layout = this.measure(false);
			this.layoutCorrected = createBox();
			this.isLayoutDirty = false;
			this.projectionDelta = void 0;
			this.notifyListeners("measure", this.layout.layoutBox);
			const { visualElement } = this.options;
			visualElement && visualElement.notify("LayoutMeasure", this.layout.layoutBox, prevLayout ? prevLayout.layoutBox : void 0);
		}
		updateScroll(phase = "measure") {
			let needsMeasurement = Boolean(this.options.layoutScroll && this.instance);
			if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === phase) needsMeasurement = false;
			if (needsMeasurement) {
				const isRoot = checkIsScrollRoot(this.instance);
				this.scroll = {
					animationId: this.root.animationId,
					phase,
					isRoot,
					offset: measureScroll(this.instance),
					wasRoot: this.scroll ? this.scroll.isRoot : isRoot
				};
			}
		}
		resetTransform() {
			if (!resetTransform) return;
			const isResetRequested = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout;
			const hasProjection = this.projectionDelta && !isDeltaZero(this.projectionDelta);
			const transformTemplate = this.getTransformTemplate();
			const transformTemplateValue = transformTemplate ? transformTemplate(this.latestValues, "") : void 0;
			const transformTemplateHasChanged = transformTemplateValue !== this.prevTransformTemplateValue;
			if (isResetRequested && (hasProjection || hasTransform(this.latestValues) || transformTemplateHasChanged)) {
				resetTransform(this.instance, transformTemplateValue);
				this.shouldResetTransform = false;
				this.scheduleRender();
			}
		}
		measure(removeTransform = true) {
			const pageBox = this.measurePageBox();
			let layoutBox = this.removeElementScroll(pageBox);
			/**
			* Measurements taken during the pre-render stage
			* still have transforms applied so we remove them
			* via calculation.
			*/
			if (removeTransform) layoutBox = this.removeTransform(layoutBox);
			roundBox(layoutBox);
			return {
				animationId: this.root.animationId,
				measuredBox: pageBox,
				layoutBox,
				latestValues: {},
				source: this.id
			};
		}
		measurePageBox() {
			var _a;
			const { visualElement } = this.options;
			if (!visualElement) return createBox();
			const box = visualElement.measureViewportBox();
			if (!(((_a = this.scroll) === null || _a === void 0 ? void 0 : _a.wasRoot) || this.path.some(checkNodeWasScrollRoot))) {
				const { scroll } = this.root;
				if (scroll) {
					translateAxis(box.x, scroll.offset.x);
					translateAxis(box.y, scroll.offset.y);
				}
			}
			return box;
		}
		removeElementScroll(box) {
			var _a;
			const boxWithoutScroll = createBox();
			copyBoxInto(boxWithoutScroll, box);
			if ((_a = this.scroll) === null || _a === void 0 ? void 0 : _a.wasRoot) return boxWithoutScroll;
			/**
			* Performance TODO: Keep a cumulative scroll offset down the tree
			* rather than loop back up the path.
			*/
			for (let i = 0; i < this.path.length; i++) {
				const node = this.path[i];
				const { scroll, options } = node;
				if (node !== this.root && scroll && options.layoutScroll) {
					/**
					* If this is a new scroll root, we want to remove all previous scrolls
					* from the viewport box.
					*/
					if (scroll.wasRoot) copyBoxInto(boxWithoutScroll, box);
					translateAxis(boxWithoutScroll.x, scroll.offset.x);
					translateAxis(boxWithoutScroll.y, scroll.offset.y);
				}
			}
			return boxWithoutScroll;
		}
		applyTransform(box, transformOnly = false) {
			const withTransforms = createBox();
			copyBoxInto(withTransforms, box);
			for (let i = 0; i < this.path.length; i++) {
				const node = this.path[i];
				if (!transformOnly && node.options.layoutScroll && node.scroll && node !== node.root) transformBox(withTransforms, {
					x: -node.scroll.offset.x,
					y: -node.scroll.offset.y
				});
				if (!hasTransform(node.latestValues)) continue;
				transformBox(withTransforms, node.latestValues);
			}
			if (hasTransform(this.latestValues)) transformBox(withTransforms, this.latestValues);
			return withTransforms;
		}
		removeTransform(box) {
			const boxWithoutTransform = createBox();
			copyBoxInto(boxWithoutTransform, box);
			for (let i = 0; i < this.path.length; i++) {
				const node = this.path[i];
				if (!node.instance) continue;
				if (!hasTransform(node.latestValues)) continue;
				hasScale(node.latestValues) && node.updateSnapshot();
				const sourceBox = createBox();
				copyBoxInto(sourceBox, node.measurePageBox());
				removeBoxTransforms(boxWithoutTransform, node.latestValues, node.snapshot ? node.snapshot.layoutBox : void 0, sourceBox);
			}
			if (hasTransform(this.latestValues)) removeBoxTransforms(boxWithoutTransform, this.latestValues);
			return boxWithoutTransform;
		}
		setTargetDelta(delta) {
			this.targetDelta = delta;
			this.root.scheduleUpdateProjection();
			this.isProjectionDirty = true;
		}
		setOptions(options) {
			this.options = {
				...this.options,
				...options,
				crossfade: options.crossfade !== void 0 ? options.crossfade : true
			};
		}
		clearMeasurements() {
			this.scroll = void 0;
			this.layout = void 0;
			this.snapshot = void 0;
			this.prevTransformTemplateValue = void 0;
			this.targetDelta = void 0;
			this.target = void 0;
			this.isLayoutDirty = false;
		}
		forceRelativeParentToResolveTarget() {
			if (!this.relativeParent) return;
			/**
			* If the parent target isn't up-to-date, force it to update.
			* This is an unfortunate de-optimisation as it means any updating relative
			* projection will cause all the relative parents to recalculate back
			* up the tree.
			*/
			if (this.relativeParent.resolvedRelativeTargetAt !== frameData.timestamp) this.relativeParent.resolveTargetDelta(true);
		}
		resolveTargetDelta(forceRecalculation = false) {
			var _a;
			/**
			* Once the dirty status of nodes has been spread through the tree, we also
			* need to check if we have a shared node of a different depth that has itself
			* been dirtied.
			*/
			const lead = this.getLead();
			this.isProjectionDirty || (this.isProjectionDirty = lead.isProjectionDirty);
			this.isTransformDirty || (this.isTransformDirty = lead.isTransformDirty);
			this.isSharedProjectionDirty || (this.isSharedProjectionDirty = lead.isSharedProjectionDirty);
			const isShared = Boolean(this.resumingFrom) || this !== lead;
			if (!(forceRecalculation || isShared && this.isSharedProjectionDirty || this.isProjectionDirty || ((_a = this.parent) === null || _a === void 0 ? void 0 : _a.isProjectionDirty) || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize)) return;
			const { layout, layoutId } = this.options;
			/**
			* If we have no layout, we can't perform projection, so early return
			*/
			if (!this.layout || !(layout || layoutId)) return;
			this.resolvedRelativeTargetAt = frameData.timestamp;
			/**
			* If we don't have a targetDelta but do have a layout, we can attempt to resolve
			* a relativeParent. This will allow a component to perform scale correction
			* even if no animation has started.
			*/
			if (!this.targetDelta && !this.relativeTarget) {
				const relativeParent = this.getClosestProjectingParent();
				if (relativeParent && relativeParent.layout && this.animationProgress !== 1) {
					this.relativeParent = relativeParent;
					this.forceRelativeParentToResolveTarget();
					this.relativeTarget = createBox();
					this.relativeTargetOrigin = createBox();
					calcRelativePosition(this.relativeTargetOrigin, this.layout.layoutBox, relativeParent.layout.layoutBox);
					copyBoxInto(this.relativeTarget, this.relativeTargetOrigin);
				} else this.relativeParent = this.relativeTarget = void 0;
			}
			/**
			* If we have no relative target or no target delta our target isn't valid
			* for this frame.
			*/
			if (!this.relativeTarget && !this.targetDelta) return;
			/**
			* Lazy-init target data structure
			*/
			if (!this.target) {
				this.target = createBox();
				this.targetWithTransforms = createBox();
			}
			/**
			* If we've got a relative box for this component, resolve it into a target relative to the parent.
			*/
			if (this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target) {
				this.forceRelativeParentToResolveTarget();
				calcRelativeBox(this.target, this.relativeTarget, this.relativeParent.target);
			} else if (this.targetDelta) {
				if (Boolean(this.resumingFrom)) this.target = this.applyTransform(this.layout.layoutBox);
				else copyBoxInto(this.target, this.layout.layoutBox);
				applyBoxDelta(this.target, this.targetDelta);
			} else
 /**
			* If no target, use own layout as target
			*/
			copyBoxInto(this.target, this.layout.layoutBox);
			/**
			* If we've been told to attempt to resolve a relative target, do so.
			*/
			if (this.attemptToResolveRelativeTarget) {
				this.attemptToResolveRelativeTarget = false;
				const relativeParent = this.getClosestProjectingParent();
				if (relativeParent && Boolean(relativeParent.resumingFrom) === Boolean(this.resumingFrom) && !relativeParent.options.layoutScroll && relativeParent.target && this.animationProgress !== 1) {
					this.relativeParent = relativeParent;
					this.forceRelativeParentToResolveTarget();
					this.relativeTarget = createBox();
					this.relativeTargetOrigin = createBox();
					calcRelativePosition(this.relativeTargetOrigin, this.target, relativeParent.target);
					copyBoxInto(this.relativeTarget, this.relativeTargetOrigin);
				} else this.relativeParent = this.relativeTarget = void 0;
			}
			/**
			* Increase debug counter for resolved target deltas
			*/
			if (isDebug) metrics.resolvedTargetDeltas++;
		}
		getClosestProjectingParent() {
			if (!this.parent || hasScale(this.parent.latestValues) || has2DTranslate(this.parent.latestValues)) return;
			if (this.parent.isProjecting()) return this.parent;
			else return this.parent.getClosestProjectingParent();
		}
		isProjecting() {
			return Boolean((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
		}
		calcProjection() {
			var _a;
			const lead = this.getLead();
			const isShared = Boolean(this.resumingFrom) || this !== lead;
			let canSkip = true;
			/**
			* If this is a normal layout animation and neither this node nor its nearest projecting
			* is dirty then we can't skip.
			*/
			if (this.isProjectionDirty || ((_a = this.parent) === null || _a === void 0 ? void 0 : _a.isProjectionDirty)) canSkip = false;
			/**
			* If this is a shared layout animation and this node's shared projection is dirty then
			* we can't skip.
			*/
			if (isShared && (this.isSharedProjectionDirty || this.isTransformDirty)) canSkip = false;
			/**
			* If we have resolved the target this frame we must recalculate the
			* projection to ensure it visually represents the internal calculations.
			*/
			if (this.resolvedRelativeTargetAt === frameData.timestamp) canSkip = false;
			if (canSkip) return;
			const { layout, layoutId } = this.options;
			/**
			* If this section of the tree isn't animating we can
			* delete our target sources for the following frame.
			*/
			this.isTreeAnimating = Boolean(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation);
			if (!this.isTreeAnimating) this.targetDelta = this.relativeTarget = void 0;
			if (!this.layout || !(layout || layoutId)) return;
			/**
			* Reset the corrected box with the latest values from box, as we're then going
			* to perform mutative operations on it.
			*/
			copyBoxInto(this.layoutCorrected, this.layout.layoutBox);
			/**
			* Record previous tree scales before updating.
			*/
			const prevTreeScaleX = this.treeScale.x;
			const prevTreeScaleY = this.treeScale.y;
			/**
			* Apply all the parent deltas to this box to produce the corrected box. This
			* is the layout box, as it will appear on screen as a result of the transforms of its parents.
			*/
			applyTreeDeltas(this.layoutCorrected, this.treeScale, this.path, isShared);
			/**
			* If this layer needs to perform scale correction but doesn't have a target,
			* use the layout as the target.
			*/
			if (lead.layout && !lead.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1)) {
				lead.target = lead.layout.layoutBox;
				lead.targetWithTransforms = createBox();
			}
			const { target } = lead;
			if (!target) {
				/**
				* If we don't have a target to project into, but we were previously
				* projecting, we want to remove the stored transform and schedule
				* a render to ensure the elements reflect the removed transform.
				*/
				if (this.prevProjectionDelta) {
					this.createProjectionDeltas();
					this.scheduleRender();
				}
				return;
			}
			if (!this.projectionDelta || !this.prevProjectionDelta) this.createProjectionDeltas();
			else {
				copyAxisDeltaInto(this.prevProjectionDelta.x, this.projectionDelta.x);
				copyAxisDeltaInto(this.prevProjectionDelta.y, this.projectionDelta.y);
			}
			/**
			* Update the delta between the corrected box and the target box before user-set transforms were applied.
			* This will allow us to calculate the corrected borderRadius and boxShadow to compensate
			* for our layout reprojection, but still allow them to be scaled correctly by the user.
			* It might be that to simplify this we may want to accept that user-set scale is also corrected
			* and we wouldn't have to keep and calc both deltas, OR we could support a user setting
			* to allow people to choose whether these styles are corrected based on just the
			* layout reprojection or the final bounding box.
			*/
			calcBoxDelta(this.projectionDelta, this.layoutCorrected, target, this.latestValues);
			if (this.treeScale.x !== prevTreeScaleX || this.treeScale.y !== prevTreeScaleY || !axisDeltaEquals(this.projectionDelta.x, this.prevProjectionDelta.x) || !axisDeltaEquals(this.projectionDelta.y, this.prevProjectionDelta.y)) {
				this.hasProjected = true;
				this.scheduleRender();
				this.notifyListeners("projectionUpdate", target);
			}
			/**
			* Increase debug counter for recalculated projections
			*/
			if (isDebug) metrics.recalculatedProjection++;
		}
		hide() {
			this.isVisible = false;
		}
		show() {
			this.isVisible = true;
		}
		scheduleRender(notifyAll = true) {
			var _a;
			(_a = this.options.visualElement) === null || _a === void 0 || _a.scheduleRender();
			if (notifyAll) {
				const stack = this.getStack();
				stack && stack.scheduleRender();
			}
			if (this.resumingFrom && !this.resumingFrom.instance) this.resumingFrom = void 0;
		}
		createProjectionDeltas() {
			this.prevProjectionDelta = createDelta();
			this.projectionDelta = createDelta();
			this.projectionDeltaWithTransform = createDelta();
		}
		setAnimationOrigin(delta, hasOnlyRelativeTargetChanged = false) {
			const snapshot = this.snapshot;
			const snapshotLatestValues = snapshot ? snapshot.latestValues : {};
			const mixedValues = { ...this.latestValues };
			const targetDelta = createDelta();
			if (!this.relativeParent || !this.relativeParent.options.layoutRoot) this.relativeTarget = this.relativeTargetOrigin = void 0;
			this.attemptToResolveRelativeTarget = !hasOnlyRelativeTargetChanged;
			const relativeLayout = createBox();
			const isSharedLayoutAnimation = (snapshot ? snapshot.source : void 0) !== (this.layout ? this.layout.source : void 0);
			const stack = this.getStack();
			const isOnlyMember = !stack || stack.members.length <= 1;
			const shouldCrossfadeOpacity = Boolean(isSharedLayoutAnimation && !isOnlyMember && this.options.crossfade === true && !this.path.some(hasOpacityCrossfade));
			this.animationProgress = 0;
			let prevRelativeTarget;
			this.mixTargetDelta = (latest) => {
				const progress = latest / 1e3;
				mixAxisDelta(targetDelta.x, delta.x, progress);
				mixAxisDelta(targetDelta.y, delta.y, progress);
				this.setTargetDelta(targetDelta);
				if (this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout) {
					calcRelativePosition(relativeLayout, this.layout.layoutBox, this.relativeParent.layout.layoutBox);
					mixBox(this.relativeTarget, this.relativeTargetOrigin, relativeLayout, progress);
					/**
					* If this is an unchanged relative target we can consider the
					* projection not dirty.
					*/
					if (prevRelativeTarget && boxEquals(this.relativeTarget, prevRelativeTarget)) this.isProjectionDirty = false;
					if (!prevRelativeTarget) prevRelativeTarget = createBox();
					copyBoxInto(prevRelativeTarget, this.relativeTarget);
				}
				if (isSharedLayoutAnimation) {
					this.animationValues = mixedValues;
					mixValues(mixedValues, snapshotLatestValues, this.latestValues, progress, shouldCrossfadeOpacity, isOnlyMember);
				}
				this.root.scheduleUpdateProjection();
				this.scheduleRender();
				this.animationProgress = progress;
			};
			this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
		}
		startAnimation(options) {
			this.notifyListeners("animationStart");
			this.currentAnimation && this.currentAnimation.stop();
			if (this.resumingFrom && this.resumingFrom.currentAnimation) this.resumingFrom.currentAnimation.stop();
			if (this.pendingAnimation) {
				cancelFrame(this.pendingAnimation);
				this.pendingAnimation = void 0;
			}
			/**
			* Start the animation in the next frame to have a frame with progress 0,
			* where the target is the same as when the animation started, so we can
			* calculate the relative positions correctly for instant transitions.
			*/
			this.pendingAnimation = frame.update(() => {
				globalProjectionState.hasAnimatedSinceResize = true;
				this.currentAnimation = animateSingleValue(0, animationTarget, {
					...options,
					onUpdate: (latest) => {
						this.mixTargetDelta(latest);
						options.onUpdate && options.onUpdate(latest);
					},
					onComplete: () => {
						options.onComplete && options.onComplete();
						this.completeAnimation();
					}
				});
				if (this.resumingFrom) this.resumingFrom.currentAnimation = this.currentAnimation;
				this.pendingAnimation = void 0;
			});
		}
		completeAnimation() {
			if (this.resumingFrom) {
				this.resumingFrom.currentAnimation = void 0;
				this.resumingFrom.preserveOpacity = void 0;
			}
			const stack = this.getStack();
			stack && stack.exitAnimationComplete();
			this.resumingFrom = this.currentAnimation = this.animationValues = void 0;
			this.notifyListeners("animationComplete");
		}
		finishAnimation() {
			if (this.currentAnimation) {
				this.mixTargetDelta && this.mixTargetDelta(animationTarget);
				this.currentAnimation.stop();
			}
			this.completeAnimation();
		}
		applyTransformsToTarget() {
			const lead = this.getLead();
			let { targetWithTransforms, target, layout, latestValues } = lead;
			if (!targetWithTransforms || !target || !layout) return;
			/**
			* If we're only animating position, and this element isn't the lead element,
			* then instead of projecting into the lead box we instead want to calculate
			* a new target that aligns the two boxes but maintains the layout shape.
			*/
			if (this !== lead && this.layout && layout && shouldAnimatePositionOnly(this.options.animationType, this.layout.layoutBox, layout.layoutBox)) {
				target = this.target || createBox();
				const xLength = calcLength(this.layout.layoutBox.x);
				target.x.min = lead.target.x.min;
				target.x.max = target.x.min + xLength;
				const yLength = calcLength(this.layout.layoutBox.y);
				target.y.min = lead.target.y.min;
				target.y.max = target.y.min + yLength;
			}
			copyBoxInto(targetWithTransforms, target);
			/**
			* Apply the latest user-set transforms to the targetBox to produce the targetBoxFinal.
			* This is the final box that we will then project into by calculating a transform delta and
			* applying it to the corrected box.
			*/
			transformBox(targetWithTransforms, latestValues);
			/**
			* Update the delta between the corrected box and the final target box, after
			* user-set transforms are applied to it. This will be used by the renderer to
			* create a transform style that will reproject the element from its layout layout
			* into the desired bounding box.
			*/
			calcBoxDelta(this.projectionDeltaWithTransform, this.layoutCorrected, targetWithTransforms, latestValues);
		}
		registerSharedNode(layoutId, node) {
			if (!this.sharedNodes.has(layoutId)) this.sharedNodes.set(layoutId, new NodeStack());
			this.sharedNodes.get(layoutId).add(node);
			const config = node.options.initialPromotionConfig;
			node.promote({
				transition: config ? config.transition : void 0,
				preserveFollowOpacity: config && config.shouldPreserveFollowOpacity ? config.shouldPreserveFollowOpacity(node) : void 0
			});
		}
		isLead() {
			const stack = this.getStack();
			return stack ? stack.lead === this : true;
		}
		getLead() {
			var _a;
			const { layoutId } = this.options;
			return layoutId ? ((_a = this.getStack()) === null || _a === void 0 ? void 0 : _a.lead) || this : this;
		}
		getPrevLead() {
			var _a;
			const { layoutId } = this.options;
			return layoutId ? (_a = this.getStack()) === null || _a === void 0 ? void 0 : _a.prevLead : void 0;
		}
		getStack() {
			const { layoutId } = this.options;
			if (layoutId) return this.root.sharedNodes.get(layoutId);
		}
		promote({ needsReset, transition, preserveFollowOpacity } = {}) {
			const stack = this.getStack();
			if (stack) stack.promote(this, preserveFollowOpacity);
			if (needsReset) {
				this.projectionDelta = void 0;
				this.needsReset = true;
			}
			if (transition) this.setOptions({ transition });
		}
		relegate() {
			const stack = this.getStack();
			if (stack) return stack.relegate(this);
			else return false;
		}
		resetSkewAndRotation() {
			const { visualElement } = this.options;
			if (!visualElement) return;
			let hasDistortingTransform = false;
			/**
			* An unrolled check for rotation values. Most elements don't have any rotation and
			* skipping the nested loop and new object creation is 50% faster.
			*/
			const { latestValues } = visualElement;
			if (latestValues.z || latestValues.rotate || latestValues.rotateX || latestValues.rotateY || latestValues.rotateZ || latestValues.skewX || latestValues.skewY) hasDistortingTransform = true;
			if (!hasDistortingTransform) return;
			const resetValues = {};
			if (latestValues.z) resetDistortingTransform("z", visualElement, resetValues, this.animationValues);
			for (let i = 0; i < transformAxes.length; i++) {
				resetDistortingTransform(`rotate${transformAxes[i]}`, visualElement, resetValues, this.animationValues);
				resetDistortingTransform(`skew${transformAxes[i]}`, visualElement, resetValues, this.animationValues);
			}
			visualElement.render();
			for (const key in resetValues) {
				visualElement.setStaticValue(key, resetValues[key]);
				if (this.animationValues) this.animationValues[key] = resetValues[key];
			}
			visualElement.scheduleRender();
		}
		getProjectionStyles(styleProp) {
			var _a, _b;
			if (!this.instance || this.isSVG) return void 0;
			if (!this.isVisible) return hiddenVisibility;
			const styles = { visibility: "" };
			const transformTemplate = this.getTransformTemplate();
			if (this.needsReset) {
				this.needsReset = false;
				styles.opacity = "";
				styles.pointerEvents = resolveMotionValue(styleProp === null || styleProp === void 0 ? void 0 : styleProp.pointerEvents) || "";
				styles.transform = transformTemplate ? transformTemplate(this.latestValues, "") : "none";
				return styles;
			}
			const lead = this.getLead();
			if (!this.projectionDelta || !this.layout || !lead.target) {
				const emptyStyles = {};
				if (this.options.layoutId) {
					emptyStyles.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1;
					emptyStyles.pointerEvents = resolveMotionValue(styleProp === null || styleProp === void 0 ? void 0 : styleProp.pointerEvents) || "";
				}
				if (this.hasProjected && !hasTransform(this.latestValues)) {
					emptyStyles.transform = transformTemplate ? transformTemplate({}, "") : "none";
					this.hasProjected = false;
				}
				return emptyStyles;
			}
			const valuesToRender = lead.animationValues || lead.latestValues;
			this.applyTransformsToTarget();
			styles.transform = buildProjectionTransform(this.projectionDeltaWithTransform, this.treeScale, valuesToRender);
			if (transformTemplate) styles.transform = transformTemplate(valuesToRender, styles.transform);
			const { x, y } = this.projectionDelta;
			styles.transformOrigin = `${x.origin * 100}% ${y.origin * 100}% 0`;
			if (lead.animationValues)
 /**
			* If the lead component is animating, assign this either the entering/leaving
			* opacity
			*/
			styles.opacity = lead === this ? (_b = (_a = valuesToRender.opacity) !== null && _a !== void 0 ? _a : this.latestValues.opacity) !== null && _b !== void 0 ? _b : 1 : this.preserveOpacity ? this.latestValues.opacity : valuesToRender.opacityExit;
			else
 /**
			* Or we're not animating at all, set the lead component to its layout
			* opacity and other components to hidden.
			*/
			styles.opacity = lead === this ? valuesToRender.opacity !== void 0 ? valuesToRender.opacity : "" : valuesToRender.opacityExit !== void 0 ? valuesToRender.opacityExit : 0;
			/**
			* Apply scale correction
			*/
			for (const key in scaleCorrectors) {
				if (valuesToRender[key] === void 0) continue;
				const { correct, applyTo } = scaleCorrectors[key];
				/**
				* Only apply scale correction to the value if we have an
				* active projection transform. Otherwise these values become
				* vulnerable to distortion if the element changes size without
				* a corresponding layout animation.
				*/
				const corrected = styles.transform === "none" ? valuesToRender[key] : correct(valuesToRender[key], lead);
				if (applyTo) {
					const num = applyTo.length;
					for (let i = 0; i < num; i++) styles[applyTo[i]] = corrected;
				} else styles[key] = corrected;
			}
			/**
			* Disable pointer events on follow components. This is to ensure
			* that if a follow component covers a lead component it doesn't block
			* pointer events on the lead.
			*/
			if (this.options.layoutId) styles.pointerEvents = lead === this ? resolveMotionValue(styleProp === null || styleProp === void 0 ? void 0 : styleProp.pointerEvents) || "" : "none";
			return styles;
		}
		clearSnapshot() {
			this.resumeFrom = this.snapshot = void 0;
		}
		resetTree() {
			this.root.nodes.forEach((node) => {
				var _a;
				return (_a = node.currentAnimation) === null || _a === void 0 ? void 0 : _a.stop();
			});
			this.root.nodes.forEach(clearMeasurements);
			this.root.sharedNodes.clear();
		}
	};
}
function updateLayout(node) {
	node.updateLayout();
}
function notifyLayoutUpdate(node) {
	var _a;
	const snapshot = ((_a = node.resumeFrom) === null || _a === void 0 ? void 0 : _a.snapshot) || node.snapshot;
	if (node.isLead() && node.layout && snapshot && node.hasListeners("didUpdate")) {
		const { layoutBox: layout, measuredBox: measuredLayout } = node.layout;
		const { animationType } = node.options;
		const isShared = snapshot.source !== node.layout.source;
		if (animationType === "size") eachAxis((axis) => {
			const axisSnapshot = isShared ? snapshot.measuredBox[axis] : snapshot.layoutBox[axis];
			const length = calcLength(axisSnapshot);
			axisSnapshot.min = layout[axis].min;
			axisSnapshot.max = axisSnapshot.min + length;
		});
		else if (shouldAnimatePositionOnly(animationType, snapshot.layoutBox, layout)) eachAxis((axis) => {
			const axisSnapshot = isShared ? snapshot.measuredBox[axis] : snapshot.layoutBox[axis];
			const length = calcLength(layout[axis]);
			axisSnapshot.max = axisSnapshot.min + length;
			/**
			* Ensure relative target gets resized and rerendererd
			*/
			if (node.relativeTarget && !node.currentAnimation) {
				node.isProjectionDirty = true;
				node.relativeTarget[axis].max = node.relativeTarget[axis].min + length;
			}
		});
		const layoutDelta = createDelta();
		calcBoxDelta(layoutDelta, layout, snapshot.layoutBox);
		const visualDelta = createDelta();
		if (isShared) calcBoxDelta(visualDelta, node.applyTransform(measuredLayout, true), snapshot.measuredBox);
		else calcBoxDelta(visualDelta, layout, snapshot.layoutBox);
		const hasLayoutChanged = !isDeltaZero(layoutDelta);
		let hasRelativeTargetChanged = false;
		if (!node.resumeFrom) {
			const relativeParent = node.getClosestProjectingParent();
			/**
			* If the relativeParent is itself resuming from a different element then
			* the relative snapshot is not relavent
			*/
			if (relativeParent && !relativeParent.resumeFrom) {
				const { snapshot: parentSnapshot, layout: parentLayout } = relativeParent;
				if (parentSnapshot && parentLayout) {
					const relativeSnapshot = createBox();
					calcRelativePosition(relativeSnapshot, snapshot.layoutBox, parentSnapshot.layoutBox);
					const relativeLayout = createBox();
					calcRelativePosition(relativeLayout, layout, parentLayout.layoutBox);
					if (!boxEqualsRounded(relativeSnapshot, relativeLayout)) hasRelativeTargetChanged = true;
					if (relativeParent.options.layoutRoot) {
						node.relativeTarget = relativeLayout;
						node.relativeTargetOrigin = relativeSnapshot;
						node.relativeParent = relativeParent;
					}
				}
			}
		}
		node.notifyListeners("didUpdate", {
			layout,
			snapshot,
			delta: visualDelta,
			layoutDelta,
			hasLayoutChanged,
			hasRelativeTargetChanged
		});
	} else if (node.isLead()) {
		const { onExitComplete } = node.options;
		onExitComplete && onExitComplete();
	}
	/**
	* Clearing transition
	* TODO: Investigate why this transition is being passed in as {type: false } from Framer
	* and why we need it at all
	*/
	node.options.transition = void 0;
}
function propagateDirtyNodes(node) {
	/**
	* Increase debug counter for nodes encountered this frame
	*/
	if (isDebug) metrics.totalNodes++;
	if (!node.parent) return;
	/**
	* If this node isn't projecting, propagate isProjectionDirty. It will have
	* no performance impact but it will allow the next child that *is* projecting
	* but *isn't* dirty to just check its parent to see if *any* ancestor needs
	* correcting.
	*/
	if (!node.isProjecting()) node.isProjectionDirty = node.parent.isProjectionDirty;
	/**
	* Propagate isSharedProjectionDirty and isTransformDirty
	* throughout the whole tree. A future revision can take another look at
	* this but for safety we still recalcualte shared nodes.
	*/
	node.isSharedProjectionDirty || (node.isSharedProjectionDirty = Boolean(node.isProjectionDirty || node.parent.isProjectionDirty || node.parent.isSharedProjectionDirty));
	node.isTransformDirty || (node.isTransformDirty = node.parent.isTransformDirty);
}
function cleanDirtyNodes(node) {
	node.isProjectionDirty = node.isSharedProjectionDirty = node.isTransformDirty = false;
}
function clearSnapshot(node) {
	node.clearSnapshot();
}
function clearMeasurements(node) {
	node.clearMeasurements();
}
function clearIsLayoutDirty(node) {
	node.isLayoutDirty = false;
}
function resetTransformStyle(node) {
	const { visualElement } = node.options;
	if (visualElement && visualElement.getProps().onBeforeLayoutMeasure) visualElement.notify("BeforeLayoutMeasure");
	node.resetTransform();
}
function finishAnimation(node) {
	node.finishAnimation();
	node.targetDelta = node.relativeTarget = node.target = void 0;
	node.isProjectionDirty = true;
}
function resolveTargetDelta(node) {
	node.resolveTargetDelta();
}
function calcProjection(node) {
	node.calcProjection();
}
function resetSkewAndRotation(node) {
	node.resetSkewAndRotation();
}
function removeLeadSnapshots(stack) {
	stack.removeLeadSnapshot();
}
function mixAxisDelta(output, delta, p) {
	output.translate = mixNumber$1(delta.translate, 0, p);
	output.scale = mixNumber$1(delta.scale, 1, p);
	output.origin = delta.origin;
	output.originPoint = delta.originPoint;
}
function mixAxis(output, from, to, p) {
	output.min = mixNumber$1(from.min, to.min, p);
	output.max = mixNumber$1(from.max, to.max, p);
}
function mixBox(output, from, to, p) {
	mixAxis(output.x, from.x, to.x, p);
	mixAxis(output.y, from.y, to.y, p);
}
function hasOpacityCrossfade(node) {
	return node.animationValues && node.animationValues.opacityExit !== void 0;
}
var defaultLayoutTransition = {
	duration: .45,
	ease: [
		.4,
		0,
		.1,
		1
	]
};
var userAgentContains = (string) => typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(string);
/**
* Measured bounding boxes must be rounded in Safari and
* left untouched in Chrome, otherwise non-integer layouts within scaled-up elements
* can appear to jump.
*/
var roundPoint = userAgentContains("applewebkit/") && !userAgentContains("chrome/") ? Math.round : noop;
function roundAxis(axis) {
	axis.min = roundPoint(axis.min);
	axis.max = roundPoint(axis.max);
}
function roundBox(box) {
	roundAxis(box.x);
	roundAxis(box.y);
}
function shouldAnimatePositionOnly(animationType, snapshot, layout) {
	return animationType === "position" || animationType === "preserve-aspect" && !isNear(aspectRatio(snapshot), aspectRatio(layout), .2);
}
function checkNodeWasScrollRoot(node) {
	var _a;
	return node !== node.root && ((_a = node.scroll) === null || _a === void 0 ? void 0 : _a.wasRoot);
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/projection/node/DocumentProjectionNode.mjs
var DocumentProjectionNode = createProjectionNode({
	attachResizeListener: (ref, notify) => addDomEvent(ref, "resize", notify),
	measureScroll: () => ({
		x: document.documentElement.scrollLeft || document.body.scrollLeft,
		y: document.documentElement.scrollTop || document.body.scrollTop
	}),
	checkIsScrollRoot: () => true
});
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/projection/node/HTMLProjectionNode.mjs
var rootProjectionNode = { current: void 0 };
var HTMLProjectionNode = createProjectionNode({
	measureScroll: (instance) => ({
		x: instance.scrollLeft,
		y: instance.scrollTop
	}),
	defaultParent: () => {
		if (!rootProjectionNode.current) {
			const documentNode = new DocumentProjectionNode({});
			documentNode.mount(window);
			documentNode.setOptions({ layoutScroll: true });
			rootProjectionNode.current = documentNode;
		}
		return rootProjectionNode.current;
	},
	resetTransform: (instance, value) => {
		instance.style.transform = value !== void 0 ? value : "none";
	},
	checkIsScrollRoot: (instance) => Boolean(window.getComputedStyle(instance).position === "fixed")
});
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/motion/features/drag.mjs
var drag = {
	pan: { Feature: PanGesture },
	drag: {
		Feature: DragGesture,
		ProjectionNode: HTMLProjectionNode,
		MeasureLayout
	}
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/gestures/hover.mjs
function handleHoverEvent(node, event, lifecycle) {
	const { props } = node;
	if (node.animationState && props.whileHover) node.animationState.setActive("whileHover", lifecycle === "Start");
	const callback = props["onHover" + lifecycle];
	if (callback) frame.postRender(() => callback(event, extractEventInfo(event)));
}
var HoverGesture = class extends Feature {
	mount() {
		const { current } = this.node;
		if (!current) return;
		this.unmount = hover(current, (startEvent) => {
			handleHoverEvent(this.node, startEvent, "Start");
			return (endEvent) => handleHoverEvent(this.node, endEvent, "End");
		});
	}
	unmount() {}
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/gestures/focus.mjs
var FocusGesture = class extends Feature {
	constructor() {
		super(...arguments);
		this.isActive = false;
	}
	onFocus() {
		let isFocusVisible = false;
		/**
		* If this element doesn't match focus-visible then don't
		* apply whileHover. But, if matches throws that focus-visible
		* is not a valid selector then in that browser outline styles will be applied
		* to the element by default and we want to match that behaviour with whileFocus.
		*/
		try {
			isFocusVisible = this.node.current.matches(":focus-visible");
		} catch (e) {
			isFocusVisible = true;
		}
		if (!isFocusVisible || !this.node.animationState) return;
		this.node.animationState.setActive("whileFocus", true);
		this.isActive = true;
	}
	onBlur() {
		if (!this.isActive || !this.node.animationState) return;
		this.node.animationState.setActive("whileFocus", false);
		this.isActive = false;
	}
	mount() {
		this.unmount = pipe(addDomEvent(this.node.current, "focus", () => this.onFocus()), addDomEvent(this.node.current, "blur", () => this.onBlur()));
	}
	unmount() {}
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/gestures/press.mjs
function handlePressEvent(node, event, lifecycle) {
	const { props } = node;
	if (node.animationState && props.whileTap) node.animationState.setActive("whileTap", lifecycle === "Start");
	const callback = props["onTap" + (lifecycle === "End" ? "" : lifecycle)];
	if (callback) frame.postRender(() => callback(event, extractEventInfo(event)));
}
var PressGesture = class extends Feature {
	mount() {
		const { current } = this.node;
		if (!current) return;
		this.unmount = press(current, (startEvent) => {
			handlePressEvent(this.node, startEvent, "Start");
			return (endEvent, { success }) => handlePressEvent(this.node, endEvent, success ? "End" : "Cancel");
		}, { useGlobalTarget: this.node.props.globalTapTarget });
	}
	unmount() {}
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/motion/features/viewport/observers.mjs
/**
* Map an IntersectionHandler callback to an element. We only ever make one handler for one
* element, so even though these handlers might all be triggered by different
* observers, we can keep them in the same map.
*/
var observerCallbacks = /* @__PURE__ */ new WeakMap();
/**
* Multiple observers can be created for multiple element/document roots. Each with
* different settings. So here we store dictionaries of observers to each root,
* using serialised settings (threshold/margin) as lookup keys.
*/
var observers = /* @__PURE__ */ new WeakMap();
var fireObserverCallback = (entry) => {
	const callback = observerCallbacks.get(entry.target);
	callback && callback(entry);
};
var fireAllObserverCallbacks = (entries) => {
	entries.forEach(fireObserverCallback);
};
function initIntersectionObserver({ root, ...options }) {
	const lookupRoot = root || document;
	/**
	* If we don't have an observer lookup map for this root, create one.
	*/
	if (!observers.has(lookupRoot)) observers.set(lookupRoot, {});
	const rootObservers = observers.get(lookupRoot);
	const key = JSON.stringify(options);
	/**
	* If we don't have an observer for this combination of root and settings,
	* create one.
	*/
	if (!rootObservers[key]) rootObservers[key] = new IntersectionObserver(fireAllObserverCallbacks, {
		root,
		...options
	});
	return rootObservers[key];
}
function observeIntersection(element, options, callback) {
	const rootInteresectionObserver = initIntersectionObserver(options);
	observerCallbacks.set(element, callback);
	rootInteresectionObserver.observe(element);
	return () => {
		observerCallbacks.delete(element);
		rootInteresectionObserver.unobserve(element);
	};
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/motion/features/viewport/index.mjs
var thresholdNames = {
	some: 0,
	all: 1
};
var InViewFeature = class extends Feature {
	constructor() {
		super(...arguments);
		this.hasEnteredView = false;
		this.isInView = false;
	}
	startObserver() {
		this.unmount();
		const { viewport = {} } = this.node.getProps();
		const { root, margin: rootMargin, amount = "some", once } = viewport;
		const options = {
			root: root ? root.current : void 0,
			rootMargin,
			threshold: typeof amount === "number" ? amount : thresholdNames[amount]
		};
		const onIntersectionUpdate = (entry) => {
			const { isIntersecting } = entry;
			/**
			* If there's been no change in the viewport state, early return.
			*/
			if (this.isInView === isIntersecting) return;
			this.isInView = isIntersecting;
			/**
			* Handle hasEnteredView. If this is only meant to run once, and
			* element isn't visible, early return. Otherwise set hasEnteredView to true.
			*/
			if (once && !isIntersecting && this.hasEnteredView) return;
			else if (isIntersecting) this.hasEnteredView = true;
			if (this.node.animationState) this.node.animationState.setActive("whileInView", isIntersecting);
			/**
			* Use the latest committed props rather than the ones in scope
			* when this observer is created
			*/
			const { onViewportEnter, onViewportLeave } = this.node.getProps();
			const callback = isIntersecting ? onViewportEnter : onViewportLeave;
			callback && callback(entry);
		};
		return observeIntersection(this.node.current, options, onIntersectionUpdate);
	}
	mount() {
		this.startObserver();
	}
	update() {
		if (typeof IntersectionObserver === "undefined") return;
		const { props, prevProps } = this.node;
		if ([
			"amount",
			"margin",
			"root"
		].some(hasViewportOptionChanged(props, prevProps))) this.startObserver();
	}
	unmount() {}
};
function hasViewportOptionChanged({ viewport = {} }, { viewport: prevViewport = {} } = {}) {
	return (name) => viewport[name] !== prevViewport[name];
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/motion/features/gestures.mjs
var gestureAnimations = {
	inView: { Feature: InViewFeature },
	tap: { Feature: PressGesture },
	focus: { Feature: FocusGesture },
	hover: { Feature: HoverGesture }
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/motion/features/layout.mjs
var layout = { layout: {
	ProjectionNode: HTMLProjectionNode,
	MeasureLayout
} };
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/utils/reduced-motion/state.mjs
var prefersReducedMotion = { current: null };
var hasReducedMotionListener = { current: false };
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/utils/reduced-motion/index.mjs
function initPrefersReducedMotion() {
	hasReducedMotionListener.current = true;
	if (!isBrowser) return;
	if (window.matchMedia) {
		const motionMediaQuery = window.matchMedia("(prefers-reduced-motion)");
		const setReducedMotionPreferences = () => prefersReducedMotion.current = motionMediaQuery.matches;
		motionMediaQuery.addListener(setReducedMotionPreferences);
		setReducedMotionPreferences();
	} else prefersReducedMotion.current = false;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/dom/value-types/find.mjs
/**
* A list of all ValueTypes
*/
var valueTypes = [
	...dimensionValueTypes,
	color,
	complex
];
/**
* Tests a value against the list of ValueTypes
*/
var findValueType = (v) => valueTypes.find(testValueType(v));
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/store.mjs
var visualElementStore = /* @__PURE__ */ new WeakMap();
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/utils/motion-values.mjs
function updateMotionValuesFromProps(element, next, prev) {
	for (const key in next) {
		const nextValue = next[key];
		const prevValue = prev[key];
		if (isMotionValue(nextValue)) {
			/**
			* If this is a motion value found in props or style, we want to add it
			* to our visual element's motion value map.
			*/
			element.addValue(key, nextValue);
			warnOnce(nextValue.version === "11.18.2", `Attempting to mix Motion versions ${nextValue.version} with 11.18.2 may not work as expected.`);
		} else if (isMotionValue(prevValue))
 /**
		* If we're swapping from a motion value to a static value,
		* create a new motion value from that
		*/
		element.addValue(key, motionValue(nextValue, { owner: element }));
		else if (prevValue !== nextValue)
 /**
		* If this is a flat value that has changed, update the motion value
		* or create one if it doesn't exist. We only want to do this if we're
		* not handling the value with our animation state.
		*/
		if (element.hasValue(key)) {
			const existingValue = element.getValue(key);
			if (existingValue.liveStyle === true) existingValue.jump(nextValue);
			else if (!existingValue.hasAnimated) existingValue.set(nextValue);
		} else {
			const latestValue = element.getStaticValue(key);
			element.addValue(key, motionValue(latestValue !== void 0 ? latestValue : nextValue, { owner: element }));
		}
	}
	for (const key in prev) if (next[key] === void 0) element.removeValue(key);
	return next;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/VisualElement.mjs
var propEventHandlers = [
	"AnimationStart",
	"AnimationComplete",
	"Update",
	"BeforeLayoutMeasure",
	"LayoutMeasure",
	"LayoutAnimationStart",
	"LayoutAnimationComplete"
];
/**
* A VisualElement is an imperative abstraction around UI elements such as
* HTMLElement, SVGElement, Three.Object3D etc.
*/
var VisualElement = class {
	/**
	* This method takes React props and returns found MotionValues. For example, HTML
	* MotionValues will be found within the style prop, whereas for Three.js within attribute arrays.
	*
	* This isn't an abstract method as it needs calling in the constructor, but it is
	* intended to be one.
	*/
	scrapeMotionValuesFromProps(_props, _prevProps, _visualElement) {
		return {};
	}
	constructor({ parent, props, presenceContext, reducedMotionConfig, blockInitialAnimation, visualState }, options = {}) {
		/**
		* A reference to the current underlying Instance, e.g. a HTMLElement
		* or Three.Mesh etc.
		*/
		this.current = null;
		/**
		* A set containing references to this VisualElement's children.
		*/
		this.children = /* @__PURE__ */ new Set();
		/**
		* Determine what role this visual element should take in the variant tree.
		*/
		this.isVariantNode = false;
		this.isControllingVariants = false;
		/**
		* Decides whether this VisualElement should animate in reduced motion
		* mode.
		*
		* TODO: This is currently set on every individual VisualElement but feels
		* like it could be set globally.
		*/
		this.shouldReduceMotion = null;
		/**
		* A map of all motion values attached to this visual element. Motion
		* values are source of truth for any given animated value. A motion
		* value might be provided externally by the component via props.
		*/
		this.values = /* @__PURE__ */ new Map();
		this.KeyframeResolver = KeyframeResolver;
		/**
		* Cleanup functions for active features (hover/tap/exit etc)
		*/
		this.features = {};
		/**
		* A map of every subscription that binds the provided or generated
		* motion values onChange listeners to this visual element.
		*/
		this.valueSubscriptions = /* @__PURE__ */ new Map();
		/**
		* A reference to the previously-provided motion values as returned
		* from scrapeMotionValuesFromProps. We use the keys in here to determine
		* if any motion values need to be removed after props are updated.
		*/
		this.prevMotionValues = {};
		/**
		* An object containing a SubscriptionManager for each active event.
		*/
		this.events = {};
		/**
		* An object containing an unsubscribe function for each prop event subscription.
		* For example, every "Update" event can have multiple subscribers via
		* VisualElement.on(), but only one of those can be defined via the onUpdate prop.
		*/
		this.propEventSubscriptions = {};
		this.notifyUpdate = () => this.notify("Update", this.latestValues);
		this.render = () => {
			if (!this.current) return;
			this.triggerBuild();
			this.renderInstance(this.current, this.renderState, this.props.style, this.projection);
		};
		this.renderScheduledAt = 0;
		this.scheduleRender = () => {
			const now = time.now();
			if (this.renderScheduledAt < now) {
				this.renderScheduledAt = now;
				frame.render(this.render, false, true);
			}
		};
		const { latestValues, renderState, onUpdate } = visualState;
		this.onUpdate = onUpdate;
		this.latestValues = latestValues;
		this.baseTarget = { ...latestValues };
		this.initialValues = props.initial ? { ...latestValues } : {};
		this.renderState = renderState;
		this.parent = parent;
		this.props = props;
		this.presenceContext = presenceContext;
		this.depth = parent ? parent.depth + 1 : 0;
		this.reducedMotionConfig = reducedMotionConfig;
		this.options = options;
		this.blockInitialAnimation = Boolean(blockInitialAnimation);
		this.isControllingVariants = isControllingVariants(props);
		this.isVariantNode = isVariantNode(props);
		if (this.isVariantNode) this.variantChildren = /* @__PURE__ */ new Set();
		this.manuallyAnimateOnMount = Boolean(parent && parent.current);
		/**
		* Any motion values that are provided to the element when created
		* aren't yet bound to the element, as this would technically be impure.
		* However, we iterate through the motion values and set them to the
		* initial values for this component.
		*
		* TODO: This is impure and we should look at changing this to run on mount.
		* Doing so will break some tests but this isn't necessarily a breaking change,
		* more a reflection of the test.
		*/
		const { willChange, ...initialMotionValues } = this.scrapeMotionValuesFromProps(props, {}, this);
		for (const key in initialMotionValues) {
			const value = initialMotionValues[key];
			if (latestValues[key] !== void 0 && isMotionValue(value)) value.set(latestValues[key], false);
		}
	}
	mount(instance) {
		this.current = instance;
		visualElementStore.set(instance, this);
		if (this.projection && !this.projection.instance) this.projection.mount(instance);
		if (this.parent && this.isVariantNode && !this.isControllingVariants) this.removeFromVariantTree = this.parent.addVariantChild(this);
		this.values.forEach((value, key) => this.bindToMotionValue(key, value));
		if (!hasReducedMotionListener.current) initPrefersReducedMotion();
		this.shouldReduceMotion = this.reducedMotionConfig === "never" ? false : this.reducedMotionConfig === "always" ? true : prefersReducedMotion.current;
		warnOnce(this.shouldReduceMotion !== true, "You have Reduced Motion enabled on your device. Animations may not appear as expected.");
		if (this.parent) this.parent.children.add(this);
		this.update(this.props, this.presenceContext);
	}
	unmount() {
		visualElementStore.delete(this.current);
		this.projection && this.projection.unmount();
		cancelFrame(this.notifyUpdate);
		cancelFrame(this.render);
		this.valueSubscriptions.forEach((remove) => remove());
		this.valueSubscriptions.clear();
		this.removeFromVariantTree && this.removeFromVariantTree();
		this.parent && this.parent.children.delete(this);
		for (const key in this.events) this.events[key].clear();
		for (const key in this.features) {
			const feature = this.features[key];
			if (feature) {
				feature.unmount();
				feature.isMounted = false;
			}
		}
		this.current = null;
	}
	bindToMotionValue(key, value) {
		if (this.valueSubscriptions.has(key)) this.valueSubscriptions.get(key)();
		const valueIsTransform = transformProps.has(key);
		const removeOnChange = value.on("change", (latestValue) => {
			this.latestValues[key] = latestValue;
			this.props.onUpdate && frame.preRender(this.notifyUpdate);
			if (valueIsTransform && this.projection) this.projection.isTransformDirty = true;
		});
		const removeOnRenderRequest = value.on("renderRequest", this.scheduleRender);
		let removeSyncCheck;
		if (window.MotionCheckAppearSync) removeSyncCheck = window.MotionCheckAppearSync(this, key, value);
		this.valueSubscriptions.set(key, () => {
			removeOnChange();
			removeOnRenderRequest();
			if (removeSyncCheck) removeSyncCheck();
			if (value.owner) value.stop();
		});
	}
	sortNodePosition(other) {
		/**
		* If these nodes aren't even of the same type we can't compare their depth.
		*/
		if (!this.current || !this.sortInstanceNodePosition || this.type !== other.type) return 0;
		return this.sortInstanceNodePosition(this.current, other.current);
	}
	updateFeatures() {
		let key = "animation";
		for (key in featureDefinitions) {
			const featureDefinition = featureDefinitions[key];
			if (!featureDefinition) continue;
			const { isEnabled, Feature: FeatureConstructor } = featureDefinition;
			/**
			* If this feature is enabled but not active, make a new instance.
			*/
			if (!this.features[key] && FeatureConstructor && isEnabled(this.props)) this.features[key] = new FeatureConstructor(this);
			/**
			* If we have a feature, mount or update it.
			*/
			if (this.features[key]) {
				const feature = this.features[key];
				if (feature.isMounted) feature.update();
				else {
					feature.mount();
					feature.isMounted = true;
				}
			}
		}
	}
	triggerBuild() {
		this.build(this.renderState, this.latestValues, this.props);
	}
	/**
	* Measure the current viewport box with or without transforms.
	* Only measures axis-aligned boxes, rotate and skew must be manually
	* removed with a re-render to work.
	*/
	measureViewportBox() {
		return this.current ? this.measureInstanceViewportBox(this.current, this.props) : createBox();
	}
	getStaticValue(key) {
		return this.latestValues[key];
	}
	setStaticValue(key, value) {
		this.latestValues[key] = value;
	}
	/**
	* Update the provided props. Ensure any newly-added motion values are
	* added to our map, old ones removed, and listeners updated.
	*/
	update(props, presenceContext) {
		if (props.transformTemplate || this.props.transformTemplate) this.scheduleRender();
		this.prevProps = this.props;
		this.props = props;
		this.prevPresenceContext = this.presenceContext;
		this.presenceContext = presenceContext;
		/**
		* Update prop event handlers ie onAnimationStart, onAnimationComplete
		*/
		for (let i = 0; i < propEventHandlers.length; i++) {
			const key = propEventHandlers[i];
			if (this.propEventSubscriptions[key]) {
				this.propEventSubscriptions[key]();
				delete this.propEventSubscriptions[key];
			}
			const listener = props["on" + key];
			if (listener) this.propEventSubscriptions[key] = this.on(key, listener);
		}
		this.prevMotionValues = updateMotionValuesFromProps(this, this.scrapeMotionValuesFromProps(props, this.prevProps, this), this.prevMotionValues);
		if (this.handleChildMotionValue) this.handleChildMotionValue();
		this.onUpdate && this.onUpdate(this);
	}
	getProps() {
		return this.props;
	}
	/**
	* Returns the variant definition with a given name.
	*/
	getVariant(name) {
		return this.props.variants ? this.props.variants[name] : void 0;
	}
	/**
	* Returns the defined default transition on this component.
	*/
	getDefaultTransition() {
		return this.props.transition;
	}
	getTransformPagePoint() {
		return this.props.transformPagePoint;
	}
	getClosestVariantNode() {
		return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
	}
	/**
	* Add a child visual element to our set of children.
	*/
	addVariantChild(child) {
		const closestVariantNode = this.getClosestVariantNode();
		if (closestVariantNode) {
			closestVariantNode.variantChildren && closestVariantNode.variantChildren.add(child);
			return () => closestVariantNode.variantChildren.delete(child);
		}
	}
	/**
	* Add a motion value and bind it to this visual element.
	*/
	addValue(key, value) {
		const existingValue = this.values.get(key);
		if (value !== existingValue) {
			if (existingValue) this.removeValue(key);
			this.bindToMotionValue(key, value);
			this.values.set(key, value);
			this.latestValues[key] = value.get();
		}
	}
	/**
	* Remove a motion value and unbind any active subscriptions.
	*/
	removeValue(key) {
		this.values.delete(key);
		const unsubscribe = this.valueSubscriptions.get(key);
		if (unsubscribe) {
			unsubscribe();
			this.valueSubscriptions.delete(key);
		}
		delete this.latestValues[key];
		this.removeValueFromRenderState(key, this.renderState);
	}
	/**
	* Check whether we have a motion value for this key
	*/
	hasValue(key) {
		return this.values.has(key);
	}
	getValue(key, defaultValue) {
		if (this.props.values && this.props.values[key]) return this.props.values[key];
		let value = this.values.get(key);
		if (value === void 0 && defaultValue !== void 0) {
			value = motionValue(defaultValue === null ? void 0 : defaultValue, { owner: this });
			this.addValue(key, value);
		}
		return value;
	}
	/**
	* If we're trying to animate to a previously unencountered value,
	* we need to check for it in our state and as a last resort read it
	* directly from the instance (which might have performance implications).
	*/
	readValue(key, target) {
		var _a;
		let value = this.latestValues[key] !== void 0 || !this.current ? this.latestValues[key] : (_a = this.getBaseTargetFromProps(this.props, key)) !== null && _a !== void 0 ? _a : this.readValueFromInstance(this.current, key, this.options);
		if (value !== void 0 && value !== null) {
			if (typeof value === "string" && (isNumericalString(value) || isZeroValueString(value))) value = parseFloat(value);
			else if (!findValueType(value) && complex.test(target)) value = getAnimatableNone(key, target);
			this.setBaseTarget(key, isMotionValue(value) ? value.get() : value);
		}
		return isMotionValue(value) ? value.get() : value;
	}
	/**
	* Set the base target to later animate back to. This is currently
	* only hydrated on creation and when we first read a value.
	*/
	setBaseTarget(key, value) {
		this.baseTarget[key] = value;
	}
	/**
	* Find the base target for a value thats been removed from all animation
	* props.
	*/
	getBaseTarget(key) {
		var _a;
		const { initial } = this.props;
		let valueFromInitial;
		if (typeof initial === "string" || typeof initial === "object") {
			const variant = resolveVariantFromProps(this.props, initial, (_a = this.presenceContext) === null || _a === void 0 ? void 0 : _a.custom);
			if (variant) valueFromInitial = variant[key];
		}
		/**
		* If this value still exists in the current initial variant, read that.
		*/
		if (initial && valueFromInitial !== void 0) return valueFromInitial;
		/**
		* Alternatively, if this VisualElement config has defined a getBaseTarget
		* so we can read the value from an alternative source, try that.
		*/
		const target = this.getBaseTargetFromProps(this.props, key);
		if (target !== void 0 && !isMotionValue(target)) return target;
		/**
		* If the value was initially defined on initial, but it doesn't any more,
		* return undefined. Otherwise return the value as initially read from the DOM.
		*/
		return this.initialValues[key] !== void 0 && valueFromInitial === void 0 ? void 0 : this.baseTarget[key];
	}
	on(eventName, callback) {
		if (!this.events[eventName]) this.events[eventName] = new SubscriptionManager();
		return this.events[eventName].add(callback);
	}
	notify(eventName, ...args) {
		if (this.events[eventName]) this.events[eventName].notify(...args);
	}
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/dom/DOMVisualElement.mjs
var DOMVisualElement = class extends VisualElement {
	constructor() {
		super(...arguments);
		this.KeyframeResolver = DOMKeyframesResolver;
	}
	sortInstanceNodePosition(a, b) {
		/**
		* compareDocumentPosition returns a bitmask, by using the bitwise &
		* we're returning true if 2 in that bitmask is set to true. 2 is set
		* to true if b preceeds a.
		*/
		return a.compareDocumentPosition(b) & 2 ? 1 : -1;
	}
	getBaseTargetFromProps(props, key) {
		return props.style ? props.style[key] : void 0;
	}
	removeValueFromRenderState(key, { vars, style }) {
		delete vars[key];
		delete style[key];
	}
	handleChildMotionValue() {
		if (this.childSubscription) {
			this.childSubscription();
			delete this.childSubscription;
		}
		const { children } = this.props;
		if (isMotionValue(children)) this.childSubscription = children.on("change", (latest) => {
			if (this.current) this.current.textContent = `${latest}`;
		});
	}
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/html/HTMLVisualElement.mjs
function getComputedStyle$1(element) {
	return window.getComputedStyle(element);
}
var HTMLVisualElement = class extends DOMVisualElement {
	constructor() {
		super(...arguments);
		this.type = "html";
		this.renderInstance = renderHTML;
	}
	readValueFromInstance(instance, key) {
		if (transformProps.has(key)) {
			const defaultType = getDefaultValueType(key);
			return defaultType ? defaultType.default || 0 : 0;
		} else {
			const computedStyle = getComputedStyle$1(instance);
			const value = (isCSSVariableName(key) ? computedStyle.getPropertyValue(key) : computedStyle[key]) || 0;
			return typeof value === "string" ? value.trim() : value;
		}
	}
	measureInstanceViewportBox(instance, { transformPagePoint }) {
		return measureViewportBox(instance, transformPagePoint);
	}
	build(renderState, latestValues, props) {
		buildHTMLStyles(renderState, latestValues, props.transformTemplate);
	}
	scrapeMotionValuesFromProps(props, prevProps, visualElement) {
		return scrapeMotionValuesFromProps$1(props, prevProps, visualElement);
	}
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/svg/SVGVisualElement.mjs
var SVGVisualElement = class extends DOMVisualElement {
	constructor() {
		super(...arguments);
		this.type = "svg";
		this.isSVGTag = false;
		this.measureInstanceViewportBox = createBox;
	}
	getBaseTargetFromProps(props, key) {
		return props[key];
	}
	readValueFromInstance(instance, key) {
		if (transformProps.has(key)) {
			const defaultType = getDefaultValueType(key);
			return defaultType ? defaultType.default || 0 : 0;
		}
		key = !camelCaseAttributes.has(key) ? camelToDash(key) : key;
		return instance.getAttribute(key);
	}
	scrapeMotionValuesFromProps(props, prevProps, visualElement) {
		return scrapeMotionValuesFromProps(props, prevProps, visualElement);
	}
	build(renderState, latestValues, props) {
		buildSVGAttrs(renderState, latestValues, this.isSVGTag, props.transformTemplate);
	}
	renderInstance(instance, renderState, styleProp, projection) {
		renderSVG(instance, renderState, styleProp, projection);
	}
	mount(instance) {
		this.isSVGTag = isSVGTag(instance.tagName);
		super.mount(instance);
	}
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/dom/create-visual-element.mjs
var createDomVisualElement = (Component, options) => {
	return isSVGComponent(Component) ? new SVGVisualElement(options) : new HTMLVisualElement(options, { allowProjection: Component !== import_react.Fragment });
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs
var motion = /*@__PURE__*/ createDOMMotionComponentProxy(/* @__PURE__ */ createMotionComponentFactory({
	...animations,
	...gestureAnimations,
	...drag,
	...layout
}, createDomVisualElement));
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/utils/wrap.mjs
var wrap = (min, max, v) => {
	const rangeSize = max - min;
	return ((v - min) % rangeSize + rangeSize) % rangeSize + min;
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/easing/utils/get-easing-for-segment.mjs
function getEasingForSegment(easing, i) {
	return isEasingArray(easing) ? easing[wrap(0, easing.length, i)] : easing;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/animation/utils/is-dom-keyframes.mjs
function isDOMKeyframes(keyframes) {
	return typeof keyframes === "object" && !Array.isArray(keyframes);
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/animation/animate/resolve-subjects.mjs
function resolveSubjects(subject, keyframes, scope, selectorCache) {
	if (typeof subject === "string" && isDOMKeyframes(keyframes)) return resolveElements(subject, scope, selectorCache);
	else if (subject instanceof NodeList) return Array.from(subject);
	else if (Array.isArray(subject)) return subject;
	else return [subject];
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/animation/sequence/utils/calc-repeat-duration.mjs
function calculateRepeatDuration(duration, repeat, _repeatDelay) {
	return duration * (repeat + 1);
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/animation/sequence/utils/calc-time.mjs
/**
* Given a absolute or relative time definition and current/prev time state of the sequence,
* calculate an absolute time for the next keyframes.
*/
function calcNextTime(current, next, prev, labels) {
	var _a;
	if (typeof next === "number") return next;
	else if (next.startsWith("-") || next.startsWith("+")) return Math.max(0, current + parseFloat(next));
	else if (next === "<") return prev;
	else return (_a = labels.get(next)) !== null && _a !== void 0 ? _a : current;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/animation/sequence/utils/edit.mjs
function eraseKeyframes(sequence, startTime, endTime) {
	for (let i = 0; i < sequence.length; i++) {
		const keyframe = sequence[i];
		if (keyframe.at > startTime && keyframe.at < endTime) {
			removeItem(sequence, keyframe);
			i--;
		}
	}
}
function addKeyframes(sequence, keyframes, easing, offset, startTime, endTime) {
	/**
	* Erase every existing value between currentTime and targetTime,
	* this will essentially splice this timeline into any currently
	* defined ones.
	*/
	eraseKeyframes(sequence, startTime, endTime);
	for (let i = 0; i < keyframes.length; i++) sequence.push({
		value: keyframes[i],
		at: mixNumber$1(startTime, endTime, offset[i]),
		easing: getEasingForSegment(easing, i)
	});
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/animation/sequence/utils/normalize-times.mjs
/**
* Take an array of times that represent repeated keyframes. For instance
* if we have original times of [0, 0.5, 1] then our repeated times will
* be [0, 0.5, 1, 1, 1.5, 2]. Loop over the times and scale them back
* down to a 0-1 scale.
*/
function normalizeTimes(times, repeat) {
	for (let i = 0; i < times.length; i++) times[i] = times[i] / (repeat + 1);
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/animation/sequence/utils/sort.mjs
function compareByTime(a, b) {
	if (a.at === b.at) {
		if (a.value === null) return 1;
		if (b.value === null) return -1;
		return 0;
	} else return a.at - b.at;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/animation/sequence/create.mjs
var defaultSegmentEasing = "easeInOut";
var MAX_REPEAT = 20;
function createAnimationsFromSequence(sequence, { defaultTransition = {}, ...sequenceTransition } = {}, scope, generators) {
	const defaultDuration = defaultTransition.duration || .3;
	const animationDefinitions = /* @__PURE__ */ new Map();
	const sequences = /* @__PURE__ */ new Map();
	const elementCache = {};
	const timeLabels = /* @__PURE__ */ new Map();
	let prevTime = 0;
	let currentTime = 0;
	let totalDuration = 0;
	/**
	* Build the timeline by mapping over the sequence array and converting
	* the definitions into keyframes and offsets with absolute time values.
	* These will later get converted into relative offsets in a second pass.
	*/
	for (let i = 0; i < sequence.length; i++) {
		const segment = sequence[i];
		/**
		* If this is a timeline label, mark it and skip the rest of this iteration.
		*/
		if (typeof segment === "string") {
			timeLabels.set(segment, currentTime);
			continue;
		} else if (!Array.isArray(segment)) {
			timeLabels.set(segment.name, calcNextTime(currentTime, segment.at, prevTime, timeLabels));
			continue;
		}
		let [subject, keyframes, transition = {}] = segment;
		/**
		* If a relative or absolute time value has been specified we need to resolve
		* it in relation to the currentTime.
		*/
		if (transition.at !== void 0) currentTime = calcNextTime(currentTime, transition.at, prevTime, timeLabels);
		/**
		* Keep track of the maximum duration in this definition. This will be
		* applied to currentTime once the definition has been parsed.
		*/
		let maxDuration = 0;
		const resolveValueSequence = (valueKeyframes, valueTransition, valueSequence, elementIndex = 0, numSubjects = 0) => {
			const valueKeyframesAsList = keyframesAsList(valueKeyframes);
			const { delay = 0, times = defaultOffset(valueKeyframesAsList), type = "keyframes", repeat, repeatType, repeatDelay = 0, ...remainingTransition } = valueTransition;
			let { ease = defaultTransition.ease || "easeOut", duration } = valueTransition;
			/**
			* Resolve stagger() if defined.
			*/
			const calculatedDelay = typeof delay === "function" ? delay(elementIndex, numSubjects) : delay;
			/**
			* If this animation should and can use a spring, generate a spring easing function.
			*/
			const numKeyframes = valueKeyframesAsList.length;
			const createGenerator = isGenerator(type) ? type : generators === null || generators === void 0 ? void 0 : generators[type];
			if (numKeyframes <= 2 && createGenerator) {
				/**
				* As we're creating an easing function from a spring,
				* ideally we want to generate it using the real distance
				* between the two keyframes. However this isn't always
				* possible - in these situations we use 0-100.
				*/
				let absoluteDelta = 100;
				if (numKeyframes === 2 && isNumberKeyframesArray(valueKeyframesAsList)) {
					const delta = valueKeyframesAsList[1] - valueKeyframesAsList[0];
					absoluteDelta = Math.abs(delta);
				}
				const springTransition = { ...remainingTransition };
				if (duration !== void 0) springTransition.duration = /* @__PURE__ */ secondsToMilliseconds(duration);
				const springEasing = createGeneratorEasing(springTransition, absoluteDelta, createGenerator);
				ease = springEasing.ease;
				duration = springEasing.duration;
			}
			duration !== null && duration !== void 0 || (duration = defaultDuration);
			const startTime = currentTime + calculatedDelay;
			/**
			* If there's only one time offset of 0, fill in a second with length 1
			*/
			if (times.length === 1 && times[0] === 0) times[1] = 1;
			/**
			* Fill out if offset if fewer offsets than keyframes
			*/
			const remainder = times.length - valueKeyframesAsList.length;
			remainder > 0 && fillOffset(times, remainder);
			/**
			* If only one value has been set, ie [1], push a null to the start of
			* the keyframe array. This will let us mark a keyframe at this point
			* that will later be hydrated with the previous value.
			*/
			valueKeyframesAsList.length === 1 && valueKeyframesAsList.unshift(null);
			/**
			* Handle repeat options
			*/
			if (repeat) {
				invariant(repeat < MAX_REPEAT, "Repeat count too high, must be less than 20");
				duration = calculateRepeatDuration(duration, repeat);
				const originalKeyframes = [...valueKeyframesAsList];
				const originalTimes = [...times];
				ease = Array.isArray(ease) ? [...ease] : [ease];
				const originalEase = [...ease];
				for (let repeatIndex = 0; repeatIndex < repeat; repeatIndex++) {
					valueKeyframesAsList.push(...originalKeyframes);
					for (let keyframeIndex = 0; keyframeIndex < originalKeyframes.length; keyframeIndex++) {
						times.push(originalTimes[keyframeIndex] + (repeatIndex + 1));
						ease.push(keyframeIndex === 0 ? "linear" : getEasingForSegment(originalEase, keyframeIndex - 1));
					}
				}
				normalizeTimes(times, repeat);
			}
			const targetTime = startTime + duration;
			/**
			* Add keyframes, mapping offsets to absolute time.
			*/
			addKeyframes(valueSequence, valueKeyframesAsList, ease, times, startTime, targetTime);
			maxDuration = Math.max(calculatedDelay + duration, maxDuration);
			totalDuration = Math.max(targetTime, totalDuration);
		};
		if (isMotionValue(subject)) {
			const subjectSequence = getSubjectSequence(subject, sequences);
			resolveValueSequence(keyframes, transition, getValueSequence("default", subjectSequence));
		} else {
			const subjects = resolveSubjects(subject, keyframes, scope, elementCache);
			const numSubjects = subjects.length;
			/**
			* For every element in this segment, process the defined values.
			*/
			for (let subjectIndex = 0; subjectIndex < numSubjects; subjectIndex++) {
				/**
				* Cast necessary, but we know these are of this type
				*/
				keyframes = keyframes;
				transition = transition;
				const thisSubject = subjects[subjectIndex];
				const subjectSequence = getSubjectSequence(thisSubject, sequences);
				for (const key in keyframes) resolveValueSequence(keyframes[key], getValueTransition(transition, key), getValueSequence(key, subjectSequence), subjectIndex, numSubjects);
			}
		}
		prevTime = currentTime;
		currentTime += maxDuration;
	}
	/**
	* For every element and value combination create a new animation.
	*/
	sequences.forEach((valueSequences, element) => {
		for (const key in valueSequences) {
			const valueSequence = valueSequences[key];
			/**
			* Arrange all the keyframes in ascending time order.
			*/
			valueSequence.sort(compareByTime);
			const keyframes = [];
			const valueOffset = [];
			const valueEasing = [];
			/**
			* For each keyframe, translate absolute times into
			* relative offsets based on the total duration of the timeline.
			*/
			for (let i = 0; i < valueSequence.length; i++) {
				const { at, value, easing } = valueSequence[i];
				keyframes.push(value);
				valueOffset.push(/* @__PURE__ */ progress(0, totalDuration, at));
				valueEasing.push(easing || "easeOut");
			}
			/**
			* If the first keyframe doesn't land on offset: 0
			* provide one by duplicating the initial keyframe. This ensures
			* it snaps to the first keyframe when the animation starts.
			*/
			if (valueOffset[0] !== 0) {
				valueOffset.unshift(0);
				keyframes.unshift(keyframes[0]);
				valueEasing.unshift(defaultSegmentEasing);
			}
			/**
			* If the last keyframe doesn't land on offset: 1
			* provide one with a null wildcard value. This will ensure it
			* stays static until the end of the animation.
			*/
			if (valueOffset[valueOffset.length - 1] !== 1) {
				valueOffset.push(1);
				keyframes.push(null);
			}
			if (!animationDefinitions.has(element)) animationDefinitions.set(element, {
				keyframes: {},
				transition: {}
			});
			const definition = animationDefinitions.get(element);
			definition.keyframes[key] = keyframes;
			definition.transition[key] = {
				...defaultTransition,
				duration: totalDuration,
				ease: valueEasing,
				times: valueOffset,
				...sequenceTransition
			};
		}
	});
	return animationDefinitions;
}
function getSubjectSequence(subject, sequences) {
	!sequences.has(subject) && sequences.set(subject, {});
	return sequences.get(subject);
}
function getValueSequence(name, sequences) {
	if (!sequences[name]) sequences[name] = [];
	return sequences[name];
}
function keyframesAsList(keyframes) {
	return Array.isArray(keyframes) ? keyframes : [keyframes];
}
function getValueTransition(transition, key) {
	return transition && transition[key] ? {
		...transition,
		...transition[key]
	} : { ...transition };
}
var isNumber = (keyframe) => typeof keyframe === "number";
var isNumberKeyframesArray = (keyframes) => keyframes.every(isNumber);
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/render/object/ObjectVisualElement.mjs
function isObjectKey(key, object) {
	return key in object;
}
var ObjectVisualElement = class extends VisualElement {
	constructor() {
		super(...arguments);
		this.type = "object";
	}
	readValueFromInstance(instance, key) {
		if (isObjectKey(key, instance)) {
			const value = instance[key];
			if (typeof value === "string" || typeof value === "number") return value;
		}
	}
	getBaseTargetFromProps() {}
	removeValueFromRenderState(key, renderState) {
		delete renderState.output[key];
	}
	measureInstanceViewportBox() {
		return createBox();
	}
	build(renderState, latestValues) {
		Object.assign(renderState.output, latestValues);
	}
	renderInstance(instance, { output }) {
		Object.assign(instance, output);
	}
	sortInstanceNodePosition() {
		return 0;
	}
};
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/animation/utils/create-visual-element.mjs
function createDOMVisualElement(element) {
	const options = {
		presenceContext: null,
		props: {},
		visualState: {
			renderState: {
				transform: {},
				transformOrigin: {},
				style: {},
				vars: {},
				attrs: {}
			},
			latestValues: {}
		}
	};
	const node = isSVGElement(element) ? new SVGVisualElement(options) : new HTMLVisualElement(options);
	node.mount(element);
	visualElementStore.set(element, node);
}
function createObjectVisualElement(subject) {
	const node = new ObjectVisualElement({
		presenceContext: null,
		props: {},
		visualState: {
			renderState: { output: {} },
			latestValues: {}
		}
	});
	node.mount(subject);
	visualElementStore.set(subject, node);
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/animation/animate/subject.mjs
function isSingleValue(subject, keyframes) {
	return isMotionValue(subject) || typeof subject === "number" || typeof subject === "string" && !isDOMKeyframes(keyframes);
}
/**
* Implementation
*/
function animateSubject(subject, keyframes, options, scope) {
	const animations = [];
	if (isSingleValue(subject, keyframes)) animations.push(animateSingleValue(subject, isDOMKeyframes(keyframes) ? keyframes.default || keyframes : keyframes, options ? options.default || options : options));
	else {
		const subjects = resolveSubjects(subject, keyframes, scope);
		const numSubjects = subjects.length;
		invariant(Boolean(numSubjects), "No valid elements provided.");
		for (let i = 0; i < numSubjects; i++) {
			const thisSubject = subjects[i];
			const createVisualElement = thisSubject instanceof Element ? createDOMVisualElement : createObjectVisualElement;
			if (!visualElementStore.has(thisSubject)) createVisualElement(thisSubject);
			const visualElement = visualElementStore.get(thisSubject);
			const transition = { ...options };
			/**
			* Resolve stagger function if provided.
			*/
			if ("delay" in transition && typeof transition.delay === "function") transition.delay = transition.delay(i, numSubjects);
			animations.push(...animateTarget(visualElement, {
				...keyframes,
				transition
			}, {}));
		}
	}
	return animations;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/animation/animate/sequence.mjs
function animateSequence(sequence, options, scope) {
	const animations = [];
	createAnimationsFromSequence(sequence, options, scope, { spring }).forEach(({ keyframes, transition }, subject) => {
		animations.push(...animateSubject(subject, keyframes, transition));
	});
	return animations;
}
//#endregion
//#region ../../node_modules/.deno/framer-motion@11.18.2/node_modules/framer-motion/dist/es/animation/animate/index.mjs
function isSequence(value) {
	return Array.isArray(value) && value.some(Array.isArray);
}
/**
* Creates an animation function that is optionally scoped
* to a specific element.
*/
function createScopedAnimate(scope) {
	/**
	* Implementation
	*/
	function scopedAnimate(subjectOrSequence, optionsOrKeyframes, options) {
		let animations = [];
		if (isSequence(subjectOrSequence)) animations = animateSequence(subjectOrSequence, optionsOrKeyframes, scope);
		else animations = animateSubject(subjectOrSequence, optionsOrKeyframes, options, scope);
		const animation = new GroupPlaybackControls(animations);
		if (scope) scope.animations.push(animation);
		return animation;
	}
	return scopedAnimate;
}
var animate = createScopedAnimate();
//#endregion
//#region ../../node_modules/.deno/goey-toast@0.5.0/node_modules/goey-toast/dist/index.js
var animationPresets = {
	smooth: {
		bounce: .1,
		spring: true
	},
	bouncy: {
		bounce: .6,
		spring: true
	},
	subtle: {
		bounce: .05,
		spring: true
	},
	snappy: {
		bounce: .4,
		spring: true
	}
};
var _position = "bottom-right";
var _dir = "ltr";
var _spring = true;
var _bounce = void 0;
var _theme = "light";
function setGooeyTheme(theme) {
	_theme = theme;
}
function getGooeyTheme() {
	return _theme;
}
function setGooeyPosition(position) {
	_position = position;
}
function getGooeyPosition() {
	return _position;
}
function setGooeyDir(dir) {
	_dir = dir;
}
function getGooeyDir() {
	return _dir;
}
function setGooeySpring(spring) {
	_spring = spring;
}
function getGooeySpring() {
	return _spring;
}
function setGooeyBounce(bounce) {
	_bounce = bounce;
}
function getGooeyBounce() {
	return _bounce;
}
var _visibleToasts = 3;
function setGooeyVisibleToasts(n) {
	_visibleToasts = n;
}
function getGooeyVisibleToasts() {
	return _visibleToasts;
}
var _swipeToDismiss = true;
function setGooeySwipeToDismiss(enabled) {
	_swipeToDismiss = enabled;
}
function getGooeySwipeToDismiss() {
	return _swipeToDismiss;
}
var _maxQueue = Infinity;
function setGooeyMaxQueue(n) {
	_maxQueue = n;
}
function getGooeyMaxQueue() {
	return _maxQueue;
}
var _queueOverflow = "drop-oldest";
function setGooeyQueueOverflow(strategy) {
	_queueOverflow = strategy;
}
function getGooeyQueueOverflow() {
	return _queueOverflow;
}
var _showProgress = false;
function setGooeyShowProgress(show) {
	_showProgress = show;
}
function getGooeyShowProgress() {
	return _showProgress;
}
var _showTimestamp = true;
function setGooeyShowTimestamp(show) {
	_showTimestamp = show;
}
function getGooeyShowTimestamp() {
	return _showTimestamp;
}
var _closeButton = false;
function setGooeyCloseButton(value) {
	_closeButton = value;
}
function getGooeyCloseButton() {
	return _closeButton;
}
var _containerHovered = false;
var _hoverSubs = /* @__PURE__ */ new Set();
function setContainerHovered(hovered) {
	if (_containerHovered === hovered) return;
	_containerHovered = hovered;
	_hoverSubs.forEach((cb) => cb(hovered));
}
function getContainerHovered() {
	return _containerHovered;
}
function subscribeContainerHovered(cb) {
	_hoverSubs.add(cb);
	return () => {
		_hoverSubs.delete(cb);
	};
}
var _announceSubs = /* @__PURE__ */ new Set();
function announce(message, politeness = "polite") {
	_announceSubs.forEach((cb) => cb({
		message,
		politeness
	}));
}
function subscribeAnnouncements(cb) {
	_announceSubs.add(cb);
	return () => {
		_announceSubs.delete(cb);
	};
}
var DefaultIcon = ({ size = 20, className }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
	xmlns: "http://www.w3.org/2000/svg",
	width: size,
	height: size,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 2,
	strokeLinecap: "round",
	strokeLinejoin: "round",
	className,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M13.73 21a2 2 0 0 1-3.46 0" })]
});
var SuccessIcon = ({ size = 20, className }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
	xmlns: "http://www.w3.org/2000/svg",
	width: size,
	height: size,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 2,
	strokeLinecap: "round",
	strokeLinejoin: "round",
	className,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M9 12l2 2 4-4" })]
});
var ErrorIcon = ({ size = 20, className }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
	xmlns: "http://www.w3.org/2000/svg",
	width: size,
	height: size,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 2,
	strokeLinecap: "round",
	strokeLinejoin: "round",
	className,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "12",
			cy: "12",
			r: "10"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M15 9l-6 6" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M9 9l6 6" })
	]
});
var WarningIcon = ({ size = 20, className }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
	xmlns: "http://www.w3.org/2000/svg",
	width: size,
	height: size,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 2,
	strokeLinecap: "round",
	strokeLinejoin: "round",
	className,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "12",
			cy: "12",
			r: "10"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1: "12",
			y1: "8",
			x2: "12",
			y2: "12"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1: "12",
			y1: "16",
			x2: "12.01",
			y2: "16"
		})
	]
});
var InfoIcon = ({ size = 20, className }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
	xmlns: "http://www.w3.org/2000/svg",
	width: size,
	height: size,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 2,
	strokeLinecap: "round",
	strokeLinejoin: "round",
	className,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "12",
			cy: "12",
			r: "10"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1: "12",
			y1: "16",
			x2: "12",
			y2: "12"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1: "12",
			y1: "8",
			x2: "12.01",
			y2: "8"
		})
	]
});
var SpinnerIcon = ({ size = 20, className }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
	xmlns: "http://www.w3.org/2000/svg",
	width: size,
	height: size,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 2,
	strokeLinecap: "round",
	strokeLinejoin: "round",
	className,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M21 12a9 9 0 1 1-6.219-8.56" })
});
var QUERY = "(prefers-reduced-motion: reduce)";
function getInitialState() {
	if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
	return window.matchMedia(QUERY).matches;
}
function usePrefersReducedMotion() {
	const [prefersReducedMotion, setPrefersReducedMotion] = (0, import_react.useState)(getInitialState);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
		const mql = window.matchMedia(QUERY);
		const handler = (event) => {
			setPrefersReducedMotion(event.matches);
		};
		mql.addEventListener("change", handler);
		return () => mql.removeEventListener("change", handler);
	}, []);
	return prefersReducedMotion;
}
var styles = {
	spinnerSpin: "gooey-spinnerSpin",
	wrapper: "gooey-wrapper",
	blobSvg: "gooey-blobSvg",
	content: "gooey-content",
	contentCompact: "gooey-contentCompact",
	contentExpanded: "gooey-contentExpanded",
	header: "gooey-header",
	iconWrapper: "gooey-iconWrapper",
	title: "gooey-title",
	titleDefault: "gooey-titleDefault",
	titleSuccess: "gooey-titleSuccess",
	titleError: "gooey-titleError",
	titleWarning: "gooey-titleWarning",
	titleInfo: "gooey-titleInfo",
	titleLoading: "gooey-titleLoading",
	description: "gooey-description",
	actionWrapper: "gooey-actionWrapper",
	actionButton: "gooey-actionButton",
	actionDefault: "gooey-actionDefault",
	actionSuccess: "gooey-actionSuccess",
	actionError: "gooey-actionError",
	actionWarning: "gooey-actionWarning",
	actionInfo: "gooey-actionInfo",
	progressWrapper: "gooey-progressWrapper",
	progressBar: "gooey-progressBar",
	progressDefault: "gooey-progressDefault",
	progressSuccess: "gooey-progressSuccess",
	progressError: "gooey-progressError",
	progressWarning: "gooey-progressWarning",
	progressInfo: "gooey-progressInfo",
	progressPaused: "gooey-progressPaused",
	timestamp: "gooey-timestamp",
	closeButton: "gooey-closeButton",
	closeButtonRight: "gooey-closeButtonRight"
};
var useIsomorphicLayoutEffect = typeof window !== "undefined" ? import_react.useLayoutEffect : import_react.useEffect;
var phaseIconMap = {
	default: DefaultIcon,
	success: SuccessIcon,
	error: ErrorIcon,
	warning: WarningIcon,
	info: InfoIcon
};
var titleColorMap = {
	loading: styles.titleLoading,
	default: styles.titleDefault,
	success: styles.titleSuccess,
	error: styles.titleError,
	warning: styles.titleWarning,
	info: styles.titleInfo
};
var actionColorMap = {
	loading: styles.actionInfo,
	default: styles.actionDefault,
	success: styles.actionSuccess,
	error: styles.actionError,
	warning: styles.actionWarning,
	info: styles.actionInfo
};
var progressColorMap = {
	loading: styles.progressInfo,
	default: styles.progressDefault,
	success: styles.progressSuccess,
	error: styles.progressError,
	warning: styles.progressWarning,
	info: styles.progressInfo
};
var PH = 34;
var DEFAULT_DISPLAY_DURATION = 4e3;
var DEFAULT_EXPAND_DUR = .6;
var DEFAULT_COLLAPSE_DUR = .9;
function squishSpring(durationSec, defaultDur, bounce = .4) {
	const scale = durationSec / defaultDur;
	return {
		type: "spring",
		stiffness: 200 + bounce * 437.5,
		damping: 24 - bounce * 20,
		mass: .7 * scale
	};
}
var observerRegistry = /* @__PURE__ */ new Map();
function registerSonnerObserver(ol, callback) {
	let entry = observerRegistry.get(ol);
	if (!entry) {
		const callbacks = /* @__PURE__ */ new Set();
		const observeOptions = {
			attributes: true,
			attributeFilter: ["style", "data-visible"],
			subtree: true,
			childList: true
		};
		const observer = new MutationObserver(() => {
			observer.disconnect();
			try {
				for (const cb of callbacks) cb();
			} finally {
				observer.observe(ol, observeOptions);
			}
		});
		observer.observe(ol, observeOptions);
		entry = {
			observer,
			callbacks
		};
		observerRegistry.set(ol, entry);
	}
	entry.callbacks.add(callback);
	return () => {
		entry.callbacks.delete(callback);
		if (entry.callbacks.size === 0) {
			entry.observer.disconnect();
			observerRegistry.delete(ol);
		}
	};
}
function syncSonnerHeights(wrapperEl, includeOffsets = false) {
	if (!wrapperEl) return;
	const li = wrapperEl.closest("[data-sonner-toast]");
	if (!li?.parentElement) return;
	const ol = li.parentElement;
	const toasts = Array.from(ol.querySelectorAll(":scope > [data-sonner-toast]"));
	if (toasts.length === 0) return;
	const heights = toasts.map((t) => {
		if (t.getAttribute("data-visible") === "false") return 0;
		const content = t.firstElementChild;
		const h = content ? content.getBoundingClientRect().height : 0;
		return h > 0 ? h : PH;
	});
	for (let i = 0; i < toasts.length; i++) toasts[i].style.setProperty("--initial-height", `${heights[i]}px`);
	if (!includeOffsets) return;
	const gapStr = getComputedStyle(ol).getPropertyValue("--gap").trim();
	const gap = parseFloat(gapStr) || 14;
	let runningOffset = 0;
	for (let i = toasts.length - 1; i >= 0; i--) {
		if (toasts[i].getAttribute("data-visible") === "false") {
			toasts[i].style.setProperty("--offset", "0px");
			continue;
		}
		toasts[i].style.setProperty("--offset", `${runningOffset}px`);
		if (i > 0) runningOffset += heights[i] + gap;
	}
}
function memoizePath(fn) {
	let lastArgs = null;
	let lastResult = "";
	return (pw, bw, th, t) => {
		if (lastArgs && lastArgs[0] === pw && lastArgs[1] === bw && lastArgs[2] === th && lastArgs[3] === t) return lastResult;
		lastResult = fn(pw, bw, th, t);
		lastArgs = [
			pw,
			bw,
			th,
			t
		];
		return lastResult;
	};
}
function morphPathRaw(pw, bw, th, t) {
	const pr = PH / 2;
	const pillW = Math.min(pw, bw);
	const bodyH = PH + (th - PH) * t;
	if (t <= 0 || bodyH - PH < 8) return [
		`M 0,${pr}`,
		`A ${pr},${pr} 0 0 1 ${pr},0`,
		`H ${pillW - pr}`,
		`A ${pr},${pr} 0 0 1 ${pillW},${pr}`,
		`A ${pr},${pr} 0 0 1 ${pillW - pr},${PH}`,
		`H ${pr}`,
		`A ${pr},${pr} 0 0 1 0,${pr}`,
		`Z`
	].join(" ");
	const curve = 14 * t;
	const cr = Math.min(16, (bodyH - PH) * .45);
	const bodyW = pillW + (bw - pillW) * t;
	const bodyTop = PH - curve;
	const qEndX = Math.min(pillW + curve, bodyW - cr);
	return [
		`M 0,${pr}`,
		`A ${pr},${pr} 0 0 1 ${pr},0`,
		`H ${pillW - pr}`,
		`A ${pr},${pr} 0 0 1 ${pillW},${pr}`,
		`L ${pillW},${bodyTop}`,
		`Q ${pillW},${bodyTop + curve} ${qEndX},${bodyTop + curve}`,
		`H ${bodyW - cr}`,
		`A ${cr},${cr} 0 0 1 ${bodyW},${bodyTop + curve + cr}`,
		`L ${bodyW},${bodyH - cr}`,
		`A ${cr},${cr} 0 0 1 ${bodyW - cr},${bodyH}`,
		`H ${cr}`,
		`A ${cr},${cr} 0 0 1 0,${bodyH - cr}`,
		`Z`
	].join(" ");
}
function morphPathCenterRaw(pw, bw, th, t) {
	const pr = PH / 2;
	const pillW = Math.min(pw, bw);
	const pillOffset = (bw - pillW) / 2;
	if (t <= 0 || PH + (th - PH) * t - PH < 8) return [
		`M ${pillOffset},${pr}`,
		`A ${pr},${pr} 0 0 1 ${pillOffset + pr},0`,
		`H ${pillOffset + pillW - pr}`,
		`A ${pr},${pr} 0 0 1 ${pillOffset + pillW},${pr}`,
		`A ${pr},${pr} 0 0 1 ${pillOffset + pillW - pr},${PH}`,
		`H ${pillOffset + pr}`,
		`A ${pr},${pr} 0 0 1 ${pillOffset},${pr}`,
		`Z`
	].join(" ");
	const bodyH = PH + (th - PH) * t;
	const curve = 14 * t;
	const cr = Math.min(16, (bodyH - PH) * .45);
	const bodyTop = PH - curve;
	const bodyCenter = bw / 2;
	const halfBodyW = pillW / 2 + (bw - pillW) / 2 * t;
	const bodyLeft = bodyCenter - halfBodyW;
	const bodyRight = bodyCenter + halfBodyW;
	const qLeftX = Math.max(bodyLeft + cr, pillOffset - curve);
	const qRightX = Math.min(bodyRight - cr, pillOffset + pillW + curve);
	return [
		`M ${pillOffset},${pr}`,
		`A ${pr},${pr} 0 0 1 ${pillOffset + pr},0`,
		`H ${pillOffset + pillW - pr}`,
		`A ${pr},${pr} 0 0 1 ${pillOffset + pillW},${pr}`,
		`L ${pillOffset + pillW},${bodyTop}`,
		`Q ${pillOffset + pillW},${bodyTop + curve} ${qRightX},${bodyTop + curve}`,
		`H ${bodyRight - cr}`,
		`A ${cr},${cr} 0 0 1 ${bodyRight},${bodyTop + curve + cr}`,
		`L ${bodyRight},${bodyH - cr}`,
		`A ${cr},${cr} 0 0 1 ${bodyRight - cr},${bodyH}`,
		`H ${bodyLeft + cr}`,
		`A ${cr},${cr} 0 0 1 ${bodyLeft},${bodyH - cr}`,
		`L ${bodyLeft},${bodyTop + curve + cr}`,
		`A ${cr},${cr} 0 0 1 ${bodyLeft + cr},${bodyTop + curve}`,
		`H ${qLeftX}`,
		`Q ${pillOffset},${bodyTop + curve} ${pillOffset},${bodyTop}`,
		`Z`
	].join(" ");
}
var morphPath = memoizePath(morphPathRaw);
var morphPathCenter = memoizePath(morphPathCenterRaw);
var SMOOTH_EASE = [
	.4,
	0,
	.2,
	1
];
var GooeyToast = ({ title, description, action, icon, phase, classNames, fillColor: fillColorProp, borderColor, borderWidth, timing, preset, spring: springProp, bounce: bounceProp, showTimestamp: showTimestampProp, showProgress: showProgressProp, toastId }) => {
	const theme = getGooeyTheme();
	const closeButtonSetting = getGooeyCloseButton();
	const showCloseButton = closeButtonSetting !== false;
	const fillColor = fillColorProp ?? (theme === "dark" ? "#1a1a1a" : "#ffffff");
	const position = getGooeyPosition();
	const dir = getGooeyDir();
	const posIsRight = position?.includes("right") ?? false;
	const isCenter = position?.includes("center") ?? false;
	const isRight = dir === "rtl" ? isCenter ? false : !posIsRight : posIsRight;
	const prefersReducedMotion = usePrefersReducedMotion();
	const presetConfig = preset ? animationPresets[preset] : void 0;
	const useSpring = springProp ?? presetConfig?.spring ?? getGooeySpring();
	const bounceVal = bounceProp ?? presetConfig?.bounce ?? getGooeyBounce() ?? .4;
	const showProgress = showProgressProp ?? getGooeyShowProgress();
	const showTimestamp = showTimestampProp ?? getGooeyShowTimestamp();
	const [actionSuccess, setActionSuccess] = (0, import_react.useState)(null);
	const [dismissing, setDismissing] = (0, import_react.useState)(false);
	const [progressKey, setProgressKey] = (0, import_react.useState)(0);
	const [hovered, setHovered] = (0, import_react.useState)(false);
	const hoveredRef = (0, import_react.useRef)(false);
	const containerHoveredRef = (0, import_react.useRef)(getContainerHovered());
	const [containerHovered, setContainerHoveredState] = (0, import_react.useState)(getContainerHovered());
	const collapsingRef = (0, import_react.useRef)(false);
	const preDismissRef = (0, import_react.useRef)(false);
	const collapseEndTime = (0, import_react.useRef)(0);
	const expandedDimsRef = (0, import_react.useRef)({
		pw: 0,
		bw: 0,
		th: 0
	});
	const dismissTimerRef = (0, import_react.useRef)(null);
	const effectiveTitle = actionSuccess ?? title;
	const effectivePhase = actionSuccess ? "success" : phase;
	const effectiveDescription = actionSuccess ? void 0 : description;
	const effectiveAction = actionSuccess ? void 0 : action;
	const isLoading = effectivePhase === "loading";
	const hasDescription = Boolean(effectiveDescription);
	const hasAction = Boolean(effectiveAction);
	const isExpanded = (hasDescription || hasAction) && !dismissing;
	const [showBody, setShowBody] = (0, import_react.useState)(false);
	const wrapperRef = (0, import_react.useRef)(null);
	const pathRef = (0, import_react.useRef)(null);
	const headerRef = (0, import_react.useRef)(null);
	const contentRef = (0, import_react.useRef)(null);
	const morphCtrl = (0, import_react.useRef)(null);
	const pillResizeCtrl = (0, import_react.useRef)(null);
	const headerSquishCtrl = (0, import_react.useRef)(null);
	const morphTRef = (0, import_react.useRef)(0);
	const aDims = (0, import_react.useRef)({
		pw: 0,
		bw: 0,
		th: 0
	});
	const dimsRef = (0, import_react.useRef)({
		pw: 0,
		bw: 0,
		th: 0
	});
	const [dims, setDims] = (0, import_react.useState)({
		pw: 0,
		bw: 0,
		th: 0
	});
	(0, import_react.useEffect)(() => {
		dimsRef.current = dims;
	}, [dims]);
	(0, import_react.useEffect)(() => {
		return subscribeContainerHovered((h) => {
			containerHoveredRef.current = h;
			setContainerHoveredState(h);
		});
	}, []);
	const flush = (0, import_react.useCallback)(() => {
		const { pw: p, bw: b, th: h } = aDims.current;
		if (p <= 0 || b <= 0 || h <= 0) return;
		const t = Math.max(0, Math.min(1, morphTRef.current));
		const pos = getGooeyPosition();
		const d = getGooeyDir();
		const centerPos = pos?.includes("center") ?? false;
		const posRight = pos?.includes("right") ?? false;
		const rightSide = d === "rtl" ? centerPos ? false : !posRight : posRight;
		if (centerPos) {
			const centerBw = Math.max(dimsRef.current.bw, expandedDimsRef.current.bw, p);
			pathRef.current?.setAttribute("d", morphPathCenter(p, centerBw, h, t));
		} else pathRef.current?.setAttribute("d", morphPath(p, b, h, t));
		if (t >= 1) {
			if (wrapperRef.current) wrapperRef.current.style.width = "";
			if (contentRef.current) {
				contentRef.current.style.width = "";
				contentRef.current.style.overflow = "";
				contentRef.current.style.maxHeight = "";
				contentRef.current.style.clipPath = "";
			}
		} else if (t > 0) {
			const targetBw = dimsRef.current.bw;
			const targetTh = dimsRef.current.th;
			const pillW = Math.min(p, b);
			const currentW = pillW + (b - pillW) * t;
			const currentH = PH + (targetTh - PH) * t;
			const centerFullW = centerPos ? Math.max(dimsRef.current.bw, expandedDimsRef.current.bw, p) : 0;
			if (wrapperRef.current) wrapperRef.current.style.width = (centerPos ? centerFullW : currentW) + "px";
			if (contentRef.current) {
				contentRef.current.style.width = (centerPos ? centerFullW : targetBw) + "px";
				contentRef.current.style.overflow = "hidden";
				contentRef.current.style.maxHeight = currentH + "px";
				if (centerPos) {
					const clip = (centerFullW - currentW) / 2;
					contentRef.current.style.clipPath = `inset(0 ${clip}px 0 ${clip}px)`;
				} else {
					const clip = targetBw - currentW;
					contentRef.current.style.clipPath = rightSide ? `inset(0 0 0 ${clip}px)` : `inset(0 ${clip}px 0 0)`;
				}
			}
		} else {
			const pillW = Math.min(p, b);
			if (wrapperRef.current) {
				const centerBw = centerPos ? Math.max(dimsRef.current.bw, expandedDimsRef.current.bw, p) : pillW;
				wrapperRef.current.style.width = centerBw + "px";
			}
			if (contentRef.current) {
				if (centerPos) {
					const centerBwVal = Math.max(dimsRef.current.bw, expandedDimsRef.current.bw, p);
					contentRef.current.style.width = centerBwVal + "px";
					const clip = (centerBwVal - pillW) / 2;
					contentRef.current.style.clipPath = `inset(0 ${clip}px 0 ${clip}px)`;
				} else {
					contentRef.current.style.width = "";
					contentRef.current.style.clipPath = "";
				}
				contentRef.current.style.overflow = "hidden";
				contentRef.current.style.maxHeight = PH + "px";
			}
		}
	}, []);
	const measure = (0, import_react.useCallback)(() => {
		if (!headerRef.current || !contentRef.current) return;
		const wr = wrapperRef.current;
		const savedW = wr?.style.width ?? "";
		const savedOv = contentRef.current.style.overflow;
		const savedMH = contentRef.current.style.maxHeight;
		const savedCW = contentRef.current.style.width;
		if (wr) wr.style.width = "";
		contentRef.current.style.overflow = "";
		contentRef.current.style.maxHeight = "";
		contentRef.current.style.width = "";
		const cs = getComputedStyle(contentRef.current);
		const paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
		const pw2 = headerRef.current.offsetWidth + paddingX;
		const bw2 = contentRef.current.offsetWidth;
		const th2 = contentRef.current.offsetHeight;
		if (wr) wr.style.width = savedW;
		contentRef.current.style.overflow = savedOv;
		contentRef.current.style.maxHeight = savedMH;
		contentRef.current.style.width = savedCW;
		dimsRef.current = {
			pw: pw2,
			bw: bw2,
			th: th2
		};
		setDims({
			pw: pw2,
			bw: bw2,
			th: th2
		});
	}, []);
	useIsomorphicLayoutEffect(() => {
		measure();
		const t = setTimeout(measure, 100);
		return () => clearTimeout(t);
	}, [
		effectiveTitle,
		effectivePhase,
		isExpanded,
		showBody,
		effectiveDescription,
		effectiveAction,
		measure
	]);
	(0, import_react.useEffect)(() => {
		if (!contentRef.current) return;
		const ro = new ResizeObserver(measure);
		ro.observe(contentRef.current);
		return () => ro.disconnect();
	}, [measure]);
	const { pw, bw, th } = dims;
	const hasDims = pw > 0 && bw > 0 && th > 0;
	const blobSquishCtrl = (0, import_react.useRef)(null);
	const expandDur = DEFAULT_EXPAND_DUR;
	const collapseDur = DEFAULT_COLLAPSE_DUR;
	const lastSquishTime = (0, import_react.useRef)(0);
	const triggerLandingSquish = (0, import_react.useCallback)((phase2 = "mount") => {
		if (!wrapperRef.current || prefersReducedMotion) return;
		if (!useSpring) return;
		const now = Date.now();
		if (now - lastSquishTime.current < 300) return;
		lastSquishTime.current = now;
		blobSquishCtrl.current?.stop();
		const el = wrapperRef.current;
		const springConfig = phase2 === "collapse" ? squishSpring(collapseDur, DEFAULT_COLLAPSE_DUR, bounceVal) : squishSpring(expandDur, DEFAULT_EXPAND_DUR, bounceVal);
		const bScale = bounceVal / .4;
		const compressY = (phase2 === "collapse" ? .035 : .12) * bScale;
		const expandX = (phase2 === "collapse" ? .018 : .06) * bScale;
		blobSquishCtrl.current = animate(0, 1, {
			...springConfig,
			onUpdate: (v) => {
				const intensity = Math.sin(v * Math.PI);
				const sy = 1 - compressY * intensity;
				const sx = 1 + expandX * intensity;
				const mirror = el.style.transform?.includes("scaleX(-1)") ? "scaleX(-1) " : "";
				el.style.transformOrigin = "center top";
				el.style.transform = mirror + `scaleX(${sx}) scaleY(${sy})`;
			},
			onComplete: () => {
				const right = el.style.transform?.includes("scaleX(-1)");
				el.style.transform = right ? "scaleX(-1)" : "";
				el.style.transformOrigin = "";
			}
		});
	}, [
		prefersReducedMotion,
		expandDur,
		collapseDur,
		useSpring,
		bounceVal
	]);
	useIsomorphicLayoutEffect(() => {
		if (!hasDims || collapsingRef.current) return;
		const prev = { ...aDims.current };
		const target = {
			pw,
			bw,
			th
		};
		if (prev.bw <= 0) {
			aDims.current = target;
			flush();
			return;
		}
		if (morphTRef.current > 0 && morphTRef.current < 1) {
			aDims.current = target;
			flush();
			return;
		}
		if (showBody) {
			aDims.current = target;
			flush();
			return;
		}
		if (prev.bw === target.bw && prev.pw === target.pw && prev.th === target.th) return;
		if (prefersReducedMotion) {
			aDims.current = target;
			flush();
			return;
		}
		pillResizeCtrl.current?.stop();
		if (Date.now() - collapseEndTime.current > 500 && !isExpanded) triggerLandingSquish("expand");
		const pillResizeTransition = useSpring ? {
			type: "spring",
			duration: .5,
			bounce: bounceVal * .875
		} : {
			duration: .4,
			ease: SMOOTH_EASE
		};
		pillResizeCtrl.current = animate(0, 1, {
			...pillResizeTransition,
			onUpdate: (t) => {
				aDims.current = {
					pw: prev.pw + (target.pw - prev.pw) * t,
					bw: prev.bw + (target.bw - prev.bw) * t,
					th: prev.th + (target.th - prev.th) * t
				};
				flush();
			}
		});
	}, [
		pw,
		bw,
		th,
		hasDims,
		showBody,
		flush,
		prefersReducedMotion,
		triggerLandingSquish,
		useSpring
	]);
	const squishDelayMs = 45;
	const mountSquished = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (hasDims && !mountSquished.current && !isExpanded) {
			mountSquished.current = true;
			const t = setTimeout(triggerLandingSquish, squishDelayMs);
			return () => clearTimeout(t);
		}
	}, [
		hasDims,
		squishDelayMs,
		triggerLandingSquish
	]);
	const prevShowBody = (0, import_react.useRef)(false);
	useIsomorphicLayoutEffect(() => {
		if (!prevShowBody.current && showBody && !hoveredRef.current) {
			const t = setTimeout(() => triggerLandingSquish("expand"), 80);
			return () => clearTimeout(t);
		}
		prevShowBody.current = showBody;
	}, [showBody, triggerLandingSquish]);
	const shakeCtrl = (0, import_react.useRef)(null);
	const prevPhase = (0, import_react.useRef)(phase);
	(0, import_react.useEffect)(() => {
		if (phase === "error" && prevPhase.current !== "error" && !dismissing && wrapperRef.current && !prefersReducedMotion) {
			shakeCtrl.current?.stop();
			const el = wrapperRef.current;
			const mirror = el.style.transform?.includes("scaleX(-1)") ? "scaleX(-1) " : "";
			shakeCtrl.current = animate(0, 1, {
				duration: .4,
				ease: "easeOut",
				onUpdate: (v) => {
					const decay = 1 - v;
					const shake = Math.sin(v * Math.PI * 6) * decay * 3;
					el.style.transform = mirror + `translateX(${shake}px)`;
				},
				onComplete: () => {
					el.style.transform = mirror.trim() || "";
				}
			});
		}
		prevPhase.current = phase;
		return () => {
			shakeCtrl.current?.stop();
		};
	}, [
		phase,
		dismissing,
		prefersReducedMotion
	]);
	(0, import_react.useEffect)(() => {
		if (isExpanded) {
			const t1 = setTimeout(() => setShowBody(true), prefersReducedMotion ? 0 : 330);
			return () => clearTimeout(t1);
		}
		morphCtrl.current?.stop();
		pillResizeCtrl.current?.stop();
		if (morphTRef.current > 0) {
			const csPad = contentRef.current ? getComputedStyle(contentRef.current) : null;
			const padX = csPad ? parseFloat(csPad.paddingLeft) + parseFloat(csPad.paddingRight) : 20;
			const targetPw = headerRef.current ? headerRef.current.offsetWidth + padX : aDims.current.pw;
			const targetDims = {
				pw: targetPw,
				bw: targetPw,
				th: PH
			};
			if (prefersReducedMotion) {
				morphTRef.current = 0;
				collapsingRef.current = false;
				preDismissRef.current = false;
				setShowBody(false);
				aDims.current = { ...targetDims };
				flush();
				return;
			}
			const savedDims = expandedDimsRef.current.bw > 0 ? { ...expandedDimsRef.current } : { ...aDims.current };
			const isPreDismiss = preDismissRef.current;
			const collapseDur2 = .9;
			const collapseTransition = isPreDismiss || !useSpring ? {
				duration: collapseDur2,
				ease: SMOOTH_EASE
			} : {
				type: "spring",
				duration: collapseDur2,
				bounce: bounceVal * .875
			};
			triggerLandingSquish("collapse");
			morphCtrl.current = animate(morphTRef.current, 0, {
				...collapseTransition,
				onUpdate: (t) => {
					morphTRef.current = t;
					aDims.current = {
						pw: targetDims.pw + (savedDims.pw - targetDims.pw) * t,
						bw: targetDims.bw + (savedDims.bw - targetDims.bw) * t,
						th: targetDims.th + (savedDims.th - targetDims.th) * t
					};
					flush();
					syncSonnerHeights(wrapperRef.current, true);
				},
				onComplete: () => {
					morphTRef.current = 0;
					collapsingRef.current = false;
					preDismissRef.current = false;
					collapseEndTime.current = Date.now();
					aDims.current = { ...targetDims };
					flush();
					syncSonnerHeights(wrapperRef.current, true);
					setShowBody(false);
				}
			});
			return () => {
				morphCtrl.current?.stop();
			};
		}
		setShowBody(false);
		morphTRef.current = 0;
		flush();
	}, [
		isExpanded,
		flush,
		prefersReducedMotion,
		useSpring,
		triggerLandingSquish
	]);
	const remainingRef = (0, import_react.useRef)(null);
	const timerStartRef = (0, import_react.useRef)(0);
	const progressDelayRef = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		if (!showBody || actionSuccess || dismissing) return;
		const expandDelayMs = prefersReducedMotion ? 0 : 330;
		const collapseMs = prefersReducedMotion ? 10 : .9 * 1e3;
		const fullDelay = (timing?.displayDuration ?? DEFAULT_DISPLAY_DURATION) - expandDelayMs - collapseMs;
		progressDelayRef.current = Math.max(fullDelay, 0);
		if (fullDelay <= 0) return;
		if (hoveredRef.current || containerHoveredRef.current) return;
		const delay = remainingRef.current ?? fullDelay;
		timerStartRef.current = Date.now();
		const timer = setTimeout(() => {
			if (hoveredRef.current || containerHoveredRef.current) {
				const elapsed = Date.now() - timerStartRef.current;
				remainingRef.current = Math.max(0, delay - elapsed);
				return;
			}
			remainingRef.current = null;
			expandedDimsRef.current = { ...aDims.current };
			collapsingRef.current = true;
			preDismissRef.current = true;
			setDismissing(true);
		}, delay);
		dismissTimerRef.current = timer;
		return () => {
			clearTimeout(timer);
			const elapsed = Date.now() - timerStartRef.current;
			const remaining = delay - elapsed;
			if (remaining > 0 && (hoveredRef.current || containerHoveredRef.current)) remainingRef.current = remaining;
		};
	}, [
		showBody,
		actionSuccess,
		dismissing,
		prefersReducedMotion,
		hovered,
		containerHovered
	]);
	const canExpand = hasDescription || hasAction;
	const reExpandingRef = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (!hovered && !containerHovered || !canExpand || !dismissing) return;
		morphCtrl.current?.stop();
		collapsingRef.current = false;
		preDismissRef.current = false;
		remainingRef.current = null;
		reExpandingRef.current = true;
		setDismissing(false);
		setShowBody(true);
		if (showProgress) setProgressKey((k) => k + 1);
		const currentT = morphTRef.current;
		const startDims = { ...aDims.current };
		const morphExpandTransition = useSpring ? {
			type: "spring",
			duration: .9,
			bounce: bounceVal
		} : {
			duration: .6,
			ease: SMOOTH_EASE
		};
		requestAnimationFrame(() => {
			morphCtrl.current = animate(currentT, 1, {
				...morphExpandTransition,
				onUpdate: (t) => {
					morphTRef.current = t;
					const target = dimsRef.current;
					aDims.current = {
						pw: startDims.pw + (target.pw - startDims.pw) * t,
						bw: startDims.bw + (target.bw - startDims.bw) * t,
						th: startDims.th + (target.th - startDims.th) * t
					};
					flush();
					syncSonnerHeights(wrapperRef.current, true);
				},
				onComplete: () => {
					morphTRef.current = 1;
					aDims.current = { ...dimsRef.current };
					reExpandingRef.current = false;
					flush();
					syncSonnerHeights(wrapperRef.current, true);
				}
			});
		});
		return () => {
			morphCtrl.current?.stop();
		};
	}, [
		hovered,
		containerHovered,
		dismissing,
		canExpand
	]);
	(0, import_react.useEffect)(() => {
		if (!toastId || !dismissing || showBody) return;
		const t = setTimeout(() => {
			if (!hoveredRef.current && !containerHoveredRef.current) toast.dismiss(toastId);
		}, 800);
		return () => clearTimeout(t);
	}, [
		dismissing,
		showBody,
		toastId
	]);
	(0, import_react.useEffect)(() => {
		if (!toastId || !actionSuccess || showBody) return;
		const t = setTimeout(() => toast.dismiss(toastId), 1200);
		return () => clearTimeout(t);
	}, [
		toastId,
		actionSuccess,
		showBody
	]);
	(0, import_react.useEffect)(() => {
		if (reExpandingRef.current) return;
		if (!showBody) {
			morphTRef.current = 0;
			morphCtrl.current?.stop();
			flush();
			return;
		}
		if (prefersReducedMotion) {
			pillResizeCtrl.current?.stop();
			morphCtrl.current?.stop();
			morphTRef.current = 1;
			aDims.current = { ...dimsRef.current };
			flush();
			syncSonnerHeights(wrapperRef.current, true);
			return;
		}
		const raf = requestAnimationFrame(() => {
			pillResizeCtrl.current?.stop();
			morphCtrl.current?.stop();
			const startDims = { ...aDims.current };
			morphCtrl.current = animate(0, 1, {
				...useSpring ? {
					type: "spring",
					duration: .9,
					bounce: bounceVal
				} : {
					duration: .6,
					ease: SMOOTH_EASE
				},
				onUpdate: (t) => {
					morphTRef.current = t;
					const target = dimsRef.current;
					aDims.current = {
						pw: startDims.pw + (target.pw - startDims.pw) * t,
						bw: startDims.bw + (target.bw - startDims.bw) * t,
						th: startDims.th + (target.th - startDims.th) * t
					};
					flush();
					syncSonnerHeights(wrapperRef.current, true);
				},
				onComplete: () => {
					morphTRef.current = 1;
					aDims.current = { ...dimsRef.current };
					flush();
					syncSonnerHeights(wrapperRef.current, true);
				}
			});
		});
		return () => {
			cancelAnimationFrame(raf);
			morphCtrl.current?.stop();
		};
	}, [
		showBody,
		flush,
		prefersReducedMotion,
		useSpring
	]);
	const headerSquished = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (!headerRef.current || prefersReducedMotion) return;
		headerSquishCtrl.current?.stop();
		const el = headerRef.current;
		if (showBody && !dismissing && !actionSuccess) {
			if (!useSpring) return;
			headerSquished.current = true;
			headerSquishCtrl.current = animate(0, 1, {
				...squishSpring(expandDur, DEFAULT_EXPAND_DUR, bounceVal),
				onUpdate: (v) => {
					const scale = 1 - .05 * v;
					const pushY = v * 1;
					el.style.transform = `scale(${scale}) translateY(${pushY}px)`;
				}
			});
		} else if (headerSquished.current) {
			headerSquished.current = false;
			const transition = !preDismissRef.current && useSpring ? squishSpring(collapseDur, DEFAULT_COLLAPSE_DUR, bounceVal) : {
				duration: collapseDur * .5,
				ease: SMOOTH_EASE
			};
			headerSquishCtrl.current = animate(1, 0, {
				...transition,
				onUpdate: (v) => {
					const scale = 1 - .05 * v;
					const pushY = v * 1;
					el.style.transform = `scale(${scale}) translateY(${pushY}px)`;
				},
				onComplete: () => {
					el.style.transform = "";
				}
			});
		}
		return () => {
			headerSquishCtrl.current?.stop();
		};
	}, [
		showBody,
		dismissing,
		actionSuccess,
		prefersReducedMotion,
		expandDur,
		collapseDur,
		useSpring
	]);
	(0, import_react.useEffect)(() => {
		const wrapper = wrapperRef.current;
		if (!wrapper) return;
		const ol = wrapper.closest("[data-sonner-toast]")?.parentElement;
		if (!ol) return;
		const unregister = registerSonnerObserver(ol, () => {
			syncSonnerHeights(wrapper, true);
		});
		const expandObs = new MutationObserver((mutations) => {
			for (const m of mutations) if (m.type === "attributes" && m.attributeName === "data-expanded" && m.target.getAttribute("data-expanded") === "true") {
				syncSonnerHeights(wrapper, true);
				break;
			}
		});
		expandObs.observe(ol, {
			attributes: true,
			attributeFilter: ["data-expanded"],
			subtree: true
		});
		return () => {
			unregister();
			expandObs.disconnect();
		};
	}, []);
	const handleActionClick = (0, import_react.useCallback)(() => {
		if (!effectiveAction) return;
		if (effectiveAction.successLabel) {
			expandedDimsRef.current = { ...aDims.current };
			collapsingRef.current = true;
			setActionSuccess(effectiveAction.successLabel);
		}
		try {
			effectiveAction.onClick();
		} catch {}
	}, [effectiveAction]);
	const SWIPE_THRESHOLD = 100;
	const swipeStartRef = (0, import_react.useRef)(null);
	const [swipeOffsetX, setSwipeOffsetX] = (0, import_react.useState)(0);
	const isSwipingRef = (0, import_react.useRef)(false);
	const handleTouchStart = (0, import_react.useCallback)((e) => {
		if (!getGooeySwipeToDismiss()) return;
		const touch = e.touches[0];
		swipeStartRef.current = {
			x: touch.clientX,
			y: touch.clientY
		};
		isSwipingRef.current = false;
	}, []);
	const handleTouchMove = (0, import_react.useCallback)((e) => {
		if (!swipeStartRef.current || !getGooeySwipeToDismiss()) return;
		const touch = e.touches[0];
		const dx = touch.clientX - swipeStartRef.current.x;
		const dy = touch.clientY - swipeStartRef.current.y;
		if (!isSwipingRef.current && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10) {
			swipeStartRef.current = null;
			return;
		}
		if (!isSwipingRef.current && Math.abs(dx) > 10) isSwipingRef.current = true;
		if (isSwipingRef.current) setSwipeOffsetX(dx);
	}, []);
	const handleTouchEnd = (0, import_react.useCallback)(() => {
		if (!getGooeySwipeToDismiss()) {
			swipeStartRef.current = null;
			return;
		}
		if (isSwipingRef.current && Math.abs(swipeOffsetX) >= SWIPE_THRESHOLD && toastId) toast.dismiss(toastId);
		swipeStartRef.current = null;
		isSwipingRef.current = false;
		setSwipeOffsetX(0);
	}, [swipeOffsetX, toastId]);
	const swipeOpacity = swipeOffsetX !== 0 ? Math.max(0, 1 - Math.abs(swipeOffsetX) / (SWIPE_THRESHOLD * 1.5)) : 1;
	const swipeTranslate = swipeOffsetX !== 0 ? `translateX(${swipeOffsetX}px)` : "";
	const renderIcon = () => {
		if (!actionSuccess && icon) return icon;
		if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpinnerIcon, {
			size: 18,
			className: styles.spinnerSpin
		});
		const IconComponent = phaseIconMap[effectivePhase];
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconComponent, { size: 18 });
	};
	const iconTransition = (0, import_react.useMemo)(() => prefersReducedMotion ? { duration: .01 } : { duration: .2 }, [prefersReducedMotion]);
	const iconEl = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `${styles.iconWrapper}${classNames?.icon ? ` ${classNames.icon}` : ""}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
			mode: "wait",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				initial: prefersReducedMotion ? false : {
					opacity: 0,
					scale: .5
				},
				animate: {
					opacity: 1,
					scale: 1
				},
				exit: {
					opacity: 0,
					scale: .5
				},
				transition: iconTransition,
				children: renderIcon()
			}, isLoading ? "spinner" : effectivePhase)
		})
	});
	const titleEl = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `${styles.title}${classNames?.title ? ` ${classNames.title}` : ""}`,
		children: effectiveTitle
	});
	const createdAtRef = (0, import_react.useRef)(/* @__PURE__ */ new Date());
	const timestampStr = (0, import_react.useMemo)(() => createdAtRef.current.toLocaleTimeString(void 0, {
		hour: "numeric",
		minute: "2-digit",
		second: "2-digit"
	}), []);
	const iconAndTitle = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [iconEl, titleEl] });
	const basePositionStyle = (0, import_react.useMemo)(() => isCenter ? { margin: "0 auto" } : isRight ? {
		marginLeft: "auto",
		transform: "scaleX(-1)"
	} : {}, [isCenter, isRight]);
	const wrapperStyle = (0, import_react.useMemo)(() => {
		if (swipeTranslate) return {
			...basePositionStyle,
			transform: (basePositionStyle.transform ? basePositionStyle.transform + " " : "") + swipeTranslate,
			opacity: swipeOpacity,
			transition: "none"
		};
		return Object.keys(basePositionStyle).length > 0 ? basePositionStyle : void 0;
	}, [
		basePositionStyle,
		swipeTranslate,
		swipeOpacity
	]);
	const contentStyle = (0, import_react.useMemo)(() => isCenter ? { textAlign: "center" } : isRight ? {
		transform: "scaleX(-1)",
		textAlign: "right"
	} : { textAlign: "left" }, [isCenter, isRight]);
	const handleMouseEnter = (0, import_react.useCallback)(() => {
		hoveredRef.current = true;
		setHovered(true);
	}, []);
	const handleMouseLeave = (0, import_react.useCallback)(() => {
		hoveredRef.current = false;
		setHovered(false);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: wrapperRef,
		className: `${styles.wrapper}${classNames?.wrapper ? ` ${classNames.wrapper}` : ""}`,
		style: wrapperStyle,
		role: effectivePhase === "error" || effectivePhase === "warning" ? "alert" : "status",
		"aria-live": effectivePhase === "error" || effectivePhase === "warning" ? "assertive" : "polite",
		"aria-atomic": "true",
		onMouseEnter: handleMouseEnter,
		onMouseLeave: handleMouseLeave,
		onTouchStart: handleTouchStart,
		onTouchMove: handleTouchMove,
		onTouchEnd: handleTouchEnd,
		"data-center": isCenter || void 0,
		"data-theme": theme,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
				className: styles.blobSvg,
				"aria-hidden": true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					ref: pathRef,
					fill: fillColor,
					stroke: borderColor || "none",
					strokeWidth: borderColor ? borderWidth ?? 1.5 : 0
				})
			}),
			showCloseButton && effectivePhase !== "loading" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: `${styles.closeButton}${(isRight ? closeButtonSetting !== "top-right" : closeButtonSetting === "top-right") ? ` ${styles.closeButtonRight}` : ""}`,
				"aria-label": "Close toast",
				type: "button",
				style: {
					background: fillColor,
					borderColor: borderColor || "transparent",
					borderWidth: borderColor ? borderWidth ?? 1.5 : 0,
					boxShadow: borderColor ? "none" : "0 1px 4px rgba(0, 0, 0, 0.2)",
					...isCenter && closeButtonSetting !== "top-right" ? {
						top: 6,
						left: -1
					} : {}
				},
				onClick: (e) => {
					e.stopPropagation();
					const id = toastId;
					if (id != null) toast.dismiss(id);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					xmlns: "http://www.w3.org/2000/svg",
					width: "12",
					height: "12",
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2",
					strokeLinecap: "round",
					strokeLinejoin: "round",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: "18",
						y1: "6",
						x2: "6",
						y2: "18"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: "6",
						y1: "6",
						x2: "18",
						y2: "18"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: contentRef,
				className: `${styles.content} ${showBody ? styles.contentExpanded : styles.contentCompact}${classNames?.content ? ` ${classNames.content}` : ""}`,
				style: contentStyle,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						ref: headerRef,
						className: `${styles.header} ${titleColorMap[effectivePhase]}${classNames?.header ? ` ${classNames.header}` : ""}`,
						children: [iconAndTitle, !hasDescription && !hasAction && !actionSuccess && showTimestamp && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: styles.timestamp,
							children: timestampStr
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: showBody && hasDescription && !dismissing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						className: `${styles.description}${classNames?.description ? ` ${classNames.description}` : ""}`,
						style: { textAlign: "left" },
						initial: prefersReducedMotion ? false : { opacity: 0 },
						animate: { opacity: 1 },
						exit: { opacity: 0 },
						transition: prefersReducedMotion ? { duration: .01 } : {
							duration: .35,
							ease: [
								.4,
								0,
								.2,
								1
							]
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								display: "flex",
								alignItems: "flex-start",
								gap: "10px"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									flex: 1,
									minWidth: 0
								},
								children: effectiveDescription
							}), showTimestamp && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: styles.timestamp,
								children: timestampStr
							})]
						})
					}, "description") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: showBody && !hasDescription && hasAction && !dismissing && showTimestamp && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						className: styles.timestamp,
						style: {
							textAlign: "right",
							marginTop: 8,
							paddingLeft: 0
						},
						initial: prefersReducedMotion ? false : { opacity: 0 },
						animate: { opacity: 1 },
						exit: { opacity: 0 },
						transition: prefersReducedMotion ? { duration: .01 } : {
							duration: .35,
							ease: [
								.4,
								0,
								.2,
								1
							]
						},
						children: timestampStr
					}, "timestamp-body") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: showBody && hasAction && effectiveAction && !dismissing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						className: `${styles.actionWrapper}${classNames?.actionWrapper ? ` ${classNames.actionWrapper}` : ""}`,
						initial: prefersReducedMotion ? false : { opacity: 0 },
						animate: { opacity: 1 },
						exit: { opacity: 0 },
						transition: prefersReducedMotion ? { duration: .01 } : {
							duration: .35,
							ease: [
								.4,
								0,
								.2,
								1
							],
							delay: .1
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: `${styles.actionButton} ${actionColorMap[effectivePhase]}${classNames?.actionButton ? ` ${classNames.actionButton}` : ""}`,
							onClick: handleActionClick,
							type: "button",
							"aria-label": effectiveAction.label,
							children: effectiveAction.label
						})
					}, "action") }),
					showProgress && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `${styles.progressWrapper}${hovered || containerHovered ? ` ${styles.progressPaused}` : ""}`,
						style: { opacity: showBody && !actionSuccess ? 1 : 0 },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `${styles.progressBar} ${progressColorMap[effectivePhase]}`,
							style: { "--gooey-progress-duration": `${progressDelayRef.current || (timing?.displayDuration ?? DEFAULT_DISPLAY_DURATION)}ms` }
						})
					}, progressKey)
				]
			})
		]
	});
};
var ToastErrorBoundary = class extends import_react.Component {
	constructor() {
		super(...arguments);
		this.state = { hasError: false };
	}
	static getDerivedStateFromError() {
		return { hasError: true };
	}
	componentDidCatch(error, errorInfo) {
		console.error("[GooeyToast] Rendering error:", error, errorInfo);
	}
	render() {
		if (this.state.hasError) return null;
		return this.props.children;
	}
};
var DEFAULT_EXPANDED_DURATION = 4e3;
function getAnnouncePoliteness(type) {
	return type === "error" || type === "warning" ? "assertive" : "polite";
}
function buildAnnouncementMessage(title, description) {
	if (!description || typeof description !== "string") return title;
	return `${title}: ${description}`;
}
var _activeIds = /* @__PURE__ */ new Map();
var _queue = [];
var _toastCallbacks = /* @__PURE__ */ new Map();
var _autoCloseFlags = /* @__PURE__ */ new Set();
var _manualDismissFlags = /* @__PURE__ */ new Set();
function _getMostRecentActiveId() {
	let last;
	for (const id of _activeIds.keys()) last = id;
	return last;
}
function _processQueue() {
	const max = getGooeyVisibleToasts();
	while (_queue.length > 0 && _activeIds.size < max) {
		const next = _queue.shift();
		_activeIds.set(next.id, next.type);
		next.create();
	}
}
function _enqueue(entry) {
	const maxQueue = getGooeyMaxQueue();
	const overflow = getGooeyQueueOverflow();
	if (_queue.length >= maxQueue) {
		if (overflow === "drop-newest") return false;
		_queue.shift();
	}
	_queue.push(entry);
	return true;
}
function _onToastDismissed(id) {
	if (!_activeIds.delete(id)) return;
	_toastUpdateListeners.delete(id);
	const cbs = _toastCallbacks.get(id);
	if (cbs) {
		if ((_autoCloseFlags.has(id) || !_manualDismissFlags.has(id)) && cbs.onAutoClose) try {
			cbs.onAutoClose(id);
		} catch {}
		if (cbs.onDismiss) try {
			cbs.onDismiss(id);
		} catch {}
		_toastCallbacks.delete(id);
	}
	_autoCloseFlags.delete(id);
	_manualDismissFlags.delete(id);
	_processQueue();
}
var _toastUpdateListeners = /* @__PURE__ */ new Map();
function updateGooeyToast(id, options) {
	const listener = _toastUpdateListeners.get(id);
	if (listener) {
		listener(options);
		if (options.type !== void 0 && _activeIds.has(id)) _activeIds.set(id, options.type);
		if (options.title !== void 0) announce(buildAnnouncementMessage(options.title, options.description), options.type ? getAnnouncePoliteness(options.type) : "polite");
	}
}
function GooeyToastWrapper({ initialPhase, title: initialTitle, type: initialType, description: initialDescription, action: initialAction, icon, classNames, fillColor, borderColor, borderWidth, timing, preset, spring, bounce, showProgress, showTimestamp: initialShowTimestamp, toastId, onDismiss, onAutoClose }) {
	(0, import_react.useEffect)(() => {
		if (onDismiss || onAutoClose) _toastCallbacks.set(toastId, {
			onDismiss,
			onAutoClose
		});
	}, [
		toastId,
		onDismiss,
		onAutoClose
	]);
	const [title, setTitle] = (0, import_react.useState)(initialTitle);
	const [type, setType] = (0, import_react.useState)(initialType);
	const [phase, setPhase] = (0, import_react.useState)(initialPhase);
	const [description, setDescription] = (0, import_react.useState)(initialDescription);
	const [action, setAction] = (0, import_react.useState)(initialAction);
	const [currentIcon, setCurrentIcon] = (0, import_react.useState)(icon);
	const [showTimestamp, setShowTimestamp] = (0, import_react.useState)(initialShowTimestamp ?? true);
	(0, import_react.useEffect)(() => {
		const handleUpdate = (opts) => {
			if (opts.title !== void 0) setTitle(opts.title);
			if (opts.description !== void 0) setDescription(opts.description);
			if (opts.type !== void 0) {
				setType(opts.type);
				setPhase(opts.type);
			}
			if (opts.action !== void 0) setAction(opts.action);
			if ("icon" in opts) setCurrentIcon(opts.icon ?? void 0);
			if (opts.showTimestamp !== void 0) setShowTimestamp(opts.showTimestamp);
		};
		_toastUpdateListeners.set(toastId, handleUpdate);
		return () => {
			_toastUpdateListeners.delete(toastId);
		};
	}, [toastId]);
	const mountedRef = (0, import_react.useRef)(true);
	(0, import_react.useEffect)(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
			setTimeout(() => {
				if (!mountedRef.current) _onToastDismissed(toastId);
			}, 100);
		};
	}, [toastId]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastErrorBoundary, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GooeyToast, {
		title,
		description,
		type,
		action,
		icon: currentIcon,
		phase,
		classNames,
		fillColor,
		borderColor,
		borderWidth,
		timing,
		preset,
		spring,
		bounce,
		showProgress,
		showTimestamp,
		toastId
	}) });
}
function PromiseToastWrapper({ promise, data, toastId }) {
	const [phase, setPhase] = (0, import_react.useState)("loading");
	const [title, setTitle] = (0, import_react.useState)(data.loading);
	const [description, setDescription] = (0, import_react.useState)(data.description?.loading);
	const [action, setAction] = (0, import_react.useState)(void 0);
	(0, import_react.useEffect)(() => {
		if (data.onDismiss || data.onAutoClose) _toastCallbacks.set(toastId, {
			onDismiss: data.onDismiss,
			onAutoClose: data.onAutoClose
		});
	}, [
		toastId,
		data.onDismiss,
		data.onAutoClose
	]);
	const mountedRef = (0, import_react.useRef)(true);
	(0, import_react.useEffect)(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
			setTimeout(() => {
				if (!mountedRef.current) _onToastDismissed(toastId);
			}, 100);
		};
	}, [toastId]);
	(0, import_react.useEffect)(() => {
		const resetDuration = (hasExpandedContent) => {
			const baseDuration = data.timing?.displayDuration ?? (hasExpandedContent ? DEFAULT_EXPANDED_DURATION : void 0);
			const duration = baseDuration != null && hasExpandedContent ? baseDuration + .9 * 1e3 : baseDuration;
			if (duration != null) toast.custom(() => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PromiseToastWrapper, {
				promise,
				data,
				toastId
			}), {
				id: toastId,
				duration
			});
		};
		promise.then((result) => {
			const desc = typeof data.description?.success === "function" ? data.description.success(result) : data.description?.success;
			const resolvedTitle = typeof data.success === "function" ? data.success(result) : data.success;
			setTitle(resolvedTitle);
			setDescription(desc);
			setAction(data.action?.success);
			setPhase("success");
			resetDuration(Boolean(desc || data.action?.success));
			announce(buildAnnouncementMessage(resolvedTitle, desc), "polite");
		}).catch((err) => {
			const desc = typeof data.description?.error === "function" ? data.description.error(err) : data.description?.error;
			const resolvedTitle = typeof data.error === "function" ? data.error(err) : data.error;
			setTitle(resolvedTitle);
			setDescription(desc);
			setAction(data.action?.error);
			setPhase("error");
			resetDuration(Boolean(desc || data.action?.error));
			announce(buildAnnouncementMessage(resolvedTitle, desc), "assertive");
		});
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastErrorBoundary, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GooeyToast, {
		title,
		description,
		type: phase === "loading" ? "info" : phase,
		action,
		phase,
		classNames: data.classNames,
		fillColor: data.fillColor,
		borderColor: data.borderColor,
		borderWidth: data.borderWidth,
		timing: data.timing,
		preset: data.preset,
		spring: data.spring,
		bounce: data.bounce,
		showTimestamp: data.showTimestamp ?? true,
		toastId
	}) });
}
function createGooeyToast(title, type, options) {
	const hasExpandedContent = Boolean(options?.description || options?.action);
	const baseDuration = options?.timing?.displayDuration ?? options?.duration ?? (options?.description ? DEFAULT_EXPANDED_DURATION : void 0);
	const duration = hasExpandedContent ? Infinity : baseDuration;
	const toastId = options?.id ?? Math.random().toString(36).slice(2);
	const create = () => {
		toast.custom(() => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GooeyToastWrapper, {
			initialPhase: type,
			title,
			type,
			description: options?.description,
			action: options?.action,
			icon: options?.icon,
			classNames: options?.classNames,
			fillColor: options?.fillColor,
			borderColor: options?.borderColor,
			borderWidth: options?.borderWidth,
			timing: options?.timing,
			preset: options?.preset,
			spring: options?.spring,
			bounce: options?.bounce,
			showProgress: options?.showProgress,
			showTimestamp: options?.showTimestamp,
			toastId,
			onDismiss: options?.onDismiss,
			onAutoClose: options?.onAutoClose
		}), {
			duration,
			id: toastId
		});
	};
	if (options?.onDismiss || options?.onAutoClose) _toastCallbacks.set(toastId, {
		onDismiss: options.onDismiss,
		onAutoClose: options.onAutoClose
	});
	announce(buildAnnouncementMessage(title, options?.description), getAnnouncePoliteness(type));
	if (_activeIds.size < getGooeyVisibleToasts()) {
		_activeIds.set(toastId, type);
		create();
	} else _enqueue({
		id: toastId,
		type,
		create
	});
	return toastId;
}
function dismissGooeyToast(idOrFilter) {
	if (idOrFilter != null && typeof idOrFilter === "object") {
		const filterTypes = Array.isArray(idOrFilter.type) ? idOrFilter.type : [idOrFilter.type];
		const typesSet = new Set(filterTypes);
		for (let i = _queue.length - 1; i >= 0; i--) if (typesSet.has(_queue[i].type)) _queue.splice(i, 1);
		for (const [id, toastType] of _activeIds) if (typesSet.has(toastType)) {
			_manualDismissFlags.add(id);
			toast.dismiss(id);
		}
	} else if (idOrFilter != null) {
		const idx = _queue.findIndex((q) => q.id === idOrFilter);
		if (idx !== -1) {
			_queue.splice(idx, 1);
			return;
		}
		_manualDismissFlags.add(idOrFilter);
		toast.dismiss(idOrFilter);
	} else {
		for (const id of _activeIds.keys()) _manualDismissFlags.add(id);
		_queue.length = 0;
		_activeIds.clear();
		toast.dismiss();
	}
}
var gooeyToast = Object.assign((title, options) => createGooeyToast(title, "default", options), {
	success: (title, options) => createGooeyToast(title, "success", options),
	error: (title, options) => createGooeyToast(title, "error", options),
	warning: (title, options) => createGooeyToast(title, "warning", options),
	info: (title, options) => createGooeyToast(title, "info", options),
	promise: (promise, data) => {
		const id = Math.random().toString(36).slice(2);
		announce(buildAnnouncementMessage(data.loading, data.description?.loading), "polite");
		if (data.onDismiss || data.onAutoClose) _toastCallbacks.set(id, {
			onDismiss: data.onDismiss,
			onAutoClose: data.onAutoClose
		});
		const create = () => {
			toast.custom(() => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PromiseToastWrapper, {
				promise,
				data,
				toastId: id
			}), {
				id,
				duration: data.timing?.displayDuration != null || data.description ? Infinity : void 0
			});
		};
		if (_activeIds.size < getGooeyVisibleToasts()) {
			_activeIds.set(id, "info");
			create();
		} else _enqueue({
			id,
			type: "info",
			create
		});
		return id;
	},
	dismiss: dismissGooeyToast,
	update: updateGooeyToast
});
function AriaLiveAnnouncer() {
	const [politeMessage, setPoliteMessage] = (0, import_react.useState)("");
	const [assertiveMessage, setAssertiveMessage] = (0, import_react.useState)("");
	const handleAnnouncement = (0, import_react.useCallback)(({ message, politeness }) => {
		if (politeness === "assertive") {
			setAssertiveMessage("");
			requestAnimationFrame(() => setAssertiveMessage(message));
		} else {
			setPoliteMessage("");
			requestAnimationFrame(() => setPoliteMessage(message));
		}
	}, []);
	(0, import_react.useEffect)(() => {
		return subscribeAnnouncements(handleAnnouncement);
	}, [handleAnnouncement]);
	(0, import_react.useEffect)(() => {
		if (!politeMessage) return;
		const t = setTimeout(() => setPoliteMessage(""), 7e3);
		return () => clearTimeout(t);
	}, [politeMessage]);
	(0, import_react.useEffect)(() => {
		if (!assertiveMessage) return;
		const t = setTimeout(() => setAssertiveMessage(""), 7e3);
		return () => clearTimeout(t);
	}, [assertiveMessage]);
	const visuallyHidden = {
		position: "absolute",
		width: "1px",
		height: "1px",
		padding: 0,
		margin: "-1px",
		overflow: "hidden",
		clip: "rect(0, 0, 0, 0)",
		whiteSpace: "nowrap",
		border: 0
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "status",
		"aria-live": "polite",
		"aria-atomic": "true",
		style: visuallyHidden,
		children: politeMessage
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "alert",
		"aria-live": "assertive",
		"aria-atomic": "true",
		style: visuallyHidden,
		children: assertiveMessage
	})] });
}
function GooeyToaster({ position = "bottom-right", duration, gap = 14, offset = "24px", theme = "light", toastOptions, expand, closeButton, richColors, visibleToasts, dir, preset, spring, bounce, swipeToDismiss = true, closeOnEscape = true, maxQueue = Infinity, queueOverflow = "drop-oldest", showProgress = false, showTimestamp = true }) {
	const presetConfig = preset ? animationPresets[preset] : void 0;
	const resolvedSpring = spring ?? presetConfig?.spring ?? true;
	const resolvedBounce = bounce ?? presetConfig?.bounce;
	(0, import_react.useEffect)(() => {
		setGooeyPosition(position);
	}, [position]);
	(0, import_react.useEffect)(() => {
		setGooeyDir(dir ?? "ltr");
	}, [dir]);
	(0, import_react.useEffect)(() => {
		setGooeyTheme(theme);
	}, [theme]);
	(0, import_react.useEffect)(() => {
		setGooeySpring(resolvedSpring);
	}, [resolvedSpring]);
	(0, import_react.useEffect)(() => {
		setGooeyBounce(resolvedBounce);
	}, [resolvedBounce]);
	(0, import_react.useEffect)(() => {
		setGooeySwipeToDismiss(swipeToDismiss);
	}, [swipeToDismiss]);
	(0, import_react.useEffect)(() => {}, [closeOnEscape]);
	(0, import_react.useEffect)(() => {
		if (!closeOnEscape) return;
		const handleKeyDown = (e) => {
			if (e.key === "Escape") {
				const recentId = _getMostRecentActiveId();
				if (recentId != null) gooeyToast.dismiss(recentId);
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [closeOnEscape]);
	(0, import_react.useEffect)(() => {
		setGooeyVisibleToasts(visibleToasts ?? 3);
	}, [visibleToasts]);
	(0, import_react.useEffect)(() => {
		setGooeyMaxQueue(maxQueue);
	}, [maxQueue]);
	(0, import_react.useEffect)(() => {
		setGooeyQueueOverflow(queueOverflow);
	}, [queueOverflow]);
	(0, import_react.useEffect)(() => {
		setGooeyShowProgress(showProgress);
	}, [showProgress]);
	(0, import_react.useEffect)(() => {
		setGooeyCloseButton(closeButton ?? false);
	}, [closeButton]);
	(0, import_react.useEffect)(() => {
		setGooeyShowTimestamp(showTimestamp);
	}, [showTimestamp]);
	(0, import_react.useEffect)(() => {
		let expandObs = null;
		let currentOl = null;
		const syncFromExpanded = (ol) => {
			setContainerHovered(ol.querySelector("[data-sonner-toast][data-expanded=\"true\"]") !== null);
		};
		const attach = (ol) => {
			if (ol === currentOl) return;
			expandObs?.disconnect();
			currentOl = ol;
			expandObs = new MutationObserver(() => syncFromExpanded(ol));
			expandObs.observe(ol, {
				attributes: true,
				attributeFilter: ["data-expanded"],
				subtree: true
			});
			syncFromExpanded(ol);
		};
		const el = document.querySelector("[data-sonner-toaster]");
		if (el) attach(el);
		let bodyRafId = 0;
		const bodyObs = new MutationObserver(() => {
			if (bodyRafId) return;
			bodyRafId = requestAnimationFrame(() => {
				bodyRafId = 0;
				const found = document.querySelector("[data-sonner-toaster]");
				if (found) attach(found);
				else if (currentOl) {
					expandObs?.disconnect();
					currentOl = null;
					setContainerHovered(false);
				}
			});
		});
		bodyObs.observe(document.body, {
			childList: true,
			subtree: true
		});
		return () => {
			if (bodyRafId) cancelAnimationFrame(bodyRafId);
			bodyObs.disconnect();
			expandObs?.disconnect();
			setContainerHovered(false);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const el = document.createElement("div");
		el.setAttribute("data-gooey-toast-css", "");
		el.style.position = "absolute";
		el.style.width = "0";
		el.style.height = "0";
		el.style.overflow = "hidden";
		el.style.pointerEvents = "none";
		document.body.appendChild(el);
		const value = getComputedStyle(el).getPropertyValue("--gooey-toast");
		document.body.removeChild(el);
		if (!value) console.warn("[gooey-toast] Styles not found. Make sure to import the CSS:\n\n  import \"goey-toast/styles.css\";\n");
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		position,
		duration,
		gap,
		offset,
		theme,
		toastOptions: {
			unstyled: true,
			...toastOptions
		},
		expand,
		closeButton: false,
		richColors,
		visibleToasts: 99,
		dir
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AriaLiveAnnouncer, {})] });
}
//#endregion
export { GooeyToaster as GoeyToaster, GooeyToaster, animationPresets, gooeyToast as goeyToast, gooeyToast };
