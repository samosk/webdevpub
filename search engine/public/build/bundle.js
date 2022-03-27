var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function r(t){t.forEach(e)}function o(t){return"function"==typeof t}function c(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function s(e,n,r){e.$$.on_destroy.push(function(e,...n){if(null==e)return t;const r=e.subscribe(...n);return r.unsubscribe?()=>r.unsubscribe():r}(n,r))}function l(t,e){t.appendChild(e)}function i(t,e,n){t.insertBefore(e,n||null)}function u(t){t.parentNode.removeChild(t)}function a(t){return document.createElement(t)}function d(t){return document.createTextNode(t)}function f(){return d(" ")}function p(){return d("")}function h(t,e,n,r){return t.addEventListener(e,n,r),()=>t.removeEventListener(e,n,r)}function m(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function v(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function g(t,e){t.value=null==e?"":e}function $(t,e,n){t.classList[n?"add":"remove"](e)}let b;function x(t){b=t}function w(){if(!b)throw new Error("Function called outside component initialization");return b}const y=[],k=[],_=[],j=[],q=Promise.resolve();let E=!1;function L(t){_.push(t)}const N=new Set;let z=0;function C(){const t=b;do{for(;z<y.length;){const t=y[z];z++,x(t),T(t.$$)}for(x(null),y.length=0,z=0;k.length;)k.pop()();for(let t=0;t<_.length;t+=1){const e=_[t];N.has(e)||(N.add(e),e())}_.length=0}while(y.length);for(;j.length;)j.pop()();E=!1,N.clear(),x(t)}function T(t){if(null!==t.fragment){t.update(),r(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(L)}}const A=new Set;let M;function P(t,e){t&&t.i&&(A.delete(t),t.i(e))}function H(t,e,n,r){if(t&&t.o){if(A.has(t))return;A.add(t),M.c.push((()=>{A.delete(t),r&&(n&&t.d(1),r())})),t.o(e)}}function O(t,e){const n=e.token={};function o(t,o,c,s){if(e.token!==n)return;e.resolved=s;let l=e.ctx;void 0!==c&&(l=l.slice(),l[c]=s);const i=t&&(e.current=t)(l);let u=!1;e.block&&(e.blocks?e.blocks.forEach(((t,n)=>{n!==o&&t&&(M={r:0,c:[],p:M},H(t,1,1,(()=>{e.blocks[n]===t&&(e.blocks[n]=null)})),M.r||r(M.c),M=M.p)})):e.block.d(1),i.c(),P(i,1),i.m(e.mount(),e.anchor),u=!0),e.block=i,e.blocks&&(e.blocks[o]=i),u&&C()}if((c=t)&&"object"==typeof c&&"function"==typeof c.then){const n=w();if(t.then((t=>{x(n),o(e.then,1,e.value,t),x(null)}),(t=>{if(x(n),o(e.catch,2,e.error,t),x(null),!e.hasCatch)throw t})),e.current!==e.pending)return o(e.pending,0),!0}else{if(e.current!==e.then)return o(e.then,1,e.value,t),!0;e.resolved=t}var c}function S(t){t&&t.c()}function D(t,n,c,s){const{fragment:l,on_mount:i,on_destroy:u,after_update:a}=t.$$;l&&l.m(n,c),s||L((()=>{const n=i.map(e).filter(o);u?u.push(...n):r(n),t.$$.on_mount=[]})),a.forEach(L)}function B(t,e){const n=t.$$;null!==n.fragment&&(r(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function F(t,e){-1===t.$$.dirty[0]&&(y.push(t),E||(E=!0,q.then(C)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function I(e,o,c,s,l,i,a,d=[-1]){const f=b;x(e);const p=e.$$={fragment:null,ctx:null,props:i,update:t,not_equal:l,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(o.context||(f?f.$$.context:[])),callbacks:n(),dirty:d,skip_bound:!1,root:o.target||f.$$.root};a&&a(p.root);let h=!1;if(p.ctx=c?c(e,o.props||{},((t,n,...r)=>{const o=r.length?r[0]:n;return p.ctx&&l(p.ctx[t],p.ctx[t]=o)&&(!p.skip_bound&&p.bound[t]&&p.bound[t](o),h&&F(e,t)),n})):[],p.update(),h=!0,r(p.before_update),p.fragment=!!s&&s(p.ctx),o.target){if(o.hydrate){const t=function(t){return Array.from(t.childNodes)}(o.target);p.fragment&&p.fragment.l(t),t.forEach(u)}else p.fragment&&p.fragment.c();o.intro&&P(e.$$.fragment),D(e,o.target,o.anchor,o.customElement),C()}x(f)}class Z{$destroy(){B(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function G(e){let n;return{c(){n=a("div"),n.innerHTML='<div class="svelte-iwqve4"></div> \n    <div class="svelte-iwqve4"></div> \n    <div class="svelte-iwqve4"></div> \n    <div class="svelte-iwqve4"></div> \n    <div class="svelte-iwqve4"></div> \n    <div class="svelte-iwqve4"></div> \n    <div class="svelte-iwqve4"></div> \n    <div class="svelte-iwqve4"></div>',m(n,"class","lds-roller svelte-iwqve4")},m(t,e){i(t,n,e)},p:t,i:t,o:t,d(t){t&&u(n)}}}class J extends Z{constructor(t){super(),I(this,t,null,G,c,{})}}function K(t,e,n){const r=t.slice();return r[1]=e[n],r}function Q(e){let n;return{c(){n=a("div"),n.innerHTML='<h2 class="svelte-14wxo4x">Invalid search request</h2>',m(n,"class","svelte-14wxo4x")},m(t,e){i(t,n,e)},p:t,d(t){t&&u(n)}}}function R(t){let e,n=t[0].data.items,r=[];for(let e=0;e<n.length;e+=1)r[e]=V(K(t,n,e));return{c(){e=a("div");for(let t=0;t<r.length;t+=1)r[t].c();m(e,"id","item-holder"),m(e,"class","svelte-14wxo4x")},m(t,n){i(t,e,n);for(let t=0;t<r.length;t+=1)r[t].m(e,null)},p(t,o){if(1&o){let c;for(n=t[0].data.items,c=0;c<n.length;c+=1){const s=K(t,n,c);r[c]?r[c].p(s,o):(r[c]=V(s),r[c].c(),r[c].m(e,null))}for(;c<r.length;c+=1)r[c].d(1);r.length=n.length}},d(t){t&&u(e),function(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}(r,t)}}}function U(t){let e,n,r,o,c,s,p,h,g,$,b,x,w,y,k,_,j=t[1].url+"",q=t[1].identifier+"",E=t[1].description+"",L=t[1].published_at+"";return{c(){e=a("div"),n=f(),r=a("p"),o=d(j),c=f(),s=a("h2"),p=a("a"),h=d(q),$=f(),b=a("h3"),x=d(E),w=f(),y=a("h4"),k=d(L),_=f(),m(r,"class","svelte-14wxo4x"),m(p,"href",g=t[1].url),m(p,"class","svelte-14wxo4x"),m(s,"class","svelte-14wxo4x"),m(b,"class","max-chars svelte-14wxo4x"),m(y,"class","date svelte-14wxo4x"),m(e,"id","item"),m(e,"class","svelte-14wxo4x")},m(t,u){i(t,e,u),l(e,n),l(e,r),l(r,o),l(e,c),l(e,s),l(s,p),l(p,h),l(e,$),l(e,b),l(b,x),l(e,w),l(e,y),l(y,k),l(e,_)},p(t,e){1&e&&j!==(j=t[1].url+"")&&v(o,j),1&e&&q!==(q=t[1].identifier+"")&&v(h,q),1&e&&g!==(g=t[1].url)&&m(p,"href",g),1&e&&E!==(E=t[1].description+"")&&v(x,E),1&e&&L!==(L=t[1].published_at+"")&&v(k,L)},d(t){t&&u(e)}}}function V(t){let e,n="dataverse"==t[1].type&&U(t);return{c(){n&&n.c(),e=p()},m(t,r){n&&n.m(t,r),i(t,e,r)},p(t,r){"dataverse"==t[1].type?n?n.p(t,r):(n=U(t),n.c(),n.m(e.parentNode,e)):n&&(n.d(1),n=null)},d(t){n&&n.d(t),t&&u(e)}}}function W(e){let n;function r(t,e){return t[0]&&"data"in t[0]&&"items"in t[0].data&&t[0].data.items.length>0?R:t[0]?Q:void 0}let o=r(e),c=o&&o(e);return{c(){c&&c.c(),n=p()},m(t,e){c&&c.m(t,e),i(t,n,e)},p(t,[e]){o===(o=r(t))&&c?c.p(t,e):(c&&c.d(1),c=o&&o(t),c&&(c.c(),c.m(n.parentNode,n)))},i:t,o:t,d(t){c&&c.d(t),t&&u(n)}}}function X(t,e,n){let{json:r}=e;return t.$$set=t=>{"json"in t&&n(0,r=t.json)},[r]}class Y extends Z{constructor(t){super(),I(this,t,X,W,c,{json:0})}}const tt=[];const et=function(e,n=t){let r;const o=new Set;function s(t){if(c(e,t)&&(e=t,r)){const t=!tt.length;for(const t of o)t[1](),tt.push(t,e);if(t){for(let t=0;t<tt.length;t+=2)tt[t][0](tt[t+1]);tt.length=0}}}return{set:s,update:function(t){s(t(e))},subscribe:function(c,l=t){const i=[c,l];return o.add(i),1===o.size&&(r=n(s)||t),c(e),()=>{o.delete(i),0===o.size&&(r(),r=null)}}}}();function nt(t){let e;return{c(){e=a("p"),e.innerHTML='<img src="https://pbs.twimg.com/profile_images/1163151704973615105/62PeCDbZ_400x400.jpg" alt="yeas" width="100em"/>',m(e,"id","bild")},m(t,n){i(t,e,n)},d(t){t&&u(e)}}}function rt(e){let n,o,c,s,d,p,v=0==e[1]&&nt();return{c(){v&&v.c(),n=f(),o=a("div"),c=a("form"),s=a("input"),m(s,"class","svelte-1rkblln"),m(c,"class","svelte-1rkblln"),m(o,"class","svelte-1rkblln"),$(o,"searched",e[1])},m(t,r){var u;v&&v.m(t,r),i(t,n,r),i(t,o,r),l(o,c),l(c,s),g(s,e[0]),d||(p=[h(s,"input",e[4]),h(c,"submit",(u=e[5],function(t){return t.preventDefault(),u.call(this,t)}))],d=!0)},p(t,[e]){0==t[1]?v||(v=nt(),v.c(),v.m(n.parentNode,n)):v&&(v.d(1),v=null),1&e&&s.value!==t[0]&&g(s,t[0]),2&e&&$(o,"searched",t[1])},i:t,o:t,d(t){v&&v.d(t),t&&u(n),t&&u(o),d=!1,r(p)}}}function ot(t,e,n){let r,o;async function c(){const t=await fetch("https://demo.dataverse.org/api/search?q="+o),e=await t.json();if(t.ok)return e;throw new Error(e)}s(t,et,(t=>n(2,r=t)));let l=!1;return[o,l,r,c,function(){o=this.value,n(0,o)},async()=>{var t,e;t=et,r=c(),e=r,t.set(e),await r,n(1,l=!0)}]}class ct extends Z{constructor(t){super(),I(this,t,ot,rt,c,{})}}function st(e){let n,r,o=e[2].message+"";return{c(){var t,e,c,s;n=a("p"),r=d(o),t=n,e="color",null===(c="red")?t.style.removeProperty(e):t.style.setProperty(e,c,s?"important":""),m(n,"class","svelte-p4dzsy")},m(t,e){i(t,n,e),l(n,r)},p(t,e){1&e&&o!==(o=t[2].message+"")&&v(r,o)},i:t,o:t,d(t){t&&u(n)}}}function lt(t){let e,n;return e=new Y({props:{json:t[1]}}),{c(){S(e.$$.fragment)},m(t,r){D(e,t,r),n=!0},p(t,n){const r={};1&n&&(r.json=t[1]),e.$set(r)},i(t){n||(P(e.$$.fragment,t),n=!0)},o(t){H(e.$$.fragment,t),n=!1},d(t){B(e,t)}}}function it(e){let n,r;return n=new J({}),{c(){S(n.$$.fragment)},m(t,e){D(n,t,e),r=!0},p:t,i(t){r||(P(n.$$.fragment,t),r=!0)},o(t){H(n.$$.fragment,t),r=!1},d(t){B(n,t)}}}function ut(t){let e,n,r,o,c;n=new ct({});let s={ctx:t,current:null,token:null,hasCatch:!0,pending:it,then:lt,catch:st,value:1,error:2,blocks:[,,,]};return O(o=t[0],s),{c(){e=a("main"),S(n.$$.fragment),r=f(),s.block.c(),m(e,"class","svelte-p4dzsy")},m(t,o){i(t,e,o),D(n,e,null),l(e,r),s.block.m(e,s.anchor=null),s.mount=()=>e,s.anchor=null,c=!0},p(e,[n]){t=e,s.ctx=t,1&n&&o!==(o=t[0])&&O(o,s)||function(t,e,n){const r=e.slice(),{resolved:o}=t;t.current===t.then&&(r[t.value]=o),t.current===t.catch&&(r[t.error]=o),t.block.p(r,n)}(s,t,n)},i(t){c||(P(n.$$.fragment,t),P(s.block),c=!0)},o(t){H(n.$$.fragment,t);for(let t=0;t<3;t+=1){H(s.blocks[t])}c=!1},d(t){t&&u(e),B(n),s.block.d(),s.token=null,s=null}}}function at(t,e,n){let r;return s(t,et,(t=>n(0,r=t))),[r]}return new class extends Z{constructor(t){super(),I(this,t,at,ut,c,{})}}({target:document.body,props:{name:"world"}})}();
//# sourceMappingURL=bundle.js.map
