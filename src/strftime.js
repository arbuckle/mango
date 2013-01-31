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

    var getDSTStatus = function(dstOffset) {
        var 	i, offset,
            d = new Date(),
            DST = d.getTimezoneOffset(),
            nonDST = d.getTimezoneOffset();
        for (i = 0; i < 365; i++) {
            d.setDate(i);
            offset = d.getTimezoneOffset();
            if (offset <= DST) {
                DST = offset;
            } else {
                nonDST = offset;
            }
        }
        if (DST === nonDST) {
            return 0;
        } else {
            return (DST === dstOffset) ? 1 : 0;
        }
    };

    var Dt = {
        formats: {
            a: function (d, l) { return l.P[d.getHours() >= 12 ? 1 : 0 ]; }, //am or pm
            A: function (d, l) { return l.p[d.getHours() >= 12 ? 1 : 0 ]; }, //AM or PM
            b: function (d, l) { return l.b[d.getMonth()].toLowerCase(); }, //Month, textual, 3 letters, lowercase
            d: ["getDate", "0"], //day of month; two digits, leading zeroes
            D: function (d, l) { return l.a[d.getDay()]; }, //Day of the week, textual, 3 letters
            e: function (d) {
                var tz = d.toString().replace(/^.*:\d\d( GMT[+-]\d+)? \(?([A-Za-z ]+)\)?\d*$/, "$2").replace(/[a-z ]/g, "");
                if(tz.length > 4) {
                    tz = Dt.formats.z(d);
                }
                return tz; //TODO:  this is not reliable for unnamed timezones (such as UTC-11)
            },  //timezone name
            E: function (d, l) { return l.B[d.getMonth()]; }, //Verbose Month
            f: function(d){
                var H = Dt.formats.g(d),
                    M = xPad(d.getMinutes(), 0);
                if (parseInt(M, 10) === 0) {
                    return H;
                }
                return H + ':' + M;

            }, // time in 12-hours and minutes, with minutes left off if zero
            F: function (d, l) { return l.B[d.getMonth()]; }, //Verbose Month
            g: function (d) { var I=d.getHours()%12; return xPad(I===0?12:I, ""); }, //hour, 12-hr, no leading zeroes
            G: function (d) { return d.getHours();}, //hour, 24-hr, no leading zeroes
            h: function (d) { var I=d.getHours()%12; return xPad(I===0?12:I, 0); }, //hour, 12-hr format
            H: function (d) { return xPad(d.getHours(),0)}, //hour, 24-hr format
            i: ["getMinutes", "0"], //minutes
            I: function (d) {
                return getDSTStatus(d.getTimezoneOffset());
            }, //DST in effect or not.
            j: "getDate",
            k: ["getHours", " "], //not implemented
            l: function (d, l) {return l.A[d.getDay()];}, //hour, 12-hr, no leading zeroes
            L: function(d) {
                var y = d.getFullYear();
                return (y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0));
            },
            m: function (d) { return xPad(d.getMonth()+1, 0); }, //2-digit month with leading zeroes
            M: function (d, l) { return l.b[d.getMonth()]; }, //Month, textual, 3 letters
            n: function (d) { return d.getMonth()+1; }, //2-digit month without leading zeroes
            N: function (d, l) { return l.bb[d.getMonth()]; }, //month abbreviation in AP style
            o: function (d) {
                var y = d.getFullYear();
                var W = parseInt(Dt.formats.W(d), 10);
                var V = parseInt(Dt.formats.V(d), 10);

                if(V > W) {
                    y++;
                } else if(W===0 && V>=52) {
                    y--;
                }

                return y;
            }, //ISO-8601 week-numbering year...
            O: function (d) {
                var o = d.getTimezoneOffset();
                var H = xPad(parseInt(Math.abs(o/60), 10), 0);
                var M = xPad(Math.abs(o%6), 0);
                return (o>0?"-":"+") + H + M;
            }, //difference to GMT in hours
            r: function(d){return d;}, //rfc 2822 date
            s: ["getSeconds", "0"],  //2-digit seconds with leading zeroes
            S: function(d,l) {
                var pos,
                    day = d.getDate();
                pos = day % 10;
                if (day >= 11 && day <= 13) {
                    pos = 0;
                } else if (pos > 3) {
                    pos = 0;
                }
                return l.S[pos];
            }, //English ordinal suffix for day of the month, 2 characters
            t: function (d, l) {
                var m = l.t[d.getMonth()];
                if (m == 28 && Dt.formats.L) {
                    return 29;
                }
                return m;
            }, //number of days in a given month
            T: function(){return Dt.formats.e(new Date());}, //Time Zone
            u: function (d) { return d.getMilliseconds() * 1000; }, //microseconds
            U: function (d, l) { return parseInt(d.getTime()/1000, 10); }, //seconds since Epoch
            V: function (d) {
                var doy = parseInt(Dt.formats.z(d), 10);
                var dow = d.getDay();
                var rdow = 7-((dow===0) ? 7 : dow);
                var woy = parseInt((doy+rdow)/7, 10);
                return xPad(woy, 0, 10);
            }, // week of year; not implemented as such in Django.
            w: "getDay", //day of week; digits without leading zeroes
            W: function (d) {
                var woy = parseInt(Dt.formats.V(d), 10);
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

                return idow;
            }, // ISO-8601 week number of year; indexed to mondays (got a case of the mondays)
            y: function (d) { return xPad(d.getFullYear()%100, 0); }, //2-digit year
            Y: "getFullYear", //4-digit year
            z: function (d) {
                var gmd_1 = new Date("" + d.getFullYear() + "/1/1 GMT");
                var gmdate = new Date("" + d.getFullYear() + "/" + (d.getMonth()+1) + "/" + d.getDate() + " GMT");
                var ms = gmdate - gmd_1;
                var doy = parseInt(ms/60000/60/24, 10)+1;
                return xPad(doy, 0, 0);
            }, // day of year 0-365
            Z: function (d) {
                var o = d.getTimezoneOffset();
                var H = xPad(parseInt(Math.abs(o*.6), 10), 0);
                var M = xPad(Math.abs(o%6), 0);
                return (o>0?"-":"+") + H + M;
            }, //Time zone offset in seconds
            "%": function (d) { return "%"; }
        },

        aggregates: {
            c: "o-m-dTg:i:s.uO", //iso 8601 format
            r: "D, d M o H:i:s O", //rfc 2822 date
            R: "H:M", //remove
            t: "\t", //leave
            T: "H:M:S", //remove
            x: "locale", //remove
            P: "g:i a" //remove

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
                bb:["Jan.","Feb.","March","April","May","June","July","Aug.","Sept.","Oct.","Nov.","Dec."], //ap months
                B:["January","February","March","April","May","June","July","August","September","October","November","December"],
                c:"a, b d, Y l:M:S p Z",
                p:["AM","PM"],
                P:["a.m.","p.m."],
                S:['th', 'st', 'nd', 'rd'],
                t:["31","28","31","30","31","30","31","31","30","31","30","31"],
                x:"m/d/y",
                X:"l:M p"
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
            while(format.match(/[crPRxX]/)) {
                format = format.replace(/([crPRxX])/g, replace_aggs);
            }

            // Now replace formats (do not run in a loop otherwise %%a will be replace with the value of %a)
            var str = format.replace(/([aAbBCdDeEfFgGhHiIjklLmMnNoOsStTuUVwWyYzZ])/g, replace_formats);

            replace_aggs = replace_formats = undefined;

            return str;
        }
    };
    return Dt.format;
})();
