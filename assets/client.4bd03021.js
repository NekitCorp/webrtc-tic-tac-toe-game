import{R as L,S as A,i as P,s as G,L as M,c as S,m as v,t as g,a as $,d as y,b,G as I,e as N,f as w,g as O,h as q,j as C,C as B,k as p,l as k,n as W,p as m,q as d,r as j,u as h,v as F,w as U,D as z,A as H,B as J}from"./global.b6f67fdc.js";class K extends L{connectToDataChannel(e){this.setRemoteDescription(e),this.peerConnection.createAnswer().then(t=>{console.log("[CREATE ANSWER]",t),this.peerConnection.setLocalDescription(t).then(()=>{console.log("[SET LOCAL DESCRIPTION]")},n=>{console.error("setLocalDescription failed",n)})},t=>{console.error("createAnswer failed",t)})}}function Q(c){let e,t,n,a,s;return{c(){e=p("div"),t=p("h1"),t.textContent="Wrong connection state",n=k(),a=p("p"),s=W(c[0]),m(t,"class","dialog-text"),m(a,"class","dialog-text"),m(e,"class","standard-dialog center")},m(o,l){w(o,e,l),d(e,t),d(e,n),d(e,a),d(a,s)},p(o,l){l&1&&j(s,o[0])},i:h,o:h,d(o){o&&C(e)}}}function V(c){let e,t,n,a;return e=new F({props:{state:c[4]}}),e.$on("send",c[7]),n=new U({props:{messages:c[2]}}),n.$on("send",c[8]),{c(){S(e.$$.fragment),t=k(),S(n.$$.fragment)},m(s,o){v(e,s,o),w(s,t,o),v(n,s,o),a=!0},p(s,o){const l={};o&4&&(l.messages=s[2]),n.$set(l)},i(s){a||(g(e.$$.fragment,s),g(n.$$.fragment,s),a=!0)},o(s){$(e.$$.fragment,s),$(n.$$.fragment,s),a=!1},d(s){y(e,s),s&&C(t),y(n,s)}}}function X(c){let e,t,n,a,s,o,l;return{c(){e=p("div"),t=p("h1"),t.textContent="Send your local offer to player #1",n=k(),a=p("textarea"),m(t,"class","dialog-text"),m(a,"rows",10),z(a,"width","100%"),a.value=s=window.btoa(c[1]),m(e,"class","standard-dialog center")},m(r,i){w(r,e,i),d(e,t),d(e,n),d(e,a),o||(l=H(J.call(null,a)),o=!0)},p(r,i){i&2&&s!==(s=window.btoa(r[1]))&&(a.value=s)},i:h,o:h,d(r){r&&C(e),o=!1,l()}}}function Y(c){let e,t,n,a;const s=[X,V,Q],o=[];function l(r,i){return r[0]==="connecting"?0:r[0]==="connected"?1:2}return e=l(c),t=o[e]=s[e](c),{c(){t.c(),n=N()},m(r,i){o[e].m(r,i),w(r,n,i),a=!0},p(r,i){let f=e;e=l(r),e===f?o[e].p(r,i):(O(),$(o[f],1,1,()=>{o[f]=null}),q(),t=o[e],t?t.p(r,i):(t=o[e]=s[e](r),t.c()),g(t,1),t.m(n.parentNode,n))},i(r){a||(g(t),a=!0)},o(r){$(t),a=!1},d(r){o[e].d(r),r&&C(n)}}}function Z(c){let e,t;return e=new M({props:{$$slots:{default:[Y]},$$scope:{ctx:c}}}),{c(){S(e.$$.fragment)},m(n,a){v(e,n,a),t=!0},p(n,[a]){const s={};a&8199&&(s.$$scope={dirty:a,ctx:n}),e.$set(s)},i(n){t||(g(e.$$.fragment,n),t=!0)},o(n){$(e.$$.fragment,n),t=!1},d(n){y(e,n)}}}function ee(c,e,t){let n,a,s;const o=new B,{messages:l}=o;b(c,l,u=>t(2,s=u));const r=new I(2),{state:i}=r,f=new K(o,r),{localDescription:D,connectionState:E}=f;b(c,D,u=>t(1,a=u)),b(c,E,u=>t(0,n=u));const R=new URLSearchParams(window.location.search);f.connectToDataChannel(window.atob(R.get("offer")));function T(u){if(u.detail){const _=u.detail;r.send(_),f.sendMessage({type:"game",event:_})}}function x(u){if(u.detail){const _=u.detail;o.addMessage(_),f.sendMessage({type:"chat",text:_})}}return[n,a,s,l,i,D,E,T,x]}class te extends A{constructor(e){super(),P(this,e,ee,Z,G,{})}}new te({target:document.getElementById("app")});
