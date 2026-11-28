// \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t) => () => (t || (e((t = { exports: {} }).exports, t, t.exports), e = null), t.exports), s = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, c = (n, r, o) => (o = n == null ? {} : e(i(n)), s(r || !n || !n.__esModule || !a.call(n, "default") ? t(o, "default", {
	value: n,
	enumerable: !0
}) : o, n)), l = /* @__PURE__ */ o(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), i = Symbol.for("react.strict_mode"), a = Symbol.for("react.profiler"), o = Symbol.for("react.consumer"), s = Symbol.for("react.context"), c = Symbol.for("react.forward_ref"), l = Symbol.for("react.suspense"), u = Symbol.for("react.memo"), d = Symbol.for("react.lazy"), f = Symbol.for("react.activity"), p = Symbol.for("react.view_transition"), m = Symbol.iterator;
	function h(e) {
		return typeof e != "object" || !e ? null : (e = m && e[m] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var g = {
		isMounted: function() {
			return !1;
		},
		enqueueForceUpdate: function() {},
		enqueueReplaceState: function() {},
		enqueueSetState: function() {}
	}, _ = Object.assign, v = {};
	function y(e, t, n) {
		this.props = e, this.context = t, this.refs = v, this.updater = n || g;
	}
	y.prototype.isReactComponent = {}, y.prototype.setState = function(e, t) {
		if (typeof e != "object" && typeof e != "function" && e != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
		this.updater.enqueueSetState(this, e, t, "setState");
	}, y.prototype.forceUpdate = function(e) {
		this.updater.enqueueForceUpdate(this, e, "forceUpdate");
	};
	function b() {}
	b.prototype = y.prototype;
	function x(e, t, n) {
		this.props = e, this.context = t, this.refs = v, this.updater = n || g;
	}
	var S = x.prototype = new b();
	S.constructor = x, _(S, y.prototype), S.isPureReactComponent = !0;
	var C = Array.isArray;
	function w() {}
	var T = {
		H: null,
		A: null,
		T: null,
		S: null
	}, ee = Object.prototype.hasOwnProperty;
	function E(e, n, r) {
		var i = r.ref;
		return {
			$$typeof: t,
			type: e,
			key: n,
			ref: i === void 0 ? null : i,
			props: r
		};
	}
	function te(e, t) {
		return E(e.type, t, e.props);
	}
	function ne(e) {
		return typeof e == "object" && !!e && e.$$typeof === t;
	}
	function D(e) {
		var t = {
			"=": "=0",
			":": "=2"
		};
		return "$" + e.replace(/[=:]/g, function(e) {
			return t[e];
		});
	}
	var O = /\/+/g;
	function k(e, t) {
		return typeof e == "object" && e && e.key != null ? D("" + e.key) : t.toString(36);
	}
	function re(e) {
		switch (e.status) {
			case "fulfilled": return e.value;
			case "rejected": throw e.reason;
			default: switch (typeof e.status == "string" ? e.then(w, w) : (e.status = "pending", e.then(function(t) {
				e.status === "pending" && (e.status = "fulfilled", e.value = t);
			}, function(t) {
				e.status === "pending" && (e.status = "rejected", e.reason = t);
			})), e.status) {
				case "fulfilled": return e.value;
				case "rejected": throw e.reason;
			}
		}
		throw e;
	}
	function ie(e, r, i, a, o) {
		var s = typeof e;
		(s === "undefined" || s === "boolean") && (e = null);
		var c = !1;
		if (e === null) c = !0;
		else switch (s) {
			case "bigint":
			case "string":
			case "number":
				c = !0;
				break;
			case "object": switch (e.$$typeof) {
				case t:
				case n:
					c = !0;
					break;
				case d: return c = e._init, ie(c(e._payload), r, i, a, o);
			}
		}
		if (c) return o = o(e), c = a === "" ? "." + k(e, 0) : a, C(o) ? (i = "", c != null && (i = c.replace(O, "$&/") + "/"), ie(o, r, i, "", function(e) {
			return e;
		})) : o != null && (ne(o) && (o = te(o, i + (o.key == null || e && e.key === o.key ? "" : ("" + o.key).replace(O, "$&/") + "/") + c)), r.push(o)), 1;
		c = 0;
		var l = a === "" ? "." : a + ":";
		if (C(e)) for (var u = 0; u < e.length; u++) a = e[u], s = l + k(a, u), c += ie(a, r, i, s, o);
		else if (u = h(e), typeof u == "function") for (e = u.call(e), u = 0; !(a = e.next()).done;) a = a.value, s = l + k(a, u++), c += ie(a, r, i, s, o);
		else if (s === "object") {
			if (typeof e.then == "function") return ie(re(e), r, i, a, o);
			throw r = String(e), Error("Objects are not valid as a React child (found: " + (r === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : r) + "). If you meant to render a collection of children, use an array instead.");
		}
		return c;
	}
	function ae(e, t, n) {
		if (e == null) return e;
		var r = [], i = 0;
		return ie(e, r, "", "", function(e) {
			return t.call(n, e, i++);
		}), r;
	}
	function oe(e) {
		if (e._status === -1) {
			var t = e._result, n = t();
			n.then(function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 1, e._result = t, n.status === void 0 && (n.status = "fulfilled", n.value = t));
			}, function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 2, e._result = t, n.status === void 0 && (n.status = "rejected", n.reason = t));
			}), e._status === -1 && (e._status = 0, e._result = n);
		}
		if (e._status === 1) return e._result.default;
		throw e._result;
	}
	var se = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	};
	function ce(e) {
		var t = T.T, n = {};
		n.types = t === null ? null : t.types, T.T = n;
		try {
			var r = e(), i = T.S;
			i !== null && i(n, r), typeof r == "object" && r && typeof r.then == "function" && r.then(w, se);
		} catch (e) {
			se(e);
		} finally {
			t !== null && n.types !== null && (t.types = n.types), T.T = t;
		}
	}
	function le(e) {
		var t = T.T;
		if (t !== null) {
			var n = t.types;
			n === null ? t.types = [e] : n.indexOf(e) === -1 && n.push(e);
		} else ce(le.bind(null, e));
	}
	var ue = {
		map: ae,
		forEach: function(e, t, n) {
			ae(e, function() {
				t.apply(this, arguments);
			}, n);
		},
		count: function(e) {
			var t = 0;
			return ae(e, function() {
				t++;
			}), t;
		},
		toArray: function(e) {
			return ae(e, function(e) {
				return e;
			}) || [];
		},
		only: function(e) {
			if (!ne(e)) throw Error("React.Children.only expected to receive a single React element child.");
			return e;
		}
	};
	e.Activity = f, e.Children = ue, e.Component = y, e.Fragment = r, e.Profiler = a, e.PureComponent = x, e.StrictMode = i, e.Suspense = l, e.ViewTransition = p, e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = T, e.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(e) {
			return T.H.useMemoCache(e);
		}
	}, e.addTransitionType = le, e.cache = function(e) {
		return function() {
			return e.apply(null, arguments);
		};
	}, e.cacheSignal = function() {
		return null;
	}, e.cloneElement = function(e, t, n) {
		if (e == null) throw Error("The argument must be a React element, but you passed " + e + ".");
		var r = _({}, e.props), i = e.key;
		if (t != null) for (a in t.key !== void 0 && (i = "" + t.key), t) !ee.call(t, a) || a === "key" || a === "__self" || a === "__source" || a === "ref" && t.ref === void 0 || (r[a] = t[a]);
		var a = arguments.length - 2;
		if (a === 1) r.children = n;
		else if (1 < a) {
			for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
			r.children = o;
		}
		return E(e.type, i, r);
	}, e.createContext = function(e) {
		return e = {
			$$typeof: s,
			_currentValue: e,
			_currentValue2: e,
			_threadCount: 0,
			Provider: null,
			Consumer: null
		}, e.Provider = e, e.Consumer = {
			$$typeof: o,
			_context: e
		}, e;
	}, e.createElement = function(e, t, n) {
		var r, i = {}, a = null;
		if (t != null) for (r in t.key !== void 0 && (a = "" + t.key), t) ee.call(t, r) && r !== "key" && r !== "__self" && r !== "__source" && (i[r] = t[r]);
		var o = arguments.length - 2;
		if (o === 1) i.children = n;
		else if (1 < o) {
			for (var s = Array(o), c = 0; c < o; c++) s[c] = arguments[c + 2];
			i.children = s;
		}
		if (e && e.defaultProps) for (r in o = e.defaultProps, o) i[r] === void 0 && (i[r] = o[r]);
		return E(e, a, i);
	}, e.createRef = function() {
		return { current: null };
	}, e.forwardRef = function(e) {
		return {
			$$typeof: c,
			render: e
		};
	}, e.isValidElement = ne, e.lazy = function(e) {
		return {
			$$typeof: d,
			_payload: {
				_status: -1,
				_result: e
			},
			_init: oe
		};
	}, e.memo = function(e, t) {
		return {
			$$typeof: u,
			type: e,
			compare: t === void 0 ? null : t
		};
	}, e.startTransition = ce, e.unstable_useCacheRefresh = function() {
		return T.H.useCacheRefresh();
	}, e.use = function(e) {
		return T.H.use(e);
	}, e.useActionState = function(e, t, n) {
		return T.H.useActionState(e, t, n);
	}, e.useCallback = function(e, t) {
		return T.H.useCallback(e, t);
	}, e.useContext = function(e) {
		return T.H.useContext(e);
	}, e.useDebugValue = function() {}, e.useDeferredValue = function(e, t) {
		return T.H.useDeferredValue(e, t);
	}, e.useEffect = function(e, t) {
		return T.H.useEffect(e, t);
	}, e.useEffectEvent = function(e) {
		return T.H.useEffectEvent(e);
	}, e.useId = function() {
		return T.H.useId();
	}, e.useImperativeHandle = function(e, t, n) {
		return T.H.useImperativeHandle(e, t, n);
	}, e.useInsertionEffect = function(e, t) {
		return T.H.useInsertionEffect(e, t);
	}, e.useLayoutEffect = function(e, t) {
		return T.H.useLayoutEffect(e, t);
	}, e.useMemo = function(e, t) {
		return T.H.useMemo(e, t);
	}, e.useOptimistic = function(e, t) {
		return T.H.useOptimistic(e, t);
	}, e.useReducer = function(e, t, n) {
		return T.H.useReducer(e, t, n);
	}, e.useRef = function(e) {
		return T.H.useRef(e);
	}, e.useState = function(e) {
		return T.H.useState(e);
	}, e.useSyncExternalStore = function(e, t, n) {
		return T.H.useSyncExternalStore(e, t, n);
	}, e.useTransition = function() {
		return T.H.useTransition();
	}, e.version = "19.3.1";
})), u = /* @__PURE__ */ o(((e, t) => {
	t.exports = l();
})), d = /* @__PURE__ */ o(((e) => {
	function t(e, t) {
		var n = e.length;
		e.push(t);
		a: for (; 0 < n;) {
			var r = n - 1 >>> 1, a = e[r];
			if (0 < i(a, t)) e[r] = t, e[n] = a, n = r;
			else break a;
		}
	}
	function n(e) {
		return e.length === 0 ? null : e[0];
	}
	function r(e) {
		if (e.length === 0) return null;
		var t = e[0], n = e.pop();
		if (n !== t) {
			e[0] = n;
			a: for (var r = 0, a = e.length, o = a >>> 1; r < o;) {
				var s = 2 * (r + 1) - 1, c = e[s], l = s + 1, u = e[l];
				if (0 > i(c, n)) l < a && 0 > i(u, c) ? (e[r] = u, e[l] = n, r = l) : (e[r] = c, e[s] = n, r = s);
				else if (l < a && 0 > i(u, n)) e[r] = u, e[l] = n, r = l;
				else break a;
			}
		}
		return t;
	}
	function i(e, t) {
		var n = e.sortIndex - t.sortIndex;
		return n === 0 ? e.id - t.id : n;
	}
	if (e.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
		var a = performance;
		e.unstable_now = function() {
			return a.now();
		};
	} else {
		var o = Date, s = o.now();
		e.unstable_now = function() {
			return o.now() - s;
		};
	}
	var c = [], l = [], u = 1, d = null, f = 3, p = !1, m = !1, h = !1, g = !1, _ = typeof setTimeout == "function" ? setTimeout : null, v = typeof clearTimeout == "function" ? clearTimeout : null, y = typeof setImmediate < "u" ? setImmediate : null;
	function b(e) {
		for (var i = n(l); i !== null;) {
			if (i.callback === null) r(l);
			else if (i.startTime <= e) r(l), i.sortIndex = i.expirationTime, t(c, i);
			else break;
			i = n(l);
		}
	}
	function x(e) {
		if (h = !1, b(e), !m) {
			if (n(c) !== null) m = !0, S || (S = !0, te());
			else {
				var t = n(l);
				t !== null && O(x, t.startTime - e);
			}
		}
	}
	var S = !1, C = -1, w = 5, T = -1;
	function ee() {
		return g ? !0 : !(e.unstable_now() - T < w);
	}
	function E() {
		if (g = !1, S) {
			var t = e.unstable_now();
			T = t;
			var i = !0;
			try {
				a: {
					m = !1, h && (h = !1, v(C), C = -1), p = !0;
					var a = f;
					try {
						b: {
							for (b(t), d = n(c); d !== null && !(d.expirationTime > t && ee());) {
								var o = d.callback;
								if (typeof o == "function") {
									d.callback = null, f = d.priorityLevel;
									var s = o(d.expirationTime <= t);
									if (t = e.unstable_now(), typeof s == "function") {
										d.callback = s, b(t), i = !0;
										break b;
									}
									d === n(c) && r(c), b(t);
								} else r(c);
								d = n(c);
							}
							if (d !== null) i = !0;
							else {
								var u = n(l);
								u !== null && O(x, u.startTime - t), i = !1;
							}
						}
						break a;
					} finally {
						d = null, f = a, p = !1;
					}
					i = void 0;
				}
			} finally {
				i ? te() : S = !1;
			}
		}
	}
	var te;
	if (typeof y == "function") te = function() {
		y(E);
	};
	else if (typeof MessageChannel < "u") {
		var ne = new MessageChannel(), D = ne.port2;
		ne.port1.onmessage = E, te = function() {
			D.postMessage(null);
		};
	} else te = function() {
		_(E, 0);
	};
	function O(t, n) {
		C = _(function() {
			t(e.unstable_now());
		}, n);
	}
	e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(e) {
		e.callback = null;
	}, e.unstable_forceFrameRate = function(e) {
		0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : w = 0 < e ? Math.floor(1e3 / e) : 5;
	}, e.unstable_getCurrentPriorityLevel = function() {
		return f;
	}, e.unstable_next = function(e) {
		switch (f) {
			case 1:
			case 2:
			case 3:
				var t = 3;
				break;
			default: t = f;
		}
		var n = f;
		f = t;
		try {
			return e();
		} finally {
			f = n;
		}
	}, e.unstable_requestPaint = function() {
		g = !0;
	}, e.unstable_runWithPriority = function(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 3:
			case 4:
			case 5: break;
			default: e = 3;
		}
		var n = f;
		f = e;
		try {
			return t();
		} finally {
			f = n;
		}
	}, e.unstable_scheduleCallback = function(r, i, a) {
		var o = e.unstable_now();
		switch (typeof a == "object" && a ? (a = a.delay, a = typeof a == "number" && 0 < a ? o + a : o) : a = o, r) {
			case 1:
				var s = -1;
				break;
			case 2:
				s = 250;
				break;
			case 5:
				s = 1073741823;
				break;
			case 4:
				s = 1e4;
				break;
			default: s = 5e3;
		}
		return s = a + s, r = {
			id: u++,
			callback: i,
			priorityLevel: r,
			startTime: a,
			expirationTime: s,
			sortIndex: -1
		}, a > o ? (r.sortIndex = a, t(l, r), n(c) === null && r === n(l) && (h ? (v(C), C = -1) : h = !0, O(x, a - o))) : (r.sortIndex = s, t(c, r), m || p || (m = !0, S || (S = !0, te()))), r;
	}, e.unstable_shouldYield = ee, e.unstable_wrapCallback = function(e) {
		var t = f;
		return function() {
			var n = f;
			f = t;
			try {
				return e.apply(this, arguments);
			} finally {
				f = n;
			}
		};
	};
})), f = /* @__PURE__ */ o(((e, t) => {
	t.exports = d();
})), p = /* @__PURE__ */ o(((e) => {
	var t = u();
	function n(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function r() {}
	var i = {
		d: {
			f: r,
			r: function() {
				throw Error(n(522));
			},
			D: r,
			C: r,
			L: r,
			m: r,
			X: r,
			S: r,
			M: r
		},
		p: 0,
		findDOMNode: null
	}, a = Symbol.for("react.portal"), o = Symbol.for("react.recoverable"), s = Symbol.for("react.optimistic_key");
	function c(e, t, n) {
		var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
		return {
			$$typeof: a,
			key: r == null ? null : r === s ? s : "" + r,
			children: e,
			containerInfo: t,
			implementation: n
		};
	}
	var l = t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	function d(e, t) {
		if (e === "font") return "";
		if (typeof t == "string") return t === "use-credentials" ? t : "";
	}
	e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = i, e.browser = function(e) {
		return {
			$$typeof: o,
			_reason: e
		};
	}, e.createPortal = function(e, t) {
		var r = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
		if (!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11) throw Error(n(299));
		return c(e, t, null, r);
	}, e.flushSync = function(e) {
		var t = l.T, n = i.p;
		try {
			if (l.T = null, i.p = 2, e) return e();
		} finally {
			l.T = t, i.p = n, i.d.f();
		}
	}, e.preconnect = function(e, t) {
		typeof e == "string" && (t ? (t = t.crossOrigin, t = typeof t == "string" ? t === "use-credentials" ? t : "" : void 0) : t = null, i.d.C(e, t));
	}, e.prefetchDNS = function(e) {
		typeof e == "string" && i.d.D(e);
	}, e.preinit = function(e, t) {
		if (typeof e == "string" && t && typeof t.as == "string") {
			var n = t.as, r = d(n, t.crossOrigin), a = typeof t.integrity == "string" ? t.integrity : void 0, o = typeof t.fetchPriority == "string" ? t.fetchPriority : void 0;
			n === "style" ? i.d.S(e, typeof t.precedence == "string" ? t.precedence : void 0, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o
			}) : n === "script" && i.d.X(e, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0
			});
		}
	}, e.preinitModule = function(e, t) {
		if (typeof e == "string") {
			if (typeof t == "object" && t) {
				if (t.as == null || t.as === "script") {
					var n = d(t.as, t.crossOrigin);
					i.d.M(e, {
						crossOrigin: n,
						integrity: typeof t.integrity == "string" ? t.integrity : void 0,
						nonce: typeof t.nonce == "string" ? t.nonce : void 0,
						fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0
					});
				}
			} else t ?? i.d.M(e);
		}
	}, e.preload = function(e, t) {
		if (typeof e == "string" && typeof t == "object" && t && typeof t.as == "string") {
			var n = t.as, r = d(n, t.crossOrigin);
			i.d.L(e, n, {
				crossOrigin: r,
				integrity: typeof t.integrity == "string" ? t.integrity : void 0,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0,
				type: typeof t.type == "string" ? t.type : void 0,
				fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0,
				referrerPolicy: typeof t.referrerPolicy == "string" ? t.referrerPolicy : void 0,
				imageSrcSet: typeof t.imageSrcSet == "string" ? t.imageSrcSet : void 0,
				imageSizes: typeof t.imageSizes == "string" ? t.imageSizes : void 0,
				media: typeof t.media == "string" ? t.media : void 0
			});
		}
	}, e.preloadModule = function(e, t) {
		if (typeof e == "string") {
			if (t) {
				var n = d(t.as, t.crossOrigin);
				i.d.m(e, {
					as: typeof t.as == "string" && t.as !== "script" ? t.as : void 0,
					crossOrigin: n,
					integrity: typeof t.integrity == "string" ? t.integrity : void 0,
					nonce: typeof t.nonce == "string" ? t.nonce : void 0,
					fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0
				});
			} else i.d.m(e);
		}
	}, e.requestFormReset = function(e) {
		i.d.r(e);
	}, e.unstable_batchedUpdates = function(e, t) {
		return e(t);
	}, e.useFormState = function(e, t, n) {
		return l.H.useFormState(e, t, n);
	}, e.useFormStatus = function() {
		return l.H.useHostTransitionStatus();
	}, e.version = "19.3.1";
})), m = /* @__PURE__ */ o(((e, t) => {
	function n() {
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE == "function") try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = p();
})), h = /* @__PURE__ */ o(((e) => {
	var t = f(), n = u(), r = m();
	function i(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function a(e) {
		return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
	}
	function o(e) {
		for (var t = e, n = t; n && !n.alternate;) t = n, t.flags & 4098 && (e = t.return), n = t.return;
		for (; t.return;) t = t.return;
		return t.tag === 3 ? e : null;
	}
	function s(e) {
		if (e.tag === 13) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function c(e) {
		if (e.tag === 31) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function l(e) {
		if (o(e) !== e) throw Error(i(188));
	}
	function d(e) {
		var t = e.alternate;
		if (!t) {
			if (t = o(e), t === null) throw Error(i(188));
			return t === e ? e : null;
		}
		for (var n = e, r = t;;) {
			var a = n.return;
			if (a === null) break;
			var s = a.alternate;
			if (s === null) {
				if (r = a.return, r !== null) {
					n = r;
					continue;
				}
				break;
			}
			if (a.child === s.child) {
				for (s = a.child; s;) {
					if (s === n) return l(a), e;
					if (s === r) return l(a), t;
					s = s.sibling;
				}
				throw Error(i(188));
			}
			if (n.return !== r.return) n = a, r = s;
			else {
				for (var c = !1, u = a.child; u;) {
					if (u === n) {
						c = !0, n = a, r = s;
						break;
					}
					if (u === r) {
						c = !0, r = a, n = s;
						break;
					}
					u = u.sibling;
				}
				if (!c) {
					for (u = s.child; u;) {
						if (u === n) {
							c = !0, n = s, r = a;
							break;
						}
						if (u === r) {
							c = !0, r = s, n = a;
							break;
						}
						u = u.sibling;
					}
					if (!c) throw Error(i(189));
				}
			}
			if (n.alternate !== r) throw Error(i(190));
		}
		if (n.tag !== 3) throw Error(i(188));
		return n.stateNode.current === n ? e : t;
	}
	function p(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e;
		for (e = e.child; e !== null;) {
			if (t = p(e), t !== null) return t;
			e = e.sibling;
		}
		return null;
	}
	function h(e, t, n, r, i, a) {
		for (; e !== null;) {
			if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && n(e, r, i, a) || (e.tag !== 22 || e.memoizedState === null) && (t || e.tag !== 5 && e.tag !== 27) && h(e.child, t, n, r, i, a)) return !0;
			e = e.sibling;
		}
		return !1;
	}
	function g(e) {
		for (e = e.return; e !== null;) {
			if (e.tag === 3 || e.tag === 5 || e.tag === 27) return e;
			e = e.return;
		}
		return null;
	}
	function _(e) {
		var t = !1;
		for (e = e.return; e !== null && (e.tag === 4 && (t = !0), e.tag !== 3 && e.tag !== 5 && e.tag !== 27);) e = e.return;
		return t;
	}
	function v(e) {
		var t = [null, null], n = g(e);
		return n === null || y(t, e, n.child, { foundSelf: !1 }), t;
	}
	function y(e, t, n, r) {
		for (; n !== null;) {
			if (n === t) r.foundSelf = !0;
			else if (n.tag === 5 || n.tag === 27 || n.tag === 6) {
				if (r.foundSelf) return e[1] = n, !0;
				e[0] = n;
			} else if ((n.tag !== 22 || n.memoizedState === null) && y(e, t, n.child, r)) return !0;
			n = n.sibling;
		}
		return !1;
	}
	function b(e) {
		switch (e.tag) {
			case 5:
			case 27:
			case 6: return e.stateNode;
			case 3: return e.stateNode.containerInfo;
			default: throw Error(i(559));
		}
	}
	var x = null, S = null;
	function C(e, t, n) {
		return e === n || e === t && (x = e, !0);
	}
	function w(e, t, n) {
		return e === n ? (S = e, !1) : e === t && (S !== null && (x = e), !0);
	}
	function T(e) {
		if (e === null) return null;
		do
			e = e === null ? null : e.return;
		while (e && e.tag !== 5 && e.tag !== 27 && e.tag !== 3);
		return e || null;
	}
	function ee(e, t, n) {
		for (var r = 0, i = e; i; i = n(i)) r++;
		i = 0;
		for (var a = t; a; a = n(a)) i++;
		for (; 0 < r - i;) e = n(e), r--;
		for (; 0 < i - r;) t = n(t), i--;
		for (; r--;) {
			if (e === t || t !== null && e === t.alternate) return e;
			e = n(e), t = n(t);
		}
		return null;
	}
	var E = Object.assign, te = Symbol.for("react.element"), ne = Symbol.for("react.transitional.element"), D = Symbol.for("react.portal"), O = Symbol.for("react.fragment"), k = Symbol.for("react.strict_mode"), re = Symbol.for("react.profiler"), ie = Symbol.for("react.consumer"), ae = Symbol.for("react.context"), oe = Symbol.for("react.forward_ref"), se = Symbol.for("react.suspense"), ce = Symbol.for("react.suspense_list"), le = Symbol.for("react.memo"), ue = Symbol.for("react.lazy"), de = Symbol.for("react.activity"), fe = Symbol.for("react.legacy_hidden"), pe = Symbol.for("react.memo_cache_sentinel"), me = Symbol.for("react.view_transition"), he = Symbol.for("react.recoverable"), ge = Symbol.iterator;
	function _e(e) {
		return typeof e != "object" || !e ? null : (e = ge && e[ge] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var ve = Symbol.for("react.client.reference");
	function ye(e) {
		if (e == null) return null;
		if (typeof e == "function") return e.$$typeof === ve ? null : e.displayName || e.name || null;
		if (typeof e == "string") return e;
		switch (e) {
			case O: return "Fragment";
			case re: return "Profiler";
			case k: return "StrictMode";
			case se: return "Suspense";
			case ce: return "SuspenseList";
			case de: return "Activity";
			case me: return "ViewTransition";
		}
		if (typeof e == "object") switch (e.$$typeof) {
			case D: return "Portal";
			case ae: return e.displayName || "Context";
			case ie: return (e._context.displayName || "Context") + ".Consumer";
			case oe:
				var t = e.render;
				return e = e.displayName, e ||= (e = t.displayName || t.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
			case le: return t = e.displayName || null, t === null ? ye(e.type) || "Memo" : t;
			case ue:
				t = e._payload, e = e._init;
				try {
					return ye(e(t));
				} catch {}
		}
		return null;
	}
	var be = Array.isArray, A = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, j = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, xe = {
		pending: !1,
		data: null,
		method: null,
		action: null
	}, Se = [], Ce = -1;
	function we(e) {
		return { current: e };
	}
	function Te(e) {
		0 > Ce || (e.current = Se[Ce], Se[Ce] = null, Ce--);
	}
	function M(e, t) {
		Ce++, Se[Ce] = e.current, e.current = t;
	}
	var Ee = we(null), De = we(null), Oe = we(null), ke = we(null);
	function Ae(e, t) {
		switch (M(Oe, t), M(De, e), M(Ee, null), t.nodeType) {
			case 9:
			case 11:
				e = (e = t.documentElement) && (e = e.namespaceURI) ? up(e) : 0;
				break;
			default: if (e = t.tagName, t = t.namespaceURI) t = up(t), e = dp(t, e);
			else switch (e) {
				case "svg":
					e = 1;
					break;
				case "math":
					e = 2;
					break;
				default: e = 0;
			}
		}
		Te(Ee), M(Ee, e);
	}
	function je() {
		Te(Ee), Te(De), Te(Oe);
	}
	function Me(e) {
		var t = e.memoizedState;
		t !== null && (sh._currentValue = t.memoizedState, M(ke, e)), t = Ee.current;
		var n = dp(t, e.type);
		t !== n && (M(De, e), M(Ee, n));
	}
	function Ne(e) {
		De.current === e && (Te(Ee), Te(De)), ke.current === e && (Te(ke), sh._currentValue = xe);
	}
	var Pe, Fe;
	function Ie(e) {
		if (Pe === void 0) try {
			throw Error();
		} catch (e) {
			var t = e.stack.trim().match(/\n( *(at )?)/);
			Pe = t && t[1] || "", Fe = -1 < e.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
		}
		return "\n" + Pe + e + Fe;
	}
	var Le = !1;
	function Re(e, t) {
		if (!e || Le) return "";
		Le = !0;
		var n = Error.prepareStackTrace;
		Error.prepareStackTrace = void 0;
		try {
			var r = { DetermineComponentFrameRoot: function() {
				try {
					if (t) {
						var n = function() {
							throw Error();
						};
						if (Object.defineProperty(n.prototype, "props", { set: function() {
							throw Error();
						} }), typeof Reflect == "object" && Reflect.construct) {
							try {
								Reflect.construct(n, []);
							} catch (e) {
								var r = e;
							}
							Reflect.construct(e, [], n);
						} else {
							try {
								n.call();
							} catch (e) {
								r = e;
							}
							n = !1;
							try {
								var i = Object.getOwnPropertyDescriptor(e.prototype, "props");
								Object.defineProperty(e.prototype, "props", {
									configurable: !0,
									set: function() {
										throw Error();
									}
								}), n = !0, new e();
							} finally {
								n && (i === void 0 ? delete e.prototype.props : Object.defineProperty(e.prototype, "props", i));
							}
						}
					} else {
						try {
							throw Error();
						} catch (e) {
							r = e;
						}
						(n = e()) && typeof n.catch == "function" && n.catch(function() {});
					}
				} catch (e) {
					if (e && r && typeof e.stack == "string") return [e.stack, r.stack];
				}
				return [null, null];
			} };
			r.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
			var i = Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot, "name");
			i && i.configurable && Object.defineProperty(r.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
			var a = r.DetermineComponentFrameRoot(), o = a[0], s = a[1];
			if (o && s) {
				var c = o.split("\n"), l = s.split("\n");
				for (i = r = 0; r < c.length && !c[r].includes("DetermineComponentFrameRoot");) r++;
				for (; i < l.length && !l[i].includes("DetermineComponentFrameRoot");) i++;
				if (r === c.length || i === l.length) for (r = c.length - 1, i = l.length - 1; 1 <= r && 0 <= i && c[r] !== l[i];) i--;
				for (; 1 <= r && 0 <= i; r--, i--) if (c[r] !== l[i]) {
					if (r !== 1 || i !== 1) do
						if (r--, i--, 0 > i || c[r] !== l[i]) {
							var u = "\n" + c[r].replace(" at new ", " at ");
							return e.displayName && u.includes("<anonymous>") && (u = u.replace("<anonymous>", e.displayName)), u;
						}
					while (1 <= r && 0 <= i);
					break;
				}
			}
		} finally {
			Le = !1, Error.prepareStackTrace = n;
		}
		return (n = e ? e.displayName || e.name : "") ? Ie(n) : "";
	}
	function N(e, t) {
		switch (e.tag) {
			case 26:
			case 27:
			case 5: return Ie(e.type);
			case 16: return Ie("Lazy");
			case 13: return e.child !== t && t !== null ? Ie("Suspense Fallback") : Ie("Suspense");
			case 19: return Ie("SuspenseList");
			case 0:
			case 15: return Re(e.type, !1);
			case 11: return Re(e.type.render, !1);
			case 1: return Re(e.type, !0);
			case 31: return Ie("Activity");
			case 30: return Ie("ViewTransition");
			default: return "";
		}
	}
	function ze(e) {
		try {
			var t = "", n = null;
			do
				t += N(e, n), n = e, e = e.return;
			while (e);
			return t;
		} catch (e) {
			return "\nError generating stack: " + e.message + "\n" + e.stack;
		}
	}
	var Be = Object.prototype.hasOwnProperty, Ve = t.unstable_scheduleCallback, He = t.unstable_cancelCallback, Ue = t.unstable_shouldYield, We = t.unstable_requestPaint, Ge = t.unstable_now, Ke = t.unstable_getCurrentPriorityLevel, qe = t.unstable_ImmediatePriority, Je = t.unstable_UserBlockingPriority, Ye = t.unstable_NormalPriority, Xe = t.unstable_LowPriority, Ze = t.unstable_IdlePriority, Qe = t.log, $e = t.unstable_setDisableYieldValue, et = null, tt = null;
	function nt(e) {
		if (typeof Qe == "function" && $e(e), tt && typeof tt.setStrictMode == "function") try {
			tt.setStrictMode(et, e);
		} catch {}
	}
	var rt = Math.clz32 ? Math.clz32 : ot, it = Math.log, at = Math.LN2;
	function ot(e) {
		return e >>>= 0, e === 0 ? 32 : 31 - (it(e) / at | 0) | 0;
	}
	var st = 256, ct = 262144, lt = 4194304;
	function ut(e) {
		var t = e & 42;
		if (t !== 0) return t;
		switch (e & -e) {
			case 1: return 1;
			case 2: return 2;
			case 4: return 4;
			case 8: return 8;
			case 16: return 16;
			case 32: return 32;
			case 64: return 64;
			case 128: return 128;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072: return e & -e;
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return e & 3932160;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return e & 62914560;
			case 67108864: return 67108864;
			case 134217728: return 134217728;
			case 268435456: return 268435456;
			case 536870912: return 536870912;
			case 1073741824: return 0;
			default: return e;
		}
	}
	function dt(e, t, n) {
		var r = e.pendingLanes;
		if (r === 0) return 0;
		var i = 0, a = e.suspendedLanes, o = e.pingedLanes;
		e = e.warmLanes;
		var s = r & 134217727;
		return s === 0 ? (s = r & ~a, s === 0 ? o === 0 ? n || (n = r & ~e, n !== 0 && (i = ut(n))) : i = ut(o) : i = ut(s)) : (r = s & ~a, r === 0 ? (o &= s, o === 0 ? n || (n = s & ~e, n !== 0 && (i = ut(n))) : i = ut(o)) : i = ut(r)), i === 0 ? 0 : t !== 0 && t !== i && (t & a) === 0 && (a = i & -i, n = t & -t, a >= n || a === 32 && n & 4194048) ? t : i;
	}
	function ft(e, t) {
		return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
	}
	function pt(e, t) {
		t & 8 && (t |= t & 32);
		var n = e.entangledLanes;
		if (n !== 0) for (e = e.entanglements, n &= t; 0 < n;) {
			var r = 31 - rt(n), i = 1 << r;
			t |= e[r], n &= ~i;
		}
		return t;
	}
	function mt(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 4:
			case 8:
			case 64: return t + 250;
			case 16:
			case 32:
			case 128:
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return t + 5e3;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return -1;
			case 67108864:
			case 134217728:
			case 268435456:
			case 536870912:
			case 1073741824: return -1;
			default: return -1;
		}
	}
	function ht() {
		var e = lt;
		return lt <<= 1, !(lt & 62914560) && (lt = 4194304), e;
	}
	function gt(e) {
		for (var t = [], n = 0; 31 > n; n++) t.push(e);
		return t;
	}
	function _t(e, t) {
		e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
	}
	function vt(e, t, n, r, i, a) {
		var o = e.pendingLanes;
		e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
		var s = e.entanglements, c = e.expirationTimes, l = e.hiddenUpdates;
		for (n = o & ~n; 0 < n;) {
			var u = 31 - rt(n), d = 1 << u;
			s[u] = 0, c[u] = -1;
			var f = l[u];
			if (f !== null) for (l[u] = null, u = 0; u < f.length; u++) {
				var p = f[u];
				p !== null && (p.lane &= -536870913);
			}
			n &= ~d;
		}
		r !== 0 && yt(e, r, 0), a !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= a & ~(o & ~t));
	}
	function yt(e, t, n) {
		e.pendingLanes |= t, e.suspendedLanes &= ~t;
		var r = 31 - rt(t);
		e.entangledLanes |= t, e.entanglements[r] = e.entanglements[r] | 1073741824 | n & 261930;
	}
	function bt(e, t) {
		var n = e.entangledLanes |= t;
		for (e = e.entanglements; n;) {
			var r = 31 - rt(n), i = 1 << r;
			i & t | e[r] & t && (e[r] |= t), n &= ~i;
		}
	}
	function xt(e, t) {
		var n = t & -t;
		return n = n & 42 ? 1 : St(n), (n & (e.suspendedLanes | t)) === 0 ? n : 0;
	}
	function St(e) {
		switch (e) {
			case 2:
				e = 1;
				break;
			case 8:
				e = 4;
				break;
			case 32:
				e = 16;
				break;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152:
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432:
				e = 128;
				break;
			case 268435456:
				e = 134217728;
				break;
			default: e = 0;
		}
		return e;
	}
	function Ct(e) {
		return e &= -e, 2 < e ? 8 < e ? e & 134217727 ? 32 : 268435456 : 8 : 2;
	}
	function wt() {
		var e = j.p;
		return e === 0 ? (e = window.event, e === void 0 ? 32 : Ch(e.type)) : e;
	}
	function P(e, t) {
		var n = j.p;
		try {
			return j.p = e, t();
		} finally {
			j.p = n;
		}
	}
	var Tt = Math.random().toString(36).slice(2), F = "__reactFiber$" + Tt, Et = "__reactProps$" + Tt, Dt = "__reactContainer$" + Tt, Ot = "__reactEvents$" + Tt, kt = "__reactListeners$" + Tt, At = "__reactHandles$" + Tt, jt = "__reactResources$" + Tt, Mt = "__reactMarker$" + Tt, Nt = "__reactLoad$" + Tt;
	function Pt(e) {
		delete e[F], delete e[Et], delete e[kt], delete e[At];
	}
	function Ft(e) {
		var t;
		if (t = e[F]) return t;
		for (var n = e.parentNode; n;) {
			if (t = n[Dt] || n[F]) {
				if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = fm(e); e !== null;) {
					if (n = e[F]) return n;
					e = fm(e);
				}
				return t;
			}
			e = n, n = e.parentNode;
		}
		return null;
	}
	function It(e) {
		if (e = e[F] || e[Dt]) {
			var t = e.tag;
			if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
		}
		return null;
	}
	function Lt(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
		throw Error(i(33));
	}
	function Rt(e) {
		var t = e[jt];
		return t ||= e[jt] = {
			hoistableStyles: /* @__PURE__ */ new Map(),
			hoistableScripts: /* @__PURE__ */ new Map()
		}, t;
	}
	function zt(e) {
		e[Mt] = !0;
	}
	function Bt(e) {
		e[Nt] = void 0;
	}
	var Vt = /* @__PURE__ */ new Set(), Ht = {};
	function Ut(e, t) {
		Wt(e, t), Wt(e + "Capture", t);
	}
	function Wt(e, t) {
		for (Ht[e] = t, e = 0; e < t.length; e++) Vt.add(t[e]);
	}
	var Gt = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), I = {}, Kt = {};
	function qt(e) {
		return Be.call(Kt, e) ? !0 : Be.call(I, e) ? !1 : Gt.test(e) ? Kt[e] = !0 : (I[e] = !0, !1);
	}
	var L = !1;
	function Jt() {
		var e = L;
		return L = !1, e;
	}
	function Yt(e, t, n) {
		if (qt(t)) {
			if (n === null) e.removeAttribute(t);
			else {
				switch (typeof n) {
					case "undefined":
					case "function":
					case "symbol":
						e.removeAttribute(t);
						return;
					case "boolean":
						var r = t.toLowerCase().slice(0, 5);
						if (r !== "data-" && r !== "aria-") {
							e.removeAttribute(t);
							return;
						}
				}
				e.setAttribute(t, n);
			}
		}
	}
	function Xt(e, t, n) {
		if (n === null) e.removeAttribute(t);
		else {
			switch (typeof n) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(t);
					return;
			}
			e.setAttribute(t, n);
		}
	}
	function Zt(e, t, n, r) {
		if (r === null) e.removeAttribute(n);
		else {
			switch (typeof r) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(n);
					return;
			}
			e.setAttributeNS(t, n, r);
		}
	}
	function Qt(e) {
		switch (typeof e) {
			case "bigint":
			case "boolean":
			case "number":
			case "string":
			case "undefined": return e;
			case "object": return e;
			default: return "";
		}
	}
	function $t(e) {
		var t = e.type;
		return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
	}
	function en(e, t, n) {
		var r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
		if (!e.hasOwnProperty(t) && r !== void 0 && typeof r.get == "function" && typeof r.set == "function") {
			var i = r.get, a = r.set;
			return Object.defineProperty(e, t, {
				configurable: !0,
				get: function() {
					return i.call(this);
				},
				set: function(e) {
					n = "" + e, a.call(this, e);
				}
			}), Object.defineProperty(e, t, { enumerable: r.enumerable }), {
				getValue: function() {
					return n;
				},
				setValue: function(e) {
					n = "" + e;
				},
				stopTracking: function() {
					e._valueTracker = null, delete e[t];
				}
			};
		}
	}
	function R(e) {
		if (!e._valueTracker) {
			var t = $t(e) ? "checked" : "value";
			e._valueTracker = en(e, t, "" + e[t]);
		}
	}
	function tn(e) {
		if (!e) return !1;
		var t = e._valueTracker;
		if (!t) return !0;
		var n = t.getValue(), r = "";
		return e && (r = $t(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n && (t.setValue(e), !0);
	}
	var nn = /[\n"\\]/g;
	function rn(e) {
		return e.replace(nn, function(e) {
			return "\\" + e.charCodeAt(0).toString(16) + " ";
		});
	}
	function an(e, t, n, r, i, a, o, s) {
		e.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? e.type = o : e.removeAttribute("type"), t == null ? o !== "submit" && o !== "reset" || e.removeAttribute("value") : o === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Qt(t)) : e.value !== "" + Qt(t) && (e.value = "" + Qt(t)), t == null ? n == null ? r != null && e.removeAttribute("value") : sn(e, Qt(n)) : o === "number" && e.value == t ? sn(e, Qt(e.value)) : sn(e, Qt(t)), i == null && a != null && (e.defaultChecked = !!a), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? e.name = "" + Qt(s) : e.removeAttribute("name");
	}
	function on(e, t, n, r, i, a, o, s) {
		if (a != null && typeof a != "function" && typeof a != "symbol" && typeof a != "boolean" && (e.type = a), t != null || n != null) {
			if (!(a !== "submit" && a !== "reset" || t != null)) {
				R(e);
				return;
			}
			n = n == null ? "" : "" + Qt(n), t = t == null ? n : "" + Qt(t), s || t === e.value || (e.value = t), e.defaultValue = t;
		}
		r ??= i, r = typeof r != "function" && typeof r != "symbol" && !!r, e.checked = s ? e.checked : !!r, e.defaultChecked = !!r, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (e.name = o), R(e);
	}
	function sn(e, t) {
		e.defaultValue !== "" + t && (e.defaultValue = "" + t);
	}
	function cn(e, t, n, r) {
		if (e = e.options, t) {
			t = {};
			for (var i = 0; i < n.length; i++) t["$" + n[i]] = !0;
			for (n = 0; n < e.length; n++) i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && r && (e[n].defaultSelected = !0);
		} else {
			for (n = "" + Qt(n), t = null, i = 0; i < e.length; i++) {
				if (e[i].value === n) {
					e[i].selected = !0, r && (e[i].defaultSelected = !0);
					return;
				}
				t !== null || e[i].disabled || (t = e[i]);
			}
			t !== null && (t.selected = !0);
		}
	}
	function z(e, t, n) {
		t != null && (t = "" + Qt(t), t !== e.value && (e.value = t), n == null) ? e.defaultValue !== t && (e.defaultValue = t) : e.defaultValue = n == null ? "" : "" + Qt(n);
	}
	function ln(e, t, n, r) {
		if (t == null) {
			if (r != null) {
				if (n != null) throw Error(i(92));
				if (be(r)) {
					if (1 < r.length) throw Error(i(93));
					r = r[0];
				}
				n = r;
			}
			n ??= "", t = n;
		}
		n = Qt(t), e.defaultValue = n, r = e.textContent, r === n && r !== "" && r !== null && (e.value = r), R(e);
	}
	function un(e, t) {
		if (t) {
			var n = e.firstChild;
			if (n && n === e.lastChild && n.nodeType === 3) {
				n.nodeValue = t;
				return;
			}
		}
		e.textContent = t;
	}
	var dn = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
	function fn(e, t, n) {
		var r = t.indexOf("--") === 0;
		n == null || typeof n == "boolean" || n === "" ? r ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : r ? e.setProperty(t, n) : typeof n != "number" || n === 0 || dn.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
	}
	function pn(e, t, n) {
		if (t != null && typeof t != "object") throw Error(i(62));
		if (e = e.style, n != null) {
			for (var r in n) !n.hasOwnProperty(r) || t != null && t.hasOwnProperty(r) || (r.indexOf("--") === 0 ? e.setProperty(r, "") : r === "float" ? e.cssFloat = "" : e[r] = "", L = !0);
			for (var a in t) r = t[a], t.hasOwnProperty(a) && n[a] !== r && (fn(e, a, r), L = !0);
		} else for (var o in t) t.hasOwnProperty(o) && fn(e, o, t[o]);
	}
	function mn(e) {
		if (e.indexOf("-") === -1) return !1;
		switch (e) {
			case "annotation-xml":
			case "color-profile":
			case "font-face":
			case "font-face-src":
			case "font-face-uri":
			case "font-face-format":
			case "font-face-name":
			case "missing-glyph": return !1;
			default: return !0;
		}
	}
	var hn = /* @__PURE__ */ new Map([
		["acceptCharset", "accept-charset"],
		["htmlFor", "for"],
		["httpEquiv", "http-equiv"],
		["crossOrigin", "crossorigin"],
		["accentHeight", "accent-height"],
		["alignmentBaseline", "alignment-baseline"],
		["arabicForm", "arabic-form"],
		["baselineShift", "baseline-shift"],
		["capHeight", "cap-height"],
		["clipPath", "clip-path"],
		["clipRule", "clip-rule"],
		["colorInterpolation", "color-interpolation"],
		["colorInterpolationFilters", "color-interpolation-filters"],
		["colorProfile", "color-profile"],
		["colorRendering", "color-rendering"],
		["dominantBaseline", "dominant-baseline"],
		["enableBackground", "enable-background"],
		["fillOpacity", "fill-opacity"],
		["fillRule", "fill-rule"],
		["floodColor", "flood-color"],
		["floodOpacity", "flood-opacity"],
		["fontFamily", "font-family"],
		["fontSize", "font-size"],
		["fontSizeAdjust", "font-size-adjust"],
		["fontStretch", "font-stretch"],
		["fontStyle", "font-style"],
		["fontVariant", "font-variant"],
		["fontWeight", "font-weight"],
		["glyphName", "glyph-name"],
		["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
		["glyphOrientationVertical", "glyph-orientation-vertical"],
		["horizAdvX", "horiz-adv-x"],
		["horizOriginX", "horiz-origin-x"],
		["imageRendering", "image-rendering"],
		["letterSpacing", "letter-spacing"],
		["lightingColor", "lighting-color"],
		["markerEnd", "marker-end"],
		["markerMid", "marker-mid"],
		["markerStart", "marker-start"],
		["maskType", "mask-type"],
		["overlinePosition", "overline-position"],
		["overlineThickness", "overline-thickness"],
		["paintOrder", "paint-order"],
		["panose-1", "panose-1"],
		["pointerEvents", "pointer-events"],
		["renderingIntent", "rendering-intent"],
		["shapeRendering", "shape-rendering"],
		["stopColor", "stop-color"],
		["stopOpacity", "stop-opacity"],
		["strikethroughPosition", "strikethrough-position"],
		["strikethroughThickness", "strikethrough-thickness"],
		["strokeDasharray", "stroke-dasharray"],
		["strokeDashoffset", "stroke-dashoffset"],
		["strokeLinecap", "stroke-linecap"],
		["strokeLinejoin", "stroke-linejoin"],
		["strokeMiterlimit", "stroke-miterlimit"],
		["strokeOpacity", "stroke-opacity"],
		["strokeWidth", "stroke-width"],
		["textAnchor", "text-anchor"],
		["textDecoration", "text-decoration"],
		["textRendering", "text-rendering"],
		["transformOrigin", "transform-origin"],
		["underlinePosition", "underline-position"],
		["underlineThickness", "underline-thickness"],
		["unicodeBidi", "unicode-bidi"],
		["unicodeRange", "unicode-range"],
		["unitsPerEm", "units-per-em"],
		["vAlphabetic", "v-alphabetic"],
		["vHanging", "v-hanging"],
		["vIdeographic", "v-ideographic"],
		["vMathematical", "v-mathematical"],
		["vectorEffect", "vector-effect"],
		["vertAdvY", "vert-adv-y"],
		["vertOriginX", "vert-origin-x"],
		["vertOriginY", "vert-origin-y"],
		["wordSpacing", "word-spacing"],
		["writingMode", "writing-mode"],
		["xmlnsXlink", "xmlns:xlink"],
		["xHeight", "x-height"]
	]), gn = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function _n(e) {
		return gn.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
	}
	function vn() {}
	var B = null;
	function yn(e) {
		return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
	}
	var bn = null, xn = null;
	function Sn(e) {
		var t = It(e);
		if (t && (e = t.stateNode)) {
			var n = e[Et] || null;
			a: switch (e = t.stateNode, t.type) {
				case "input":
					if (an(e, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name), t = n.name, n.type === "radio" && t != null) {
						for (n = e; n.parentNode;) n = n.parentNode;
						for (n = n.querySelectorAll("input[name=\"" + rn("" + t) + "\"][type=\"radio\"]"), t = 0; t < n.length; t++) {
							var r = n[t];
							if (r !== e && r.form === e.form) {
								var a = r[Et] || null;
								if (!a) throw Error(i(90));
								an(r, a.value, a.defaultValue, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name);
							}
						}
						for (t = 0; t < n.length; t++) r = n[t], r.form === e.form && tn(r);
					}
					break a;
				case "textarea":
					z(e, n.value, n.defaultValue);
					break a;
				case "select": t = n.value, t != null && cn(e, !!n.multiple, t, !1);
			}
		}
	}
	var Cn = !1;
	function wn(e, t, n) {
		if (Cn) return e(t, n);
		Cn = !0;
		try {
			return e(t);
		} finally {
			if (Cn = !1, (bn !== null || xn !== null) && (zd(), bn && (t = bn, e = xn, xn = bn = null, Sn(t), e))) for (t = 0; t < e.length; t++) Sn(e[t]);
		}
	}
	function Tn(e, t) {
		var n = e.stateNode;
		if (n === null) return null;
		var r = n[Et] || null;
		if (r === null) return null;
		n = r[t];
		a: switch (t) {
			case "onClick":
			case "onClickCapture":
			case "onDoubleClick":
			case "onDoubleClickCapture":
			case "onMouseDown":
			case "onMouseDownCapture":
			case "onMouseMove":
			case "onMouseMoveCapture":
			case "onMouseUp":
			case "onMouseUpCapture":
			case "onMouseEnter":
				(r = !r.disabled) || (e = e.type, r = e !== "button" && e !== "input" && e !== "select" && e !== "textarea"), e = !r;
				break a;
			default: e = !1;
		}
		if (e) return null;
		if (n && typeof n != "function") throw Error(i(231, t, typeof n));
		return n;
	}
	var En = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0, Dn = !1;
	if (En) try {
		var On = {};
		Object.defineProperty(On, "passive", { get: function() {
			Dn = !0;
		} }), window.addEventListener("test", On, On), window.removeEventListener("test", On, On);
	} catch {
		Dn = !1;
	}
	var kn = null, An = null, jn = null;
	function Mn() {
		if (jn) return jn;
		var e, t = An, n = t.length, r, i = "value" in kn ? kn.value : kn.textContent, a = i.length;
		for (e = 0; e < n && t[e] === i[e]; e++);
		var o = n - e;
		for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
		return jn = i.slice(e, 1 < r ? 1 - r : void 0);
	}
	function Nn(e) {
		var t = e.keyCode;
		return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
	}
	function Pn() {
		return !0;
	}
	function Fn() {
		return !1;
	}
	function In(e) {
		function t(t, n, r, i, a) {
			for (var o in this._reactName = t, this._targetInst = r, this.type = n, this.nativeEvent = i, this.target = a, this.currentTarget = null, e) e.hasOwnProperty(o) && (t = e[o], this[o] = t ? t(i) : i[o]);
			return this.isDefaultPrevented = (i.defaultPrevented == null ? !1 === i.returnValue : i.defaultPrevented) ? Pn : Fn, this.isPropagationStopped = Fn, this;
		}
		return E(t.prototype, {
			preventDefault: function() {
				this.defaultPrevented = !0;
				var e = this.nativeEvent;
				e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = Pn);
			},
			stopPropagation: function() {
				var e = this.nativeEvent;
				e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = Pn);
			},
			persist: function() {},
			isPersistent: Pn
		}), t;
	}
	var Ln = {
		eventPhase: 0,
		bubbles: 0,
		cancelable: 0,
		timeStamp: function(e) {
			return e.timeStamp || Date.now();
		},
		defaultPrevented: 0,
		isTrusted: 0
	}, Rn = In(Ln), V = E({}, Ln, {
		view: 0,
		detail: 0
	}), zn = In(V), Bn, Vn, Hn, Un = E({}, V, {
		screenX: 0,
		screenY: 0,
		clientX: 0,
		clientY: 0,
		pageX: 0,
		pageY: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		getModifierState: er,
		button: 0,
		buttons: 0,
		relatedTarget: function(e) {
			return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
		},
		movementX: function(e) {
			return "movementX" in e ? e.movementX : (e !== Hn && (Hn && e.type === "mousemove" ? (Bn = e.screenX - Hn.screenX, Vn = e.screenY - Hn.screenY) : Vn = Bn = 0, Hn = e), Bn);
		},
		movementY: function(e) {
			return "movementY" in e ? e.movementY : Vn;
		}
	}), Wn = In(Un), Gn = In(E({}, Un, { dataTransfer: 0 })), Kn = In(E({}, V, { relatedTarget: 0 })), qn = In(E({}, Ln, {
		animationName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), Jn = In(E({}, Ln, { clipboardData: function(e) {
		return "clipboardData" in e ? e.clipboardData : window.clipboardData;
	} })), Yn = In(E({}, Ln, { data: 0 })), Xn = {
		Esc: "Escape",
		Spacebar: " ",
		Left: "ArrowLeft",
		Up: "ArrowUp",
		Right: "ArrowRight",
		Down: "ArrowDown",
		Del: "Delete",
		Win: "OS",
		Menu: "ContextMenu",
		Apps: "ContextMenu",
		Scroll: "ScrollLock",
		MozPrintableKey: "Unidentified"
	}, Zn = {
		8: "Backspace",
		9: "Tab",
		12: "Clear",
		13: "Enter",
		16: "Shift",
		17: "Control",
		18: "Alt",
		19: "Pause",
		20: "CapsLock",
		27: "Escape",
		32: " ",
		33: "PageUp",
		34: "PageDown",
		35: "End",
		36: "Home",
		37: "ArrowLeft",
		38: "ArrowUp",
		39: "ArrowRight",
		40: "ArrowDown",
		45: "Insert",
		46: "Delete",
		112: "F1",
		113: "F2",
		114: "F3",
		115: "F4",
		116: "F5",
		117: "F6",
		118: "F7",
		119: "F8",
		120: "F9",
		121: "F10",
		122: "F11",
		123: "F12",
		144: "NumLock",
		145: "ScrollLock",
		224: "Meta"
	}, Qn = {
		Alt: "altKey",
		Control: "ctrlKey",
		Meta: "metaKey",
		Shift: "shiftKey"
	};
	function $n(e) {
		var t = this.nativeEvent;
		return t.getModifierState ? t.getModifierState(e) : (e = Qn[e]) ? !!t[e] : !1;
	}
	function er() {
		return $n;
	}
	var tr = In(E({}, V, {
		key: function(e) {
			if (e.key) {
				var t = Xn[e.key] || e.key;
				if (t !== "Unidentified") return t;
			}
			return e.type === "keypress" ? (e = Nn(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Zn[e.keyCode] || "Unidentified" : "";
		},
		code: 0,
		location: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		repeat: 0,
		locale: 0,
		getModifierState: er,
		charCode: function(e) {
			return e.type === "keypress" ? Nn(e) : 0;
		},
		keyCode: function(e) {
			return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		},
		which: function(e) {
			return e.type === "keypress" ? Nn(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		}
	})), nr = In(E({}, Un, {
		pointerId: 0,
		width: 0,
		height: 0,
		pressure: 0,
		tangentialPressure: 0,
		tiltX: 0,
		tiltY: 0,
		twist: 0,
		pointerType: 0,
		isPrimary: 0
	})), rr = In(E({}, Ln, { submitter: 0 })), ir = In(E({}, V, {
		touches: 0,
		targetTouches: 0,
		changedTouches: 0,
		altKey: 0,
		metaKey: 0,
		ctrlKey: 0,
		shiftKey: 0,
		getModifierState: er
	})), ar = In(E({}, Ln, {
		propertyName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), or = In(E({}, Un, {
		deltaX: function(e) {
			return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
		},
		deltaY: function(e) {
			return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
		},
		deltaZ: 0,
		deltaMode: 0
	})), sr = In(E({}, Ln, {
		newState: 0,
		oldState: 0,
		source: 0
	})), cr = [
		9,
		13,
		27,
		32
	], lr = En && "CompositionEvent" in window, ur = null;
	En && "documentMode" in document && (ur = document.documentMode);
	var dr = En && "TextEvent" in window && !ur, fr = En && (!lr || ur && 8 < ur && 11 >= ur), pr = " ", mr = !1;
	function hr(e, t) {
		switch (e) {
			case "keyup": return cr.indexOf(t.keyCode) !== -1;
			case "keydown": return t.keyCode !== 229;
			case "keypress":
			case "mousedown":
			case "focusout": return !0;
			default: return !1;
		}
	}
	function gr(e) {
		return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
	}
	var _r = !1;
	function vr(e, t) {
		switch (e) {
			case "compositionend": return gr(t);
			case "keypress": return t.which === 32 ? (mr = !0, pr) : null;
			case "textInput": return e = t.data, e === pr && mr ? null : e;
			default: return null;
		}
	}
	function yr(e, t) {
		if (_r) return e === "compositionend" || !lr && hr(e, t) ? (e = Mn(), jn = An = kn = null, _r = !1, e) : null;
		switch (e) {
			case "paste": return null;
			case "keypress":
				if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
					if (t.char && 1 < t.char.length) return t.char;
					if (t.which) return String.fromCharCode(t.which);
				}
				return null;
			case "compositionend": return fr && t.locale !== "ko" ? null : t.data;
			default: return null;
		}
	}
	var br = {
		color: !0,
		date: !0,
		datetime: !0,
		"datetime-local": !0,
		email: !0,
		month: !0,
		number: !0,
		password: !0,
		range: !0,
		search: !0,
		tel: !0,
		text: !0,
		time: !0,
		url: !0,
		week: !0
	};
	function xr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t === "input" ? !!br[e.type] : t === "textarea";
	}
	function Sr(e, t, n, r) {
		bn ? xn ? xn.push(r) : xn = [r] : bn = r, t = Jf(t, "onChange"), 0 < t.length && (n = new Rn("onChange", "change", null, n, r), e.push({
			event: n,
			listeners: t
		}));
	}
	var Cr = null, wr = null;
	function Tr(e) {
		Vf(e, 0);
	}
	function Er(e) {
		if (tn(Lt(e))) return e;
	}
	function Dr(e, t) {
		if (e === "change") return t;
	}
	var Or = !1;
	if (En) {
		var kr;
		if (En) {
			var Ar = "oninput" in document;
			if (!Ar) {
				var jr = document.createElement("div");
				jr.setAttribute("oninput", "return;"), Ar = typeof jr.oninput == "function";
			}
			kr = Ar;
		} else kr = !1;
		Or = kr && (!document.documentMode || 9 < document.documentMode);
	}
	function Mr() {
		Cr && (Cr.detachEvent("onpropertychange", Nr), wr = Cr = null);
	}
	function Nr(e) {
		if (e.propertyName === "value" && Er(wr)) {
			var t = [];
			Sr(t, wr, e, yn(e)), wn(Tr, t);
		}
	}
	function Pr(e, t, n) {
		e === "focusin" ? (Mr(), Cr = t, wr = n, Cr.attachEvent("onpropertychange", Nr)) : e === "focusout" && Mr();
	}
	function Fr(e) {
		if (e === "selectionchange" || e === "keyup" || e === "keydown") return Er(wr);
	}
	function Ir(e, t) {
		if (e === "click") return Er(t);
	}
	function Lr(e, t) {
		if (e === "input" || e === "change") return Er(t);
	}
	function Rr(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var zr = typeof Object.is == "function" ? Object.is : Rr;
	function Br(e, t) {
		if (zr(e, t)) return !0;
		if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
		var n = Object.keys(e), r = Object.keys(t);
		if (n.length !== r.length) return !1;
		for (r = 0; r < n.length; r++) {
			var i = n[r];
			if (!Be.call(t, i) || !zr(e[i], t[i])) return !1;
		}
		return !0;
	}
	function Vr(e) {
		if (e ||= typeof document < "u" ? document : void 0, e === void 0) return null;
		try {
			return e.activeElement || e.body;
		} catch {
			return e.body;
		}
	}
	function Hr(e) {
		for (; e && e.firstChild;) e = e.firstChild;
		return e;
	}
	function Ur(e, t) {
		var n = Hr(e);
		e = 0;
		for (var r; n;) {
			if (n.nodeType === 3) {
				if (r = e + n.textContent.length, e <= t && r >= t) return {
					node: n,
					offset: t - e
				};
				e = r;
			}
			a: {
				for (; n;) {
					if (n.nextSibling) {
						n = n.nextSibling;
						break a;
					}
					n = n.parentNode;
				}
				n = void 0;
			}
			n = Hr(n);
		}
	}
	function Wr(e, t) {
		return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Wr(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
	}
	function Gr(e) {
		e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
		for (var t = Vr(e.document); t instanceof e.HTMLIFrameElement;) {
			try {
				var n = typeof t.contentWindow.location.href == "string";
			} catch {
				n = !1;
			}
			if (n) e = t.contentWindow;
			else break;
			t = Vr(e.document);
		}
		return t;
	}
	function Kr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
	}
	var qr = En && "documentMode" in document && 11 >= document.documentMode, Jr = null, Yr = null, Xr = null, Zr = !1;
	function Qr(e, t, n) {
		var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
		Zr || Jr == null || Jr !== Vr(r) || (r = Jr, "selectionStart" in r && Kr(r) ? r = {
			start: r.selectionStart,
			end: r.selectionEnd
		} : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
			anchorNode: r.anchorNode,
			anchorOffset: r.anchorOffset,
			focusNode: r.focusNode,
			focusOffset: r.focusOffset
		}), Xr && Br(Xr, r) || (Xr = r, r = Jf(Yr, "onSelect"), 0 < r.length && (t = new Rn("onSelect", "select", null, t, n), e.push({
			event: t,
			listeners: r
		}), t.target = Jr)));
	}
	function $r(e, t) {
		var n = {};
		return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
	}
	var ei = {
		animationend: $r("Animation", "AnimationEnd"),
		animationiteration: $r("Animation", "AnimationIteration"),
		animationstart: $r("Animation", "AnimationStart"),
		transitionrun: $r("Transition", "TransitionRun"),
		transitionstart: $r("Transition", "TransitionStart"),
		transitioncancel: $r("Transition", "TransitionCancel"),
		transitionend: $r("Transition", "TransitionEnd")
	}, ti = {}, ni = {};
	En && (ni = document.createElement("div").style, "AnimationEvent" in window || (delete ei.animationend.animation, delete ei.animationiteration.animation, delete ei.animationstart.animation), "TransitionEvent" in window || delete ei.transitionend.transition);
	function ri(e) {
		if (ti[e]) return ti[e];
		if (!ei[e]) return e;
		var t = ei[e], n;
		for (n in t) if (t.hasOwnProperty(n) && n in ni) return ti[e] = t[n];
		return e;
	}
	var ii = ri("animationend"), ai = ri("animationiteration"), oi = ri("animationstart"), si = ri("transitionrun"), ci = ri("transitionstart"), li = ri("transitioncancel"), ui = ri("transitionend"), di = /* @__PURE__ */ new Map(), fi = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
	fi.push("scrollEnd");
	function pi(e, t) {
		di.set(e, t), Ut(t, [e]);
	}
	var mi = 0;
	function hi(e, t) {
		if (e.name != null && e.name !== "auto") return e.name;
		if (t.autoName !== null) return t.autoName;
		e = bd.identifierPrefix;
		var n = mi++;
		return e = "_" + e + "t_" + n.toString(32) + "_", t.autoName = e;
	}
	function gi(e) {
		if (e == null || typeof e == "string") return e;
		var t = null, n = Od;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = e[n[r]];
			if (i != null) {
				if (i === "none") return "none";
				t = t == null ? i : t + (" " + i);
			}
		}
		return t ?? e.default;
	}
	function _i(e, t) {
		return e = gi(e), t = gi(t), t == null ? e === "auto" ? null : e : t === "auto" ? null : t;
	}
	var vi = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	}, yi = [], bi = 0, xi = 0;
	function Si() {
		for (var e = bi, t = xi = bi = 0; t < e;) {
			var n = yi[t];
			yi[t++] = null;
			var r = yi[t];
			yi[t++] = null;
			var i = yi[t];
			yi[t++] = null;
			var a = yi[t];
			if (yi[t++] = null, r !== null && i !== null) {
				var o = r.pending;
				o === null ? i.next = i : (i.next = o.next, o.next = i), r.pending = i;
			}
			a !== 0 && Ei(n, i, a);
		}
	}
	function Ci(e, t, n, r) {
		yi[bi++] = e, yi[bi++] = t, yi[bi++] = n, yi[bi++] = r, xi |= r, e.lanes |= r, e = e.alternate, e !== null && (e.lanes |= r);
	}
	function wi(e, t, n, r) {
		return Ci(e, t, n, r), Di(e);
	}
	function Ti(e, t) {
		return Ci(e, null, null, t), Di(e);
	}
	function Ei(e, t, n) {
		e.lanes |= n;
		var r = e.alternate;
		r !== null && (r.lanes |= n);
		for (var i = !1, a = e.return; a !== null;) a.childLanes |= n, r = a.alternate, r !== null && (r.childLanes |= n), a.tag === 22 && (e = a.stateNode, e === null || e._visibility & 1 || (i = !0)), e = a, a = a.return;
		return e.tag === 3 ? (a = e.stateNode, i && t !== null && (i = 31 - rt(n), e = a.hiddenUpdates, r = e[i], r === null ? e[i] = [t] : r.push(t), t.lane = n | 536870912), a) : null;
	}
	function Di(e) {
		if (50 < kd) throw kd = 0, Ad = null, Error(i(185));
		for (var t = e.return; t !== null;) e = t, t = e.return;
		return e.tag === 3 ? e.stateNode : null;
	}
	var Oi = {};
	function ki(e, t, n, r) {
		this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
	}
	function Ai(e, t, n, r) {
		return new ki(e, t, n, r);
	}
	function ji(e) {
		return e = e.prototype, !(!e || !e.isReactComponent);
	}
	function Mi(e, t) {
		var n = e.alternate;
		return n === null ? (n = Ai(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 1206910976, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
	}
	function Ni(e, t) {
		e.flags &= 1206910978;
		var n = e.alternate;
		return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}), e;
	}
	function Pi(e, t, n, r, a, o) {
		var s = 0;
		if (r = e, typeof r == "function") ji(r) && (s = 1);
		else if (typeof r == "string") s = qm(e, n, Ee.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
		else a: switch (r) {
			case de: return e = Ai(31, n, t, a), e.elementType = de, e.lanes = o, e;
			case O: return Fi(n.children, a, o, t);
			case k:
				s = 8, a |= 24;
				break;
			case re: return e = Ai(12, n, t, a | 2), e.elementType = re, e.lanes = o, e;
			case se: return e = Ai(13, n, t, a), e.elementType = se, e.lanes = o, e;
			case ce: return e = Ai(19, n, t, a), e.elementType = ce, e.lanes = o, e;
			case fe:
			case me: return e = a | 32, e = Ai(30, n, t, e), e.elementType = me, e.lanes = o, e.stateNode = {
				autoName: null,
				paired: null,
				clones: null,
				ref: null
			}, e;
			default:
				if (typeof r == "object" && r) switch (r.$$typeof) {
					case ae:
						s = 10;
						break a;
					case ie:
						s = 9;
						break a;
					case oe:
						s = 11;
						break a;
					case le:
						s = 14;
						break a;
					case ue:
						s = 16, r = null;
						break a;
				}
				s = 29, n = Error(i(130, e === null ? "null" : typeof e, "")), r = null;
		}
		return t = Ai(s, n, t, a), t.elementType = e, t.type = r, t.lanes = o, t;
	}
	function Fi(e, t, n, r) {
		return e = Ai(7, e, r, t), e.lanes = n, e;
	}
	function Ii(e, t, n) {
		return e = Ai(6, e, null, t), e.lanes = n, e;
	}
	function Li(e) {
		var t = Ai(18, null, null, 0);
		return t.stateNode = e, t;
	}
	function Ri(e, t, n) {
		return t = Ai(4, e.children === null ? [] : e.children, e.key, t), t.lanes = n, t.stateNode = {
			containerInfo: e.containerInfo,
			pendingChildren: null,
			implementation: e.implementation
		}, t;
	}
	var zi = /* @__PURE__ */ new WeakMap();
	function Bi(e, t) {
		if (typeof e == "object" && e) {
			var n = zi.get(e);
			return n === void 0 ? (t = {
				value: e,
				source: t,
				stack: ze(t)
			}, zi.set(e, t), t) : n;
		}
		return {
			value: e,
			source: t,
			stack: ze(t)
		};
	}
	var Vi = [], Hi = 0, Ui = null, Wi = 0, Gi = [], Ki = 0, qi = null, Ji = 1, Yi = "";
	function Xi(e, t) {
		Vi[Hi++] = Wi, Vi[Hi++] = Ui, Ui = e, Wi = t;
	}
	function Zi(e, t, n) {
		Gi[Ki++] = Ji, Gi[Ki++] = Yi, Gi[Ki++] = qi, qi = e;
		var r = Ji;
		e = Yi;
		var i = 32 - rt(r) - 1;
		r &= ~(1 << i), n += 1;
		var a = 32 - rt(t) + i;
		if (30 < a) {
			var o = i - i % 5;
			a = (r & (1 << o) - 1).toString(32), r >>= o, i -= o, Ji = 1 << 32 - rt(t) + i | n << i | r, Yi = a + e;
		} else Ji = 1 << a | n << i | r, Yi = e;
	}
	function Qi(e) {
		e.return !== null && (Xi(e, 1), Zi(e, 1, 0));
	}
	function $i(e) {
		for (; e === Ui;) Ui = Vi[--Hi], Vi[Hi] = null, Wi = Vi[--Hi], Vi[Hi] = null;
		for (; e === qi;) qi = Gi[--Ki], Gi[Ki] = null, Yi = Gi[--Ki], Gi[Ki] = null, Ji = Gi[--Ki], Gi[Ki] = null;
	}
	function ea(e, t) {
		Gi[Ki++] = Ji, Gi[Ki++] = Yi, Gi[Ki++] = qi, Ji = t.id, Yi = t.overflow, qi = e;
	}
	var ta = null, na = null, H = !1, ra = null, ia = !1, aa = Error(i(519));
	function oa(e) {
		throw fa(Bi(Error(i(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", "")), e)), aa;
	}
	function sa(e) {
		var t = e.stateNode, n = e.type, r = e.memoizedProps;
		switch (t[F] = e, t[Et] = r, n) {
			case "dialog":
				Q("cancel", t), Q("close", t);
				break;
			case "iframe":
			case "object":
			case "embed":
				Q("load", t);
				break;
			case "video":
			case "audio":
				for (n = 0; n < zf.length; n++) Q(zf[n], t);
				break;
			case "source":
				Q("error", t);
				break;
			case "img":
			case "image":
			case "link":
				Q("error", t), Q("load", t);
				break;
			case "details":
				Q("toggle", t);
				break;
			case "input":
				Q("invalid", t), on(t, r.value, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name, !0);
				break;
			case "select":
				Q("invalid", t);
				break;
			case "textarea": Q("invalid", t), ln(t, r.value, r.defaultValue, r.children);
		}
		n = r.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || !0 === r.suppressHydrationWarning || ep(t.textContent, n) ? (r.popover != null && (Q("beforetoggle", t), Q("toggle", t)), r.onScroll != null && Q("scroll", t), r.onScrollEnd != null && Q("scrollend", t), r.onClick != null && (t.onclick = vn), t = !0) : t = !1, t || oa(e, !0);
	}
	function ca(e) {
		for (ta = e.return; ta;) switch (ta.tag) {
			case 5:
			case 31:
			case 13:
				ia = !1;
				return;
			case 27:
			case 3:
				ia = !0;
				return;
			default: ta = ta.return;
		}
	}
	function la(e) {
		if (e !== ta) return !1;
		if (!H) return ca(e), H = !0, !1;
		var t = e.tag, n;
		if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = n === "form" || n === "button" || pp(e.type, e.memoizedProps)), n = !n), n && na && oa(e), ca(e), t === 13) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			na = dm(e);
		} else if (t === 31) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			na = dm(e);
		} else t === 27 ? (t = na, Sp(e.type) ? (e = um, um = null, na = e) : na = t) : na = ta ? lm(e.stateNode.nextSibling) : null;
		return !0;
	}
	function ua() {
		na = ta = null, H = !1;
	}
	function da() {
		var e = ra;
		return e !== null && (fd === null ? fd = e : fd.push.apply(fd, e), ra = null), e;
	}
	function fa(e) {
		ra === null ? ra = [e] : ra.push(e);
	}
	var pa = we(null), ma = null, ha = null;
	function ga(e, t, n) {
		M(pa, t._currentValue), t._currentValue = n;
	}
	function _a(e) {
		e._currentValue = pa.current, Te(pa);
	}
	function va(e, t, n) {
		for (; e !== null;) {
			var r = e.alternate;
			if ((e.childLanes & t) === t ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t) : (e.childLanes |= t, r !== null && (r.childLanes |= t)), e === n) break;
			e = e.return;
		}
	}
	function ya(e, t, n, r) {
		var a = e.child;
		for (a !== null && (a.return = e); a !== null;) {
			var o = a.dependencies;
			if (o !== null) {
				var s = a.child;
				o = o.firstContext;
				a: for (; o !== null;) {
					var c = o;
					o = a;
					for (var l = 0; l < t.length; l++) if (c.context === t[l]) {
						o.lanes |= n, c = o.alternate, c !== null && (c.lanes |= n), va(o.return, n, e), r || (s = null);
						break a;
					}
					o = c.next;
				}
			} else if (a.tag === 18) {
				if (s = a.return, s === null) throw Error(i(341));
				s.lanes |= n, o = s.alternate, o !== null && (o.lanes |= n), va(s, n, e), s = null;
			} else a.tag === 13 && a.memoizedState !== null && a.memoizedState.dehydrated === null ? (a.lanes |= n, s = a.alternate, s !== null && (s.lanes |= n), va(a.return, n, e), s = a.child, s = s === null ? null : s.sibling) : s = a.child;
			if (s !== null) s.return = a;
			else for (s = a; s !== null;) {
				if (s === e) {
					s = null;
					break;
				}
				if (a = s.sibling, a !== null) {
					a.return = s.return, s = a;
					break;
				}
				s = s.return;
			}
			a = s;
		}
	}
	function ba(e, t, n, r) {
		e = null;
		for (var a = t, o = !1; a !== null;) {
			if (!o) {
				if (a.flags & 524288) o = !0;
				else if (a.flags & 262144) break;
			}
			if (a.tag === 10) {
				var s = a.alternate;
				if (s === null) throw Error(i(387));
				if (s = s.memoizedProps, s !== null) {
					var c = a.type;
					zr(a.pendingProps.value, s.value) || (e === null ? e = [c] : e.push(c));
				}
			} else if (a === ke.current) {
				if (s = a.alternate, s === null) throw Error(i(387));
				s.memoizedState.memoizedState !== a.memoizedState.memoizedState && (e === null ? e = [sh] : e.push(sh));
			}
			a = a.return;
		}
		return e !== null && ya(t, e, n, r), t.flags |= 262144, e !== null;
	}
	function xa(e) {
		for (e = e.firstContext; e !== null;) {
			if (!zr(e.context._currentValue, e.memoizedValue)) return !0;
			e = e.next;
		}
		return !1;
	}
	function Sa(e) {
		ma = e, ha = null, e = e.dependencies, e !== null && (e.firstContext = null);
	}
	function Ca(e) {
		return Ta(ma, e);
	}
	function wa(e, t) {
		return ma === null && Sa(e), Ta(e, t);
	}
	function Ta(e, t) {
		var n = t._currentValue;
		if (t = {
			context: t,
			memoizedValue: n,
			next: null
		}, ha === null) {
			if (e === null) throw Error(i(308));
			ha = t, e.dependencies = {
				lanes: 0,
				firstContext: t
			}, e.flags |= 524288;
		} else ha = ha.next = t;
		return n;
	}
	var Ea = typeof AbortController < "u" ? AbortController : function() {
		var e = [], t = this.signal = {
			aborted: !1,
			addEventListener: function(t, n) {
				e.push(n);
			}
		};
		this.abort = function() {
			t.aborted = !0, e.forEach(function(e) {
				return e();
			});
		};
	}, Da = t.unstable_scheduleCallback, Oa = t.unstable_NormalPriority, ka = {
		$$typeof: ae,
		Consumer: null,
		Provider: null,
		_currentValue: null,
		_currentValue2: null,
		_threadCount: 0
	};
	function Aa() {
		return {
			controller: new Ea(),
			data: /* @__PURE__ */ new Map(),
			refCount: 0
		};
	}
	function ja(e) {
		e.refCount--, e.refCount === 0 && Da(Oa, function() {
			e.controller.abort();
		});
	}
	function Ma(e, t) {
		if (e.pendingLanes & 4194048) {
			var n = e.transitionTypes;
			for (n === null && (n = e.transitionTypes = []), e = 0; e < t.length; e++) {
				var r = t[e];
				n.indexOf(r) === -1 && n.push(r);
			}
		}
	}
	var Na = null;
	function Pa(e) {
		var t = e.transitionTypes;
		return e.transitionTypes = null, t;
	}
	var Fa = null, Ia = 0, La = 0, Ra = null;
	function za(e, t) {
		if (Fa === null) {
			var n = Fa = [];
			Ia = 0, La = Pf(), Ra = {
				status: "pending",
				value: void 0,
				then: function(e) {
					n.push(e);
				}
			};
		}
		return Ia++, t.then(Ba, Ba), t;
	}
	function Ba() {
		if (--Ia === 0 && (Na = null, Fa !== null)) {
			Ra !== null && (Ra.status = "fulfilled");
			var e = Fa;
			Fa = null, La = 0, Ra = null;
			for (var t = 0; t < e.length; t++) (0, e[t])();
		}
	}
	function Va(e, t) {
		var n = [], r = {
			status: "pending",
			value: null,
			reason: null,
			then: function(e) {
				n.push(e);
			}
		};
		return e.then(function() {
			r.status = "fulfilled", r.value = t;
			for (var e = 0; e < n.length; e++) (0, n[e])(t);
		}, function(e) {
			for (r.status = "rejected", r.reason = e, e = 0; e < n.length; e++) (0, n[e])(void 0);
		}), r;
	}
	var Ha = A.S;
	A.S = function(e, t) {
		if (hd = Ge(), typeof t == "object" && t && typeof t.then == "function" && za(e, t), Na !== null) for (var n = bf; n !== null;) Ma(n, Na), n = n.next;
		if (n = e.types, n !== null) {
			for (var r = bf; r !== null;) Ma(r, n), r = r.next;
			if (La !== 0) {
				r = Na, r === null && (r = Na = []);
				for (var i = 0; i < n.length; i++) {
					var a = n[i];
					r.indexOf(a) === -1 && r.push(a);
				}
			}
		}
		Ha !== null && Ha(e, t);
	};
	var Ua = we(null);
	function Wa() {
		var e = Ua.current;
		return e === null ? q.pooledCache : e;
	}
	function Ga(e, t) {
		t === null ? M(Ua, Ua.current) : M(Ua, t.pool);
	}
	function Ka() {
		var e = Wa();
		return e === null ? null : {
			parent: ka._currentValue,
			pool: e
		};
	}
	var qa = Error(i(460)), Ja = Error(i(474)), Ya = Error(i(542)), Xa = { then: function() {} };
	function Za(e) {
		return e = e.status, e === "fulfilled" || e === "rejected";
	}
	function Qa(e, t, n) {
		switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(vn, vn), t = n), t.status) {
			case "fulfilled": return t.value;
			case "rejected": throw e = t.reason, no(e), e === void 0 && !("reason" in t) ? Error(i(600)) : e;
			default:
				if (typeof t.status == "string") t.then(vn, vn);
				else {
					if (e = q, e !== null && 100 < e.shellSuspendCounter) throw Error(i(482));
					e = t, e.status = "pending", e.then(function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "fulfilled", n.value = e;
						}
					}, function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "rejected", n.reason = e;
						}
					});
				}
				switch (t.status) {
					case "fulfilled": return t.value;
					case "rejected": throw e = t.reason, no(e), e;
				}
				throw eo = t, qa;
		}
	}
	function $a(e) {
		try {
			var t = e._init;
			return t(e._payload);
		} catch (e) {
			throw typeof e == "object" && e && typeof e.then == "function" ? (eo = e, qa) : e;
		}
	}
	var eo = null;
	function to() {
		if (eo === null) throw Error(i(459));
		var e = eo;
		return eo = null, e;
	}
	function no(e) {
		if (e === qa || e === Ya) throw Error(i(483));
	}
	var ro = null, io = 0;
	function ao(e) {
		var t = io;
		return io += 1, ro === null && (ro = []), Qa(ro, e, t);
	}
	function oo(e, t) {
		t = t.props.ref, e.ref = t === void 0 ? null : t;
	}
	function so(e, t) {
		throw t.$$typeof === te ? Error(i(525)) : (e = Object.prototype.toString.call(t), Error(i(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
	}
	function co(e) {
		function t(t, n) {
			if (e) {
				var r = t.deletions;
				r === null ? (t.deletions = [n], t.flags |= 16) : r.push(n);
			}
		}
		function n(n, r) {
			if (!e) return null;
			for (; r !== null;) t(n, r), r = r.sibling;
			return null;
		}
		function r(e) {
			for (var t = /* @__PURE__ */ new Map(); e !== null;) e.key === null ? t.set(e.index, e) : t.set(e.key, e), e = e.sibling;
			return t;
		}
		function a(e, t) {
			return e = Mi(e, t), e.index = 0, e.sibling = null, e;
		}
		function o(t, n, r) {
			return t.index = r, e ? (r = t.alternate, r === null ? (t.flags |= 134217730, n) : (r = r.index, r < n ? (t.flags |= 2, n) : r)) : (t.flags |= 1048576, n);
		}
		function s(t) {
			return e && t.alternate === null && (t.flags |= 134217730), t;
		}
		function c(e, t, n, r) {
			return t === null || t.tag !== 6 ? (t = Ii(n, e.mode, r), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function l(e, t, n, r) {
			var i = n.type;
			return i === O ? (e = d(e, t, n.props.children, r, n.key), oo(e, n), e) : t !== null && (t.elementType === i || typeof i == "object" && i && i.$$typeof === ue && $a(i) === t.type) ? (t = a(t, n.props), oo(t, n), t.return = e, t) : (t = Pi(n.type, n.key, n.props, null, e.mode, r), oo(t, n), t.return = e, t);
		}
		function u(e, t, n, r) {
			return t === null || t.tag !== 4 || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? (t = Ri(n, e.mode, r), t.return = e, t) : (t = a(t, n.children || []), t.return = e, t);
		}
		function d(e, t, n, r, i) {
			return t === null || t.tag !== 7 ? (t = Fi(n, e.mode, r, i), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function f(e, t, n) {
			if (typeof t == "string" && t !== "" || typeof t == "number" || typeof t == "bigint") return t = Ii("" + t, e.mode, n), t.return = e, t;
			if (typeof t == "object" && t) {
				switch (t.$$typeof) {
					case ne: return n = Pi(t.type, t.key, t.props, null, e.mode, n), oo(n, t), n.return = e, n;
					case D: return t = Ri(t, e.mode, n), t.return = e, t;
					case ue: return t = $a(t), f(e, t, n);
				}
				if (be(t) || _e(t)) return t = Fi(t, e.mode, n, null), t.return = e, t;
				if (typeof t.then == "function") return f(e, ao(t), n);
				if (t.$$typeof === ae) return f(e, wa(e, t), n);
				so(e, t);
			}
			return null;
		}
		function p(e, t, n, r) {
			var i = t === null ? null : t.key;
			if (typeof n == "string" && n !== "" || typeof n == "number" || typeof n == "bigint") return i === null ? c(e, t, "" + n, r) : null;
			if (typeof n == "object" && n) {
				switch (n.$$typeof) {
					case ne: return n.key === i ? l(e, t, n, r) : null;
					case D: return n.key === i ? u(e, t, n, r) : null;
					case ue: return n = $a(n), p(e, t, n, r);
				}
				if (be(n) || _e(n)) return i === null ? d(e, t, n, r, null) : null;
				if (typeof n.then == "function") return p(e, t, ao(n), r);
				if (n.$$typeof === ae) return p(e, t, wa(e, n), r);
				so(e, n);
			}
			return null;
		}
		function m(e, t, n, r, i) {
			if (typeof r == "string" && r !== "" || typeof r == "number" || typeof r == "bigint") return e = e.get(n) || null, c(t, e, "" + r, i);
			if (typeof r == "object" && r) {
				switch (r.$$typeof) {
					case ne: return e = e.get(r.key === null ? n : r.key) || null, l(t, e, r, i);
					case D: return e = e.get(r.key === null ? n : r.key) || null, u(t, e, r, i);
					case ue: return r = $a(r), m(e, t, n, r, i);
				}
				if (be(r) || _e(r)) return e = e.get(n) || null, d(t, e, r, i, null);
				if (typeof r.then == "function") return m(e, t, n, ao(r), i);
				if (r.$$typeof === ae) return m(e, t, n, wa(t, r), i);
				so(t, r);
			}
			return null;
		}
		function h(i, a, s, c) {
			for (var l = null, u = null, d = a, h = a = 0, g = null; d !== null && h < s.length; h++) {
				d.index > h ? (g = d, d = null) : g = d.sibling;
				var _ = p(i, d, s[h], c);
				if (_ === null) {
					d === null && (d = g);
					break;
				}
				e && d && _.alternate === null && t(i, d), a = o(_, a, h), u === null ? l = _ : u.sibling = _, u = _, d = g;
			}
			if (h === s.length) return n(i, d), H && Xi(i, h), l;
			if (d === null) {
				for (; h < s.length; h++) d = f(i, s[h], c), d !== null && (a = o(d, a, h), u === null ? l = d : u.sibling = d, u = d);
				return H && Xi(i, h), l;
			}
			for (d = r(d); h < s.length; h++) g = m(d, i, h, s[h], c), g !== null && (e && (_ = g.alternate, _ !== null && d.delete(_.key === null ? h : _.key)), a = o(g, a, h), u === null ? l = g : u.sibling = g, u = g);
			return e && d.forEach(function(e) {
				return t(i, e);
			}), H && Xi(i, h), l;
		}
		function g(a, s, c, l) {
			if (c == null) throw Error(i(151));
			for (var u = null, d = null, h = s, g = s = 0, _ = null, v = c.next(); h !== null && !v.done; g++, v = c.next()) {
				h.index > g ? (_ = h, h = null) : _ = h.sibling;
				var y = p(a, h, v.value, l);
				if (y === null) {
					h === null && (h = _);
					break;
				}
				e && h && y.alternate === null && t(a, h), s = o(y, s, g), d === null ? u = y : d.sibling = y, d = y, h = _;
			}
			if (v.done) return n(a, h), H && Xi(a, g), u;
			if (h === null) {
				for (; !v.done; g++, v = c.next()) v = f(a, v.value, l), v !== null && (s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
				return H && Xi(a, g), u;
			}
			for (h = r(h); !v.done; g++, v = c.next()) v = m(h, a, g, v.value, l), v !== null && (e && (_ = v.alternate, _ !== null && h.delete(_.key === null ? g : _.key)), s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
			return e && h.forEach(function(e) {
				return t(a, e);
			}), H && Xi(a, g), u;
		}
		function _(e, r, o, c) {
			if (typeof o == "object" && o && o.type === O && o.key === null && o.props.ref === void 0 && (o = o.props.children), typeof o == "object" && o) {
				switch (o.$$typeof) {
					case ne:
						a: {
							for (var l = o.key; r !== null;) {
								if (r.key === l) {
									if (l = o.type, l === O) {
										if (r.tag === 7) {
											n(e, r.sibling), c = a(r, o.props.children), oo(c, o), c.return = e, e = c;
											break a;
										}
									} else if (r.elementType === l || typeof l == "object" && l && l.$$typeof === ue && $a(l) === r.type) {
										n(e, r.sibling), c = a(r, o.props), oo(c, o), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							o.type === O ? (c = Fi(o.props.children, e.mode, c, o.key), oo(c, o), c.return = e, e = c) : (c = Pi(o.type, o.key, o.props, null, e.mode, c), oo(c, o), c.return = e, e = c);
						}
						return s(e);
					case D:
						a: {
							for (l = o.key; r !== null;) {
								if (r.key === l) {
									if (r.tag === 4 && r.stateNode.containerInfo === o.containerInfo && r.stateNode.implementation === o.implementation) {
										n(e, r.sibling), c = a(r, o.children || []), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							c = Ri(o, e.mode, c), c.return = e, e = c;
						}
						return s(e);
					case ue: return o = $a(o), _(e, r, o, c);
				}
				if (be(o)) return h(e, r, o, c);
				if (_e(o)) {
					if (l = _e(o), typeof l != "function") throw Error(i(150));
					return o = l.call(o), g(e, r, o, c);
				}
				if (typeof o.then == "function") return _(e, r, ao(o), c);
				if (o.$$typeof === ae) return _(e, r, wa(e, o), c);
				so(e, o);
			}
			return typeof o == "string" && o !== "" || typeof o == "number" || typeof o == "bigint" ? (o = "" + o, r !== null && r.tag === 6 ? (n(e, r.sibling), c = a(r, o), c.return = e, e = c) : (n(e, r), c = Ii(o, e.mode, c), c.return = e, e = c), s(e)) : n(e, r);
		}
		return function(e, t, n, r) {
			try {
				io = 0;
				var i = _(e, t, n, r);
				return ro = null, i;
			} catch (t) {
				if (t === qa || t === Ya) throw t;
				var a = Ai(29, t, null, e.mode);
				return a.lanes = r, a.return = e, a;
			}
		};
	}
	var lo = co(!0), uo = co(!1), fo = !1;
	function po(e) {
		e.updateQueue = {
			baseState: e.memoizedState,
			firstBaseUpdate: null,
			lastBaseUpdate: null,
			shared: {
				pending: null,
				lanes: 0,
				hiddenCallbacks: null
			},
			callbacks: null
		};
	}
	function mo(e, t) {
		e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
			baseState: e.baseState,
			firstBaseUpdate: e.firstBaseUpdate,
			lastBaseUpdate: e.lastBaseUpdate,
			shared: e.shared,
			callbacks: null
		});
	}
	function ho(e) {
		return {
			lane: e,
			tag: 0,
			payload: null,
			callback: null,
			next: null
		};
	}
	function go(e, t, n) {
		var r = e.updateQueue;
		if (r === null) return null;
		if (r = r.shared, K & 2) {
			var i = r.pending;
			return i === null ? t.next = t : (t.next = i.next, i.next = t), r.pending = t, t = Di(e), Ei(e, null, n), t;
		}
		return Ci(e, r, t, n), Di(e);
	}
	function _o(e, t, n) {
		if (t = t.updateQueue, t !== null && (t = t.shared, n & 4194048)) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, bt(e, n);
		}
	}
	function vo(e, t) {
		var n = e.updateQueue, r = e.alternate;
		if (r !== null && (r = r.updateQueue, n === r)) {
			var i = null, a = null;
			if (n = n.firstBaseUpdate, n !== null) {
				do {
					var o = {
						lane: n.lane,
						tag: n.tag,
						payload: n.payload,
						callback: null,
						next: null
					};
					a === null ? i = a = o : a = a.next = o, n = n.next;
				} while (n !== null);
				a === null ? i = a = t : a = a.next = t;
			} else i = a = t;
			n = {
				baseState: r.baseState,
				firstBaseUpdate: i,
				lastBaseUpdate: a,
				shared: r.shared,
				callbacks: r.callbacks
			}, e.updateQueue = n;
		} else e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
	}
	var yo = !1;
	function bo() {
		if (yo) {
			var e = Ra;
			if (e !== null) throw e;
		}
	}
	function xo(e, t, n, r) {
		yo = !1;
		var i = e.updateQueue;
		fo = !1;
		var a = i.firstBaseUpdate, o = i.lastBaseUpdate, s = i.shared.pending;
		if (s !== null) {
			i.shared.pending = null;
			var c = s, l = c.next;
			c.next = null, o === null ? a = l : o.next = l, o = c;
			var u = e.alternate;
			u !== null && (u = u.updateQueue, s = u.lastBaseUpdate, s !== o && (s === null ? u.firstBaseUpdate = l : s.next = l, u.lastBaseUpdate = c));
		}
		if (a !== null) {
			var d = i.baseState;
			o = 0, u = l = c = null, s = a;
			do {
				var f = s.lane & -536870913, p = f !== s.lane;
				if (p ? (Y & f) === f : (r & f) === f) {
					f !== 0 && f === La && (yo = !0), u !== null && (u = u.next = {
						lane: 0,
						tag: s.tag,
						payload: s.payload,
						callback: null,
						next: null
					});
					a: {
						var m = e, h = s;
						f = t;
						var g = n;
						switch (h.tag) {
							case 1:
								if (m = h.payload, typeof m == "function") {
									d = m.call(g, d, f);
									break a;
								}
								d = m;
								break a;
							case 3: m.flags = m.flags & -65537 | 128;
							case 0:
								if (m = h.payload, f = typeof m == "function" ? m.call(g, d, f) : m, f == null) break a;
								d = E({}, d, f);
								break a;
							case 2: fo = !0;
						}
					}
					f = s.callback, f !== null && (e.flags |= 64, p && (e.flags |= 8192), p = i.callbacks, p === null ? i.callbacks = [f] : p.push(f));
				} else p = {
					lane: f,
					tag: s.tag,
					payload: s.payload,
					callback: s.callback,
					next: null
				}, u === null ? (l = u = p, c = d) : u = u.next = p, o |= f;
				if (s = s.next, s === null) {
					if (s = i.shared.pending, s === null) break;
					p = s, s = p.next, p.next = null, i.lastBaseUpdate = p, i.shared.pending = null;
				}
			} while (1);
			u === null && (c = d), i.baseState = c, i.firstBaseUpdate = l, i.lastBaseUpdate = u, a === null && (i.shared.lanes = 0), od |= o, e.lanes = o, e.memoizedState = d;
		}
	}
	function So(e, t) {
		if (typeof e != "function") throw Error(i(191, e));
		e.call(t);
	}
	function Co(e, t) {
		var n = e.callbacks;
		if (n !== null) for (e.callbacks = null, e = 0; e < n.length; e++) So(n[e], t);
	}
	var wo = we(null), To = we(0);
	function Eo(e, t) {
		e = id, M(To, e), M(wo, t), id = e | t.baseLanes;
	}
	function Do() {
		M(To, id), M(wo, wo.current);
	}
	function Oo() {
		id = To.current, Te(wo), Te(To);
	}
	var ko = we(null), Ao = null;
	function jo(e) {
		var t = e.alternate;
		M(Io, Io.current & 1), M(ko, e), Ao === null && (t === null || wo.current !== null || t.memoizedState !== null) && (Ao = e);
	}
	function Mo(e) {
		M(Io, Io.current), M(ko, e), Ao === null && (Ao = e);
	}
	function No(e) {
		e.tag === 22 ? (M(Io, Io.current), M(ko, e), Ao === null && (Ao = e)) : Po();
	}
	function Po() {
		M(Io, Io.current), M(ko, ko.current);
	}
	function Fo(e) {
		Te(ko), Ao === e && (Ao = null), Te(Io);
	}
	var Io = we(0);
	function Lo(e, t) {
		M(ko, ko.current), M(Io, t);
	}
	function Ro(e) {
		Te(Io), Te(ko), Ao === e && (Ao = null);
	}
	function zo(e) {
		for (var t = e; t !== null;) {
			if (t.tag === 13) {
				var n = t.memoizedState;
				if (n !== null && (n = n.dehydrated, n === null || om(n) || sm(n))) return t;
			} else if (t.tag === 19 && t.memoizedProps.revealOrder !== "independent") {
				if (t.flags & 128) return t;
			} else if (t.child !== null) {
				t.child.return = t, t = t.child;
				continue;
			}
			if (t === e) break;
			for (; t.sibling === null;) {
				if (t.return === null || t.return === e) return null;
				t = t.return;
			}
			t.sibling.return = t.return, t = t.sibling;
		}
		return null;
	}
	var Bo = 0, U = null, W = null, Vo = null, Ho = !1, Uo = !1, Wo = !1, Go = 0, Ko = 0, qo = null, Jo = 0;
	function Yo() {
		throw Error(i(321));
	}
	function Xo(e, t) {
		if (t === null) return !1;
		for (var n = 0; n < t.length && n < e.length; n++) if (!zr(e[n], t[n])) return !1;
		return !0;
	}
	function Zo(e, t, n, r, i, a) {
		return Bo = a, U = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, A.H = e === null || e.memoizedState === null ? mc : hc, Wo = !1, a = n(r, i), Wo = !1, Uo && (a = $o(t, n, r, i)), Qo(e), a;
	}
	function Qo(e) {
		A.H = pc;
		var t = W !== null && W.next !== null;
		if (Bo = 0, Vo = W = U = null, Ho = !1, Ko = 0, qo = null, t) throw Error(i(300));
		e === null || Mc || (e = e.dependencies, e !== null && xa(e) && (Mc = !0));
	}
	function $o(e, t, n, r) {
		U = e;
		var a = 0;
		do {
			if (Uo && (qo = null), Ko = 0, Uo = !1, 25 <= a) throw Error(i(301));
			if (a += 1, Vo = W = null, e.updateQueue != null) {
				var o = e.updateQueue;
				o.lastEffect = null, o.events = null, o.stores = null, o.memoCache != null && (o.memoCache.index = 0);
			}
			A.H = gc, o = t(n, r);
		} while (Uo);
		return o;
	}
	function es() {
		var e = A.H, t = e.useState()[0];
		return t = typeof t.then == "function" ? ss(t) : t, e = e.useState()[0], (W === null ? null : W.memoizedState) !== e && (U.flags |= 1024), t;
	}
	function ts() {
		var e = Go !== 0;
		return Go = 0, e;
	}
	function ns(e, t, n) {
		t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
	}
	function rs(e) {
		if (Ho) {
			for (e = e.memoizedState; e !== null;) {
				var t = e.queue;
				t !== null && (t.pending = null), e = e.next;
			}
			Ho = !1;
		}
		Bo = 0, Vo = W = U = null, Uo = !1, Ko = Go = 0, qo = null;
	}
	function is() {
		var e = {
			memoizedState: null,
			baseState: null,
			baseQueue: null,
			queue: null,
			next: null
		};
		return Vo === null ? U.memoizedState = Vo = e : Vo = Vo.next = e, Vo;
	}
	function as() {
		if (W === null) {
			var e = U.alternate;
			e = e === null ? null : e.memoizedState;
		} else e = W.next;
		var t = Vo === null ? U.memoizedState : Vo.next;
		if (t !== null) Vo = t, W = e;
		else {
			if (e === null) throw U.alternate === null ? Error(i(467)) : Error(i(310));
			W = e, e = {
				memoizedState: W.memoizedState,
				baseState: W.baseState,
				baseQueue: W.baseQueue,
				queue: W.queue,
				next: null
			}, Vo === null ? U.memoizedState = Vo = e : Vo = Vo.next = e;
		}
		return Vo;
	}
	function os() {
		return {
			lastEffect: null,
			events: null,
			stores: null,
			memoCache: null
		};
	}
	function ss(e) {
		var t = Ko;
		return Ko += 1, qo === null && (qo = []), e = Qa(qo, e, t), t = U, (Vo === null ? t.memoizedState : Vo.next) === null && (t = t.alternate, A.H = t === null || t.memoizedState === null ? mc : hc), e;
	}
	function cs(e) {
		if (typeof e == "object" && e) {
			if (typeof e.then == "function") return ss(e);
			if (e.$$typeof === he) return;
			if (e.$$typeof === ae) return Ca(e);
		}
		throw Error(i(438, String(e)));
	}
	function ls(e) {
		var t = null, n = U.updateQueue;
		if (n !== null && (t = n.memoCache), t == null) {
			var r = U.alternate;
			r !== null && (r = r.updateQueue, r !== null && (r = r.memoCache, r != null && (t = {
				data: r.data.map(function(e) {
					return e.slice();
				}),
				index: 0
			})));
		}
		if (t ??= {
			data: [],
			index: 0
		}, n === null && (n = os(), U.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0) for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = pe;
		return t.index++, n;
	}
	function us(e, t) {
		return typeof t == "function" ? t(e) : t;
	}
	function ds(e) {
		return fs(as(), W, e);
	}
	function fs(e, t, n) {
		var r = e.queue;
		if (r === null) throw Error(i(311));
		r.lastRenderedReducer = n;
		var a = e.baseQueue, o = r.pending;
		if (o !== null) {
			if (a !== null) {
				var s = a.next;
				a.next = o.next, o.next = s;
			}
			t.baseQueue = a = o, r.pending = null;
		}
		if (o = e.baseState, a === null) e.memoizedState = o;
		else {
			t = a.next;
			var c = s = null, l = null, u = t, d = !1;
			do {
				var f = u.lane & -536870913;
				if (f === u.lane ? (Bo & f) === f : (Y & f) === f) {
					var p = u.revertLane;
					if (p === 0) l !== null && (l = l.next = {
						lane: 0,
						revertLane: 0,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}), f === La && (d = !0);
					else if ((Bo & p) === p) {
						u = u.next, p === La && (d = !0);
						continue;
					} else f = {
						lane: 0,
						revertLane: u.revertLane,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}, l === null ? (c = l = f, s = o) : l = l.next = f, U.lanes |= p, od |= p;
					f = u.action, Wo && n(o, f), o = u.hasEagerState ? u.eagerState : n(o, f);
				} else p = {
					lane: f,
					revertLane: u.revertLane,
					gesture: u.gesture,
					action: u.action,
					hasEagerState: u.hasEagerState,
					eagerState: u.eagerState,
					next: null
				}, l === null ? (c = l = p, s = o) : l = l.next = p, U.lanes |= f, od |= f;
				u = u.next;
			} while (u !== null && u !== t);
			if (l === null ? s = o : l.next = c, !zr(o, e.memoizedState) && (Mc = !0, d && (n = Ra, n !== null))) throw n;
			e.memoizedState = o, e.baseState = s, e.baseQueue = l, r.lastRenderedState = o;
		}
		return a === null && (r.lanes = 0), [e.memoizedState, r.dispatch];
	}
	function ps(e) {
		var t = as(), n = t.queue;
		if (n === null) throw Error(i(311));
		n.lastRenderedReducer = e;
		var r = n.dispatch, a = n.pending, o = t.memoizedState;
		if (a !== null) {
			n.pending = null;
			var s = a = a.next;
			do
				o = e(o, s.action), s = s.next;
			while (s !== a);
			zr(o, t.memoizedState) || (Mc = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
		}
		return [o, r];
	}
	function ms(e, t, n) {
		var r = U, a = as(), o = H;
		if (o) {
			if (n === void 0) throw Error(i(407));
			n = n();
		} else n = t();
		var s = !zr((W || a).memoizedState, n);
		if (s && (a.memoizedState = n, Mc = !0), a = a.queue, zs(_s.bind(null, r, a, e), [e]), e = a.getSnapshot !== t || s || Vo !== null && !!(Vo.memoizedState.tag & 1), Ps(e ? 9 : 8, { destroy: void 0 }, gs.bind(null, r, a, n, t), null), e) {
			if (r.flags |= 2048, q === null) throw Error(i(349));
			o || Bo & 127 || hs(r, t, n);
		}
		return n;
	}
	function hs(e, t, n) {
		e.flags |= 16384, e = {
			getSnapshot: t,
			value: n
		}, t = U.updateQueue, t === null ? (t = os(), U.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
	}
	function gs(e, t, n, r) {
		t.value = n, t.getSnapshot = r, vs(t) && ys(e);
	}
	function _s(e, t, n) {
		return n(function() {
			vs(t) && ys(e);
		});
	}
	function vs(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !zr(e, n);
		} catch {
			return !0;
		}
	}
	function ys(e) {
		var t = Ti(e, 2);
		t !== null && Pd(t, e, 2);
	}
	function bs(e) {
		var t = is();
		if (typeof e == "function") {
			var n = e;
			if (e = n(), Wo) {
				nt(!0);
				try {
					n();
				} finally {
					nt(!1);
				}
			}
		}
		return t.memoizedState = t.baseState = e, t.queue = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: us,
			lastRenderedState: e
		}, t;
	}
	function xs(e, t, n, r) {
		return e.baseState = n, fs(e, W, typeof r == "function" ? r : us);
	}
	function Ss(e, t, n, r, a) {
		if (uc(e)) throw Error(i(485));
		if (e = t.action, e !== null) {
			var o = {
				payload: a,
				action: e,
				next: null,
				isTransition: !0,
				status: "pending",
				value: null,
				reason: null,
				listeners: [],
				then: function(e) {
					o.listeners.push(e);
				}
			};
			A.T === null ? o.isTransition = !1 : n(!0), r(o), n = t.pending, n === null ? (o.next = t.pending = o, Cs(t, o)) : (o.next = n.next, t.pending = n.next = o);
		}
	}
	function Cs(e, t) {
		var n = t.action, r = t.payload, i = e.state;
		if (t.isTransition) {
			var a = A.T, o = {};
			o.types = a === null ? null : a.types, A.T = o;
			try {
				var s = n(i, r), c = A.S;
				c !== null && c(o, s), ws(e, t, s);
			} catch (n) {
				Es(e, t, n);
			} finally {
				a !== null && o.types !== null && (a.types = o.types), A.T = a;
			}
		} else try {
			a = n(i, r), ws(e, t, a);
		} catch (n) {
			Es(e, t, n);
		}
	}
	function ws(e, t, n) {
		typeof n == "object" && n && typeof n.then == "function" ? n.then(function(n) {
			Ts(e, t, n);
		}, function(n) {
			return Es(e, t, n);
		}) : Ts(e, t, n);
	}
	function Ts(e, t, n) {
		t.status = "fulfilled", t.value = n, Ds(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, Cs(e, n)));
	}
	function Es(e, t, n) {
		var r = e.pending;
		if (e.pending = null, r !== null) {
			r = r.next;
			do
				t.status = "rejected", t.reason = n, Ds(t), t = t.next;
			while (t !== r);
		}
		e.action = null;
	}
	function Ds(e) {
		e = e.listeners;
		for (var t = 0; t < e.length; t++) (0, e[t])();
	}
	function Os(e, t) {
		return t;
	}
	function ks(e, t) {
		if (H) {
			var n = q.formState;
			if (n !== null) {
				a: {
					var r = U;
					if (H) {
						if (na) {
							b: {
								for (var i = na, a = ia; i.nodeType !== 8;) if (!a || (i = lm(i.nextSibling), i === null)) {
									i = null;
									break b;
								}
								a = i.data, i = a === "F!" || a === "F" ? i : null;
							}
							if (i) {
								na = lm(i.nextSibling), r = i.data === "F!";
								break a;
							}
						}
						oa(r);
					}
					r = !1;
				}
				r && (t = n[0]);
			}
		}
		return n = is(), n.memoizedState = n.baseState = t, r = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: Os,
			lastRenderedState: t
		}, n.queue = r, n = sc.bind(null, U, r), r.dispatch = n, r = bs(!1), a = lc.bind(null, U, !1, r.queue), r = is(), i = {
			state: t,
			dispatch: null,
			action: e,
			pending: null
		}, r.queue = i, n = Ss.bind(null, U, i, a, n), i.dispatch = n, r.memoizedState = e, [
			t,
			n,
			!1
		];
	}
	function As(e) {
		return js(as(), W, e);
	}
	function js(e, t, n) {
		if (t = fs(e, t, Os)[0], e = ds(us)[0], typeof t == "object" && t && typeof t.then == "function") try {
			var r = ss(t);
		} catch (e) {
			throw e === qa ? Ya : e;
		}
		else r = t;
		t = as();
		var i = t.queue, a = i.dispatch;
		return n !== t.memoizedState && (U.flags |= 2048, Ps(9, { destroy: void 0 }, Ms.bind(null, i, n), null)), [
			r,
			a,
			e
		];
	}
	function Ms(e, t) {
		e.action = t;
	}
	function Ns(e) {
		var t = as(), n = W;
		if (n !== null) return js(t, n, e);
		as(), t = t.memoizedState, n = as();
		var r = n.queue.dispatch;
		return n.memoizedState = e, [
			t,
			r,
			!1
		];
	}
	function Ps(e, t, n, r) {
		return e = {
			tag: e,
			create: n,
			deps: r,
			inst: t,
			next: null
		}, t = U.updateQueue, t === null && (t = os(), U.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e), e;
	}
	function Fs() {
		return as().memoizedState;
	}
	function Is(e, t, n, r) {
		var i = is();
		U.flags |= e, i.memoizedState = Ps(1 | t, { destroy: void 0 }, n, r === void 0 ? null : r);
	}
	function Ls(e, t, n, r) {
		var i = as();
		r = r === void 0 ? null : r;
		var a = i.memoizedState.inst;
		W !== null && r !== null && Xo(r, W.memoizedState.deps) ? i.memoizedState = Ps(t, a, n, r) : (U.flags |= e, i.memoizedState = Ps(1 | t, a, n, r));
	}
	function Rs(e, t) {
		Is(8390656, 8, e, t);
	}
	function zs(e, t) {
		Ls(2048, 8, e, t);
	}
	function Bs(e) {
		U.flags |= 4;
		var t = U.updateQueue;
		if (t === null) t = os(), U.updateQueue = t, t.events = [e];
		else {
			var n = t.events;
			n === null ? t.events = [e] : n.push(e);
		}
	}
	function Vs(e) {
		var t = as().memoizedState;
		return Bs({
			ref: t,
			nextImpl: e
		}), function() {
			if (K & 2) throw Error(i(440));
			return t.impl.apply(void 0, arguments);
		};
	}
	function Hs(e, t) {
		return Ls(4, 2, e, t);
	}
	function Us(e, t) {
		return Ls(4, 4, e, t);
	}
	function Ws(e, t) {
		if (typeof t == "function") {
			e = e();
			var n = t(e);
			return function() {
				typeof n == "function" ? n() : t(null);
			};
		}
		if (t != null) return e = e(), t.current = e, function() {
			t.current = null;
		};
	}
	function Gs(e, t, n) {
		n = n == null ? null : n.concat([e]), Ls(4, 4, Ws.bind(null, t, e), n);
	}
	function Ks() {}
	function qs(e, t) {
		var n = as();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		return t !== null && Xo(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
	}
	function Js(e, t) {
		var n = as();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		if (t !== null && Xo(t, r[1])) return r[0];
		if (r = e(), Wo) {
			nt(!0);
			try {
				e();
			} finally {
				nt(!1);
			}
		}
		return n.memoizedState = [r, t], r;
	}
	function Ys(e, t, n) {
		return n === void 0 || Bo & 1073741824 && !(Y & 261930) ? e.memoizedState = t : (e.memoizedState = n, e = Md(), U.lanes |= e, od |= e, n);
	}
	function Xs(e, t, n, r) {
		return zr(n, t) ? n : wo.current === null ? !(Bo & 106) || Bo & 1073741824 && !(Y & 261930) ? (Mc = !0, e.memoizedState = n) : (e = Md(), U.lanes |= e, od |= e, t) : (e = Ys(e, n, r), zr(e, t) || (Mc = !0), e);
	}
	function Zs(e, t, n, r, i) {
		var a = j.p;
		j.p = a !== 0 && 8 > a ? a : 8;
		var o = A.T, s = {};
		s.types = o === null ? null : o.types, A.T = s, lc(e, !1, t, n);
		try {
			var c = i(), l = A.S;
			l !== null && l(s, c), typeof c == "object" && c && typeof c.then == "function" ? cc(e, t, Va(c, r), jd(e)) : cc(e, t, r, jd(e));
		} catch (n) {
			cc(e, t, {
				then: function() {},
				status: "rejected",
				reason: n
			}, jd());
		} finally {
			j.p = a, o !== null && s.types !== null && (o.types = s.types), A.T = o;
		}
	}
	function Qs() {}
	function $s(e, t, n, r) {
		if (e.tag !== 5) throw Error(i(476));
		var a = ec(e).queue;
		Zs(e, a, t, xe, n === null ? Qs : function() {
			return tc(e), n(r);
		});
	}
	function ec(e) {
		var t = e.memoizedState;
		if (t !== null) return t;
		t = {
			memoizedState: xe,
			baseState: xe,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: us,
				lastRenderedState: xe
			},
			next: null
		};
		var n = {};
		return t.next = {
			memoizedState: n,
			baseState: n,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: us,
				lastRenderedState: n
			},
			next: null
		}, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
	}
	function tc(e) {
		var t = ec(e);
		t.next === null && (t = e.alternate.memoizedState), cc(e, t.next.queue, {}, jd());
	}
	function nc() {
		return Ca(sh);
	}
	function rc() {
		return as().memoizedState;
	}
	function ic() {
		return as().memoizedState;
	}
	function ac(e) {
		for (var t = e.return; t !== null;) {
			switch (t.tag) {
				case 24:
				case 3:
					var n = jd();
					e = ho(n);
					var r = go(t, e, n);
					r !== null && (Pd(r, t, n), _o(r, t, n)), t = { cache: Aa() }, e.payload = t;
					return;
			}
			t = t.return;
		}
	}
	function oc(e, t, n) {
		var r = jd();
		n = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, uc(e) ? dc(t, n) : (n = wi(e, t, n, r), n !== null && (Pd(n, e, r), fc(n, t, r)));
	}
	function sc(e, t, n) {
		cc(e, t, n, jd());
	}
	function cc(e, t, n, r) {
		var i = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		if (uc(e)) dc(t, i);
		else {
			var a = e.alternate;
			if (e.lanes === 0 && (a === null || a.lanes === 0) && (a = t.lastRenderedReducer, a !== null)) try {
				var o = t.lastRenderedState, s = a(o, n);
				if (i.hasEagerState = !0, i.eagerState = s, zr(s, o)) return Ci(e, t, i, 0), q === null && Si(), !1;
			} catch {}
			if (n = wi(e, t, i, r), n !== null) return Pd(n, e, r), fc(n, t, r), !0;
		}
		return !1;
	}
	function lc(e, t, n, r) {
		if (r = {
			lane: 2,
			revertLane: Pf(),
			gesture: null,
			action: r,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, uc(e)) {
			if (t) throw Error(i(479));
		} else t = wi(e, n, r, 2), t !== null && Pd(t, e, 2);
	}
	function uc(e) {
		var t = e.alternate;
		return e === U || t !== null && t === U;
	}
	function dc(e, t) {
		Uo = Ho = !0;
		var n = e.pending;
		n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
	}
	function fc(e, t, n) {
		if (n & 4194048) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, bt(e, n);
		}
	}
	var pc = {
		readContext: Ca,
		use: cs,
		useCallback: Yo,
		useContext: Yo,
		useEffect: Yo,
		useImperativeHandle: Yo,
		useLayoutEffect: Yo,
		useInsertionEffect: Yo,
		useMemo: Yo,
		useReducer: Yo,
		useRef: Yo,
		useState: Yo,
		useDebugValue: Yo,
		useDeferredValue: Yo,
		useTransition: Yo,
		useSyncExternalStore: Yo,
		useId: Yo,
		useHostTransitionStatus: Yo,
		useFormState: Yo,
		useActionState: Yo,
		useOptimistic: Yo,
		useMemoCache: Yo,
		useCacheRefresh: Yo,
		useEffectEvent: Yo
	}, mc = {
		readContext: Ca,
		use: cs,
		useCallback: function(e, t) {
			return is().memoizedState = [e, t === void 0 ? null : t], e;
		},
		useContext: Ca,
		useEffect: Rs,
		useImperativeHandle: function(e, t, n) {
			n = n == null ? null : n.concat([e]), Is(4194308, 4, Ws.bind(null, t, e), n);
		},
		useLayoutEffect: function(e, t) {
			return Is(4194308, 4, e, t);
		},
		useInsertionEffect: function(e, t) {
			Is(4, 2, e, t);
		},
		useMemo: function(e, t) {
			var n = is();
			t = t === void 0 ? null : t;
			var r = e();
			if (Wo) {
				nt(!0);
				try {
					e();
				} finally {
					nt(!1);
				}
			}
			return n.memoizedState = [r, t], r;
		},
		useReducer: function(e, t, n) {
			var r = is();
			if (n !== void 0) {
				var i = n(t);
				if (Wo) {
					nt(!0);
					try {
						n(t);
					} finally {
						nt(!1);
					}
				}
			} else i = t;
			return r.memoizedState = r.baseState = i, e = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: e,
				lastRenderedState: i
			}, r.queue = e, e = e.dispatch = oc.bind(null, U, e), [r.memoizedState, e];
		},
		useRef: function(e) {
			var t = is();
			return e = { current: e }, t.memoizedState = e;
		},
		useState: function(e) {
			e = bs(e);
			var t = e.queue, n = sc.bind(null, U, t);
			return t.dispatch = n, [e.memoizedState, n];
		},
		useDebugValue: Ks,
		useDeferredValue: function(e, t) {
			return Ys(is(), e, t);
		},
		useTransition: function() {
			var e = bs(!1);
			return e = Zs.bind(null, U, e.queue, !0, !1), is().memoizedState = e, [!1, e];
		},
		useSyncExternalStore: function(e, t, n) {
			var r = U, a = is();
			if (H) {
				if (n === void 0) throw Error(i(407));
				n = n();
			} else {
				if (n = t(), q === null) throw Error(i(349));
				Y & 127 || hs(r, t, n);
			}
			a.memoizedState = n;
			var o = {
				value: n,
				getSnapshot: t
			};
			return a.queue = o, Rs(_s.bind(null, r, o, e), [e]), r.flags |= 2048, Ps(9, { destroy: void 0 }, gs.bind(null, r, o, n, t), null), n;
		},
		useId: function() {
			var e = is(), t = q.identifierPrefix;
			if (H) {
				var n = Yi, r = Ji;
				n = (r & ~(1 << 32 - rt(r) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = Go++, 0 < n && (t += "H" + n.toString(32)), t += "_";
			} else n = Jo++, t = "_" + t + "r_" + n.toString(32) + "_";
			return e.memoizedState = t;
		},
		useHostTransitionStatus: nc,
		useFormState: ks,
		useActionState: ks,
		useOptimistic: function(e) {
			var t = is();
			t.memoizedState = t.baseState = e;
			var n = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: null,
				lastRenderedState: null
			};
			return t.queue = n, t = lc.bind(null, U, !0, n), n.dispatch = t, [e, t];
		},
		useMemoCache: ls,
		useCacheRefresh: function() {
			return is().memoizedState = ac.bind(null, U);
		},
		useEffectEvent: function(e) {
			var t = is(), n = { impl: e };
			return t.memoizedState = n, function() {
				if (K & 2) throw Error(i(440));
				return n.impl.apply(void 0, arguments);
			};
		}
	}, hc = {
		readContext: Ca,
		use: cs,
		useCallback: qs,
		useContext: Ca,
		useEffect: zs,
		useImperativeHandle: Gs,
		useInsertionEffect: Hs,
		useLayoutEffect: Us,
		useMemo: Js,
		useReducer: ds,
		useRef: Fs,
		useState: function() {
			return ds(us);
		},
		useDebugValue: Ks,
		useDeferredValue: function(e, t) {
			return Xs(as(), W.memoizedState, e, t);
		},
		useTransition: function() {
			var e = ds(us)[0], t = as().memoizedState;
			return [typeof e == "boolean" ? e : ss(e), t];
		},
		useSyncExternalStore: ms,
		useId: rc,
		useHostTransitionStatus: nc,
		useFormState: As,
		useActionState: As,
		useOptimistic: function(e, t) {
			return xs(as(), W, e, t);
		},
		useMemoCache: ls,
		useCacheRefresh: ic,
		useEffectEvent: Vs
	}, gc = {
		readContext: Ca,
		use: cs,
		useCallback: qs,
		useContext: Ca,
		useEffect: zs,
		useImperativeHandle: Gs,
		useInsertionEffect: Hs,
		useLayoutEffect: Us,
		useMemo: Js,
		useReducer: ps,
		useRef: Fs,
		useState: function() {
			return ps(us);
		},
		useDebugValue: Ks,
		useDeferredValue: function(e, t) {
			var n = as();
			return W === null ? Ys(n, e, t) : Xs(n, W.memoizedState, e, t);
		},
		useTransition: function() {
			var e = ps(us)[0], t = as().memoizedState;
			return [typeof e == "boolean" ? e : ss(e), t];
		},
		useSyncExternalStore: ms,
		useId: rc,
		useHostTransitionStatus: nc,
		useFormState: Ns,
		useActionState: Ns,
		useOptimistic: function(e, t) {
			var n = as();
			return W === null ? (n.baseState = e, [e, n.queue.dispatch]) : xs(n, W, e, t);
		},
		useMemoCache: ls,
		useCacheRefresh: ic,
		useEffectEvent: Vs
	};
	function _c(e, t, n, r) {
		t = e.memoizedState, n = n(r, t), n = n == null ? t : E({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
	}
	var vc = {
		enqueueSetState: function(e, t, n) {
			e = e._reactInternals;
			var r = jd(), i = ho(r);
			i.payload = t, n != null && (i.callback = n), t = go(e, i, r), t !== null && (Pd(t, e, r), _o(t, e, r));
		},
		enqueueReplaceState: function(e, t, n) {
			e = e._reactInternals;
			var r = jd(), i = ho(r);
			i.tag = 1, i.payload = t, n != null && (i.callback = n), t = go(e, i, r), t !== null && (Pd(t, e, r), _o(t, e, r));
		},
		enqueueForceUpdate: function(e, t) {
			e = e._reactInternals;
			var n = jd(), r = ho(n);
			r.tag = 2, t != null && (r.callback = t), t = go(e, r, n), t !== null && (Pd(t, e, n), _o(t, e, n));
		}
	};
	function yc(e, t, n, r, i, a, o) {
		return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, a, o) : t.prototype && t.prototype.isPureReactComponent ? !Br(n, r) || !Br(i, a) : !0;
	}
	function bc(e, t, n, r) {
		e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && vc.enqueueReplaceState(t, t.state, null);
	}
	function xc(e, t) {
		var n = t;
		if ("ref" in t) for (var r in n = {}, t) r !== "ref" && (n[r] = t[r]);
		if (e = e.defaultProps) for (var i in n === t && (n = E({}, n)), e) n[i] === void 0 && (n[i] = e[i]);
		return n;
	}
	function Sc(e) {
		vi(e);
	}
	function Cc(e) {
		console.error(e);
	}
	function wc(e) {
		vi(e);
	}
	function Tc(e, t) {
		try {
			var n = e.onUncaughtError;
			n(t.value, { componentStack: t.stack });
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function Ec(e, t, n) {
		try {
			var r = e.onCaughtError;
			r(n.value, {
				componentStack: n.stack,
				errorBoundary: t.tag === 1 ? t.stateNode : null
			});
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function Dc(e, t, n) {
		return n = ho(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
			Tc(e, t);
		}, n;
	}
	function Oc(e) {
		return e = ho(e), e.tag = 3, e;
	}
	function kc(e, t, n, r) {
		var i = n.type.getDerivedStateFromError;
		if (typeof i == "function") {
			var a = r.value;
			e.payload = function() {
				return i(a);
			}, e.callback = function() {
				Ec(t, n, r);
			};
		}
		var o = n.stateNode;
		o !== null && typeof o.componentDidCatch == "function" && (e.callback = function() {
			Ec(t, n, r), typeof i != "function" && (vd === null ? vd = /* @__PURE__ */ new Set([this]) : vd.add(this));
			var e = r.stack;
			this.componentDidCatch(r.value, { componentStack: e === null ? "" : e });
		});
	}
	function Ac(e, t, n, r, a) {
		if (n.flags |= 32768, typeof r == "object" && r && typeof r.then == "function") {
			if (t = n.alternate, t !== null && ba(t, n, a, !0), n = ko.current, n !== null) {
				switch (n.tag) {
					case 31:
					case 13:
					case 19: return Ao === null ? Kd() : n.alternate === null && ad === 0 && (ad = 3), n.flags &= -257, n.flags |= 65536, n.lanes = a, r === Xa ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = /* @__PURE__ */ new Set([r]) : t.add(r), mf(e, r, a)), !1;
					case 22: return n.flags |= 65536, r === Xa ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
						transitions: null,
						markerInstances: null,
						retryQueue: /* @__PURE__ */ new Set([r])
					}, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = /* @__PURE__ */ new Set([r]) : n.add(r)), mf(e, r, a)), !1;
				}
				throw Error(i(435, n.tag));
			}
			return mf(e, r, a), Kd(), !1;
		}
		if (H) return t = ko.current, t === null ? (r !== aa && (t = Error(i(423), { cause: r }), fa(Bi(t, n))), e = e.current.alternate, e.flags |= 65536, a &= -a, e.lanes |= a, r = Bi(r, n), a = Dc(e.stateNode, r, a), vo(e, a), ad !== 4 && (ad = 2)) : (!(t.flags & 65536) && (t.flags |= 256), t.flags |= 65536, t.lanes = a, r !== aa && (e = Error(i(422), { cause: r }), fa(Bi(e, n)))), !1;
		var o = Error(i(520), { cause: r });
		if (o = Bi(o, n), dd === null ? dd = [o] : dd.push(o), ad !== 4 && (ad = 2), t === null) return !0;
		r = Bi(r, n), n = t;
		do {
			switch (n.tag) {
				case 3: return n.flags |= 65536, e = a & -a, n.lanes |= e, e = Dc(n.stateNode, r, e), vo(n, e), !1;
				case 1:
					if (t = n.type, o = n.stateNode, !(n.flags & 128) && (typeof t.getDerivedStateFromError == "function" || o !== null && typeof o.componentDidCatch == "function" && (vd === null || !vd.has(o)))) return n.flags |= 65536, a &= -a, n.lanes |= a, a = Oc(a), kc(a, e, n, r), vo(n, a), !1;
					break;
				case 22: if (n.memoizedState !== null) return n.flags |= 65536, !1;
			}
			n = n.return;
		} while (n !== null);
		return !1;
	}
	var jc = Error(i(461)), Mc = !1;
	function Nc(e, t, n, r) {
		t.child = e === null ? uo(t, null, n, r) : lo(t, e.child, n, r);
	}
	function Pc(e, t, n, r, i) {
		n = n.render;
		var a = t.ref;
		if ("ref" in r) {
			var o = {};
			for (var s in r) s !== "ref" && (o[s] = r[s]);
		} else o = r;
		return Sa(t), r = Zo(e, t, n, o, a, i), s = ts(), e !== null && !Mc ? (ns(e, t, i), cl(e, t, i)) : (H && s && Qi(t), t.flags |= 1, Nc(e, t, r, i), t.child);
	}
	function Fc(e, t, n, r, i) {
		if (e === null) {
			var a = n.type;
			return typeof a == "function" && !ji(a) && a.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = a, Ic(e, t, a, r, i)) : (e = Pi(n.type, null, r, t, t.mode, i), e.ref = t.ref, e.return = t, t.child = e);
		}
		if (a = e.child, !ll(e, i)) {
			var o = a.memoizedProps;
			if (n = n.compare, n = n === null ? Br : n, n(o, r) && e.ref === t.ref) return cl(e, t, i);
		}
		return t.flags |= 1, e = Mi(a, r), e.ref = t.ref, e.return = t, t.child = e;
	}
	function Ic(e, t, n, r, i) {
		if (e !== null) {
			var a = e.memoizedProps;
			if (Br(a, r) && e.ref === t.ref) {
				if (Mc = !1, t.pendingProps = r = a, ll(e, i)) e.flags & 131072 && (Mc = !0);
				else return t.lanes = e.lanes, cl(e, t, i);
			}
		}
		return Wc(e, t, n, r, i);
	}
	function Lc(e, t, n, r) {
		var i = r.children, a = e === null ? null : e.memoizedState;
		if (e === null && t.stateNode === null && (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), r.mode === "hidden") {
			if (t.flags & 128) {
				if (a = a === null ? n : a.baseLanes | n, e !== null) {
					for (r = t.child = e.child, i = 0; r !== null;) i = i | r.lanes | r.childLanes, r = r.sibling;
					r = i & ~a;
				} else r = 0, t.child = null;
				return zc(e, t, a, n, r);
			}
			if (n & 536870912) t.memoizedState = {
				baseLanes: 0,
				cachePool: null
			}, e !== null && Ga(t, a === null ? null : a.cachePool), a === null ? Do() : Eo(t, a), No(t);
			else return r = t.lanes = 536870912, zc(e, t, a === null ? n : a.baseLanes | n, n, r);
		} else a === null ? (e !== null && Ga(t, null), Do(), Po()) : (Ga(t, a.cachePool), Eo(t, a), Po(), t.memoizedState = null);
		return Nc(e, t, i, n), t.child;
	}
	function Rc(e, t) {
		return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), t.sibling;
	}
	function zc(e, t, n, r, i) {
		var a = Wa();
		return a = a === null ? null : {
			parent: ka._currentValue,
			pool: a
		}, t.memoizedState = {
			baseLanes: n,
			cachePool: a
		}, e !== null && Ga(t, null), Do(), No(t), e !== null && ba(e, t, r, !0), t.childLanes = i, null;
	}
	function Bc(e, t) {
		return t = $c({
			mode: t.mode,
			children: t.children
		}, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
	}
	function Vc(e, t, n) {
		return lo(t, e.child, null, n), e = Bc(t, t.pendingProps), e.flags |= 2, Fo(t), t.memoizedState = null, e;
	}
	function Hc(e, t, n) {
		var r = t.pendingProps, a = !!(t.flags & 128);
		if (t.flags &= -129, e === null) {
			if (H) {
				if (r.mode === "hidden") return e = Bc(t, r), t.lanes = 536870912, e.memoizedState = {
					baseLanes: 0,
					cachePool: null
				}, Rc(null, e);
				if (Mo(t), (e = na) ? (e = am(e, ia), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: qi === null ? null : {
						id: Ji,
						overflow: Yi
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = Li(e), n.return = t, t.child = n, ta = t, na = null)) : e = null, e === null) throw oa(t);
				return t.lanes = 536870912, null;
			}
			return Bc(t, r);
		}
		var o = e.memoizedState;
		if (o !== null) {
			var s = o.dehydrated;
			if (Mo(t), a) {
				if (t.flags & 256) t.flags &= -257, t = Vc(e, t, n);
				else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
				else throw Error(i(558));
			} else if (Mc || ba(e, t, n, !1), a = (n & e.childLanes) !== 0, Mc || a) {
				if (wo.current === null) {
					if (r = q, r !== null && (s = xt(r, n), s !== 0 && s !== o.retryLane)) throw o.retryLane = s, Ti(e, s), Pd(r, e, s), jc;
					Kd();
				}
				t = Vc(e, t, n);
			} else e = o.treeContext, na = lm(s.nextSibling), ta = t, H = !0, ra = null, ia = !1, e !== null && ea(t, e), t = Bc(t, r), t.flags |= 134221824;
			return t;
		}
		return e = Mi(e.child, {
			mode: r.mode,
			children: r.children
		}), e.ref = t.ref, t.child = e, e.return = t, e;
	}
	function Uc(e, t) {
		var n = t.ref;
		if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
		else {
			if (typeof n != "function" && typeof n != "object") throw Error(i(284));
			(e === null || e.ref !== n) && (t.flags |= 4194816);
		}
	}
	function Wc(e, t, n, r, i) {
		return Sa(t), n = Zo(e, t, n, r, void 0, i), r = ts(), e !== null && !Mc ? (ns(e, t, i), cl(e, t, i)) : (H && r && Qi(t), t.flags |= 1, Nc(e, t, n, i), t.child);
	}
	function Gc(e, t, n, r, i, a) {
		return Sa(t), t.updateQueue = null, n = $o(t, r, n, i), Qo(e), r = ts(), e !== null && !Mc ? (ns(e, t, a), cl(e, t, a)) : (H && r && Qi(t), t.flags |= 1, Nc(e, t, n, a), t.child);
	}
	function Kc(e, t, n, r, i) {
		if (Sa(t), t.stateNode === null) {
			var a = Oi, o = n.contextType;
			typeof o == "object" && o && (a = Ca(o)), a = new n(r, a), t.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null, a.updater = vc, t.stateNode = a, a._reactInternals = t, a = t.stateNode, a.props = r, a.state = t.memoizedState, a.refs = {}, po(t), o = n.contextType, a.context = typeof o == "object" && o ? Ca(o) : Oi, a.state = t.memoizedState, o = n.getDerivedStateFromProps, typeof o == "function" && (_c(t, n, o, r), a.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function" || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (o = a.state, typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount(), o !== a.state && vc.enqueueReplaceState(a, a.state, null), xo(t, r, a, i), bo(), a.state = t.memoizedState), typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !0;
		} else if (e === null) {
			a = t.stateNode;
			var s = t.memoizedProps, c = xc(n, s);
			a.props = c;
			var l = a.context, u = n.contextType;
			o = Oi, typeof u == "object" && u && (o = Ca(u));
			var d = n.getDerivedStateFromProps;
			u = typeof d == "function" || typeof a.getSnapshotBeforeUpdate == "function", s = t.pendingProps !== s, u || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (s || l !== o) && bc(t, a, r, o), fo = !1;
			var f = t.memoizedState;
			a.state = f, xo(t, r, a, i), bo(), l = t.memoizedState, s || f !== l || fo ? (typeof d == "function" && (_c(t, n, d, r), l = t.memoizedState), (c = fo || yc(t, n, c, r, f, l, o)) ? (u || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount()), typeof a.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = l), a.props = r, a.state = l, a.context = o, r = c) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
		} else {
			a = t.stateNode, mo(e, t), o = t.memoizedProps, u = xc(n, o), a.props = u, d = t.pendingProps, f = a.context, l = n.contextType, c = Oi, typeof l == "object" && l && (c = Ca(l)), s = n.getDerivedStateFromProps, (l = typeof s == "function" || typeof a.getSnapshotBeforeUpdate == "function") || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (o !== d || f !== c) && bc(t, a, r, c), fo = !1, f = t.memoizedState, a.state = f, xo(t, r, a, i), bo();
			var p = t.memoizedState;
			o !== d || f !== p || fo || e !== null && e.dependencies !== null && xa(e.dependencies) ? (typeof s == "function" && (_c(t, n, s, r), p = t.memoizedState), (u = fo || yc(t, n, u, r, f, p, c) || e !== null && e.dependencies !== null && xa(e.dependencies)) ? (l || typeof a.UNSAFE_componentWillUpdate != "function" && typeof a.componentWillUpdate != "function" || (typeof a.componentWillUpdate == "function" && a.componentWillUpdate(r, p, c), typeof a.UNSAFE_componentWillUpdate == "function" && a.UNSAFE_componentWillUpdate(r, p, c)), typeof a.componentDidUpdate == "function" && (t.flags |= 4), typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = p), a.props = r, a.state = p, a.context = c, r = u) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), r = !1);
		}
		return a = r, Uc(e, t), r = !!(t.flags & 128), a || r ? (a = t.stateNode, n = r && typeof n.getDerivedStateFromError != "function" ? null : a.render(), t.flags |= 1, e !== null && r ? (t.child = lo(t, e.child, null, i), t.child = lo(t, null, n, i)) : Nc(e, t, n, i), t.memoizedState = a.state, e = t.child) : e = cl(e, t, i), e;
	}
	function qc(e, t, n, r) {
		return ua(), t.flags |= 256, Nc(e, t, n, r), t.child;
	}
	var Jc = {
		dehydrated: null,
		treeContext: null,
		retryLane: 0,
		hydrationErrors: null
	};
	function Yc(e) {
		return {
			baseLanes: e,
			cachePool: Ka()
		};
	}
	function Xc(e, t, n) {
		return e = e === null ? 0 : e.childLanes & ~n, t && (e |= ld), e;
	}
	function Zc(e, t, n) {
		var r = t.pendingProps, i = !1, a = !!(t.flags & 128), o;
		if ((o = a) || (o = e !== null && e.memoizedState === null ? !1 : !!(Io.current & 2)), o && (i = !0, t.flags &= -129), o = !!(t.flags & 32), t.flags &= -33, e === null) {
			if (H) {
				if (i ? jo(t) : Po(), (e = na) ? (e = am(e, ia), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: qi === null ? null : {
						id: Ji,
						overflow: Yi
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = Li(e), n.return = t, t.child = n, ta = t, na = null)) : e = null, e === null) throw oa(t);
				return t.lanes = sm(e) ? 32 : 536870912, null;
			}
			return a = r.children, r = r.fallback, i ? (Po(), i = t.mode, a = $c({
				mode: "hidden",
				children: a
			}, i), r = Fi(r, i, n, null), a.return = t, r.return = t, a.sibling = r, t.child = a, r = t.child, r.memoizedState = Yc(n), r.childLanes = Xc(e, o, n), t.memoizedState = Jc, Rc(null, r)) : (jo(t), Qc(t, a));
		}
		var s = e.memoizedState;
		if (s !== null) {
			var c = s.dehydrated;
			if (c !== null) return tl(e, t, a, o, r, c, s, n);
		}
		return i ? (Po(), i = r.fallback, a = t.mode, s = e.child, c = s.sibling, r = Mi(s, {
			mode: "hidden",
			children: r.children
		}), r.subtreeFlags = s.subtreeFlags & 1206910976, c === null ? (i = Fi(i, a, n, null), i.flags |= 2) : i = Mi(c, i), i.return = t, r.return = t, r.sibling = i, t.child = r, Rc(null, r), r = t.child, i = e.child.memoizedState, i === null ? i = Yc(n) : (a = i.cachePool, a === null ? a = Ka() : (s = ka._currentValue, a = a.parent === s ? a : {
			parent: s,
			pool: s
		}), i = {
			baseLanes: i.baseLanes | n,
			cachePool: a
		}), r.memoizedState = i, r.childLanes = Xc(e, o, n), t.memoizedState = Jc, Rc(e.child, r)) : (jo(t), n = e.child, e = n.sibling, n = Mi(n, {
			mode: "visible",
			children: r.children
		}), n.return = t, n.sibling = null, e !== null && (o = t.deletions, o === null ? (t.deletions = [e], t.flags |= 16) : o.push(e)), t.child = n, t.memoizedState = null, n);
	}
	function Qc(e, t) {
		return t = $c({
			mode: "visible",
			children: t
		}, e.mode), t.return = e, e.child = t;
	}
	function $c(e, t) {
		return e = Ai(22, e, null, t), e.lanes = 0, e;
	}
	function el(e, t, n) {
		return lo(t, e.child, null, n), e = Qc(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
	}
	function tl(e, t, n, r, a, o, s, c) {
		if (n) return t.flags & 256 ? (jo(t), t.flags &= -257, el(e, t, c)) : t.memoizedState === null ? (Po(), o = a.fallback, s = t.mode, a = $c({
			mode: "visible",
			children: a.children
		}, s), o = Fi(o, s, c, null), o.flags |= 2, a.return = t, o.return = t, a.sibling = o, t.child = a, lo(t, e.child, null, c), a = t.child, a.memoizedState = Yc(c), a.childLanes = Xc(e, r, c), t.memoizedState = Jc, Rc(null, a)) : (Po(), t.child = e.child, t.flags |= 128, null);
		if (jo(t), sm(o)) {
			if (r = o.nextSibling && o.nextSibling.dataset, r) var l = r.dgst;
			return r = l, r !== "" && (a = Error(i(419)), a.stack = "", a.digest = r, fa({
				value: a,
				source: null,
				stack: null
			})), el(e, t, c);
		}
		if (Mc || ba(e, t, c, !1), r = (c & e.childLanes) !== 0, Mc || r) {
			if (wo.current !== null) return el(e, t, c);
			if (r = q, r !== null && (a = xt(r, c), a !== 0 && a !== s.retryLane)) throw s.retryLane = a, Ti(e, a), Pd(r, e, a), jc;
			return om(o) || Kd(), el(e, t, c);
		}
		return om(o) ? (t.flags |= 192, t.child = e.child, null) : (e = s.treeContext, na = lm(o.nextSibling), ta = t, H = !0, ra = null, ia = !1, e !== null && ea(t, e), t = Qc(t, a.children), t.flags |= 134221824, t);
	}
	function nl(e, t, n) {
		e.lanes |= t;
		var r = e.alternate;
		r !== null && (r.lanes |= t), va(e.return, t, n);
	}
	function rl(e) {
		for (var t = null; e !== null;) {
			var n = e.alternate;
			n !== null && zo(n) === null && (t = e), e = e.sibling;
		}
		return t;
	}
	function il(e, t, n, r, i, a) {
		var o = e.memoizedState;
		o === null ? e.memoizedState = {
			isBackwards: t,
			rendering: null,
			renderingStartTime: 0,
			last: r,
			tail: n,
			tailMode: i,
			treeForkCount: a
		} : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = n, o.tailMode = i, o.treeForkCount = a);
	}
	function al(e) {
		var t = e.child;
		for (e.child = null; t !== null;) {
			var n = t.sibling;
			t.sibling = e.child, e.child = t, t = n;
		}
	}
	function ol(e, t, n) {
		var r = t.pendingProps, i = r.revealOrder, a = r.tail;
		r = r.children;
		var o = Io.current;
		if (t.flags & 128) return Lo(t, o), null;
		var s = !!(o & 2);
		if (s ? (o = o & 1 | 2, t.flags |= 128) : o &= 1, Lo(t, o), i === "backwards" && e !== null ? (al(e), Nc(e, t, r, n), al(e)) : Nc(e, t, r, n), r = H ? Wi : 0, !s && e !== null && e.flags & 128) a: for (e = t.child; e !== null;) {
			if (e.tag === 13) e.memoizedState !== null && nl(e, n, t);
			else if (e.tag === 19) nl(e, n, t);
			else if (e.child !== null) {
				e.child.return = e, e = e.child;
				continue;
			}
			if (e === t) break a;
			for (; e.sibling === null;) {
				if (e.return === null || e.return === t) break a;
				e = e.return;
			}
			e.sibling.return = e.return, e = e.sibling;
		}
		switch (i) {
			case "backwards":
				n = rl(t.child), n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null, al(t)), il(t, !0, i, null, a, r);
				break;
			case "unstable_legacy-backwards":
				for (n = null, i = t.child, t.child = null; i !== null;) {
					if (e = i.alternate, e !== null && zo(e) === null) {
						t.child = i;
						break;
					}
					e = i.sibling, i.sibling = n, n = i, i = e;
				}
				il(t, !0, n, null, a, r);
				break;
			case "together":
				il(t, !1, null, null, void 0, r);
				break;
			case "independent":
				t.memoizedState = null;
				break;
			default: n = rl(t.child), n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), il(t, !1, i, n, a, r);
		}
		return t.child;
	}
	function sl(e, t, n) {
		var r = t.pendingProps;
		return ga(t, t.type, r.value), Nc(e, t, r.children, n), t.child;
	}
	function cl(e, t, n) {
		if (e !== null && (t.dependencies = e.dependencies), od |= t.lanes, (n & t.childLanes) === 0) {
			if (e !== null) {
				if (ba(e, t, n, !1), (n & t.childLanes) === 0) return null;
			} else return null;
		}
		if (e !== null && t.child !== e.child) throw Error(i(153));
		if (t.child !== null) {
			for (e = t.child, n = Mi(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;) e = e.sibling, n = n.sibling = Mi(e, e.pendingProps), n.return = t;
			n.sibling = null;
		}
		return t.child;
	}
	function ll(e, t) {
		return (e.lanes & t) !== 0 || (e = e.dependencies, !!(e !== null && xa(e)));
	}
	function ul(e, t, n) {
		switch (t.tag) {
			case 3:
				Ae(t, t.stateNode.containerInfo), ga(t, ka, e.memoizedState.cache), ua();
				break;
			case 27:
			case 5:
				Me(t);
				break;
			case 4:
				Ae(t, t.stateNode.containerInfo);
				break;
			case 10:
				ga(t, t.type, t.memoizedProps.value);
				break;
			case 31:
				if (t.memoizedState !== null) return t.flags |= 128, Mo(t), null;
				break;
			case 13:
				var r = t.memoizedState;
				if (r !== null) {
					if (r.dehydrated !== null) return jo(t), t.flags |= 128, null;
					r = ba(e, t, n, !1);
					var i = t.child.childLanes;
					return r || (n & i) !== 0 ? Zc(e, t, n) : (jo(t), e = cl(e, t, n), e === null ? null : e.sibling);
				}
				jo(t);
				break;
			case 19:
				if (t.flags & 128) return ol(e, t, n);
				if (i = !!(e.flags & 128), r = (n & t.childLanes) !== 0, r ||= (ba(e, t, n, !1), (n & t.childLanes) !== 0), i) {
					if (r) return ol(e, t, n);
					t.flags |= 128;
				}
				if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), Lo(t, Io.current), r) break;
				return null;
			case 22: return t.lanes = 0, Lc(e, t, n, t.pendingProps);
			case 24: ga(t, ka, e.memoizedState.cache);
		}
		return cl(e, t, n);
	}
	function dl(e, t, n) {
		if (e !== null) {
			if (e.memoizedProps !== t.pendingProps) Mc = !0;
			else {
				if (!ll(e, n) && !(t.flags & 128)) return Mc = !1, ul(e, t, n);
				Mc = !!(e.flags & 131072);
			}
		} else Mc = !1, H && t.flags & 1048576 && Zi(t, Wi, t.index);
		switch (t.lanes = 0, t.tag) {
			case 16:
				a: {
					var r = t.pendingProps;
					if (e = $a(t.elementType), t.type = e, typeof e == "function") ji(e) ? (r = xc(e, r), t.tag = 1, t = Kc(null, t, e, r, n)) : (t.tag = 0, t = Wc(null, t, e, r, n));
					else {
						if (e != null) {
							var a = e.$$typeof;
							if (a === oe) {
								t.tag = 11, t = Pc(null, t, e, r, n);
								break a;
							}
							if (a === le) {
								t.tag = 14, t = Fc(null, t, e, r, n);
								break a;
							}
							if (a === ae) {
								t.tag = 10, t.type = e, t = sl(null, t, n);
								break a;
							}
						}
						throw t = ye(e) || e, Error(i(306, t, ""));
					}
				}
				return t;
			case 0: return Wc(e, t, t.type, t.pendingProps, n);
			case 1: return r = t.type, a = xc(r, t.pendingProps), Kc(e, t, r, a, n);
			case 3:
				a: {
					if (Ae(t, t.stateNode.containerInfo), e === null) throw Error(i(387));
					r = t.pendingProps;
					var o = t.memoizedState;
					a = o.element, mo(e, t), xo(t, r, null, n);
					var s = t.memoizedState;
					if (r = s.cache, ga(t, ka, r), r !== o.cache && ya(t, [ka], n, !0), bo(), r = s.element, o.isDehydrated) {
						if (o = {
							element: r,
							isDehydrated: !1,
							cache: s.cache
						}, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
							t = qc(e, t, r, n);
							break a;
						}
						if (r !== a) {
							a = Bi(Error(i(424)), t), fa(a), t = qc(e, t, r, n);
							break a;
						}
						switch (e = t.stateNode.containerInfo, e.nodeType) {
							case 9:
								e = e.body;
								break;
							default: e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
						}
						for (na = lm(e.firstChild), ta = t, H = !0, ra = null, ia = !0, n = uo(t, null, r, n), t.child = n; n;) n.flags = n.flags & -3 | 134221824, n = n.sibling;
					} else {
						if (ua(), r === a) {
							t = cl(e, t, n);
							break a;
						}
						Nc(e, t, r, n);
					}
					t = t.child;
				}
				return t;
			case 26: return Uc(e, t), e === null ? (n = Nm(t.type, null, t.pendingProps, null)) ? t.memoizedState = n : H || (t.stateNode = fp(t.type, t.pendingProps, Oe.current, t)) : t.memoizedState = Nm(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
			case 27: return Me(t), e === null && H && (r = t.stateNode = hm(t.type, t.pendingProps, Oe.current), ta = t, ia = !0, a = na, Sp(t.type) ? (um = a, na = lm(r.firstChild)) : na = a), Nc(e, t, t.pendingProps.children, n), Uc(e, t), e === null && (t.flags |= 4194304), t.child;
			case 5: return e === null && H && ((a = r = na) && (r = rm(r, t.type, t.pendingProps, ia), r === null ? a = !1 : (t.stateNode = r, ta = t, na = lm(r.firstChild), ia = !1, a = !0)), a || oa(t)), Me(t), a = t.type, o = t.pendingProps, s = e === null ? null : e.memoizedProps, r = o.children, pp(a, o) ? r = null : s !== null && pp(a, s) && (t.flags |= 32), t.memoizedState !== null && (a = Zo(e, t, es, null, null, n), sh._currentValue = a), Uc(e, t), Nc(e, t, r, n), t.child;
			case 6: return e === null && H && ((e = n = na) && (n = im(n, t.pendingProps, ia), n === null ? e = !1 : (t.stateNode = n, ta = t, na = null, e = !0)), e || oa(t)), null;
			case 13: return Zc(e, t, n);
			case 4: return Ae(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = lo(t, null, r, n) : Nc(e, t, r, n), t.child;
			case 11: return Pc(e, t, t.type, t.pendingProps, n);
			case 7: return r = t.pendingProps, Uc(e, t), Nc(e, t, r, n), t.child;
			case 8: return Nc(e, t, t.pendingProps.children, n), t.child;
			case 12: return Nc(e, t, t.pendingProps.children, n), t.child;
			case 10: return sl(e, t, n);
			case 9: return a = t.type._context, r = t.pendingProps.children, Sa(t), a = Ca(a), r = r(a), t.flags |= 1, Nc(e, t, r, n), t.child;
			case 14: return Fc(e, t, t.type, t.pendingProps, n);
			case 15: return Ic(e, t, t.type, t.pendingProps, n);
			case 19: return ol(e, t, n);
			case 31: return Hc(e, t, n);
			case 22: return Lc(e, t, n, t.pendingProps);
			case 24: return Sa(t), r = Ca(ka), e === null ? (a = Wa(), a === null && (a = q, o = Aa(), a.pooledCache = o, o.refCount++, o !== null && (a.pooledCacheLanes |= n), a = o), t.memoizedState = {
				parent: r,
				cache: a
			}, po(t), ga(t, ka, a)) : ((e.lanes & n) !== 0 && (mo(e, t), xo(t, null, null, n), bo()), a = e.memoizedState, o = t.memoizedState, a.parent === r ? (r = o.cache, ga(t, ka, r), r !== a.cache && ya(t, [ka], n, !0)) : (a = {
				parent: r,
				cache: r
			}, t.memoizedState = a, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = a), ga(t, ka, r))), Nc(e, t, t.pendingProps.children, n), t.child;
			case 30: return t.stateNode === null && (t.stateNode = {
				autoName: null,
				paired: null,
				clones: null,
				ref: null
			}), r = t.pendingProps, r.name != null && r.name !== "auto" ? t.flags |= e === null ? 18882560 : 18874368 : H && Qi(t), e !== null && e.memoizedProps.name !== r.name ? t.flags |= 4194816 : Uc(e, t), Nc(e, t, r.children, n), t.child;
			case 29: throw t.pendingProps;
		}
		throw Error(i(156, t.tag));
	}
	function fl(e) {
		e.flags |= 4;
	}
	function pl(e, t, n, r, i) {
		var a;
		if ((a = !!(e.mode & 32)) && (a = n === null ? Jm(t, r) : Jm(t, r) && (r.src !== n.src || r.srcSet !== n.srcSet)), a) {
			if (e.flags |= 16777216, (i & 335544128) === i) {
				if (e.stateNode.complete) e.flags |= 8192;
				else if (Ud()) e.flags |= 8192;
				else throw eo = Xa, Ja;
			}
		} else e.flags &= -16777217;
	}
	function ml(e, t) {
		if (t.type !== "stylesheet" || t.state.loading & 4) e.flags &= -16777217;
		else if (e.flags |= 16777216, !Ym(t)) {
			if (Ud()) e.flags |= 8192;
			else throw eo = Xa, Ja;
		}
	}
	function hl(e, t) {
		t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag === 22 ? 536870912 : ht(), e.lanes |= t, ud |= t);
	}
	function gl(e, t) {
		if (!H) switch (e.tailMode) {
			case "visible": break;
			case "collapsed":
				for (var n = e.tail, r = null; n !== null;) n.alternate !== null && (r = n), n = n.sibling;
				r === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
				break;
			default:
				for (t = e.tail, n = null; t !== null;) t.alternate !== null && (n = t), t = t.sibling;
				n === null ? e.tail = null : n.sibling = null;
		}
	}
	function _l(e) {
		var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
		if (t) for (var i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags & 1206910976, r |= i.flags & 1206910976, i.return = e, i = i.sibling;
		else for (i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags, r |= i.flags, i.return = e, i = i.sibling;
		return e.subtreeFlags |= r, e.childLanes = n, t;
	}
	function vl(e, t, n) {
		var r = t.pendingProps;
		switch ($i(t), t.tag) {
			case 16:
			case 15:
			case 0:
			case 11:
			case 7:
			case 8:
			case 12:
			case 9:
			case 14: return _l(t), null;
			case 1: return _l(t), null;
			case 3: return n = t.stateNode, r = null, e !== null && (r = e.memoizedState.cache), t.memoizedState.cache !== r && (t.flags |= 2048), _a(ka), je(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (la(t) ? fl(t) : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, da())), _l(t), null;
			case 26:
				var a = t.type, o = t.memoizedState;
				return e === null ? (fl(t), o === null ? (_l(t), pl(t, a, null, r, n)) : (_l(t), ml(t, o))) : o ? o === e.memoizedState ? (_l(t), t.flags &= -16777217) : (fl(t), _l(t), ml(t, o)) : (e = e.memoizedProps, e !== r && fl(t), _l(t), pl(t, a, e, r, n)), null;
			case 27:
				if (Ne(t), n = Oe.current, a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && fl(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return _l(t), t.subtreeFlags &= -33554433, null;
					}
					e = Ee.current, la(t) ? sa(t, e) : (e = hm(a, r, n), t.stateNode = e, fl(t));
				}
				return _l(t), t.subtreeFlags &= -33554433, null;
			case 5:
				if (Ne(t), a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && fl(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return _l(t), t.subtreeFlags &= -33554433, null;
					}
					if (o = Ee.current, la(t)) sa(t, o);
					else {
						var s = lp(Oe.current);
						switch (o) {
							case 1:
								o = s.createElementNS("http://www.w3.org/2000/svg", a);
								break;
							case 2:
								o = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
								break;
							default: switch (a) {
								case "svg":
									o = s.createElementNS("http://www.w3.org/2000/svg", a);
									break;
								case "math":
									o = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
									break;
								case "script":
									o = s.createElement("div"), o.innerHTML = "<script><\/script>", o = o.removeChild(o.firstChild);
									break;
								case "select":
									o = typeof r.is == "string" ? s.createElement("select", { is: r.is }) : s.createElement("select"), r.multiple ? o.multiple = !0 : r.size && (o.size = r.size);
									break;
								default: o = typeof r.is == "string" ? s.createElement(a, { is: r.is }) : s.createElement(a);
							}
						}
						o[F] = t, o[Et] = r;
						a: for (s = t.child; s !== null;) {
							if (s.tag === 5 || s.tag === 6) o.appendChild(s.stateNode);
							else if (s.tag !== 4 && s.tag !== 27 && s.child !== null) {
								s.child.return = s, s = s.child;
								continue;
							}
							if (s === t) break a;
							for (; s.sibling === null;) {
								if (s.return === null || s.return === t) break a;
								s = s.return;
							}
							s.sibling.return = s.return, s = s.sibling;
						}
						t.stateNode = o;
						a: switch (np(o, a, r), a) {
							case "button":
							case "input":
							case "select":
							case "textarea":
								r = !!r.autoFocus;
								break a;
							case "img":
								r = !0;
								break a;
							default: r = !1;
						}
						r && fl(t);
					}
				}
				return _l(t), t.subtreeFlags &= -33554433, pl(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n), null;
			case 6:
				if (e && t.stateNode != null) e.memoizedProps !== r && fl(t);
				else {
					if (typeof r != "string" && t.stateNode === null) throw Error(i(166));
					if (e = Oe.current, la(t)) {
						if (e = t.stateNode, n = t.memoizedProps, r = null, a = ta, a !== null) switch (a.tag) {
							case 27:
							case 5: r = a.memoizedProps;
						}
						e[F] = t, e = !!(e.nodeValue === n || r !== null && !0 === r.suppressHydrationWarning || ep(e.nodeValue, n)), e || oa(t, !0);
					} else e = lp(e).createTextNode(r), e[F] = t, t.stateNode = e;
				}
				return _l(t), null;
			case 31:
				if (n = t.memoizedState, e === null || e.memoizedState !== null) {
					if (r = la(t), n !== null) {
						if (e === null) {
							if (!r) throw Error(i(318));
							if (e = t.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(557));
							e[F] = t;
						} else ua(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						_l(t), e = !1;
					} else n = da(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
					if (!e) return t.flags & 256 ? (Fo(t), t) : (Fo(t), null);
					if (t.flags & 128) throw Error(i(558));
				}
				return _l(t), null;
			case 13:
				if (r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
					if (a = la(t), r !== null && r.dehydrated !== null) {
						if (e === null) {
							if (!a) throw Error(i(318));
							if (a = t.memoizedState, a = a === null ? null : a.dehydrated, !a) throw Error(i(317));
							a[F] = t;
						} else ua(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						_l(t), a = !1;
					} else a = da(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a), a = !0;
					if (!a) return t.flags & 256 ? (Fo(t), t) : (Fo(t), null);
				}
				return Fo(t), t.flags & 128 ? (t.lanes = n, t) : (n = r !== null, e = e !== null && e.memoizedState !== null, n && (r = t.child, a = null, r.alternate !== null && r.alternate.memoizedState !== null && r.alternate.memoizedState.cachePool !== null && (a = r.alternate.memoizedState.cachePool.pool), o = null, r.memoizedState !== null && r.memoizedState.cachePool !== null && (o = r.memoizedState.cachePool.pool), o !== a && (r.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), hl(t, t.updateQueue), _l(t), null);
			case 4: return je(), e === null && Wf(t.stateNode.containerInfo), t.flags |= 67108864, _l(t), null;
			case 10: return _a(t.type), _l(t), null;
			case 19:
				if (Ro(t), r = t.memoizedState, r === null) return _l(t), null;
				if (a = !!(t.flags & 128), o = r.rendering, o === null) {
					if (a) gl(r, !1);
					else {
						if (ad !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null;) {
							if (o = zo(e), o !== null) {
								for (t.flags |= 128, gl(r, !1), e = o.updateQueue, t.updateQueue = e, hl(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null;) Ni(n, e), n = n.sibling;
								return Lo(t, Io.current & 1 | 2), H && Xi(t, r.treeForkCount), t.child;
							}
							e = e.sibling;
						}
						r.tail !== null && Ge() > gd && (t.flags |= 128, a = !0, gl(r, !1), t.lanes = 4194304);
					}
				} else {
					if (!a) {
						if (e = zo(o), e !== null) {
							if (t.flags |= 128, a = !0, e = e.updateQueue, t.updateQueue = e, hl(t, e), gl(r, !0), r.tail === null && r.tailMode !== "collapsed" && r.tailMode !== "visible" && !o.alternate && !H) return _l(t), null;
						} else 2 * Ge() - r.renderingStartTime > gd && n !== 536870912 && (t.flags |= 128, a = !0, gl(r, !1), t.lanes = 4194304);
					}
					r.isBackwards ? (o.sibling = t.child, t.child = o) : (e = r.last, e === null ? t.child = o : e.sibling = o, r.last = o);
				}
				if (r.tail !== null) {
					e = r.tail;
					a: {
						for (n = e; n !== null;) {
							if (n.alternate !== null) {
								n = !1;
								break a;
							}
							n = n.sibling;
						}
						n = !0;
					}
					return r.rendering = e, r.tail = e.sibling, r.renderingStartTime = Ge(), e.sibling = null, o = Io.current, o = a ? o & 1 | 2 : o & 1, r.tailMode === "visible" || r.tailMode === "collapsed" || !n || H ? Lo(t, o) : (n = o, M(ko, t), M(Io, n), Ao === null && (Ao = t)), H && Xi(t, r.treeForkCount), e;
				}
				return _l(t), null;
			case 22:
			case 23: return Fo(t), Oo(), r = t.memoizedState !== null, e === null ? r && (t.flags |= 8192) : e.memoizedState !== null !== r && (t.flags |= 8192), r ? n & 536870912 && !(t.flags & 128) && (_l(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : _l(t), n = t.updateQueue, n !== null && hl(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), r = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (r = t.memoizedState.cachePool.pool), r !== n && (t.flags |= 2048), e !== null && Te(Ua), null;
			case 24: return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), _a(ka), _l(t), null;
			case 25: return null;
			case 30: return t.flags |= 33554432, _l(t), null;
		}
		throw Error(i(156, t.tag));
	}
	function yl(e, t) {
		switch ($i(t), t.tag) {
			case 1: return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 3: return _a(ka), je(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
			case 26:
			case 27:
			case 5: return Ne(t), null;
			case 31:
				if (t.memoizedState !== null) {
					if (Fo(t), t.alternate === null) throw Error(i(340));
					ua();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 13:
				if (Fo(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
					if (t.alternate === null) throw Error(i(340));
					ua();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 19: return Ro(t), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, e = t.memoizedState, e !== null && (e.rendering = null, e.tail = null), t.flags |= 4, t) : null;
			case 4: return je(), null;
			case 10: return _a(t.type), null;
			case 22:
			case 23: return Fo(t), Oo(), e !== null && Te(Ua), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 24: return _a(ka), null;
			case 25: return null;
			default: return null;
		}
	}
	function bl(e, t) {
		switch ($i(t), t.tag) {
			case 3:
				_a(ka), je();
				break;
			case 26:
			case 27:
			case 5:
				Ne(t);
				break;
			case 4:
				je();
				break;
			case 31:
				t.memoizedState !== null && Fo(t);
				break;
			case 13:
				Fo(t);
				break;
			case 19:
				Ro(t);
				break;
			case 10:
				_a(t.type);
				break;
			case 22:
			case 23:
				Fo(t), Oo(), e !== null && Te(Ua);
				break;
			case 24: _a(ka);
		}
	}
	function xl(e, t) {
		try {
			var n = t.updateQueue, r = n === null ? null : n.lastEffect;
			if (r !== null) {
				var i = r.next;
				n = i;
				do {
					if ((n.tag & e) === e) {
						r = void 0;
						var a = n.create, o = n.inst;
						r = a(), o.destroy = r;
					}
					n = n.next;
				} while (n !== i);
			}
		} catch (e) {
			Z(t, t.return, e);
		}
	}
	function Sl(e, t, n) {
		try {
			var r = t.updateQueue, i = r === null ? null : r.lastEffect;
			if (i !== null) {
				var a = i.next;
				r = a;
				do {
					if ((r.tag & e) === e) {
						var o = r.inst, s = o.destroy;
						if (s !== void 0) {
							o.destroy = void 0, i = t;
							var c = n, l = s;
							try {
								l();
							} catch (e) {
								Z(i, c, e);
							}
						}
					}
					r = r.next;
				} while (r !== a);
			}
		} catch (e) {
			Z(t, t.return, e);
		}
	}
	function Cl(e) {
		var t = e.updateQueue;
		if (t !== null) {
			var n = e.stateNode;
			try {
				Co(t, n);
			} catch (t) {
				Z(e, e.return, t);
			}
		}
	}
	function wl(e, t, n) {
		n.props = xc(e.type, e.memoizedProps), n.state = e.memoizedState;
		try {
			n.componentWillUnmount();
		} catch (n) {
			Z(e, t, n);
		}
	}
	function Tl(e, t) {
		try {
			var n = e.ref;
			if (n !== null) {
				switch (e.tag) {
					case 26:
					case 27:
					case 5:
						var r = e.stateNode;
						break;
					case 30:
						var i = e.stateNode, a = hi(e.memoizedProps, i);
						(i.ref === null || i.ref.name !== a) && (i.ref = Pp(a)), r = i.ref;
						break;
					case 7:
						if (e.stateNode === null) {
							var o = new Fp(e);
							h(e.child, !1, Qp, o, void 0, void 0), e.stateNode = o;
						}
						r = e.stateNode;
						break;
					default: r = e.stateNode;
				}
				typeof n == "function" ? e.refCleanup = n(r) : n.current = r;
			}
		} catch (n) {
			Z(e, t, n);
		}
	}
	function El(e, t) {
		var n = e.ref, r = e.refCleanup;
		if (n !== null) {
			if (typeof r == "function") try {
				r();
			} catch (n) {
				Z(e, t, n);
			} finally {
				e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
			}
			else if (typeof n == "function") try {
				n(null);
			} catch (n) {
				Z(e, t, n);
			}
			else n.current = null;
		}
	}
	function Dl(e, t) {
		if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && e.alternate === null && t !== null) for (var n = 0; n < t.length; n++) em(e.stateNode, t[n]);
	}
	function Ol(e) {
		for (var t = e.return; t !== null && (jl(t) && em(e.stateNode, t.stateNode), !Al(t));) t = t.return;
	}
	function kl(e) {
		for (var t = e.return; t !== null && (jl(t) && tm(e.stateNode, t.stateNode), !Al(t));) t = t.return;
	}
	function Al(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 27;
	}
	function jl(e) {
		return e && e.tag === 7 && e.stateNode !== null;
	}
	function Ml(e) {
		var t = e.type, n = e.memoizedProps, r = e.stateNode;
		try {
			a: switch (t) {
				case "button":
				case "input":
				case "select":
				case "textarea":
					n.autoFocus && r.focus();
					break a;
				case "img": n.src ? r.src = n.src : n.srcSet && (r.srcset = n.srcSet);
			}
		} catch (t) {
			Z(e, e.return, t);
		}
	}
	function Nl(e, t, n) {
		try {
			var r = e.stateNode;
			ip(r, e.type, n, t), r[Et] = t;
		} catch (t) {
			Z(e, e.return, t);
		}
	}
	function Pl(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Sp(e.type) || e.tag === 4;
	}
	function Fl(e) {
		a: for (;;) {
			for (; e.sibling === null;) {
				if (e.return === null || Pl(e.return)) return null;
				e = e.return;
			}
			for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
				if (e.tag === 27 && Sp(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue a;
				e.child.return = e, e = e.child;
			}
			if (!(e.flags & 2)) return e.stateNode;
		}
	}
	function Il(e, t, n, r) {
		var i = e.tag;
		if (i === 5 || i === 6) i = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(i, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(i), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = vn)), Dl(e, r), L = !0;
		else if (i !== 4 && (i === 27 && (Dl(e, r), r = null, Sp(e.type) && (n = e.stateNode, t = null)), e = e.child, e !== null)) for (Il(e, t, n, r), e = e.sibling; e !== null;) Il(e, t, n, r), e = e.sibling;
	}
	function Ll(e, t, n, r) {
		var i = e.tag;
		if (i === 5 || i === 6) i = e.stateNode, t ? n.insertBefore(i, t) : n.appendChild(i), Dl(e, r), L = !0;
		else if (i !== 4 && (i === 27 && (Dl(e, r), r = null, Sp(e.type) && (n = e.stateNode)), e = e.child, e !== null)) for (Ll(e, t, n, r), e = e.sibling; e !== null;) Ll(e, t, n, r), e = e.sibling;
	}
	function Rl(e) {
		var t = e.stateNode, n = e.memoizedProps;
		try {
			for (var r = e.type, i = t.attributes; i.length;) t.removeAttributeNode(i[0]);
			np(t, r, n), t[F] = e, t[Et] = n;
		} catch (t) {
			Z(e, e.return, t);
		}
	}
	var zl = !1, Bl = null;
	function Vl(e) {
		(e.tag === 30 || e.subtreeFlags & 33554432) && (zl = !0);
	}
	var Hl = null;
	function Ul() {
		var e = Hl;
		return Hl = null, e;
	}
	var Wl = 0;
	function Gl(e, t, n, r, i) {
		return Wl = 0, Kl(e.child, t, n, r, i);
	}
	function Kl(e, t, n, r, i) {
		for (var a = !1; e !== null;) {
			if (e.tag === 5) {
				var o = e.stateNode;
				if (r !== null) {
					var s = Op(o);
					r.push(s), s.view && (a = !0);
				} else a || Op(o).view && (a = !0);
				zl = !0, Tp(o, Wl === 0 ? t : t + "_" + Wl, n), Wl++;
			} else e.tag === 22 && e.memoizedState !== null || e.tag === 30 && i || Kl(e.child, t, n, r, i) && (a = !0);
			e = e.sibling;
		}
		return a;
	}
	function ql(e, t) {
		for (; e !== null;) e.tag === 5 ? Ep(e.stateNode, e.memoizedProps) : e.tag === 22 && e.memoizedState !== null || e.tag === 30 && t || ql(e.child, t), e = e.sibling;
	}
	function Jl(e) {
		if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
			if ((e.tag !== 22 || e.memoizedState === null) && (Jl(e), e.tag === 30 && e.flags & 18874368 && e.stateNode.paired)) {
				var t = e.memoizedProps;
				if (t.name == null || t.name === "auto") throw Error(i(544));
				var n = t.name;
				t = _i(t.default, t.share), t !== "none" && (Gl(e, n, t, null, !1) || ql(e.child, !1));
			}
			e = e.sibling;
		}
	}
	function Yl(e, t) {
		if (e.tag === 30) {
			var n = e.stateNode, r = e.memoizedProps, i = hi(r, n), a = _i(r.default, n.paired ? r.share : r.enter);
			a === "none" ? Jl(e) : Gl(e, i, a, null, !1) ? (Jl(e), n.paired || t || Nd(e, r.onEnter)) : ql(e.child, !1);
		} else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) Yl(e, t), e = e.sibling;
		else Jl(e);
	}
	function Xl(e) {
		if (Bl !== null && Bl.size !== 0) {
			var t = Bl;
			if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
				if (e.tag !== 22 || e.memoizedState === null) {
					if (e.tag === 30 && e.flags & 18874368) {
						var n = e.memoizedProps, r = n.name;
						if (r != null && r !== "auto") {
							var i = t.get(r);
							if (i !== void 0) {
								var a = _i(n.default, n.share);
								if (a !== "none" && (Gl(e, r, a, null, !1) ? (a = e.stateNode, i.paired = a, a.paired = i, Nd(e, n.onShare)) : ql(e.child, !1)), t.delete(r), t.size === 0) break;
							}
						}
					}
					Xl(e);
				}
				e = e.sibling;
			}
		}
	}
	function Zl(e) {
		if (e.tag === 30) {
			var t = e.memoizedProps, n = hi(t, e.stateNode), r = Bl === null ? void 0 : Bl.get(n), i = _i(t.default, r === void 0 ? t.exit : t.share);
			i !== "none" && (Gl(e, n, i, null, !1) ? r === void 0 ? Nd(e, t.onExit) : (i = e.stateNode, r.paired = i, i.paired = r, Bl.delete(n), Nd(e, t.onShare)) : ql(e.child, !1)), Bl !== null && Xl(e);
		} else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) Zl(e), e = e.sibling;
		else Bl !== null && Xl(e);
	}
	function Ql(e) {
		for (e = e.child; e !== null;) {
			if (e.tag === 30) {
				var t = e.memoizedProps, n = hi(t, e.stateNode);
				t = _i(t.default, t.update), e.flags &= -5, t !== "none" && Gl(e, n, t, e.memoizedState = [], !1);
			} else e.subtreeFlags & 33554432 && Ql(e);
			e = e.sibling;
		}
	}
	function $l(e) {
		if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
			if (e.tag !== 22 || e.memoizedState === null) {
				if (e.tag === 30 && e.flags & 18874368) {
					var t = e.stateNode;
					t.paired !== null && (t.paired = null, ql(e.child, !1));
				}
				$l(e);
			}
			e = e.sibling;
		}
	}
	function eu(e) {
		if (e.tag === 30) e.stateNode.paired = null, ql(e.child, !1), $l(e);
		else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) eu(e), e = e.sibling;
		else $l(e);
	}
	function tu(e) {
		for (e = e.child; e !== null;) e.tag === 30 ? ql(e.child, !1) : e.subtreeFlags & 33554432 && tu(e), e = e.sibling;
	}
	function nu(e, t, n, r, i, a, o) {
		for (var s = !1; t !== null;) {
			if (t.tag === 5) {
				var c = t.stateNode;
				if (a !== null && Wl < a.length) {
					var l = a[Wl], u = Op(c);
					(l.view || u.view) && (s = !0);
					var d;
					if (d = !(e.flags & 4)) {
						if (u.clip) d = !0;
						else {
							d = l.rect;
							var f = u.rect;
							d = d.y !== f.y || d.x !== f.x || d.height !== f.height || d.width !== f.width;
						}
					}
					d && (e.flags |= 4), u.abs ? u = !l.abs : (l = l.rect, u = u.rect, u = l.height !== u.height || l.width !== u.width), u && (e.flags |= 32);
				} else e.flags |= 32;
				e.flags & 4 && Tp(c, Wl === 0 ? n : n + "_" + Wl, i), s && e.flags & 4 || (Hl === null && (Hl = []), Hl.push(c, Wl === 0 ? r : r + "_" + Wl, t.memoizedProps)), Wl++;
			} else (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && o ? e.flags |= t.flags & 32 : nu(e, t.child, n, r, i, a, o) && (s = !0));
			t = t.sibling;
		}
		return s;
	}
	function ru(e, t) {
		for (e = e.child; e !== null;) {
			if (e.tag === 30) {
				var n = e.memoizedProps, r = e.stateNode, i = hi(n, r), a = _i(n.default, n.update);
				if (t) {
					r = r.clones;
					var o = r === null ? null : r.map(kp);
				} else o = e.memoizedState, e.memoizedState = null;
				r = e;
				var s = e.child;
				Wl = 0, i = nu(r, s, i, i, a, o, !1), e.flags & 4 && i && (t || Nd(e, n.onUpdate));
			} else e.subtreeFlags & 33554432 && ru(e, t);
			e = e.sibling;
		}
	}
	var iu = !1, G = !1, au = !1, ou = !1, su = typeof WeakSet == "function" ? WeakSet : Set, cu = null, lu = !1, uu = !1, du = !1, fu = !1;
	function pu(e, t, n) {
		if (e = e.containerInfo, sp = gh, e = Gr(e), Kr(e)) {
			if ("selectionStart" in e) var r = {
				start: e.selectionStart,
				end: e.selectionEnd
			};
			else a: {
				r = (r = e.ownerDocument) && r.defaultView || window;
				var i = r.getSelection && r.getSelection();
				if (i && i.rangeCount !== 0) {
					r = i.anchorNode;
					var a = i.anchorOffset, o = i.focusNode;
					i = i.focusOffset;
					try {
						r.nodeType, o.nodeType;
					} catch {
						r = null;
						break a;
					}
					var s = 0, c = -1, l = -1, u = 0, d = 0, f = e, p = null;
					b: for (;;) {
						for (var m; f !== r || a !== 0 && f.nodeType !== 3 || (c = s + a), f !== o || i !== 0 && f.nodeType !== 3 || (l = s + i), f.nodeType === 3 && (s += f.nodeValue.length), (m = f.firstChild) !== null;) p = f, f = m;
						for (;;) {
							if (f === e) break b;
							if (p === r && ++u === a && (c = s), p === o && ++d === i && (l = s), (m = f.nextSibling) !== null) break;
							f = p, p = f.parentNode;
						}
						f = m;
					}
					r = c === -1 || l === -1 ? null : {
						start: c,
						end: l
					};
				} else r = null;
			}
			r ||= {
				start: 0,
				end: 0
			};
		} else r = null;
		for (cp = {
			focusedElem: e,
			selectionRange: r
		}, gh = !1, n = (n & 335544064) === n, cu = t, t = n ? 9270 : 1024; cu !== null;) {
			if (e = cu, n && (r = e.deletions, r !== null)) for (a = 0; a < r.length; a++) n && Zl(r[a]);
			if (e.alternate === null && e.flags & 2) n && Vl(e), mu(n);
			else {
				if (e.tag === 22) {
					if (r = e.alternate, e.memoizedState !== null) {
						r !== null && r.memoizedState === null && n && Zl(r), mu(n);
						continue;
					}
					if (r !== null && r.memoizedState !== null) {
						n && Vl(e), mu(n);
						continue;
					}
				}
				r = e.child, (e.subtreeFlags & t) !== 0 && r !== null ? (r.return = e, cu = r) : (n && Ql(e), mu(n));
			}
		}
		Bl = null;
	}
	function mu(e) {
		for (; cu !== null;) {
			var t = cu, n = e, r = t.alternate, a = t.flags;
			switch (t.tag) {
				case 0:
				case 11:
				case 15: break;
				case 1:
					if (a & 1024 && r !== null) {
						n = void 0, a = r.memoizedProps, r = r.memoizedState;
						var o = t.stateNode;
						try {
							var s = xc(t.type, a);
							n = o.getSnapshotBeforeUpdate(s, r), o.__reactInternalSnapshotBeforeUpdate = n;
						} catch (e) {
							Z(t, t.return, e);
						}
					}
					break;
				case 3:
					if (a & 1024) {
						if (r = t.stateNode.containerInfo, n = r.nodeType, n === 9) nm(r);
						else if (n === 1) switch (r.nodeName) {
							case "HEAD":
							case "HTML":
							case "BODY":
								nm(r);
								break;
							default: r.textContent = "";
						}
					}
					break;
				case 5:
				case 26:
				case 27:
				case 6:
				case 4:
				case 17: break;
				case 30:
					n && r !== null && (n = hi(r.memoizedProps, r.stateNode), a = t.memoizedProps, a = _i(a.default, a.update), a !== "none" && Gl(r, n, a, r.memoizedState = [], !0));
					break;
				default: if (a & 1024) throw Error(i(163));
			}
			if (r = t.sibling, r !== null) {
				r.return = t.return, cu = r;
				break;
			}
			cu = t.return;
		}
	}
	function hu(e, t, n) {
		var r = n.flags;
		switch (n.tag) {
			case 0:
			case 11:
			case 15:
				Fu(e, n), r & 4 && xl(5, n);
				break;
			case 1:
				if (Fu(e, n), r & 4) {
					if (e = n.stateNode, t === null) try {
						e.componentDidMount();
					} catch (e) {
						Z(n, n.return, e);
					}
					else {
						var i = xc(n.type, t.memoizedProps);
						t = t.memoizedState;
						try {
							e.componentDidUpdate(i, t, e.__reactInternalSnapshotBeforeUpdate);
						} catch (e) {
							Z(n, n.return, e);
						}
					}
				}
				r & 64 && Cl(n), r & 512 && Tl(n, n.return);
				break;
			case 3:
				if (Fu(e, n), r & 64 && (e = n.updateQueue, e !== null)) {
					if (t = null, n.child !== null) switch (n.child.tag) {
						case 27:
						case 5:
							t = n.child.stateNode;
							break;
						case 1: t = n.child.stateNode;
					}
					try {
						Co(e, t);
					} catch (e) {
						Z(n, n.return, e);
					}
				}
				break;
			case 27: t === null && r & 4 && Rl(n);
			case 26:
			case 5:
				Fu(e, n), t === null && r & 4 && Ml(n), r & 512 && Tl(n, n.return);
				break;
			case 12:
				Fu(e, n);
				break;
			case 31:
				Fu(e, n), r & 4 && wu(e, n);
				break;
			case 13:
				Fu(e, n), r & 4 && Tu(e, n), r & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (n = _f.bind(null, n), cm(e, n))));
				break;
			case 22:
				if (r = n.memoizedState !== null || iu, !r) {
					var a = t !== null && t.memoizedState !== null || G;
					t = iu, i = G, iu = r, (G = a) && !i ? (r = 2, n.subtreeFlags & 8772 && (r |= 1), Lu(e, n, r)) : Fu(e, n), iu = t, G = i;
				}
				break;
			case 30:
				Fu(e, n), r & 512 && Tl(n, n.return);
				break;
			case 7: r & 512 && Tl(n, n.return);
			default: Fu(e, n);
		}
	}
	function gu(e, t) {
		for (e = e.child; e !== null;) _u(e, t), e = e.sibling;
	}
	function _u(e, t) {
		switch (e.tag) {
			case 5:
			case 26:
				try {
					var n = e.stateNode;
					if (t) {
						var r = n.style;
						typeof r.setProperty == "function" ? r.setProperty("display", "none", "important") : r.display = "none";
					} else {
						var i = e.stateNode, a = e.memoizedProps.style, o = a != null && a.hasOwnProperty("display") ? a.display : null;
						i.style.display = o == null || typeof o == "boolean" ? "" : ("" + o).trim();
					}
				} catch (t) {
					Z(e, e.return, t);
				}
				vu(e, t);
				break;
			case 6:
				try {
					e.stateNode.nodeValue = t ? "" : e.memoizedProps, L = !0;
				} catch (t) {
					Z(e, e.return, t);
				}
				break;
			case 18:
				try {
					var s = e.stateNode;
					t ? wp(s, !0) : wp(e.stateNode, !1);
				} catch (t) {
					Z(e, e.return, t);
				}
				break;
			case 22:
			case 23:
				e.memoizedState === null && gu(e, t);
				break;
			default: gu(e, t);
		}
	}
	function vu(e, t) {
		if (e.subtreeFlags & 67108864) for (e = e.child; e !== null;) {
			a: {
				var n = e, r = t;
				switch (n.tag) {
					case 4:
						_u(n, r);
						break a;
					case 22:
						n.memoizedState === null && vu(n, r);
						break a;
					default: vu(n, r);
				}
			}
			e = e.sibling;
		}
	}
	function yu(e) {
		var t = e.alternate;
		t !== null && (e.alternate = null, yu(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && Pt(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
	}
	var bu = null, xu = !1;
	function Su(e, t, n) {
		for (n = n.child; n !== null;) Cu(e, t, n), n = n.sibling;
	}
	function Cu(e, t, n) {
		if (tt && typeof tt.onCommitFiberUnmount == "function") try {
			tt.onCommitFiberUnmount(et, n);
		} catch {}
		switch (n.tag) {
			case 26:
				G || El(n, t), Su(e, t, n), n.memoizedState ? n.memoizedState.count-- : n.stateNode && !G && (n = n.stateNode, n.parentNode.removeChild(n));
				break;
			case 27:
				G || El(n, t), kl(n);
				var r = bu, i = xu;
				Sp(n.type) && (bu = n.stateNode, xu = !1), Su(e, t, n), gm(n.stateNode, n.type, n.memoizedProps), bu = r, xu = i;
				break;
			case 5: G || El(n, t), kl(n);
			case 6:
				if (n.tag === 6 && kl(n), r = bu, i = xu, bu = null, Su(e, t, n), bu = r, xu = i, bu !== null) {
					if (xu) try {
						(bu.nodeType === 9 ? bu.body : bu.nodeName === "HTML" ? bu.ownerDocument.body : bu).removeChild(n.stateNode), L = !0;
					} catch (e) {
						Z(n, t, e);
					}
					else try {
						bu.removeChild(n.stateNode), L = !0;
					} catch (e) {
						Z(n, t, e);
					}
				}
				break;
			case 18:
				bu !== null && (xu ? (e = bu, Cp(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, n.stateNode), Hh(e)) : Cp(bu, n.stateNode));
				break;
			case 4:
				r = bu, i = xu, bu = n.stateNode.containerInfo, xu = !0, Su(e, t, n), bu = r, xu = i;
				break;
			case 0:
			case 11:
			case 14:
			case 15:
				Sl(2, n, t), G || Sl(4, n, t), Su(e, t, n);
				break;
			case 1:
				G || (El(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function" && wl(n, t, r)), Su(e, t, n);
				break;
			case 21:
				Su(e, t, n);
				break;
			case 22:
				G = (r = G) || n.memoizedState !== null, Su(e, t, n), G = r;
				break;
			case 30:
				El(n, t), Su(e, t, n);
				break;
			case 7:
				G || El(n, t), Su(e, t, n);
				break;
			default: Su(e, t, n);
		}
	}
	function wu(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
			e = e.dehydrated;
			try {
				Hh(e);
			} catch (e) {
				Z(t, t.return, e);
			}
		}
	}
	function Tu(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
			Hh(e);
		} catch (e) {
			Z(t, t.return, e);
		}
	}
	function Eu(e) {
		switch (e.tag) {
			case 31:
			case 13:
			case 19:
				var t = e.stateNode;
				return t === null && (t = e.stateNode = new su()), t;
			case 22: return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new su()), t;
			default: throw Error(i(435, e.tag));
		}
	}
	function Du(e, t) {
		var n = Eu(e);
		t.forEach(function(t) {
			if (!n.has(t)) {
				n.add(t);
				var r = vf.bind(null, e, t);
				t.then(r, r);
			}
		});
	}
	function Ou(e, t, n) {
		var r = t.deletions;
		if (r !== null) for (var a = 0; a < r.length; a++) {
			var o = r[a], s = e, c = t, l = c;
			a: for (; l !== null;) {
				switch (l.tag) {
					case 27:
						if (Sp(l.type)) {
							bu = l.stateNode, xu = !1;
							break a;
						}
						break;
					case 5:
						bu = l.stateNode, xu = !1;
						break a;
					case 3:
					case 4:
						bu = l.stateNode.containerInfo, xu = !0;
						break a;
				}
				l = l.return;
			}
			if (bu === null) throw Error(i(160));
			Cu(s, c, o), bu = null, xu = !1, s = o.alternate, s !== null && (s.return = null), o.return = null;
		}
		if (t.subtreeFlags & 13886) for (t = t.child; t !== null;) Au(t, e, n), t = t.sibling;
	}
	var ku = null;
	function Au(e, t, n) {
		var r = e.alternate, a = e.flags;
		switch (e.tag) {
			case 0:
			case 11:
			case 14:
			case 15:
				if (a & 4 && (r = e.updateQueue, r = r === null ? null : r.events, r !== null)) for (var o = 0; o < r.length; o++) {
					var s = r[o];
					s.ref.impl = s.nextImpl;
				}
				Ou(t, e, n), ju(e), a & 4 && (Sl(3, e, e.return), xl(3, e), Sl(5, e, e.return));
				break;
			case 1:
				Ou(t, e, n), ju(e), a & 512 && (G || r === null || El(r, r.return)), a & 64 && iu && (e = e.updateQueue, e !== null && (t = e.callbacks, t !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? t : n.concat(t))));
				break;
			case 26:
				if (o = ku, Ou(t, e, n), ju(e), a & 512 && (G || r === null || El(r, r.return)), a & 4) {
					if (a = r === null ? null : r.memoizedState, n = e.memoizedState, r === null) {
						if (n === null) {
							if (e.stateNode === null) {
								if (iu) e.stateNode = fp(e.type, e.memoizedProps, t.containerInfo, e);
								else {
									a: {
										t = e.type, n = e.memoizedProps, a = o.ownerDocument || o;
										b: switch (t) {
											case "title":
												r = a.getElementsByTagName("title")[0], (!r || r[Mt] || r[F] || r.namespaceURI === "http://www.w3.org/2000/svg" || r.hasAttribute("itemprop")) && (r = a.createElement(t), a.head.insertBefore(r, a.querySelector("head > title"))), np(r, t, n), r[F] = e, zt(r), t = r;
												break a;
											case "link":
												if (o = Gm("link", "href", a).get(t + (n.href || ""))) {
													for (s = 0; s < o.length; s++) if (r = o[s], r.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && r.getAttribute("rel") === (n.rel == null ? null : n.rel) && r.getAttribute("title") === (n.title == null ? null : n.title) && r.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
														o.splice(s, 1);
														break b;
													}
												}
												r = a.createElement(t), np(r, t, n), a.head.appendChild(r);
												break;
											case "meta":
												if (o = Gm("meta", "content", a).get(t + (n.content || ""))) {
													for (s = 0; s < o.length; s++) if (r = o[s], r.getAttribute("content") === (n.content == null ? null : "" + n.content) && r.getAttribute("name") === (n.name == null ? null : n.name) && r.getAttribute("property") === (n.property == null ? null : n.property) && r.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && r.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
														o.splice(s, 1);
														break b;
													}
												}
												r = a.createElement(t), np(r, t, n), a.head.appendChild(r);
												break;
											default: throw Error(i(468, t));
										}
										r[F] = e, zt(r), t = r;
									}
									e.stateNode = t;
								}
							} else iu || Km(o, e.type, e.stateNode);
						} else e.stateNode = Bm(o, n, e.memoizedProps);
					} else a === n ? n === null && e.stateNode !== null && Nl(e, e.memoizedProps, r.memoizedProps) : (a === null ? (t = r.stateNode, t === null || G || t.parentNode.removeChild(t)) : a.count--, n === null ? iu || Km(o, e.type, e.stateNode) : Bm(o, n, e.memoizedProps));
				}
				break;
			case 27:
				Ou(t, e, n), ju(e), a & 512 && (G || r === null || El(r, r.return)), r !== null && a & 4 && Nl(e, e.memoizedProps, r.memoizedProps);
				break;
			case 5:
				if (o = au, au = !1, Ou(t, e, n), au = o, ju(e), a & 512 && (G || r === null || El(r, r.return)), e.flags & 32) {
					t = e.stateNode;
					try {
						un(t, ""), L = !0;
					} catch (t) {
						Z(e, e.return, t);
					}
				}
				a & 4 && e.stateNode != null && (t = e.memoizedProps, Nl(e, t, r === null ? t : r.memoizedProps)), a & 1024 && (ou = !0);
				break;
			case 6:
				if (Ou(t, e, n), ju(e), a & 4) {
					if (e.stateNode === null) throw Error(i(162));
					t = e.memoizedProps, n = e.stateNode;
					try {
						n.nodeValue = t, L = !0;
					} catch (t) {
						Z(e, e.return, t);
					}
				}
				break;
			case 3:
				if (L = !1, Wm = null, o = ku, ku = bm(t.containerInfo), Ou(t, e, n), ku = o, ju(e), a & 4 && r !== null && r.memoizedState.isDehydrated) try {
					Hh(t.containerInfo);
				} catch (t) {
					Z(e, e.return, t);
				}
				ou && (ou = !1, Mu(e)), L = !1;
				break;
			case 4:
				a = au, au = iu, r = Jt(), o = ku, ku = bm(e.stateNode.containerInfo), Ou(t, e, n), ju(e), ku = o, L && uu && (du = !0), L = r, au = a;
				break;
			case 12:
				Ou(t, e, n), ju(e);
				break;
			case 31:
				Ou(t, e, n), ju(e), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Du(e, t)));
				break;
			case 13:
				Ou(t, e, n), ju(e), e.child.flags & 8192 && e.memoizedState !== null != (r !== null && r.memoizedState !== null) && (md = Ge()), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Du(e, t)));
				break;
			case 22:
				o = e.memoizedState !== null, s = r !== null && r.memoizedState !== null;
				var c = iu, l = G, u = au;
				iu = c || o, au = u || o, G = l || s, Ou(t, e, n), G = l, au = u, iu = c, ju(e), a & 8192 && (t = e.stateNode, t._visibility = o ? t._visibility & -2 : t._visibility | 1, !o || r === null || s || iu || G || (t = s || G, n = iu, r = G, iu = o || iu, G = t, Iu(e, 2), iu = n, G = r), !o && au || gu(e, o)), a & 4 && (t = e.updateQueue, t !== null && (n = t.retryQueue, n !== null && (t.retryQueue = null, Du(e, n))));
				break;
			case 19:
				Ou(t, e, n), ju(e), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Du(e, t)));
				break;
			case 30:
				a & 512 && (G || r === null || El(r, r.return)), a = Jt(), o = uu, s = (n & 335544064) === n, c = e.memoizedProps, uu = s && _i(c.default, c.update) !== "none", Ou(t, e, n), ju(e), s && r !== null && L && (e.flags |= 4), uu = o, L = a;
				break;
			case 21: break;
			case 7: a & 512 && (G || r === null || El(r, r.return)), r && r.stateNode !== null && (r.stateNode._fragmentFiber = e);
			default: Ou(t, e, n), ju(e);
		}
	}
	function ju(e) {
		var t = e.flags;
		if (t & 2) {
			try {
				for (var n, r = e.return; r !== null;) {
					if (Pl(r)) {
						n = r;
						break;
					}
					r = r.return;
				}
				r = null;
				for (var a = e.return; a !== null;) {
					if (jl(a)) {
						var o = a.stateNode;
						r === null ? r = [o] : r.push(o);
					}
					if (Al(a)) break;
					a = a.return;
				}
				var s = r;
				if (n == null) throw Error(i(160));
				switch (n.tag) {
					case 27:
						var c = n.stateNode;
						Ll(e, Fl(e), c, s);
						break;
					case 5:
						var l = n.stateNode;
						n.flags & 32 && (un(l, ""), n.flags &= -33), Ll(e, Fl(e), l, s);
						break;
					case 3:
					case 4:
						var u = n.stateNode.containerInfo;
						Il(e, Fl(e), u, s);
						break;
					default: throw Error(i(161));
				}
			} catch (t) {
				Z(e, e.return, t);
			}
			e.flags &= -3;
		}
		t & 4096 && (e.flags &= -4097);
	}
	function Mu(e) {
		if (e.subtreeFlags & 1024) for (e = e.child; e !== null;) {
			var t = e;
			Mu(t), t.tag === 5 && t.flags & 1024 && (t = t.stateNode, gh = !0, t.reset(), gh = !1), e = e.sibling;
		}
	}
	function Nu(e, t) {
		if (t.subtreeFlags & 9270) for (t = t.child; t !== null;) Pu(t, e), t = t.sibling;
		else ru(t, !1);
	}
	function Pu(e, t) {
		var n = e.alternate;
		if (n === null) Yl(e, !1);
		else switch (e.tag) {
			case 3:
				if (fu = lu = !1, Ul(), Nu(t, e), !lu && !du) {
					if (e = Hl, e !== null) for (var r = 0; r < e.length; r += 3) {
						n = e[r];
						var i = e[r + 1];
						Ep(n, e[r + 2]), n = n.ownerDocument.documentElement, n !== null && n.animate({
							opacity: [0, 0],
							pointerEvents: ["none", "none"]
						}, {
							duration: 0,
							fill: "forwards",
							pseudoElement: "::view-transition-group(" + i + ")"
						});
					}
					e = t.containerInfo, e = e.nodeType === 9 ? e.documentElement : e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "" && (e.style.viewTransitionName = "none", e.animate({
						opacity: [0, 0],
						pointerEvents: ["none", "none"]
					}, {
						duration: 0,
						fill: "forwards",
						pseudoElement: "::view-transition-group(root)"
					}), e.animate({
						width: [0, 0],
						height: [0, 0]
					}, {
						duration: 0,
						fill: "forwards",
						pseudoElement: "::view-transition"
					})), fu = !0;
				}
				Hl = null;
				break;
			case 5:
				Nu(t, e);
				break;
			case 4:
				r = lu, lu = !1, Nu(t, e), lu && (du = !0), lu = r;
				break;
			case 22:
				e.memoizedState === null && (n.memoizedState === null ? Nu(t, e) : Yl(e, !1));
				break;
			case 30:
				r = lu, i = Ul(), lu = !1, Nu(t, e), lu && (e.flags |= 4);
				var a = e.memoizedProps, o = e.stateNode;
				t = hi(a, o), o = hi(n.memoizedProps, o);
				var s = _i(a.default, a.update);
				s === "none" ? t = !1 : (a = n.memoizedState, n.memoizedState = null, n = e.child, Wl = 0, t = nu(e, n, t, o, s, a, !0), Wl !== (a === null ? 0 : a.length) && (e.flags |= 32)), e.flags & 4 && t ? (Nd(e, e.memoizedProps.onUpdate), Hl = i) : i !== null && (i.push.apply(i, Hl), Hl = i), lu = e.flags & 32 ? !0 : r;
				break;
			default: Nu(t, e);
		}
	}
	function Fu(e, t) {
		if (t.subtreeFlags & 8772) for (t = t.child; t !== null;) hu(e, t.alternate, t), t = t.sibling;
	}
	function Iu(e, t) {
		for (e = e.child; e !== null;) {
			var n = e, r = t;
			switch (n.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					Sl(4, n, n.return), Iu(n, r);
					break;
				case 1:
					El(n, n.return);
					var i = n.stateNode;
					typeof i.componentWillUnmount == "function" && wl(n, n.return, i), Iu(n, r);
					break;
				case 27: r & 2 && gm(n.stateNode, n.type, n.memoizedProps);
				case 5:
					El(n, n.return), n.tag !== 5 && n.tag !== 27 || kl(n), Iu(n, r);
					break;
				case 6:
					kl(n);
					break;
				case 26:
					El(n, n.return), i = n.stateNode, n.memoizedState !== null || i === null || G || i.parentNode.removeChild(i), Iu(n, r);
					break;
				case 22:
					n.memoizedState === null && Iu(n, r);
					break;
				case 30:
					El(n, n.return), Iu(n, r);
					break;
				case 7: El(n, n.return);
				default: Iu(n, r);
			}
			e = e.sibling;
		}
	}
	function Lu(e, t, n) {
		for (n = t.subtreeFlags & 8772 ? n : n & -2, t = t.child; t !== null;) {
			var r = t.alternate, i = e, a = t, o = a.flags, s = !!(n & 1);
			switch (a.tag) {
				case 0:
				case 11:
				case 15:
					Lu(i, a, n), xl(4, a);
					break;
				case 1:
					if (Lu(i, a, n), r = a, i = r.stateNode, typeof i.componentDidMount == "function") try {
						i.componentDidMount();
					} catch (e) {
						Z(r, r.return, e);
					}
					if (r = a, i = r.updateQueue, i !== null) {
						var c = r.stateNode;
						try {
							var l = i.shared.hiddenCallbacks;
							if (l !== null) for (i.shared.hiddenCallbacks = null, i = 0; i < l.length; i++) So(l[i], c);
						} catch (e) {
							Z(r, r.return, e);
						}
					}
					s && o & 64 && Cl(a), Tl(a, a.return);
					break;
				case 27: n & 2 && Rl(a);
				case 5:
					a.tag !== 5 && a.tag !== 27 || Ol(a), Lu(i, a, n), s && r === null && o & 4 && Ml(a), Tl(a, a.return);
					break;
				case 6:
					Ol(a);
					break;
				case 26:
					c = a.stateNode, a.memoizedState !== null || c === null || iu || Km(bm(c.ownerDocument), a.type, c), Lu(i, a, n), s && r === null && o & 4 && Ml(a), Tl(a, a.return);
					break;
				case 12:
					Lu(i, a, n);
					break;
				case 31:
					Lu(i, a, n), s && o & 4 && wu(i, a);
					break;
				case 13:
					Lu(i, a, n), s && o & 4 && Tu(i, a);
					break;
				case 22:
					a.memoizedState === null && Lu(i, a, n), Tl(a, a.return);
					break;
				case 30:
					Lu(i, a, n), Tl(a, a.return);
					break;
				case 7: Tl(a, a.return);
				default: Lu(i, a, n);
			}
			t = t.sibling;
		}
	}
	function Ru(e, t) {
		var n = null;
		e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && ja(n));
	}
	function zu(e, t) {
		e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && ja(e));
	}
	function Bu(e, t, n, r) {
		var i = (n & 335544064) === n;
		if (t.subtreeFlags & (i ? 10262 : 10256)) for (t = t.child; t !== null;) Vu(e, t, n, r), t = t.sibling;
		else i && tu(t);
	}
	function Vu(e, t, n, r) {
		var i = (n & 335544064) === n;
		i && t.alternate === null && t.return !== null && t.return.alternate !== null && eu(t);
		var a = t.flags;
		switch (t.tag) {
			case 0:
			case 11:
			case 15:
				Bu(e, t, n, r), a & 2048 && xl(9, t);
				break;
			case 1:
				Bu(e, t, n, r);
				break;
			case 3:
				Bu(e, t, n, r), i && fu && (e = e.containerInfo, e = e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, e.style.viewTransitionName === "root" && (e.style.viewTransitionName = ""), e = e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "none" && (e.style.viewTransitionName = "")), a & 2048 && (a = null, t.alternate !== null && (a = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== a && (t.refCount++, a != null && ja(a)));
				break;
			case 12:
				if (a & 2048) {
					Bu(e, t, n, r), a = t.stateNode;
					try {
						var o = t.memoizedProps, s = o.id, c = o.onPostCommit;
						typeof c == "function" && c(s, t.alternate === null ? "mount" : "update", a.passiveEffectDuration, -0);
					} catch (e) {
						Z(t, t.return, e);
					}
				} else Bu(e, t, n, r);
				break;
			case 31:
				Bu(e, t, n, r);
				break;
			case 13:
				Bu(e, t, n, r);
				break;
			case 23: break;
			case 22:
				o = t.stateNode, s = t.alternate, t.memoizedState === null ? (i && s !== null && s.memoizedState !== null && eu(t), o._visibility & 2 ? Bu(e, t, n, r) : (o._visibility |= 2, Hu(e, t, n, r, !!(t.subtreeFlags & 10256) || !1))) : (i && s !== null && s.memoizedState === null && eu(s), o._visibility & 2 ? Bu(e, t, n, r) : Uu(e, t)), a & 2048 && Ru(s, t);
				break;
			case 24:
				Bu(e, t, n, r), a & 2048 && zu(t.alternate, t);
				break;
			case 30:
				i && (a = t.alternate, a !== null && (ql(a.child, !0), ql(t.child, !0))), Bu(e, t, n, r);
				break;
			default: Bu(e, t, n, r);
		}
	}
	function Hu(e, t, n, r, i) {
		for (i &&= !!(t.subtreeFlags & 10256) || !1, t = t.child; t !== null;) {
			var a = e, o = t, s = n, c = r, l = o.flags;
			switch (o.tag) {
				case 0:
				case 11:
				case 15:
					Hu(a, o, s, c, i), xl(8, o);
					break;
				case 23: break;
				case 22:
					var u = o.stateNode;
					o.memoizedState === null ? (u._visibility |= 2, Hu(a, o, s, c, i)) : u._visibility & 2 ? Hu(a, o, s, c, i) : Uu(a, o), i && l & 2048 && Ru(o.alternate, o);
					break;
				case 24:
					Hu(a, o, s, c, i), i && l & 2048 && zu(o.alternate, o);
					break;
				default: Hu(a, o, s, c, i);
			}
			t = t.sibling;
		}
	}
	function Uu(e, t) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) {
			var n = e, r = t, i = r.flags;
			switch (r.tag) {
				case 22:
					Uu(n, r), i & 2048 && Ru(r.alternate, r);
					break;
				case 24:
					Uu(n, r), i & 2048 && zu(r.alternate, r);
					break;
				default: Uu(n, r);
			}
			t = t.sibling;
		}
	}
	var Wu = 8192;
	function Gu(e, t, n) {
		if (e.subtreeFlags & Wu) for (e = e.child; e !== null;) Ku(e, t, n), e = e.sibling;
	}
	function Ku(e, t, n) {
		switch (e.tag) {
			case 26:
				Gu(e, t, n), e.flags & Wu && (e.memoizedState === null ? (e = e.stateNode, (t & 335544128) === t && Zm(n, e)) : Qm(n, ku, e.memoizedState, e.memoizedProps));
				break;
			case 5:
				Gu(e, t, n), e.flags & Wu && (e = e.stateNode, (t & 335544128) === t && Zm(n, e));
				break;
			case 3:
			case 4:
				var r = ku;
				ku = bm(e.stateNode.containerInfo), Gu(e, t, n), ku = r;
				break;
			case 22:
				e.memoizedState === null && (r = e.alternate, r !== null && r.memoizedState !== null ? (r = Wu, Wu = 16777216, Gu(e, t, n), Wu = r) : Gu(e, t, n));
				break;
			case 30:
				if ((e.flags & Wu) !== 0 && (r = e.memoizedProps.name, r != null && r !== "auto")) {
					var i = e.stateNode;
					i.paired = null, Bl === null && (Bl = /* @__PURE__ */ new Map()), Bl.set(r, i);
				}
				Gu(e, t, n);
				break;
			default: Gu(e, t, n);
		}
	}
	function qu(e) {
		var t = e.alternate;
		if (t !== null && (e = t.child, e !== null)) {
			t.child = null;
			do
				t = e.sibling, e.sibling = null, e = t;
			while (e !== null);
		}
	}
	function Ju(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				cu = r, Zu(r, e);
			}
			qu(e);
		}
		if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) Yu(e), e = e.sibling;
	}
	function Yu(e) {
		switch (e.tag) {
			case 0:
			case 11:
			case 15:
				Ju(e), e.flags & 2048 && Sl(9, e, e.return);
				break;
			case 3:
				Ju(e);
				break;
			case 12:
				Ju(e);
				break;
			case 22:
				var t = e.stateNode;
				e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, Xu(e)) : Ju(e);
				break;
			default: Ju(e);
		}
	}
	function Xu(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				cu = r, Zu(r, e);
			}
			qu(e);
		}
		for (e = e.child; e !== null;) {
			switch (t = e, t.tag) {
				case 0:
				case 11:
				case 15:
					Sl(8, t, t.return), Xu(t);
					break;
				case 22:
					n = t.stateNode, n._visibility & 2 && (n._visibility &= -3, Xu(t));
					break;
				default: Xu(t);
			}
			e = e.sibling;
		}
	}
	function Zu(e, t) {
		for (; cu !== null;) {
			var n = cu;
			switch (n.tag) {
				case 0:
				case 11:
				case 15:
					Sl(8, n, t);
					break;
				case 23:
				case 22:
					if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
						var r = n.memoizedState.cachePool.pool;
						r != null && r.refCount++;
					}
					break;
				case 24: ja(n.memoizedState.cache);
			}
			if (r = n.child, r !== null) r.return = n, cu = r;
			else a: for (n = e; cu !== null;) {
				r = cu;
				var i = r.sibling, a = r.return;
				if (yu(r), r === n) {
					cu = null;
					break a;
				}
				if (i !== null) {
					i.return = a, cu = i;
					break a;
				}
				cu = a;
			}
		}
	}
	var Qu = {
		getCacheForType: function(e) {
			var t = Ca(ka), n = t.data.get(e);
			return n === void 0 && (n = e(), t.data.set(e, n)), n;
		},
		cacheSignal: function() {
			return Ca(ka).controller.signal;
		}
	}, $u = typeof WeakMap == "function" ? WeakMap : Map, K = 0, q = null, J = null, Y = 0, X = 0, ed = null, td = !1, nd = !1, rd = !1, id = 0, ad = 0, od = 0, sd = 0, cd = 0, ld = 0, ud = 0, dd = null, fd = null, pd = !1, md = 0, hd = 0, gd = Infinity, _d = null, vd = null, yd = 0, bd = null, xd = null, Sd = 0, Cd = 0, wd = null, Td = null, Ed = null, Dd = null, Od = null, kd = 0, Ad = null;
	function jd() {
		return K & 2 && Y !== 0 ? Y & -Y : A.T === null ? wt() : Pf();
	}
	function Md() {
		if (ld === 0) {
			if (!(Y & 536870912) || H) {
				var e = ct;
				ct <<= 1, !(ct & 3932160) && (ct = 262144), ld = e;
			} else ld = 536870912;
		}
		return e = ko.current, e !== null && (e.flags |= 32), ld;
	}
	function Nd(e, t) {
		if (t != null) {
			var n = e.stateNode, r = n.ref;
			r === null && (r = n.ref = Pp(hi(e.memoizedProps, n))), Dd === null && (Dd = []), Dd.push(t.bind(null, r));
		}
	}
	function Pd(e, t, n) {
		(e === q && (X === 2 || X === 9) || e.cancelPendingCommit !== null) && (Vd(e, 0), Rd(e, Y, ld, !1)), _t(e, n), K & 2 && e === q || (e === q && (!(K & 2) && (sd |= n), ad === 4 && Rd(e, Y, ld, !1)), Ef(e));
	}
	function Fd(e, t, n) {
		if (K & 6) throw Error(i(327));
		var r = !n && !(t & 127) && (t & e.expiredLanes) === 0 || ft(e, t), a = r ? Yd(e, t) : qd(e, t, !0), o = r;
		do {
			if (a === 0) {
				nd && !r && Rd(e, t, 0, !1);
				break;
			}
			if (n = e.current.alternate, o && !Ld(n)) a = qd(e, t, !1), o = !1;
			else {
				if (a === 2) {
					if (o = t, e.errorRecoveryDisabledLanes & o) var s = 0;
					else s = e.pendingLanes & -536870913, s = s === 0 ? s & 536870912 ? 536870912 : 0 : s;
					if (s !== 0) {
						t = s;
						a: {
							var c = e;
							a = dd;
							var l = c.current.memoizedState.isDehydrated;
							if (l && (Vd(c, s).flags |= 256), s = qd(c, s, !1), s !== 2 && s !== 6) {
								if (rd && !l) {
									c.errorRecoveryDisabledLanes |= o, sd |= o, a = 4;
									break a;
								}
								o = fd, fd = a, o !== null && (fd === null ? fd = o : fd.push.apply(fd, o));
							}
							a = s;
						}
						if (o = !1, a !== 2) continue;
					}
				}
				if (a === 1) {
					Vd(e, 0), Rd(e, t, 0, !0);
					break;
				}
				a: {
					switch (r = e, o = a, o) {
						case 0:
						case 1: throw Error(i(345));
						case 4: if ((t & 4194048) !== t && (t & 62914560) !== t) break;
						case 6:
							Rd(r, t, ld, !td);
							break a;
						case 2:
							fd = null;
							break;
						case 3:
						case 5: break;
						default: throw Error(i(329));
					}
					if ((t & 62914560) === t && (a = md + 300 - Ge(), 10 < a)) {
						if (Rd(r, t, ld, !td), dt(r, 0, !0) !== 0) break a;
						Sd = t, r.timeoutHandle = gp(Id.bind(null, r, n, fd, _d, pd, t, ld, sd, ud, td, o, "Throttled", -0, 0), a);
						break a;
					}
					Id(r, n, fd, _d, pd, t, ld, sd, ud, td, o, null, -0, 0);
				}
				break;
			}
		} while (1);
		Ef(e);
	}
	function Id(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
		e.timeoutHandle = -1;
		var m = t.subtreeFlags, h = (a & 335544064) === a;
		d = null, (h || m & 8192 || (m & 16785408) == 16785408) && (d = {
			stylesheets: null,
			count: 0,
			imgCount: 0,
			imgBytes: 0,
			suspenseyImages: [],
			waitingForImages: !0,
			waitingForViewTransition: !1,
			unsuspend: vn
		}, Bl = null, Ku(t, a, d), h && (m = d, h = e.containerInfo, h = (h.nodeType === 9 ? h : h.ownerDocument).__reactViewTransition, h != null && (m.count++, m.waitingForViewTransition = !0, m = nh.bind(m), h.finished.then(m, m))), m = (a & 62914560) === a ? md - Ge() : (a & 4194048) === a ? hd - Ge() : 0, m = eh(d, m), m !== null) ? (Sd = a, e.cancelPendingCommit = m(nf.bind(null, e, t, a, n, r, i, o, s, c, l, u, d, null, f, p)), Rd(e, a, o, !l)) : nf(e, t, a, n, r, i, o, s, c, l, u, d);
	}
	function Ld(e) {
		for (var t = e;;) {
			var n = t.tag;
			if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null))) for (var r = 0; r < n.length; r++) {
				var i = n[r], a = i.getSnapshot;
				i = i.value;
				try {
					if (!zr(a(), i)) return !1;
				} catch {
					return !1;
				}
			}
			if (n = t.child, t.subtreeFlags & 16384 && n !== null) n.return = t, t = n;
			else {
				if (t === e) break;
				for (; t.sibling === null;) {
					if (t.return === null || t.return === e) return !0;
					t = t.return;
				}
				t.sibling.return = t.return, t = t.sibling;
			}
		}
		return !0;
	}
	function Rd(e, t, n, r) {
		t = pt(e, t), t &= ~cd, t &= ~sd, e.suspendedLanes |= t, e.pingedLanes &= ~t, r && (e.warmLanes |= t), r = e.expirationTimes;
		for (var i = t; 0 < i;) {
			var a = 31 - rt(i), o = 1 << a;
			r[a] = -1, i &= ~o;
		}
		n !== 0 && yt(e, n, t);
	}
	function zd() {
		return K & 6 ? !0 : (Df(0, !1), !1);
	}
	function Bd() {
		if (J !== null) {
			if (X === 0) var e = J.return;
			else e = J, ha = ma = null, rs(e), ro = null, io = 0, e = J;
			for (; e !== null;) bl(e.alternate, e), e = e.return;
			J = null;
		}
	}
	function Vd(e, t) {
		var n = e.timeoutHandle;
		return n !== -1 && (e.timeoutHandle = -1, _p(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), Sd = 0, Bd(), q = e, J = n = Mi(e.current, null), Y = t, X = 0, ed = null, td = !1, nd = ft(e, t), rd = !1, ud = ld = cd = sd = od = ad = 0, fd = dd = null, pd = !1, id = pt(e, t), Si(), n;
	}
	function Hd(e, t) {
		U = null, A.H = pc, t === qa || t === Ya ? (t = to(), X = 3) : t === Ja ? (t = to(), X = 4) : X = t === jc ? 8 : typeof t == "object" && t && typeof t.then == "function" ? 6 : 1, ed = t, J === null && (ad = 1, Tc(e, Bi(t, e.current)));
	}
	function Ud() {
		var e = ko.current;
		return e === null ? !0 : (Y & 4194048) === Y ? Ao === null : (Y & 62914560) === Y || Y & 536870912 ? e === Ao : !1;
	}
	function Wd() {
		var e = A.H;
		return A.H = pc, e === null ? pc : e;
	}
	function Gd() {
		var e = A.A;
		return A.A = Qu, e;
	}
	function Kd() {
		ad = 4, td || (Y & 4194048) !== Y && ko.current !== null || (nd = !0), !(od & 134217727) && !(sd & 134217727) || q === null || Rd(q, Y, ld, !1);
	}
	function qd(e, t, n) {
		var r = K;
		K |= 2;
		var i = Wd(), a = Gd();
		(q !== e || Y !== t) && (_d = null, Vd(e, t)), t = !1;
		var o = ad;
		a: do
			try {
				if (X !== 0 && J !== null) {
					var s = J, c = ed;
					switch (X) {
						case 8:
							Bd(), o = 6;
							break a;
						case 3:
						case 2:
						case 9:
						case 6:
							ko.current === null && (t = !0);
							var l = X;
							if (X = 0, ed = null, $d(e, s, c, l), n && nd) {
								o = 0;
								break a;
							}
							break;
						default: l = X, X = 0, ed = null, $d(e, s, c, l);
					}
				}
				Jd(), o = ad;
				break;
			} catch (t) {
				Hd(e, t);
			}
		while (1);
		return t && e.shellSuspendCounter++, ha = ma = null, K = r, A.H = i, A.A = a, J === null && (q = null, Y = 0, Si()), o;
	}
	function Jd() {
		for (; J !== null;) Zd(J);
	}
	function Yd(e, t) {
		var n = K;
		K |= 2;
		var r = Wd(), a = Gd();
		q !== e || Y !== t ? (_d = null, gd = Ge() + 500, Vd(e, t)) : nd = ft(e, t);
		a: do
			try {
				if (X !== 0 && J !== null) {
					t = J;
					var o = ed;
					b: switch (X) {
						case 1:
							X = 0, ed = null, $d(e, t, o, 1);
							break;
						case 2:
						case 9:
							if (Za(o)) {
								X = 0, ed = null, Qd(t);
								break;
							}
							t = function() {
								X !== 2 && X !== 9 || q !== e || (X = 7), Ef(e);
							}, o.then(t, t);
							break a;
						case 3:
							X = 7;
							break a;
						case 4:
							X = 5;
							break a;
						case 7:
							Za(o) ? (X = 0, ed = null, Qd(t)) : (X = 0, ed = null, $d(e, t, o, 7));
							break;
						case 5:
							var s = null;
							switch (J.tag) {
								case 26: s = J.memoizedState;
								case 5:
								case 27:
									var c = J;
									if (s ? Ym(s) : c.stateNode.complete) {
										X = 0, ed = null;
										var l = c.sibling;
										if (l !== null) J = l;
										else {
											var u = c.return;
											u === null ? J = null : (J = u, ef(u));
										}
										break b;
									}
							}
							X = 0, ed = null, $d(e, t, o, 5);
							break;
						case 6:
							X = 0, ed = null, $d(e, t, o, 6);
							break;
						case 8:
							Bd(), ad = 6;
							break a;
						default: throw Error(i(462));
					}
				}
				Xd();
				break;
			} catch (t) {
				Hd(e, t);
			}
		while (1);
		return ha = ma = null, A.H = r, A.A = a, K = n, J === null ? (q = null, Y = 0, Si(), ad) : 0;
	}
	function Xd() {
		for (; J !== null && !Ue();) Zd(J);
	}
	function Zd(e) {
		var t = dl(e.alternate, e, id);
		e.memoizedProps = e.pendingProps, t === null ? ef(e) : J = t;
	}
	function Qd(e) {
		var t = e, n = t.alternate;
		switch (t.tag) {
			case 15:
			case 0:
				t = Gc(n, t, t.pendingProps, t.type, void 0, Y);
				break;
			case 11:
				t = Gc(n, t, t.pendingProps, t.type.render, t.ref, Y);
				break;
			case 5:
				rs(t);
				var r = t;
				r === ta && (H ? (ca(r), r.tag === 5 && r.stateNode != null && (na = r.stateNode)) : (ca(r), H = !0));
			default: bl(n, t), t = J = Ni(t, id), t = dl(n, t, id);
		}
		e.memoizedProps = e.pendingProps, t === null ? ef(e) : J = t;
	}
	function $d(e, t, n, r) {
		ha = ma = null, rs(t), ro = null, io = 0;
		var i = t.return;
		try {
			if (Ac(e, i, t, n, Y)) {
				ad = 1, Tc(e, Bi(n, e.current)), J = null;
				return;
			}
		} catch (t) {
			if (i !== null) throw J = i, t;
			ad = 1, Tc(e, Bi(n, e.current)), J = null;
			return;
		}
		t.flags & 32768 ? (H || r === 1 ? e = !0 : nd || Y & 536870912 ? e = !1 : (td = e = !0, (r === 2 || r === 9 || r === 3 || r === 6) && (r = ko.current, r !== null && r.tag === 13 && (r.flags |= 16384))), tf(t, e)) : ef(t);
	}
	function ef(e) {
		var t = e;
		do {
			if (t.flags & 32768) {
				tf(t, td);
				return;
			}
			e = t.return;
			var n = vl(t.alternate, t, id);
			if (n !== null) {
				J = n;
				return;
			}
			if (t = t.sibling, t !== null) {
				J = t;
				return;
			}
			J = t = e;
		} while (t !== null);
		ad === 0 && (ad = 5);
	}
	function tf(e, t) {
		do {
			var n = yl(e.alternate, e);
			if (n !== null) {
				n.flags &= 32767, J = n;
				return;
			}
			if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
				J = e;
				return;
			}
			J = e = n;
		} while (e !== null);
		ad = 6, J = null;
	}
	function nf(e, t, n, r, a, o, s, c, l, u, d, f) {
		e.cancelPendingCommit = null;
		do
			df();
		while (yd !== 0);
		if (K & 6) throw Error(i(327));
		if (t !== null) {
			if (t === e.current) throw Error(i(177));
			e === q && (J = q = null, Y = 0), xd = t, bd = e, Sd = n, wd = a, Td = r, rf(e, t, n, s, c, l, f);
		}
	}
	function rf(e, t, n, r, i, a, o) {
		var s = t.lanes | t.childLanes;
		if (Cd = s, s |= xi, vt(e, n, s, r, i, a), Dd = null, (n & 335544064) === n ? (Od = Pa(e), r = 10262) : (Od = null, r = 10256), (t.subtreeFlags & r) !== 0 || (t.flags & r) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, yf(Ye, function() {
			return ff(), null;
		})) : (e.callbackNode = null, e.callbackPriority = 0), zl = !1, r = !!(t.flags & 13878), t.subtreeFlags & 13878 || r) {
			r = A.T, A.T = null, i = j.p, j.p = 2, a = K, K |= 4;
			try {
				pu(e, t, n);
			} finally {
				K = a, j.p = i, A.T = r;
			}
		}
		yd = 1, zl ? Ed = Mp(o, e.containerInfo, Od, sf, cf, of, lf, ff, af, null, null) : (sf(), cf(), lf());
	}
	function af(e) {
		if (yd !== 0) {
			var t = bd.onRecoverableError;
			t(e, { componentStack: null });
		}
	}
	function of() {
		yd === 3 && (yd = 0, Pu(xd, bd), yd = 4);
	}
	function sf() {
		if (yd === 1) {
			yd = 0;
			var e = bd, t = xd, n = Sd, r = !!(t.flags & 13878);
			if (t.subtreeFlags & 13878 || r) {
				r = A.T, A.T = null;
				var i = j.p;
				j.p = 2;
				var a = K;
				K |= 4;
				try {
					uu = du = !1, Au(t, e, n), n = cp;
					var o = Gr(e.containerInfo), s = n.focusedElem, c = n.selectionRange;
					if (o !== s && s && s.ownerDocument && Wr(s.ownerDocument.documentElement, s)) {
						if (c !== null && Kr(s)) {
							var l = c.start, u = c.end;
							if (u === void 0 && (u = l), "selectionStart" in s) s.selectionStart = l, s.selectionEnd = Math.min(u, s.value.length);
							else {
								var d = s.ownerDocument || document, f = d && d.defaultView || window;
								if (f.getSelection) {
									var p = f.getSelection(), m = s.textContent.length, h = Math.min(c.start, m), g = c.end === void 0 ? h : Math.min(c.end, m);
									!p.extend && h > g && (o = g, g = h, h = o);
									var _ = Ur(s, h), v = Ur(s, g);
									if (_ && v && (p.rangeCount !== 1 || p.anchorNode !== _.node || p.anchorOffset !== _.offset || p.focusNode !== v.node || p.focusOffset !== v.offset)) {
										var y = d.createRange();
										y.setStart(_.node, _.offset), p.removeAllRanges(), h > g ? (p.addRange(y), p.extend(v.node, v.offset)) : (y.setEnd(v.node, v.offset), p.addRange(y));
									}
								}
							}
						}
						for (d = [], p = s; p = p.parentNode;) p.nodeType === 1 && d.push({
							element: p,
							left: p.scrollLeft,
							top: p.scrollTop
						});
						for (typeof s.focus == "function" && s.focus(), s = 0; s < d.length; s++) {
							var b = d[s];
							b.element.scrollLeft = b.left, b.element.scrollTop = b.top;
						}
					}
					gh = !!sp, cp = sp = null;
				} finally {
					K = a, j.p = i, A.T = r;
				}
			}
			e.current = t, yd = 2;
		}
	}
	function cf() {
		if (yd === 2) {
			yd = 0;
			var e = bd, t = xd, n = !!(t.flags & 8772);
			if (t.subtreeFlags & 8772 || n) {
				n = A.T, A.T = null;
				var r = j.p;
				j.p = 2;
				var i = K;
				K |= 4;
				try {
					hu(e, t.alternate, t);
				} finally {
					K = i, j.p = r, A.T = n;
				}
			}
			yd = 3;
		}
	}
	function lf() {
		if (yd === 4 || yd === 3) {
			yd = 0;
			var e = Ed;
			Ed = null, We();
			var t = bd, n = xd, r = Sd, i = Td, a = (r & 335544064) === r ? 10262 : 10256;
			if ((n.subtreeFlags & a) !== 0 || (n.flags & a) !== 0 ? yd = 5 : (yd = 0, xd = bd = null, uf(t, t.pendingLanes)), a = t.pendingLanes, a === 0 && (vd = null), Ct(r), n = n.stateNode, tt && typeof tt.onCommitFiberRoot == "function") try {
				tt.onCommitFiberRoot(et, n, void 0, (n.current.flags & 128) == 128);
			} catch {}
			if (i !== null) {
				n = A.T, a = j.p, j.p = 2, A.T = null;
				try {
					for (var o = t.onRecoverableError, s = 0; s < i.length; s++) {
						var c = i[s];
						o(c.value, { componentStack: c.stack });
					}
				} finally {
					A.T = n, j.p = a;
				}
			}
			if (i = Dd, o = Od, Od = null, i !== null && (Dd = null, o === null && (o = []), e !== null)) for (c = 0; c < i.length; c++) n = (0, i[c])(o), n !== void 0 && e.finished.finally(n);
			Sd & 3 && df(), Ef(t), a = t.pendingLanes, r & 261930 && a & 42 ? t === Ad ? kd++ : (kd = 0, Ad = t) : (kd = 0, Ad = null), Df(0, !1);
		}
	}
	function uf(e, t) {
		(e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, ja(t)));
	}
	function df() {
		return Ed !== null && (Ed.skipTransition(), Ed = null), sf(), cf(), lf(), ff();
	}
	function ff() {
		if (yd !== 5) return !1;
		var e = bd, t = Cd;
		Cd = 0;
		var n = Ct(Sd), r = A.T, a = j.p;
		try {
			j.p = 32 > n ? 32 : n, A.T = null, n = wd, wd = null;
			var o = bd, s = Sd;
			if (yd = 0, xd = bd = null, Sd = 0, K & 6) throw Error(i(331));
			var c = K;
			if (K |= 4, Yu(o.current), Vu(o, o.current, s, n), K = c, Df(0, !1), tt && typeof tt.onPostCommitFiberRoot == "function") try {
				tt.onPostCommitFiberRoot(et, o);
			} catch {}
			return !0;
		} finally {
			j.p = a, A.T = r, uf(e, t);
		}
	}
	function pf(e, t, n) {
		t = Bi(n, t), t = Dc(e.stateNode, t, 2), e = go(e, t, 2), e !== null && (_t(e, 2), Ef(e));
	}
	function Z(e, t, n) {
		if (e.tag === 3) pf(e, e, n);
		else for (; t !== null;) {
			if (t.tag === 3) {
				pf(t, e, n);
				break;
			}
			if (t.tag === 1) {
				var r = t.stateNode;
				if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (vd === null || !vd.has(r))) {
					e = Bi(n, e), n = Oc(2), r = go(t, n, 2), r !== null && (kc(n, r, t, e), _t(r, 2), Ef(r));
					break;
				}
			}
			t = t.return;
		}
	}
	function mf(e, t, n) {
		var r = e.pingCache;
		if (r === null) {
			r = e.pingCache = new $u();
			var i = /* @__PURE__ */ new Set();
			r.set(t, i);
		} else i = r.get(t), i === void 0 && (i = /* @__PURE__ */ new Set(), r.set(t, i));
		i.has(n) || (rd = !0, i.add(n), e = hf.bind(null, e, t, n), t.then(e, e));
	}
	function hf(e, t, n) {
		var r = e.pingCache;
		r !== null && r.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, q === e && (Y & n) === n && (ad === 4 || ad === 3 && (Y & 62914560) === Y && 300 > Ge() - md ? K & 2 ? cd |= n : Vd(e, 0) : cd |= n, ud === Y && (ud = 0)), Ef(e);
	}
	function gf(e, t) {
		t === 0 && (t = ht()), e = Ti(e, t), e !== null && (_t(e, t), Ef(e));
	}
	function _f(e) {
		var t = e.memoizedState, n = 0;
		t !== null && (n = t.retryLane), gf(e, n);
	}
	function vf(e, t) {
		var n = 0;
		switch (e.tag) {
			case 31:
			case 13:
				var r = e.stateNode, a = e.memoizedState;
				a !== null && (n = a.retryLane);
				break;
			case 19:
				r = e.stateNode;
				break;
			case 22:
				r = e.stateNode._retryCache;
				break;
			default: throw Error(i(314));
		}
		r !== null && r.delete(t), gf(e, n);
	}
	function yf(e, t) {
		return Ve(e, t);
	}
	var bf = null, xf = null, Sf = !1, Cf = !1, wf = !1, Tf = 0;
	function Ef(e) {
		e !== xf && e.next === null && (xf === null ? bf = xf = e : xf = xf.next = e), Cf = !0, Sf || (Sf = !0, Nf());
	}
	function Df(e, t) {
		if (!wf && Cf) {
			wf = !0;
			do
				for (var n = !1, r = bf; r !== null;) {
					if (!t) {
						if (e !== 0) {
							var i = r.pendingLanes;
							if (i === 0) var a = 0;
							else {
								var o = r.suspendedLanes, s = r.pingedLanes;
								a = (1 << 31 - rt(42 | e) + 1) - 1, a &= i & ~(o & ~s), a = a & 201326741 ? a & 201326741 | 1 : a ? a | 2 : 0;
							}
							a !== 0 && (n = !0, Mf(r, a));
						} else a = Y, a = dt(r, r === q ? a : 0, r.cancelPendingCommit !== null || r.timeoutHandle !== -1), !(a & 3) || ft(r, a) || (n = !0, Mf(r, a));
					}
					r = r.next;
				}
			while (n);
			wf = !1;
		}
	}
	function Of() {
		kf();
	}
	function kf() {
		Cf = Sf = !1;
		var e = 0;
		Tf !== 0 && hp() && (e = Tf);
		for (var t = Ge(), n = null, r = bf; r !== null;) {
			var i = r.next, a = Af(r, t);
			a === 0 ? (r.next = null, n === null ? bf = i : n.next = i, i === null && (xf = n)) : (n = r, (e !== 0 || a & 3) && (Cf = !0)), r = i;
		}
		yd !== 0 && yd !== 5 || Df(e, !1), Tf !== 0 && (Tf = 0);
	}
	function Af(e, t) {
		for (var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, a = e.pendingLanes & -62914561; 0 < a;) {
			var o = 31 - rt(a), s = 1 << o, c = i[o];
			c === -1 ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = mt(s, t)) : c <= t && (e.expiredLanes |= s), a &= ~s;
		}
		if (t = q, n = Y, n = dt(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r = e.callbackNode, n === 0 || e === t && (X === 2 || X === 9) || e.cancelPendingCommit !== null) return r !== null && r !== null && He(r), e.callbackNode = null, e.callbackPriority = 0;
		if (!(n & 3) || ft(e, n)) {
			if (t = n & -n, t === e.callbackPriority) return t;
			switch (r !== null && He(r), Ct(n)) {
				case 2:
				case 8:
					n = Je;
					break;
				case 32:
					n = Ye;
					break;
				case 268435456:
					n = Ze;
					break;
				default: n = Ye;
			}
			return r = jf.bind(null, e), n = Ve(n, r), e.callbackPriority = t, e.callbackNode = n, t;
		}
		return r !== null && r !== null && He(r), e.callbackPriority = 2, e.callbackNode = null, 2;
	}
	function jf(e, t) {
		if (yd !== 0 && yd !== 5) return e.callbackNode = null, e.callbackPriority = 0, null;
		var n = e.callbackNode;
		if (df() && e.callbackNode !== n) return null;
		var r = Y;
		return r = dt(e, e === q ? r : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r === 0 ? null : (Fd(e, r, t), Af(e, Ge()), e.callbackNode != null && e.callbackNode === n ? jf.bind(null, e) : null);
	}
	function Mf(e, t) {
		if (df()) return null;
		Fd(e, t, !0);
	}
	function Nf() {
		bp(function() {
			K & 6 ? Ve(qe, Of) : kf();
		});
	}
	function Pf() {
		if (Tf === 0) {
			var e = La;
			e === 0 && (e = st, st <<= 1, !(st & 261888) && (st = 256)), Tf = e;
		}
		return Tf;
	}
	function Ff(e) {
		return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : _n(e);
	}
	function If(e, t, n, r, i) {
		if (t === "submit" && n && n.stateNode === i) {
			var a = Ff((i[Et] || null).action), o = r.submitter;
			o && (t = (t = o[Et] || null) ? Ff(t.formAction) : o.getAttribute("formAction"), t !== null && (a = t, o = null));
			var s = new Rn("action", "action", null, r, i);
			e.push({
				event: s,
				listeners: [{
					instance: null,
					listener: function() {
						if (r.defaultPrevented) {
							if (Tf !== 0) {
								var e = new FormData(i, o);
								$s(n, {
									pending: !0,
									data: e,
									method: i.method,
									action: a
								}, null, e);
							}
						} else typeof a == "function" && (s.preventDefault(), e = new FormData(i, o), $s(n, {
							pending: !0,
							data: e,
							method: i.method,
							action: a
						}, a, e));
					},
					currentTarget: i
				}]
			});
		}
	}
	for (var Lf = 0; Lf < fi.length; Lf++) {
		var Rf = fi[Lf];
		pi(Rf.toLowerCase(), "on" + (Rf[0].toUpperCase() + Rf.slice(1)));
	}
	pi(ii, "onAnimationEnd"), pi(ai, "onAnimationIteration"), pi(oi, "onAnimationStart"), pi("dblclick", "onDoubleClick"), pi("focusin", "onFocus"), pi("focusout", "onBlur"), pi(si, "onTransitionRun"), pi(ci, "onTransitionStart"), pi(li, "onTransitionCancel"), pi(ui, "onTransitionEnd"), Wt("onMouseEnter", ["mouseout", "mouseover"]), Wt("onMouseLeave", ["mouseout", "mouseover"]), Wt("onPointerEnter", ["pointerout", "pointerover"]), Wt("onPointerLeave", ["pointerout", "pointerover"]), Ut("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), Ut("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), Ut("onBeforeInput", [
		"compositionend",
		"keypress",
		"textInput",
		"paste"
	]), Ut("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), Ut("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), Ut("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
	var zf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Bf = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(zf));
	function Vf(e, t) {
		t = !!(t & 4);
		for (var n = 0; n < e.length; n++) {
			var r = e[n], i = r.event;
			r = r.listeners;
			a: {
				var a = void 0;
				if (t) for (var o = r.length - 1; 0 <= o; o--) {
					var s = r[o], c = s.instance, l = s.currentTarget;
					if (s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						vi(e);
					}
					i.currentTarget = null, a = c;
				}
				else for (o = 0; o < r.length; o++) {
					if (s = r[o], c = s.instance, l = s.currentTarget, s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						vi(e);
					}
					i.currentTarget = null, a = c;
				}
			}
		}
	}
	function Q(e, t) {
		var n = t[Ot];
		n === void 0 && (n = t[Ot] = /* @__PURE__ */ new Set());
		var r = e + "__bubble";
		n.has(r) || (Gf(t, e, 2, !1), n.add(r));
	}
	function Hf(e, t, n) {
		var r = 0;
		t && (r |= 4), Gf(n, e, r, t);
	}
	var Uf = "_reactListening" + Math.random().toString(36).slice(2);
	function Wf(e) {
		if (!e[Uf]) {
			e[Uf] = !0, Vt.forEach(function(t) {
				t !== "selectionchange" && (Bf.has(t) || Hf(t, !1, e), Hf(t, !0, e));
			});
			var t = e.nodeType === 9 ? e : e.ownerDocument;
			t === null || t[Uf] || (t[Uf] = !0, Hf("selectionchange", !1, t));
		}
	}
	function Gf(e, t, n, r) {
		switch (Ch(t)) {
			case 2:
				var i = _h;
				break;
			case 8:
				i = vh;
				break;
			default: i = yh;
		}
		n = i.bind(null, t, n, e), i = void 0, !Dn || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), r ? i === void 0 ? e.addEventListener(t, n, !0) : e.addEventListener(t, n, {
			capture: !0,
			passive: i
		}) : i === void 0 ? e.addEventListener(t, n, !1) : e.addEventListener(t, n, { passive: i });
	}
	function Kf(e, t, n, r, i) {
		var a = r;
		if (!(t & 1) && !(t & 2) && r !== null) a: for (;;) {
			if (r === null) return;
			var s = r.tag;
			if (s === 3 || s === 4) {
				var c = r.stateNode.containerInfo;
				if (c === i) break;
				if (s === 4) for (s = r.return; s !== null;) {
					var l = s.tag;
					if ((l === 3 || l === 4) && s.stateNode.containerInfo === i) return;
					s = s.return;
				}
				for (; c !== null;) {
					if (s = Ft(c), s === null) return;
					if (l = s.tag, l === 5 || l === 6 || l === 26 || l === 27) {
						r = a = s;
						continue a;
					}
					c = c.parentNode;
				}
			}
			r = r.return;
		}
		wn(function() {
			var r = a, i = yn(n), s = [];
			a: {
				var c = di.get(e);
				if (c !== void 0) {
					var l = Rn, u = e;
					switch (e) {
						case "keypress": if (Nn(n) === 0) break a;
						case "keydown":
						case "keyup":
							l = tr;
							break;
						case "focusin":
							u = "focus", l = Kn;
							break;
						case "focusout":
							u = "blur", l = Kn;
							break;
						case "beforeblur":
						case "afterblur":
							l = Kn;
							break;
						case "click": if (n.button === 2) break a;
						case "auxclick":
						case "dblclick":
						case "mousedown":
						case "mousemove":
						case "mouseup":
						case "mouseout":
						case "mouseover":
						case "contextmenu":
							l = Wn;
							break;
						case "drag":
						case "dragend":
						case "dragenter":
						case "dragexit":
						case "dragleave":
						case "dragover":
						case "dragstart":
						case "drop":
							l = Gn;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							l = ir;
							break;
						case ii:
						case ai:
						case oi:
							l = qn;
							break;
						case ui:
							l = ar;
							break;
						case "scroll":
						case "scrollend":
							l = zn;
							break;
						case "wheel":
							l = or;
							break;
						case "copy":
						case "cut":
						case "paste":
							l = Jn;
							break;
						case "gotpointercapture":
						case "lostpointercapture":
						case "pointercancel":
						case "pointerdown":
						case "pointermove":
						case "pointerout":
						case "pointerover":
						case "pointerup":
							l = nr;
							break;
						case "submit":
							l = rr;
							break;
						case "toggle":
						case "beforetoggle": l = sr;
					}
					var d = !!(t & 4), f = !d && (e === "scroll" || e === "scrollend"), p = d ? c === null ? null : c + "Capture" : c;
					d = [];
					for (var m = r, h; m !== null;) {
						var g = m;
						if (h = g.stateNode, g = g.tag, g !== 5 && g !== 26 && g !== 27 || h === null || p === null || (g = Tn(m, p), g != null && d.push(qf(m, g, h))), f) break;
						m = m.return;
					}
					0 < d.length && (c = new l(c, u, null, n, i), s.push({
						event: c,
						listeners: d
					}));
				}
			}
			if (!(t & 7)) {
				a: {
					if (l = e === "mouseover" || e === "pointerover", c = e === "mouseout" || e === "pointerout", l && n !== B && (u = n.relatedTarget || n.fromElement) && (Ft(u) || u[Dt])) break a;
					(c || l) && (u = i.window === i ? i : (l = i.ownerDocument) ? l.defaultView || l.parentWindow : window, c ? (l = n.relatedTarget || n.toElement, c = r, l = l ? Ft(l) : null, l !== null && (f = o(l), d = l.tag, l !== f || d !== 5 && d !== 27 && d !== 6) && (l = null)) : (c = null, l = r), c !== l && (d = Wn, g = "onMouseLeave", p = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (d = nr, g = "onPointerLeave", p = "onPointerEnter", m = "pointer"), f = c == null ? u : Lt(c), h = l == null ? u : Lt(l), u = new d(g, m + "leave", c, n, i), u.target = f, u.relatedTarget = h, g = null, Ft(i) === r && (d = new d(p, m + "enter", l, n, i), d.target = h, d.relatedTarget = f, g = d), f = g, d = c && l ? ee(c, l, Yf) : null, c !== null && Xf(s, u, c, d, !1), l !== null && f !== null && Xf(s, f, l, d, !0)));
				}
				a: {
					if (c = r ? Lt(r) : window, l = c.nodeName && c.nodeName.toLowerCase(), l === "select" || l === "input" && c.type === "file") var _ = Dr;
					else if (xr(c)) {
						if (Or) _ = Lr;
						else {
							_ = Fr;
							var v = Pr;
						}
					} else l = c.nodeName, !l || l.toLowerCase() !== "input" || c.type !== "checkbox" && c.type !== "radio" ? r && mn(r.elementType) && (_ = Dr) : _ = Ir;
					if (_ &&= _(e, r)) {
						Sr(s, _, n, i);
						break a;
					}
					v && v(e, c, r);
				}
				switch (v = r ? Lt(r) : window, e) {
					case "focusin":
						(xr(v) || v.contentEditable === "true") && (Jr = v, Yr = r, Xr = null);
						break;
					case "focusout":
						Xr = Yr = Jr = null;
						break;
					case "mousedown":
						Zr = !0;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						Zr = !1, Qr(s, n, i);
						break;
					case "selectionchange": if (qr) break;
					case "keydown":
					case "keyup": Qr(s, n, i);
				}
				var y;
				if (lr) b: {
					switch (e) {
						case "compositionstart":
							var b = "onCompositionStart";
							break b;
						case "compositionend":
							b = "onCompositionEnd";
							break b;
						case "compositionupdate":
							b = "onCompositionUpdate";
							break b;
					}
					b = void 0;
				}
				else _r ? hr(e, n) && (b = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (b = "onCompositionStart");
				b && (fr && n.locale !== "ko" && (_r || b !== "onCompositionStart" ? b === "onCompositionEnd" && _r && (y = Mn()) : (kn = i, An = "value" in kn ? kn.value : kn.textContent, _r = !0)), v = Jf(r, b), 0 < v.length && (b = new Yn(b, e, null, n, i), s.push({
					event: b,
					listeners: v
				}), y ? b.data = y : (y = gr(n), y !== null && (b.data = y)))), (y = dr ? vr(e, n) : yr(e, n)) && (b = Jf(r, "onBeforeInput"), 0 < b.length && (v = new Yn("onBeforeInput", "beforeinput", null, n, i), s.push({
					event: v,
					listeners: b
				}), v.data = y)), If(s, e, r, n, i);
			}
			Vf(s, t);
		});
	}
	function qf(e, t, n) {
		return {
			instance: e,
			listener: t,
			currentTarget: n
		};
	}
	function Jf(e, t) {
		for (var n = t + "Capture", r = []; e !== null;) {
			var i = e, a = i.stateNode;
			if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || a === null || (i = Tn(e, n), i != null && r.unshift(qf(e, i, a)), i = Tn(e, t), i != null && r.push(qf(e, i, a))), e.tag === 3) return r;
			e = e.return;
		}
		return [];
	}
	function Yf(e) {
		if (e === null) return null;
		do
			e = e.return;
		while (e && e.tag !== 5 && e.tag !== 27);
		return e || null;
	}
	function Xf(e, t, n, r, i) {
		for (var a = t._reactName, o = []; n !== null && n !== r;) {
			var s = n, c = s.alternate, l = s.stateNode;
			if (s = s.tag, c !== null && c === r) break;
			s !== 5 && s !== 26 && s !== 27 || l === null || (c = l, i ? (l = Tn(n, a), l != null && o.unshift(qf(n, l, c))) : i || (l = Tn(n, a), l != null && o.push(qf(n, l, c)))), n = n.return;
		}
		o.length !== 0 && e.push({
			event: t,
			listeners: o
		});
	}
	var Zf = /\r\n?/g, Qf = /\u0000|\uFFFD/g;
	function $f(e) {
		return (typeof e == "string" ? e : "" + e).replace(Zf, "\n").replace(Qf, "");
	}
	function ep(e, t) {
		return t = $f(t), $f(e) === t;
	}
	function $(e, t, n, r, a, o) {
		switch (n) {
			case "children":
				if (typeof r == "string") t === "body" || t === "textarea" && r === "" || un(e, r);
				else if (typeof r == "number" || typeof r == "bigint") t !== "body" && un(e, "" + r);
				else return;
				break;
			case "className":
				Xt(e, "class", r);
				break;
			case "tabIndex":
				Xt(e, "tabindex", r);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				Xt(e, n, r);
				break;
			case "style":
				pn(e, r, o);
				return;
			case "data": if (t !== "object") {
				Xt(e, "data", r);
				break;
			}
			case "src":
			case "href":
				if (r === "" && (t !== "a" || n !== "href") || r == null || typeof r == "function" || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = _n(r), e.setAttribute(n, r);
				break;
			case "action":
			case "formAction":
				if (typeof r == "function") {
					e.setAttribute(n, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
					break;
				}
				if (typeof o == "function" && (n === "formAction" ? (t !== "input" && $(e, t, "name", a.name, a, null), $(e, t, "formEncType", a.formEncType, a, null), $(e, t, "formMethod", a.formMethod, a, null), $(e, t, "formTarget", a.formTarget, a, null)) : ($(e, t, "encType", a.encType, a, null), $(e, t, "method", a.method, a, null), $(e, t, "target", a.target, a, null))), r == null || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = _n(r), e.setAttribute(n, r);
				break;
			case "onClick":
				r != null && (e.onclick = vn);
				return;
			case "onScroll":
				r != null && Q("scroll", e);
				return;
			case "onScrollEnd":
				r != null && Q("scrollend", e);
				return;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(i(61));
					if (n = r.__html, n != null) {
						if (a.children != null) throw Error(i(60));
						o?.__html !== n && (e.innerHTML = n);
					}
				}
				break;
			case "multiple":
				e.multiple = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "muted":
				e.muted = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "defaultValue":
			case "defaultChecked":
			case "innerHTML":
			case "ref": break;
			case "autoFocus": break;
			case "xlinkHref":
				if (r == null || typeof r == "function" || typeof r == "boolean" || typeof r == "symbol") {
					e.removeAttribute("xlink:href");
					break;
				}
				n = _n(r), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n);
				break;
			case "contentEditable":
			case "spellCheck":
			case "draggable":
			case "value":
			case "autoReverse":
			case "externalResourcesRequired":
			case "focusable":
			case "preserveAlpha":
				r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "inert":
			case "allowFullScreen":
			case "async":
			case "autoPlay":
			case "controls":
			case "credentialless":
			case "default":
			case "defer":
			case "disabled":
			case "disablePictureInPicture":
			case "disableRemotePlayback":
			case "formNoValidate":
			case "hidden":
			case "loop":
			case "noModule":
			case "noValidate":
			case "open":
			case "playsInline":
			case "readOnly":
			case "required":
			case "reversed":
			case "scoped":
			case "seamless":
			case "itemScope":
				r && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, "") : e.removeAttribute(n);
				break;
			case "capture":
			case "download":
				!0 === r ? e.setAttribute(n, "") : !1 !== r && r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "cols":
			case "rows":
			case "size":
			case "span":
				r != null && typeof r != "function" && typeof r != "symbol" && !isNaN(r) && 1 <= r ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "rowSpan":
			case "start":
				r == null || typeof r == "function" || typeof r == "symbol" || isNaN(r) ? e.removeAttribute(n) : e.setAttribute(n, r);
				break;
			case "popover":
				Q("beforetoggle", e), Q("toggle", e), Yt(e, "popover", r);
				break;
			case "xlinkActuate":
				Zt(e, "http://www.w3.org/1999/xlink", "xlink:actuate", r);
				break;
			case "xlinkArcrole":
				Zt(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", r);
				break;
			case "xlinkRole":
				Zt(e, "http://www.w3.org/1999/xlink", "xlink:role", r);
				break;
			case "xlinkShow":
				Zt(e, "http://www.w3.org/1999/xlink", "xlink:show", r);
				break;
			case "xlinkTitle":
				Zt(e, "http://www.w3.org/1999/xlink", "xlink:title", r);
				break;
			case "xlinkType":
				Zt(e, "http://www.w3.org/1999/xlink", "xlink:type", r);
				break;
			case "xmlBase":
				Zt(e, "http://www.w3.org/XML/1998/namespace", "xml:base", r);
				break;
			case "xmlLang":
				Zt(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", r);
				break;
			case "xmlSpace":
				Zt(e, "http://www.w3.org/XML/1998/namespace", "xml:space", r);
				break;
			case "is":
				Yt(e, "is", r);
				break;
			case "innerText":
			case "textContent": return;
			default: if (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") n = hn.get(n) || n, Yt(e, n, r);
			else return;
		}
		L = !0;
	}
	function tp(e, t, n, r, a, o) {
		switch (n) {
			case "style":
				pn(e, r, o);
				return;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(i(61));
					if (n = r.__html, n != null) {
						if (a.children != null) throw Error(i(60));
						o?.__html !== n && (e.innerHTML = n);
					}
				}
				break;
			case "children":
				if (typeof r == "string") un(e, r);
				else if (typeof r == "number" || typeof r == "bigint") un(e, "" + r);
				else return;
				break;
			case "onScroll":
				r != null && Q("scroll", e);
				return;
			case "onScrollEnd":
				r != null && Q("scrollend", e);
				return;
			case "onClick":
				r != null && (e.onclick = vn);
				return;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "innerHTML":
			case "ref": return;
			case "innerText":
			case "textContent": return;
			default:
				if (!Ht.hasOwnProperty(n)) a: {
					if (n[0] === "o" && n[1] === "n" && (a = n.endsWith("Capture"), o = n.slice(2, a ? n.length - 7 : void 0), t = e[Et] || null, t = t == null ? null : t[n], typeof t == "function" && e.removeEventListener(o, t, a), typeof r == "function")) {
						typeof t != "function" && t !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(o, r, a);
						break a;
					}
					L = !0, n in e ? e[n] = r : !0 === r ? e.setAttribute(n, "") : Yt(e, n, r);
				}
				return;
		}
		L = !0;
	}
	function np(e, t, n) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "img":
				Q("error", e), Q("load", e);
				var r = !1, a = !1, o;
				for (o in n) if (n.hasOwnProperty(o)) {
					var s = n[o];
					if (s != null) switch (o) {
						case "src":
							r = !0;
							break;
						case "srcSet":
							a = !0;
							break;
						case "children":
						case "dangerouslySetInnerHTML": throw Error(i(137, t));
						default: $(e, t, o, s, n, null);
					}
				}
				a && $(e, t, "srcSet", n.srcSet, n, null), r && $(e, t, "src", n.src, n, null);
				return;
			case "input":
				Q("invalid", e);
				var c = o = s = a = null, l = null, u = null;
				for (r in n) if (n.hasOwnProperty(r)) {
					var d = n[r];
					if (d != null) switch (r) {
						case "name":
							a = d;
							break;
						case "type":
							s = d;
							break;
						case "checked":
							l = d;
							break;
						case "defaultChecked":
							u = d;
							break;
						case "value":
							o = d;
							break;
						case "defaultValue":
							c = d;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (d != null) throw Error(i(137, t));
							break;
						default: $(e, t, r, d, n, null);
					}
				}
				on(e, o, c, l, u, s, a, !1);
				return;
			case "select":
				for (a in Q("invalid", e), r = s = o = null, n) if (n.hasOwnProperty(a) && (c = n[a], c != null)) switch (a) {
					case "value":
						o = c;
						break;
					case "defaultValue":
						s = c;
						break;
					case "multiple": r = c;
					default: $(e, t, a, c, n, null);
				}
				t = o, n = s, e.multiple = !!r, t == null ? n != null && cn(e, !!r, n, !0) : cn(e, !!r, t, !1);
				return;
			case "textarea":
				for (s in Q("invalid", e), o = a = r = null, n) if (n.hasOwnProperty(s) && (c = n[s], c != null)) switch (s) {
					case "value":
						r = c;
						break;
					case "defaultValue":
						a = c;
						break;
					case "children":
						o = c;
						break;
					case "dangerouslySetInnerHTML":
						if (c != null) throw Error(i(91));
						break;
					default: $(e, t, s, c, n, null);
				}
				ln(e, r, a, o);
				return;
			case "option":
				for (l in n) if (n.hasOwnProperty(l) && (r = n[l], r != null)) switch (l) {
					case "selected":
						e.selected = r && typeof r != "function" && typeof r != "symbol";
						break;
					default: $(e, t, l, r, n, null);
				}
				return;
			case "dialog":
				Q("beforetoggle", e), Q("toggle", e), Q("cancel", e), Q("close", e);
				break;
			case "iframe":
			case "object":
				Q("load", e);
				break;
			case "video":
			case "audio":
				for (r = 0; r < zf.length; r++) Q(zf[r], e);
				break;
			case "image":
				Q("error", e), Q("load", e);
				break;
			case "details":
				Q("toggle", e);
				break;
			case "embed":
			case "source":
			case "link": Q("error", e), Q("load", e);
			case "area":
			case "base":
			case "br":
			case "col":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "track":
			case "wbr":
			case "menuitem":
				for (u in n) if (n.hasOwnProperty(u) && (r = n[u], r != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML": throw Error(i(137, t));
					default: $(e, t, u, r, n, null);
				}
				return;
			default: if (mn(t)) {
				for (d in n) n.hasOwnProperty(d) && (r = n[d], r !== void 0 && tp(e, t, d, r, n, void 0));
				return;
			}
		}
		for (c in n) n.hasOwnProperty(c) && (r = n[c], r != null && $(e, t, c, r, n, null));
	}
	var rp = {};
	function ip(e, t, n, r) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "input":
				var a = null, o = null, s = null, c = null, l = null, u = null, d = null;
				for (m in n) {
					var f = n[m];
					if (n.hasOwnProperty(m) && f != null) switch (m) {
						case "checked": break;
						case "value": break;
						case "defaultValue": l = f;
						default: r.hasOwnProperty(m) || $(e, t, m, null, r, f);
					}
				}
				for (var p in r) {
					var m = r[p];
					if (f = n[p], r.hasOwnProperty(p) && (m != null || f != null)) switch (p) {
						case "type":
							m !== f && (L = !0), o = m;
							break;
						case "name":
							m !== f && (L = !0), a = m;
							break;
						case "checked":
							m !== f && (L = !0), u = m;
							break;
						case "defaultChecked":
							m !== f && (L = !0), d = m;
							break;
						case "value":
							m !== f && (L = !0), s = m;
							break;
						case "defaultValue":
							m !== f && (L = !0), c = m;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (m != null) throw Error(i(137, t));
							break;
						default: m !== f && $(e, t, p, m, r, f);
					}
				}
				an(e, s, c, l, u, d, o, a);
				return;
			case "select":
				for (o in m = s = c = p = null, n) if (l = n[o], n.hasOwnProperty(o) && l != null) switch (o) {
					case "value": break;
					case "multiple": m = l;
					default: r.hasOwnProperty(o) || $(e, t, o, null, r, l);
				}
				for (a in r) if (o = r[a], l = n[a], r.hasOwnProperty(a) && (o != null || l != null)) switch (a) {
					case "value":
						o !== l && (L = !0), p = o;
						break;
					case "defaultValue":
						o !== l && (L = !0), c = o;
						break;
					case "multiple": o !== l && (L = !0), s = o;
					default: o !== l && $(e, t, a, o, r, l);
				}
				t = c, n = s, r = m, p == null ? !!r != !!n && (t == null ? cn(e, !!n, n ? [] : "", !1) : cn(e, !!n, t, !0)) : cn(e, !!n, p, !1);
				return;
			case "textarea":
				for (c in m = p = null, n) if (a = n[c], n.hasOwnProperty(c) && a != null && !r.hasOwnProperty(c)) switch (c) {
					case "value": break;
					case "children": break;
					default: $(e, t, c, null, r, a);
				}
				for (s in r) if (a = r[s], o = n[s], r.hasOwnProperty(s) && (a != null || o != null)) switch (s) {
					case "value":
						a !== o && (L = !0), p = a;
						break;
					case "defaultValue":
						a !== o && (L = !0), m = a;
						break;
					case "children": break;
					case "dangerouslySetInnerHTML":
						if (a != null) throw Error(i(91));
						break;
					default: a !== o && $(e, t, s, a, r, o);
				}
				z(e, p, m);
				return;
			case "option":
				for (var h in n) if (p = n[h], n.hasOwnProperty(h) && p != null && !r.hasOwnProperty(h)) switch (h) {
					case "selected":
						e.selected = !1;
						break;
					default: $(e, t, h, null, r, p);
				}
				for (l in r) if (p = r[l], m = n[l], r.hasOwnProperty(l) && p !== m && (p != null || m != null)) switch (l) {
					case "selected":
						p !== m && (L = !0), e.selected = p && typeof p != "function" && typeof p != "symbol";
						break;
					default: $(e, t, l, p, r, m);
				}
				return;
			case "img":
			case "link":
			case "area":
			case "base":
			case "br":
			case "col":
			case "embed":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "source":
			case "track":
			case "wbr":
			case "menuitem":
				for (var g in n) p = n[g], n.hasOwnProperty(g) && p != null && !r.hasOwnProperty(g) && $(e, t, g, null, r, p);
				for (u in r) if (p = r[u], m = n[u], r.hasOwnProperty(u) && p !== m && (p != null || m != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML":
						if (p != null) throw Error(i(137, t));
						break;
					default: $(e, t, u, p, r, m);
				}
				return;
			default: if (mn(t)) {
				for (var _ in n) p = n[_], n.hasOwnProperty(_) && p !== void 0 && !r.hasOwnProperty(_) && tp(e, t, _, void 0, r, p);
				for (d in r) p = r[d], m = n[d], !r.hasOwnProperty(d) || p === m || p === void 0 && m === void 0 || tp(e, t, d, p, r, m);
				return;
			}
		}
		for (var v in n) p = n[v], n.hasOwnProperty(v) && p != null && !r.hasOwnProperty(v) && $(e, t, v, null, r, p);
		for (f in r) p = r[f], m = n[f], !r.hasOwnProperty(f) || p === m || p == null && m == null || $(e, t, f, p, r, m);
	}
	function ap(e) {
		switch (e) {
			case "css":
			case "script":
			case "font":
			case "img":
			case "image":
			case "input":
			case "link": return !0;
			default: return !1;
		}
	}
	function op() {
		if (typeof performance.getEntriesByType == "function") {
			for (var e = 0, t = 0, n = performance.getEntriesByType("resource"), r = 0; r < n.length; r++) {
				var i = n[r], a = i.transferSize, o = i.initiatorType, s = i.duration;
				if (a && s && ap(o)) {
					for (o = 0, s = i.responseEnd, r += 1; r < n.length; r++) {
						var c = n[r], l = c.startTime;
						if (l > s) break;
						var u = c.transferSize, d = c.initiatorType;
						u && ap(d) && (c = c.responseEnd, o += u * (c < s ? 1 : (s - l) / (c - l)));
					}
					if (--r, t += 8 * (a + o) / (i.duration / 1e3), e++, 10 < e) break;
				}
			}
			if (0 < e) return t / e / 1e6;
		}
		return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
	}
	var sp = null, cp = null;
	function lp(e) {
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	function up(e) {
		switch (e) {
			case "http://www.w3.org/2000/svg": return 1;
			case "http://www.w3.org/1998/Math/MathML": return 2;
			default: return 0;
		}
	}
	function dp(e, t) {
		if (e === 0) switch (t) {
			case "svg": return 1;
			case "math": return 2;
			default: return 0;
		}
		return e === 1 && t === "foreignObject" ? 0 : e;
	}
	function fp(e, t, n, r) {
		return n = lp(n).createElement(e), n[F] = r, n[Et] = t, np(n, e, t), zt(n), n;
	}
	function pp(e, t) {
		return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
	}
	var mp = null;
	function hp() {
		var e = window.event;
		return e && e.type === "popstate" ? e !== mp && (mp = e, !0) : (mp = null, !1);
	}
	var gp = typeof setTimeout == "function" ? setTimeout : void 0, _p = typeof clearTimeout == "function" ? clearTimeout : void 0, vp = typeof Promise == "function" ? Promise : void 0, yp = typeof requestAnimationFrame == "function" ? requestAnimationFrame : gp, bp = typeof queueMicrotask == "function" ? queueMicrotask : vp === void 0 ? gp : function(e) {
		return vp.resolve(null).then(e).catch(xp);
	};
	function xp(e) {
		setTimeout(function() {
			throw e;
		});
	}
	function Sp(e) {
		return e === "head";
	}
	function Cp(e, t) {
		var n = t, r = 0;
		do {
			var i = n.nextSibling;
			if (e.removeChild(n), i && i.nodeType === 8) {
				if (n = i.data, n === "/$" || n === "/&") {
					if (r === 0) {
						e.removeChild(i), Hh(t);
						return;
					}
					r--;
				} else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&") r++;
				else if (n === "html") _m(e.ownerDocument.documentElement);
				else if (n === "head") {
					n = e.ownerDocument.head, _m(n);
					for (var a = n.firstChild; a;) {
						var o = a.nextSibling, s = a.nodeName;
						a[Mt] || s === "SCRIPT" || s === "STYLE" || s === "LINK" && a.rel.toLowerCase() === "stylesheet" || n.removeChild(a), a = o;
					}
				} else n === "body" && _m(e.ownerDocument.body);
			}
			n = i;
		} while (n);
		Hh(t);
	}
	function wp(e, t) {
		var n = e;
		e = 0;
		do {
			var r = n.nextSibling;
			if (n.nodeType === 1 ? t ? (n._stashedDisplay = n.style.display, n.style.display = "none") : (n.style.display = n._stashedDisplay || "", n.getAttribute("style") === "" && n.removeAttribute("style")) : n.nodeType === 3 && (t ? (n._stashedText = n.nodeValue, n.nodeValue = "") : n.nodeValue = n._stashedText || ""), r && r.nodeType === 8) {
				if (n = r.data, n === "/$") {
					if (e === 0) break;
					e--;
				} else n !== "$" && n !== "$?" && n !== "$~" && n !== "$!" || e++;
			}
			n = r;
		} while (n);
	}
	function Tp(e, t, n) {
		if (t = CSS.escape(t) === t ? t : "r-" + btoa(t).replace(/=/g, ""), e.style.viewTransitionName = t, n != null && (e.style.viewTransitionClass = n), n = getComputedStyle(e), n.display === "inline") {
			if (t = e.getClientRects(), t.length === 1) var r = 1;
			else for (var i = r = 0; i < t.length; i++) {
				var a = t[i];
				0 < a.width && 0 < a.height && r++;
			}
			r === 1 && (e = e.style, e.display = t.length === 1 ? "inline-block" : "block", e.marginTop = "-" + n.paddingTop, e.marginBottom = "-" + n.paddingBottom);
		}
	}
	function Ep(e, t) {
		e = e.style, t = t.style;
		var n = t == null ? null : t.hasOwnProperty("viewTransitionName") ? t.viewTransitionName : t.hasOwnProperty("view-transition-name") ? t["view-transition-name"] : null;
		e.viewTransitionName = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), n = t == null ? null : t.hasOwnProperty("viewTransitionClass") ? t.viewTransitionClass : t.hasOwnProperty("view-transition-class") ? t["view-transition-class"] : null, e.viewTransitionClass = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), e.display === "inline-block" && (t == null ? e.display = e.margin = "" : (n = t.display, e.display = n == null || typeof n == "boolean" ? "" : n, n = t.margin, n == null ? (n = t.hasOwnProperty("marginTop") ? t.marginTop : t["margin-top"], e.marginTop = n == null || typeof n == "boolean" ? "" : n, t = t.hasOwnProperty("marginBottom") ? t.marginBottom : t["margin-bottom"], e.marginBottom = t == null || typeof t == "boolean" ? "" : t) : e.margin = n));
	}
	function Dp(e, t, n) {
		return n = n.ownerDocument.defaultView, {
			rect: e,
			abs: t.position === "absolute" || t.position === "fixed",
			clip: t.clipPath !== "none" || t.overflow !== "visible" || t.filter !== "none" || t.mask !== "none" || t.mask !== "none" || t.borderRadius !== "0px",
			view: 0 <= e.bottom && 0 <= e.right && e.top <= n.innerHeight && e.left <= n.innerWidth
		};
	}
	function Op(e) {
		return Dp(e.getBoundingClientRect(), getComputedStyle(e), e);
	}
	function kp(e) {
		var t = e.getBoundingClientRect();
		t = new DOMRect(t.x + 2e4, t.y + 2e4, t.width, t.height);
		var n = getComputedStyle(e);
		return Dp(t, n, e);
	}
	function Ap(e) {
		return e.documentElement.clientHeight;
	}
	function jp(e) {
		this.addEventListener("load", e), this.addEventListener("error", e);
	}
	function Mp(e, t, n, r, i, a, o, s, c) {
		var l = t.nodeType === 9 ? t : t.ownerDocument;
		try {
			var u = l.startViewTransition({
				update: function() {
					var t = l.defaultView, n = t.navigation && t.navigation.transition, o = l.fonts.status;
					r();
					var s = [];
					if (o === "loaded" && (Ap(l), l.fonts.status === "loading" && s.push(l.fonts.ready)), o = s.length, e !== null) for (var c = e.suspenseyImages, u = 0, d = 0; d < c.length; d++) {
						var f = c[d];
						if (!f.complete) {
							var p = f.getBoundingClientRect();
							if (0 < p.bottom && 0 < p.right && p.top < t.innerHeight && p.left < t.innerWidth) {
								if (u += Xm(f), u > $m) {
									s.length = o;
									break;
								}
								f = new Promise(jp.bind(f)), s.push(f);
							}
						}
					}
					if (0 < s.length) return t = Promise.race([Promise.all(s), new Promise(function(e) {
						return setTimeout(e, 500);
					})]).then(i, i), (n ? Promise.allSettled([n.finished, t]) : t).then(a, a);
					if (i(), n) return n.finished.then(a, a);
					a();
				},
				types: n
			});
			l.__reactViewTransition = u;
			var d = [];
			return u.ready.then(function() {
				for (var e = l.documentElement.getAnimations({ subtree: !0 }), t = 0; t < e.length; t++) {
					var n = e[t], r = n.effect, i = r.pseudoElement;
					if (i != null && i.startsWith("::view-transition")) {
						d.push(n), n = r.getKeyframes();
						for (var a = i = void 0, s = !0, c = 0; c < n.length; c++) {
							var u = n[c], f = u.width;
							if (i === void 0) i = f;
							else if (i !== f) {
								s = !1;
								break;
							}
							if (f = u.height, a === void 0) a = f;
							else if (a !== f) {
								s = !1;
								break;
							}
							delete u.width, delete u.height, u.transform === "none" && delete u.transform;
						}
						s && i !== void 0 && a !== void 0 && (r.setKeyframes(n), s = getComputedStyle(r.target, r.pseudoElement), s.width !== i || s.height !== a) && (s = n[0], s.width = i, s.height = a, s = n[n.length - 1], s.width = i, s.height = a, r.setKeyframes(n));
					}
				}
				o();
			}, function(e) {
				l.__reactViewTransition === u && (l.__reactViewTransition = null);
				try {
					if (typeof e == "object" && e) switch (e.name) {
						case "InvalidStateError": (e.message === "View transition was skipped because document visibility state is hidden." || e.message === "Skipping view transition because document visibility state has become hidden." || e.message === "Skipping view transition because viewport size changed." || e.message === "Transition was aborted because of invalid state") && (e = null);
					}
					e !== null && c(e);
				} finally {
					r(), i(), o();
				}
			}), u.finished.finally(function() {
				for (var e = 0; e < d.length; e++) d[e].cancel();
				l.__reactViewTransition === u && (l.__reactViewTransition = null), s();
			}), u;
		} catch {
			return r(), i(), o(), null;
		}
	}
	function Np(e, t) {
		this._scope = document.documentElement, this._selector = "::view-transition-" + e + "(" + t + ")";
	}
	Np.prototype.animate = function(e, t) {
		return t = typeof t == "number" ? { duration: t } : E({}, t), t.pseudoElement = this._selector, this._scope.animate(e, t);
	}, Np.prototype.getAnimations = function() {
		for (var e = this._scope, t = this._selector, n = e.getAnimations({ subtree: !0 }), r = [], i = 0; i < n.length; i++) {
			var a = n[i].effect;
			a !== null && a.target === e && a.pseudoElement === t && r.push(n[i]);
		}
		return r;
	}, Np.prototype.getComputedStyle = function() {
		return getComputedStyle(this._scope, this._selector);
	};
	function Pp(e) {
		return {
			name: e,
			group: new Np("group", e),
			imagePair: new Np("image-pair", e),
			old: new Np("old", e),
			new: new Np("new", e)
		};
	}
	function Fp(e) {
		this._fragmentFiber = e, this._observers = this._eventListeners = null;
	}
	Fp.prototype.addEventListener = function(e, t, n) {
		var r = null, i = null;
		if (!(n != null && typeof n != "boolean" && (r = n.signal || null, r !== null && r.aborted))) {
			this._eventListeners === null && (this._eventListeners = []);
			var a = this._eventListeners;
			if (Bp(a, e, t, n) === -1) {
				var o = this, s = t;
				n != null && typeof n != "boolean" && !0 === n.once && (s = function(r) {
					o.removeEventListener(e, t, n), typeof t == "function" ? t.call(this, r) : t.handleEvent(r);
				}), r !== null && (i = o.removeEventListener.bind(o, e, t, n), r.addEventListener("abort", i, { once: !0 }), i = r.removeEventListener.bind(r, "abort", i)), r = Rp(n), a.push({
					type: e,
					listener: t,
					optionsOrUseCapture: n,
					attachedListener: s,
					cleanup: i
				}), h(this._fragmentFiber.child, !1, Ip, e, s, r);
			}
			this._eventListeners = a;
		}
	};
	function Ip(e, t, n, r) {
		return b(e).addEventListener(t, n, r), !1;
	}
	Fp.prototype.removeEventListener = function(e, t, n) {
		var r = this._eventListeners;
		if (r !== null && (t = Bp(r, e, t, n), t !== -1)) {
			var i = r[t];
			n = i.attachedListener;
			var a = i.cleanup;
			i = Rp(i.optionsOrUseCapture), h(this._fragmentFiber.child, !1, Lp, e, n, i), r.splice(t, 1), a !== null && a();
		}
	};
	function Lp(e, t, n, r) {
		return b(e).removeEventListener(t, n, r), !1;
	}
	function Rp(e) {
		return e != null && typeof e != "boolean" && (!0 === e.once || e.signal instanceof AbortSignal) ? {
			capture: e.capture,
			passive: e.passive
		} : e;
	}
	function zp(e) {
		return e == null ? "c=0" : typeof e == "boolean" ? "c=" + (e ? "1" : "0") : "c=" + (e.capture ? "1" : "0");
	}
	function Bp(e, t, n, r) {
		if (e.length === 0) return -1;
		r = zp(r);
		for (var i = 0; i < e.length; i++) {
			var a = e[i];
			if (a.type === t && a.listener === n && zp(a.optionsOrUseCapture) === r) return i;
		}
		return -1;
	}
	Fp.prototype.dispatchEvent = function(e) {
		var t = g(this._fragmentFiber);
		if (t === null) return !0;
		t = b(t);
		var n = this._eventListeners;
		if (n !== null && 0 < n.length || !e.bubbles) {
			var r = t.nodeType === 9 ? t.createComment("") : document.createTextNode("");
			if (n) for (var i = 0; i < n.length; i++) {
				var a = n[i];
				r.addEventListener(a.type, a.attachedListener, Rp(a.optionsOrUseCapture));
			}
			if (t.appendChild(r), e = r.dispatchEvent(e), n) for (i = 0; i < n.length; i++) a = n[i], r.removeEventListener(a.type, a.attachedListener, Rp(a.optionsOrUseCapture));
			return t.removeChild(r), e;
		}
		return t.dispatchEvent(e);
	}, Fp.prototype.focus = function(e) {
		h(this._fragmentFiber.child, !0, Vp, e, void 0, void 0);
	};
	function Vp(e, t) {
		return e.tag !== 6 && (e = b(e), pm(e, t));
	}
	Fp.prototype.focusLast = function(e) {
		var t = [];
		h(this._fragmentFiber.child, !0, Hp, t, void 0, void 0);
		for (var n = t.length - 1; 0 <= n && !Vp(t[n], e); n--);
	};
	function Hp(e, t) {
		return t.push(e), !1;
	}
	Fp.prototype.blur = function() {
		var e = g(this._fragmentFiber);
		e !== null && (e = b(e), e = lp(e).activeElement, e !== null && h(this._fragmentFiber.child, !1, Up, e, void 0, void 0));
	};
	function Up(e, t) {
		return e.tag !== 6 && (e = b(e), e === t || e.contains(t) ? (t.blur(), !0) : !1);
	}
	Fp.prototype.observeUsing = function(e) {
		this._observers === null && (this._observers = /* @__PURE__ */ new Set()), this._observers.add(e), h(this._fragmentFiber.child, !1, Wp, e, void 0, void 0);
	};
	function Wp(e, t) {
		return e.tag === 6 || (e = b(e), t.observe(e)), !1;
	}
	Fp.prototype.unobserveUsing = function(e) {
		var t = this._observers;
		if (t !== null && t.has(e)) {
			t.delete(e), h(this._fragmentFiber.child, !1, Gp, e, void 0, void 0);
			for (var n = t = 0; n < Kp.length; n++) {
				var r = Kp[n];
				r.fragmentInstance === this && r.observer === e ? e.unobserve(r.instance) : Kp[t++] = r;
			}
			Kp.length = t;
		}
	};
	function Gp(e, t) {
		return e.tag === 6 || (e = b(e), t.unobserve(e)), !1;
	}
	var Kp = [], qp = !1;
	function Jp(e, t, n) {
		Kp.push({
			fragmentInstance: e,
			observer: t,
			instance: n
		}), qp || (qp = !0, mm(function() {
			qp = !1;
			var e = Kp;
			Kp = [];
			for (var t = 0; t < e.length; t++) {
				var n = e[t];
				n.observer.unobserve(n.instance);
			}
		}));
	}
	Fp.prototype.getClientRects = function() {
		var e = [];
		return h(this._fragmentFiber.child, !1, Yp, e, void 0, void 0), e;
	};
	function Yp(e, t) {
		if (e.tag === 6) {
			e = e.stateNode;
			var n = e.ownerDocument.createRange();
			n.selectNodeContents(e), t.push.apply(t, n.getClientRects());
		} else e = b(e), t.push.apply(t, e.getClientRects());
		return !1;
	}
	Fp.prototype.getRootNode = function(e) {
		var t = g(this._fragmentFiber);
		return t === null ? this : b(t).getRootNode(e);
	}, Fp.prototype.compareDocumentPosition = function(e) {
		var t = g(this._fragmentFiber);
		if (t === null) return Node.DOCUMENT_POSITION_DISCONNECTED;
		var n = [];
		h(this._fragmentFiber.child, !1, Hp, n, void 0, void 0);
		var r = b(t);
		if (n.length === 0) {
			if (n = r, _(this._fragmentFiber)) {
				a: {
					for (t = this._fragmentFiber.return; t !== null;) {
						if (t.tag === 4) {
							t = t.stateNode.containerInfo;
							break a;
						}
						if (t.tag === 3 || t.tag === 5 || t.tag === 27) break;
						t = t.return;
					}
					t = null;
				}
				t != null && (n = t);
			}
			t = this._fragmentFiber;
			var i = r = n.compareDocumentPosition(e);
			return n === e ? i = Node.DOCUMENT_POSITION_CONTAINS : r & Node.DOCUMENT_POSITION_CONTAINED_BY && (n = v(t)[1], n === null ? i = Node.DOCUMENT_POSITION_PRECEDING : (e = b(n).compareDocumentPosition(e), i = e === 0 || e & Node.DOCUMENT_POSITION_FOLLOWING ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING)), i |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
		}
		t = b(n[0]), i = b(n[n.length - 1]);
		var a = _(this._fragmentFiber) ? t.parentElement : r;
		if (a == null) return Node.DOCUMENT_POSITION_DISCONNECTED;
		r = a.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY, a = a.compareDocumentPosition(i) & Node.DOCUMENT_POSITION_CONTAINED_BY;
		var o = t.compareDocumentPosition(e), s = i.compareDocumentPosition(e), c = o & Node.DOCUMENT_POSITION_CONTAINED_BY || s & Node.DOCUMENT_POSITION_CONTAINED_BY;
		return s = r && a && o & Node.DOCUMENT_POSITION_FOLLOWING && s & Node.DOCUMENT_POSITION_PRECEDING, t = r && t === e || a && i === e || c || s ? Node.DOCUMENT_POSITION_CONTAINED_BY : !r && t === e || !a && i === e ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : o, t & Node.DOCUMENT_POSITION_DISCONNECTED || t & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC || Xp(t, this._fragmentFiber, n[0], n[n.length - 1], e) ? t : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
	};
	function Xp(e, t, n, r, i) {
		var a = Ft(i);
		if (e & Node.DOCUMENT_POSITION_CONTAINED_BY) {
			if (n = !!a) a: {
				for (; a !== null;) {
					if (a.tag === 7 && (a === t || a.alternate === t)) {
						n = !0;
						break a;
					}
					a = a.return;
				}
				n = !1;
			}
			return n;
		}
		if (e & Node.DOCUMENT_POSITION_CONTAINS) {
			if (a === null) return a = i.ownerDocument, i === a || i === a.documentElement || i === a.body;
			a: {
				for (a = t, t = g(t); a !== null;) {
					if (!(a.tag !== 5 && a.tag !== 3 && a.tag !== 27 || a !== t && a.alternate !== t)) {
						a = !0;
						break a;
					}
					a = a.return;
				}
				a = !1;
			}
			return a;
		}
		return e & Node.DOCUMENT_POSITION_PRECEDING ? ((t = !!a) && !(t = a === n) && (t = ee(n, a, T), t === null ? t = !1 : (h(t, !0, C, a, n), a = x, x = null, t = a !== null)), t) : e & Node.DOCUMENT_POSITION_FOLLOWING ? ((t = !!a) && !(t = a === r) && (t = ee(r, a, T), t === null ? t = !1 : (h(t, !0, w, a, r), a = x, S = x = null, t = a !== null)), t) : !1;
	}
	function Zp(e, t) {
		var n = e.ownerDocument.createRange();
		n.selectNodeContents(e), e = n.getBoundingClientRect(), window.scrollTo(window.scrollX + e.left, t ? window.scrollY + e.top : window.scrollY + e.bottom - window.innerHeight);
	}
	Fp.prototype.scrollIntoView = function(e) {
		if (typeof e == "object") throw Error(i(566));
		var t = [];
		h(this._fragmentFiber.child, !1, Hp, t, void 0, void 0);
		var n = !1 !== e;
		if (t.length === 0) {
			var r = v(this._fragmentFiber);
			if (r = n ? r[1] || r[0] || g(this._fragmentFiber) : r[0] || r[1], r === null) return;
			if (r.tag === 6) {
				e = b(r), Zp(e, n);
				return;
			}
			if (r = b(r), r.nodeType !== 9) {
				if (r.nodeType === 11) {
					n = "host" in r ? r.host : null, n !== null && n.scrollIntoView(e);
					return;
				}
				r.scrollIntoView(e);
			}
		}
		for (r = n ? t.length - 1 : 0; r !== (n ? -1 : t.length);) {
			var a = t[r];
			a.tag === 6 ? (a = b(a), Zp(a, n)) : b(a).scrollIntoView(e), r += n ? -1 : 1;
		}
	};
	function Qp(e, t) {
		return e = b(e), $p(e, t), !1;
	}
	function $p(e, t) {
		e.reactFragments ??= /* @__PURE__ */ new Set(), e.reactFragments.add(t);
	}
	function em(e, t) {
		var n = t._eventListeners;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = n[r];
			e.addEventListener(i.type, i.attachedListener, Rp(i.optionsOrUseCapture));
		}
		e.nodeType !== 3 && (n = t._observers, n !== null && n.forEach(function(n) {
			for (var r = 0, i = 0; i < Kp.length; i++) {
				var a = Kp[i];
				(a.fragmentInstance !== t || a.observer !== n || a.instance !== e) && (Kp[r++] = a);
			}
			Kp.length = r, n.observe(e);
		}), $p(e, t));
	}
	function tm(e, t) {
		var n = t._eventListeners;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = n[r];
			e.removeEventListener(i.type, i.attachedListener, Rp(i.optionsOrUseCapture));
		}
		e.nodeType !== 3 && (n = t._observers, n !== null && n.forEach(function(n) {
			typeof n.rootMargin == "string" ? Jp(t, n, e) : n.unobserve(e);
		}), e.reactFragments != null && e.reactFragments.delete(t));
	}
	function nm(e) {
		var t = e.firstChild;
		for (t && t.nodeType === 10 && (t = t.nextSibling); t;) {
			var n = t;
			switch (t = t.nextSibling, n.nodeName) {
				case "HTML":
				case "HEAD":
				case "BODY":
					nm(n), Pt(n);
					continue;
				case "SCRIPT":
				case "STYLE": continue;
				case "LINK": if (n.rel.toLowerCase() === "stylesheet") continue;
			}
			e.removeChild(n);
		}
	}
	function rm(e, t, n, r) {
		for (; e.nodeType === 1;) {
			var i = n;
			if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
				if (!r && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
			} else if (!r) {
				if (t === "input" && e.type === "hidden") {
					var a = i.name == null ? null : "" + i.name;
					if (i.type === "hidden" && e.getAttribute("name") === a) return e;
				} else return e;
			} else if (!e[Mt]) switch (t) {
				case "meta":
					if (!e.hasAttribute("itemprop")) break;
					return e;
				case "link":
					if (a = e.getAttribute("rel"), a === "stylesheet" && e.hasAttribute("data-precedence") || a !== i.rel || e.getAttribute("href") !== (i.href == null || i.href === "" ? null : i.href) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin) || e.getAttribute("title") !== (i.title == null ? null : i.title)) break;
					return e;
				case "style":
					if (e.hasAttribute("data-precedence")) break;
					return e;
				case "script":
					if (a = e.getAttribute("src"), (a !== (i.src == null ? null : i.src) || e.getAttribute("type") !== (i.type == null ? null : i.type) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin)) && a && e.hasAttribute("async") && !e.hasAttribute("itemprop")) break;
					return e;
				default: return e;
			}
			if (e = lm(e.nextSibling), e === null) break;
		}
		return null;
	}
	function im(e, t, n) {
		if (t === "") return null;
		for (; e.nodeType !== 3;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n || (e = lm(e.nextSibling), e === null)) return null;
		return e;
	}
	function am(e, t) {
		for (; e.nodeType !== 8;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = lm(e.nextSibling), e === null)) return null;
		return e;
	}
	function om(e) {
		return e.data === "$?" || e.data === "$~";
	}
	function sm(e) {
		return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
	}
	function cm(e, t) {
		var n = e.ownerDocument;
		if (e.data === "$~") e._reactRetry = t;
		else if (e.data !== "$?" || n.readyState !== "loading") t();
		else {
			var r = function() {
				t(), n.removeEventListener("DOMContentLoaded", r);
			};
			n.addEventListener("DOMContentLoaded", r), e._reactRetry = r;
		}
	}
	function lm(e) {
		for (; e != null; e = e.nextSibling) {
			var t = e.nodeType;
			if (t === 1 || t === 3) break;
			if (t === 8) {
				if (t = e.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F") break;
				if (t === "/$" || t === "/&") return null;
			}
		}
		return e;
	}
	var um = null;
	function dm(e) {
		e = e.nextSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "/$" || n === "/&") {
					if (t === 0) return lm(e.nextSibling);
					t--;
				} else n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || t++;
			}
			e = e.nextSibling;
		}
		return null;
	}
	function fm(e) {
		e = e.previousSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "$" || n === "$!" || n === "$?" || n === "$~" || n === "&") {
					if (t === 0) return e;
					t--;
				} else n !== "/$" && n !== "/&" || t++;
			}
			e = e.previousSibling;
		}
		return null;
	}
	function pm(e, t) {
		function n() {
			r = !0;
		}
		if (e.ownerDocument.activeElement === e) return !0;
		var r = !1;
		try {
			e.ownerDocument.addEventListener("focus", n, !0), (e.focus || HTMLElement.prototype.focus).call(e, t);
		} finally {
			e.ownerDocument.removeEventListener("focus", n, !0);
		}
		return r;
	}
	function mm(e) {
		yp(function() {
			yp(function(t) {
				return e(t);
			});
		});
	}
	function hm(e, t, n) {
		switch (t = lp(n), e) {
			case "html":
				if (e = t.documentElement, !e) throw Error(i(452));
				return e;
			case "head":
				if (e = t.head, !e) throw Error(i(453));
				return e;
			case "body":
				if (e = t.body, !e) throw Error(i(454));
				return e;
			default: throw Error(i(451));
		}
	}
	function gm(e, t, n) {
		for (var r in n) {
			var i = n[r];
			n.hasOwnProperty(r) && i != null && $(e, t, r, null, rp, i);
		}
		n.dangerouslySetInnerHTML != null && (e.textContent = ""), e.onclick === vn && (e.onclick = null), Pt(e);
	}
	function _m(e) {
		for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
		Pt(e);
	}
	var vm = /* @__PURE__ */ new Map(), ym = /* @__PURE__ */ new Set();
	function bm(e) {
		if (typeof e.getRootNode == "function") {
			var t = e.getRootNode();
			if (t.nodeType === 9 || t.nodeType === 11) return t;
		}
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	var xm = j.d;
	j.d = {
		f: Sm,
		r: Cm,
		D: Em,
		C: Dm,
		L: Om,
		m: km,
		X: jm,
		S: Am,
		M: Mm
	};
	function Sm() {
		var e = xm.f(), t = zd();
		return e || t;
	}
	function Cm(e) {
		var t = It(e);
		t !== null && t.tag === 5 && t.type === "form" ? tc(t) : xm.r(e);
	}
	var wm = typeof document > "u" ? null : document;
	function Tm(e, t, n) {
		var r = wm;
		if (r && typeof t == "string" && t) {
			var i = rn(t);
			i = "link[rel=\"" + e + "\"][href=\"" + i + "\"]", typeof n == "string" && (i += "[crossorigin=\"" + n + "\"]"), ym.has(i) || (ym.add(i), e = {
				rel: e,
				crossOrigin: n,
				href: t
			}, r.querySelector(i) === null && (t = r.createElement("link"), np(t, "link", e), zt(t), r.head.appendChild(t)));
		}
	}
	function Em(e) {
		xm.D(e), Tm("dns-prefetch", e, null);
	}
	function Dm(e, t) {
		xm.C(e, t), Tm("preconnect", e, t);
	}
	function Om(e, t, n) {
		xm.L(e, t, n);
		var r = wm;
		if (r && e && t) {
			var i = "link[rel=\"preload\"][as=\"" + rn(t) + "\"]";
			t === "image" && n && n.imageSrcSet ? (i += "[imagesrcset=\"" + rn(n.imageSrcSet) + "\"]", typeof n.imageSizes == "string" && (i += "[imagesizes=\"" + rn(n.imageSizes) + "\"]")) : i += "[href=\"" + rn(e) + "\"]";
			var a = i;
			switch (t) {
				case "style":
					a = Pm(e);
					break;
				case "script": a = Rm(e);
			}
			if (!(vm.has(a) || (e = E({
				rel: "preload",
				href: t === "image" && n && n.imageSrcSet ? void 0 : e,
				as: t
			}, n), vm.set(a, e), r.querySelector(i) !== null || t === "style" && r.querySelector(Fm(a)) || t === "script" && r.querySelector(zm(a))))) {
				var o = r.createElement("link");
				np(o, "link", e), t === "style" && (o[Nt] = !0, o.onload = o.onerror = function() {
					Bt(o);
				}), zt(o), r.head.appendChild(o);
			}
		}
	}
	function km(e, t) {
		xm.m(e, t);
		var n = wm;
		if (n && e) {
			var r = t && typeof t.as == "string" ? t.as : "script", i = "link[rel=\"modulepreload\"][as=\"" + rn(r) + "\"][href=\"" + rn(e) + "\"]", a = i;
			switch (r) {
				case "audioworklet":
				case "paintworklet":
				case "serviceworker":
				case "sharedworker":
				case "worker":
				case "script": a = Rm(e);
			}
			if (!vm.has(a) && (e = E({
				rel: "modulepreload",
				href: e
			}, t), vm.set(a, e), n.querySelector(i) === null)) {
				switch (r) {
					case "audioworklet":
					case "paintworklet":
					case "serviceworker":
					case "sharedworker":
					case "worker":
					case "script": if (n.querySelector(zm(a))) return;
				}
				r = n.createElement("link"), np(r, "link", e), zt(r), n.head.appendChild(r);
			}
		}
	}
	function Am(e, t, n) {
		xm.S(e, t, n);
		var r = wm;
		if (r && e) {
			var i = Rt(r).hoistableStyles, a = Pm(e);
			t ||= "default";
			var o = i.get(a);
			if (!o) {
				var s = {
					loading: 0,
					preload: null
				};
				if (o = r.querySelector(Fm(a))) s.loading = 5;
				else {
					e = E({
						rel: "stylesheet",
						href: e,
						"data-precedence": t
					}, n), (n = vm.get(a)) && Hm(e, n);
					var c = o = r.createElement("link");
					zt(c), np(c, "link", e), c._p = new Promise(function(e, t) {
						c.onload = e, c.onerror = t;
					}), c.addEventListener("load", function() {
						s.loading |= 1;
					}), c.addEventListener("error", function() {
						s.loading |= 2;
					}), s.loading |= 4, Vm(o, t, r);
				}
				o = {
					type: "stylesheet",
					instance: o,
					count: 1,
					state: s
				}, i.set(a, o);
			}
		}
	}
	function jm(e, t) {
		xm.X(e, t);
		var n = wm;
		if (n && e) {
			var r = Rt(n).hoistableScripts, i = Rm(e), a = r.get(i);
			a || (a = n.querySelector(zm(i)), a || (e = E({
				src: e,
				async: !0
			}, t), (t = vm.get(i)) && Um(e, t), a = n.createElement("script"), zt(a), np(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Mm(e, t) {
		xm.M(e, t);
		var n = wm;
		if (n && e) {
			var r = Rt(n).hoistableScripts, i = Rm(e), a = r.get(i);
			a || (a = n.querySelector(zm(i)), a || (e = E({
				src: e,
				async: !0,
				type: "module"
			}, t), (t = vm.get(i)) && Um(e, t), a = n.createElement("script"), zt(a), np(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Nm(e, t, n, r) {
		var a = (a = Oe.current) ? bm(a) : null;
		if (!a) throw Error(i(446));
		switch (e) {
			case "meta":
			case "title": return null;
			case "style": return typeof n.precedence == "string" && typeof n.href == "string" ? (n = Pm(n.href), t = Rt(a).hoistableStyles, r = t.get(n), r || (r = {
				type: "style",
				instance: null,
				count: 0,
				state: null
			}, t.set(n, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			case "link":
				if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
					e = Pm(n.href);
					var o = Rt(a).hoistableStyles, s = o.get(e);
					if (s || (a = a.ownerDocument || a, s = {
						type: "stylesheet",
						instance: null,
						count: 0,
						state: {
							loading: 0,
							preload: null
						}
					}, o.set(e, s), (o = a.querySelector(Fm(e))) ? o._p || (s.instance = o, s.state.loading = 5) : (o = vm.get(e), o || (o = {
						rel: "preload",
						as: "style",
						href: n.href,
						crossOrigin: n.crossOrigin,
						integrity: n.integrity,
						media: n.media,
						hrefLang: n.hrefLang,
						referrerPolicy: n.referrerPolicy
					}, vm.set(e, o)), Lm(a, e, o, s.state))), t && r === null) throw Error(i(528, ""));
					return s;
				}
				if (t && r !== null) throw Error(i(529, ""));
				return null;
			case "script": return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (n = Rm(n), t = Rt(a).hoistableScripts, r = t.get(n), r || (r = {
				type: "script",
				instance: null,
				count: 0,
				state: null
			}, t.set(n, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			default: throw Error(i(444, e));
		}
	}
	function Pm(e) {
		return "href=\"" + rn(e) + "\"";
	}
	function Fm(e) {
		return "link[rel=\"stylesheet\"][" + e + "]";
	}
	function Im(e) {
		return E({}, e, {
			"data-precedence": e.precedence,
			precedence: null
		});
	}
	function Lm(e, t, n, r) {
		if (t = e.querySelector("link[rel=\"preload\"][as=\"style\"][" + t + "]")) {
			if (!0 !== t[Nt]) {
				r.loading = 1;
				return;
			}
		} else t = e.createElement("link"), t[Nt] = !0, t.onload = t.onerror = Bt.bind(null, t), np(t, "link", n), zt(t), e.head.appendChild(t);
		r.preload = t, t.addEventListener("load", function() {
			return r.loading |= 1;
		}), t.addEventListener("error", function() {
			return r.loading |= 2;
		});
	}
	function Rm(e) {
		return "[src=\"" + rn(e) + "\"]";
	}
	function zm(e) {
		return "script[async]" + e;
	}
	function Bm(e, t, n) {
		if (t.count++, t.instance === null) switch (t.type) {
			case "style":
				var r = e.querySelector("style[data-href~=\"" + rn(n.href) + "\"]");
				if (r) return t.instance = r, zt(r), r;
				var a = E({}, n, {
					"data-href": n.href,
					"data-precedence": n.precedence,
					href: null,
					precedence: null
				});
				return r = (e.ownerDocument || e).createElement("style"), zt(r), np(r, "style", a), Vm(r, n.precedence, e), t.instance = r;
			case "stylesheet":
				a = Pm(n.href);
				var o = e.querySelector(Fm(a));
				if (o) return t.state.loading |= 4, t.instance = o, zt(o), o;
				r = Im(n), (a = vm.get(a)) && Hm(r, a), o = (e.ownerDocument || e).createElement("link"), zt(o);
				var s = o;
				return s._p = new Promise(function(e, t) {
					s.onload = e, s.onerror = t;
				}), np(o, "link", r), t.state.loading |= 4, Vm(o, n.precedence, e), t.instance = o;
			case "script": return o = Rm(n.src), (a = e.querySelector(zm(o))) ? (t.instance = a, zt(a), a) : (r = n, (a = vm.get(o)) && (r = E({}, n), Um(r, a)), e = e.ownerDocument || e, a = e.createElement("script"), zt(a), np(a, "link", r), e.head.appendChild(a), t.instance = a);
			case "void": return null;
			default: throw Error(i(443, t.type));
		}
		else t.type === "stylesheet" && !(t.state.loading & 4) && (r = t.instance, t.state.loading |= 4, Vm(r, n.precedence, e));
		return t.instance;
	}
	function Vm(e, t, n) {
		for (var r = n.querySelectorAll("link[rel=\"stylesheet\"][data-precedence],style[data-precedence]"), i = r.length ? r[r.length - 1] : null, a = i, o = 0; o < r.length; o++) {
			var s = r[o];
			if (s.dataset.precedence === t) a = s;
			else if (a !== i) break;
		}
		a ? a.parentNode.insertBefore(e, a.nextSibling) : (t = n.nodeType === 9 ? n.head : n, t.insertBefore(e, t.firstChild));
	}
	function Hm(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.title ??= t.title;
	}
	function Um(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.integrity ??= t.integrity;
	}
	var Wm = null;
	function Gm(e, t, n) {
		if (Wm === null) {
			var r = /* @__PURE__ */ new Map(), i = Wm = /* @__PURE__ */ new Map();
			i.set(n, r);
		} else i = Wm, r = i.get(n), r || (r = /* @__PURE__ */ new Map(), i.set(n, r));
		if (r.has(e)) return r;
		for (r.set(e, null), n = n.getElementsByTagName(e), i = 0; i < n.length; i++) {
			var a = n[i];
			if (!(a[Mt] || a[F] || e === "link" && a.getAttribute("rel") === "stylesheet") && a.namespaceURI !== "http://www.w3.org/2000/svg") {
				var o = a.getAttribute(t) || "";
				o = e + o;
				var s = r.get(o);
				s ? s.push(a) : r.set(o, [a]);
			}
		}
		return r;
	}
	function Km(e, t, n) {
		e = e.ownerDocument || e, e.head.insertBefore(n, t === "title" ? e.querySelector("head > title") : null);
	}
	function qm(e, t, n) {
		if (n === 1 || t.itemProp != null) return !1;
		switch (e) {
			case "meta":
			case "title": return !0;
			case "style":
				if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "") break;
				return !0;
			case "link":
				if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError) break;
				switch (t.rel) {
					case "stylesheet": return e = t.disabled, typeof t.precedence == "string" && e == null;
					default: return !0;
				}
			case "script": if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string") return !0;
		}
		return !1;
	}
	function Jm(e, t) {
		return e === "img" && t.src != null && t.src !== "" && t.onLoad == null && t.loading !== "lazy";
	}
	function Ym(e) {
		return !(e.type === "stylesheet" && !(e.state.loading & 3));
	}
	function Xm(e) {
		return (e.width || 100) * (e.height || 100) * (typeof devicePixelRatio == "number" ? devicePixelRatio : 1) * .25;
	}
	function Zm(e, t) {
		typeof t.decode == "function" && (e.imgCount++, t.complete || (e.imgBytes += Xm(t), e.suspenseyImages.push(t)), e = rh.bind(e), t.decode().then(e, e));
	}
	function Qm(e, t, n, r) {
		if (n.type === "stylesheet" && (typeof r.media != "string" || !1 !== matchMedia(r.media).matches) && !(n.state.loading & 4)) {
			if (n.instance === null) {
				var i = Pm(r.href), a = t.querySelector(Fm(i));
				if (a) {
					t = a._p, typeof t == "object" && t && typeof t.then == "function" && (e.count++, e = nh.bind(e), t.then(e, e)), n.state.loading |= 4, n.instance = a, zt(a);
					return;
				}
				a = t.ownerDocument || t, r = Im(r), (i = vm.get(i)) && Hm(r, i), a = a.createElement("link"), zt(a);
				var o = a;
				o._p = new Promise(function(e, t) {
					o.onload = e, o.onerror = t;
				}), np(a, "link", r), n.instance = a;
			}
			e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(n, t), (t = n.state.preload) && !(n.state.loading & 3) && (e.count++, n = nh.bind(e), t.addEventListener("load", n), t.addEventListener("error", n));
		}
	}
	var $m = 0;
	function eh(e, t) {
		return e.stylesheets && e.count === 0 && ah(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(n) {
			var r = setTimeout(function() {
				if (e.stylesheets && ah(e, e.stylesheets), e.unsuspend) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, 6e4 + t);
			0 < e.imgBytes && $m === 0 && ($m = 62500 * op());
			var i = setTimeout(function() {
				if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && ah(e, e.stylesheets), e.unsuspend)) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, (e.imgBytes > $m ? 50 : 800) + t);
			return e.unsuspend = n, function() {
				e.unsuspend = null, clearTimeout(r), clearTimeout(i);
			};
		} : null;
	}
	function th(e) {
		if (e.count === 0 && (e.imgCount === 0 || !e.waitingForImages)) {
			if (e.stylesheets) ah(e, e.stylesheets);
			else if (e.unsuspend) {
				var t = e.unsuspend;
				e.unsuspend = null, t();
			}
		}
	}
	function nh() {
		this.count--, th(this);
	}
	function rh() {
		this.imgCount--, th(this);
	}
	var ih = null;
	function ah(e, t) {
		e.stylesheets = null, e.unsuspend !== null && (e.count++, ih = /* @__PURE__ */ new Map(), t.forEach(oh, e), ih = null, nh.call(e));
	}
	function oh(e, t) {
		if (!(t.state.loading & 4)) {
			var n = ih.get(e);
			if (n) var r = n.get(null);
			else {
				n = /* @__PURE__ */ new Map(), ih.set(e, n);
				for (var i = e.querySelectorAll("link[data-precedence],style[data-precedence]"), a = 0; a < i.length; a++) {
					var o = i[a];
					(o.nodeName === "LINK" || o.getAttribute("media") !== "not all") && (n.set(o.dataset.precedence, o), r = o);
				}
				r && n.set(null, r);
			}
			i = t.instance, o = i.getAttribute("data-precedence"), a = n.get(o) || r, a === r && n.set(null, i), n.set(o, i), this.count++, r = nh.bind(this), i.addEventListener("load", r), i.addEventListener("error", r), a ? a.parentNode.insertBefore(i, a.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(i, e.firstChild)), t.state.loading |= 4;
		}
	}
	var sh = {
		$$typeof: ae,
		Provider: null,
		Consumer: null,
		_currentValue: xe,
		_currentValue2: xe,
		_threadCount: 0
	};
	function ch(e, t, n, r, i, a, o, s, c) {
		this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = gt(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = gt(0), this.hiddenUpdates = gt(null), this.identifierPrefix = r, this.onUncaughtError = i, this.onCaughtError = a, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = c, this.transitionTypes = null, this.incompleteTransitions = /* @__PURE__ */ new Map();
	}
	function lh(e, t, n, r, i, a, o, s, c, l, u, d) {
		return e = new ch(e, t, n, o, c, l, u, d, s), t = 1, !0 === a && (t |= 24), a = Ai(3, null, null, t), e.current = a, a.stateNode = e, t = Aa(), t.refCount++, e.pooledCache = t, t.refCount++, a.memoizedState = {
			element: r,
			isDehydrated: n,
			cache: t
		}, po(a), e;
	}
	function uh(e) {
		return e ? (e = Oi, e) : Oi;
	}
	function dh(e, t, n, r, i, a) {
		i = uh(i), r.context === null ? r.context = i : r.pendingContext = i, r = ho(t), r.payload = { element: n }, a = a === void 0 ? null : a, a !== null && (r.callback = a), n = go(e, r, t), n !== null && (Pd(n, e, t), _o(n, e, t));
	}
	function fh(e, t) {
		if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
			var n = e.retryLane;
			e.retryLane = n !== 0 && n < t ? n : t;
		}
	}
	function ph(e, t) {
		fh(e, t), (e = e.alternate) && fh(e, t);
	}
	function mh(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = Ti(e, 67108864);
			t !== null && Pd(t, e, 67108864), ph(e, 67108864);
		}
	}
	function hh(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = jd();
			t = St(t);
			var n = Ti(e, t);
			n !== null && Pd(n, e, t), ph(e, t);
		}
	}
	var gh = !0;
	function _h(e, t, n, r) {
		var i = A.T;
		A.T = null;
		var a = j.p;
		try {
			j.p = 2, yh(e, t, n, r);
		} finally {
			j.p = a, A.T = i;
		}
	}
	function vh(e, t, n, r) {
		var i = A.T;
		A.T = null;
		var a = j.p;
		try {
			j.p = 8, yh(e, t, n, r);
		} finally {
			j.p = a, A.T = i;
		}
	}
	function yh(e, t, n, r) {
		if (gh) {
			var i = bh(r);
			if (i === null) Kf(e, t, r, xh, n), Mh(e, r);
			else if (Ph(i, e, t, n, r)) r.stopPropagation();
			else if (Mh(e, r), t & 4 && -1 < jh.indexOf(e)) {
				for (; i !== null;) {
					var a = It(i);
					if (a !== null) switch (a.tag) {
						case 3:
							if (a = a.stateNode, a.current.memoizedState.isDehydrated) {
								var o = ut(a.pendingLanes);
								if (o !== 0) {
									var s = a;
									for (s.pendingLanes |= 2, s.entangledLanes |= 2; o;) {
										var c = 1 << 31 - rt(o);
										s.entanglements[1] |= c, o &= ~c;
									}
									Ef(a), !(K & 6) && (gd = Ge() + 500, Df(0, !1));
								}
							}
							break;
						case 31:
						case 13: s = Ti(a, 2), s !== null && Pd(s, a, 2), zd(), ph(a, 2);
					}
					if (a = bh(r), a === null && Kf(e, t, r, xh, n), a === i) break;
					i = a;
				}
				i !== null && r.stopPropagation();
			} else Kf(e, t, r, null, n);
		}
	}
	function bh(e) {
		return e = yn(e), Sh(e);
	}
	var xh = null;
	function Sh(e) {
		if (xh = null, e = Ft(e), e !== null) {
			var t = o(e);
			if (t === null) e = null;
			else {
				var n = t.tag;
				if (n === 13) {
					if (e = s(t), e !== null) return e;
					e = null;
				} else if (n === 31) {
					if (e = c(t), e !== null) return e;
					e = null;
				} else if (n === 3) {
					if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
					e = null;
				} else t !== e && (e = null);
			}
		}
		return xh = e, null;
	}
	function Ch(e) {
		switch (e) {
			case "beforetoggle":
			case "cancel":
			case "click":
			case "close":
			case "contextmenu":
			case "copy":
			case "cut":
			case "auxclick":
			case "dblclick":
			case "dragend":
			case "dragstart":
			case "drop":
			case "focusin":
			case "focusout":
			case "input":
			case "invalid":
			case "keydown":
			case "keypress":
			case "keyup":
			case "mousedown":
			case "mouseup":
			case "paste":
			case "pause":
			case "play":
			case "pointercancel":
			case "pointerdown":
			case "pointerup":
			case "ratechange":
			case "reset":
			case "seeked":
			case "submit":
			case "toggle":
			case "touchcancel":
			case "touchend":
			case "touchstart":
			case "volumechange":
			case "change":
			case "selectionchange":
			case "textInput":
			case "compositionstart":
			case "compositionend":
			case "compositionupdate":
			case "beforeblur":
			case "afterblur":
			case "beforeinput":
			case "blur":
			case "fullscreenchange":
			case "fullscreenerror":
			case "focus":
			case "hashchange":
			case "popstate":
			case "select":
			case "selectstart": return 2;
			case "drag":
			case "dragenter":
			case "dragexit":
			case "dragleave":
			case "dragover":
			case "mousemove":
			case "mouseout":
			case "mouseover":
			case "pointermove":
			case "pointerout":
			case "pointerover":
			case "resize":
			case "scroll":
			case "touchmove":
			case "wheel":
			case "mouseenter":
			case "mouseleave":
			case "pointerenter":
			case "pointerleave": return 8;
			case "message": switch (Ke()) {
				case qe: return 2;
				case Je: return 8;
				case Ye:
				case Xe: return 32;
				case Ze: return 268435456;
				default: return 32;
			}
			default: return 32;
		}
	}
	var wh = !1, Th = null, Eh = null, Dh = null, Oh = /* @__PURE__ */ new Map(), kh = /* @__PURE__ */ new Map(), Ah = [], jh = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
	function Mh(e, t) {
		switch (e) {
			case "focusin":
			case "focusout":
				Th = null;
				break;
			case "dragenter":
			case "dragleave":
				Eh = null;
				break;
			case "mouseover":
			case "mouseout":
				Dh = null;
				break;
			case "pointerover":
			case "pointerout":
				Oh.delete(t.pointerId);
				break;
			case "gotpointercapture":
			case "lostpointercapture": kh.delete(t.pointerId);
		}
	}
	function Nh(e, t, n, r, i, a) {
		return e === null || e.nativeEvent !== a ? (e = {
			blockedOn: t,
			domEventName: n,
			eventSystemFlags: r,
			nativeEvent: a,
			targetContainers: [i]
		}, t !== null && (t = It(t), t !== null && mh(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
	}
	function Ph(e, t, n, r, i) {
		switch (t) {
			case "focusin": return Th = Nh(Th, e, t, n, r, i), !0;
			case "dragenter": return Eh = Nh(Eh, e, t, n, r, i), !0;
			case "mouseover": return Dh = Nh(Dh, e, t, n, r, i), !0;
			case "pointerover":
				var a = i.pointerId;
				return Oh.set(a, Nh(Oh.get(a) || null, e, t, n, r, i)), !0;
			case "gotpointercapture": return a = i.pointerId, kh.set(a, Nh(kh.get(a) || null, e, t, n, r, i)), !0;
		}
		return !1;
	}
	function Fh(e) {
		var t = Ft(e.target);
		if (t !== null) {
			var n = o(t);
			if (n !== null) {
				if (t = n.tag, t === 13) {
					if (t = s(n), t !== null) {
						e.blockedOn = t, P(e.priority, function() {
							hh(n);
						});
						return;
					}
				} else if (t === 31) {
					if (t = c(n), t !== null) {
						e.blockedOn = t, P(e.priority, function() {
							hh(n);
						});
						return;
					}
				} else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
					e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
					return;
				}
			}
		}
		e.blockedOn = null;
	}
	function Ih(e) {
		if (e.blockedOn !== null) return !1;
		for (var t = e.targetContainers; 0 < t.length;) {
			var n = bh(e.nativeEvent);
			if (n === null) {
				n = e.nativeEvent;
				var r = new n.constructor(n.type, n);
				B = r, n.target.dispatchEvent(r), B = null;
			} else return t = It(n), t !== null && mh(t), e.blockedOn = n, !1;
			t.shift();
		}
		return !0;
	}
	function Lh(e, t, n) {
		Ih(e) && n.delete(t);
	}
	function Rh() {
		wh = !1, Th !== null && Ih(Th) && (Th = null), Eh !== null && Ih(Eh) && (Eh = null), Dh !== null && Ih(Dh) && (Dh = null), Oh.forEach(Lh), kh.forEach(Lh);
	}
	function zh(e, n) {
		e.blockedOn === n && (e.blockedOn = null, wh || (wh = !0, t.unstable_scheduleCallback(t.unstable_NormalPriority, Rh)));
	}
	var Bh = null;
	function Vh(e) {
		Bh !== e && (Bh = e, t.unstable_scheduleCallback(t.unstable_NormalPriority, function() {
			Bh === e && (Bh = null);
			for (var t = 0; t < e.length; t += 3) {
				var n = e[t], r = e[t + 1], i = e[t + 2];
				if (typeof r != "function") {
					if (Sh(r || n) === null) continue;
					break;
				}
				var a = It(n);
				a !== null && (e.splice(t, 3), t -= 3, $s(a, {
					pending: !0,
					data: i,
					method: n.method,
					action: r
				}, r, i));
			}
		}));
	}
	function Hh(e) {
		function t(t) {
			return zh(t, e);
		}
		Th !== null && zh(Th, e), Eh !== null && zh(Eh, e), Dh !== null && zh(Dh, e), Oh.forEach(t), kh.forEach(t);
		for (var n = 0; n < Ah.length; n++) {
			var r = Ah[n];
			r.blockedOn === e && (r.blockedOn = null);
		}
		for (; 0 < Ah.length && (n = Ah[0], n.blockedOn === null);) Fh(n), n.blockedOn === null && Ah.shift();
		if (n = (e.ownerDocument || e).$$reactFormReplay, n != null) for (r = 0; r < n.length; r += 3) {
			var i = n[r], a = n[r + 1], o = i[Et] || null;
			if (typeof a == "function") o || Vh(n);
			else if (o) {
				var s = null;
				if (a && a.hasAttribute("formAction")) {
					if (i = a, o = a[Et] || null) s = o.formAction;
					else if (Sh(i) !== null) continue;
				} else s = o.action;
				typeof s == "function" ? n[r + 1] = s : (n.splice(r, 3), r -= 3), Vh(n);
			}
		}
	}
	function Uh() {
		function e(e) {
			e.canIntercept && e.info === "react-transition" && e.intercept({
				handler: function() {
					return new Promise(function(e) {
						return i = e;
					});
				},
				focusReset: "manual",
				scroll: "manual"
			});
		}
		function t() {
			i !== null && (i(), i = null), r || setTimeout(n, 20);
		}
		function n() {
			if (!r && !navigation.transition) {
				var e = navigation.currentEntry;
				e && e.url != null && navigation.navigate(e.url, {
					state: e.getState(),
					info: "react-transition",
					history: "replace"
				});
			}
		}
		if (typeof navigation == "object") {
			var r = !1, i = null;
			return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(n, 100), function() {
				r = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), i !== null && (i(), i = null);
			};
		}
	}
	function Wh(e) {
		this._internalRoot = e;
	}
	Gh.prototype.render = Wh.prototype.render = function(e) {
		var t = this._internalRoot;
		if (t === null) throw Error(i(409));
		var n = t.current;
		dh(n, jd(), e, t, null, null);
	}, Gh.prototype.unmount = Wh.prototype.unmount = function() {
		var e = this._internalRoot;
		if (e !== null) {
			this._internalRoot = null;
			var t = e.containerInfo;
			dh(e.current, 2, null, e, null, null), zd(), t[Dt] = null;
		}
	};
	function Gh(e) {
		this._internalRoot = e;
	}
	Gh.prototype.unstable_scheduleHydration = function(e) {
		if (e) {
			var t = wt();
			e = {
				blockedOn: null,
				target: e,
				priority: t
			};
			for (var n = 0; n < Ah.length && t !== 0 && t < Ah[n].priority; n++);
			Ah.splice(n, 0, e), n === 0 && Fh(e);
		}
	};
	var Kh = n.version;
	if (Kh !== "19.3.1") throw Error(i(527, Kh, "19.3.1"));
	j.findDOMNode = function(e) {
		var t = e._reactInternals;
		if (t === void 0) throw typeof e.render == "function" ? Error(i(188)) : (e = Object.keys(e).join(","), Error(i(268, e)));
		return e = d(t), e = e === null ? null : p(e), e = e === null ? null : e.stateNode, e;
	};
	var qh = {
		bundleType: 0,
		version: "19.3.1",
		rendererPackageName: "react-dom",
		currentDispatcherRef: A,
		reconcilerVersion: "19.3.1"
	};
	if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
		var Jh = __REACT_DEVTOOLS_GLOBAL_HOOK__;
		if (!Jh.isDisabled && Jh.supportsFiber) try {
			et = Jh.inject(qh), tt = Jh;
		} catch {}
	}
	e.createRoot = function(e, t) {
		if (!a(e)) throw Error(i(299));
		var n = !1, r = "", o = Sc, s = Cc, c = wc;
		return t != null && (!0 === t.unstable_strictMode && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onUncaughtError !== void 0 && (o = t.onUncaughtError), t.onCaughtError !== void 0 && (s = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError)), t = lh(e, 1, !1, null, null, n, r, null, o, s, c, Uh), e[Dt] = t.current, Wf(e), new Wh(t);
	};
})), g = /* @__PURE__ */ o(((e, t) => {
	function n() {
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE == "function") try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = h();
})), _ = /* @__PURE__ */ c(u(), 1), v = m(), y = g(), b = (e, t, n = "money") => ({
	label: e,
	value: t,
	kind: n
}), x = (e, t, n) => e * (1 + t / 100) ** n, S = (e, t, n) => {
	let r = n * 12, i = Math.expm1(Math.log1p(t / 100) / 12);
	return i === 0 ? e * r : e * Math.expm1(r * Math.log1p(i)) / i;
}, C = (e, t, n) => t === 0 ? e * n : e * Math.expm1(n * Math.log1p(t / 100)) / (t / 100), w = (e, t) => [
	b("Total contributions / starting amount", e),
	b("Estimated growth", t - e),
	b("Estimated final value", t)
], T = [
	[4e5, 0],
	[8e5, .05],
	[12e5, .1],
	[16e5, .15],
	[2e6, .2],
	[24e5, .25],
	[Infinity, .3]
], ee = [
	[25e4, 0],
	[5e5, .05],
	[1e6, .2],
	[Infinity, .3]
];
function E(e, t, n, r = 2026) {
	if (![e, t].every(Number.isFinite) || e < 0 || e > 5e6 || t < 0 || t > e || ![2025, 2026].includes(Number(r))) throw Error("Check salary, deductions and supported tax year.");
	let i = Math.min(e, n ? 75e3 : 5e4), a = Math.min(t, e - i), o = Math.max(0, Math.round((e - i - a) / 10) * 10), s = 0, c = [];
	for (let [e, t] of n ? T : ee) {
		let n = Math.max(0, Math.min(o, e) - s);
		c.push({
			from: s,
			to: e,
			rate: t,
			amount: n,
			tax: n * t
		}), s = e;
	}
	let l = c.reduce((e, t) => e + t.tax, 0), u = n ? o <= 12e5 ? Math.min(l, 6e4) : 0 : o <= 5e5 ? Math.min(l, 12500) : 0, d = n && o > 12e5 ? Math.max(0, l - (o - 12e5)) : 0, f = Math.max(0, l - u - d), p = f * .04;
	return {
		standard: i,
		eligible: a,
		taxable: o,
		rows: c,
		base: l,
		rebate: u,
		relief: d,
		cess: p,
		total: Math.round((f + p) / 10) * 10
	};
}
function te(e, t, n) {
	return E(e, t, n).total;
}
function ne(e, t, n, r, i, a, o, s, c, l) {
	if (![
		e,
		t,
		r,
		i,
		a,
		o,
		c,
		l
	].every(Number.isFinite) || e < 0 || [
		t,
		i,
		a,
		o
	].some((e) => e < 0 || e > 100) || Math.min(r, c, l) < 0 || ![
		"cap",
		"full",
		"none"
	].includes(n) || !["telangana", "manual"].includes(s)) throw Error("Check CTC assumptions.");
	let u = e * t / 100, d = Math.round((n === "none" ? 0 : n === "cap" ? Math.min(u / 12, r) : u / 12) * .12), f = d * 12, p = Math.round(u * i) / 100, m = Math.round(e * a) / 100, h = Math.round(e * o) / 100, g = f + p + h, _ = e - g - m;
	if (_ < 0 || u > _ + .01) throw Error("Assumed basic salary and other CTC components exceed regular cash salary. Reduce the percentages.");
	let v = _ / 12, y = s === "telangana" ? v <= 15e3 ? 0 : v <= 2e4 ? 150 : 200 : c;
	return {
		basic: u,
		pf: d,
		employerPf: f,
		gratuity: p,
		bonus: m,
		benefits: h,
		noncash: g,
		regular: _,
		taxableCash: e - g,
		pt: y,
		extra: l
	};
}
function D(e, t, n, r, i) {
	if (![
		e,
		t,
		n,
		r,
		i
	].every(Number.isFinite) || Math.min(e, t, n, r, i) < 0 || t > e) throw Error("Check CTC and payroll deductions.");
	let a = e - t, o = a / 12, s = o - n / 12 - r - i;
	if (s < -1e-6) throw Error("Monthly deductions exceed cash salary. Check the amounts.");
	return {
		cash: a,
		monthly: o,
		tax: n / 12,
		pf: r,
		other: i,
		net: Math.max(0, s)
	};
}
var O = (e, t, n) => e * (1 + t / 400) ** (4 * n);
function k(e, t, n) {
	let r = t / 1200;
	if (e > 0 && n <= e * r) throw Error("Payment must exceed monthly interest.");
	let i = 0, a = 0, o = 0;
	for (; e > .005 && o < 1200;) {
		let t = e * r;
		i += t, e += t;
		let s = Math.min(e, n);
		a += s, e -= s, o++;
	}
	if (e > .005) throw Error("Repayment exceeds 100 years; increase payment.");
	return [
		b("Months to repay", o, "number"),
		b("Estimated interest", i),
		b("Total payments", a)
	];
}
var re = {
	tax: ({ salary: e, oldDed: t, newDed: n }) => {
		if (e > 5e6 || t > e || n > e) throw Error("Check salary and eligible deductions.");
		let r = te(e, t, !1), i = te(e, n, !0);
		return [
			b("Old regime tax", r),
			b("New regime tax", i),
			b("Absolute difference", Math.abs(r - i))
		];
	},
	salary: ({ gross: e, tax: t, pf: n, other: r }) => [
		b("Monthly gross cash salary", e / 12),
		b("Monthly tax", t / 12),
		b("Estimated monthly take-home", e / 12 - t / 12 - n - r)
	],
	tds: ({ tax: e, paid: t, months: n }) => [
		b("Remaining estimated tax", Math.max(0, e - t)),
		b("Average monthly TDS", Math.max(0, e - t) / n),
		b("Excess deducted (if any)", Math.max(0, t - e))
	],
	fdcompare: ({ principal: e, a: t, b: n, years: r }) => [
		b("Offer A maturity", O(e, t, r)),
		b("Offer B maturity", O(e, n, r)),
		b("Difference", Math.abs(O(e, t, r) - O(e, n, r)))
	],
	dicgc: ({ principal: e, interest: t }) => [
		b("Aggregate balance", e + t),
		b("Illustrative covered amount", Math.min(5e5, e + t)),
		b("Amount above limit", Math.max(0, e + t - 5e5))
	],
	nsc: ({ principal: e, rate: t }) => w(e, x(e, t, 5)),
	ssa: ({ annual: e, rate: t }) => w(e * 15, C(e, t, 15) * (1 + t / 100) ** 6),
	scss: ({ principal: e, rate: t }) => [b("Quarterly gross interest", e * t / 400), b("Annual gross interest", e * t / 100)],
	nps: ({ balance: e, monthly: t, rate: n, years: r }) => w(e + t * r * 12, x(e, n, r) + S(t, n, r)),
	retire: ({ expenses: e, inflation: t, years: n, withdraw: r }) => [
		b("Monthly expenses at retirement", x(e, t, n)),
		b("Annual expenses", x(e, t, n) * 12),
		b("Illustrative corpus target", x(e, t, n) * 12 / (r / 100))
	],
	annuity: ({ corpus: e, share: t, rate: n }) => [
		b("Annuity allocation", e * t / 100),
		b("Remaining corpus", e * (1 - t / 100)),
		b("Monthly gross pension", e * t / 100 * n / 1200)
	],
	termgap: ({ expenses: e, years: t, debt: n, assets: r }) => [b("Protection target", e * t + n), b("Additional coverage scenario", Math.max(0, e * t + n - r))],
	termquotes: ({ a: e, b: t, years: n }) => [
		b("Total premiums A", e * n),
		b("Total premiums B", t * n),
		b("Difference", Math.abs(e - t) * n)
	],
	healthquotes: ({ a: e, b: t, outa: n, outb: r }) => [
		b("Scenario annual cost A", e + n),
		b("Scenario annual cost B", t + r),
		b("Difference", Math.abs(e + n - t - r))
	],
	cardinterest: ({ balance: e, apr: t }) => [b("Monthly interest", e * t / 1200), b("Balance plus interest", e * (1 + t / 1200))],
	cardpay: ({ balance: e, apr: t, payment: n }) => k(e, t, n),
	rewards: ({ spend: e, ra: t, fa: n, rb: r, fb: i }) => [
		b("Net annual rewards A", e * t / 100 - n),
		b("Net annual rewards B", e * r / 100 - i),
		b("Difference", Math.abs(e * t / 100 - n - e * r / 100 + i))
	],
	sip: ({ monthly: e, rate: t, years: n }) => w(e * n * 12, S(e, t, n)),
	lump: ({ principal: e, rate: t, years: n }) => w(e, x(e, t, n)),
	cagr: ({ start: e, end: t, years: n }) => [b("Annualized growth rate", 100 * Math.expm1(Math.log(t / e) / n), "percent"), b("Total change", t - e)],
	rd: ({ monthly: e, rate: t, years: n }) => w(e * n * 12, S(e, t, n)),
	ppf: ({ balance: e, annual: t, rate: n, years: r }) => w(e + t * r, x(e, n, r) + C(t, n, r)),
	epf: ({ balance: e, monthly: t, rate: n, years: r }) => w(e + t * r * 12, x(e, n, r) + S(t, n, r)),
	budget: ({ income: e, essentials: t, debt: n, other: r }) => [
		b("Total monthly expenses", t + n + r),
		b("Monthly surplus / deficit", e - t - n - r),
		...e > 0 ? [b("Surplus as % of income", (e - t - n - r) / e * 100, "percent")] : []
	],
	emergency: ({ expenses: e, months: t, saved: n }) => [b("Emergency fund target", e * t), b("Amount still needed", Math.max(0, e * t - n))],
	inflation: ({ cost: e, rate: t, years: n }) => [b("Estimated future cost", x(e, t, n)), b("Increase in cost", x(e, t, n) - e)]
};
function ie(e, t) {
	if (!Object.prototype.hasOwnProperty.call(re, e) || !Object.values(t).every(Number.isFinite)) throw Error("Invalid inputs");
	let n = re[e](t);
	if (n.some((e) => !Number.isFinite(e.value))) throw Error("Calculation exceeds limits");
	return n;
}
function ae(e, t) {
	let n = t.years, r = t.rate;
	if (![
		"fd",
		"rd",
		"ppf",
		"epf"
	].includes(e) || !Object.values(t).every(Number.isFinite) || !Number.isFinite(n) || n <= 0 || n > 100 || r < 0 || r > 100) throw Error("Check the amount, annual rate and duration.");
	if (e === "fd" && (t.tax !== void 0 && (t.tax < 0 || t.tax > 100) || t.inflation !== void 0 && (t.inflation < 0 || t.inflation > 30))) throw Error("Check estimated tax (0–100%) and inflation (0–30%).");
	let i = e === "fd" ? t.principal : e === "rd" ? 0 : t.balance, a = e === "fd" ? 0 : e === "ppf" ? t.annual : t.monthly;
	if (!Number.isFinite(i) || !Number.isFinite(a) || i < 0 || a < 0 || e === "fd" && i === 0 || e === "rd" && a === 0 || e !== "fd" && !Number.isInteger(n)) throw Error("Check the savings inputs.");
	function o(t) {
		if (e === "fd") return {
			year: t,
			invested: i,
			value: i * (1 + r / 400) ** (4 * t)
		};
		let n = e === "ppf" ? t : t * 12, o = e === "ppf" ? r / 100 : Math.expm1(Math.log1p(r / 100) / 12);
		return {
			year: t,
			invested: i + a * n,
			value: i * (1 + r / 100) ** t + a * (o === 0 ? n : Math.expm1(n * Math.log1p(o)) / o)
		};
	}
	let s = o(n);
	if (!Number.isFinite(s.value) || s.value > 0x2386f26fc10000) throw Error("Estimate is outside the supported range. Reduce the amount, rate or duration.");
	let c = Array.from({ length: Math.floor(n) }, (e, t) => o(t + 1));
	n % 1 && c.push(s);
	let l = s.value - s.invested, u = l * (t.tax || 0) / 100, d = s.value - u, f = d / (1 + (t.inflation || 0) / 100) ** n;
	return {
		...s,
		interest: l,
		tax: u,
		net: d,
		real: f,
		rows: c
	};
}
var oe = (e) => String(e || "").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim().split(/\s+/).filter(Boolean);
function se(e, t, n) {
	let r = new Set(oe(n.text + " " + n.keywords));
	return (t === "all" || t === n.group) && oe(e).every((e) => [...r].some((t) => t === e || e.length >= 3 && t.startsWith(e)));
}
function ce(e, t, n, r, i = 0, a = 0) {
	if (![
		t,
		n,
		r,
		i,
		a
	].every(Number.isFinite) || t <= 0 || n <= -100 || n > 50 || !Number.isInteger(r) || r < 1 || r > 50 || i < 0 || i > 50 || a < 0 || a > 30) throw Error("Check the investment amounts, return and tenure.");
	let o = Math.expm1(Math.log1p(n / 100) / 12), s = e === "lump" ? t : 0, c = s, l = t, u = [];
	for (let t = 1; t <= r; t++) {
		if (e === "lump") s *= 1 + n / 100;
		else {
			for (let e = 0; e < 12; e++) s = s * (1 + o) + l, c += l;
			l *= 1 + i / 100;
		}
		u.push({
			year: t,
			invested: c,
			value: s
		});
	}
	if (![s, c].every(Number.isFinite)) throw Error("Projection exceeds supported limits.");
	return {
		invested: c,
		value: s,
		growth: s - c,
		real: s / (1 + a / 100) ** r,
		rows: u
	};
}
function le(e, t, n) {
	if (![
		e,
		t,
		n
	].every(Number.isFinite) || e <= 0 || t < 0 || n <= 0) throw Error("Enter a positive starting value and tenure.");
	return t === 0 ? -100 : 100 * Math.expm1(Math.log(t / e) / n);
}
var ue = 6.09;
function de(e) {
	return String(e).trim() === "" ? 6 : Number(e);
}
function fe(e, t, n, r = 0, i = 0, a = 0) {
	if (![
		e,
		t,
		n,
		r,
		i
	].every(Number.isFinite) || e <= 0 || !Number.isInteger(t) || t < 1 || t > 50 || n <= -100 || n > 50 || r < 0 || i < 0 || i > 30) throw Error("Check goal inputs.");
	let o = e * (1 + i / 100) ** t, s = r * (1 + n / 100) ** t, c = ce("sip", 1, n, t, a).value, l = Math.max(0, o - s), u = l / c, d = l === 0 ? 0 : Math.max(1, Math.ceil(u - 2 ** -52 * Math.max(1, u) * 4));
	if (!Number.isFinite(d)) throw Error("Goal exceeds calculation limits.");
	return {
		futureTarget: o,
		savedFuture: s,
		monthly: d,
		gap: l
	};
}
function pe(e, t, n, r = 0, i = 0, a = 10) {
	let o = fe(e, t, n, r, i, 0), s = fe(e, t, n, r, i, a), c = o.monthly ? ce("sip", o.monthly, n, t) : {
		invested: 0,
		value: 0
	}, l = s.monthly ? ce("sip", s.monthly, n, t, a) : {
		invested: 0,
		value: 0
	};
	return {
		fixed: o,
		stepped: s,
		fixedProjection: c,
		steppedProjection: l,
		rows: Array.from({ length: t }, (e, t) => {
			let n = s.monthly * (1 + a / 100) ** t;
			return {
				year: t + 1,
				monthly: n,
				annual: n * 12
			};
		}),
		realValue: (s.savedFuture + l.value) / (1 + i / 100) ** t
	};
}
function me(e, t, n, r, i, a) {
	if (![
		e,
		t,
		n,
		r,
		i,
		...a
	].every(Number.isFinite) || e <= 0 || !Number.isInteger(t) || t < 1 || t > 50 || n < 0 || r < 0 || i < 0 || i > 30 || a.length !== 3 || a.some((e) => e <= -100 || e > 50) || a[0] < 0) throw Error("Check the comparison assumptions.");
	let o = e * (1 + i / 100) ** t, s = a.map((a, s) => {
		let c = Math.expm1(Math.log1p(a / 100) / 12), l = r, u = r >= e ? 0 : null, d = [r], f = r;
		for (let r = 1; r <= 600; r++) l = l * (1 + c) + n, u === null && l >= e * (1 + i / 100) ** (r / 12) && (u = r), r % 12 == 0 && r <= t * 12 && d.push(l), r === t * 12 && (f = l);
		return {
			id: [
				"rd",
				"sip",
				"gold"
			][s],
			rate: a,
			months: u,
			values: d,
			value: f,
			required: fe(e, t, a, r, i).monthly,
			progress: f / o
		};
	});
	return {
		goal: o,
		options: s,
		rows: Array.from({ length: t + 1 }, (t, n) => ({
			year: n,
			goal: e * (1 + i / 100) ** n,
			rd: s[0].values[n],
			sip: s[1].values[n],
			gold: s[2].values[n]
		}))
	};
}
function he(e, t, n, r) {
	if (![
		"fd",
		"rd",
		"sip"
	].includes(e) || !Number.isFinite(t) || t <= 0 || t > 1e8 || !Number.isFinite(n) || n < -99 || n > 50 || e !== "sip" && n < 0 || !Number.isInteger(r) || r < 1 || r > 30) throw Error("Enter valid example values.");
	return ce(e === "fd" ? "lump" : "sip", t, e === "fd" ? 100 * Math.expm1(4 * Math.log1p(n / 400)) : n, r);
}
function ge(e, t, n, r, i = 0, a = 0) {
	return [
		Math.max(-99, n - 3),
		n,
		Math.min(50, n + 3)
	].map((n) => ({
		rate: n,
		...ce(e, t, n, r, i, a)
	}));
}
var _e = E, ve = (e) => Number.isFinite(e) && e >= 0;
function ye(...e) {
	if (!e.every(ve)) throw Error("Enter non-negative amounts.");
}
function be(e, t, n, r, i) {
	if (ye(e, t, n), ![2025, 2026].includes(+i)) throw Error("Unsupported year");
	return Math.max(0, Math.min(t, n - e * .1, e * (r === "metro" || r === "newmetro" && +i == 2026 ? .5 : .4)));
}
function A(e, t, n, r, i) {
	if (ye(e, t, n), e + t > 49e5) throw Error("Gross ordinary income above ₹49 lakh is outside this preview.");
	let a = Math.min(e, r ? 75e3 : 5e4), o = Math.min(n, e + t - a);
	return {
		..._e(Math.max(0, e + t - a - o) + (r ? 75e3 : 5e4), 0, r, i),
		standard: a,
		eligible: o
	};
}
function j(e) {
	let t = +e.year;
	if (ye(...Object.entries(e).filter(([e, t]) => typeof t == "number").map(([e, t]) => t)), e.basic > e.salary || e.hra > e.salary || e.basic + e.hra > e.salary || e.npsSalary > e.salary || e.employerNps > e.salary) throw Error("Salary components must fit within gross salary. If no HRA or NPS, set its inputs to zero.");
	if (e.municipal > e.rental) throw Error("Municipal tax cannot exceed annual property value.");
	let n = (e.rental - e.municipal) * .7 - e.rentalInterest;
	if (n < 0) throw Error("Rental losses are not supported; use the official estimator.");
	let r = e.interest + n + e.business + e.ordinaryGain, i = be(e.basic, e.hra, e.rent, e.city, t), a = Math.min(15e4, e.epf + e.ppf + e.life + e.principal), o = Math.min(5e4, e.nps), s = Math.min(25e3, e.health) + Math.min(e.senior === "yes" ? 5e4 : 25e3, e.parents), c = Math.min(2e5, e.homeinterest), l = Math.min(e.employerNps, e.npsSalary * (e.employer === "gov" ? 14 : 10) / 100), u = Math.min(e.employerNps, e.npsSalary * 14 / 100), d = i + a + o + s + c + e.education + l + e.oldExtra, f = u + e.newExtra;
	if (d > e.salary + r || f > e.salary + r) throw Error("Deductions exceed income; check amounts.");
	let p = A(e.salary, r, d, !1, t), m = A(e.salary, r, f, !0, t), h = 0;
	if (p.total > m.total) {
		let n = 0, i = Math.ceil(Math.max(0, e.salary + r - p.standard - d));
		for (; n < i;) {
			let a = Math.floor((n + i) / 2);
			A(e.salary, r, d + a, !1, t).total <= m.total ? i = a : n = a + 1;
		}
		h = n;
	}
	return {
		old: p,
		newer: m,
		a: i,
		c: a,
		np: o,
		health: s,
		home: c,
		eo: l,
		en: u,
		oldD: d,
		newD: f,
		other: r,
		rentNet: n,
		gap: h
	};
}
function xe(e) {
	ye(e.sale, e.cost, e.prior, e.normalTaxable);
	let t = e.gainRegime === "new" ? 13e5 : 500010;
	if (e.normalTaxable < t) throw Error("Ordinary income is too low for this limited illustration. Use the official combined estimator.");
	let n = e.sale - e.cost;
	if (n < 0) throw Error("Loss set-off is not supported.");
	if (e.normalTaxable + n + e.prior > 5e6) throw Error("Total income exceeds ₹50 lakh; surcharge not modelled.");
	let r = e.asset === "equityLT" ? Math.max(0, 125e3 - e.prior) : 0, i = Math.max(0, n - r), a = e.asset === "equityST" ? .2 : .125;
	return {
		g: n,
		used: Math.min(n, r),
		base: i,
		rate: a,
		tax: Math.round(i * a * 1.04 / 10) * 10
	};
}
function Se(e, t, n, r, i) {
	return ye(e, t, n, r, i), {
		balance: e - t - n - r,
		required: Math.max(0, e - t - i),
		advance: n
	};
}
function Ce(e, t) {
	ye(e.current, e.offer, e.currentPF, e.offerPF);
	let n = e.hikeRegime === "new", r = A(e.current, 0, 0, n, t), i = A(e.offer, 0, 0, n, t), a = (e.current - r.total) / 12 - e.currentPF, o = (e.offer - i.total) / 12 - e.offerPF;
	if (Math.min(a, o) < 0) throw Error("Payroll deductions exceed monthly salary.");
	return {
		a: r,
		b: i,
		x: a,
		y: o,
		delta: o - a
	};
}
function we(e, t, n, r, i, a, o, s, c) {
	if (e = +e, ![2025, 2026].includes(e) || !/^\d{4}-\d{2}-\d{2}$/.test(c)) throw Error("Unsupported calendar date or year.");
	let l = Se(t, n, r, i, a), u = e + 1 + "-03-31", d = e + "-04-01", f = (o === "presumptive" ? [[100, e + 1 + "-03-15"]] : [
		[15, e + "-06-15"],
		[45, e + "-09-15"],
		[75, e + "-12-15"],
		[100, e + 1 + "-03-15"]
	]).map(([e, t]) => ({
		pct: e,
		date: t,
		target: Math.ceil(l.required * e / 100),
		remaining: Math.max(0, Math.ceil(l.required * e / 100) - r)
	})), p = f.filter((e) => e.date < c).at(-1), m = f.find((e) => e.date >= c), h = c > u ? "closed" : t === 0 ? "zero" : s ? l.required < 1e4 ? "below" : r >= l.required ? "covered" : "due" : "unknown";
	return c < d && (h = "future"), {
		state: h,
		rows: f,
		next: m,
		catchup: p ? p.remaining : 0,
		required: l.required,
		remaining: Math.max(0, l.required - r),
		end: u,
		balance: l.balance
	};
}
function Te(e, t, n, r = 0) {
	let i = t / 1200, a = i === 0 ? e / n : e * i / -Math.expm1(-n * Math.log1p(i)), o = e, s = 0, c = 0, l = [];
	for (let e = 1; e <= n && o > 0; e++) {
		let t = o * i, u = e === n ? o + t : Math.min(o + t, a + r), d = u - t;
		o = Math.max(0, o - d), o < 1e-7 && (o = 0), s += t, c += u, l.push({
			month: e,
			payment: u,
			principal: d,
			interest: t,
			balance: o
		});
	}
	return {
		emi: a,
		interest: s,
		total: c,
		rows: l
	};
}
function M(e, t) {
	if (t === "month") return e.map((e) => ({
		period: e.month,
		payment: e.payment,
		principal: e.principal,
		interest: e.interest,
		balance: e.balance
	}));
	let n = [];
	for (let t of e) {
		let e = Math.ceil(t.month / 12);
		n.length && n[n.length - 1].period === e || n.push({
			period: e,
			payment: 0,
			principal: 0,
			interest: 0,
			balance: 0
		});
		let r = n[n.length - 1];
		r.payment += t.payment, r.principal += t.principal, r.interest += t.interest, r.balance = t.balance;
	}
	return n;
}
function Ee(e, t, n, r, i, a, o) {
	let s = Math.max(0, e - t - n - r), c = Math.max(0, e * i / 100 - n), l = Math.min(s, c), u = a / 1200;
	return {
		cash: s,
		cap: c,
		emi: l,
		principal: u === 0 ? l * o : l * -Math.expm1(-o * Math.log1p(u)) / u
	};
}
function De(e, t, n, r, i, a, o) {
	let s = Te(e, t, n), c = Te(e, i, a);
	return {
		a: {
			emi: s.emi,
			interest: s.interest,
			total: s.total + r
		},
		b: {
			emi: c.emi,
			interest: c.interest,
			total: c.total + o
		},
		difference: Math.abs(s.total + r - c.total - o)
	};
}
var Oe = [
	["2015–16", 26534.26],
	["2016–17", 29665.28],
	["2017–18", 29300.08],
	["2018–19", 31193.41],
	["2019–20", 37017.91],
	["2020–21", 48723.22],
	["2021–22", 47999.25],
	["2022–23", 52730.77],
	["2023–24", 60623.95],
	["2024–25", 75841.87],
	["2025–26", 118420.9]
], ke = [
	[
		"Andhra Pradesh",
		"Vijayawada",
		"vijayawada"
	],
	[
		"Andhra Pradesh",
		"Visakhapatnam",
		"visakhapatnam"
	],
	[
		"Andhra Pradesh",
		"Guntur",
		"guntur"
	],
	[
		"Andhra Pradesh",
		"Tirupati",
		"tirupati"
	],
	[
		"Andhra Pradesh",
		"Nellore",
		"nellore"
	],
	[
		"Andhra Pradesh",
		"Rajahmundry",
		"rajahmundry"
	],
	[
		"Telangana",
		"Hyderabad",
		"hyderabad"
	],
	[
		"Telangana",
		"Warangal",
		"warangal"
	],
	[
		"Tamil Nadu",
		"Chennai",
		"chennai"
	],
	[
		"Tamil Nadu",
		"Coimbatore",
		"coimbatore"
	],
	[
		"Karnataka",
		"Bengaluru",
		"bangalore"
	],
	[
		"Karnataka",
		"Mysuru",
		"mysore"
	],
	[
		"Kerala",
		"Kochi",
		"kochi"
	],
	[
		"Kerala",
		"Thiruvananthapuram",
		"thiruvananthapuram"
	],
	[
		"Maharashtra",
		"Mumbai",
		"mumbai"
	],
	[
		"Maharashtra",
		"Pune",
		"pune"
	],
	[
		"Delhi",
		"New Delhi",
		"new-delhi"
	],
	[
		"Gujarat",
		"Ahmedabad",
		"ahmedabad"
	],
	[
		"Gujarat",
		"Surat",
		"surat"
	],
	[
		"Rajasthan",
		"Jaipur",
		"jaipur"
	],
	[
		"West Bengal",
		"Kolkata",
		"kolkata"
	],
	[
		"Uttar Pradesh",
		"Lucknow",
		"lucknow"
	],
	[
		"Madhya Pradesh",
		"Indore",
		"indore"
	],
	[
		"Odisha",
		"Bhubaneswar",
		"bhubaneswar"
	],
	[
		"Bihar",
		"Patna",
		"patna"
	]
], Ae = (e) => new Intl.NumberFormat("en-IN", {
	style: "currency",
	currency: "INR",
	maximumFractionDigits: 0
}).format(e), je = {
	fdcompare: 0,
	dicgc: 1,
	nsc: 2,
	ssa: 2,
	scss: 0,
	nps: 2,
	retire: 2,
	annuity: 2,
	termgap: 1,
	termquotes: 2,
	healthquotes: 2,
	cardinterest: 0,
	cardpay: 0,
	rewards: 2,
	budget: 1,
	emergency: 1,
	inflation: 0
};
function Me(e, t) {
	let [n, r, i] = t.map((e) => e.value), a = (e = !1) => n === r ? "Both options have the same estimated amount under these inputs." : "Offer " + ((e ? n > r : n < r) ? "A" : "B") + " has " + (e ? "the higher" : "the lower") + " estimated amount by " + Ae(Math.abs(n - r)) + ". Compare terms and risks too.";
	return {
		primary: e === "fdcompare" && r > n ? 1 : je[e] ?? 0,
		summary: {
			fdcompare: () => a(!0),
			dicgc: () => i > 0 ? Ae(i) + " is above the insurance limit used here for this bank and ownership capacity." : "The entered balance is within the illustrative limit, subject to coverage rules.",
			nsc: () => Ae(n) + " in contributions or starting amount plus " + Ae(r) + " estimated growth gives " + Ae(i) + ".",
			ssa: () => Ae(n) + " contributed over the modeled deposit period could grow to " + Ae(i) + " at the selected rate.",
			scss: () => Ae(n) + " is the estimated gross interest for a full quarter, before applicable tax.",
			nps: () => Ae(i) + " is a projected balance, not a guaranteed pension or return.",
			retire: () => Ae(i) + " is an estimated target using your expenses and withdrawal rate, not a guarantee.",
			annuity: () => Ae(i) + " per month is estimated gross pension from the selected allocation and rate.",
			termgap: () => r > 0 ? "Your inputs suggest an additional coverage scenario of " + Ae(r) + ". Actual needs and eligibility may differ." : "Your entered assets cover this modeled target. Actual insurance needs may differ.",
			termquotes: () => a(),
			healthquotes: () => a(),
			cardinterest: () => Ae(n) + " is estimated interest for one month, excluding fees and new spending.",
			cardpay: () => n + " months to repay if the modeled rate and monthly payment stay unchanged and you make no new purchases.",
			rewards: () => a(!0),
			budget: () => r < 0 ? "Your expenses exceed income by " + Ae(-r) + " each month. Review expenses and commitments." : r === 0 ? "Your entered expenses use your entire monthly income." : "You have " + Ae(r) + " remaining each month before any other expenses or savings.",
			emergency: () => r > 0 ? "You still need " + Ae(r) + " to reach the selected emergency fund target." : "Your entered savings meet this emergency fund target.",
			inflation: () => Ae(n) + " is the estimated future cost at the selected inflation rate."
		}[e]?.() ?? ""
	};
}
var Ne = (e) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 8 }).format(Number(e)), Pe = (e) => ["ppf-annual", "ssa-annual"].includes(e.id);
function Fe(e) {
	if (Pe(e)) return "Annual contribution limit: ₹1,50,000 per financial year." + (e.id === "ssa-annual" ? " Minimum ₹250." : "");
	if ([
		"fdcompare-principal",
		"budget-income",
		"retire-withdraw"
	].includes(e.id)) {
		let t = e.id === "retire-withdraw", n = (e) => t ? Ne(e) + "%" : "₹" + Ne(e);
		return "Allowed range: " + n(e.min) + " to " + n(e.max) + ".";
	}
	return "";
}
function Ie(e, t, n) {
	let r = n || e.name || "Amount", i = Number(t);
	if (typeof t != "string" || !t.trim() || !Number.isFinite(i)) return "Enter a number for " + r + ".";
	if (e.min != null && i < Number(e.min)) return r + " must be at least " + Ne(e.min) + ".";
	if (e.max != null && i > Number(e.max)) return Pe(e) ? "Annual contribution cannot exceed ₹1,50,000 per financial year." : r + " must be no more than " + Ne(e.max) + ".";
	let a = Number(e.step ?? 1), o = Number(e.min ?? 0);
	return e.step !== "any" && a > 0 && Math.abs((i - o) / a - Math.round((i - o) / a)) > 1e-6 ? r + " must use increments of " + a + "." : "";
}
function Le(e) {
	let t = {};
	function n(e) {
		if (typeof e == "string") return;
		let [r, i, a] = e, o = (e) => typeof e == "string" ? e : [
			"input",
			"select",
			"textarea"
		].includes(e[0]) ? "" : e[2].map(o).join("");
		function s(e) {
			if (typeof e == "string") return null;
			if ([
				"input",
				"select",
				"textarea"
			].includes(e[0]) && e[1].id) return e[1].id;
			for (let t of e[2]) {
				let e = s(t);
				if (e) return e;
			}
			return null;
		}
		if (r === "label") {
			let n = i.for || s(e);
			n && (t[n] = a.map(o).join("").trim());
		}
		a.forEach(n);
	}
	return n(e), t;
}
function Re(e, t, n) {
	return {
		...e,
		...Object.fromEntries(n.filter((e) => Object.hasOwn(t, e)).map((e) => [e, t[e]]))
	};
}
// src/finance-card.mjs
var N = _.createElement, ze = new Intl.NumberFormat("en-IN", {
	style: "currency",
	currency: "INR",
	maximumFractionDigits: 0
}), Be = (e) => ze.format(e);
new Set("fdcompare dicgc nsc ssa scss nps retire annuity termgap termquotes healthquotes cardinterest cardpay rewards budget emergency inflation".split(" "));
var Ve = (e, t) => Object.hasOwn(e, t);
function He(e, t) {
	typeof e != "string" && (t(e), e[2].forEach((e) => He(e, t)));
}
var Ue = (e, t) => (e.class || "").split(/\s+/).includes(t);
function We(e) {
	let t = [];
	return He(e, ([e, n]) => {
		e === "input" && n.type === "number" && t.push(n);
	}), t;
}
var Ge = (e) => typeof e == "string" ? e : e[2].map(Ge).join("");
function Ke(e) {
	let t = {};
	return He(e, ([e, n, r]) => {
		e === "label" && n.for && (t[n.for] = r.map(Ge).join("").trim());
	}), t;
}
var qe = (e) => Object.fromEntries(We(e).map((e) => [e.id, e.value ?? ""]));
function Je(e, t) {
	let n = e[1], r = n["data-save-mode"], i = We(e), a = {};
	for (let n of i) {
		let r = t[n.id], i = Number(r), o = Ie(n, r, Ke(e)[n.id]);
		if (o) throw Error(o);
		a[n.name] = i;
	}
	return {
		v: a,
		result: r ? ae(r, a) : ie(n["data-fin-tool"], a)
	};
}
function Ye(e) {
	let t = {}, n = {
		class: "className",
		for: "htmlFor",
		inputmode: "inputMode",
		tabindex: "tabIndex",
		colspan: "colSpan",
		rowspan: "rowSpan",
		novalidate: "noValidate",
		readonly: "readOnly"
	};
	for (let [r, i] of Object.entries(e)) if (!(r.startsWith("on") || r === "value")) {
		if (r === "style") t.style = Object.fromEntries((i || "").split(";").filter((e) => e.includes(":")).map((e) => {
			let t = e.indexOf(":");
			return [e.slice(0, t).trim().replace(/-([a-z])/g, (e, t) => t.toUpperCase()), e.slice(t + 1).trim()];
		}));
		else if (["href", "src"].includes(r) && /^[\w-]+\.html(?:[#?]|$)/.test(i)) {
			let [e, n = ""] = i.split(/(?=[?#])/);
			t[r] = "/" + (e === "index.html" ? "" : e === "income-tax-studio.html" ? "income-tax/studio/" : e.replace(".html", "/")) + n;
		} else t[n[r] || r] = [
			"required",
			"hidden",
			"disabled",
			"open",
			"novalidate",
			"readonly"
		].includes(r) ? !0 : i ?? "";
	}
	return t;
}
var Xe = (e, t, n = e) => N("div", { key: n }, N("span", null, e), N("strong", null, t));
function Ze(e, t, n) {
	return [
		N("small", { key: "label" }, "Estimated " + (["fd", "rd"].includes(e) ? "maturity" : "balance")),
		N("strong", {
			key: "value",
			className: "mw-save-big"
		}, Be(n.value)),
		Xe("Total saved / starting balance", Be(n.invested)),
		Xe("Estimated interest", Be(n.interest)),
		...e === "fd" ? [Xe("Estimated after tax", Be(n.net)), Xe("Value in today’s money (" + t.inflation + "% inflation)", Be(n.real))] : []
	];
}
function Qe(e, t, n) {
	let r = e === "fd" ? "Deposit " + Be(t.principal) + " once. Interest stays invested and earns more interest." : e === "rd" ? "Save " + Be(t.monthly) + " every month. Earlier deposits earn interest for longer." : e === "ppf" ? "This example adds " + Be(t.annual) + " each year at year end. Actual PPF rules may differ." : "This example uses " + Be(t.monthly) + " monthly EPF credits, excluding EPS, and your current balance.";
	return [N("h3", { key: "heading" }, "What this means"), N("p", { key: "text" }, r + " After " + t.years + " years, your estimated balance is ", N("b", null, Be(n.value)), ".")];
}
function $e(e) {
	let t = Math.max(1, e.value, e.invested);
	return e.rows.filter((t, n) => n === 0 || n === e.rows.length - 1 || (n + 1) % Math.max(1, Math.ceil(e.rows.length / 5)) === 0).map((e) => N("div", {
		className: "mw-save-chart-row",
		key: e.year
	}, N("span", null, "Year " + e.year), N("div", null, N("i", { style: { width: e.invested / t * 100 + "%" } }), N("i", { style: { width: e.value / t * 100 + "%" } })), N("b", null, Be(e.value))));
}
function et({ node: e }) {
	let t = e[1], n = t["data-save-mode"], [r, i] = (0, _.useState)(() => qe(e)), a = qe(e), o = Ke(e), s = Object.fromEntries(We(e).map((e) => [e.id, Ie(e, r[e.id], o[e.id])])), c = () => i(a), l = Object.keys(a).some((e) => a[e] !== r[e]), [u, d] = (0, _.useState)("");
	(0, _.useEffect)(() => {
		if (!n) return;
		let e = () => d(location.hash.slice(1));
		return e(), window.addEventListener("hashchange", e), () => window.removeEventListener("hashchange", e);
	}, [n]);
	let f = null, p = "";
	try {
		f = Je(e, r);
	} catch (e) {
		p = e.message;
	}
	function m(e, a) {
		if (typeof e == "string") return e;
		let [o, d, h] = e, g = {
			...Ye(d),
			key: a
		}, v = () => h.map((e, t) => m(e, t));
		if (o === "section" && n && n !== "fd" && (g.hidden = ([
			"rd",
			"ppf",
			"epf"
		].includes(u) ? u : "rd") !== n), o === "form" && (g.noValidate = !0, g.onSubmit = (e) => {
			e.preventDefault();
			let t = e.currentTarget.closest("section"), n = t?.querySelector("input[aria-invalid=\"true\"]");
			n ? n.focus() : t?.querySelector(".mw-fin-result")?.focus({ preventScroll: !0 });
		}), o === "input") {
			let e = d.type === "range" ? d["data-save-slider"] : d.id;
			if (e && Ve(r, e) && (g.value = r[e], g.onChange = (t) => i((n) => ({
				...n,
				[e]: t.target.value
			})), d.type === "number")) {
				g["aria-invalid"] = !!s[e];
				let t = [
					d["aria-describedby"],
					Fe(d) ? e + "-limit" : null,
					s[e] ? e + "-validation" : null
				].filter(Boolean);
				t.length && (g["aria-describedby"] = t.join(" "));
			}
			let t = d.type === "number" ? Fe(d) : "", n = d.type === "number" ? s[e] : "";
			return t || n ? N(_.Fragment, { key: a }, N(o, g), t ? N("small", {
				id: e + "-limit",
				className: "mw-field-limit"
			}, t) : null, n ? N("small", {
				id: e + "-validation",
				className: "mw-field-limit"
			}, n) : null) : N(o, g);
		}
		if (o === "details" && d.id === "fd-tax" && u === "fd-tax" && (g.open = !0), Ue(d, "mw-fin-error")) return N(o, {
			...g,
			hidden: !p
		}, p);
		if (Ue(d, "mw-fin-result")) {
			if (n) return N(o, {
				...g,
				tabIndex: -1
			}, f ? Ze(n, f.v, f.result) : "Correct the highlighted input to see your estimate.");
			if (!f) return N(o, {
				...g,
				tabIndex: -1
			}, "Correct the input above to see your estimate.");
			let e = f.result, { primary: r, summary: i } = Me(t["data-fin-tool"], e), a = (e) => e.kind === "percent" ? e.value.toFixed(2) + "%" : e.kind === "number" ? String(e.value) : Be(e.value);
			return N(o, {
				...g,
				tabIndex: -1
			}, N("div", { className: "mw-fin-primary" }, N("small", null, e[r].label), N("strong", null, a(e[r]))), ...e.map((e, t) => t === r ? null : Xe(e.label, a(e), t)), i ? N("p", { className: "mw-fin-explanation" }, i) : null);
		}
		return Ve(d, "data-save-story") ? N(o, g, f ? Qe(n, f.v, f.result) : null) : Ve(d, "data-save-chart") ? N(o, g, f ? $e(f.result) : null) : Ve(d, "data-save-rows") ? N(o, g, f ? f.result.rows.map((e) => N("tr", { key: e.year }, N("th", { scope: "row" }, e.year), N("td", null, Be(e.invested)), N("td", null, Be(e.value)))) : null) : [
			"img",
			"hr",
			"br",
			"wbr"
		].includes(o) ? N(o, g) : o === "form" ? N(o, g, ...v(), N("button", {
			type: "button",
			className: "mw-fin-reset",
			disabled: !l,
			onClick: c
		}, "Reset example"), N("small", { className: "mw-fin-live-note" }, "Results update as you type.")) : N(o, g, v());
	}
	return m(e, "card");
}
// src/search-intents.mjs
var tt = (e) => String(e ?? "").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim(), nt = [
	[
		"income-tax.html",
		"income-tax/studio/#calendar",
		"Check upcoming tax deadlines",
		/^(tax calendar|tax deadline|advance tax deadline|advance tax dates|itr due date|tax due date|tax payment dates)$/
	],
	[
		"income-tax.html",
		"income-tax/studio/#payments",
		"Check tax already paid and estimated balance",
		/^(advance tax|tax payment|tax balance|tax paid|tax payable|self assessment tax)$/
	],
	[
		"income-tax.html",
		"income-tax/studio/#gains",
		"Estimate capital gains tax",
		/^(capital gains( tax)?|ltcg( tax)?|stcg( tax)?|tax on capital gains)$/
	],
	[
		"income-tax.html",
		"income-tax/studio/#hike",
		"Compare salary before and after a hike",
		/^(salary hike|salary increment|salary comparison|compare salary|pay raise|salary hike calculator)$/
	],
	[
		"income-tax.html",
		"income-tax/studio/#filing",
		"Explore ITR filing guidance",
		/^(itr|itr filing|income tax filing|which itr|which itr form|tax return|file income tax)$/
	],
	[
		"income-tax.html",
		"income-tax/studio/#plan",
		"Explore eligible tax deductions and compare regimes",
		/^(tax saving(s)?|tax planning|save tax|how to save tax|hra|hra exemption|tax deduction(s)?|80c|80d)$/
	],
	[
		"income-tax.html",
		"income-tax/#salary",
		"Estimate monthly in-hand salary from annual CTC",
		/^(salary|take home( salary| pay)?|in hand( salary| pay)?|net salary|ctc|ctc to in hand|ctc to take home|ctc calculator|salary calculator|monthly take home|how much salary will i get)$/
	],
	[
		"income-tax.html",
		"income-tax/#tds",
		"Estimate remaining monthly TDS",
		/^(tds|tds calculator|salary tds|tds on salary)$/
	],
	[
		"loans.html",
		"loans/#prepayment",
		"See how extra loan payments could reduce interest",
		/^(prepayment|loan prepayment|extra payment(s)?|loan extra payment|pay loan early|reduce loan interest|part payment)$/
	],
	[
		"loans.html",
		"loans/#affordability",
		"Estimate affordable EMI and loan amount",
		/^(loan affordability|affordable emi|affordable loan|how much loan can i afford|how much loan can i get|loan eligibility)$/
	],
	[
		"loans.html",
		"loans/#loan-compare",
		"Compare two loan offers",
		/^(compare loan(s)?|loan comparison|loan offer(s)?|compare loan offer(s)?)$/
	],
	[
		"loans.html",
		"loans/#schedule",
		"Explore repayment and outstanding balance",
		/^(loan schedule|emi schedule|repayment schedule|amortization|amortisation|outstanding loan|loan balance)$/
	],
	[
		"investments.html",
		"investments/#goal",
		"Plan a savings goal and compare RD, SIP and gold",
		/^(goal|goal planner|goal planning|financial goal|savings goal|investment goal|goal calculator|step up sip|compare sip and gold|sip vs gold|rd vs sip vs gold)$/
	],
	[
		"investments.html",
		"investments/#lump",
		"Estimate one-time investment growth",
		/^(lump sum|lumpsum|one time investment|lump sum calculator)$/
	],
	[
		"investments.html",
		"investments/#cagr",
		"Calculate annualized investment returns",
		/^(cagr|cagr calculator|annualized return|annualised return)$/
	],
	[
		"investments.html",
		"investments/#learn",
		"Understand how FD, RD and SIP grow",
		/^(how sip works|how fd works|how rd works|how investments work|learn investing)$/
	],
	[
		"investments.html",
		"investments/#sip",
		"Estimate monthly SIP growth",
		/^(sip|sip calculator|monthly sip|mutual fund sip)$/
	],
	[
		"savings.html",
		"savings/#fd-tax",
		"Estimate FD maturity after illustrative tax",
		/^(fd tax|fd after tax|tax on fd interest|after tax fd)$/
	],
	[
		"banking.html",
		"banking/#fdcompare",
		"Compare two fixed deposit offers",
		/^(compare fd|fd comparison|fd rate comparison|compare fixed deposits)$/
	],
	[
		"banking.html",
		"banking/#dicgc",
		"Understand bank deposit insurance limits",
		/^(dicgc|deposit insurance|bank deposit insurance|bank deposit protection)$/
	],
	[
		"long-term-savings.html",
		"long-term-savings/#rd",
		"Estimate recurring deposit maturity",
		/^(rd|rd calculator|recurring deposit)$/
	],
	[
		"long-term-savings.html",
		"long-term-savings/#ppf",
		"Estimate public provident fund balance",
		/^(ppf|ppf calculator|public provident fund)$/
	],
	[
		"long-term-savings.html",
		"long-term-savings/#epf",
		"Estimate employee provident fund balance",
		/^(epf|epf calculator|employee provident fund)$/
	],
	[
		"gold.html",
		"gold-intelligence/#hallmark",
		"Check hallmark format and official BIS verification guidance",
		/^(hallmark|hallmark check|huid|huid check|bis hallmark|gold hallmark|verify huid)$/
	],
	[
		"gold.html",
		"gold-intelligence/#history",
		"Explore RBI historical gold averages",
		/^(gold history|gold price history|historical gold price|gold 10 year history)$/
	],
	[
		"gold.html",
		"gold-intelligence/#explorer",
		"Explore indicative city gold prices",
		/^(city gold|city gold rates|gold city price|local gold price|gold price by city|gold rate in (hyderabad|vijayawada|mumbai|chennai|delhi|bangalore|bengaluru|guntur))$/
	],
	[
		"gold.html",
		"gold/?metal=silver",
		"Estimate silver purchase cost",
		/^(silver|silver price calculator|silver calculator)$/
	]
];
function rt(e) {
	let t = tt(e), n = t.match(/^(?:gold rate|gold price|gold rates|gold prices) in (.+)$/);
	if (n) {
		let e = ke.find((e) => tt(e[1]) === n[1] || tt(e[2]) === n[1]);
		if (e) return {
			category: "gold.html",
			destination: "/gold-intelligence/?city=" + encodeURIComponent(e[2]) + "#explorer",
			description: "Explore indicative gold prices for " + e[1] + ", " + e[0]
		};
	}
	let r = nt.find((e) => e[3].test(t));
	return r ? {
		category: r[0],
		destination: "/" + r[1],
		description: r[2]
	} : null;
}
// src/saved-tools.mjs
var it = _.createElement, at = "moneykavach-saved-tools-v1", ot = Object.freeze([
	["loans/", "Loans and EMI"],
	["investments/", "Investments"],
	["income-tax/", "Income tax and salary"],
	["income-tax/studio/", "Income Tax Studio"],
	["savings/", "Fixed deposits"],
	["long-term-savings/", "RD, PPF and EPF"],
	["banking/", "Banking"],
	["personal-finance/", "Personal finance"],
	["government-schemes/", "Government schemes"],
	["retirement/", "Retirement"],
	["insurance/", "Insurance"],
	["credit-cards/", "Credit cards"],
	["property/", "Property"],
	["gold/", "Gold and silver"],
	["gold-intelligence/", "Gold Intelligence"]
]);
function st(e) {
	return Array.isArray(e) ? [...new Set(e.filter((e) => ot.some(([t]) => t === e)))].slice(0, 6) : [];
}
function ct() {
	let [e, t] = (0, _.useState)([]), [n, r] = (0, _.useState)("loans/"), [i, a] = (0, _.useState)("");
	(0, _.useEffect)(() => {
		try {
			t(st(JSON.parse(localStorage.getItem("moneykavach-saved-tools-v1") || "[]")));
		} catch {
			a("Browser storage is unavailable; shortcuts work for this visit only.");
		}
	}, []);
	function o(e) {
		let n = st(e);
		t(n);
		try {
			n.length ? localStorage.setItem(at, JSON.stringify(n)) : localStorage.removeItem(at), a(n.length ? "Shortcuts saved on this device." : "Saved shortcuts cleared.");
		} catch {
			a("Browser storage is unavailable; shortcuts work for this visit only.");
		}
	}
	return it("details", { className: "mw-saved-tools" }, it("summary", null, "My saved calculators", e.length ? " (" + e.length + ")" : ""), it("p", null, "Keep up to six shortcuts on this browser. No salary, loan or other calculator values are stored."), it("div", { className: "mw-saved-controls" }, it("select", {
		"aria-label": "Choose calculator to save",
		value: n,
		onChange: (e) => r(e.target.value)
	}, ot.map(([e, t]) => it("option", {
		key: e,
		value: e
	}, t))), it("button", {
		type: "button",
		disabled: e.includes(n) || e.length >= 6,
		onClick: () => o([...e, n])
	}, "Save shortcut")), e.length ? it("ul", { className: "mw-saved-list" }, e.map((t) => it("li", { key: t }, it("a", { href: "/" + t }, ot.find((e) => e[0] === t)[1]), it("button", {
		type: "button",
		"aria-label": "Remove " + ot.find((e) => e[0] === t)[1],
		onClick: () => o(e.filter((e) => e !== t))
	}, "Remove")))) : it("p", null, "No shortcuts saved yet."), e.length ? it("button", {
		type: "button",
		className: "mw-saved-clear",
		onClick: () => o([])
	}, "Clear saved shortcuts") : null, it("p", {
		role: "status",
		className: "mw-saved-status"
	}, i));
}
// src/site-components.mjs
var lt = _.createElement, ut = {
	maxlength: "maxLength",
	minlength: "minLength",
	autocapitalize: "autoCapitalize",
	spellcheck: "spellCheck",
	colspan: "colSpan",
	rowspan: "rowSpan",
	referrerpolicy: "referrerPolicy",
	crossorigin: "crossOrigin",
	novalidate: "noValidate",
	readonly: "readOnly",
	inputmode: "inputMode",
	class: "className",
	for: "htmlFor",
	tabindex: "tabIndex",
	autocomplete: "autoComplete",
	viewbox: "viewBox",
	"stroke-width": "strokeWidth",
	"stroke-linecap": "strokeLinecap",
	"stroke-linejoin": "strokeLinejoin",
	preserveaspectratio: "preserveAspectRatio",
	"fill-rule": "fillRule",
	"clip-rule": "clipRule"
}, dt = new Set("area base br col embed hr img input link meta param source track wbr".split(" "));
function ft(e) {
	if (!e || e.startsWith("#") || /^https?:/.test(e)) return e;
	let t = e.match(/^([\w-]+)\.html(.*)$/);
	return t ? "/" + (t[1] === "index" ? "" : t[1] === "income-tax-studio" ? "income-tax/studio/" : t[1].endsWith("-preview") ? t[1] + ".html" : t[1] + "/") + t[2] : /^(assets|data)\//.test(e) ? "/" + e : e;
}
function pt(e) {
	let t = {};
	for (let [n, r] of Object.entries(e)) n.startsWith("on") || (n === "style" ? t.style = Object.fromEntries((r || "").split(";").filter((e) => e.includes(":")).map((e) => {
		let t = e.indexOf(":");
		return [e.slice(0, t).trim().replace(/-([a-z])/g, (e, t) => t.toUpperCase()), e.slice(t + 1).trim()];
	})) : t[ut[n] || n] = [
		"hidden",
		"disabled",
		"required",
		"open",
		"novalidate",
		"readonly"
	].includes(n) ? !0 : [
		"href",
		"src",
		"action"
	].includes(n) ? ft(r) : r ?? "");
	return t;
}
var mt = (e) => typeof e == "string" ? e : e[2].map(mt).join(""), ht = (e, t) => {
	typeof e != "string" && (t(e), e[2].forEach((e) => ht(e, t)));
}, gt = () => {
	document.getElementById("tools")?.scrollIntoView({
		block: "start",
		behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth"
	}), document.getElementById("mwToolsHeading")?.focus({ preventScroll: !0 });
}, _t = Object.freeze({
	query: "",
	group: "all"
}), vt = _t, yt = /* @__PURE__ */ new Set(), bt = (e) => (yt.add(e), () => yt.delete(e));
function xt(e) {
	vt = e, yt.forEach((e) => e());
}
var St = () => (0, _.useSyncExternalStore)(bt, () => vt, () => _t);
function Ct({ node: e }) {
	let [t, n] = (0, _.useState)(!1), [r, i] = (0, _.useState)("");
	(0, _.useEffect)(() => {
		i(location.pathname);
		let e = (e) => {
			e.key === "Escape" && t && (n(!1), document.getElementById("mwNavToggle")?.focus());
		}, r = window.matchMedia("(max-width:930px)"), a = () => n(!1);
		r.addEventListener("change", a);
		let o = (e) => {
			e.target.closest?.("#mwPrimaryNav,#mwNavToggle") || n(!1);
		};
		return document.addEventListener("keydown", e), document.addEventListener("click", o), () => {
			document.removeEventListener("keydown", e), document.removeEventListener("click", o), r.removeEventListener("change", a);
		};
	}, [t]);
	function a(e, i) {
		if (typeof e == "string") return e;
		let [o, s, c] = e, l = {
			...pt(s),
			key: i
		};
		return s.id === "mwNavToggle" && (l["aria-expanded"] = t, l["aria-label"] = t ? "Close navigation" : "Open navigation", l.onClick = () => n((e) => !e)), s.id === "mwPrimaryNav" && (l.className = (l.className || "") + (t ? " is-open" : "")), o === "a" && (l.onClick = () => n(!1), r && l.href?.startsWith("/") && !l.href.includes("#") && l.href.split("?")[0] === r && (l["aria-current"] = "page")), dt.has(o) ? lt(o, l) : lt(o, l, c.map(a));
	}
	return lt(_.Fragment, null, e[2].map(a));
}
function wt({ node: e }) {
	let t = St(), n = [], r = t.group === "all" ? rt(t.query) : null;
	ht(e, (e) => {
		e[1]["data-category"] && (e[1].class || "").includes("tool-link") && n.push(e);
	});
	let i = (e) => r ? e[1].href === r.category : se(t.query, t.group, {
		text: mt(e),
		keywords: e[1]["data-keywords"],
		group: e[1]["data-category"]
	}), a = n.filter(i).length, o = t.query.trim() || t.group !== "all";
	function s(e, n, c = null) {
		if (typeof e == "string") return e;
		let [l, u, d] = e, f = {
			...pt(u),
			key: n
		};
		return u.id === "mwToolsHeading" && (f.tabIndex = -1), u.id === "toolSearch" && (f.value = t.query, f.onChange = (e) => xt({
			query: e.target.value,
			group: "all"
		})), u.id === "mwHomeSearch" && (f.onSubmit = (e) => {
			e.preventDefault(), gt();
		}), u["data-search-term"] && (f.onClick = () => {
			xt({
				query: u["data-search-term"],
				group: "all"
			}), gt();
		}), u["data-tool-filter"] && (f["aria-pressed"] = t.group === u["data-tool-filter"], f.onClick = () => xt({
			query: "",
			group: u["data-tool-filter"]
		})), u.id === "mwToolCount" ? lt(l, f, a + (a === 1 ? " category" : " categories") + (o ? " found" : "")) : (u.id === "mwClearSearch" && (f.hidden = !o, f.onClick = () => {
			xt(_t), document.getElementById("toolSearch")?.focus();
		}), u.id === "noResults" && (f.hidden = a !== 0), u["data-category"] && (u.class || "").includes("tool-link") && (f.hidden = !i(e), r && u.href === r.category && (f.href = r.destination, c = r)), l === "p" && c ? lt(l, f, c.description) : dt.has(l) ? lt(l, f) : lt(l, f, d.map((e, t) => s(e, t, c))));
	}
	return lt(_.Fragment, null, e[2].map((e, t) => s(e, t)), e[1].id === "tools" ? lt(ct) : null);
}
// src/investments.mjs
var P = _.createElement, Tt = new Intl.NumberFormat("en-IN", {
	style: "currency",
	currency: "INR",
	maximumFractionDigits: 0
}), F = (e) => Tt.format(e), Et = (e) => e >= 1e7 ? "₹" + (e / 1e7).toLocaleString("en-IN", { maximumFractionDigits: 2 }) + " crore" : e >= 1e5 ? "₹" + (e / 1e5).toLocaleString("en-IN", { maximumFractionDigits: 2 }) + " lakh" : F(e), Dt = (e, t) => {
	typeof e != "string" && (t(e), e[2].forEach((e) => Dt(e, t)));
}, Ot = (e) => {
	let t = [];
	return Dt(e, ([e, n]) => {
		e === "input" && n.type === "number" && t.push(n);
	}), t;
}, kt = [
	"sip",
	"lump",
	"cagr",
	"goal",
	"learn"
], At = () => kt.includes(location.hash.slice(1)) ? location.hash.slice(1) : "sip", jt = (e, t, n = e) => P("div", { key: n }, P("span", null, e), P("strong", null, t)), Mt = (e, t) => [P("p", {
	className: "mw-inv-result-label",
	key: "label"
}, e), P("strong", {
	className: "mw-inv-big",
	key: "big"
}, t)], Nt = {
	rd: "Bank recurring deposit",
	sip: "Mutual fund SIP",
	gold: "Gold"
}, Pt = {
	rd: "#39749c",
	sip: "#487a60",
	gold: "#a67420",
	goal: "#553528"
}, Ft = (e) => e === null ? "Not within 50 years" : e === 0 ? "Already reached" : Math.floor(e / 12) + " yr " + e % 12 + " mo", It = {
	fd: {
		amount: 1e5,
		rate: 7,
		steps: [
			"Deposit money once",
			"Bank pays interest at agreed terms",
			"Receive principal + interest at maturity"
		],
		note: "Cumulative FD with quarterly compounding. Actual rates, terms, withdrawal charges and taxes may differ."
	},
	rd: {
		amount: 5e3,
		rate: 7,
		steps: [
			"Deposit a fixed amount monthly",
			"Each deposit earns interest for its remaining term",
			"Receive contributions + interest at maturity"
		],
		note: "Simplified recurring deposit with month-end deposits; actual bank rules may differ. Taxes excluded."
	},
	sip: {
		amount: 5e3,
		rate: 10,
		steps: [
			"Invest a fixed amount monthly",
			"Buy fund units at changing prices",
			"The value rises or falls with unit prices"
		],
		note: "SIP is a method, not a return guarantee. Actual market returns fluctuate and may be negative. Taxes and fund costs excluded."
	}
}, Lt = new Set("area base br col embed hr img input link meta param source track wbr".split(" "));
function Rt(e, t) {
	let n = {}, r = Le(e);
	for (let i of Ot(e)) {
		if (!i.name) continue;
		let e = t[i.id], a = i.id === "goal-inflation" ? de(e) : Number(e), o = Ie(i, i.id === "goal-inflation" && String(e).trim() === "" ? String(a) : e, r[i.id]);
		if (o) throw Error(o);
		n[i.name] = a;
	}
	return n;
}
function zt(e) {
	let t = Math.max(1, ...e.map((e) => Math.max(e.value, e.invested)));
	return e.filter((t, n) => n === 0 || n === e.length - 1 || t.year % Math.max(1, Math.ceil(e.length / 5)) === 0).map((e) => P("div", {
		className: "mw-inv-bar-row",
		key: e.year
	}, P("span", null, "Year " + e.year), P("div", null, ...[["mw-inv-contribution", e.invested], ["mw-inv-projection", e.value]].map(([e, n]) => P("div", {
		className: "mw-inv-bar-track",
		key: e
	}, P("i", {
		className: e,
		style: { width: n / t * 100 + "%" }
	})))), P("strong", null, Et(e.value))));
}
function Bt(e, t) {
	let n = t.options.filter((e) => e.months !== null).sort((e, t) => e.months - t.months), r = n.filter((e) => e.months === n[0]?.months);
	return [P("div", {
		className: "mw-compare-summary",
		key: "summary"
	}, P("small", null, "Same goal in " + e.years + " years"), P("strong", null, F(t.goal)), P("p", null, r.length ? "Earliest projected to reach: " + r.map((e) => Nt[e.id]).join(" and ") + " (" + Ft(r[0].months) + ")." : "None reaches the growing goal within 50 years at this budget.", " Results depend on your inputs.")), P("div", {
		className: "mw-goal-compare-grid",
		key: "options"
	}, t.options.map((t) => P("article", {
		className: "mw-goal-option",
		key: t.id,
		style: { "--option-color": Pt[t.id] }
	}, P("h4", null, Nt[t.id]), P("small", null, "Expected annual return " + t.rate + "%"), P("strong", { className: "mw-option-value" }, F(t.value)), P("small", null, "Projected after " + e.years + " years"), P("div", { className: "mw-option-progress" }, P("i", { style: { width: Math.min(100, t.progress * 100) + "%" } })), P("p", null, (t.progress * 100).toFixed(1) + "% of goal · " + (t.progress >= 1 ? "reached" : "not reached")), P("div", { className: "mw-option-stat" }, P("span", null, "Time to first reach goal"), P("b", null, Ft(t.months))), P("div", { className: "mw-option-stat" }, P("span", null, "Monthly amount needed by deadline"), P("b", null, F(t.required))))))];
}
function Vt(e, t) {
	let n = Math.max(1, ...t.rows.flatMap((e) => [
		e.rd,
		e.sip,
		e.gold,
		e.goal
	])), r = (t) => 48 + t / e.years * 280, i = (e) => 167 - e / n * 155;
	return [P("svg", {
		key: "svg",
		viewBox: "0 0 340 195",
		role: "img",
		"aria-label": "Yearly projected RD, SIP, gold and inflation-adjusted goal"
	}, [
		...Array.from({ length: 5 }, (e, t) => {
			let r = n * t / 4;
			return P(_.Fragment, { key: t }, P("line", {
				x1: 48,
				y1: i(r),
				x2: 328,
				y2: i(r),
				stroke: "#e1c8b7"
			}), P("text", {
				x: 43,
				y: i(r) + 3,
				textAnchor: "end"
			}, r >= 1e7 ? (r / 1e7).toPrecision(2) + "Cr" : r >= 1e5 ? (r / 1e5).toPrecision(2) + "L" : Math.round(r / 1e3) + "k"));
		}),
		...[
			"rd",
			"sip",
			"gold",
			"goal"
		].map((e) => P("polyline", {
			key: e,
			fill: "none",
			stroke: Pt[e],
			strokeWidth: e === "goal" ? 1.8 : 2.4,
			strokeDasharray: e === "goal" ? "5 4" : void 0,
			points: t.rows.map((t) => r(t.year).toFixed(1) + "," + i(t[e]).toFixed(1)).join(" ")
		})),
		P("text", {
			key: "start",
			x: 48,
			y: 189
		}, "0"),
		P("text", {
			key: "end",
			x: 328,
			y: 189,
			textAnchor: "end"
		}, e.years + " yr")
	]), P("p", { key: "legend" }, [
		"rd",
		"sip",
		"gold",
		"goal"
	].map((e) => P("span", {
		key: e,
		style: {
			color: Pt[e],
			marginRight: 12
		}
	}, e === "goal" ? "Goal" : Nt[e])))];
}
var Ht = null, Ut = /* @__PURE__ */ new Set();
function Wt(e, t, n) {
	Ht = {
		monthly: t,
		rate: e.rate,
		years: e.years,
		step: n,
		inflation: e.inflation
	}, Ut.forEach((e) => e(Ht)), location.hash = "sip";
}
function Gt({ node: e }) {
	let t = e[1].id, n = Object.fromEntries(Ot(e).map((e) => [e.id, e.value ?? ""])), r = Le(e), [i, a] = (0, _.useState)(() => n), [o, s] = (0, _.useState)("sip"), [c, l] = (0, _.useState)("fd");
	(0, _.useEffect)(() => {
		let e = () => s(At());
		return e(), window.addEventListener("hashchange", e), () => window.removeEventListener("hashchange", e);
	}, []), (0, _.useEffect)(() => {
		if (t !== "sip") return;
		let e = (e) => a((t) => ({
			...t,
			...Object.fromEntries(Object.entries(e).map(([e, t]) => ["sip-" + e, String(t)]))
		}));
		return Ut.add(e), Ht && e(Ht), () => Ut.delete(e);
	}, [t]);
	let u = (e, t) => a((n) => ({
		...n,
		[e]: String(t)
	})), d = {}, f = null, p = "", m = null, h = null, g = null, v = "", y = [], b = It[c];
	try {
		if (d = Rt(e, i), t === "sip" || t === "lump") {
			let e = t === "sip" ? d.monthly : d.principal;
			f = ce(t, e, d.rate, d.years, d.step || 0, d.inflation || 0), y = ge(t, e, d.rate, d.years, d.step || 0, d.inflation || 0);
		} else if (t === "cagr") f = { annual: le(d.start, d.end, d.years) };
		else if (t === "goal") {
			m = fe(d.target, d.years, d.rate, d.saved, d.inflation), h = me(d.target, d.years, d.budget, d.saved, d.inflation, [
				d.fd,
				d.rate,
				d.gold
			]);
			try {
				let t = Number(i["goal-step"]), n = Ie(Ot(e).find((e) => e.id === "goal-step"), i["goal-step"], r["goal-step"]);
				if (n) throw Error(n);
				g = pe(d.target, d.years, d.rate, d.saved, d.inflation, t);
			} catch (e) {
				v = e.message;
			}
		} else t === "learn" && (f = he(c, b.amount, b.rate, 10));
	} catch (e) {
		p = e.message;
	}
	function x() {
		return p ? "—" : t === "goal" && m ? [
			...Mt("Estimated monthly SIP needed", F(m.monthly)),
			jt("Future goal (after inflation)", F(m.futureTarget)),
			jt("Projected existing savings", F(m.savedFuture)),
			jt("Amount still needed at goal date", F(m.gap)),
			m.gap === 0 ? P("p", { key: "covered" }, "Existing savings meet this goal with these inputs.") : null
		] : t === "cagr" && f ? [...Mt("Annualized return", f.annual.toFixed(2) + "%"), jt("Total change", F(d.end - d.start))] : f ? [
			...Mt(t === "learn" ? "Value after 10 years" : "Projected investment value", F(f.value)),
			jt(t === "learn" ? "Your contributions" : "Total invested", F(f.invested)),
			jt(f.growth < 0 ? "Projected loss" : t === "learn" && c !== "sip" ? "Estimated interest" : "Projected growth", F(f.growth)),
			...d.inflation > 0 ? [jt("Value in today’s money", F(f.real))] : []
		] : "—";
	}
	function S(s, C) {
		if (typeof s == "string") return s;
		let [w, T, ee] = s, E = {
			...pt(T),
			key: C
		}, te = () => ee.map(S), ne = (T.class || "").split(/\s+/);
		if (w === "section" && T.id === t && (E.hidden = o !== t), w === "form" && (E.onSubmit = (e) => e.preventDefault(), t !== "learn")) return P(w, E, ...te(), P("button", {
			type: "button",
			className: "mw-fin-reset",
			disabled: Object.keys(n).every((e) => n[e] === i[e]),
			onClick: () => a(n)
		}, "Reset example"), P("small", { className: "mw-fin-live-note" }, "Results update as you type."));
		if (w === "input") {
			let e = T.type === "range" ? T["data-invest-slider"] : T.id;
			return Object.hasOwn(i, e) && (E.value = i[e], E.onChange = (t) => u(e, t.target.value), T.type === "number" && (E["aria-invalid"] = !!Ie(T, e === "goal-inflation" && i[e].trim() === "" ? String(de(i[e])) : i[e], r[e]))), P(w, E);
		}
		if (T["data-invest-amount"]) {
			let t = T["data-invest-amount"];
			return P(w, E, Ot(e).find((e) => e.id === t) && (t.endsWith("monthly") || t.endsWith("principal")) && Number.isFinite(Number(i[t])) ? Et(Number(i[t])) : "");
		}
		return T["data-goal-preset"] && (E.onClick = () => u("goal-target", T["data-goal-preset"])), T["data-goal-step"] && (E.onClick = () => u("goal-step", T["data-goal-step"])), T.id === "goalUseCpi" && (E.onClick = () => u("goal-inflation", ue)), T.id === "goalUseDefault" && (E.onClick = () => u("goal-inflation", 6)), T.id === "goalUseSip" && (E.disabled = !m || m.monthly < 1 || m.monthly > 1e8, E.onClick = () => {
			m && Wt(d, m.monthly, 0);
		}), T.id === "goalUseStepSip" && (E.disabled = !g || g.stepped.monthly < 1 || g.stepped.monthly > 1e8, E.onClick = () => {
			g && Wt(d, g.stepped.monthly, Number(i["goal-step"]));
		}), T.id === "goalStepError" ? P(w, {
			...E,
			hidden: !v
		}, v) : ne.includes("mw-fin-error") ? P(w, {
			...E,
			hidden: !p
		}, p) : ne.includes("mw-fin-result") ? P(w, E, x()) : Object.hasOwn(T, "data-growth-chart") ? P(w, E, f?.rows ? zt(f.rows) : null) : Object.hasOwn(T, "data-growth-rows") ? P(w, E, f?.rows?.map((e) => P("tr", { key: e.year }, P("th", { scope: "row" }, e.year), P("td", null, F(e.invested)), P("td", null, F(e.value)))) ?? null) : Object.hasOwn(T, "data-invest-scenarios") ? P(w, E, y.map((e, t) => P("div", { key: t }, P("small", null, [
			"Lower return",
			"Your input",
			"Higher return"
		][t]), P("b", null, e.rate.toFixed(1) + "%"), P("strong", null, F(e.value))))) : T.id === "goalInflationStory" ? P(w, {
			...E,
			hidden: !m
		}, m ? P(_.Fragment, null, P("h3", null, "What this means"), P("div", { className: "mw-inflation-story-values" }, P("div", null, P("small", null, "What you want today"), P("strong", null, F(d.target))), P("span", { "aria-hidden": !0 }, "→"), P("div", null, P("small", null, "Needed in " + d.years + " years"), P("strong", null, F(m.futureTarget)))), P("p", null, "At " + d.inflation + "% yearly inflation, " + F(m.futureTarget) + " may buy roughly what " + F(d.target) + " buys today."), P("p", null, m.monthly ? "Investing about " + F(m.monthly) + " per month at the selected " + d.rate + "% annual return could reach the goal." : "Existing savings are projected to cover the goal.", " Actual returns and inflation may differ.")) : null) : T.id === "goalCompareResult" ? P(w, E, h ? Bt(d, h) : "Enter valid goal details.") : T.id === "goalCompareGraph" ? P(w, {
			...E,
			hidden: !h
		}, h ? Vt(d, h) : null) : (T.id === "goalCompareData" && (E.hidden = !h), T.id === "goalCompareRows" ? P(w, E, h?.rows.map((e) => P("tr", { key: e.year }, P("th", { scope: "row" }, e.year), ...[
			"rd",
			"sip",
			"gold",
			"goal"
		].map((t) => P("td", { key: t }, F(e[t]))))) ?? null) : T.id === "goalStepResult" ? P(w, E, g ? P(_.Fragment, null, P("div", { className: "mw-step-compare" }, P("div", null, P("small", null, "Fixed SIP / month"), P("strong", null, F(g.fixed.monthly))), P("div", null, P("small", null, "Step-up SIP · year 1 / month"), P("strong", null, F(g.stepped.monthly)))), P("div", { className: "mw-step-details" }, jt("Monthly SIP in final year", F(g.rows.at(-1).monthly)), jt("Total new contributions · fixed SIP", F(g.fixedProjection.invested)), jt("Total new contributions · step-up SIP", F(g.steppedProjection.invested)), jt("Projected final amount", F(g.stepped.savedFuture + g.steppedProjection.value)), jt("Projected value in today’s money", F(g.realValue)))) : "Enter valid goal details.") : (T.id === "goalStepSchedule" && (E.hidden = !g), T.id === "goalStepRows" ? P(w, E, g?.rows.map((e) => P("tr", { key: e.year }, P("th", { scope: "row" }, e.year), P("td", null, F(e.monthly)), P("td", null, F(e.annual)))) ?? null) : (T["data-learn-mode"] && (E["aria-pressed"] = c === T["data-learn-mode"], E.onClick = () => l(T["data-learn-mode"])), T.id === "learnBasics" ? P(w, E, b.steps.map((e, t) => P("div", { key: t }, P("b", null, t + 1), P("span", null, e)))) : T.id === "learnAssumptions" ? P(w, E, F(b.amount) + (c === "fd" ? " deposited once" : " invested per month") + " · " + b.rate + "% expected annual " + (c === "sip" ? "return" : "interest") + " · 10 years") : (T.id === "learnOpenCalculator" && (E.href = c === "fd" ? "/savings/" : c === "rd" ? "/long-term-savings/#rd" : "#sip"), T.id === "learnUnits" && (E.hidden = c !== "sip"), T.id === "learnCaveat" ? P(w, E, b.note) : T.id === "learnExplanation" ? P(w, {
			...E,
			hidden: !f
		}, f ? P(_.Fragment, null, P("h3", null, "Where does the final amount come from?"), P("div", {
			className: "mw-learn-breakdown",
			"aria-label": "Contribution and growth breakdown"
		}, P("i", { style: { width: Math.min(f.invested, f.value) / Math.max(f.invested, f.value, 1) * 100 + "%" } }), P("i", {
			className: "mw-learn-gain",
			style: { width: Math.max(0, f.growth) / Math.max(f.invested, f.value, 1) * 100 + "%" }
		})), P("p", null, "At the selected " + b.rate + "% annual " + (c === "sip" ? "return" : "interest") + ", the projected value is ", P("strong", null, F(f.value)), " after 10 years.")) : null) : Lt.has(w) ? P(w, E) : P(w, E, te())))));
	}
	return S(e, "card");
}
// src/tax.mjs
var I = _.createElement, Kt = (e) => new Intl.NumberFormat("en-IN", {
	style: "currency",
	currency: "INR",
	maximumFractionDigits: 0
}).format(e), qt = (e, t) => Object.hasOwn(e, t), L = {
	basic: [
		"tax",
		"salary",
		"tds"
	],
	studio: [
		"plan",
		"hike",
		"gains",
		"payments",
		"filing",
		"calendar"
	]
}, Jt = (e, t) => {
	typeof e != "string" && (t(e), e[2].forEach((e) => Jt(e, t)));
}, Yt = new Set("area base br col embed hr img input link meta param source track wbr".split(" "));
function Xt(e) {
	let t = [];
	return Jt(e, (e) => {
		e[0] === "option" && t.push(e);
	}), t;
}
function Zt(e) {
	let t = {};
	return Jt(e, (e) => {
		let [n, r] = e;
		(n === "input" || n === "select") && r.id && (t[r.id] = {
			tag: n,
			a: r,
			options: n === "select" ? Xt(e) : []
		});
	}), t;
}
function Qt(e) {
	return Object.fromEntries(Object.entries(e).map(([e, t]) => [e, t.tag === "select" ? (t.options.find((e) => qt(e[1], "selected")) ?? t.options[0])?.[1].value ?? "" : t.a.value ?? ""]));
}
function $t(e, t, n) {
	if (e.tag === "select") {
		if (!e.options.some((e) => e[1].value === t)) throw Error("Check the selected option.");
		return t;
	}
	let r = Ie(e.a, t, n);
	if (r) throw Error(r);
	return Number(t);
}
var en = (e) => {
	try {
		return {
			data: e(),
			error: ""
		};
	} catch (e) {
		return {
			data: null,
			error: e.message
		};
	}
}, R = (e, t, n = !1) => I("div", {
	className: n ? "tp-line" : void 0,
	key: e
}, I("span", null, e), I("strong", null, Kt(t))), tn = (e, t, n = !1) => n ? I("div", {
	className: "tp-big",
	key: e
}, I("small", null, e), I("strong", null, Kt(t))) : [I("small", { key: "label" }, e), I("strong", {
	className: "mw-tax-big",
	key: "amount"
}, Kt(t))], nn = (e, t, n, r = !1) => I("div", {
	className: r ? "tp-bar" : "mw-tax-bar",
	key: e
}, I("div", null, I("span", null, e), " ", I("b", null, Kt(t))), I("i", { style: { width: Math.min(100, Math.max(0, t / Math.max(1, n) * 100)) + "%" } }));
function rn(e, t, n) {
	return I("details", {
		className: n ? void 0 : "mw-tax-options",
		key: e
	}, I("summary", null, e + " — how tax is calculated"), I("p", null, "Standard deduction " + Kt(t.standard) + " · eligible reductions " + Kt(t.eligible) + " · taxable income " + Kt(t.taxable)), n ? t.rows.filter((e) => e.amount > 0).map((e) => nn(Math.round(e.rate * 100) + "% on " + Kt(e.amount), e.tax, Math.max(t.base, 1), !0)) : I("div", { className: "mw-tax-table" }, I("table", null, I("thead", null, I("tr", null, ...[
		"Income band",
		"Rate",
		"Tax in band"
	].map((e) => I("th", { key: e }, e)))), I("tbody", null, t.rows.map((e) => I("tr", { key: e.from }, I("td", null, Kt(e.from) + " – " + (Number.isFinite(e.to) ? Kt(e.to) : "above")), I("td", null, Math.round(e.rate * 100) + "%"), I("td", null, Kt(e.tax))))))), ...[
		"base",
		"rebate",
		"relief",
		"cess",
		"total"
	].map((e, r) => R([
		"Slab tax",
		"Rebate",
		"Marginal relief",
		"Cess",
		"Total"
	][r], t[e], n)));
}
var an = () => {
	let e = new Intl.DateTimeFormat("en-GB", {
		timeZone: "Asia/Kolkata",
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).formatToParts(/* @__PURE__ */ new Date()), t = (t) => e.find((e) => e.type === t).value;
	return t("year") + "-" + t("month") + "-" + t("day");
}, on = (e) => new Intl.DateTimeFormat("en-IN", {
	timeZone: "UTC",
	day: "numeric",
	month: "short",
	year: "numeric"
}).format(/* @__PURE__ */ new Date(e + "T00:00:00Z")), sn = (e, t) => Math.round((Date.parse(t + "T00:00:00Z") - Date.parse(e + "T00:00:00Z")) / 864e5);
function cn({ node: e, studio: t = !1 }) {
	let n = Zt(e), r = Le(e), i = Qt(n), [a, o] = (0, _.useState)(() => Qt(n)), [s, c] = (0, _.useState)(t ? "plan" : "tax"), [l, u] = (0, _.useState)(!1), d = t ? L.studio : L.basic;
	(0, _.useEffect)(() => {
		let e = () => {
			let e = location.hash.slice(1);
			c(d.includes(e) ? e : d[0]);
		};
		return e(), window.addEventListener("hashchange", e), () => window.removeEventListener("hashchange", e);
	}, [t]);
	let f = {};
	Jt(e, (e) => {
		e[0] === "section" && d.includes(e[1].id) && (f[e[1].id] = e);
	});
	let p = (e) => $t(n[e], a[e], r[e]), m = a["salary-structure"] === "quick", h = ["cap", "unsure"].includes(a["salary-pfmode"]), g = a["salary-regime"] === "manual", v = a["tds-mode"] === "manual", y = (e) => (m ? [
		"salary-noncash",
		"salary-pf",
		"salary-other"
	].includes(e) : [
		"salary-state",
		"salary-pfmode",
		"salary-pt",
		"salary-basic",
		"salary-pfcap",
		"salary-gratuity",
		"salary-bonus",
		"salary-benefits",
		"salary-extra"
	].includes(e)) || e === "salary-pfcap" && !h || e === "salary-pt" && a["salary-state"] !== "manual", b = (e) => {
		let t = {};
		return Jt(f[e], (r) => {
			let [i, a] = r;
			if (a.id && a.name && n[a.id] && (i === "input" || i === "select")) {
				if (e === "salary" && (y(a.id) || a.id === "salary-tax" && !g) || e === "tds" && a.id === "tds-tax" && !v) return;
				t[a.name] = p(a.id);
			}
		}), t;
	}, x = {};
	t ? (x.plan = en(() => j(b("plan"))), x.hike = en(() => Ce(b("hike"), Number(p("year")))), x.gains = en(() => xe(b("gains"))), x.payments = en(() => {
		if (!x.plan.data) throw Error("Enter valid tax inputs first.");
		let e = b("payments"), t = (e.payRegime === "new" ? x.plan.data.newer : x.plan.data.old).total;
		return {
			v: e,
			tax: t,
			...Se(t, e.withheld, e.advance, e.self, e.expectedTDS)
		};
	}), x.filing = en(() => {
		let e = b("filing"), t = e.biz !== "no", n = e.resident !== "yes" || e.complex === "yes" || e.cg === "other" || e.houses === "3" || e.over === "yes";
		return t ? e.biz === "pres" && !n ? "ITR-4 may be eligible" : "Explore ITR-3" : n ? "Explore ITR-2" : "ITR-1 may be eligible";
	}), x.calendar = en(() => {
		if (!x.payments.data) throw Error("Enter valid income and payment details first.");
		let { v: e, tax: t } = x.payments.data, n = Number(p("year")), r = an();
		return {
			v: e,
			tax: t,
			y: n,
			today: r,
			r: we(n, t, e.withheld, e.advance, e.self, e.expectedTDS, e.advanceType, e.confirmed === "yes", r)
		};
	})) : (x.tax = en(() => {
		let e = b("tax"), t = E(e.salary, e.oldDed, !1, e.year), n = E(e.salary, e.newDed, !0, e.year);
		return {
			v: e,
			a: t,
			b: n,
			lower: Math.min(t.total, n.total),
			difference: Math.abs(t.total - n.total)
		};
	}), x.salary = en(() => {
		let e = b("salary"), t = m && e.pfmode === "unsure", n = (t) => ne(e.gross, e.basic, t, t === "cap" ? e.pfcap : 0, e.gratuity, e.bonus, e.benefits, e.state, e.state === "manual" ? e.pt : 0, e.extra), r = m ? n(t ? "cap" : e.pfmode) : null;
		function i(t) {
			let n = p("tax-year"), r = e.regime;
			if (r === "lower") {
				let e = E(t, p("tax-oldDed"), !1, n), i = E(t, p("tax-newDed"), !0, n);
				r = e.total < i.total ? "old" : "new";
			}
			return {
				tax: E(t, p(r === "old" ? "tax-oldDed" : "tax-newDed"), r === "new", n).total,
				selected: r,
				year: n
			};
		}
		r && (e.noncash = r.noncash + r.bonus, e.pf = r.pf, e.other = r.pt + r.extra);
		let a = g ? { tax: e.tax } : i(r ? r.taxableCash : e.gross - e.noncash);
		e.tax = a.tax;
		let o = D(e.gross, e.noncash, e.tax, e.pf, e.other), s = null;
		if (t) {
			let t = n("full"), r = g ? e.tax : i(t.taxableCash).tax;
			s = D(e.gross, t.noncash + t.bonus, r, t.pf, t.pt + t.extra).net;
		}
		return {
			v: e,
			q: r,
			r: o,
			tax: a,
			fullNet: s
		};
	}), x.tds = en(() => {
		let e = b("tds");
		if (!v) {
			if (!x.salary.data) throw Error("Enter valid salary details in the in-hand salary planner.");
			e.tax = x.salary.data.v.tax;
		}
		return {
			v: e,
			rows: ie("tds", {
				tax: e.tax,
				paid: e.paid,
				months: e.months
			})
		};
	}));
	function S(e, t, n) {
		o((n) => ({
			...n,
			[e]: t
		})), n === "plan" && u(!0);
	}
	function C(e) {
		x.tax.data && (o((t) => ({
			...t,
			"salary-structure": "detail",
			"salary-gross": String(x.tax.data.v.salary),
			"salary-noncash": "0",
			"salary-regime": "lower",
			...e === "tds" ? { "tds-mode": "auto" } : {}
		})), location.hash = e);
	}
	function w(e, t) {
		if (!t) return "—";
		if (e === "tax") return [
			...tn("Estimated annual tax · lower of the two", t.lower),
			R("Old regime", t.a.total),
			R("New regime", t.b.total),
			R("Annual tax difference", t.difference),
			R("Monthly equivalent of lower tax", t.lower / 12)
		];
		if (e === "salary") {
			let { v: e, q: n, r, fullNet: i } = t;
			return [
				...tn(i === null ? "Estimated monthly take-home" : "Monthly take-home · limited PF example", r.net),
				R("Monthly gross cash salary (before deductions)", r.monthly),
				R("Income tax / month", r.tax),
				R("Employee PF / month", r.pf),
				...n ? [R("Professional tax / month", n.pt), R("Other deductions / month", n.extra)] : [R("Other deductions / month", r.other)],
				I("details", {
					className: "mw-salary-breakdown",
					key: "breakdown"
				}, I("summary", null, "See annual CTC and tax breakdown"), R("Annual CTC / gross amount", e.gross), R("Annual regular cash salary", r.cash), R("Annual regular take-home (12 months)", r.net * 12), R("Annual income tax", e.tax), ...n ? [
					R("Employer PF", n.employerPf),
					R("Gratuity", n.gratuity),
					R("Other non-cash benefits", n.benefits),
					R("Variable pay (paid separately)", n.bonus)
				] : [R("Annual non-cash CTC", e.noncash)])
			];
		}
		return [
			...tn("Estimated TDS per remaining month", t.rows[1].value),
			R("Remaining estimated tax", t.rows[0].value),
			R("Tax deducted above estimate", t.rows[2].value)
		];
	}
	function T(e, t) {
		if (!t) return null;
		if (e === "tax") return [
			I("h3", { key: "h" }, t.a.total === t.b.total ? "Both regimes have the same estimated tax" : t.a.total < t.b.total ? "Old regime has lower estimated tax" : "New regime has lower estimated tax"),
			I("p", { key: "p" }, "Taxable income is not the same as gross salary. Each rate applies only to income within its slab."),
			nn("Old regime", t.a.total, Math.max(t.a.total, t.b.total)),
			nn("New regime", t.b.total, Math.max(t.a.total, t.b.total))
		];
		if (e === "salary") {
			let { r: e, q: n, fullNet: r } = t;
			return [
				r === null ? null : I("div", {
					id: "salaryPfComparison",
					key: "pf"
				}, I("h3", null, "Estimated monthly range"), I("strong", { className: "mw-salary-range" }, Kt(Math.min(e.net, r)) + " – " + Kt(Math.max(e.net, r))), I("p", null, "Limited PF: " + Kt(e.net) + " · Full PF: " + Kt(r)), I("p", null, "Breakdown and TDS use the limited PF scenario.")),
				I("h3", { key: "h" }, "Where your monthly salary goes"),
				...[
					"net",
					"tax",
					"pf",
					"other"
				].map((t, n) => nn([
					"Take-home",
					"Tax",
					"Employee PF",
					"Other deductions"
				][n], e[t], e.monthly)),
				I("p", { key: "p" }, n ? "Your CTC includes employer contributions and other benefits. Regular monthly take-home excludes those amounts and variable pay, then subtracts employee deductions and estimated tax. Variable pay is assumed paid in full for the annual tax estimate." : "Regular monthly take-home is cash salary minus employee deductions and estimated tax. CTC may include amounts you do not receive in your bank account.")
			];
		}
		return [
			I("h3", { key: "h" }, "Annual tax progress"),
			nn("Tax already deducted", t.v.paid, Math.max(t.v.tax, t.v.paid)),
			nn("Estimated tax still due", t.rows[0].value, Math.max(t.v.tax, t.v.paid)),
			I("p", { key: "p" }, t.rows[2].value ? "Actual refund or adjustment depends on final liability." : "Remaining tax is divided across " + t.v.months + " payroll months.")
		];
	}
	function ee(e, t) {
		if (!t) return null;
		if (e === "plan") {
			let e = Math.max(t.old.total, t.newer.total);
			return [
				I("div", {
					className: "tp-compare",
					key: "compare"
				}, tn("Old tax rules · yearly tax", t.old.total, !0), tn("New tax rules · yearly tax", t.newer.total, !0)),
				I("h3", { key: "h" }, t.old.total === t.newer.total ? "Both regimes have equal estimated tax" : t.old.total < t.newer.total ? "Old regime is lower under these inputs" : "New regime is lower under these inputs"),
				R("Tax you could save per year", Math.abs(t.old.total - t.newer.total), !0),
				nn("Old regime", t.old.total, e, !0),
				nn("New regime", t.newer.total, e, !0),
				I("p", { key: "context" }, "Old rules allow more eligible deductions; new rules have different rates and fewer deductions."),
				R("Other taxable income", t.other, !0),
				R("Net taxable rent", t.rentNet, !0),
				I("details", { key: "deductions" }, I("summary", null, "Eligible deduction breakdown"), ...[
					"a",
					"c",
					"np",
					"health",
					"home",
					"eo",
					"en",
					"oldD",
					"newD"
				].map((e, n) => R([
					"HRA exemption",
					"Combined 80C-style deductions",
					"Personal additional NPS",
					"Health insurance",
					"Self-occupied home interest",
					"Employer NPS old",
					"Employer NPS new",
					"Old total before standard deduction",
					"New total before standard deduction"
				][n], t[e], !0))),
				I("details", { key: "extra" }, I("summary", null, "Could more deductions make the old rules cheaper?"), tn("Extra eligible reductions needed to match new tax", t.gap, !0), I("p", null, "Not an amount you must spend or invest. Only legally eligible amounts count.")),
				rn("Old regime", t.old, !0),
				rn("New regime", t.newer, !0),
				I("a", {
					key: "next",
					href: "#payments"
				}, "Use this estimate to review tax payments →")
			];
		}
		if (e === "hike") return [
			I("div", {
				className: "tp-compare",
				key: "compare"
			}, tn("Current monthly net", t.x, !0), tn("New monthly net", t.y, !0)),
			tn("Monthly change after tax and deductions", t.delta, !0),
			R("Current annual tax", t.a.total, !0),
			R("New annual tax", t.b.total, !0),
			nn("Current", t.x, Math.max(t.x, t.y), !0),
			nn("New", t.y, Math.max(t.x, t.y), !0)
		];
		if (e === "gains") return [
			tn("Estimated tax on this gain incl. cess", t.tax, !0),
			R("Gain", t.g, !0),
			R("Remaining equity threshold applied", t.used, !0),
			R("Taxable gain", t.base, !0),
			I("p", { key: "p" }, "Special rate " + t.rate * 100 + "% before cess. Not combined annual tax; reconcile with official calculator.")
		];
		if (e === "payments") return [
			l ? null : I("p", {
				className: "tp-example",
				key: "example"
			}, "Based on the example salary. ", I("a", { href: "#plan" }, "Enter your own salary →")),
			tn(t.balance < 0 ? "Potential excess paid (not confirmed refund)" : "Estimated balance before future withholding", Math.abs(t.balance), !0),
			R("Estimated annual tax", t.tax, !0),
			R("Estimated advance-tax liability after expected withholding", t.required, !0),
			t.v.confirmed !== "yes" && t.tax > 0 ? I("p", { key: "confirm" }, "Check your TDS and expected deductions before relying on this estimate.") : null,
			I("a", {
				href: "#calendar",
				key: "next"
			}, "See your next action and installment dates →")
		];
		if (e === "filing") return [
			I("h3", { key: "h" }, t),
			I("p", { key: "p" }, "Estimated form suggestion, not an eligibility decision. Review official exclusions and form instructions for AY 2026–27."),
			I("a", {
				key: "link",
				href: "https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-1"
			}, "Official form guidance →")
		];
	}
	function te(e) {
		if (!e) return I("p", null, "Enter valid income and payment details first.");
		let { r: t, tax: n, y: r, today: i, v: a } = e;
		return [
			l ? null : I("p", {
				className: "tp-example",
				key: "example"
			}, "Showing the example salary, not your personal tax result. ", I("a", { href: "#plan" }, "Enter your own salary first →")),
			I("p", {
				className: "tp-calendar-context",
				key: "context"
			}, "Selected year " + r + "–" + String(r + 1).slice(2) + " · " + a.payRegime + " regime · as of " + on(i)),
			I("h3", {
				id: "calendarStatus",
				key: "status"
			}, {
				closed: "Selected tax year has ended",
				zero: "No advance tax expected under this estimate",
				unknown: "Check your TDS first",
				below: "No advance tax expected under this estimate",
				covered: "Estimated advance tax already covered",
				due: "Advance tax may be required",
				future: "Selected tax year has not started"
			}[t.state]),
			t.state === "due" ? I(_.Fragment, { key: "due" }, tn("Estimated advance tax still to pay", t.remaining, !0), t.catchup > 0 ? I(_.Fragment, null, I("p", { className: "tp-calendar-alert" }, "An earlier cumulative target is not yet covered. Review shortfall and possible interest."), R("Earlier target shortfall (estimate)", t.catchup, !0)) : null, t.next ? I(_.Fragment, null, I("h3", null, "Next installment target · " + on(t.next.date)), I("p", null, sn(i, t.next.date) === 0 ? "Due today" : sn(i, t.next.date) + " days remaining"), R("Additional amount to reach target", t.next.remaining, !0)) : I("p", null, "Final installment date has passed. Review unpaid amounts promptly."), I("details", null, I("summary", null, "See full installment schedule"), I("div", { className: "tp-calendar" }, t.rows.map((e) => I("div", { key: e.date }, I("strong", null, on(e.date)), I("span", null, e.pct + "% cumulative · " + Kt(e.target), I("br"), I("small", null, e.date < i ? "Date passed" : e.date === i ? "Today" : "Upcoming"))))))) : I("p", { key: "message" }, {
				zero: "Your ordinary-income tax estimate is zero. Check special-rate income and ITR filing separately.",
				unknown: "Check your employer/bank withholding before determining separate payments.",
				closed: "The advance-tax period has ended. Review unpaid balances and filing requirements; interest and fees may apply.",
				below: "Estimated annual tax left after expected withholding is below ₹10,000.",
				covered: "Advance tax already paid covers the estimated annual requirement.",
				future: "Use this schedule when the tax year begins."
			}[t.state]),
			t.state === "unknown" ? R("Estimated annual tax", n, !0) : null,
			t.state === "closed" ? R("Estimated balance before adjustments", Math.max(0, t.balance), !0) : null,
			t.state === "below" ? R("Estimated annual tax after withholding", t.required, !0) : null
		];
	}
	function O(e, t, c = "") {
		if (typeof e == "string") return e;
		let [f, p, _] = e, b = {
			...pt(p),
			key: t
		}, E = (p.class || "").split(/\s+/);
		f === "section" && d.includes(p.id) && (c = p.id, b.hidden = s !== c);
		let ne = () => _.map((e, t) => O(e, t, c)), D = x[c]?.data, k = x[c]?.error;
		if (f === "form") {
			b.onSubmit = (e) => e.preventDefault();
			let t = Object.keys(Zt(e));
			if (t.length) return I(f, b, ...ne(), I("button", {
				type: "button",
				className: "mw-fin-reset",
				disabled: t.every((e) => a[e] === i[e]),
				onClick: () => {
					o((e) => Re(e, i, t)), c === "plan" && u(!1);
				}
			}, "Reset example"));
		}
		if (p["data-tax-view"] && (s === p["data-tax-view"] ? b["aria-current"] = "true" : delete b["aria-current"]), p["data-panel"] && (b["aria-current"] = String(s === p["data-panel"])), f === "input" || f === "select") return n[p.id] && (b.value = a[p.id], delete b.defaultValue, c === "salary" && (b.disabled = y(p.id), p.id === "salary-tax" && (b.readOnly = !g, b.value = g ? a[p.id] : D ? String(D.v.tax) : "")), p.id === "tds-tax" && (b.readOnly = !v, b.value = v ? a[p.id] : D ? String(D.v.tax) : ""), b.onChange = (e) => S(p.id, e.target.value, c), p.type === "number" && !b.disabled && !b.readOnly && (b["aria-invalid"] = !!Ie(p, a[p.id], r[p.id]))), f === "input" ? I(f, b) : I(f, b, ne());
		if (f === "option") return delete b.selected, I(f, b, ne());
		if (p["data-tax-salary"] && (b.onClick = () => S("tax-salary", p["data-tax-salary"], c)), p["data-amount"] && (b.onClick = () => S("salary", p["data-amount"], c)), (p.id === "taxToSalary" || p.id === "taxToTds") && (b.disabled = !x.tax.data, b.onClick = () => C(p.id === "taxToSalary" ? "salary" : "tds")), c === "salary") {
			if (qt(p, "data-quick") && (b.hidden = !m), qt(p, "data-detail") && (b.hidden = m), p.id === "salaryCapField" && (b.hidden = !m || !h), p.id === "salaryManualPt" && (b.hidden = !m || a["salary-state"] !== "manual"), p.id === "salaryManualTax" && (b.hidden = !g), p.id === "salaryPfHelp") return I(f, b, {
				cap: "12% of basic pay, limited to the selected wage ceiling.",
				full: "12% of the entered basic salary, no ceiling.",
				none: "Select only if PF does not apply.",
				unsure: "Compare limited and full PF."
			}[a["salary-pfmode"]]);
			if (p.id === "salaryTaxAssumptions") return I(f, b, g ? "Manual tax estimate." : D ? "Using " + D.tax.selected + " regime · " + D.tax.year + " · eligible deductions from Compare regimes." : "");
			if (f === "label" && p.for === "salary-gross") return I(f, b, m ? "Annual CTC (₹)" : "Annual CTC / gross amount (₹)");
		}
		if (E.includes("mw-fin-error") || E.includes("tp-error")) return I(f, {
			...b,
			hidden: !k
		}, k || "");
		if (E.includes("mw-fin-result")) return I(f, b, w(c, D));
		if (qt(p, "data-tax-story")) return I(f, b, T(c, D));
		if (p.id === "taxBreakdown") return I(f, b, D ? [rn("Old regime", D.a, !1), rn("New regime", D.b, !1)] : null);
		if (p.id === "tpExample" && l) return I(f, b, "Your current inputs · estimate, not a tax return.");
		if (p.id === "calendarResult") return I(f, b, te(D));
		if (p.id === "calendarFiling") {
			let e = Number(a.year);
			return I(f, b, I("div", { className: "tp-calendar" }, I("div", null, I("strong", null, on(e + 1 + "-03-31")), I("span", null, "Tax year ends; prepare income and deduction records.")), I("div", null, I("strong", null, on(e + 1 + "-07-31")), I("span", null, "Standard filing deadline for ordinary non-business, non-audit individuals where applicable. Check extensions and filing category."))));
		}
		if (p.id === "calendarVerify") {
			let e = "";
			if (a.calendarFiled) {
				let t = /* @__PURE__ */ new Date(a.calendarFiled + "T00:00:00Z");
				if (Number.isFinite(+t)) {
					t.setUTCDate(t.getUTCDate() + 30);
					let n = t.toISOString().slice(0, 10), r = sn(an(), n);
					e = "Estimated verification deadline: " + on(n) + " · " + (r < 0 ? "date passed; check official guidance" : r === 0 ? "today" : r + " days remaining");
				}
			}
			return I(f, b, e);
		}
		return E.includes("tp-result") ? I(f, b, ee(c, D)) : Yt.has(f) ? I(f, b) : I(f, b, ne());
	}
	return I(_.Fragment, null, e[2].map((e, t) => O(e, t)));
}
// src/loans.mjs
var z = _.createElement, ln = (e) => new Intl.NumberFormat("en-IN", {
	style: "currency",
	currency: "INR",
	maximumFractionDigits: 2
}).format(e), un = (e) => e >= 1e7 ? "₹" + (e / 1e7).toFixed(1) + "Cr" : e >= 1e5 ? "₹" + (e / 1e5).toFixed(1) + "L" : e >= 1e3 ? "₹" + (e / 1e3).toFixed(1) + "k" : "₹" + Math.round(e), dn = {
	home: [
		3e6,
		8.5,
		20,
		0
	],
	personal: [
		5e5,
		12,
		3,
		0
	],
	car: [
		8e5,
		9,
		5,
		0
	],
	education: [
		1e6,
		10,
		7,
		0
	]
}, fn = [
	"lPrincipal",
	"lRate",
	"lYears",
	"lMonths"
], pn = [
	"loans",
	"prepayment",
	"affordability",
	"loan-compare",
	"schedule"
], mn = new Set("area base br col embed hr img input link meta param source track wbr".split(" ")), hn = (e, t) => {
	typeof e != "string" && (t(e), e[2].forEach((e) => hn(e, t)));
};
function gn({ a: e, b: t, amount: n }) {
	if (!e) return null;
	let r = e.rows.length, i = (e) => 78 + 502 * e / r, a = (e) => 24 + 180 * (1 - e / n), o = (e) => [
		[0, n],
		...e.rows.map((e) => [e.month, e.balance]),
		[r, 0]
	].map(([e, t], n) => (n ? "L" : "M") + i(e).toFixed(2) + " " + a(t).toFixed(2)).join(" ");
	return z(_.Fragment, null, z("title", null, "Outstanding balance: original and extra-payment schedules"), ...Array.from({ length: 5 }, (e, t) => {
		let r = n * t / 4, i = a(r);
		return z(_.Fragment, { key: t }, z("line", {
			x1: 78,
			y1: i,
			x2: 580,
			y2: i,
			stroke: "#dfbaa4",
			strokeDasharray: "3 4"
		}), z("text", {
			x: 70,
			y: i + 4,
			textAnchor: "end",
			fontSize: 13,
			fill: "#765346"
		}, un(r)));
	}), ...[.../* @__PURE__ */ new Set([
		0,
		Math.round(r / 4),
		Math.round(r / 2),
		Math.round(r * 3 / 4),
		r
	])].map((e) => z("text", {
		key: "m" + e,
		x: i(e),
		y: 226,
		textAnchor: e === 0 ? "start" : e === r ? "end" : "middle",
		fill: "#765346",
		fontSize: 13
	}, e + "m")), z("path", {
		d: o(e),
		fill: "none",
		stroke: "#ad795c",
		strokeWidth: 3
	}), t === e ? null : z("path", {
		d: o(t),
		fill: "none",
		stroke: "#553528",
		strokeWidth: 3,
		strokeDasharray: "6 3"
	}));
}
var _n = (e, t) => z("div", { key: e }, z("small", null, e), z("strong", null, t));
function vn({ node: e }) {
	let t = {};
	hn(e, ([e, n, r]) => {
		(e === "input" || e === "select") && n.id && (t[n.id] = {
			tag: e,
			a: n,
			c: r
		});
	});
	let n = Object.fromEntries(Object.entries(t).map(([e, t]) => [e, t.tag === "select" ? (t.c.find((e) => typeof e != "string" && e[0] === "option" && Object.hasOwn(e[1], "selected")) ?? t.c.find((e) => typeof e != "string" && e[0] === "option"))?.[1].value ?? "year" : t.a.value ?? ""])), r = Le(e), [i, a] = (0, _.useState)(() => n), [o, s] = (0, _.useState)("loans"), [c, l] = (0, _.useState)("");
	(0, _.useEffect)(() => {
		let e = () => {
			let e = location.hash.slice(1);
			s(pn.includes(e) ? e : "loans");
		};
		return e(), window.addEventListener("hashchange", e), () => window.removeEventListener("hashchange", e);
	}, []);
	let u = (e) => a((t) => ({
		...t,
		...Object.fromEntries(Object.entries(e).map(([e, t]) => [e, String(t)]))
	}));
	function d(e) {
		return Ie(t[e].a, i[e], r[e]) ? null : Number(i[e]);
	}
	let [f, p, m, h] = fn.map(d), g = (m ?? 0) * 12 + (h ?? 0), v = d("lExtra"), y = d("lFee"), b = null, x = null;
	![
		f,
		p,
		m,
		h
	].includes(null) && g >= 1 && g <= 600 && (b = Te(f, p, g), x = v > 0 ? Te(f, p, g, v) : b);
	let S = [
		"aIncome",
		"aExpenses",
		"aExisting",
		"aBuffer",
		"aCeiling",
		"aRate",
		"aMonths"
	].map(d), C = [
		"cAmount",
		"cRateA",
		"cMonthsA",
		"cFeeA",
		"cRateB",
		"cMonthsB",
		"cFeeB"
	].map(d), w = S.includes(null) ? null : Ee(...S), T = C.includes(null) ? null : De(...C), ee = w ? Math.min(1e10, Math.floor(w.principal)) : 0, E = i.loanScheduleMode, te = x ? M(x.rows, E) : [];
	function ne(e, t) {
		if (typeof e == "string") return e;
		let [r, s, C] = e, D = {
			...pt(s),
			key: t
		}, O = s.id, k = () => C.map(ne);
		if (s["data-loan-panel"] && (D.hidden = s["data-loan-panel"] !== o), s["data-loan-view"] && (s["data-loan-view"] === o ? D["aria-current"] = "true" : delete D["aria-current"]), s["data-loan-example"]) {
			let e = dn[s["data-loan-example"]];
			D["aria-pressed"] = String(e.every((e, t) => e === Number(i[fn[t]]))), D.onClick = () => u({
				...Object.fromEntries(fn.map((t, n) => [t, e[n]])),
				lExtra: 0,
				lFee: 0
			});
		}
		if (s["data-extra-amount"] && (D.onClick = () => u({ lExtra: s["data-extra-amount"] })), r === "input" || r === "select") {
			if (O && Object.hasOwn(i, O)) {
				if (O === "loanAmountSlider" || O === "loanRateSlider") {
					let e = O === "loanAmountSlider" ? "lPrincipal" : "lRate";
					D.value = i[e], D.onChange = (t) => u({ [e]: t.target.value });
				} else O === "loanTenureSlider" ? (D.value = Math.max(1, g), D.onChange = (e) => {
					let t = Number(e.target.value);
					u({
						lYears: Math.floor(t / 12),
						lMonths: t % 12
					});
				}) : (D.value = i[O], D.onChange = (e) => {
					l(""), u({ [O]: e.target.value });
				}, r === "input" && (D["aria-invalid"] = String(d(O) === null)));
			}
			return r === "input" ? z(r, D) : z(r, D, k());
		}
		if (r === "option") return delete D.selected, z(r, D, k());
		if (O === "loanUseBudget" && (D.disabled = ee < 1, D.onClick = () => {
			ee < 1 || (u({
				lPrincipal: ee,
				lRate: S[5],
				lYears: Math.floor(S[6] / 12),
				lMonths: S[6] % 12,
				lExtra: 0,
				lFee: 0
			}), location.hash = "loans");
		}), O === "loanUseCurrent" && (D.onClick = () => {
			!b || y === null ? l("Correct the main loan terms first.") : (l(""), u({
				cAmount: f,
				cRateA: p,
				cMonthsA: g,
				cFeeA: y
			}));
		}), O === "loanResult") return z(r, D, b ? z(_.Fragment, null, "Estimated monthly EMI: ", z("strong", null, ln(b.emi)), z("br"), "Total interest: " + ln(b.interest), z("br"), "Total repayment: " + ln(b.total)) : "Enter valid loan amount, annual interest rate and whole-month tenure from 1 month to 50 years.");
		if (O === "loanAmountWords") return z(r, D, b ? f >= 1e7 ? "₹" + (f / 1e7).toLocaleString("en-IN", { maximumFractionDigits: 2 }) + " crore" : f >= 1e5 ? "₹" + (f / 1e5).toLocaleString("en-IN", { maximumFractionDigits: 2 }) + " lakh" : ln(f) : "—");
		if (O === "loanSliderHint" && (D.hidden = f === null || f >= 1e4 && f <= 1e7), O === "loanTenureWords") return z(r, D, b ? (m ? m + (m === 1 ? " year" : " years") : "") + (h ? (m ? " + " : "") + h + (h === 1 ? " month" : " months") : "") : "—");
		if (O === "principalDisplay") return z(r, D, b ? ln(f) : "—");
		if (O === "interestDisplay") return z(r, D, b ? ln(b.interest) : "—");
		if (O === "principalBar" && (D.style = { width: b ? 100 * f / b.total + "%" : "0%" }), O === "loanAllIn") return z(r, {
			...D,
			hidden: !b || y === 0
		}, b ? y === null ? "Check your optional upfront fee amount." : "Total including upfront fees: " + ln(b.total + y) : "—");
		if (O === "prepayContext") return z(r, D, b ? "Your loan: " + ln(f) + " · " + p + "% annual rate · " + g + " months · regular EMI " + ln(b.emi) : "Enter valid EMI terms to compare.");
		if (O === "loanPrepayResult") return z(r, D, b ? v === null ? z("p", null, "Enter a valid nonnegative extra payment.") : v > 0 ? [
			_n("Planned monthly payment (up to)", ln(b.emi + v)),
			_n("Interest saved", ln(Math.max(0, b.interest - x.interest))),
			_n("Months saved", b.rows.length - x.rows.length),
			_n("Revised repayment period", x.rows.length + " months"),
			_n("Revised total incl. upfront fees", y === null ? "Check fees" : ln(x.total + y))
		] : z("p", null, "Choose an extra monthly payment above to see potential savings.") : "Enter valid loan terms to compare.");
		if (O === "affordResult") return z(r, D, w ? z(_.Fragment, null, z("small", null, "Estimated affordable additional EMI"), z("strong", null, ln(w.emi)), z("small", null, "Estimated loan amount"), z("strong", null, ln(w.principal)), z("p", null, "Cash available after expenses and buffer: " + ln(w.cash), z("br"), "Room under your chosen EMI ceiling: " + ln(w.cap))) : "Enter valid amounts, interest and whole-month tenure.");
		if (O === "loanCompareResult") return z(r, D, c || (T ? z(_.Fragment, null, z("div", { className: "mw-loan-table-wrap" }, z("table", { className: "mw-offer-table" }, z("thead", null, z("tr", null, ...[
			"Measure",
			"Offer A",
			"Offer B"
		].map((e) => z("th", { key: e }, e)))), z("tbody", null, ...[
			"emi",
			"interest",
			"total"
		].map((e, t) => z("tr", { key: e }, z("th", { scope: "row" }, [
			"Monthly EMI",
			"Interest",
			"Total incl. fees"
		][t]), z("td", null, ln(T.a[e])), z("td", null, ln(T.b[e]))))))), z("p", null, z("strong", null, T.difference < .005 ? "Same estimated total cost" : (T.a.total < T.b.total ? "Offer A" : "Offer B") + " costs " + ln(T.difference) + " less in total"), " with these inputs.")) : "Enter valid offer terms."));
		if (O === "loanBalanceChart") return z(r, D, z(gn, {
			a: b,
			b: x,
			amount: f
		}));
		if (O === "loanBalanceCaption") return z(r, D, b ? "Original payoff: " + b.rows.length + " months. " + (x === b ? "Add an extra payment to compare both paths." : "With extra payments: " + x.rows.length + " months.") : "Enter valid loan terms to view the balance chart.");
		if (O === "loanScheduleNote") return z(r, D, x ? (v === null ? "Invalid extra payment; showing original schedule. " : v > 0 ? "Schedule includes monthly extra payments. " : "Original loan schedule. ") + x.rows.length + " monthly payments; final payment may be smaller. Rounded display only." : "Enter valid loan terms to view a schedule.");
		if (O === "loanPeriodLabel") return z(r, D, E === "month" ? "Loan month" : "Loan year");
		if (O === "loanScheduleRows") return z(r, D, te.map((e) => z("tr", { key: e.period }, z("th", { scope: "row" }, e.period), ...[
			"payment",
			"principal",
			"interest",
			"balance"
		].map((t) => z("td", { key: t }, ln(e[t]))))));
		if (s["data-loan-panel"] && s["data-loan-panel"] !== "schedule") {
			let e = s["data-loan-panel"], t = e === "loans" ? [...fn, "lFee"] : e === "prepayment" ? ["lExtra"] : e === "affordability" ? Object.keys(n).filter((e) => /^a[A-Z]/.test(e)) : Object.keys(n).filter((e) => /^c[A-Z]/.test(e));
			return z(r, D, ...k(), z("button", {
				type: "button",
				className: "mw-fin-reset",
				disabled: t.every((e) => i[e] === n[e]),
				onClick: () => {
					a((e) => Re(e, n, t)), l("");
				}
			}, "Reset example"));
		}
		return mn.has(r) ? z(r, D) : z(r, D, k());
	}
	return z(_.Fragment, null, e[2].map(ne));
}
// src/metals.mjs
var B = _.createElement, yn = "https://blog.oropocket.com/free-gold-silver-price-api-india/", bn = (e) => new Intl.NumberFormat("en-IN", {
	style: "currency",
	currency: "INR",
	maximumFractionDigits: 2
}).format(e), xn = (e) => new Date(e).toLocaleString("en-IN", {
	timeZone: "Asia/Kolkata",
	day: "2-digit",
	month: "short",
	year: "numeric",
	hour: "2-digit",
	minute: "2-digit",
	hour12: !0
}) + " IST", Sn = (e) => typeof e == "number" && Number.isFinite(e) && e > 0 && e < 1e6;
function Cn(e, t = Date.now()) {
	if (!e || e.available !== !0 || e.source !== "OroPocket" || e.currency !== "INR" || e.unit !== "gram") return !1;
	let n = Date.parse(e.provider_timestamp), r = Date.parse(e.fetched_at), i = e.snapshotKind === "market-worker" ? 576e5 : 72e5, a = e.snapshotKind === "market-worker" ? 576e5 : 54e5;
	return !Number.isFinite(n) || !Number.isFinite(r) || n > t + 12e4 || r > t + 12e4 || t - n > i || t - r > a || r < n - 12e4 ? !1 : ["gold", "silver"].every((t) => Sn(e[t]?.buy) && Sn(e[t]?.sell));
}
var wn = null, Tn = null, En = 0;
function Dn(e, t = Date.now()) {
	let n = e?.metals, r = n?.data;
	if (n?.status !== "latest" || r?.source !== "OroPocket" || r.currency !== "INR" || r.unit !== "gram") throw Error("No recent verified market snapshot");
	let i = {
		available: !0,
		source: r.source,
		currency: r.currency,
		unit: r.unit,
		provider_timestamp: r.asOf,
		fetched_at: r.fetchedAt,
		gold: r.rates?.gold,
		silver: r.rates?.silver,
		snapshotKind: "market-worker"
	};
	if (!Cn(i, t)) throw Error("Market snapshot expired or invalid");
	return i;
}
async function On(e) {
	let t = new AbortController(), n = setTimeout(() => t.abort(), 8e3);
	try {
		let n = await fetch(e, {
			cache: "no-store",
			credentials: "omit",
			signal: t.signal
		});
		if (!n.ok) throw Error("Market data unavailable");
		return Dn(await n.json());
	} finally {
		clearTimeout(n);
	}
}
async function kn() {
	let e = typeof document < "u" && document.querySelector("meta[name=\"mk-market-quote-api\"]")?.content;
	if (e) try {
		return await On(e);
	} catch {}
	let t = new AbortController(), n = setTimeout(() => t.abort(), 1e4);
	try {
		let e = await fetch("/data/indian-metals.json?v=" + Date.now(), {
			cache: "no-store",
			credentials: "same-origin",
			signal: t.signal
		});
		if (!e.ok) throw Error("Price snapshot not published");
		let n = await e.json();
		if (n?.snapshotKind || !Cn(n)) throw Error("No recent verified Indian quote");
		return n;
	} finally {
		clearTimeout(n);
	}
}
function An() {
	return Tn && Date.now() - En < 3e4 && Cn(Tn) ? Promise.resolve(Tn) : (wn ||= kn().then((e) => (Tn = e, En = Date.now(), e)).catch((e) => {
		throw Tn = null, En = 0, e;
	}).finally(() => {
		wn = null;
	}), wn);
}
function jn() {
	let [e, t] = (0, _.useState)(null), [n, r] = (0, _.useState)(!0);
	return (0, _.useEffect)(() => {
		let e = !0;
		async function n() {
			try {
				let n = await An();
				e && t(n);
			} catch {
				e && t(null);
			} finally {
				e && r(!1);
			}
		}
		n();
		let i = () => {
			document.hidden || n();
		};
		document.addEventListener("visibilitychange", i);
		let a = setInterval(i, 18e4);
		return () => {
			e = !1, clearInterval(a), document.removeEventListener("visibilitychange", i);
		};
	}, []), {
		quote: Cn(e) ? e : null,
		loading: n
	};
}
var Mn = new Set("area base br col embed hr img input link meta param source track wbr".split(" ")), Nn = (e, t) => {
	typeof e != "string" && (t(e), e[2].forEach((e) => Nn(e, t)));
};
function Pn(e) {
	return [...["gold", "silver"].flatMap((t) => ["buy", "sell"].map((n) => B("span", {
		key: t + n,
		className: "mw-rate"
	}, B("b", null, "India " + t + " " + n), B("strong", null, e ? bn(e[t][n]) : "Unavailable"), B("em", null, "/g")))), B("span", {
		className: "mw-rate",
		key: "source"
	}, B("a", {
		href: yn,
		target: "_blank",
		rel: "noopener noreferrer"
	}, "Rate source ↗"))];
}
function Fn({ node: e }) {
	let { quote: t, loading: n } = jn(), [r, i] = (0, _.useState)(!1);
	function a(e, o) {
		if (typeof e == "string") return e;
		let [s, c, l] = e, u = {
			...pt(c),
			key: o
		};
		return c.id === "mwTickerMove" && (u.style = {
			...u.style,
			animationPlayState: r ? "paused" : "running"
		}), c.id === "mwTickerPause" ? (u["aria-pressed"] = String(r), u["aria-label"] = r ? "Play scrolling prices" : "Pause scrolling prices", u.onClick = () => i((e) => !e), B(s, u, r ? "Play" : "Pause")) : c.id === "mwTickerA" || c.id === "mwTickerB" ? B(s, u, Pn(t)) : c.id === "mwTickerStatus" ? B(s, u, n ? "Checking Indian digital gold and silver quotes…" : t ? "Indian digital gold & silver buy/sell quotes · " + xn(t.provider_timestamp) + " · ₹ per gram, before GST · Not IBJA benchmarks or jewellery retail prices." : "Current Indian gold and silver prices unavailable. No sample or stale rates are displayed. Enter a verified rate manually.") : c.id === "mwHomeGold" || c.id === "mwHomeSilver" ? B(s, u, t ? bn(t[c.id === "mwHomeGold" ? "gold" : "silver"].buy) : n ? "Checking…" : "Unavailable") : c.id === "mwHomeRatesUpdated" ? B(s, u, t ? "Source quote updated " + xn(t.provider_timestamp) + " · digital-metal buying rates before GST" : n ? "Checking recently published Indian prices…" : "Recent Indian metal prices are temporarily unavailable. Manual-rate calculators remain available.") : Mn.has(s) ? B(s, u) : B(s, u, l.map(a));
	}
	return B(_.Fragment, null, e[2].map(a));
}
var In = (e) => Number.isFinite(e) && e >= .01 && e <= 1e6;
function Ln(e, t, n, r, i, a) {
	if (!["gold", "silver"].includes(e) || !In(t) || !(e === "gold" ? [
		18,
		22,
		24
	] : [925, 999]).includes(n) || ![
		r,
		i,
		a
	].every(Number.isFinite) || r < .01 || r > 1e6 || i < 0 || i > 300 || a < 0 || a > 40) throw Error("Enter a valid metal rate, purity, weight, making charges and tax.");
	let o = t * n / (e === "gold" ? 24 : 999) * r, s = o * i / 100, c = (o + s) * a / 100;
	return {
		value: o,
		fee: s,
		tax: c,
		total: o + s + c
	};
}
function Rn({ node: e }) {
	let t = {}, n = Le(e);
	Nn(e, ([e, n]) => {
		e === "input" && n.type === "number" && (t[n.id] = n);
	});
	let r = {
		gMode: "live",
		gRate: "",
		gPurity: "22",
		gWeight: "10",
		gMaking: "10",
		gGst: "3",
		silverMode: "live",
		silverRate: "",
		silverPurity: "999",
		silverWeight: "100",
		silverMaking: "5",
		silverGst: "3"
	}, { quote: i, loading: a } = jn(), [o, s] = (0, _.useState)("gold"), [c, l] = (0, _.useState)(r), [u, d] = (0, _.useState)({
		gold: null,
		silver: null
	}), [f, p] = (0, _.useState)({
		gold: !1,
		silver: !1
	}), m = (0, _.useRef)({
		gold: 0,
		silver: 0
	}), h = (0, _.useRef)(!0);
	(0, _.useEffect)(() => (h.current = !0, s(new URLSearchParams(location.search).get("metal") === "silver" ? "silver" : "gold"), () => {
		h.current = !1;
	}), []);
	let g = (e) => e === "gold" ? {
		mode: "gMode",
		rate: "gRate",
		purity: "gPurity",
		weight: "gWeight",
		making: "gMaking",
		gst: "gGst"
	} : {
		mode: "silverMode",
		rate: "silverRate",
		purity: "silverPurity",
		weight: "silverWeight",
		making: "silverMaking",
		gst: "silverGst"
	};
	function v(e) {
		s(e);
		let t = new URL(location.href);
		e === "silver" ? t.searchParams.set("metal", "silver") : t.searchParams.delete("metal"), history.replaceState(null, "", t.pathname + t.search + t.hash);
	}
	function y(e, t) {
		let n = e.startsWith("silver") ? "silver" : "gold", r = g(n);
		m.current[n]++, l((n) => ({
			...n,
			[e]: t,
			...e === r.mode ? { [r.rate]: "" } : {}
		})), d((e) => ({
			...e,
			[n]: e[n] ? { error: "Inputs changed. Calculate again for an updated estimate." } : null
		}));
	}
	let b = (e) => c[g(e).mode] === "manual" ? Number(c[g(e).rate]) : i ? Number(i[e].buy.toFixed(2)) : null;
	async function x(e) {
		if (f[e]) return;
		let r = g(e), i = m.current[e], a = [
			c[r.purity],
			c[r.weight],
			c[r.making],
			c[r.gst]
		];
		p((t) => ({
			...t,
			[e]: !0
		})), d((t) => ({
			...t,
			[e]: null
		}));
		try {
			for (let e of [
				r.weight,
				r.making,
				r.gst,
				...c[r.mode] === "manual" ? [r.rate] : []
			]) {
				let r = Ie(t[e], c[e], n[e]);
				if (r) throw Error(r);
			}
			Ln(e, 1, ...a.map(Number));
			let o, s = null;
			if (c[r.mode] === "manual") {
				if (c[r.rate].trim() === "") throw Error("Enter your price per gram.");
				o = Number(c[r.rate]);
			} else {
				let t = await An();
				o = Number(t[e].buy.toFixed(2)), s = t.provider_timestamp;
			}
			if (i !== m.current[e]) throw Error("Inputs changed during rate lookup. Calculate again.");
			let l = Ln(e, o, ...a.map(Number));
			h.current && d((t) => ({
				...t,
				[e]: {
					estimate: l,
					rate: o,
					observation: s
				}
			}));
		} catch (t) {
			h.current && d((n) => ({
				...n,
				[e]: { error: "Could not calculate: " + t.message + (c[r.mode] === "live" ? " Manual rate entry remains available." : "") }
			}));
		} finally {
			h.current && p((t) => ({
				...t,
				[e]: !1
			}));
		}
	}
	function S(e, t) {
		if (typeof e == "string") return e;
		let [s, p, h] = e, C = {
			...pt(p),
			key: t
		}, w = p.id, T = () => h.map(S);
		if (s === "script") return null;
		if (w === "goldTab" || w === "silverTab") {
			let e = w === "goldTab" ? "gold" : "silver";
			C["aria-selected"] = String(o === e), C.tabIndex = o === e ? 0 : -1, C.onClick = () => v(e), C.onKeyDown = (t) => {
				if (![
					"ArrowRight",
					"ArrowLeft",
					"Home",
					"End"
				].includes(t.key)) return;
				t.preventDefault();
				let n = t.key === "Home" ? "gold" : t.key === "End" || e === "gold" ? "silver" : "gold";
				v(n), document.getElementById(n + "Tab")?.focus();
			};
		}
		if ((w === "goldPanel" || w === "silverPanel") && (C.hidden = o !== (w === "goldPanel" ? "gold" : "silver")), (s === "input" || s === "select") && Object.hasOwn(c, w)) {
			let e = w.startsWith("silver") ? "silver" : "gold", t = g(e);
			if (C.value = c[w], C.onChange = (e) => y(w, e.target.value), w === t.rate) {
				let n = c[t.mode] === "manual";
				C.readOnly = !n, C.value = n ? c[w] : i ? i[e].buy.toFixed(2) : "", C.placeholder = n ? "Enter verified fine-metal rate (₹/g)" : a ? "Checking recent quote…" : "Recent quote unavailable";
			}
			return s === "input" && !C.readOnly && (C["aria-invalid"] = !!Ie(p, c[w], n[w])), s === "input" ? B(s, C) : B(s, C, T());
		}
		if (s === "option") return delete C.selected, B(s, C, T());
		for (let e of ["gold", "silver"]) {
			let n = g(e), o = c[n.mode] === "manual", p = Number(c[n.purity]), h = b(e), v = In(h) ? h * p / (e === "gold" ? 24 : 999) : null, y = e === "gold" ? "24K" : "999 fine", S = e === "gold" ? "g" : "silver";
			if (w === S + "SelectedPriceLabel") return B(s, C, e === "gold" ? p + "K estimated gold price (₹/gram)" : p + " fine silver estimate (₹/gram)");
			if (w === S + "SelectedRate") return B(s, C, v === null ? o ? "Enter your " + y + " rate" : a ? "Checking verified price…" : "Current quote unavailable" : bn(v) + " / gram");
			if (w === S + "SelectedPriceNote") return B(s, C, v === null ? "Enter your own price or wait for a source price." : (o ? "Your " : "Source: digital-metal ") + y + " price · adjusted for purity. Excludes making charges and GST. Not a shop quote." + (!o && i ? " Saved source observation: " + xn(i.provider_timestamp) + ". Not a real-time quote." : ""));
			if (w === e + "RateStatus") return B(s, C, o ? "Enter your own " + y + " price per gram." : i ? "Latest verified saved digital-metal " + y + " price: " + bn(i[e].buy) + " / gram · " + xn(i.provider_timestamp) + ". Not a real-time or local jewellery rate." : a ? "Checking latest digital-metal price." : "A recent verified Indian " + e + " price is unavailable. Enter your own price instead.");
			if (w === (e === "gold" ? "calculateGold" : "calculateSilver")) {
				C.disabled = f[e], C.onClick = () => void x(e);
				let i = Object.values(n);
				return B(_.Fragment, { key: t }, B(s, C, f[e] ? "Calculating…" : o ? "Calculate " + e + " cost" : "Use latest saved rate & calculate " + e), B("button", {
					type: "button",
					className: "mw-fin-reset",
					disabled: f[e] || i.every((e) => c[e] === r[e]) && !u[e],
					onClick: () => {
						m.current[e]++, l((e) => ({
							...e,
							...Object.fromEntries(i.map((e) => [e, r[e]]))
						})), d((t) => ({
							...t,
							[e]: null
						}));
					}
				}, "Reset example"));
			}
			if (w === e + "Result") {
				let t = u[e];
				return B(s, C, t?.error ?? (t?.estimate ? B(_.Fragment, null, e === "gold" ? "Estimated jewellery price: " : "Estimated silver purchase cost: ", B("strong", null, bn(t.estimate.total)), B("br"), (e === "gold" ? "Gold value: " : "Silver metal estimate: ") + bn(t.estimate.value), B("br"), "Making charges: " + bn(t.estimate.fee), B("br"), "Estimated GST: " + bn(t.estimate.tax), B("br"), t.observation ? "Saved source rate: " + bn(t.rate) + "/g · " + xn(t.observation) + " · verify with your jeweller." : "Manual base rate: " + bn(t.rate) + "/g") : T()));
			}
		}
		return Mn.has(s) ? B(s, C) : B(s, C, T());
	}
	return B(_.Fragment, null, e[2].map(S));
}
// src/gold-intelligence.mjs
var V = _.createElement, zn = (e) => new Intl.NumberFormat("en-IN", {
	style: "currency",
	currency: "INR",
	maximumFractionDigits: 2
}).format(e), Bn = (e) => new Intl.NumberFormat("en-IN", {
	style: "currency",
	currency: "INR",
	maximumFractionDigits: 0
}).format(e), Vn = [...new Set(ke.map((e) => e[0]))].sort(), Hn = new Set("area base br col embed hr img input link meta param source track wbr".split(" ")), Un = () => {
	let e = Object.fromEntries(new Intl.DateTimeFormat("en-CA", {
		timeZone: "Asia/Kolkata",
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).formatToParts(/* @__PURE__ */ new Date()).map((e) => [e.type, e.value]));
	return e.year + "-" + e.month + "-" + e.day;
};
function Wn(e, t) {
	if (!Array.isArray(e?.cities) || !ke.some((e) => e[2] === t)) return [];
	let n = e.cities.filter((e) => e && typeof e == "object" && e.slug === t);
	if (n.length !== 1 || !Array.isArray(n[0].history) || n[0].history.length > 62) return [];
	let r = /* @__PURE__ */ new Map();
	for (let e of n[0].history) {
		if (!e || typeof e.date != "string" || !/^\d{4}-\d{2}-\d{2}$/.test(e.date)) continue;
		let t = /* @__PURE__ */ new Date(e.date + "T00:00:00Z");
		if (!Number.isFinite(t.getTime()) || t.toISOString().slice(0, 10) !== e.date) continue;
		let n = e[22], i = e[24];
		if (!Number.isFinite(n) || !Number.isFinite(i) || n <= 0 || i <= 0 || n >= 1e5 || i >= 1e5 || n / i < .85 || n / i > .96) continue;
		let a = {
			date: e.date,
			22: n,
			24: i
		}, o = r.get(e.date);
		if (o && (o[22] !== n || o[24] !== i)) return [];
		r.set(e.date, a);
	}
	return [...r.values()].sort((e, t) => e.date.localeCompare(t.date));
}
var Gn = (e) => /^[A-Z0-9]{6}$/.test(e);
function Kn() {
	let [e, t] = (0, _.useState)(null);
	return (0, _.useEffect)(() => {
		let e = new AbortController(), n = !0, r = setTimeout(() => e.abort(), 12e3), i = (e) => e?.source === "GoldPulse India" && e.currency === "INR" && e.unit === "gram" && Array.isArray(e.cities) && e.cities.length <= 25;
		function a(t, n) {
			return fetch(t, {
				cache: "no-cache",
				credentials: n,
				signal: e.signal
			}).then((e) => {
				if (!e.ok) throw Error("Feed unavailable");
				return e.json();
			}).then((e) => {
				if (!i(e)) throw Error("Invalid dataset");
				return e;
			}).catch(() => null);
		}
		let o = a("/data/gold-city-preview.json", "same-origin"), s = ["moneykavach.in", "moneykavach.pages.dev"].includes(location.hostname) ? a("https://moneykavach-market-data.mchennarao889.workers.dev/api/gold-city", "omit") : Promise.resolve(null);
		return o.then((e) => {
			n && e && t(e);
		}), Promise.all([o, s]).then(([e, r]) => {
			if (!n || !r) return;
			let i = ke.map(([t, n, i]) => {
				let a = new Map(Wn(e, i).map((e) => [e.date, e]));
				for (let e of Wn(r, i)) a.set(e.date, e);
				return {
					state: t,
					city: n,
					slug: i,
					history: [...a.values()].sort((e, t) => e.date.localeCompare(t.date)).slice(-31)
				};
			});
			t({
				...r,
				cities: i
			});
		}).finally(() => clearTimeout(r)), () => {
			n = !1, e.abort(), clearTimeout(r);
		};
	}, []), e;
}
function qn({ sub: e, select: t, point: n, setTooltip: r, width: i }) {
	let a = i < 560 ? Math.max(280, i) : 840, o = a < 560, s = o && e.length > 6, c = o ? 260 : 320, l = o ? 46 : 78, u = a - (o ? 18 : 34), d = o ? s ? 204 : 224 : 278, f = Math.ceil(Math.max(...e.map((e) => e[1])) / 2e4) * 2e4, p = e.map(([t, n], r) => ({
		name: t,
		value: n,
		x: l + (u - l) * r / (e.length - 1),
		y: d - n / f * (d - 34)
	})), m = p.map((e, t) => (t ? "L" : "M") + e.x.toFixed(2) + " " + e.y.toFixed(2)).join(" "), h = (e) => {
		t(e.name), r({
			name: e.name,
			value: e.value,
			x: e.x / a * 100,
			y: e.y / c * 100
		});
	};
	return V(_.Fragment, null, V("title", null, "RBI Mumbai standard gold annual averages · ₹ per 10g"), V("defs", null, V("linearGradient", {
		id: "historyFill",
		x1: "0%",
		y1: "0%",
		x2: "0%",
		y2: "100%"
	}, V("stop", {
		offset: "0%",
		stopColor: "#c27a59",
		stopOpacity: .32
	}), V("stop", {
		offset: "100%",
		stopColor: "#c27a59",
		stopOpacity: .015
	}))), ...Array.from({ length: 5 }, (e, t) => {
		let n = d - t / 4 * (d - 34), r = t / 4 * f;
		return V(_.Fragment, { key: t }, V("line", {
			x1: l,
			y1: n,
			x2: u,
			y2: n,
			stroke: "#d9b8a4",
			strokeOpacity: .65,
			strokeDasharray: t ? "4 6" : void 0
		}), V("text", {
			x: l - 6,
			y: n + 4,
			textAnchor: "end",
			fill: "#765346",
			fontSize: o ? 10 : 12
		}, t === 0 ? "₹0" : o ? "₹" + r / 1e3 + "k" : Bn(r)));
	}), V("path", {
		d: m + " L" + u + " " + d + " L" + l + " " + d + " Z",
		fill: "url(#historyFill)"
	}), V("path", {
		d: m,
		stroke: "#b5684e",
		strokeWidth: 3.5,
		strokeLinecap: "round",
		strokeLinejoin: "round",
		fill: "none"
	}), ...p.map((e, t) => V(_.Fragment, { key: e.name }, V("text", {
		x: e.x,
		y: d + 17,
		textAnchor: s ? "end" : "middle",
		fill: "#765346",
		fontSize: o ? 10 : 11,
		fontWeight: 600,
		transform: s ? "rotate(-50 " + e.x + " " + (d + 17) + ")" : void 0
	}, e.name.slice(2)), p.length <= 4 || !o && p.length <= 6 ? V("text", {
		x: e.x,
		y: e.y - 12,
		textAnchor: t === 0 ? "start" : t === p.length - 1 ? "end" : "middle",
		fill: "#714532",
		fontSize: o ? 10 : 12,
		fontWeight: 700
	}, Bn(e.value)) : null, V("g", null, V("circle", {
		cx: e.x,
		cy: e.y,
		r: o ? 13 : 15,
		fill: "transparent",
		tabIndex: 0,
		role: "button",
		"aria-label": "FY " + e.name + ", " + zn(e.value) + " per 10 grams",
		onPointerEnter: () => h(e),
		onPointerLeave: () => r(null),
		onFocus: () => h(e),
		onBlur: () => r(null),
		onClick: () => h(e),
		onKeyDown: (t) => {
			t.key === "Enter" || t.key === " " ? (t.preventDefault(), h(e)) : t.key === "Escape" && r(null);
		}
	}), V("circle", {
		cx: e.x,
		cy: e.y,
		r: e.name === n ? 6 : 5,
		fill: "#fff1e5",
		stroke: "#ac5e45",
		strokeWidth: 2.5,
		pointerEvents: "none"
	})))));
}
function Jn({ node: e }) {
	let t = Kn(), [n, r] = (0, _.useState)("Andhra Pradesh"), [i, a] = (0, _.useState)("vijayawada"), [o, s] = (0, _.useState)("22"), [c, l] = (0, _.useState)("1"), [u, d] = (0, _.useState)(""), [f, p] = (0, _.useState)(10), [m, h] = (0, _.useState)(Oe.at(-1)[0]), [g, v] = (0, _.useState)(null), [y, b] = (0, _.useState)(840), [x, S] = (0, _.useState)(Oe[0][0]), [C, w] = (0, _.useState)("10"), [T, ee] = (0, _.useState)(""), [E, te] = (0, _.useState)({}), [ne, D] = (0, _.useState)("unknown"), [O, k] = (0, _.useState)("");
	(0, _.useEffect)(() => {
		let e = () => {
			b(Math.max(280, Math.min(840, document.getElementById("chartWrap")?.clientWidth || 840))), v(null);
		};
		e();
		let t = document.getElementById("chartWrap"), n = typeof ResizeObserver == "function" && t ? new ResizeObserver(e) : null;
		return n ? n.observe(t) : window.addEventListener("resize", e), () => {
			n?.disconnect(), window.removeEventListener("resize", e);
		};
	}, []), (0, _.useEffect)(() => {
		let e = new URLSearchParams(location.search).get("city"), t = ke.find((t) => t[2] === e);
		t && (r(t[0]), a(t[2]));
	}, []);
	let re = Number(c), ie = Un(), ae = (e) => Math.round((Date.parse(ie) - Date.parse(e)) / 864e5), oe = (e) => Wn(t, e), se = (e) => oe(e).filter((e) => ae(e.date) >= 0 && ae(e.date) <= 3).at(-1), ce = ke.map((e) => se(e[2])).filter(Boolean), le = ce.map((e) => e.date).sort().at(-1), ue = ke.filter(([e, t]) => (t + ", " + e).toLocaleLowerCase("en-IN").includes(u.trim().toLocaleLowerCase("en-IN"))), de = ke.find((e) => e[2] === i), fe = se(i), pe = oe(i).filter((e) => ae(e.date) >= 0 && ae(e.date) <= 30), me = pe.at(-1), he = fe ? pe.find((e) => Date.parse(fe.date) - Date.parse(e.date) === 864e5) : null, ge = he ? (fe[o] - he[o]) * re : null, _e = pe.map((e) => e[o] * re), ve = Math.min(..._e), ye = Math.max(..._e), be = Oe.slice(-(f + 1)), A = be[0], j = be.at(-1), xe = be.find((e) => e[0] === m) ?? j, Se = Oe.find((e) => e[0] === x), Ce = Number(C), we = C.trim() !== "" && Number.isFinite(Ce) && Ce > 0 && Ce <= 1e4 && Se, Te = we ? Se[1] * Ce / 10 : 0, M = we ? j[1] * Ce / 10 : 0, Ee = y < 560, De = Ee ? 260 : 320, Ae = Ee ? Math.max(280, y) : 840;
	function je(e, t = !1) {
		let n = ke.find((t) => t[2] === e);
		n && (r(n[0]), a(e), t && (document.getElementById("cityRateHeadline")?.focus({ preventScroll: !0 }), document.getElementById("cityRateHeadline")?.scrollIntoView({
			block: "start",
			behavior: "smooth"
		})));
	}
	function Me(e) {
		r(e), a(ke.find((t) => t[0] === e)?.[2] ?? "");
	}
	async function Ne() {
		try {
			if (!navigator.clipboard?.writeText) throw Error("Clipboard unavailable");
			await navigator.clipboard.writeText([
				"MoneyKavach — Gold Intelligence notes",
				"Review page: " + location.href,
				"Sections: RBI 10-year historical chart, city comparison, historical gold-value calculator and BIS hallmark guide",
				"Selected location: " + (de ? de[1] + ", " + de[0] : n),
				"Preferred gold purity: " + o + "K",
				"RBI annual averages and dated GoldPulse India estimates are separate from verified jeweller quotes.",
				"My requested changes: "
			].join("\n")), k("Gold notes copied.");
		} catch {
			k("Copy unavailable in this browser. You can share your feedback directly.");
		}
	}
	function Pe() {
		return ue.length ? ue.map(([e, t, n]) => {
			let r = se(n), a = r && r.date === le, s = a ? oe(n).find((e) => Date.parse(r.date) - Date.parse(e.date) === 864e5) : null, c = s ? Math.round((r[o] - s[o]) * re * 100) / 100 : null, l = s ? (r[o] / s[o] - 1) * 100 : 0;
			return V("tr", {
				key: n,
				className: n === i ? "city-rate-selected" : void 0
			}, V("td", null, t + ", " + e), V("td", null, a ? zn(r[o] * re) : "Unavailable"), V("td", {
				className: "city-rate-delta",
				"data-direction": c === null ? void 0 : c > 0 ? "up" : c < 0 ? "down" : "flat"
			}, c === null ? "—" : V(_.Fragment, null, (c > 0 ? "+" : c < 0 ? "−" : "") + zn(Math.abs(c)), V("small", null, (l > 0 ? "+" : "") + l.toFixed(2) + "% vs prior day"))), V("td", null, V("button", {
				type: "button",
				className: "city-trend-button",
				"aria-label": "View " + t + " gold price history",
				onClick: () => je(n, !0)
			}, "View trend")));
		}) : [V("tr", { key: "empty" }, V("td", { colSpan: 4 }, "No matching cities. Try a different city or state."))];
	}
	function Fe(e, t) {
		if (typeof e == "string") return e;
		let [r, a, m] = e, b = {
			...pt(a),
			key: t
		}, k = a.id, ie = () => m.map(Fe);
		if (r === "script") return null;
		if (k === "cityRateState") return V(r, {
			...b,
			value: n,
			onChange: (e) => Me(e.target.value)
		}, Vn.map((e) => V("option", {
			key: e,
			value: e
		}, e)));
		if (k === "cityRateChoice") return V(r, {
			...b,
			value: i,
			onChange: (e) => je(e.target.value)
		}, ke.filter((e) => e[0] === n).map((e) => V("option", {
			key: e[2],
			value: e[2]
		}, e[1])));
		if (k === "cityRatePurity" && (b.value = o, b.onChange = (e) => s(e.target.value)), k === "cityRateUnit" && (b.value = c, b.onChange = (e) => l(e.target.value)), k === "cityRateSearch" && (b.value = u, b.onChange = (e) => d(e.target.value)), a["data-rate-city"] && (b.onClick = () => je(a["data-rate-city"])), k === "cityRateCount") return V(r, b, ue.length + " of " + ke.length + " cities");
		if (k === "cityFeedStatus") return V(r, b, le ? ce.filter((e) => e.date === le).length + " of " + ke.length + " cities have a record for " + le + " (IST). Estimated prices, not live quotes." : "No recent prices available.");
		if (k === "cityRateRows") return V(r, b, Pe());
		if (k === "cityRateHeadline") return V(r, b, de ? de[1] + ", " + de[0] : "Select a city");
		if (k === "cityCardMeta") return V(r, b, o + "K gold · " + re + (re === 1 ? " gram" : " grams"));
		if (k === "cityCardPrice") return V(r, b, fe ? zn(fe[o] * re) : "Rate unavailable");
		if (k === "cityCardGram") return V(r, b, fe ? zn(fe[o]) : "—");
		if (k === "cityCardTen") return V(r, b, fe ? zn(fe[o] * 10) : "—");
		if (k === "cityCardDate") return V(r, b, fe ? "Rate date: " + fe.date + " (IST)" : "No validated recent rate (within 3 days)");
		if (k === "cityCardDelta") return V(r, b, ge === null ? "Previous-day comparison unavailable" : (ge > 0 ? "↑ +" : ge < 0 ? "↓ −" : "") + zn(Math.abs(ge)) + " (" + ((fe[o] / he[o] - 1) * 100).toFixed(2) + "%) vs previous day");
		if (k === "cityTrendChart") {
			let e = Math.max(Date.parse(me?.date) - Date.parse(pe[0]?.date), 1);
			return V(r, b, pe.length >= 2 ? V("polyline", {
				points: _e.map((t, n) => [20 + (Date.parse(pe[n].date) - Date.parse(pe[0].date)) * 560 / e, 140 - (t - ve) * 110 / Math.max(ye - ve, 1)].join(",")).join(" "),
				fill: "none",
				stroke: "#f1b79b",
				strokeWidth: 3
			}) : null);
		}
		if (k === "cityTrendNote") return V(r, b, pe.length >= 2 ? pe[0].date + " to " + me.date + " · Range " + zn(ve) + " – " + zn(ye) + " · " + pe.length + " dated observations." : "At least two dated observations are required to draw a trend.");
		if (a["data-range"] && (b["aria-pressed"] = String(f === Number(a["data-range"])), b.onClick = () => {
			p(Number(a["data-range"])), v(null);
		}), k === "goldChart") return V(r, {
			...b,
			viewBox: "0 0 " + Ae + " " + De,
			"aria-label": "RBI Mumbai standard gold annual average price in ₹ per 10 grams · " + A[0] + " to " + j[0]
		}, V(qn, {
			sub: be,
			select: h,
			point: xe[0],
			setTooltip: v,
			width: y
		}));
		if (k === "chartTooltip") return V(r, {
			...b,
			hidden: !g,
			style: g ? {
				...b.style,
				left: Math.max(12, Math.min(85, g.x)) + "%",
				top: Math.max(18, g.y) + "%"
			} : b.style
		}, g ? V(_.Fragment, null, V("span", null, "FY " + g.name), V("strong", null, zn(g.value) + " / 10g")) : null);
		if (k === "historyCurrent") return V(r, b, Bn(j[1]));
		if (k === "chartFirstYear") return V(r, b, "FY " + A[0]);
		if (k === "chartLastYear") return V(r, b, "FY " + j[0]);
		if (k === "chartPointYear") return V(r, b, "FY " + xe[0]);
		if (k === "chartPointPrice") return V(r, b, zn(xe[1]));
		if (k === "chartChange") {
			let e = (j[1] / A[1] - 1) * 100;
			return V(r, b, f + "-year change: " + (e >= 0 ? "+" : "") + e.toFixed(1) + "% (annual averages)");
		}
		if (k === "historyDataRows") return V(r, b, Oe.map(([e, t]) => V("tr", { key: e }, V("td", null, "FY " + e), V("td", null, zn(t)))));
		if (k === "compareYear") return V(r, {
			...b,
			value: x,
			onChange: (e) => S(e.target.value)
		}, Oe.slice(0, -1).map(([e]) => V("option", {
			key: e,
			value: e
		}, "FY " + e)));
		if (k === "compareWeight" && (b.value = C, b.onChange = (e) => w(e.target.value), b["aria-invalid"] = String(!we)), k === "comparePast") return V(r, b, we ? Bn(Te) : "—");
		if (k === "compareLatest") return V(r, b, we ? Bn(M) : "—");
		if (k === "compareValue") return V(r, b, we ? Bn(M - Te) : "Enter valid grams");
		if (k === "compareNote") return V(r, b, we ? Bn(Te) + " (FY " + x + ") → " + Bn(M) + " (FY " + j[0] + "). Annual-average difference only; excludes fees, taxes, storage and selling spreads." : "Choose 0–10,000 grams of standard-gold equivalent.");
		if (k === "huidInput" && (b.value = T, b.onChange = (e) => {
			ee(e.target.value), D("unknown");
		}), k === "huidCheck" && (b.onClick = () => D(T.trim() ? Gn(T.trim().toUpperCase()) ? "format-only" : "no" : "empty")), k === "huidResult") return b["data-valid"] = ne === "empty" ? "unknown" : ne, V(r, b, {
			unknown: "Format check not run. Only the official BIS Care app can verify an HUID record.",
			empty: "Enter the HUID printed on jewellery to check its format. Then use official BIS Care.",
			no: "The format does not match a six-character alphanumeric HUID. Recheck the jewellery marking. This website cannot verify authenticity.",
			"format-only": "Six-character HUID format looks plausible. AUTHENTICITY NOT VERIFIED. Open the official BIS Care app, choose Verify HUID, and enter the code there."
		}[ne]);
		if (a["data-hallmark-step"]) {
			let e = a["data-hallmark-step"];
			b.checked = !!E[e], b.onChange = (t) => te((n) => ({
				...n,
				[e]: t.target.checked
			}));
		}
		return k === "hallmarkProgress" ? V(r, b, Object.values(E).filter(Boolean).length + " of 4 steps reviewed — not an authenticity verdict") : (k === "copyReview" && (b.onClick = () => void Ne()), k === "copyStatus" ? V(r, b, O) : r === "option" ? (delete b.selected, V(r, b, ie())) : Hn.has(r) ? V(r, b) : V(r, b, ie()));
	}
	return V(_.Fragment, null, e[2].map(Fe));
}
// src/property.mjs
var Yn = _.createElement, Xn = [
	[
		"pPrice",
		"Property price (₹)",
		"6000000",
		1,
		null
	],
	[
		"pDown",
		"Down payment (%)",
		"20",
		0,
		100
	],
	[
		"pStamp",
		"Transaction-cost assumption (%)",
		"6",
		0,
		null
	],
	[
		"pOther",
		"Additional upfront costs (₹)",
		"50000",
		0,
		null
	]
], Zn = Object.fromEntries(Xn.map(([e, , t]) => [e, t])), Qn = new Intl.NumberFormat("en-IN", {
	style: "currency",
	currency: "INR",
	maximumFractionDigits: 2
});
function $n(e) {
	for (let [t, n, , r, i] of Xn) {
		let a = Ie({
			min: r,
			max: i,
			step: "any"
		}, e[t], n);
		if (a) return { error: a };
	}
	let [t, n, r, i] = Xn.map(([t]) => Number(e[t]));
	if (![
		t,
		n,
		r,
		i
	].every(Number.isFinite) || t <= 0 || n < 0 || r < 0 || i < 0) return { error: "Please enter valid non-negative amounts and a positive property price." };
	if (n > 100) return { error: "Down payment cannot exceed 100%" };
	let a = {
		cash: t * (n + r) / 100 + i,
		loan: t * (1 - n / 100),
		charges: t * r / 100
	};
	return Object.values(a).every(Number.isFinite) ? a : { error: "Amounts are too large to calculate safely." };
}
function er() {
	let [e, t] = (0, _.useState)(Zn), n = $n(e), r = Object.keys(Zn).some((t) => e[t] !== Zn[t]), i = (e) => Qn.format(e);
	return Yn("section", {
		className: "card",
		id: "property"
	}, Yn("div", { className: "card-header" }, Yn("div", {
		className: "card-icon",
		"aria-hidden": !0
	}, "⌂"), Yn("div", null, Yn("h2", null, "Home purchase costs"), Yn("p", { className: "sub" }, "Estimate upfront cash required beyond the listed property price."))), Yn("div", { className: "fields" }, Xn.map(([n, r, , i, a]) => Yn("div", { key: n }, Yn("label", { htmlFor: n }, r), Yn("input", {
		id: n,
		type: "number",
		value: e[n],
		min: i,
		max: a ?? void 0,
		step: "any",
		"aria-invalid": !!Ie({
			min: i,
			max: a,
			step: "any"
		}, e[n], r),
		onChange: (e) => t((t) => ({
			...t,
			[n]: e.target.value
		}))
	})))), Yn("button", {
		type: "button",
		onClick: () => document.getElementById("propertyResult")?.focus()
	}, "Estimate upfront costs"), Yn("button", {
		type: "button",
		className: "mw-fin-reset",
		disabled: !r,
		onClick: () => t(Zn)
	}, "Reset example"), Yn("div", {
		className: "result",
		id: "propertyResult",
		tabIndex: -1,
		"aria-live": "polite"
	}, n.error ? n.error : Yn(_.Fragment, null, "Estimated upfront cash: ", Yn("strong", null, i(n.cash)), Yn("br"), "Illustrative borrowing: " + i(n.loan), Yn("br"), "Transaction charge estimate: " + i(n.charges))), Yn("span", { className: "hint" }, "Results update as you type. This is not an official stamp-duty quotation or verified locality valuation."));
}
// src/finance-client.mjs
var tr = (e, t) => {
	let n = (0, y.createRoot)(e);
	(0, v.flushSync)(() => n.render(t));
}, nr = document.getElementById("mwNativePropertyRoot");
nr && tr(nr, _.createElement(er));
for (let e of document.querySelectorAll("[data-mw-native-card]")) {
	let t = document.getElementById(e.dataset.mwNativeCard);
	t && tr(e, _.createElement(et, { node: JSON.parse(t.textContent) }));
}
var rr = [...document.querySelectorAll("[data-save-view]")];
if (rr.length) {
	let e = () => {
		let e = location.hash.slice(1), t = [
			"rd",
			"ppf",
			"epf"
		].includes(e) ? e : "rd";
		for (let e of rr) e.dataset.saveView === t ? e.setAttribute("aria-current", "true") : e.removeAttribute("aria-current");
	};
	window.addEventListener("hashchange", e), e();
}
for (let e of document.querySelectorAll("[data-mw-native-site]")) {
	let t = e.dataset.mwNativeSite, n = document.getElementById(t);
	n && tr(e, _.createElement(t === "mwHeaderSpec" ? Ct : wt, { node: JSON.parse(n.textContent) }));
}
for (let e of document.querySelectorAll("[data-mw-native-investment]")) {
	let t = document.getElementById(e.dataset.mwNativeInvestment);
	t && tr(e, _.createElement(Gt, { node: JSON.parse(t.textContent) }));
}
var ir = [...document.querySelectorAll("[data-invest-view]")];
if (ir.length) {
	let e = () => {
		let e = location.hash.slice(1), t = [
			"sip",
			"lump",
			"cagr",
			"goal",
			"learn"
		].includes(e) ? e : "sip";
		for (let e of ir) e.dataset.investView === t ? e.setAttribute("aria-current", "true") : e.removeAttribute("aria-current");
	};
	window.addEventListener("hashchange", e), e();
}
for (let e of document.querySelectorAll("[data-mw-native-tax]")) {
	let t = document.getElementById(e.dataset.mwNativeTax);
	t && tr(e, _.createElement(cn, {
		node: JSON.parse(t.textContent),
		studio: e.dataset.studio === "true"
	}));
}
for (let e of document.querySelectorAll("[data-mw-native-loans]")) {
	let t = document.getElementById(e.dataset.mwNativeLoans);
	t && tr(e, _.createElement(vn, { node: JSON.parse(t.textContent) }));
}
for (let e of document.querySelectorAll("[data-mw-native-gold]")) {
	let t = document.getElementById(e.dataset.mwNativeGold), n = e.dataset.goldKind === "market" ? Fn : e.dataset.goldKind === "metal" ? Rn : Jn;
	t && tr(e, _.createElement(n, { node: JSON.parse(t.textContent) }));
}
document.documentElement.dataset.mwReactReady = "true";
