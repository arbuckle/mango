/* YUI 3.8.1 (build 5795) Copyright 2013 Yahoo! Inc. http://yuilibrary.com/license/
 * Special thanks to Philip Tellis http://tech.bluesmoon.info/2008/04/strftime-in-javascript.html
 * Adapted from YUI on 2013/01/29
 */
var strftime = (function () {
    var xPad=function (x, pad, r)
    {
        if(typeof r === "undefined")
        {
            r=10;
        }
        pad = pad + "";
        for( ; parseInt(x, 10)<r && r>1; r/=10) {
            x = pad + x;
        }
        return x.toString();
    };

    var Dt = {
        formats: {
            a: function (d, l) { return l.a[d.getDay()]; },
            A: function (d, l) { return l.A[d.getDay()]; },
            b: function (d, l) { return l.b[d.getMonth()]; },
            B: function (d, l) { return l.B[d.getMonth()]; },
            C: function (d) { return xPad(parseInt(d.getFullYear()/100, 10), 0); },
            d: ["getDate", "0"],
            e: ["getDate", " "],
            g: function (d) { return xPad(parseInt(Dt.formats.G(d)%100, 10), 0); },
            G: function (d) {
                var y = d.getFullYear();
                var V = parseInt(Dt.formats.V(d), 10);
                var W = parseInt(Dt.formats.W(d), 10);

                if(W > V) {
                    y++;
                } else if(W===0 && V>=52) {
                    y--;
                }

                return y;
            },
            H: ["getHours", "0"],
            I: function (d) { var I=d.getHours()%12; return xPad(I===0?12:I, 0); },
            j: function (d) {
                var gmd_1 = new Date("" + d.getFullYear() + "/1/1 GMT");
                var gmdate = new Date("" + d.getFullYear() + "/" + (d.getMonth()+1) + "/" + d.getDate() + " GMT");
                var ms = gmdate - gmd_1;
                var doy = parseInt(ms/60000/60/24, 10)+1;
                return xPad(doy, 0, 100);
            },
            k: ["getHours", " "],
            l: function (d) { var I=d.getHours()%12; return xPad(I===0?12:I, " "); },
            m: function (d) { return xPad(d.getMonth()+1, 0); },
            M: ["getMinutes", "0"],
            p: function (d, l) { return l.p[d.getHours() >= 12 ? 1 : 0 ]; },
            P: function (d, l) { return l.P[d.getHours() >= 12 ? 1 : 0 ]; },
            s: function (d, l) { return parseInt(d.getTime()/1000, 10); },
            S: ["getSeconds", "0"],
            u: function (d) { var dow = d.getDay(); return dow===0?7:dow; },
            U: function (d) {
                var doy = parseInt(Dt.formats.j(d), 10);
                var rdow = 6-d.getDay();
                var woy = parseInt((doy+rdow)/7, 10);
                return xPad(woy, 0);
            },
            V: function (d) {
                var woy = parseInt(Dt.formats.W(d), 10);
                var dow1_1 = (new Date("" + d.getFullYear() + "/1/1")).getDay();
                // First week is 01 and not 00 as in the case of %U and %W,
                // so we add 1 to the final result except if day 1 of the year
                // is a Monday (then %W returns 01).
                // We also need to subtract 1 if the day 1 of the year is
                // Friday-Sunday, so the resulting equation becomes:
                var idow = woy + (dow1_1 > 4 || dow1_1 <= 1 ? 0 : 1);
                if(idow === 53 && (new Date("" + d.getFullYear() + "/12/31")).getDay() < 4)
                {
                    idow = 1;
                }
                else if(idow === 0)
                {
                    idow = Dt.formats.V(new Date("" + (d.getFullYear()-1) + "/12/31"));
                }

                return xPad(idow, 0);
            },
            w: "getDay",
            W: function (d) {
                var doy = parseInt(Dt.formats.j(d), 10);
                var rdow = 7-Dt.formats.u(d);
                var woy = parseInt((doy+rdow)/7, 10);
                return xPad(woy, 0, 10);
            },
            y: function (d) { return xPad(d.getFullYear()%100, 0); },
            Y: "getFullYear",
            z: function (d) {
                var o = d.getTimezoneOffset();
                var H = xPad(parseInt(Math.abs(o/60), 10), 0);
                var M = xPad(Math.abs(o%60), 0);
                return (o>0?"-":"+") + H + M;
            },
            Z: function (d) {
                var tz = d.toString().replace(/^.*:\d\d( GMT[+-]\d+)? \(?([A-Za-z ]+)\)?\d*$/, "$2").replace(/[a-z ]/g, "");
                if(tz.length > 4) {
                    tz = Dt.formats.z(d);
                }
                return tz;
            },
            "%": function (d) { return "%"; }
        },

        aggregates: {
            c: "locale",
            D: "m/d/y",
            F: "Y-m-d",
            h: "b",
            n: "\n",
            r: "I:M:S p",
            R: "H:M",
            t: "\t",
            T: "H:M:S",
            x: "locale",
            X: "locale"
            //"+": "a b e T Z Y"
        },
        format : function (oDate, format) {
            format = format || "Y-m-d";

            if(!oDate.constructor === Date) {
                return oDate.constructor ? oDate : "";
            }

            var resources, compatMode, sLocale, LOCALE;

            //resources = Y.Intl.get('datatype-date-format');
            resources = {
                a:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
                A:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
                b:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
                B:["January","February","March","April","May","June","July","August","September","October","November","December"],
                c:"a, b d, Y l:M:S p Z",
                p:["AM","PM"],
                P:["am","pm"],
                x:"m/d/y",
                X:"l:M:S p"
            };

            var replace_aggs = function (m0, m1) {
                if (compatMode && m1 === "r") {
                    return resources[m1];
                }
                var f = Dt.aggregates[m1];
                return (f === "locale" ? resources[m1] : f);
            };

            var replace_formats = function (m0, m1) {
                var f = Dt.formats[m1],
                    fType = (f.constructor === Array) ? 'array' : typeof(f);

                switch(fType) {
                    case "string":					// string => built in date function
                        return oDate[f]();
                    case "function":				// function => our own function
                        return f.call(oDate, oDate, resources);
                    case "array":					// built in function with padding
                        if(typeof(f[0]) === "string") {
                            return xPad(oDate[f[0]](), f[1]);
                        } // no break; (fall through to default:)
                    default:
                        return m1;
                }
            };

            // First replace aggregates (run in a loop because an agg may be made up of other aggs)
            while(format.match(/[cDFhnrRtTxX]/)) {
                format = format.replace(/([cDFhnrRtTxX])/g, replace_aggs);
            }

            // Now replace formats (do not run in a loop otherwise %%a will be replace with the value of %a)
            var str = format.replace(/([aAbBCdegGHIjklmMpPsSuUVwWyYzZ])/g, replace_formats);

            replace_aggs = replace_formats = undefined;

            return str;
        }
    };
    return Dt.format;
})();
