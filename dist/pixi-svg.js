/*!
 * pixi-svg - v3.2.0
 * Compiled Mon, 09 Jan 2023 00:38:17 UTC
 *
 * pixi-svg is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 * 
 * Copyright 2023, Matt Karl <matt@mattkarl.com>, All Rights Reserved
 */var pixisvg=function(U,rt){"use strict";var at=typeof globalThis!="undefined"?globalThis:typeof window!="undefined"?window:typeof global!="undefined"?global:typeof self!="undefined"?self:{};function Lt(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}function Ut(t){return t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}function Vt(t){return t&&Object.prototype.hasOwnProperty.call(t,"default")&&Object.keys(t).length===1?t.default:t}function Bt(t){if(t.__esModule)return t;var r=t.default;if(typeof r=="function"){var e=function a(){if(this instanceof a){var n=[null];n.push.apply(n,arguments);var i=Function.bind.apply(r,n);return new i}return r.apply(this,arguments)};e.prototype=r.prototype}else e={};return Object.defineProperty(e,"__esModule",{value:!0}),Object.keys(t).forEach(function(a){var n=Object.getOwnPropertyDescriptor(t,a);Object.defineProperty(e,a,n.get?n:{enumerable:!0,get:function(){return t[a]}})}),e}var j={},nt={get exports(){return j},set exports(t){j=t}};/*!
 * d-path-parser - v1.0.0
 * by Massimo Artizzu (MaxArt2501)
 *
 * https://github.com/MaxArt2501/d-path-parser
 *
 * Licensed under the MIT License
 * See LICENSE for details
 */(function(t,r){(function(e,a){t.exports=a()})(at,function(){"use strict";return function(a){for(var n={command:/\s*([achlmqstvz])/gi,number:/\s*([+-]?\d*\.?\d+(?:e[+-]?\d+)?)/gi,comma:/\s*(?:(,)|\s)/g,flag:/\s*([01])/g},i={number:function(l){return+v("number",l)},"coordinate pair":function(l){var d=v("number",l);if(d===null&&!l)return null;v("comma");var p=v("number",!0);return{x:+d,y:+p}},"arc definition":function(l){var d=i["coordinate pair"](l);if(!d&&!l)return null;v("comma");var p=+v("number",!0);v("comma",!0);var y=!!+v("flag",!0);v("comma");var x=!!+v("flag",!0);v("comma");var P=i["coordinate pair"](!0);return{radii:d,rotation:p,large:y,clockwise:x,end:P}}},o=0,s=[];o<a.length;){var h=v("command"),f=h.toUpperCase(),g=h!==f,c;switch(f){case"M":c=A("coordinate pair").map(function(l,d){return d===1&&(h=g?"l":"L"),m({end:l})});break;case"L":case"T":c=A("coordinate pair").map(function(l){return m({end:l})});break;case"C":if(c=A("coordinate pair"),c.length%3)throw Error("Expected coordinate pair triplet at position "+o);c=c.reduce(function(l,d,p){var y=p%3;if(!y)l.push(m({cp1:d}));else{var x=l[l.length-1];x[y===1?"cp2":"end"]=d}return l},[]);break;case"Q":case"S":if(c=A("coordinate pair"),c.length&1)throw Error("Expected coordinate pair couple at position "+o);c=c.reduce(function(l,d,p){var y=p&1;if(!y)l.push(m({cp:d}));else{var x=l[l.length-1];x.end=d}return l},[]);break;case"H":case"V":c=A("number").map(function(l){return m({value:l})});break;case"A":c=A("arc definition").map(m);break;case"Z":c=[{code:"Z"}];break}s.push.apply(s,c)}return s;function m(l){return l.code=h,l.relative=g,l}function v(l,d){n[l].lastIndex=o;var p=n[l].exec(a);if(!p||p.index!==o){if(!d)return null;throw Error("Expected "+l+" at position "+o)}return o=n[l].lastIndex,p[1]}function A(l){for(var d=[],p,y=!0;p=i[l](y);)d.push(p),y=!!v("comma");return d}}})})(nt,j);var it=j;const st=/^\s+/,ot=/\s+$/;function u(t,r){if(t=t||"",r=r||{},t instanceof u)return t;if(!(this instanceof u))return new u(t,r);var e=ht(t);this._originalInput=t,this._r=e.r,this._g=e.g,this._b=e.b,this._a=e.a,this._roundA=Math.round(100*this._a)/100,this._format=r.format||e.format,this._gradientType=r.gradientType,this._r<1&&(this._r=Math.round(this._r)),this._g<1&&(this._g=Math.round(this._g)),this._b<1&&(this._b=Math.round(this._b)),this._ok=e.ok}u.prototype={isDark:function(){return this.getBrightness()<128},isLight:function(){return!this.isDark()},isValid:function(){return this._ok},getOriginalInput:function(){return this._originalInput},getFormat:function(){return this._format},getAlpha:function(){return this._a},getBrightness:function(){var t=this.toRgb();return(t.r*299+t.g*587+t.b*114)/1e3},getLuminance:function(){var t=this.toRgb(),r,e,a,n,i,o;return r=t.r/255,e=t.g/255,a=t.b/255,r<=.03928?n=r/12.92:n=Math.pow((r+.055)/1.055,2.4),e<=.03928?i=e/12.92:i=Math.pow((e+.055)/1.055,2.4),a<=.03928?o=a/12.92:o=Math.pow((a+.055)/1.055,2.4),.2126*n+.7152*i+.0722*o},setAlpha:function(t){return this._a=W(t),this._roundA=Math.round(100*this._a)/100,this},toHsv:function(){var t=B(this._r,this._g,this._b);return{h:t.h*360,s:t.s,v:t.v,a:this._a}},toHsvString:function(){var t=B(this._r,this._g,this._b),r=Math.round(t.h*360),e=Math.round(t.s*100),a=Math.round(t.v*100);return this._a==1?"hsv("+r+", "+e+"%, "+a+"%)":"hsva("+r+", "+e+"%, "+a+"%, "+this._roundA+")"},toHsl:function(){var t=V(this._r,this._g,this._b);return{h:t.h*360,s:t.s,l:t.l,a:this._a}},toHslString:function(){var t=V(this._r,this._g,this._b),r=Math.round(t.h*360),e=Math.round(t.s*100),a=Math.round(t.l*100);return this._a==1?"hsl("+r+", "+e+"%, "+a+"%)":"hsla("+r+", "+e+"%, "+a+"%, "+this._roundA+")"},toHex:function(t){return $(this._r,this._g,this._b,t)},toHexString:function(t){return"#"+this.toHex(t)},toHex8:function(t){return ct(this._r,this._g,this._b,this._a,t)},toHex8String:function(t){return"#"+this.toHex8(t)},toRgb:function(){return{r:Math.round(this._r),g:Math.round(this._g),b:Math.round(this._b),a:this._a}},toRgbString:function(){return this._a==1?"rgb("+Math.round(this._r)+", "+Math.round(this._g)+", "+Math.round(this._b)+")":"rgba("+Math.round(this._r)+", "+Math.round(this._g)+", "+Math.round(this._b)+", "+this._roundA+")"},toPercentageRgb:function(){return{r:Math.round(b(this._r,255)*100)+"%",g:Math.round(b(this._g,255)*100)+"%",b:Math.round(b(this._b,255)*100)+"%",a:this._a}},toPercentageRgbString:function(){return this._a==1?"rgb("+Math.round(b(this._r,255)*100)+"%, "+Math.round(b(this._g,255)*100)+"%, "+Math.round(b(this._b,255)*100)+"%)":"rgba("+Math.round(b(this._r,255)*100)+"%, "+Math.round(b(this._g,255)*100)+"%, "+Math.round(b(this._b,255)*100)+"%, "+this._roundA+")"},toName:function(){return this._a===0?"transparent":this._a<1?!1:kt[$(this._r,this._g,this._b,!0)]||!1},toFilter:function(t){var r="#"+D(this._r,this._g,this._b,this._a),e=r,a=this._gradientType?"GradientType = 1, ":"";if(t){var n=u(t);e="#"+D(n._r,n._g,n._b,n._a)}return"progid:DXImageTransform.Microsoft.gradient("+a+"startColorstr="+r+",endColorstr="+e+")"},toString:function(t){var r=!!t;t=t||this._format;var e=!1,a=this._a<1&&this._a>=0,n=!r&&a&&(t==="hex"||t==="hex6"||t==="hex3"||t==="hex4"||t==="hex8"||t==="name");return n?t==="name"&&this._a===0?this.toName():this.toRgbString():(t==="rgb"&&(e=this.toRgbString()),t==="prgb"&&(e=this.toPercentageRgbString()),(t==="hex"||t==="hex6")&&(e=this.toHexString()),t==="hex3"&&(e=this.toHexString(!0)),t==="hex4"&&(e=this.toHex8String(!0)),t==="hex8"&&(e=this.toHex8String()),t==="name"&&(e=this.toName()),t==="hsl"&&(e=this.toHslString()),t==="hsv"&&(e=this.toHsvString()),e||this.toHexString())},clone:function(){return u(this.toString())},_applyModification:function(t,r){var e=t.apply(null,[this].concat([].slice.call(r)));return this._r=e._r,this._g=e._g,this._b=e._b,this.setAlpha(e._a),this},lighten:function(){return this._applyModification(bt,arguments)},brighten:function(){return this._applyModification(vt,arguments)},darken:function(){return this._applyModification(mt,arguments)},desaturate:function(){return this._applyModification(dt,arguments)},saturate:function(){return this._applyModification(gt,arguments)},greyscale:function(){return this._applyModification(pt,arguments)},spin:function(){return this._applyModification(yt,arguments)},_applyCombination:function(t,r){return t.apply(null,[this].concat([].slice.call(r)))},analogous:function(){return this._applyCombination(At,arguments)},complement:function(){return this._applyCombination(xt,arguments)},monochromatic:function(){return this._applyCombination(Mt,arguments)},splitcomplement:function(){return this._applyCombination(_t,arguments)},triad:function(){return this._applyCombination(X,[3])},tetrad:function(){return this._applyCombination(X,[4])}},u.fromRatio=function(t,r){if(typeof t=="object"){var e={};for(var a in t)t.hasOwnProperty(a)&&(a==="a"?e[a]=t[a]:e[a]=H(t[a]));t=e}return u(t,r)};function ht(t){var r={r:0,g:0,b:0},e=1,a=null,n=null,i=null,o=!1,s=!1;return typeof t=="string"&&(t=Tt(t)),typeof t=="object"&&(w(t.r)&&w(t.g)&&w(t.b)?(r=ut(t.r,t.g,t.b),o=!0,s=String(t.r).substr(-1)==="%"?"prgb":"rgb"):w(t.h)&&w(t.s)&&w(t.v)?(a=H(t.s),n=H(t.v),r=ft(t.h,a,n),o=!0,s="hsv"):w(t.h)&&w(t.s)&&w(t.l)&&(a=H(t.s),i=H(t.l),r=lt(t.h,a,i),o=!0,s="hsl"),t.hasOwnProperty("a")&&(e=t.a)),e=W(e),{ok:o,format:t.format||s,r:Math.min(255,Math.max(r.r,0)),g:Math.min(255,Math.max(r.g,0)),b:Math.min(255,Math.max(r.b,0)),a:e}}function ut(t,r,e){return{r:b(t,255)*255,g:b(r,255)*255,b:b(e,255)*255}}function V(t,r,e){t=b(t,255),r=b(r,255),e=b(e,255);var a=Math.max(t,r,e),n=Math.min(t,r,e),i,o,s=(a+n)/2;if(a==n)i=o=0;else{var h=a-n;switch(o=s>.5?h/(2-a-n):h/(a+n),a){case t:i=(r-e)/h+(r<e?6:0);break;case r:i=(e-t)/h+2;break;case e:i=(t-r)/h+4;break}i/=6}return{h:i,s:o,l:s}}function lt(t,r,e){var a,n,i;t=b(t,360),r=b(r,100),e=b(e,100);function o(f,g,c){return c<0&&(c+=1),c>1&&(c-=1),c<.16666666666666666?f+(g-f)*6*c:c<.5?g:c<.6666666666666666?f+(g-f)*(.6666666666666666-c)*6:f}if(r===0)a=n=i=e;else{var s=e<.5?e*(1+r):e+r-e*r,h=2*e-s;a=o(h,s,t+.3333333333333333),n=o(h,s,t),i=o(h,s,t-.3333333333333333)}return{r:a*255,g:n*255,b:i*255}}function B(t,r,e){t=b(t,255),r=b(r,255),e=b(e,255);var a=Math.max(t,r,e),n=Math.min(t,r,e),i,o,s=a,h=a-n;if(o=a===0?0:h/a,a==n)i=0;else{switch(a){case t:i=(r-e)/h+(r<e?6:0);break;case r:i=(e-t)/h+2;break;case e:i=(t-r)/h+4;break}i/=6}return{h:i,s:o,v:s}}function ft(t,r,e){t=b(t,360)*6,r=b(r,100),e=b(e,100);var a=Math.floor(t),n=t-a,i=e*(1-r),o=e*(1-n*r),s=e*(1-(1-n)*r),h=a%6,f=[e,o,i,i,s,e][h],g=[s,e,e,o,i,i][h],c=[i,i,s,e,e,o][h];return{r:f*255,g:g*255,b:c*255}}function $(t,r,e,a){var n=[M(Math.round(t).toString(16)),M(Math.round(r).toString(16)),M(Math.round(e).toString(16))];return a&&n[0].charAt(0)==n[0].charAt(1)&&n[1].charAt(0)==n[1].charAt(1)&&n[2].charAt(0)==n[2].charAt(1)?n[0].charAt(0)+n[1].charAt(0)+n[2].charAt(0):n.join("")}function ct(t,r,e,a,n){var i=[M(Math.round(t).toString(16)),M(Math.round(r).toString(16)),M(Math.round(e).toString(16)),M(Z(a))];return n&&i[0].charAt(0)==i[0].charAt(1)&&i[1].charAt(0)==i[1].charAt(1)&&i[2].charAt(0)==i[2].charAt(1)&&i[3].charAt(0)==i[3].charAt(1)?i[0].charAt(0)+i[1].charAt(0)+i[2].charAt(0)+i[3].charAt(0):i.join("")}function D(t,r,e,a){var n=[M(Z(a)),M(Math.round(t).toString(16)),M(Math.round(r).toString(16)),M(Math.round(e).toString(16))];return n.join("")}u.equals=function(t,r){return!t||!r?!1:u(t).toRgbString()==u(r).toRgbString()},u.random=function(){return u.fromRatio({r:Math.random(),g:Math.random(),b:Math.random()})};function dt(t,r){r=r===0?0:r||10;var e=u(t).toHsl();return e.s-=r/100,e.s=N(e.s),u(e)}function gt(t,r){r=r===0?0:r||10;var e=u(t).toHsl();return e.s+=r/100,e.s=N(e.s),u(e)}function pt(t){return u(t).desaturate(100)}function bt(t,r){r=r===0?0:r||10;var e=u(t).toHsl();return e.l+=r/100,e.l=N(e.l),u(e)}function vt(t,r){r=r===0?0:r||10;var e=u(t).toRgb();return e.r=Math.max(0,Math.min(255,e.r-Math.round(255*-(r/100)))),e.g=Math.max(0,Math.min(255,e.g-Math.round(255*-(r/100)))),e.b=Math.max(0,Math.min(255,e.b-Math.round(255*-(r/100)))),u(e)}function mt(t,r){r=r===0?0:r||10;var e=u(t).toHsl();return e.l-=r/100,e.l=N(e.l),u(e)}function yt(t,r){var e=u(t).toHsl(),a=(e.h+r)%360;return e.h=a<0?360+a:a,u(e)}function xt(t){var r=u(t).toHsl();return r.h=(r.h+180)%360,u(r)}function X(t,r){if(isNaN(r)||r<=0)throw new Error("Argument to polyad must be a positive number");for(var e=u(t).toHsl(),a=[u(t)],n=360/r,i=1;i<r;i++)a.push(u({h:(e.h+i*n)%360,s:e.s,l:e.l}));return a}function _t(t){var r=u(t).toHsl(),e=r.h;return[u(t),u({h:(e+72)%360,s:r.s,l:r.l}),u({h:(e+216)%360,s:r.s,l:r.l})]}function At(t,r,e){r=r||6,e=e||30;var a=u(t).toHsl(),n=360/e,i=[u(t)];for(a.h=(a.h-(n*r>>1)+720)%360;--r;)a.h=(a.h+n)%360,i.push(u(a));return i}function Mt(t,r){r=r||6;for(var e=u(t).toHsv(),a=e.h,n=e.s,i=e.v,o=[],s=1/r;r--;)o.push(u({h:a,s:n,v:i})),i=(i+s)%1;return o}u.mix=function(t,r,e){e=e===0?0:e||50;var a=u(t).toRgb(),n=u(r).toRgb(),i=e/100,o={r:(n.r-a.r)*i+a.r,g:(n.g-a.g)*i+a.g,b:(n.b-a.b)*i+a.b,a:(n.a-a.a)*i+a.a};return u(o)},u.readability=function(t,r){var e=u(t),a=u(r);return(Math.max(e.getLuminance(),a.getLuminance())+.05)/(Math.min(e.getLuminance(),a.getLuminance())+.05)},u.isReadable=function(t,r,e){var a=u.readability(t,r),n,i;switch(i=!1,n=Rt(e),n.level+n.size){case"AAsmall":case"AAAlarge":i=a>=4.5;break;case"AAlarge":i=a>=3;break;case"AAAsmall":i=a>=7;break}return i},u.mostReadable=function(t,r,e){var a=null,n=0,i,o,s,h;e=e||{},o=e.includeFallbackColors,s=e.level,h=e.size;for(var f=0;f<r.length;f++)i=u.readability(t,r[f]),i>n&&(n=i,a=u(r[f]));return u.isReadable(t,a,{level:s,size:h})||!o?a:(e.includeFallbackColors=!1,u.mostReadable(t,["#fff","#000"],e))};var G=u.names={aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"0ff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000",blanchedalmond:"ffebcd",blue:"00f",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",burntsienna:"ea7e5d",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"0ff",darkblue:"00008b",darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgreen:"006400",darkgrey:"a9a9a9",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkslategrey:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dimgrey:"696969",dodgerblue:"1e90ff",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"f0f",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",green:"008000",greenyellow:"adff2f",grey:"808080",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgray:"d3d3d3",lightgreen:"90ee90",lightgrey:"d3d3d3",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",lightslategray:"789",lightslategrey:"789",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"0f0",limegreen:"32cd32",linen:"faf0e6",magenta:"f0f",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370db",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"db7093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",rebeccapurple:"663399",red:"f00",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",slategrey:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",wheat:"f5deb3",white:"fff",whitesmoke:"f5f5f5",yellow:"ff0",yellowgreen:"9acd32"},kt=u.hexNames=wt(G);function wt(t){var r={};for(var e in t)t.hasOwnProperty(e)&&(r[t[e]]=e);return r}function W(t){return t=parseFloat(t),(isNaN(t)||t<0||t>1)&&(t=1),t}function b(t,r){St(t)&&(t="100%");var e=Ft(t);return t=Math.min(r,Math.max(0,parseFloat(t))),e&&(t=parseInt(t*r,10)/100),Math.abs(t-r)<1e-6?1:t%r/parseFloat(r)}function N(t){return Math.min(1,Math.max(0,t))}function _(t){return parseInt(t,16)}function St(t){return typeof t=="string"&&t.indexOf(".")!=-1&&parseFloat(t)===1}function Ft(t){return typeof t=="string"&&t.indexOf("%")!=-1}function M(t){return t.length==1?"0"+t:""+t}function H(t){return t<=1&&(t=t*100+"%"),t}function Z(t){return Math.round(parseFloat(t)*255).toString(16)}function Q(t){return _(t)/255}var k=function(){var t="[-\\+]?\\d+%?",r="[-\\+]?\\d*\\.\\d+%?",e="(?:"+r+")|(?:"+t+")",a="[\\s|\\(]+("+e+")[,|\\s]+("+e+")[,|\\s]+("+e+")\\s*\\)?",n="[\\s|\\(]+("+e+")[,|\\s]+("+e+")[,|\\s]+("+e+")[,|\\s]+("+e+")\\s*\\)?";return{CSS_UNIT:new RegExp(e),rgb:new RegExp("rgb"+a),rgba:new RegExp("rgba"+n),hsl:new RegExp("hsl"+a),hsla:new RegExp("hsla"+n),hsv:new RegExp("hsv"+a),hsva:new RegExp("hsva"+n),hex3:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex6:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,hex4:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex8:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/}}();function w(t){return!!k.CSS_UNIT.exec(t)}function Tt(t){t=t.replace(st,"").replace(ot,"").toLowerCase();var r=!1;if(G[t])t=G[t],r=!0;else if(t=="transparent")return{r:0,g:0,b:0,a:0,format:"name"};var e;return(e=k.rgb.exec(t))?{r:e[1],g:e[2],b:e[3]}:(e=k.rgba.exec(t))?{r:e[1],g:e[2],b:e[3],a:e[4]}:(e=k.hsl.exec(t))?{h:e[1],s:e[2],l:e[3]}:(e=k.hsla.exec(t))?{h:e[1],s:e[2],l:e[3],a:e[4]}:(e=k.hsv.exec(t))?{h:e[1],s:e[2],v:e[3]}:(e=k.hsva.exec(t))?{h:e[1],s:e[2],v:e[3],a:e[4]}:(e=k.hex8.exec(t))?{r:_(e[1]),g:_(e[2]),b:_(e[3]),a:Q(e[4]),format:r?"name":"hex8"}:(e=k.hex6.exec(t))?{r:_(e[1]),g:_(e[2]),b:_(e[3]),format:r?"name":"hex"}:(e=k.hex4.exec(t))?{r:_(e[1]+""+e[1]),g:_(e[2]+""+e[2]),b:_(e[3]+""+e[3]),a:Q(e[4]+""+e[4]),format:r?"name":"hex8"}:(e=k.hex3.exec(t))?{r:_(e[1]+""+e[1]),g:_(e[2]+""+e[2]),b:_(e[3]+""+e[3]),format:r?"name":"hex"}:!1}function Rt(t){var r,e;return t=t||{level:"AA",size:"small"},r=(t.level||"AA").toUpperCase(),e=(t.size||"small").toLowerCase(),r!=="AA"&&r!=="AAA"&&(r="AA"),e!=="small"&&e!=="large"&&(e="small"),{level:r,size:e}}var Ct=function(){function t(r,e){var a=[],n=!0,i=!1,o=void 0;try{for(var s=r[Symbol.iterator](),h;!(n=(h=s.next()).done)&&(a.push(h.value),!(e&&a.length===e));n=!0);}catch(f){i=!0,o=f}finally{try{!n&&s.return&&s.return()}finally{if(i)throw o}}return a}return function(r,e){if(Array.isArray(r))return r;if(Symbol.iterator in Object(r))return t(r,e);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),E=Math.PI*2,z=function(r,e,a,n,i,o,s){var h=r.x,f=r.y;h*=e,f*=a;var g=n*h-i*f,c=i*h+n*f;return{x:g+o,y:c+s}},Ht=function(r,e){var a=e===1.5707963267948966?.551915024494:e===-1.5707963267948966?-.551915024494:1.3333333333333333*Math.tan(e/4),n=Math.cos(r),i=Math.sin(r),o=Math.cos(r+e),s=Math.sin(r+e);return[{x:n-i*a,y:i+n*a},{x:o+s*a,y:s-o*a},{x:o,y:s}]},q=function(r,e,a,n){var i=r*n-e*a<0?-1:1,o=r*a+e*n;return o>1&&(o=1),o<-1&&(o=-1),i*Math.acos(o)},Et=function(r,e,a,n,i,o,s,h,f,g,c,m){var v=Math.pow(i,2),A=Math.pow(o,2),l=Math.pow(c,2),d=Math.pow(m,2),p=v*A-v*d-A*l;p<0&&(p=0),p/=v*d+A*l,p=Math.sqrt(p)*(s===h?-1:1);var y=p*i/o*m,x=p*-o/i*c,P=g*y-f*x+(r+a)/2,F=f*y+g*x+(e+n)/2,T=(c-y)/i,R=(m-x)/o,O=(-c-y)/i,C=(-m-x)/o,I=q(1,0,T,R),S=q(T,R,O,C);return h===0&&S>0&&(S-=E),h===1&&S<0&&(S+=E),[P,F,I,S]},J=function(r){var e=r.px,a=r.py,n=r.cx,i=r.cy,o=r.rx,s=r.ry,h=r.xAxisRotation,f=h===void 0?0:h,g=r.largeArcFlag,c=g===void 0?0:g,m=r.sweepFlag,v=m===void 0?0:m,A=[];if(o===0||s===0)return[];var l=Math.sin(f*E/360),d=Math.cos(f*E/360),p=d*(e-n)/2+l*(a-i)/2,y=-l*(e-n)/2+d*(a-i)/2;if(p===0&&y===0)return[];o=Math.abs(o),s=Math.abs(s);var x=Math.pow(p,2)/Math.pow(o,2)+Math.pow(y,2)/Math.pow(s,2);x>1&&(o*=Math.sqrt(x),s*=Math.sqrt(x));var P=Et(e,a,n,i,o,s,c,v,l,d,p,y),F=Ct(P,4),T=F[0],R=F[1],O=F[2],C=F[3],I=Math.abs(C)/(E/4);Math.abs(1-I)<1e-7&&(I=1);var S=Math.max(Math.ceil(I),1);C/=S;for(var K=0;K<S;K++)A.push(Ht(O,C)),O+=C;return A.map(function(L){var Y=z(L[0],o,s,d,l,T,R),It=Y.x,jt=Y.y,tt=z(L[1],o,s,d,l,T,R),Nt=tt.x,Ot=tt.y,et=z(L[2],o,s,d,l,T,R),Gt=et.x,zt=et.y;return{x1:It,y1:jt,x2:Nt,y2:Ot,x:Gt,y:zt}})};class Pt extends rt.Graphics{constructor(r){super(),this.lineColor=null,r&&this.drawSVG(r)}drawSVG(r){if(typeof r=="string"){const e=document.createElement("div");e.innerHTML=r.trim(),r=e.querySelector("svg")}if(!r)throw new Error("Missing <svg> element in SVG constructor");return this._svgFill(r),this._svgChildren(r.children),this}_svgChildren(r,e=!1){for(let a=0;a<r.length;a++){const n=r[a];switch(this._svgFill(n,e),n.nodeName.toLowerCase()){case"path":{this._svgPath(n);break}case"circle":case"ellipse":{this._svgCircle(n);break}case"rect":{this._svgRect(n);break}case"polygon":{this._svgPoly(n,!0);break}case"polyline":{this._svgPoly(n);break}case"g":break;default:{console.info(`[PIXI.SVG] <${n.nodeName}> elements unsupported`);break}}this._svgChildren(n.children,!0)}}_hexToUint(r){if(r[0]==="#")return r=r.substr(1),r.length===3&&(r=r.replace(/([a-f0-9])/ig,"$1$1")),parseInt(r,16);const{r:e,g:a,b:n}=u(r).toRgb();return(e<<16)+(a<<8)+n}_svgCircle(r){let e="r",a="r";const n=r.nodeName==="elipse";n&&(e+="x",a+="y");const i=parseFloat(r.getAttribute(a)),o=parseFloat(r.getAttribute(e)),s=r.getAttribute("cx"),h=r.getAttribute("cy");let f=0,g=0;s!==null&&(f=parseFloat(s)),h!==null&&(g=parseFloat(h)),n?this.drawEllipse(f,g,i,o):this.drawCircle(f,g,i)}_svgRect(r){const e=parseFloat(r.getAttribute("x")),a=parseFloat(r.getAttribute("y")),n=parseFloat(r.getAttribute("width")),i=parseFloat(r.getAttribute("height")),o=parseFloat(r.getAttribute("rx"));o?this.drawRoundedRect(e,a,n,i,o):this.drawRect(e,a,n,i)}_convertStyleName(r){return r.trim().replace("-width","Width").replace(/.*-(line)?/,"")}_svgStyle(r){const e=r.getAttribute("style"),a=r.getAttribute("opacity"),n={fill:r.getAttribute("fill"),opacity:a||r.getAttribute("fill-opacity"),stroke:r.getAttribute("stroke"),strokeOpacity:a||r.getAttribute("stroke-opacity"),strokeWidth:r.getAttribute("stroke-width"),cap:r.getAttribute("stroke-linecap"),join:r.getAttribute("stroke-linejoin"),miterLimit:r.getAttribute("stroke-miterlimit")};return e!==null&&e.split(";").forEach(i=>{const[o,s]=i.split(":");if(o){const h=this._convertStyleName(o);n[h]||(n[h]=s.trim())}}),n}_svgPoly(r,e){const a=r.getAttribute("points").split(/[ ,]/g).map(n=>parseInt(n,10));this.drawPolygon(a),e&&this.closePath()}_svgFill(r,e){const{fill:a,opacity:n,stroke:i,strokeOpacity:o,strokeWidth:s,cap:h,join:f,miterLimit:g}=this._svgStyle(r),c=s!==null?parseFloat(s):i!==null?1:0,m=i!==null?this._hexToUint(i):this.lineColor;a?a==="none"?this.beginFill(0,0):this.beginFill(this._hexToUint(a),n!==null?parseFloat(n):1):e||this.beginFill(0),this.lineStyle({width:i===null&&s===null&&e?this.line.width:c,alpha:o===null?this.line.alpha:parseFloat(o),color:i===null&&e?this.line.color:m,cap:h===null&&e?this.line.cap:h,join:f===null&&e?this.line.join:f,miterLimit:g===null&&e?this.line.miterLimit:parseFloat(g)}),r.getAttribute("fill-rule")&&console.info('[PIXI.SVG] "fill-rule" attribute is not supported')}_svgPath(r){const e=r.getAttribute("d");let a=0,n=0;const i=it(e.trim());for(let o=0;o<i.length;o++){const s=i[o];switch(s.code){case"m":{this.moveTo(a+=s.end.x,n+=s.end.y);break}case"M":{this.moveTo(a=s.end.x,n=s.end.y);break}case"H":{this.lineTo(a=s.value,n);break}case"h":{this.lineTo(a+=s.value,n);break}case"V":{this.lineTo(a,n=s.value);break}case"v":{this.lineTo(a,n+=s.value);break}case"Z":{this.closePath();break}case"L":{this.lineTo(a=s.end.x,n=s.end.y);break}case"l":{this.lineTo(a+=s.end.x,n+=s.end.y);break}case"C":{this.bezierCurveTo(s.cp1.x,s.cp1.y,s.cp2.x,s.cp2.y,a=s.end.x,n=s.end.y);break}case"c":{const h=a,f=n;this.bezierCurveTo(h+s.cp1.x,f+s.cp1.y,h+s.cp2.x,f+s.cp2.y,a+=s.end.x,n+=s.end.y);break}case"s":case"q":{const h=a,f=n;this.quadraticCurveTo(h+s.cp.x,f+s.cp.y,a+=s.end.x,n+=s.end.y);break}case"S":case"Q":{this.quadraticCurveTo(s.cp.x,s.cp.y,a=s.end.x,n=s.end.y);break}case"a":{J({px:a,py:n,cx:a+=s.end.x,cy:n+=s.end.y,rx:s.radii.x,ry:s.radii.y,xAxisRotation:s.rotation,largeArcFlag:s.large?1:0,sweepFlag:s.clockwise?1:0}).forEach(({x1:h,y1:f,x2:g,y2:c,x:m,y:v})=>this.bezierCurveTo(h,f,g,c,m,v));break}case"A":{J({px:a,py:n,cx:a=s.end.x,cy:n=s.end.y,rx:s.radii.x,ry:s.radii.y,xAxisRotation:s.rotation,largeArcFlag:s.large?1:0,sweepFlag:s.clockwise?1:0}).forEach(({x1:h,y1:f,x2:g,y2:c,x:m,y:v})=>this.bezierCurveTo(h,f,g,c,m,v));break}default:{console.info("[PIXI.SVG] Draw command not supported:",s.code,s);break}}}}}return U.SVG=Pt,U}({},PIXI);Object.assign(PIXI,pixisvg);
//# sourceMappingURL=pixi-svg.js.map
