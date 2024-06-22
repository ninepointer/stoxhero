"use strict";
(self.webpackChunknptrading = self.webpackChunknptrading || []).push([
  [5065],
  {
    55065: function (t, e, n) {
      n.r(e);
      var r = n(74165),
        o = n(15861),
        a = n(29439),
        i = n(72791),
        u = n(63263),
        l = n(13524),
        s = n(80184);
      e.default = function () {
        var t = (0, i.useState)(null),
          e = (0, a.Z)(t, 2),
          n = (e[0], e[1]),
          c = (function () {
            var t = (0, o.Z)(
              (0, r.Z)().mark(function t() {
                var e, o, a, i, l;
                return (0, r.Z)().wrap(
                  function (t) {
                    for (;;)
                      switch ((t.prev = t.next)) {
                        case 0:
                          return (
                            (t.prev = 0),
                            (t.next = 3),
                            u.Z.get(
                              "http://localhost:5000/api/v1/paymenttest/generate"
                            )
                          );
                        case 3:
                          for (i in ((e = t.sent),
                          (o = e.data),
                          n(o),
                          (a = document.createElement("form")).setAttribute(
                            "method",
                            "post"
                          ),
                          a.setAttribute(
                            "action",
                            "https://securegw-stage.paytm.in/order/process"
                          ),
                          a.setAttribute("target", "_top"),
                          o))
                            o.hasOwnProperty(i) &&
                              ((l =
                                document.createElement("input")).setAttribute(
                                "type",
                                "hidden"
                              ),
                              l.setAttribute("name", i),
                              l.setAttribute("value", o[i]),
                              a.appendChild(l));
                          document.body.appendChild(a),
                            a.submit(),
                            (t.next = 18);
                          break;
                        case 15:
                          (t.prev = 15),
                            (t.t0 = t.catch(0)),
                            console.log("Error", t.t0);
                        case 18:
                        case "end":
                          return t.stop();
                      }
                  },
                  t,
                  null,
                  [[0, 15]]
                );
              })
            );
            return function () {
              return t.apply(this, arguments);
            };
          })(),
          d = (function () {
            var t = (0, o.Z)(
              (0, r.Z)().mark(function t() {
                var e, n, o, a, i, s, c, d, p;
                return (0, r.Z)().wrap(
                  function (t) {
                    for (;;)
                      switch ((t.prev = t.next)) {
                        case 0:
                          return (
                            (t.prev = 0),
                            (t.next = 3),
                            u.Z.post(
                              "".concat(l.JW, "payment/initiate"),
                              {
                                amount: 2e4,
                                mobileNumber: "9090877020",
                                redirectTo: window.location.href,
                              },
                              { withCredentials: !0 }
                            )
                          );
                        case 3:
                          (p = t.sent),
                            console.log(
                              null === p ||
                                void 0 === p ||
                                null === (e = p.data) ||
                                void 0 === e ||
                                null === (n = e.data) ||
                                void 0 === n ||
                                null === (o = n.instrumentResponse) ||
                                void 0 === o ||
                                null === (a = o.redirectInfo) ||
                                void 0 === a
                                ? void 0
                                : a.url
                            ),
                            (window.location.href =
                              null === p ||
                              void 0 === p ||
                              null === (i = p.data) ||
                              void 0 === i ||
                              null === (s = i.data) ||
                              void 0 === s ||
                              null === (c = s.instrumentResponse) ||
                              void 0 === c ||
                              null === (d = c.redirectInfo) ||
                              void 0 === d
                                ? void 0
                                : d.url),
                            (t.next = 11);
                          break;
                        case 8:
                          (t.prev = 8), (t.t0 = t.catch(0)), console.log(t.t0);
                        case 11:
                        case "end":
                          return t.stop();
                      }
                  },
                  t,
                  null,
                  [[0, 8]]
                );
              })
            );
            return function () {
              return t.apply(this, arguments);
            };
          })();
        return (0, s.jsxs)("div", {
          children: [
            (0, s.jsx)("button", { onClick: c, children: "PayTM" }),
            (0, s.jsx)("button", { onClick: d, children: "Phone Pe" }),
          ],
        });
      };
    },
  },
]);
//# sourceMappingURL=5065.82ba255c.chunk.js.map
