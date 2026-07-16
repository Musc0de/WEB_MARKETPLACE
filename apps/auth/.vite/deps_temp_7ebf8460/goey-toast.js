import {
  AnimatePresence,
  animate,
  motion
} from "./chunk-Q4KJIZEK.js";
import {
  require_jsx_runtime
} from "./chunk-HIGNLTFM.js";
import {
  require_react_dom
} from "./chunk-VVF5MN7A.js";
import {
  require_react
} from "./chunk-BX5ISVL4.js";
import {
  __toESM
} from "./chunk-DC5AMYBS.js";

// ../../node_modules/.deno/goey-toast@0.5.0/node_modules/goey-toast/dist/index.js
var import_react2 = __toESM(require_react());

// ../../node_modules/.deno/sonner@2.0.7/node_modules/sonner/dist/index.mjs
var import_react = __toESM(require_react(), 1);
var import_react_dom = __toESM(require_react_dom(), 1);
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
    case "success":
      return SuccessIcon;
    case "info":
      return InfoIcon;
    case "warning":
      return WarningIcon;
    case "error":
      return ErrorIcon;
    default:
      return null;
  }
};
var bars = Array(12).fill(0);
var Loader = ({ visible, className }) => {
  return import_react.default.createElement("div", {
    className: [
      "sonner-loading-wrapper",
      className
    ].filter(Boolean).join(" "),
    "data-visible": visible
  }, import_react.default.createElement("div", {
    className: "sonner-spinner"
  }, bars.map((_, i) => import_react.default.createElement("div", {
    className: "sonner-loading-bar",
    key: `spinner-bar-${i}`
  }))));
};
var SuccessIcon = import_react.default.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  height: "20",
  width: "20"
}, import_react.default.createElement("path", {
  fillRule: "evenodd",
  d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z",
  clipRule: "evenodd"
}));
var WarningIcon = import_react.default.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "currentColor",
  height: "20",
  width: "20"
}, import_react.default.createElement("path", {
  fillRule: "evenodd",
  d: "M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z",
  clipRule: "evenodd"
}));
var InfoIcon = import_react.default.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  height: "20",
  width: "20"
}, import_react.default.createElement("path", {
  fillRule: "evenodd",
  d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z",
  clipRule: "evenodd"
}));
var ErrorIcon = import_react.default.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  height: "20",
  width: "20"
}, import_react.default.createElement("path", {
  fillRule: "evenodd",
  d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z",
  clipRule: "evenodd"
}));
var CloseIcon = import_react.default.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  width: "12",
  height: "12",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, import_react.default.createElement("line", {
  x1: "18",
  y1: "6",
  x2: "6",
  y2: "18"
}), import_react.default.createElement("line", {
  x1: "6",
  y1: "6",
  x2: "18",
  y2: "18"
}));
var useIsDocumentHidden = () => {
  const [isDocumentHidden, setIsDocumentHidden] = import_react.default.useState(document.hidden);
  import_react.default.useEffect(() => {
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
      this.toasts = [
        ...this.toasts,
        data
      ];
    };
    this.create = (data) => {
      var _data_id;
      const { message, ...rest } = data;
      const id = typeof (data == null ? void 0 : data.id) === "number" || ((_data_id = data.id) == null ? void 0 : _data_id.length) > 0 ? data.id : toastsCounter++;
      const alreadyExists = this.toasts.find((toast2) => {
        return toast2.id === id;
      });
      const dismissible = data.dismissible === void 0 ? true : data.dismissible;
      if (this.dismissedToasts.has(id)) {
        this.dismissedToasts.delete(id);
      }
      if (alreadyExists) {
        this.toasts = this.toasts.map((toast2) => {
          if (toast2.id === id) {
            this.publish({
              ...toast2,
              ...data,
              id,
              title: message
            });
            return {
              ...toast2,
              ...data,
              id,
              dismissible,
              title: message
            };
          }
          return toast2;
        });
      } else {
        this.addToast({
          title: message,
          ...rest,
          dismissible,
          id
        });
      }
      return id;
    };
    this.dismiss = (id) => {
      if (id) {
        this.dismissedToasts.add(id);
        requestAnimationFrame(() => this.subscribers.forEach((subscriber) => subscriber({
          id,
          dismiss: true
        })));
      } else {
        this.toasts.forEach((toast2) => {
          this.subscribers.forEach((subscriber) => subscriber({
            id: toast2.id,
            dismiss: true
          }));
        });
      }
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
      if (!data) {
        return;
      }
      let id = void 0;
      if (data.loading !== void 0) {
        id = this.create({
          ...data,
          promise,
          type: "loading",
          message: data.loading,
          description: typeof data.description !== "function" ? data.description : void 0
        });
      }
      const p = Promise.resolve(promise instanceof Function ? promise() : promise);
      let shouldDismiss = id !== void 0;
      let result;
      const originalPromise = p.then(async (response) => {
        result = [
          "resolve",
          response
        ];
        const isReactElementResponse = import_react.default.isValidElement(response);
        if (isReactElementResponse) {
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
          const isExtendedResult = typeof promiseData === "object" && !import_react.default.isValidElement(promiseData);
          const toastSettings = isExtendedResult ? promiseData : {
            message: promiseData
          };
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
          const isExtendedResult = typeof promiseData === "object" && !import_react.default.isValidElement(promiseData);
          const toastSettings = isExtendedResult ? promiseData : {
            message: promiseData
          };
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
          const isExtendedResult = typeof promiseData === "object" && !import_react.default.isValidElement(promiseData);
          const toastSettings = isExtendedResult ? promiseData : {
            message: promiseData
          };
          this.create({
            id,
            type: "success",
            description,
            ...toastSettings
          });
        }
      }).catch(async (error) => {
        result = [
          "reject",
          error
        ];
        if (data.error !== void 0) {
          shouldDismiss = false;
          const promiseData = typeof data.error === "function" ? await data.error(error) : data.error;
          const description = typeof data.description === "function" ? await data.description(error) : data.description;
          const isExtendedResult = typeof promiseData === "object" && !import_react.default.isValidElement(promiseData);
          const toastSettings = isExtendedResult ? promiseData : {
            message: promiseData
          };
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
        data.finally == null ? void 0 : data.finally.call(data);
      });
      const unwrap = () => new Promise((resolve, reject) => originalPromise.then(() => result[0] === "reject" ? reject(result[1]) : resolve(result[1])).catch(reject));
      if (typeof id !== "string" && typeof id !== "number") {
        return {
          unwrap
        };
      } else {
        return Object.assign(id, {
          unwrap
        });
      }
    };
    this.custom = (jsx2, data) => {
      const id = (data == null ? void 0 : data.id) || toastsCounter++;
      this.create({
        jsx: jsx2(id),
        id,
        ...data
      });
      return id;
    };
    this.getActiveToasts = () => {
      return this.toasts.filter((toast2) => !this.dismissedToasts.has(toast2.id));
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
  if (y) {
    directions.push(y);
  }
  if (x) {
    directions.push(x);
  }
  return directions;
}
var Toast = (props) => {
  var _toast_classNames, _toast_classNames1, _toast_classNames2, _toast_classNames3, _toast_classNames4, _toast_classNames5, _toast_classNames6, _toast_classNames7, _toast_classNames8;
  const { invert: ToasterInvert, toast: toast2, unstyled, interacting, setHeights, visibleToasts, heights, index, toasts, expanded, removeToast, defaultRichColors, closeButton: closeButtonFromToaster, style, cancelButtonStyle, actionButtonStyle, className = "", descriptionClassName = "", duration: durationFromToaster, position, gap, expandByDefault, classNames, icons, closeButtonAriaLabel = "Close toast" } = props;
  const [swipeDirection, setSwipeDirection] = import_react.default.useState(null);
  const [swipeOutDirection, setSwipeOutDirection] = import_react.default.useState(null);
  const [mounted, setMounted] = import_react.default.useState(false);
  const [removed, setRemoved] = import_react.default.useState(false);
  const [swiping, setSwiping] = import_react.default.useState(false);
  const [swipeOut, setSwipeOut] = import_react.default.useState(false);
  const [isSwiped, setIsSwiped] = import_react.default.useState(false);
  const [offsetBeforeRemove, setOffsetBeforeRemove] = import_react.default.useState(0);
  const [initialHeight, setInitialHeight] = import_react.default.useState(0);
  const remainingTime = import_react.default.useRef(toast2.duration || durationFromToaster || TOAST_LIFETIME);
  const dragStartTime = import_react.default.useRef(null);
  const toastRef = import_react.default.useRef(null);
  const isFront = index === 0;
  const isVisible = index + 1 <= visibleToasts;
  const toastType = toast2.type;
  const dismissible = toast2.dismissible !== false;
  const toastClassname = toast2.className || "";
  const toastDescriptionClassname = toast2.descriptionClassName || "";
  const heightIndex = import_react.default.useMemo(() => heights.findIndex((height) => height.toastId === toast2.id) || 0, [
    heights,
    toast2.id
  ]);
  const closeButton = import_react.default.useMemo(() => {
    var _toast_closeButton;
    return (_toast_closeButton = toast2.closeButton) != null ? _toast_closeButton : closeButtonFromToaster;
  }, [
    toast2.closeButton,
    closeButtonFromToaster
  ]);
  const duration = import_react.default.useMemo(() => toast2.duration || durationFromToaster || TOAST_LIFETIME, [
    toast2.duration,
    durationFromToaster
  ]);
  const closeTimerStartTimeRef = import_react.default.useRef(0);
  const offset = import_react.default.useRef(0);
  const lastCloseTimerStartTimeRef = import_react.default.useRef(0);
  const pointerStartRef = import_react.default.useRef(null);
  const [y, x] = position.split("-");
  const toastsHeightBefore = import_react.default.useMemo(() => {
    return heights.reduce((prev, curr, reducerIndex) => {
      if (reducerIndex >= heightIndex) {
        return prev;
      }
      return prev + curr.height;
    }, 0);
  }, [
    heights,
    heightIndex
  ]);
  const isDocumentHidden = useIsDocumentHidden();
  const invert = toast2.invert || ToasterInvert;
  const disabled = toastType === "loading";
  offset.current = import_react.default.useMemo(() => heightIndex * gap + toastsHeightBefore, [
    heightIndex,
    toastsHeightBefore
  ]);
  import_react.default.useEffect(() => {
    remainingTime.current = duration;
  }, [
    duration
  ]);
  import_react.default.useEffect(() => {
    setMounted(true);
  }, []);
  import_react.default.useEffect(() => {
    const toastNode = toastRef.current;
    if (toastNode) {
      const height = toastNode.getBoundingClientRect().height;
      setInitialHeight(height);
      setHeights((h) => [
        {
          toastId: toast2.id,
          height,
          position: toast2.position
        },
        ...h
      ]);
      return () => setHeights((h) => h.filter((height2) => height2.toastId !== toast2.id));
    }
  }, [
    setHeights,
    toast2.id
  ]);
  import_react.default.useLayoutEffect(() => {
    if (!mounted) return;
    const toastNode = toastRef.current;
    const originalHeight = toastNode.style.height;
    toastNode.style.height = "auto";
    const newHeight = toastNode.getBoundingClientRect().height;
    toastNode.style.height = originalHeight;
    setInitialHeight(newHeight);
    setHeights((heights2) => {
      const alreadyExists = heights2.find((height) => height.toastId === toast2.id);
      if (!alreadyExists) {
        return [
          {
            toastId: toast2.id,
            height: newHeight,
            position: toast2.position
          },
          ...heights2
        ];
      } else {
        return heights2.map((height) => height.toastId === toast2.id ? {
          ...height,
          height: newHeight
        } : height);
      }
    });
  }, [
    mounted,
    toast2.title,
    toast2.description,
    setHeights,
    toast2.id,
    toast2.jsx,
    toast2.action,
    toast2.cancel
  ]);
  const deleteToast = import_react.default.useCallback(() => {
    setRemoved(true);
    setOffsetBeforeRemove(offset.current);
    setHeights((h) => h.filter((height) => height.toastId !== toast2.id));
    setTimeout(() => {
      removeToast(toast2);
    }, TIME_BEFORE_UNMOUNT);
  }, [
    toast2,
    removeToast,
    setHeights,
    offset
  ]);
  import_react.default.useEffect(() => {
    if (toast2.promise && toastType === "loading" || toast2.duration === Infinity || toast2.type === "loading") return;
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
        toast2.onAutoClose == null ? void 0 : toast2.onAutoClose.call(toast2, toast2);
        deleteToast();
      }, remainingTime.current);
    };
    if (expanded || interacting || isDocumentHidden) {
      pauseTimer();
    } else {
      startTimer();
    }
    return () => clearTimeout(timeoutId);
  }, [
    expanded,
    interacting,
    toast2,
    toastType,
    isDocumentHidden,
    deleteToast
  ]);
  import_react.default.useEffect(() => {
    if (toast2.delete) {
      deleteToast();
      toast2.onDismiss == null ? void 0 : toast2.onDismiss.call(toast2, toast2);
    }
  }, [
    deleteToast,
    toast2.delete
  ]);
  function getLoadingIcon() {
    var _toast_classNames9;
    if (icons == null ? void 0 : icons.loading) {
      var _toast_classNames12;
      return import_react.default.createElement("div", {
        className: cn(classNames == null ? void 0 : classNames.loader, toast2 == null ? void 0 : (_toast_classNames12 = toast2.classNames) == null ? void 0 : _toast_classNames12.loader, "sonner-loader"),
        "data-visible": toastType === "loading"
      }, icons.loading);
    }
    return import_react.default.createElement(Loader, {
      className: cn(classNames == null ? void 0 : classNames.loader, toast2 == null ? void 0 : (_toast_classNames9 = toast2.classNames) == null ? void 0 : _toast_classNames9.loader),
      visible: toastType === "loading"
    });
  }
  const icon = toast2.icon || (icons == null ? void 0 : icons[toastType]) || getAsset(toastType);
  var _toast_richColors, _icons_close;
  return import_react.default.createElement("li", {
    tabIndex: 0,
    ref: toastRef,
    className: cn(className, toastClassname, classNames == null ? void 0 : classNames.toast, toast2 == null ? void 0 : (_toast_classNames = toast2.classNames) == null ? void 0 : _toast_classNames.toast, classNames == null ? void 0 : classNames.default, classNames == null ? void 0 : classNames[toastType], toast2 == null ? void 0 : (_toast_classNames1 = toast2.classNames) == null ? void 0 : _toast_classNames1[toastType]),
    "data-sonner-toast": "",
    "data-rich-colors": (_toast_richColors = toast2.richColors) != null ? _toast_richColors : defaultRichColors,
    "data-styled": !Boolean(toast2.jsx || toast2.unstyled || unstyled),
    "data-mounted": mounted,
    "data-promise": Boolean(toast2.promise),
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
    "data-testid": toast2.testId,
    style: {
      "--index": index,
      "--toasts-before": index,
      "--z-index": toasts.length - index,
      "--offset": `${removed ? offsetBeforeRemove : offset.current}px`,
      "--initial-height": expandByDefault ? "auto" : `${initialHeight}px`,
      ...style,
      ...toast2.style
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
      if (Math.abs(swipeAmount) >= SWIPE_THRESHOLD || velocity > 0.11) {
        setOffsetBeforeRemove(offset.current);
        toast2.onDismiss == null ? void 0 : toast2.onDismiss.call(toast2, toast2);
        if (swipeDirection === "x") {
          setSwipeOutDirection(swipeAmountX > 0 ? "right" : "left");
        } else {
          setSwipeOutDirection(swipeAmountY > 0 ? "down" : "up");
        }
        deleteToast();
        setSwipeOut(true);
        return;
      } else {
        var _toastRef_current2, _toastRef_current3;
        (_toastRef_current2 = toastRef.current) == null ? void 0 : _toastRef_current2.style.setProperty("--swipe-amount-x", `0px`);
        (_toastRef_current3 = toastRef.current) == null ? void 0 : _toastRef_current3.style.setProperty("--swipe-amount-y", `0px`);
      }
      setIsSwiped(false);
      setSwiping(false);
      setSwipeDirection(null);
    },
    onPointerMove: (event) => {
      var _window_getSelection, _toastRef_current, _toastRef_current1;
      if (!pointerStartRef.current || !dismissible) return;
      const isHighlighted = ((_window_getSelection = window.getSelection()) == null ? void 0 : _window_getSelection.toString().length) > 0;
      if (isHighlighted) return;
      const yDelta = event.clientY - pointerStartRef.current.y;
      const xDelta = event.clientX - pointerStartRef.current.x;
      var _props_swipeDirections;
      const swipeDirections = (_props_swipeDirections = props.swipeDirections) != null ? _props_swipeDirections : getDefaultSwipeDirections(position);
      if (!swipeDirection && (Math.abs(xDelta) > 1 || Math.abs(yDelta) > 1)) {
        setSwipeDirection(Math.abs(xDelta) > Math.abs(yDelta) ? "x" : "y");
      }
      let swipeAmount = {
        x: 0,
        y: 0
      };
      const getDampening = (delta) => {
        const factor = Math.abs(delta) / 20;
        return 1 / (1.5 + factor);
      };
      if (swipeDirection === "y") {
        if (swipeDirections.includes("top") || swipeDirections.includes("bottom")) {
          if (swipeDirections.includes("top") && yDelta < 0 || swipeDirections.includes("bottom") && yDelta > 0) {
            swipeAmount.y = yDelta;
          } else {
            const dampenedDelta = yDelta * getDampening(yDelta);
            swipeAmount.y = Math.abs(dampenedDelta) < Math.abs(yDelta) ? dampenedDelta : yDelta;
          }
        }
      } else if (swipeDirection === "x") {
        if (swipeDirections.includes("left") || swipeDirections.includes("right")) {
          if (swipeDirections.includes("left") && xDelta < 0 || swipeDirections.includes("right") && xDelta > 0) {
            swipeAmount.x = xDelta;
          } else {
            const dampenedDelta = xDelta * getDampening(xDelta);
            swipeAmount.x = Math.abs(dampenedDelta) < Math.abs(xDelta) ? dampenedDelta : xDelta;
          }
        }
      }
      if (Math.abs(swipeAmount.x) > 0 || Math.abs(swipeAmount.y) > 0) {
        setIsSwiped(true);
      }
      (_toastRef_current = toastRef.current) == null ? void 0 : _toastRef_current.style.setProperty("--swipe-amount-x", `${swipeAmount.x}px`);
      (_toastRef_current1 = toastRef.current) == null ? void 0 : _toastRef_current1.style.setProperty("--swipe-amount-y", `${swipeAmount.y}px`);
    }
  }, closeButton && !toast2.jsx && toastType !== "loading" ? import_react.default.createElement("button", {
    "aria-label": closeButtonAriaLabel,
    "data-disabled": disabled,
    "data-close-button": true,
    onClick: disabled || !dismissible ? () => {
    } : () => {
      deleteToast();
      toast2.onDismiss == null ? void 0 : toast2.onDismiss.call(toast2, toast2);
    },
    className: cn(classNames == null ? void 0 : classNames.closeButton, toast2 == null ? void 0 : (_toast_classNames2 = toast2.classNames) == null ? void 0 : _toast_classNames2.closeButton)
  }, (_icons_close = icons == null ? void 0 : icons.close) != null ? _icons_close : CloseIcon) : null, (toastType || toast2.icon || toast2.promise) && toast2.icon !== null && ((icons == null ? void 0 : icons[toastType]) !== null || toast2.icon) ? import_react.default.createElement("div", {
    "data-icon": "",
    className: cn(classNames == null ? void 0 : classNames.icon, toast2 == null ? void 0 : (_toast_classNames3 = toast2.classNames) == null ? void 0 : _toast_classNames3.icon)
  }, toast2.promise || toast2.type === "loading" && !toast2.icon ? toast2.icon || getLoadingIcon() : null, toast2.type !== "loading" ? icon : null) : null, import_react.default.createElement("div", {
    "data-content": "",
    className: cn(classNames == null ? void 0 : classNames.content, toast2 == null ? void 0 : (_toast_classNames4 = toast2.classNames) == null ? void 0 : _toast_classNames4.content)
  }, import_react.default.createElement("div", {
    "data-title": "",
    className: cn(classNames == null ? void 0 : classNames.title, toast2 == null ? void 0 : (_toast_classNames5 = toast2.classNames) == null ? void 0 : _toast_classNames5.title)
  }, toast2.jsx ? toast2.jsx : typeof toast2.title === "function" ? toast2.title() : toast2.title), toast2.description ? import_react.default.createElement("div", {
    "data-description": "",
    className: cn(descriptionClassName, toastDescriptionClassname, classNames == null ? void 0 : classNames.description, toast2 == null ? void 0 : (_toast_classNames6 = toast2.classNames) == null ? void 0 : _toast_classNames6.description)
  }, typeof toast2.description === "function" ? toast2.description() : toast2.description) : null), import_react.default.isValidElement(toast2.cancel) ? toast2.cancel : toast2.cancel && isAction(toast2.cancel) ? import_react.default.createElement("button", {
    "data-button": true,
    "data-cancel": true,
    style: toast2.cancelButtonStyle || cancelButtonStyle,
    onClick: (event) => {
      if (!isAction(toast2.cancel)) return;
      if (!dismissible) return;
      toast2.cancel.onClick == null ? void 0 : toast2.cancel.onClick.call(toast2.cancel, event);
      deleteToast();
    },
    className: cn(classNames == null ? void 0 : classNames.cancelButton, toast2 == null ? void 0 : (_toast_classNames7 = toast2.classNames) == null ? void 0 : _toast_classNames7.cancelButton)
  }, toast2.cancel.label) : null, import_react.default.isValidElement(toast2.action) ? toast2.action : toast2.action && isAction(toast2.action) ? import_react.default.createElement("button", {
    "data-button": true,
    "data-action": true,
    style: toast2.actionButtonStyle || actionButtonStyle,
    onClick: (event) => {
      if (!isAction(toast2.action)) return;
      toast2.action.onClick == null ? void 0 : toast2.action.onClick.call(toast2.action, event);
      if (event.defaultPrevented) return;
      deleteToast();
    },
    className: cn(classNames == null ? void 0 : classNames.actionButton, toast2 == null ? void 0 : (_toast_classNames8 = toast2.classNames) == null ? void 0 : _toast_classNames8.actionButton)
  }, toast2.action.label) : null);
};
function getDocumentDirection() {
  if (typeof window === "undefined") return "ltr";
  if (typeof document === "undefined") return "ltr";
  const dirAttribute = document.documentElement.getAttribute("dir");
  if (dirAttribute === "auto" || !dirAttribute) {
    return window.getComputedStyle(document.documentElement).direction;
  }
  return dirAttribute;
}
function assignOffset(defaultOffset, mobileOffset) {
  const styles2 = {};
  [
    defaultOffset,
    mobileOffset
  ].forEach((offset, index) => {
    const isMobile = index === 1;
    const prefix = isMobile ? "--mobile-offset" : "--offset";
    const defaultValue = isMobile ? MOBILE_VIEWPORT_OFFSET : VIEWPORT_OFFSET;
    function assignAll(offset2) {
      [
        "top",
        "right",
        "bottom",
        "left"
      ].forEach((key) => {
        styles2[`${prefix}-${key}`] = typeof offset2 === "number" ? `${offset2}px` : offset2;
      });
    }
    if (typeof offset === "number" || typeof offset === "string") {
      assignAll(offset);
    } else if (typeof offset === "object") {
      [
        "top",
        "right",
        "bottom",
        "left"
      ].forEach((key) => {
        if (offset[key] === void 0) {
          styles2[`${prefix}-${key}`] = defaultValue;
        } else {
          styles2[`${prefix}-${key}`] = typeof offset[key] === "number" ? `${offset[key]}px` : offset[key];
        }
      });
    } else {
      assignAll(defaultValue);
    }
  });
  return styles2;
}
var Toaster = import_react.default.forwardRef(function Toaster2(props, ref) {
  const { id, invert, position = "bottom-right", hotkey = [
    "altKey",
    "KeyT"
  ], expand, closeButton, className, offset, mobileOffset, theme = "light", richColors, duration, style, visibleToasts = VISIBLE_TOASTS_AMOUNT, toastOptions, dir = getDocumentDirection(), gap = GAP, icons, containerAriaLabel = "Notifications" } = props;
  const [toasts, setToasts] = import_react.default.useState([]);
  const filteredToasts = import_react.default.useMemo(() => {
    if (id) {
      return toasts.filter((toast2) => toast2.toasterId === id);
    }
    return toasts.filter((toast2) => !toast2.toasterId);
  }, [
    toasts,
    id
  ]);
  const possiblePositions = import_react.default.useMemo(() => {
    return Array.from(new Set([
      position
    ].concat(filteredToasts.filter((toast2) => toast2.position).map((toast2) => toast2.position))));
  }, [
    filteredToasts,
    position
  ]);
  const [heights, setHeights] = import_react.default.useState([]);
  const [expanded, setExpanded] = import_react.default.useState(false);
  const [interacting, setInteracting] = import_react.default.useState(false);
  const [actualTheme, setActualTheme] = import_react.default.useState(theme !== "system" ? theme : typeof window !== "undefined" ? window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light" : "light");
  const listRef = import_react.default.useRef(null);
  const hotkeyLabel = hotkey.join("+").replace(/Key/g, "").replace(/Digit/g, "");
  const lastFocusedElementRef = import_react.default.useRef(null);
  const isFocusWithinRef = import_react.default.useRef(false);
  const removeToast = import_react.default.useCallback((toastToRemove) => {
    setToasts((toasts2) => {
      var _toasts_find;
      if (!((_toasts_find = toasts2.find((toast2) => toast2.id === toastToRemove.id)) == null ? void 0 : _toasts_find.delete)) {
        ToastState.dismiss(toastToRemove.id);
      }
      return toasts2.filter(({ id: id2 }) => id2 !== toastToRemove.id);
    });
  }, []);
  import_react.default.useEffect(() => {
    return ToastState.subscribe((toast2) => {
      if (toast2.dismiss) {
        requestAnimationFrame(() => {
          setToasts((toasts2) => toasts2.map((t) => t.id === toast2.id ? {
            ...t,
            delete: true
          } : t));
        });
        return;
      }
      setTimeout(() => {
        import_react_dom.default.flushSync(() => {
          setToasts((toasts2) => {
            const indexOfExistingToast = toasts2.findIndex((t) => t.id === toast2.id);
            if (indexOfExistingToast !== -1) {
              return [
                ...toasts2.slice(0, indexOfExistingToast),
                {
                  ...toasts2[indexOfExistingToast],
                  ...toast2
                },
                ...toasts2.slice(indexOfExistingToast + 1)
              ];
            }
            return [
              toast2,
              ...toasts2
            ];
          });
        });
      });
    });
  }, [
    toasts
  ]);
  import_react.default.useEffect(() => {
    if (theme !== "system") {
      setActualTheme(theme);
      return;
    }
    if (theme === "system") {
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setActualTheme("dark");
      } else {
        setActualTheme("light");
      }
    }
    if (typeof window === "undefined") return;
    const darkMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    try {
      darkMediaQuery.addEventListener("change", ({ matches }) => {
        if (matches) {
          setActualTheme("dark");
        } else {
          setActualTheme("light");
        }
      });
    } catch (error) {
      darkMediaQuery.addListener(({ matches }) => {
        try {
          if (matches) {
            setActualTheme("dark");
          } else {
            setActualTheme("light");
          }
        } catch (e) {
          console.error(e);
        }
      });
    }
  }, [
    theme
  ]);
  import_react.default.useEffect(() => {
    if (toasts.length <= 1) {
      setExpanded(false);
    }
  }, [
    toasts
  ]);
  import_react.default.useEffect(() => {
    const handleKeyDown = (event) => {
      var _listRef_current;
      const isHotkeyPressed = hotkey.every((key) => event[key] || event.code === key);
      if (isHotkeyPressed) {
        var _listRef_current1;
        setExpanded(true);
        (_listRef_current1 = listRef.current) == null ? void 0 : _listRef_current1.focus();
      }
      if (event.code === "Escape" && (document.activeElement === listRef.current || ((_listRef_current = listRef.current) == null ? void 0 : _listRef_current.contains(document.activeElement)))) {
        setExpanded(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    hotkey
  ]);
  import_react.default.useEffect(() => {
    if (listRef.current) {
      return () => {
        if (lastFocusedElementRef.current) {
          lastFocusedElementRef.current.focus({
            preventScroll: true
          });
          lastFocusedElementRef.current = null;
          isFocusWithinRef.current = false;
        }
      };
    }
  }, [
    listRef.current
  ]);
  return (
    // Remove item from normal navigation flow, only available via hotkey
    import_react.default.createElement("section", {
      ref,
      "aria-label": `${containerAriaLabel} ${hotkeyLabel}`,
      tabIndex: -1,
      "aria-live": "polite",
      "aria-relevant": "additions text",
      "aria-atomic": "false",
      suppressHydrationWarning: true
    }, possiblePositions.map((position2, index) => {
      var _heights_;
      const [y, x] = position2.split("-");
      if (!filteredToasts.length) return null;
      return import_react.default.createElement("ol", {
        key: position2,
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
              lastFocusedElementRef.current.focus({
                preventScroll: true
              });
              lastFocusedElementRef.current = null;
            }
          }
        },
        onFocus: (event) => {
          const isNotDismissible = event.target instanceof HTMLElement && event.target.dataset.dismissible === "false";
          if (isNotDismissible) return;
          if (!isFocusWithinRef.current) {
            isFocusWithinRef.current = true;
            lastFocusedElementRef.current = event.relatedTarget;
          }
        },
        onMouseEnter: () => setExpanded(true),
        onMouseMove: () => setExpanded(true),
        onMouseLeave: () => {
          if (!interacting) {
            setExpanded(false);
          }
        },
        onDragEnd: () => setExpanded(false),
        onPointerDown: (event) => {
          const isNotDismissible = event.target instanceof HTMLElement && event.target.dataset.dismissible === "false";
          if (isNotDismissible) return;
          setInteracting(true);
        },
        onPointerUp: () => setInteracting(false)
      }, filteredToasts.filter((toast2) => !toast2.position && index === 0 || toast2.position === position2).map((toast2, index2) => {
        var _toastOptions_duration, _toastOptions_closeButton;
        return import_react.default.createElement(Toast, {
          key: toast2.id,
          icons,
          index: index2,
          toast: toast2,
          defaultRichColors: richColors,
          duration: (_toastOptions_duration = toastOptions == null ? void 0 : toastOptions.duration) != null ? _toastOptions_duration : duration,
          className: toastOptions == null ? void 0 : toastOptions.className,
          descriptionClassName: toastOptions == null ? void 0 : toastOptions.descriptionClassName,
          invert,
          visibleToasts,
          closeButton: (_toastOptions_closeButton = toastOptions == null ? void 0 : toastOptions.closeButton) != null ? _toastOptions_closeButton : closeButton,
          interacting,
          position: position2,
          style: toastOptions == null ? void 0 : toastOptions.style,
          unstyled: toastOptions == null ? void 0 : toastOptions.unstyled,
          classNames: toastOptions == null ? void 0 : toastOptions.classNames,
          cancelButtonStyle: toastOptions == null ? void 0 : toastOptions.cancelButtonStyle,
          actionButtonStyle: toastOptions == null ? void 0 : toastOptions.actionButtonStyle,
          closeButtonAriaLabel: toastOptions == null ? void 0 : toastOptions.closeButtonAriaLabel,
          removeToast,
          toasts: filteredToasts.filter((t) => t.position == toast2.position),
          heights: heights.filter((h) => h.position == toast2.position),
          setHeights,
          expandByDefault: expand,
          gap,
          expanded,
          swipeDirections: props.swipeDirections
        });
      }));
    }))
  );
});

// ../../node_modules/.deno/goey-toast@0.5.0/node_modules/goey-toast/dist/index.js
var import_jsx_runtime = __toESM(require_jsx_runtime());
var animationPresets = {
  smooth: { bounce: 0.1, spring: true },
  bouncy: { bounce: 0.6, spring: true },
  subtle: { bounce: 0.05, spring: true },
  snappy: { bounce: 0.4, spring: true }
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
  _announceSubs.forEach((cb) => cb({ message, politeness }));
}
function subscribeAnnouncements(cb) {
  _announceSubs.add(cb);
  return () => {
    _announceSubs.delete(cb);
  };
}
var DefaultIcon = ({ size = 20, className }) => (0, import_jsx_runtime.jsxs)(
  "svg",
  {
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
      (0, import_jsx_runtime.jsx)("path", { d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" }),
      (0, import_jsx_runtime.jsx)("path", { d: "M13.73 21a2 2 0 0 1-3.46 0" })
    ]
  }
);
var SuccessIcon2 = ({ size = 20, className }) => (0, import_jsx_runtime.jsxs)(
  "svg",
  {
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
      (0, import_jsx_runtime.jsx)("circle", { cx: "12", cy: "12", r: "10" }),
      (0, import_jsx_runtime.jsx)("path", { d: "M9 12l2 2 4-4" })
    ]
  }
);
var ErrorIcon2 = ({ size = 20, className }) => (0, import_jsx_runtime.jsxs)(
  "svg",
  {
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
      (0, import_jsx_runtime.jsx)("circle", { cx: "12", cy: "12", r: "10" }),
      (0, import_jsx_runtime.jsx)("path", { d: "M15 9l-6 6" }),
      (0, import_jsx_runtime.jsx)("path", { d: "M9 9l6 6" })
    ]
  }
);
var WarningIcon2 = ({ size = 20, className }) => (0, import_jsx_runtime.jsxs)(
  "svg",
  {
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
      (0, import_jsx_runtime.jsx)("circle", { cx: "12", cy: "12", r: "10" }),
      (0, import_jsx_runtime.jsx)("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
      (0, import_jsx_runtime.jsx)("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
    ]
  }
);
var InfoIcon2 = ({ size = 20, className }) => (0, import_jsx_runtime.jsxs)(
  "svg",
  {
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
      (0, import_jsx_runtime.jsx)("circle", { cx: "12", cy: "12", r: "10" }),
      (0, import_jsx_runtime.jsx)("line", { x1: "12", y1: "16", x2: "12", y2: "12" }),
      (0, import_jsx_runtime.jsx)("line", { x1: "12", y1: "8", x2: "12.01", y2: "8" })
    ]
  }
);
var SpinnerIcon = ({ size = 20, className }) => (0, import_jsx_runtime.jsx)(
  "svg",
  {
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
    children: (0, import_jsx_runtime.jsx)("path", { d: "M21 12a9 9 0 1 1-6.219-8.56" })
  }
);
var QUERY = "(prefers-reduced-motion: reduce)";
function getInitialState() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia(QUERY).matches;
}
function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = (0, import_react2.useState)(getInitialState);
  (0, import_react2.useEffect)(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
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
var useIsomorphicLayoutEffect = typeof window !== "undefined" ? import_react2.useLayoutEffect : import_react2.useEffect;
var phaseIconMap = {
  default: DefaultIcon,
  success: SuccessIcon2,
  error: ErrorIcon2,
  warning: WarningIcon2,
  info: InfoIcon2
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
var DEFAULT_EXPAND_DUR = 0.6;
var DEFAULT_COLLAPSE_DUR = 0.9;
function squishSpring(durationSec, defaultDur, bounce = 0.4) {
  const scale = durationSec / defaultDur;
  const stiffness = 200 + bounce * 437.5;
  const damping = 24 - bounce * 20;
  const mass = 0.7 * scale;
  return { type: "spring", stiffness, damping, mass };
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
        for (const cb of callbacks) {
          cb();
        }
      } finally {
        observer.observe(ol, observeOptions);
      }
    });
    observer.observe(ol, observeOptions);
    entry = { observer, callbacks };
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
  if (!(li == null ? void 0 : li.parentElement)) return;
  const ol = li.parentElement;
  const toasts = Array.from(
    ol.querySelectorAll(":scope > [data-sonner-toast]")
  );
  if (toasts.length === 0) return;
  const heights = toasts.map((t) => {
    if (t.getAttribute("data-visible") === "false") return 0;
    const content = t.firstElementChild;
    const h = content ? content.getBoundingClientRect().height : 0;
    return h > 0 ? h : PH;
  });
  for (let i = 0; i < toasts.length; i++) {
    toasts[i].style.setProperty("--initial-height", `${heights[i]}px`);
  }
  if (!includeOffsets) {
    return;
  }
  const gapStr = getComputedStyle(ol).getPropertyValue("--gap").trim();
  const gap = parseFloat(gapStr) || 14;
  let runningOffset = 0;
  for (let i = toasts.length - 1; i >= 0; i--) {
    if (toasts[i].getAttribute("data-visible") === "false") {
      toasts[i].style.setProperty("--offset", "0px");
      continue;
    }
    toasts[i].style.setProperty("--offset", `${runningOffset}px`);
    if (i > 0) {
      runningOffset += heights[i] + gap;
    }
  }
}
function memoizePath(fn) {
  let lastArgs = null;
  let lastResult = "";
  return (pw, bw, th, t) => {
    if (lastArgs && lastArgs[0] === pw && lastArgs[1] === bw && lastArgs[2] === th && lastArgs[3] === t) {
      return lastResult;
    }
    lastResult = fn(pw, bw, th, t);
    lastArgs = [pw, bw, th, t];
    return lastResult;
  };
}
function morphPathRaw(pw, bw, th, t) {
  const pr = PH / 2;
  const pillW = Math.min(pw, bw);
  const bodyH = PH + (th - PH) * t;
  if (t <= 0 || bodyH - PH < 8) {
    return [
      `M 0,${pr}`,
      `A ${pr},${pr} 0 0 1 ${pr},0`,
      `H ${pillW - pr}`,
      `A ${pr},${pr} 0 0 1 ${pillW},${pr}`,
      `A ${pr},${pr} 0 0 1 ${pillW - pr},${PH}`,
      `H ${pr}`,
      `A ${pr},${pr} 0 0 1 0,${pr}`,
      `Z`
    ].join(" ");
  }
  const curve = 14 * t;
  const cr = Math.min(16, (bodyH - PH) * 0.45);
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
  if (t <= 0 || PH + (th - PH) * t - PH < 8) {
    return [
      `M ${pillOffset},${pr}`,
      `A ${pr},${pr} 0 0 1 ${pillOffset + pr},0`,
      `H ${pillOffset + pillW - pr}`,
      `A ${pr},${pr} 0 0 1 ${pillOffset + pillW},${pr}`,
      `A ${pr},${pr} 0 0 1 ${pillOffset + pillW - pr},${PH}`,
      `H ${pillOffset + pr}`,
      `A ${pr},${pr} 0 0 1 ${pillOffset},${pr}`,
      `Z`
    ].join(" ");
  }
  const bodyH = PH + (th - PH) * t;
  const curve = 14 * t;
  const cr = Math.min(16, (bodyH - PH) * 0.45);
  const bodyTop = PH - curve;
  const bodyCenter = bw / 2;
  const halfBodyW = pillW / 2 + (bw - pillW) / 2 * t;
  const bodyLeft = bodyCenter - halfBodyW;
  const bodyRight = bodyCenter + halfBodyW;
  const qLeftX = Math.max(bodyLeft + cr, pillOffset - curve);
  const qRightX = Math.min(bodyRight - cr, pillOffset + pillW + curve);
  return [
    // Start at left side of pill
    `M ${pillOffset},${pr}`,
    // Pill top-left arc
    `A ${pr},${pr} 0 0 1 ${pillOffset + pr},0`,
    // Top edge of pill
    `H ${pillOffset + pillW - pr}`,
    // Pill top-right arc
    `A ${pr},${pr} 0 0 1 ${pillOffset + pillW},${pr}`,
    // Right side down to body junction
    `L ${pillOffset + pillW},${bodyTop}`,
    // Right organic curve from pill to body
    `Q ${pillOffset + pillW},${bodyTop + curve} ${qRightX},${bodyTop + curve}`,
    // Right side of body
    `H ${bodyRight - cr}`,
    // Body top-right corner
    `A ${cr},${cr} 0 0 1 ${bodyRight},${bodyTop + curve + cr}`,
    // Right edge down
    `L ${bodyRight},${bodyH - cr}`,
    // Body bottom-right corner
    `A ${cr},${cr} 0 0 1 ${bodyRight - cr},${bodyH}`,
    // Bottom edge
    `H ${bodyLeft + cr}`,
    // Body bottom-left corner
    `A ${cr},${cr} 0 0 1 ${bodyLeft},${bodyH - cr}`,
    // Left edge up
    `L ${bodyLeft},${bodyTop + curve + cr}`,
    // Body top-left corner
    `A ${cr},${cr} 0 0 1 ${bodyLeft + cr},${bodyTop + curve}`,
    // Left side of body
    `H ${qLeftX}`,
    // Left organic curve from body to pill
    `Q ${pillOffset},${bodyTop + curve} ${pillOffset},${bodyTop}`,
    // Close back to start
    `Z`
  ].join(" ");
}
var morphPath = memoizePath(morphPathRaw);
var morphPathCenter = memoizePath(morphPathCenterRaw);
var SMOOTH_EASE = [0.4, 0, 0.2, 1];
var GooeyToast = ({
  title,
  description,
  action,
  icon,
  phase,
  classNames,
  fillColor: fillColorProp,
  borderColor,
  borderWidth,
  timing,
  preset,
  spring: springProp,
  bounce: bounceProp,
  showTimestamp: showTimestampProp,
  showProgress: showProgressProp,
  toastId
}) => {
  const theme = getGooeyTheme();
  const closeButtonSetting = getGooeyCloseButton();
  const showCloseButton = closeButtonSetting !== false;
  const fillColor = fillColorProp ?? (theme === "dark" ? "#1a1a1a" : "#ffffff");
  const position = getGooeyPosition();
  const dir = getGooeyDir();
  const posIsRight = (position == null ? void 0 : position.includes("right")) ?? false;
  const isCenter = (position == null ? void 0 : position.includes("center")) ?? false;
  const isRight = dir === "rtl" ? isCenter ? false : !posIsRight : posIsRight;
  const prefersReducedMotion = usePrefersReducedMotion();
  const presetConfig = preset ? animationPresets[preset] : void 0;
  const useSpring = springProp ?? (presetConfig == null ? void 0 : presetConfig.spring) ?? getGooeySpring();
  const bounceVal = bounceProp ?? (presetConfig == null ? void 0 : presetConfig.bounce) ?? getGooeyBounce() ?? 0.4;
  const showProgress = showProgressProp ?? getGooeyShowProgress();
  const showTimestamp = showTimestampProp ?? getGooeyShowTimestamp();
  const [actionSuccess, setActionSuccess] = (0, import_react2.useState)(null);
  const [dismissing, setDismissing] = (0, import_react2.useState)(false);
  const [progressKey, setProgressKey] = (0, import_react2.useState)(0);
  const [hovered, setHovered] = (0, import_react2.useState)(false);
  const hoveredRef = (0, import_react2.useRef)(false);
  const containerHoveredRef = (0, import_react2.useRef)(getContainerHovered());
  const [containerHovered, setContainerHoveredState] = (0, import_react2.useState)(getContainerHovered());
  const collapsingRef = (0, import_react2.useRef)(false);
  const preDismissRef = (0, import_react2.useRef)(false);
  const collapseEndTime = (0, import_react2.useRef)(0);
  const expandedDimsRef = (0, import_react2.useRef)({ pw: 0, bw: 0, th: 0 });
  const dismissTimerRef = (0, import_react2.useRef)(null);
  const effectiveTitle = actionSuccess ?? title;
  const effectivePhase = actionSuccess ? "success" : phase;
  const effectiveDescription = actionSuccess ? void 0 : description;
  const effectiveAction = actionSuccess ? void 0 : action;
  const isLoading = effectivePhase === "loading";
  const hasDescription = Boolean(effectiveDescription);
  const hasAction = Boolean(effectiveAction);
  const isExpanded = (hasDescription || hasAction) && !dismissing;
  const [showBody, setShowBody] = (0, import_react2.useState)(false);
  const wrapperRef = (0, import_react2.useRef)(null);
  const pathRef = (0, import_react2.useRef)(null);
  const headerRef = (0, import_react2.useRef)(null);
  const contentRef = (0, import_react2.useRef)(null);
  const morphCtrl = (0, import_react2.useRef)(null);
  const pillResizeCtrl = (0, import_react2.useRef)(null);
  const headerSquishCtrl = (0, import_react2.useRef)(null);
  const morphTRef = (0, import_react2.useRef)(0);
  const aDims = (0, import_react2.useRef)({ pw: 0, bw: 0, th: 0 });
  const dimsRef = (0, import_react2.useRef)({ pw: 0, bw: 0, th: 0 });
  const [dims, setDims] = (0, import_react2.useState)({ pw: 0, bw: 0, th: 0 });
  (0, import_react2.useEffect)(() => {
    dimsRef.current = dims;
  }, [dims]);
  (0, import_react2.useEffect)(() => {
    return subscribeContainerHovered((h) => {
      containerHoveredRef.current = h;
      setContainerHoveredState(h);
    });
  }, []);
  const flush = (0, import_react2.useCallback)(() => {
    var _a, _b;
    const { pw: p, bw: b, th: h } = aDims.current;
    if (p <= 0 || b <= 0 || h <= 0) return;
    const t = Math.max(0, Math.min(1, morphTRef.current));
    const pos = getGooeyPosition();
    const d = getGooeyDir();
    const centerPos = (pos == null ? void 0 : pos.includes("center")) ?? false;
    const posRight = (pos == null ? void 0 : pos.includes("right")) ?? false;
    const rightSide = d === "rtl" ? centerPos ? false : !posRight : posRight;
    if (centerPos) {
      const centerBw = Math.max(dimsRef.current.bw, expandedDimsRef.current.bw, p);
      (_a = pathRef.current) == null ? void 0 : _a.setAttribute("d", morphPathCenter(p, centerBw, h, t));
    } else {
      (_b = pathRef.current) == null ? void 0 : _b.setAttribute("d", morphPath(p, b, h, t));
    }
    if (t >= 1) {
      if (wrapperRef.current) {
        wrapperRef.current.style.width = "";
      }
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
      if (wrapperRef.current) {
        wrapperRef.current.style.width = (centerPos ? centerFullW : currentW) + "px";
      }
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
  const measure = (0, import_react2.useCallback)(() => {
    if (!headerRef.current || !contentRef.current) return;
    const wr = wrapperRef.current;
    const savedW = (wr == null ? void 0 : wr.style.width) ?? "";
    const savedOv = contentRef.current.style.overflow;
    const savedMH = contentRef.current.style.maxHeight;
    const savedCW = contentRef.current.style.width;
    if (wr) {
      wr.style.width = "";
    }
    contentRef.current.style.overflow = "";
    contentRef.current.style.maxHeight = "";
    contentRef.current.style.width = "";
    const cs = getComputedStyle(contentRef.current);
    const paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    const pw2 = headerRef.current.offsetWidth + paddingX;
    const bw2 = contentRef.current.offsetWidth;
    const th2 = contentRef.current.offsetHeight;
    if (wr) {
      wr.style.width = savedW;
    }
    contentRef.current.style.overflow = savedOv;
    contentRef.current.style.maxHeight = savedMH;
    contentRef.current.style.width = savedCW;
    dimsRef.current = { pw: pw2, bw: bw2, th: th2 };
    setDims({ pw: pw2, bw: bw2, th: th2 });
  }, []);
  useIsomorphicLayoutEffect(() => {
    measure();
    const t = setTimeout(measure, 100);
    return () => clearTimeout(t);
  }, [effectiveTitle, effectivePhase, isExpanded, showBody, effectiveDescription, effectiveAction, measure]);
  (0, import_react2.useEffect)(() => {
    if (!contentRef.current) return;
    const ro = new ResizeObserver(measure);
    ro.observe(contentRef.current);
    return () => ro.disconnect();
  }, [measure]);
  const { pw, bw, th } = dims;
  const hasDims = pw > 0 && bw > 0 && th > 0;
  const blobSquishCtrl = (0, import_react2.useRef)(null);
  const expandDur = DEFAULT_EXPAND_DUR;
  const collapseDur = DEFAULT_COLLAPSE_DUR;
  const lastSquishTime = (0, import_react2.useRef)(0);
  const triggerLandingSquish = (0, import_react2.useCallback)((phase2 = "mount") => {
    var _a;
    if (!wrapperRef.current || prefersReducedMotion) return;
    if (!useSpring) return;
    const now = Date.now();
    if (now - lastSquishTime.current < 300) return;
    lastSquishTime.current = now;
    (_a = blobSquishCtrl.current) == null ? void 0 : _a.stop();
    const el = wrapperRef.current;
    const springConfig = phase2 === "collapse" ? squishSpring(collapseDur, DEFAULT_COLLAPSE_DUR, bounceVal) : squishSpring(expandDur, DEFAULT_EXPAND_DUR, bounceVal);
    const bScale = bounceVal / 0.4;
    const compressY = (phase2 === "collapse" ? 0.035 : 0.12) * bScale;
    const expandX = (phase2 === "collapse" ? 0.018 : 0.06) * bScale;
    blobSquishCtrl.current = animate(0, 1, {
      ...springConfig,
      onUpdate: (v) => {
        var _a2;
        const intensity = Math.sin(v * Math.PI);
        const sy = 1 - compressY * intensity;
        const sx = 1 + expandX * intensity;
        const mirror = ((_a2 = el.style.transform) == null ? void 0 : _a2.includes("scaleX(-1)")) ? "scaleX(-1) " : "";
        el.style.transformOrigin = "center top";
        el.style.transform = mirror + `scaleX(${sx}) scaleY(${sy})`;
      },
      onComplete: () => {
        var _a2;
        const right = (_a2 = el.style.transform) == null ? void 0 : _a2.includes("scaleX(-1)");
        el.style.transform = right ? "scaleX(-1)" : "";
        el.style.transformOrigin = "";
      }
    });
  }, [prefersReducedMotion, expandDur, collapseDur, useSpring, bounceVal]);
  useIsomorphicLayoutEffect(() => {
    var _a;
    if (!hasDims || collapsingRef.current) return;
    const prev = { ...aDims.current };
    const target = { pw, bw, th };
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
    (_a = pillResizeCtrl.current) == null ? void 0 : _a.stop();
    if (Date.now() - collapseEndTime.current > 500 && !isExpanded) {
      triggerLandingSquish("expand");
    }
    const pillResizeTransition = useSpring ? { type: "spring", duration: 0.5, bounce: bounceVal * 0.875 } : { duration: 0.4, ease: SMOOTH_EASE };
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
  }, [pw, bw, th, hasDims, showBody, flush, prefersReducedMotion, triggerLandingSquish, useSpring]);
  const squishDelayMs = 45;
  const mountSquished = (0, import_react2.useRef)(false);
  (0, import_react2.useEffect)(() => {
    if (hasDims && !mountSquished.current && !isExpanded) {
      mountSquished.current = true;
      const t = setTimeout(triggerLandingSquish, squishDelayMs);
      return () => clearTimeout(t);
    }
  }, [hasDims, squishDelayMs, triggerLandingSquish]);
  const prevShowBody = (0, import_react2.useRef)(false);
  useIsomorphicLayoutEffect(() => {
    if (!prevShowBody.current && showBody && !hoveredRef.current) {
      const t = setTimeout(() => triggerLandingSquish("expand"), 80);
      return () => clearTimeout(t);
    }
    prevShowBody.current = showBody;
  }, [showBody, triggerLandingSquish]);
  const shakeCtrl = (0, import_react2.useRef)(null);
  const prevPhase = (0, import_react2.useRef)(phase);
  (0, import_react2.useEffect)(() => {
    var _a, _b;
    if (phase === "error" && prevPhase.current !== "error" && !dismissing && wrapperRef.current && !prefersReducedMotion) {
      (_a = shakeCtrl.current) == null ? void 0 : _a.stop();
      const el = wrapperRef.current;
      const mirror = ((_b = el.style.transform) == null ? void 0 : _b.includes("scaleX(-1)")) ? "scaleX(-1) " : "";
      shakeCtrl.current = animate(0, 1, {
        duration: 0.4,
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
      var _a2;
      (_a2 = shakeCtrl.current) == null ? void 0 : _a2.stop();
    };
  }, [phase, dismissing, prefersReducedMotion]);
  (0, import_react2.useEffect)(() => {
    var _a, _b;
    if (isExpanded) {
      const delay = prefersReducedMotion ? 0 : 330;
      const t1 = setTimeout(() => setShowBody(true), delay);
      return () => clearTimeout(t1);
    }
    (_a = morphCtrl.current) == null ? void 0 : _a.stop();
    (_b = pillResizeCtrl.current) == null ? void 0 : _b.stop();
    if (morphTRef.current > 0) {
      const csPad = contentRef.current ? getComputedStyle(contentRef.current) : null;
      const padX = csPad ? parseFloat(csPad.paddingLeft) + parseFloat(csPad.paddingRight) : 20;
      const targetPw = headerRef.current ? headerRef.current.offsetWidth + padX : aDims.current.pw;
      const targetDims = { pw: targetPw, bw: targetPw, th: PH };
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
      const collapseDur2 = 0.9;
      const collapseTransition = isPreDismiss || !useSpring ? { duration: collapseDur2, ease: SMOOTH_EASE } : { type: "spring", duration: collapseDur2, bounce: bounceVal * 0.875 };
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
        var _a2;
        (_a2 = morphCtrl.current) == null ? void 0 : _a2.stop();
      };
    }
    setShowBody(false);
    morphTRef.current = 0;
    flush();
  }, [isExpanded, flush, prefersReducedMotion, useSpring, triggerLandingSquish]);
  const remainingRef = (0, import_react2.useRef)(null);
  const timerStartRef = (0, import_react2.useRef)(0);
  const progressDelayRef = (0, import_react2.useRef)(0);
  (0, import_react2.useEffect)(() => {
    if (!showBody || actionSuccess || dismissing) return;
    const expandDelayMs = prefersReducedMotion ? 0 : 330;
    const collapseMs = prefersReducedMotion ? 10 : 0.9 * 1e3;
    const displayMs = (timing == null ? void 0 : timing.displayDuration) ?? DEFAULT_DISPLAY_DURATION;
    const fullDelay = displayMs - expandDelayMs - collapseMs;
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
      if (remaining > 0 && (hoveredRef.current || containerHoveredRef.current)) {
        remainingRef.current = remaining;
      }
    };
  }, [showBody, actionSuccess, dismissing, prefersReducedMotion, hovered, containerHovered]);
  const canExpand = hasDescription || hasAction;
  const reExpandingRef = (0, import_react2.useRef)(false);
  (0, import_react2.useEffect)(() => {
    var _a;
    if (!hovered && !containerHovered || !canExpand || !dismissing) return;
    (_a = morphCtrl.current) == null ? void 0 : _a.stop();
    collapsingRef.current = false;
    preDismissRef.current = false;
    remainingRef.current = null;
    reExpandingRef.current = true;
    setDismissing(false);
    setShowBody(true);
    if (showProgress) setProgressKey((k) => k + 1);
    const currentT = morphTRef.current;
    const startDims = { ...aDims.current };
    const morphExpandTransition = useSpring ? { type: "spring", duration: 0.9, bounce: bounceVal } : { duration: 0.6, ease: SMOOTH_EASE };
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
      var _a2;
      (_a2 = morphCtrl.current) == null ? void 0 : _a2.stop();
    };
  }, [hovered, containerHovered, dismissing, canExpand]);
  (0, import_react2.useEffect)(() => {
    if (!toastId || !dismissing || showBody) return;
    const t = setTimeout(() => {
      if (!hoveredRef.current && !containerHoveredRef.current) {
        toast.dismiss(toastId);
      }
    }, 800);
    return () => clearTimeout(t);
  }, [dismissing, showBody, toastId]);
  (0, import_react2.useEffect)(() => {
    if (!toastId || !actionSuccess || showBody) return;
    const t = setTimeout(() => toast.dismiss(toastId), 1200);
    return () => clearTimeout(t);
  }, [toastId, actionSuccess, showBody]);
  (0, import_react2.useEffect)(() => {
    var _a, _b, _c;
    if (reExpandingRef.current) return;
    if (!showBody) {
      morphTRef.current = 0;
      (_a = morphCtrl.current) == null ? void 0 : _a.stop();
      flush();
      return;
    }
    if (prefersReducedMotion) {
      (_b = pillResizeCtrl.current) == null ? void 0 : _b.stop();
      (_c = morphCtrl.current) == null ? void 0 : _c.stop();
      morphTRef.current = 1;
      aDims.current = { ...dimsRef.current };
      flush();
      syncSonnerHeights(wrapperRef.current, true);
      return;
    }
    const raf = requestAnimationFrame(() => {
      var _a2, _b2;
      (_a2 = pillResizeCtrl.current) == null ? void 0 : _a2.stop();
      (_b2 = morphCtrl.current) == null ? void 0 : _b2.stop();
      const startDims = { ...aDims.current };
      const morphExpandTransition = useSpring ? { type: "spring", duration: 0.9, bounce: bounceVal } : { duration: 0.6, ease: SMOOTH_EASE };
      morphCtrl.current = animate(0, 1, {
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
          flush();
          syncSonnerHeights(wrapperRef.current, true);
        }
      });
    });
    return () => {
      var _a2;
      cancelAnimationFrame(raf);
      (_a2 = morphCtrl.current) == null ? void 0 : _a2.stop();
    };
  }, [showBody, flush, prefersReducedMotion, useSpring]);
  const headerSquished = (0, import_react2.useRef)(false);
  (0, import_react2.useEffect)(() => {
    var _a;
    if (!headerRef.current || prefersReducedMotion) return;
    (_a = headerSquishCtrl.current) == null ? void 0 : _a.stop();
    const el = headerRef.current;
    if (showBody && !dismissing && !actionSuccess) {
      if (!useSpring) return;
      headerSquished.current = true;
      headerSquishCtrl.current = animate(0, 1, {
        ...squishSpring(expandDur, DEFAULT_EXPAND_DUR, bounceVal),
        onUpdate: (v) => {
          const scale = 1 - 0.05 * v;
          const pushY = v * 1;
          el.style.transform = `scale(${scale}) translateY(${pushY}px)`;
        }
      });
    } else if (headerSquished.current) {
      headerSquished.current = false;
      const isSpringCollapse = !preDismissRef.current && useSpring;
      const transition = isSpringCollapse ? squishSpring(collapseDur, DEFAULT_COLLAPSE_DUR, bounceVal) : { duration: collapseDur * 0.5, ease: SMOOTH_EASE };
      headerSquishCtrl.current = animate(1, 0, {
        ...transition,
        onUpdate: (v) => {
          const scale = 1 - 0.05 * v;
          const pushY = v * 1;
          el.style.transform = `scale(${scale}) translateY(${pushY}px)`;
        },
        onComplete: () => {
          el.style.transform = "";
        }
      });
    }
    return () => {
      var _a2;
      (_a2 = headerSquishCtrl.current) == null ? void 0 : _a2.stop();
    };
  }, [showBody, dismissing, actionSuccess, prefersReducedMotion, expandDur, collapseDur, useSpring]);
  (0, import_react2.useEffect)(() => {
    var _a;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const ol = (_a = wrapper.closest("[data-sonner-toast]")) == null ? void 0 : _a.parentElement;
    if (!ol) return;
    const unregister = registerSonnerObserver(ol, () => {
      syncSonnerHeights(wrapper, true);
    });
    const expandObs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "attributes" && m.attributeName === "data-expanded" && m.target.getAttribute("data-expanded") === "true") {
          syncSonnerHeights(wrapper, true);
          break;
        }
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
  const handleActionClick = (0, import_react2.useCallback)(() => {
    if (!effectiveAction) return;
    if (effectiveAction.successLabel) {
      expandedDimsRef.current = { ...aDims.current };
      collapsingRef.current = true;
      setActionSuccess(effectiveAction.successLabel);
    }
    try {
      effectiveAction.onClick();
    } catch {
    }
  }, [effectiveAction]);
  const SWIPE_THRESHOLD2 = 100;
  const swipeStartRef = (0, import_react2.useRef)(null);
  const [swipeOffsetX, setSwipeOffsetX] = (0, import_react2.useState)(0);
  const isSwipingRef = (0, import_react2.useRef)(false);
  const handleTouchStart = (0, import_react2.useCallback)((e) => {
    if (!getGooeySwipeToDismiss()) return;
    const touch = e.touches[0];
    swipeStartRef.current = { x: touch.clientX, y: touch.clientY };
    isSwipingRef.current = false;
  }, []);
  const handleTouchMove = (0, import_react2.useCallback)((e) => {
    if (!swipeStartRef.current || !getGooeySwipeToDismiss()) return;
    const touch = e.touches[0];
    const dx = touch.clientX - swipeStartRef.current.x;
    const dy = touch.clientY - swipeStartRef.current.y;
    if (!isSwipingRef.current && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10) {
      swipeStartRef.current = null;
      return;
    }
    if (!isSwipingRef.current && Math.abs(dx) > 10) {
      isSwipingRef.current = true;
    }
    if (isSwipingRef.current) {
      setSwipeOffsetX(dx);
    }
  }, []);
  const handleTouchEnd = (0, import_react2.useCallback)(() => {
    if (!getGooeySwipeToDismiss()) {
      swipeStartRef.current = null;
      return;
    }
    if (isSwipingRef.current && Math.abs(swipeOffsetX) >= SWIPE_THRESHOLD2 && toastId) {
      toast.dismiss(toastId);
    }
    swipeStartRef.current = null;
    isSwipingRef.current = false;
    setSwipeOffsetX(0);
  }, [swipeOffsetX, toastId]);
  const swipeOpacity = swipeOffsetX !== 0 ? Math.max(0, 1 - Math.abs(swipeOffsetX) / (SWIPE_THRESHOLD2 * 1.5)) : 1;
  const swipeTranslate = swipeOffsetX !== 0 ? `translateX(${swipeOffsetX}px)` : "";
  const renderIcon = () => {
    if (!actionSuccess && icon) return icon;
    if (isLoading) return (0, import_jsx_runtime.jsx)(SpinnerIcon, { size: 18, className: styles.spinnerSpin });
    const IconComponent = phaseIconMap[effectivePhase];
    return (0, import_jsx_runtime.jsx)(IconComponent, { size: 18 });
  };
  const iconTransition = (0, import_react2.useMemo)(
    () => prefersReducedMotion ? { duration: 0.01 } : { duration: 0.2 },
    [prefersReducedMotion]
  );
  const iconEl = (0, import_jsx_runtime.jsx)("div", { className: `${styles.iconWrapper}${(classNames == null ? void 0 : classNames.icon) ? ` ${classNames.icon}` : ""}`, children: (0, import_jsx_runtime.jsx)(AnimatePresence, { mode: "wait", children: (0, import_jsx_runtime.jsx)(
    motion.div,
    {
      initial: prefersReducedMotion ? false : { opacity: 0, scale: 0.5 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.5 },
      transition: iconTransition,
      children: renderIcon()
    },
    isLoading ? "spinner" : effectivePhase
  ) }) });
  const titleEl = (0, import_jsx_runtime.jsx)("span", { className: `${styles.title}${(classNames == null ? void 0 : classNames.title) ? ` ${classNames.title}` : ""}`, children: effectiveTitle });
  const createdAtRef = (0, import_react2.useRef)(/* @__PURE__ */ new Date());
  const timestampStr = (0, import_react2.useMemo)(
    () => createdAtRef.current.toLocaleTimeString(void 0, { hour: "numeric", minute: "2-digit", second: "2-digit" }),
    []
  );
  const iconAndTitle = (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    iconEl,
    titleEl
  ] });
  const basePositionStyle = (0, import_react2.useMemo)(
    () => isCenter ? { margin: "0 auto" } : isRight ? { marginLeft: "auto", transform: "scaleX(-1)" } : {},
    [isCenter, isRight]
  );
  const wrapperStyle = (0, import_react2.useMemo)(() => {
    if (swipeTranslate) {
      return {
        ...basePositionStyle,
        transform: (basePositionStyle.transform ? basePositionStyle.transform + " " : "") + swipeTranslate,
        opacity: swipeOpacity,
        transition: "none"
      };
    }
    return Object.keys(basePositionStyle).length > 0 ? basePositionStyle : void 0;
  }, [basePositionStyle, swipeTranslate, swipeOpacity]);
  const contentStyle = (0, import_react2.useMemo)(
    () => isCenter ? { textAlign: "center" } : isRight ? { transform: "scaleX(-1)", textAlign: "right" } : { textAlign: "left" },
    [isCenter, isRight]
  );
  const handleMouseEnter = (0, import_react2.useCallback)(() => {
    hoveredRef.current = true;
    setHovered(true);
  }, []);
  const handleMouseLeave = (0, import_react2.useCallback)(() => {
    hoveredRef.current = false;
    setHovered(false);
  }, []);
  return (0, import_jsx_runtime.jsxs)("div", { ref: wrapperRef, className: `${styles.wrapper}${(classNames == null ? void 0 : classNames.wrapper) ? ` ${classNames.wrapper}` : ""}`, style: wrapperStyle, role: effectivePhase === "error" || effectivePhase === "warning" ? "alert" : "status", "aria-live": effectivePhase === "error" || effectivePhase === "warning" ? "assertive" : "polite", "aria-atomic": "true", onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave, onTouchStart: handleTouchStart, onTouchMove: handleTouchMove, onTouchEnd: handleTouchEnd, "data-center": isCenter || void 0, "data-theme": theme, children: [
    (0, import_jsx_runtime.jsx)(
      "svg",
      {
        className: styles.blobSvg,
        "aria-hidden": true,
        children: (0, import_jsx_runtime.jsx)(
          "path",
          {
            ref: pathRef,
            fill: fillColor,
            stroke: borderColor || "none",
            strokeWidth: borderColor ? borderWidth ?? 1.5 : 0
          }
        )
      }
    ),
    showCloseButton && effectivePhase !== "loading" && (0, import_jsx_runtime.jsx)(
      "button",
      {
        className: `${styles.closeButton}${(isRight ? closeButtonSetting !== "top-right" : closeButtonSetting === "top-right") ? ` ${styles.closeButtonRight}` : ""}`,
        "aria-label": "Close toast",
        type: "button",
        style: {
          background: fillColor,
          borderColor: borderColor || "transparent",
          borderWidth: borderColor ? borderWidth ?? 1.5 : 0,
          boxShadow: borderColor ? "none" : "0 1px 4px rgba(0, 0, 0, 0.2)",
          ...isCenter && closeButtonSetting !== "top-right" ? { top: 6, left: -1 } : {}
        },
        onClick: (e) => {
          e.stopPropagation();
          const id = toastId;
          if (id != null) toast.dismiss(id);
        },
        children: (0, import_jsx_runtime.jsxs)("svg", { xmlns: "http://www.w3.org/2000/svg", width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
          (0, import_jsx_runtime.jsx)("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
          (0, import_jsx_runtime.jsx)("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
        ] })
      }
    ),
    (0, import_jsx_runtime.jsxs)(
      "div",
      {
        ref: contentRef,
        className: `${styles.content} ${showBody ? styles.contentExpanded : styles.contentCompact}${(classNames == null ? void 0 : classNames.content) ? ` ${classNames.content}` : ""}`,
        style: contentStyle,
        children: [
          (0, import_jsx_runtime.jsxs)("div", { ref: headerRef, className: `${styles.header} ${titleColorMap[effectivePhase]}${(classNames == null ? void 0 : classNames.header) ? ` ${classNames.header}` : ""}`, children: [
            iconAndTitle,
            !hasDescription && !hasAction && !actionSuccess && showTimestamp && (0, import_jsx_runtime.jsx)("span", { className: styles.timestamp, children: timestampStr })
          ] }),
          (0, import_jsx_runtime.jsx)(AnimatePresence, { children: showBody && hasDescription && !dismissing && (0, import_jsx_runtime.jsx)(
            motion.div,
            {
              className: `${styles.description}${(classNames == null ? void 0 : classNames.description) ? ` ${classNames.description}` : ""}`,
              style: { textAlign: "left" },
              initial: prefersReducedMotion ? false : { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              transition: prefersReducedMotion ? { duration: 0.01 } : { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
              children: (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "flex-start", gap: "10px" }, children: [
                (0, import_jsx_runtime.jsx)("div", { style: { flex: 1, minWidth: 0 }, children: effectiveDescription }),
                showTimestamp && (0, import_jsx_runtime.jsx)("span", { className: styles.timestamp, children: timestampStr })
              ] })
            },
            "description"
          ) }),
          (0, import_jsx_runtime.jsx)(AnimatePresence, { children: showBody && !hasDescription && hasAction && !dismissing && showTimestamp && (0, import_jsx_runtime.jsx)(
            motion.div,
            {
              className: styles.timestamp,
              style: { textAlign: "right", marginTop: 8, paddingLeft: 0 },
              initial: prefersReducedMotion ? false : { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              transition: prefersReducedMotion ? { duration: 0.01 } : { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
              children: timestampStr
            },
            "timestamp-body"
          ) }),
          (0, import_jsx_runtime.jsx)(AnimatePresence, { children: showBody && hasAction && effectiveAction && !dismissing && (0, import_jsx_runtime.jsx)(
            motion.div,
            {
              className: `${styles.actionWrapper}${(classNames == null ? void 0 : classNames.actionWrapper) ? ` ${classNames.actionWrapper}` : ""}`,
              initial: prefersReducedMotion ? false : { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              transition: prefersReducedMotion ? { duration: 0.01 } : { duration: 0.35, ease: [0.4, 0, 0.2, 1], delay: 0.1 },
              children: (0, import_jsx_runtime.jsx)(
                "button",
                {
                  className: `${styles.actionButton} ${actionColorMap[effectivePhase]}${(classNames == null ? void 0 : classNames.actionButton) ? ` ${classNames.actionButton}` : ""}`,
                  onClick: handleActionClick,
                  type: "button",
                  "aria-label": effectiveAction.label,
                  children: effectiveAction.label
                }
              )
            },
            "action"
          ) }),
          showProgress && (0, import_jsx_runtime.jsx)(
            "div",
            {
              className: `${styles.progressWrapper}${hovered || containerHovered ? ` ${styles.progressPaused}` : ""}`,
              style: { opacity: showBody && !actionSuccess ? 1 : 0 },
              children: (0, import_jsx_runtime.jsx)(
                "div",
                {
                  className: `${styles.progressBar} ${progressColorMap[effectivePhase]}`,
                  style: { "--gooey-progress-duration": `${progressDelayRef.current || ((timing == null ? void 0 : timing.displayDuration) ?? DEFAULT_DISPLAY_DURATION)}ms` }
                }
              )
            },
            progressKey
          )
        ]
      }
    )
  ] });
};
var ToastErrorBoundary = class extends import_react2.Component {
  constructor() {
    super(...arguments);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    if (true) {
      console.error("[GooeyToast] Rendering error:", error, errorInfo);
    }
  }
  render() {
    if (this.state.hasError) {
      return null;
    }
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
    const isAutoClose = _autoCloseFlags.has(id) || !_manualDismissFlags.has(id);
    if (isAutoClose && cbs.onAutoClose) {
      try {
        cbs.onAutoClose(id);
      } catch {
      }
    }
    if (cbs.onDismiss) {
      try {
        cbs.onDismiss(id);
      } catch {
      }
    }
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
    if (options.type !== void 0 && _activeIds.has(id)) {
      _activeIds.set(id, options.type);
    }
    if (options.title !== void 0) {
      announce(
        buildAnnouncementMessage(options.title, options.description),
        options.type ? getAnnouncePoliteness(options.type) : "polite"
      );
    }
  }
}
function GooeyToastWrapper({
  initialPhase,
  title: initialTitle,
  type: initialType,
  description: initialDescription,
  action: initialAction,
  icon,
  classNames,
  fillColor,
  borderColor,
  borderWidth,
  timing,
  preset,
  spring,
  bounce,
  showProgress,
  showTimestamp: initialShowTimestamp,
  toastId,
  onDismiss,
  onAutoClose
}) {
  (0, import_react2.useEffect)(() => {
    if (onDismiss || onAutoClose) {
      _toastCallbacks.set(toastId, { onDismiss, onAutoClose });
    }
  }, [toastId, onDismiss, onAutoClose]);
  const [title, setTitle] = (0, import_react2.useState)(initialTitle);
  const [type, setType] = (0, import_react2.useState)(initialType);
  const [phase, setPhase] = (0, import_react2.useState)(initialPhase);
  const [description, setDescription] = (0, import_react2.useState)(initialDescription);
  const [action, setAction] = (0, import_react2.useState)(initialAction);
  const [currentIcon, setCurrentIcon] = (0, import_react2.useState)(icon);
  const [showTimestamp, setShowTimestamp] = (0, import_react2.useState)(initialShowTimestamp ?? true);
  (0, import_react2.useEffect)(() => {
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
  const mountedRef = (0, import_react2.useRef)(true);
  (0, import_react2.useEffect)(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      setTimeout(() => {
        if (!mountedRef.current) _onToastDismissed(toastId);
      }, 100);
    };
  }, [toastId]);
  return (0, import_jsx_runtime.jsx)(ToastErrorBoundary, { children: (0, import_jsx_runtime.jsx)(
    GooeyToast,
    {
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
    }
  ) });
}
function PromiseToastWrapper({
  promise,
  data,
  toastId
}) {
  var _a;
  const [phase, setPhase] = (0, import_react2.useState)("loading");
  const [title, setTitle] = (0, import_react2.useState)(data.loading);
  const [description, setDescription] = (0, import_react2.useState)((_a = data.description) == null ? void 0 : _a.loading);
  const [action, setAction] = (0, import_react2.useState)(void 0);
  (0, import_react2.useEffect)(() => {
    if (data.onDismiss || data.onAutoClose) {
      _toastCallbacks.set(toastId, { onDismiss: data.onDismiss, onAutoClose: data.onAutoClose });
    }
  }, [toastId, data.onDismiss, data.onAutoClose]);
  const mountedRef = (0, import_react2.useRef)(true);
  (0, import_react2.useEffect)(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      setTimeout(() => {
        if (!mountedRef.current) _onToastDismissed(toastId);
      }, 100);
    };
  }, [toastId]);
  (0, import_react2.useEffect)(() => {
    const resetDuration = (hasExpandedContent) => {
      var _a2;
      const baseDuration = ((_a2 = data.timing) == null ? void 0 : _a2.displayDuration) ?? (hasExpandedContent ? DEFAULT_EXPANDED_DURATION : void 0);
      const collapseDurMs = 0.9 * 1e3;
      const duration = baseDuration != null && hasExpandedContent ? baseDuration + collapseDurMs : baseDuration;
      if (duration != null) {
        toast.custom(() => (0, import_jsx_runtime.jsx)(PromiseToastWrapper, { promise, data, toastId }), { id: toastId, duration });
      }
    };
    promise.then((result) => {
      var _a2, _b, _c, _d;
      const desc = typeof ((_a2 = data.description) == null ? void 0 : _a2.success) === "function" ? data.description.success(result) : (_b = data.description) == null ? void 0 : _b.success;
      const resolvedTitle = typeof data.success === "function" ? data.success(result) : data.success;
      setTitle(resolvedTitle);
      setDescription(desc);
      setAction((_c = data.action) == null ? void 0 : _c.success);
      setPhase("success");
      resetDuration(Boolean(desc || ((_d = data.action) == null ? void 0 : _d.success)));
      announce(buildAnnouncementMessage(resolvedTitle, desc), "polite");
    }).catch((err) => {
      var _a2, _b, _c, _d;
      const desc = typeof ((_a2 = data.description) == null ? void 0 : _a2.error) === "function" ? data.description.error(err) : (_b = data.description) == null ? void 0 : _b.error;
      const resolvedTitle = typeof data.error === "function" ? data.error(err) : data.error;
      setTitle(resolvedTitle);
      setDescription(desc);
      setAction((_c = data.action) == null ? void 0 : _c.error);
      setPhase("error");
      resetDuration(Boolean(desc || ((_d = data.action) == null ? void 0 : _d.error)));
      announce(buildAnnouncementMessage(resolvedTitle, desc), "assertive");
    });
  }, []);
  return (0, import_jsx_runtime.jsx)(ToastErrorBoundary, { children: (0, import_jsx_runtime.jsx)(
    GooeyToast,
    {
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
    }
  ) });
}
function createGooeyToast(title, type, options) {
  var _a;
  const hasExpandedContent = Boolean((options == null ? void 0 : options.description) || (options == null ? void 0 : options.action));
  const baseDuration = ((_a = options == null ? void 0 : options.timing) == null ? void 0 : _a.displayDuration) ?? (options == null ? void 0 : options.duration) ?? ((options == null ? void 0 : options.description) ? DEFAULT_EXPANDED_DURATION : void 0);
  const duration = hasExpandedContent ? Infinity : baseDuration;
  const toastId = (options == null ? void 0 : options.id) ?? Math.random().toString(36).slice(2);
  const create = () => {
    toast.custom(
      () => (0, import_jsx_runtime.jsx)(
        GooeyToastWrapper,
        {
          initialPhase: type,
          title,
          type,
          description: options == null ? void 0 : options.description,
          action: options == null ? void 0 : options.action,
          icon: options == null ? void 0 : options.icon,
          classNames: options == null ? void 0 : options.classNames,
          fillColor: options == null ? void 0 : options.fillColor,
          borderColor: options == null ? void 0 : options.borderColor,
          borderWidth: options == null ? void 0 : options.borderWidth,
          timing: options == null ? void 0 : options.timing,
          preset: options == null ? void 0 : options.preset,
          spring: options == null ? void 0 : options.spring,
          bounce: options == null ? void 0 : options.bounce,
          showProgress: options == null ? void 0 : options.showProgress,
          showTimestamp: options == null ? void 0 : options.showTimestamp,
          toastId,
          onDismiss: options == null ? void 0 : options.onDismiss,
          onAutoClose: options == null ? void 0 : options.onAutoClose
        }
      ),
      {
        duration,
        id: toastId
      }
    );
  };
  if ((options == null ? void 0 : options.onDismiss) || (options == null ? void 0 : options.onAutoClose)) {
    _toastCallbacks.set(toastId, { onDismiss: options.onDismiss, onAutoClose: options.onAutoClose });
  }
  announce(
    buildAnnouncementMessage(title, options == null ? void 0 : options.description),
    getAnnouncePoliteness(type)
  );
  if (_activeIds.size < getGooeyVisibleToasts()) {
    _activeIds.set(toastId, type);
    create();
  } else {
    _enqueue({ id: toastId, type, create });
  }
  return toastId;
}
function dismissGooeyToast(idOrFilter) {
  if (idOrFilter != null && typeof idOrFilter === "object") {
    const filterTypes = Array.isArray(idOrFilter.type) ? idOrFilter.type : [idOrFilter.type];
    const typesSet = new Set(filterTypes);
    for (let i = _queue.length - 1; i >= 0; i--) {
      if (typesSet.has(_queue[i].type)) {
        _queue.splice(i, 1);
      }
    }
    for (const [id, toastType] of _activeIds) {
      if (typesSet.has(toastType)) {
        _manualDismissFlags.add(id);
        toast.dismiss(id);
      }
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
    for (const id of _activeIds.keys()) {
      _manualDismissFlags.add(id);
    }
    _queue.length = 0;
    _activeIds.clear();
    toast.dismiss();
  }
}
var gooeyToast = Object.assign(
  (title, options) => createGooeyToast(title, "default", options),
  {
    success: (title, options) => createGooeyToast(title, "success", options),
    error: (title, options) => createGooeyToast(title, "error", options),
    warning: (title, options) => createGooeyToast(title, "warning", options),
    info: (title, options) => createGooeyToast(title, "info", options),
    promise: (promise, data) => {
      var _a;
      const id = Math.random().toString(36).slice(2);
      announce(buildAnnouncementMessage(data.loading, (_a = data.description) == null ? void 0 : _a.loading), "polite");
      if (data.onDismiss || data.onAutoClose) {
        _toastCallbacks.set(id, { onDismiss: data.onDismiss, onAutoClose: data.onAutoClose });
      }
      const create = () => {
        var _a2;
        toast.custom(() => (0, import_jsx_runtime.jsx)(PromiseToastWrapper, { promise, data, toastId: id }), {
          id,
          duration: ((_a2 = data.timing) == null ? void 0 : _a2.displayDuration) != null || data.description ? Infinity : void 0
        });
      };
      if (_activeIds.size < getGooeyVisibleToasts()) {
        _activeIds.set(id, "info");
        create();
      } else {
        _enqueue({ id, type: "info", create });
      }
      return id;
    },
    dismiss: dismissGooeyToast,
    update: updateGooeyToast
  }
);
function AriaLiveAnnouncer() {
  const [politeMessage, setPoliteMessage] = (0, import_react2.useState)("");
  const [assertiveMessage, setAssertiveMessage] = (0, import_react2.useState)("");
  const handleAnnouncement = (0, import_react2.useCallback)(({ message, politeness }) => {
    if (politeness === "assertive") {
      setAssertiveMessage("");
      requestAnimationFrame(() => setAssertiveMessage(message));
    } else {
      setPoliteMessage("");
      requestAnimationFrame(() => setPoliteMessage(message));
    }
  }, []);
  (0, import_react2.useEffect)(() => {
    return subscribeAnnouncements(handleAnnouncement);
  }, [handleAnnouncement]);
  (0, import_react2.useEffect)(() => {
    if (!politeMessage) return;
    const t = setTimeout(() => setPoliteMessage(""), 7e3);
    return () => clearTimeout(t);
  }, [politeMessage]);
  (0, import_react2.useEffect)(() => {
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
  return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    (0, import_jsx_runtime.jsx)(
      "div",
      {
        role: "status",
        "aria-live": "polite",
        "aria-atomic": "true",
        style: visuallyHidden,
        children: politeMessage
      }
    ),
    (0, import_jsx_runtime.jsx)(
      "div",
      {
        role: "alert",
        "aria-live": "assertive",
        "aria-atomic": "true",
        style: visuallyHidden,
        children: assertiveMessage
      }
    )
  ] });
}
function GooeyToaster({
  position = "bottom-right",
  duration,
  gap = 14,
  offset = "24px",
  theme = "light",
  toastOptions,
  expand,
  closeButton,
  richColors,
  visibleToasts,
  dir,
  preset,
  spring,
  bounce,
  swipeToDismiss = true,
  closeOnEscape = true,
  maxQueue = Infinity,
  queueOverflow = "drop-oldest",
  showProgress = false,
  showTimestamp = true
}) {
  const presetConfig = preset ? animationPresets[preset] : void 0;
  const resolvedSpring = spring ?? (presetConfig == null ? void 0 : presetConfig.spring) ?? true;
  const resolvedBounce = bounce ?? (presetConfig == null ? void 0 : presetConfig.bounce);
  (0, import_react2.useEffect)(() => {
    setGooeyPosition(position);
  }, [position]);
  (0, import_react2.useEffect)(() => {
    setGooeyDir(dir ?? "ltr");
  }, [dir]);
  (0, import_react2.useEffect)(() => {
    setGooeyTheme(theme);
  }, [theme]);
  (0, import_react2.useEffect)(() => {
    setGooeySpring(resolvedSpring);
  }, [resolvedSpring]);
  (0, import_react2.useEffect)(() => {
    setGooeyBounce(resolvedBounce);
  }, [resolvedBounce]);
  (0, import_react2.useEffect)(() => {
    setGooeySwipeToDismiss(swipeToDismiss);
  }, [swipeToDismiss]);
  (0, import_react2.useEffect)(() => {
  }, [closeOnEscape]);
  (0, import_react2.useEffect)(() => {
    if (!closeOnEscape) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        const recentId = _getMostRecentActiveId();
        if (recentId != null) {
          gooeyToast.dismiss(recentId);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeOnEscape]);
  (0, import_react2.useEffect)(() => {
    setGooeyVisibleToasts(visibleToasts ?? 3);
  }, [visibleToasts]);
  (0, import_react2.useEffect)(() => {
    setGooeyMaxQueue(maxQueue);
  }, [maxQueue]);
  (0, import_react2.useEffect)(() => {
    setGooeyQueueOverflow(queueOverflow);
  }, [queueOverflow]);
  (0, import_react2.useEffect)(() => {
    setGooeyShowProgress(showProgress);
  }, [showProgress]);
  (0, import_react2.useEffect)(() => {
    setGooeyCloseButton(closeButton ?? false);
  }, [closeButton]);
  (0, import_react2.useEffect)(() => {
    setGooeyShowTimestamp(showTimestamp);
  }, [showTimestamp]);
  (0, import_react2.useEffect)(() => {
    let expandObs = null;
    let currentOl = null;
    const syncFromExpanded = (ol) => {
      const anyExpanded = ol.querySelector('[data-sonner-toast][data-expanded="true"]') !== null;
      setContainerHovered(anyExpanded);
    };
    const attach = (ol) => {
      if (ol === currentOl) return;
      expandObs == null ? void 0 : expandObs.disconnect();
      currentOl = ol;
      expandObs = new MutationObserver(() => syncFromExpanded(ol));
      expandObs.observe(ol, { attributes: true, attributeFilter: ["data-expanded"], subtree: true });
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
        if (found) {
          attach(found);
        } else if (currentOl) {
          expandObs == null ? void 0 : expandObs.disconnect();
          currentOl = null;
          setContainerHovered(false);
        }
      });
    });
    bodyObs.observe(document.body, { childList: true, subtree: true });
    return () => {
      if (bodyRafId) cancelAnimationFrame(bodyRafId);
      bodyObs.disconnect();
      expandObs == null ? void 0 : expandObs.disconnect();
      setContainerHovered(false);
    };
  }, []);
  (0, import_react2.useEffect)(() => {
    if (false) return;
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
    if (!value) {
      console.warn(
        '[gooey-toast] Styles not found. Make sure to import the CSS:\n\n  import "goey-toast/styles.css";\n'
      );
    }
  }, []);
  return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    (0, import_jsx_runtime.jsx)(
      Toaster,
      {
        position,
        duration,
        gap,
        offset,
        theme,
        toastOptions: { unstyled: true, ...toastOptions },
        expand,
        closeButton: false,
        richColors,
        visibleToasts: 99,
        dir
      }
    ),
    (0, import_jsx_runtime.jsx)(AriaLiveAnnouncer, {})
  ] });
}
export {
  GooeyToaster as GoeyToaster,
  GooeyToaster,
  animationPresets,
  gooeyToast as goeyToast,
  gooeyToast
};
//# sourceMappingURL=goey-toast.js.map
