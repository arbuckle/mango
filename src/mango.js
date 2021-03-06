/*
 * Mango.js
 * DRY Client-side templates for Django
 *
 * Modeled after Underscore.js micro-templating.
 * http://underscorejs.org/underscore.js
 *
 */


(function() {

    var root = this;
    var mango = function(obj) {
        return new mango(obj);
    };
    root.mango = mango;

    var escapes = {
        "'":      "'",
        '\\':     '\\',
        '\r':     'r',
        '\n':     'n',
        '\t':     't',
        '\u2028': 'u2028',
        '\u2029': 'u2029'
    };
    var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
    var htmlEscapes = {
        "<":    "&lt;",
        ">":    "&gt;",
        "'":    "&#39;",
        "\"":    "&quot;",
        "&":    "&amp;"
    };
    var htmlEscaper = /\'|\"|>|<|&/g;
    var noMatch = /(.)^/;

    mango.strftime = function(){var e=function(e,t,n){if(typeof n==="undefined"){n=10}t=t+"";for(;parseInt(e,10)<n&&n>1;n/=10){e=t+e}return e.toString()};var t=function(e){var t,n,r=new Date,i=r.getTimezoneOffset(),s=r.getTimezoneOffset();for(t=0;t<365;t++){r.setDate(t);n=r.getTimezoneOffset();if(n<=i){i=n}else{s=n}}if(i===s){return 0}else{return i===e?1:0}};var n={formats:{a:function(e,t){return t.P[e.getHours()>=12?1:0]},A:function(e,t){return t.p[e.getHours()>=12?1:0]},b:function(e,t){return t.b[e.getMonth()].toLowerCase()},d:["getDate","0"],D:function(e,t){return t.a[e.getDay()]},e:function(e){var t=e.toString().replace(/^.*:\d\d( GMT[+-]\d+)? \(?([A-Za-z ]+)\)?\d*$/,"$2").replace(/[a-z ]/g,"");if(t.length>4){t=n.formats.z(e)}return t},E:function(e,t){return t.B[e.getMonth()]},f:function(t){var r=n.formats.g(t),i=e(t.getMinutes(),0);if(parseInt(i,10)===0){return r}return r+":"+i},F:function(e,t){return t.B[e.getMonth()]},g:function(t){var n=t.getHours()%12;return e(n===0?12:n,"")},G:function(e){return e.getHours()},h:function(t){var n=t.getHours()%12;return e(n===0?12:n,0)},H:function(t){return e(t.getHours(),0)},i:["getMinutes","0"],I:function(e){return t(e.getTimezoneOffset())},j:"getDate",k:["getHours"," "],l:function(e,t){return t.A[e.getDay()]},L:function(e){var t=e.getFullYear();return t%4===0&&(t%100!==0||t%400===0)},m:function(t){return e(t.getMonth()+1,0)},M:function(e,t){return t.b[e.getMonth()]},n:function(e){return e.getMonth()+1},N:function(e,t){return t.bb[e.getMonth()]},o:function(e){var t=e.getFullYear();var r=parseInt(n.formats.W(e),10);var i=parseInt(n.formats.V(e),10);if(i>r){t++}else if(r===0&&i>=52){t--}return t},O:function(t){var n=t.getTimezoneOffset();var r=e(parseInt(Math.abs(n/60),10),0);var i=e(Math.abs(n%6),0);return(n>0?"-":"+")+r+i},r:function(e){return e},s:["getSeconds","0"],S:function(e,t){var n,r=e.getDate();n=r%10;if(r>=11&&r<=13){n=0}else if(n>3){n=0}return t.S[n]},t:function(e,t){var r=t.t[e.getMonth()];if(r==28&&n.formats.L){return 29}return r},T:function(){return n.formats.e(new Date)},u:function(e){return e.getMilliseconds()*1e3},U:function(e,t){return parseInt(e.getTime()/1e3,10)},V:function(t){var r=parseInt(n.formats.z(t),10);var i=t.getDay();var s=7-(i===0?7:i);var o=parseInt((r+s)/7,10);return e(o,0,10)},w:"getDay",W:function(e){var t=parseInt(n.formats.V(e),10);var r=(new Date(""+e.getFullYear()+"/1/1")).getDay();var i=t+(r>4||r<=1?0:1);if(i===53&&(new Date(""+e.getFullYear()+"/12/31")).getDay()<4){i=1}else if(i===0){i=n.formats.V(new Date(""+(e.getFullYear()-1)+"/12/31"))}return i},y:function(t){return e(t.getFullYear()%100,0)},Y:"getFullYear",z:function(t){var n=new Date(""+t.getFullYear()+"/1/1 GMT");var r=new Date(""+t.getFullYear()+"/"+(t.getMonth()+1)+"/"+t.getDate()+" GMT");var i=r-n;var s=parseInt(i/6e4/60/24,10)+1;return e(s,0,0)},Z:function(t){var n=t.getTimezoneOffset();var r=e(parseInt(Math.abs(n*.6),10),0);var i=e(Math.abs(n%6),0);return(n>0?"-":"+")+r+i},"%":function(e){return"%"}},aggregates:{c:"o-m-deg:i:s.uO",r:"D, d M o H:i:s O",R:"H:M",t:"    ",T:"H:M:S",x:"locale",P:"g:i a"},format:function(t,r){r=r||"Y-m-d";if(!t.constructor===Date){return t.constructor?t:""}var i,s,o,u;i={a:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],A:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],b:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],bb:["Jan.","Feb.","March","April","May","June","July","Aug.","Sept.","Oct.","Nov.","Dec."],B:["January","February","March","April","May","June","July","August","September","October","November","December"],c:"a, b d, Y l:M:S p Z",p:["AM","PM"],P:["a.m.","p.m."],S:["th","st","nd","rd"],t:["31","28","31","30","31","30","31","31","30","31","30","31"],x:"m/d/y",X:"l:M p"};var a=function(e,t){if(s&&t==="r"){return i[t]}var r=n.aggregates[t];return r==="locale"?i[t]:r};var f=function(r,s){var o=n.formats[s],u=o.constructor===Array?"array":typeof o;switch(u){case"string":return t[o]();case"function":return o.call(t,t,i);case"array":if(typeof o[0]==="string"){return e(t[o[0]](),o[1])};default:return s}};while(r.match(/[crPRxX]/)){r=r.replace(/([crPRxX])/g,a)}var l=r.replace(/([aAbBCdDeEfFgGhHiIjklLmMnNoOsStTuUVwWyYzZ])/g,f);a=f=undefined;return l}};return n.format}();

    mango.URLConf = new function() {
        "use strict";
        function mapUrlArgsToKeyNames(keys, args) {
            // Builds a dict mapping URL key names to provided arguments.
            // This function programatically normalizes the difference between named keyword and listed keyword usage of the {% url %} tag.
            // So given the following {% url 'resource-name' obj.arg1 obj.arg2 'new' %}
            // Or {% url 'resource-name' arg1=obj.arg1 arg2=obj.arg2 arg3='new' %}
            // This will return a dict that maps the argument values to the keys exctracted from the URL pattern.
            // > {arg1: obj.arg1, arg2: obj.arg2, arg3: 'new'}
            var i,
                val,
                key,
                outDict = {},
                usesKeywords = false;
            if (args[0] && args[0].indexOf('=') !== -1) {
                usesKeywords = true;
            }

            for (i = 0; i < args.length; i++) {
                val = args[i];
                if (usesKeywords) {
                    key = val.split('=');
                    val = key.pop();
                } else {
                    key = keys[i];
                }
                outDict[key] = val;
            }
            return outDict;
        }
        function keyNamesFromUrl(url) {
            // Parses a URL pattern and extracts bracket-enclosed key names for URL data.
            // So when given the pattern: "path/<arg1>/to/<arg2>/resource/<arg3>/",
            // This will return a list of argument names accepted by the specified URL.
            // > ['arg1', 'arg2', 'arg3']
            var i,
                keyNames = url.match(/<[a-z-_]+>/gi),
                c_keyNames = (keyNames) ? keyNames.length : 0;
            for (i = 0; i < c_keyNames; i++) {
                keyNames[i] = keyNames[i].replace(/[<>]/gi, '');
            }
            return keyNames;
        }
        function getUrl(url, keyNames, keyDict) {
            // Takes a pattern, a list of argument keys extracted from the pattern, and a dict mapping argument keys to
            // values provided in a {% url %} tag, this returns a compiled URL string that will print the URL definition to the
            // template.
            var i,
                prevIndex,
                keyIndex,
                keyLen,
                urlOut = "print('/'",
                c_keyNames = (keyNames) ? keyNames.length : 0;

            prevIndex = 0;
            for (i = 0; i < c_keyNames; i++) {
                keyIndex = url.indexOf('<' + keyNames[i] + '>', prevIndex);
                keyLen = keyNames[i].length + 2;

                urlOut += " + '" + url.substring(prevIndex, keyIndex) + "' + ";
                urlOut += keyDict[keyNames[i]];
                prevIndex = keyIndex + keyLen;
            }
            if (c_keyNames !== 0) {
                urlOut += " + '" + url.substring(prevIndex, prevIndex + keyLen) + "');";
            } else {
                urlOut += " + '" + url + "');";
            }
            return urlOut;
        }
        // Patterns are added using the register method of the parser.
        // register("my-url", "path/<arg1>/to/<arg2>/resource/<arg3>/");
        var URLPatterns = {};
        function register(URLName, URLPattern) {
            URLPatterns[URLName] = URLPattern;
        }
        // Accepts a list of arguments from a {% url %} tag and outputs a print statement that compiles the target URL to a print statement used by mango.js
        function parse(inArgs) {
            var keyNames,
                keyDict,
                urlName,
                url,
                urlArgs = inArgs.slice(0);
            urlName = urlArgs.shift();
            urlName = urlName.replace(/[\"|\']/gi, '');
            url = URLPatterns[urlName];
            if (url !== undefined) {
                keyNames = keyNamesFromUrl(url);
                keyDict = mapUrlArgsToKeyNames(keyNames, urlArgs);
                url = getUrl(url, keyNames, keyDict);
                return url;
            }
            return '';
        }
        return {
            "register": register,
            "parse": parse
        };
    };

    mango.jsVerbatim = function(str) {
        /* Displays a javascript string without escaping any special characters.  */
        var displayEscapes = {
            "\\'":    "\\'",
            '\\"':    '\\"',
            '\\':     '\\\\',
            '\u2028': '\\u2028',
            '\u2029': '\\u2029'
            },
            displayEscaper = /\\'|\\"|\\|\u2028|\u2029/g;
        if (str.constructor === String) {
            str = str.replace(displayEscaper, function(match) {return displayEscapes[match]; });
            return str;
        }
        return str;
    };

    mango.each = mango.forEach = function(obj, iterator, context) {
        if (obj == null) return;
        if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
            obj.forEach(iterator, context);
        } else if (obj.length === +obj.length) {
            for (var i = 0, l = obj.length; i < l; i++) {
                if (iterator.call(context, obj[i], i, obj) === {}) return;
            }
        } else {
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    if (iterator.call(context, obj[key], key, obj) === {}) return;
                }
            }
        }
    };
    mango.isArray = Array.isArray || function(obj) {
        return toString.call(obj) == '[object Array]';
    };
    mango.filters = {
        add: function(str, arg) {
            try {
                return Number(str) + Number(arg);
            } catch (e) {
                return str + arg;
            }
        },
        capfirst: function(str) {
            if (str.constructor === Boolean) {
                str = str.toString();
            }
            if (str.constructor === String) {
                return str[0].toUpperCase() + str.substring(1, str.length);
            }
            return str;
        },
        cut: function(str, arg) {
            return str.replace(arg, '');
        },
        date: function(str, arg){
            return mango.strftime(new Date(str), arg);
        },
        "default": function(str, arg) {
            if (!str) return arg;
            return str;
        },
        default_if_none: function(str, arg) {
            if (str === null) return arg;
            return str;
        },
        divisibleby: function(str, arg) {
            try {
                if (Number(str) % Number(arg) === 0) return true;
            } catch(e){}
            return false;
        },
        first: function(list) {
            return list[0];
        },
        join: function(list, arg) {
            //todo: breaks when pipe is passed...
            return list.join(arg);
        },
        last: function(list) {
            return list[list.length-1];
        },
        length: function(str) {
            return str.length;
        },
        length_is: function(str, arg) {
            return str.length === Number(arg);
        },
        linebreaksbr: function(str) {
            return str.replace(/\n/g, '<br />');
        },
        lower: function(str) {
            if (str.constructor !== String && str.constructor !== Number) {
                str = mango.filters._traverse_obj_and_apply_string_method(str, String.prototype.toLowerCase);
                return str;
            }
            return str.toLowerCase();
        },
        make_list: function(str) {
            return String(str).split('');
        },
        phone2numeric: function(str) {
            var char2number = {'a': '2', 'b': '2', 'c': '2', 'd': '3', 'e': '3', 'f': '3',
                'g': '4', 'h': '4', 'i': '4', 'j': '5', 'k': '5', 'l': '5', 'm': '6',
                'n': '6', 'o': '6', 'p': '7', 'q': '7', 'r': '7', 's': '7', 't': '8',
                'u': '8', 'v': '8', 'w': '9', 'x': '9', 'y': '9', 'z': '9'
            };
            str = mango.filters.make_list(mango.filters.lower(str));
            mango.each(str, function(c, i){
                str[i] = (char2number.hasOwnProperty(c)) ? char2number[c] : c;
            });
            return str.join('');
        },
        pluralize: function(str, arg) {
            var singular = '',
                plural = 's';
            if (arg !== undefined && arg.indexOf(',') !== -1) {
                arg = arg.split(',');
                singular = arg[0].replace(',','');
                plural = arg[1].replace(',','');
            } else if (arg !== undefined) {
                plural = arg;
            }
            if (str === 1) return singular;
            return plural;
        },
        random: function(str) {
            return str[Math.floor(Math.random() * str.length)];
        },
        slice: function(str, arg) {
            /* javascript substr:  start pos, length of substring
             * python substr: start pos, end pos
             */
            arg = arg.split(':');

            //special case.  may be indicative of flawed approach below.
            if (arg[0].length && arg[0] === arg[1])
                return '';

            // cast to 0 if null
            arg[0] = (!arg[0].length) ? 0 : Number(arg[0]);
            arg[1] = (!arg[1].length) ? str.length : Number(arg[1]);

            // convert index if negative
            arg[1] = (arg[1] < 0) ? (str.length) + arg[1] : arg[1];
            arg[1] = arg[1] - arg[0]; //

            return str.substr(arg[0], arg[1]);
        },
        slugify: function(str) {
            var allowed = /[^\w\s-]/g;
            return mango.filters.trim(str).toLowerCase().replace(/\n/g, '').replace(/ +/g, ' ').replace(/ /g, '-').replace(allowed, '');
        },
        trim: function(str) {
            return str.replace(/^\s+|\s+$/g, '');
        },
        title: function(str) {
            str = str.split(' ');
            mango.each(str, function(val, i) {
                try {
                    val = mango.filters.capfirst(val);
                } catch (e) {}
                str[i] = val;
            });
            return str.join(' ');
        },
        upper: function(str) {
            if (str.constructor === Boolean) {
                str = str.toString();
            }
            if (str.constructor !== String && str.constructor !== Number) {
                str = mango.filters._traverse_obj_and_apply_string_method(str, String.prototype.toUpperCase);
                return str;
            }
            return str.toUpperCase();
        },
        urlencode: function(str, arg) {
            str = encodeURIComponent(str);
            arg = (arg === undefined) ? '/' : arg;
            if (arg && arg.length) {
                arg = arg.split("");
                mango.each(arg, function(val){
                    var re = new RegExp(encodeURIComponent(val), 'g');
                    str = str.replace(re, val);
                });
            }
            return str;
        },
        truncatechars: function(str, arg) {
            arg = (str.length >= 3) ? arg - 3 : str.length;
            return str.substr(0, arg) + '...';
        },
        truncatewords: function(str, arg) {
            str = str.replace(/\n/g, '').split(' ');
            str = str.slice(0, arg);
            str = (str.length >= 1) ? str.join(' ') + ' ...' : '...';
            return str;
        },
        escape: function(str) {
            /* Escapes <, >, ', ", and & into HTML character entities. */
            if (str.constructor === String) {
                return str.replace(htmlEscaper, function(match) {return htmlEscapes[match]; });
            } else {
                return str;
            }
        },
        _traverse_obj_and_apply_string_method: function(obj, method) {
            /* Probably a too-specific implementation of map.  Traverses an object and all child objects and
               calls the specified 'method'. */
            mango.each(obj, function(val, iter, parent_obj){
                if (val.constructor !== String && val.constructor !== Number) {
                    mango.filters._traverse_obj_and_apply_string_method(val, method);
                } else if (val.constructor === Number) {
                    //do nothing to numbers
                } else {
                    parent_obj[iter] = method.call(val);
                }
            });
            return obj;
        },
        apply: function(tvar, filters, evaluate_filters) {
            /* Accepts a template variable + chained filters as an argument, splits it out, and applies each filter when methods of this object are present. */

            var i,
                tagMethod,
                tagArgument,
                safe = false,
                filterList = (!evaluate_filters) ? tvar.split('|') : [tvar];

            tvar = filterList.shift();
            filters = (filters === undefined) ? [] : filters.split(',');
            filterList = filterList.concat(filters);

            for (i = 0; i < filterList.length; i ++) {
                tagMethod = mango.filters.trim(filterList[i]).split(/:(.+)/);
                tagArgument = (tagMethod.length > 1) ? tagMethod[1] : undefined;
                tagMethod = tagMethod[0];

                if (mango.filters[tagMethod] !== undefined && tagMethod !== 'safe' && !evaluate_filters) {
                    tvar = 'mango.filters.' + tagMethod + '(' + tvar + ', ' + tagArgument + ')';
                } else if (mango.filters[tagMethod] !== undefined && tagMethod !== 'safe') {
                    tvar = mango.filters[tagMethod](tvar, tagArgument);
                } else if (tagMethod === 'safe') {
                    safe = true;
                }
            }
            if (!safe && !evaluate_filters) {
                tvar = 'mango.filters.escape(' + tvar + ')';
            }
            return tvar;
        },
        _filters: []
    };

    mango.cycle = function(args) {
        /*
         * This function is used by the template to create a {% cycle %} object.
         *
         *
         * Because args is passed in as a comma-separated string, when a filter is used, the comma-separated arguments
         * prevent the simple use of args.split(',');
         * In this case, we search the args string for any string matching "mango.[WILDCARD])," and swap any matches
         * in args out with placeholders.  After the args has been split, the placeholders are replaced with their
         * appropriate filter calls.
         */
        var i,
            args_tmp = [];
        if (args.indexOf('mango.filters') !== -1) {
            var mangoRe = /mango\..+?\),/gi,
                filter_calls = args.match(mangoRe);
            mango.each(filter_calls, function(val, idx) {
                args = args.replace(val, '__filter_idx_' + idx + ',');
            });
            args = args.split(',');
            mango.each(args, function(val, idx) {
                if (val.indexOf('__filter_idx_') !== -1) {
                    val = val.replace('__filter_idx_', '');
                    val = filter_calls[Number(val)];
                    args[idx] = val.substr(0, val.length-1);
                }
            });
        } else {
            args = args.split(',');
        }

        /* indicates assignment to a context var */
        if (args.indexOf('as') !== -1) {
            if (args[args.length-1] === 'silent') {
                this.silent = true;
                args.pop();
            }
            this.ctx_var = args.pop();
            args.pop();
        }
        var index = -1,
            max = args.length - 1;

        this.get_next = function(){
            index = (index === max) ? 0 : index += 1;
            return args[index];
        };
        this.get_current = function(is_tag) {
            if (is_tag && this.silent) {
                return '';
            }
            return args[index];
        };
    };

    mango.is_true = function(val) {
        /*
         * Returns a Pythonic truth value for the given variable.
         * Returns false for empty arrays and dicts, uses JS truth evaluation for all other values.
         */
        var x,
            c = 0;
        if (val.constructor === Array) {
            return (val.length) ? true : false;
        } if (val.constructor === Object) {
            for (x in val) {
                if (val.hasOwnProperty(x)) {
                    c ++;
                }
            }
            return c > 0;
        }
        return (val) ? true : false;
    };

    mango.tags = {
        _for_closing_tags: [],
        _getOutputString: function(val) {
            //Helper abstraction for writing to the DOM from within a template tag.
            "use strict";
            return "\n__p+=''+\n((__t=(" + val + "))==null?'':__t)+\n'';\n";
        },
        comment: function() {
            return "if (false) { \n";
        },
        endcomment: function() {
            return " } \n";
        },
        cycle: function(args) {
            /* pure, unadulterated, insanity.
             * we declare a new instance of mango.cycle and insert it into a dict where
             * the key is equivalent to either the chained arguments for the cycle tag, or the 'as' value.
             * then, we call the cycle object and evaluate its result.
             * */
            var cycle,
                cycle_var = (args.indexOf('as') !== -1) ? (args[args.length-1] === 'silent') ? args[args.length-2] : args[args.length-1] : false,
                cycle_name = cycle_var || args.join(','),
                ret = '';

            /* Instantiating a new mango.cycle object in the template, if one doesn't already exist. */
            ret += 'obj._cycles["' + cycle_name + '"] = obj._cycles["' + cycle_name + '"] || new mango.cycle("' + args + '");\n';
            ret += 'var __cycle = obj._cycles["' + cycle_name + '"]; \n';
            ret += '__cycle.get_next(); \n';

            /* declaring cycle_var if it exists. This is used so that loop-local {{ var }} references have an object to call. */
            if (cycle_name[0] !== '\'' && cycle_name[0] !== '"') {
                ret += ' if (__cycle.ctx_var) { \n';
                ret += '\t var ' + cycle_name + ' = eval(__cycle.get_current()); \n';
                ret += ' } \n';
            }

            /* writing the cycle var to the template */
            ret += mango.tags._getOutputString('eval(__cycle.get_current(true))');
            return ret;
        },
        filter: function (args) {
            /* Wraps the template output in a closure and passes the specified filters in as arguments. */
            args = args[0].split('|');
            mango.filters._filters.push(mango.filters._filters.concat(args));
            return '__p += (function(filters) {\n \tvar __p = ""; \n';
        },
        endfilter: function() {
            var ret = "\n return ((__t=(";
            ret += " mango.filters.apply(__p, filters, true) ";
            ret += " ))==null?'':__t ); \n";
            ret += '})( "' + mango.filters._filters.pop() + '")';
            return ret;

        },
        firstof: function(args) {
            var l = args.length,
                ret = '__p += (function() { \n';
            mango.each(args, function(val, idx){
                val = mango.jsVerbatim(val);
                ret += (idx > 0) ? ' else if ' : '\t if ';
                ret += ' (' + val + ' && mango.is_true(' + val + ')) { \n';
                ret += ' \t\t return ((__t=(' + val + '))==null?"":__t ); \n';
                ret += '\t }';
           });

            ret     += '\n return "" ';
            ret     +=' \n })();';
            return ret;
        },
        "if": function (args) {
            // 1 = 1, 1 = 2...  search for operators and grab the values on either side?
            // better yet:  find and replace and, or, not, etc with: && || !
            var i;
            for (i = 0; i < args.length; i ++) {
                switch(args[i]) {
                    case "and":
                        args[i] = '&&';
                        break;
                    case "or":
                        args[i] = '||';
                        break;
                    case "not":
                        args[i] = '!';
                        break;
                    case "True":
                        args[i] = true;
                        break;
                    case "False":
                        args[i] = false;
                        break;
                }
            }
            return "if (" + args.join(' ') + ") { \n";
        },
        elif: function(args) {
          return "\n } else " + mango.tags['if'](args);
        },
        "else": function() {
            return "\n } else { \n";
        },
        endif: function() {
            return "\n } \n";
        },
        "for": function(args){
            mango.tags._for_closing_tags.push('});');
            /*
              • indexOf "in" denotes the division between loop "arguments" and the loop var "variable".
              • variable.split('.') denotes whether we're looking at an array or a dict.
              • arguments.split(,) denotes the number of assignments which need to be made inside the loop.
              • The assignments made within the loop do *not* need to be unique, since it's assumed that the user will
                respect the global namespace when making loop-local assignments (not sure how Django handles this currently)
              • Check for loop.length prior to loop execution in order to support {% empty %} clause.
            */
            var i,
                ret,
                loopCallsItems = false,
                loopArgs = args.slice(0, args.indexOf('in')),
                loopVar = args.slice(args.indexOf('in') + 1, args.length + 1)[0];

            /* cleaning up the loop args by removing stray commas */
            for (i=0; i < loopArgs.length; i ++) {
                loopArgs[i] = loopArgs[i].replace(',', '');
                if (loopArgs[i] === '') {
                    loopArgs.splice(i, 1);
                }
            }

            function getForLoopString() {
                var ret = '';
                ret += '\t forloop.counter = forloop.__i + 1;\n';
                ret += '\t forloop.counter0 = forloop.__i;\n';
                ret += '\t forloop.revcounter = forloop.__c - forloop.__i;\n';
                ret += '\t forloop.revcounter0 = forloop.__c - forloop.__i - 1;\n';
                ret += '\t forloop.first = (forloop.__i === 0) ? true : false;\n';
                ret += '\t forloop.last = (forloop.__c === forloop.__i + 1) ? true : false;\n';
                ret += '\t forloop.__i += 1;\n';
                return ret;
            }

            loopVar = loopVar.split('.');
            if (loopVar[loopVar.length-1].toLowerCase() === 'items') {
                // Remove 'items' from the variable when found, since it's not a valid attribute in python.
                loopVar.pop();
                loopCallsItems = true;
            }
            loopVar = loopVar.join('.');

            // Getting the length of the object in order to populate loopvars object.
            ret = "\n\t\t var __c=0; \n" +
                    "\t\t if (!mango.isArray(" + loopVar + ")) { \n" +
                    "\t\t\t mango.each(" + loopVar + ", function(__th, i, __obj){ \n if ("+loopVar+".hasOwnProperty(i)) {__c++;}}); \n" +
                    "\t\t} else { \n" +
                    "\t\t\t __c = " + loopVar + ".length; \n" +
                    "\t\t } \n";

            // Populating the loopvars object with the starting iterator index and the loop length.
            ret +=  "\t\t forloop.__i=0; forloop.__c = __c; \n";

            // If the array or object is populated, starting the loop.
            ret +=  "\t\t if (forloop.__c > 0) { \n ";
            ret +=  "\t\t\t mango.each(" + loopVar + ", function(__th, i, __obj) { \n";

            ret +=  "\t\t\t\t if (!mango.isArray(" + loopVar + ")) { \n";
                // variable assignments for Dicts.  Assignment differs on the basis of whether dict.items was accessed.
                if (loopArgs.length == 1 && loopCallsItems) {
                    ret += "\t\t\t\t\t var " + loopArgs[0] + " = '(' + i + ' : ' + __th + ')'; \n";
                } else if (loopArgs.length == 1) {
                    ret += "\t\t\t\t\t var " + loopArgs[0] + " = i; \n";
                } else {
                    ret +=  "\t\t\t\t\t var " + loopArgs[0] + " = i; \n" +
                            "\t\t\t\t\t var " + loopArgs[1] + " = __th; \n";
                }
            ret += "\t\t\t\t } else { \n";
                // Variable assignments for Lists.  Python supports chained assignments that correspond to the list length.
                for (i=0; i < loopArgs.length; i ++) {
                    ret += "\t\t\t\t\t if (typeof(" + loopVar + "[" + i + "]) == 'object') { \n";
                        ret += "\t\t\t\t\t\t var " + loopArgs[i] + " = " + loopVar + "[i][" + i + "]; \n";
                        ret += "\t\t\t\t\t } else { \n";
                        ret += "\t\t\t\t\t\t var " + loopArgs[i] + " = " + loopVar + "[i]; \n";
                        ret += "\t\t\t\t\t } \n";
                    }
            ret += "\t\t\t\t } \n";
            ret +=  getForLoopString();

            return ret;
        },
        endfor: function() {
            var tag = mango.tags._for_closing_tags.pop();
            if (tag !== "}") return tag + "}";
            return tag;
        },
        empty: function() {
            // Every loop is wrapped in an IF condition
            // When {% empty %} is present, an ELSE condition is populated and the mango.tags._empty_depth object
            // is incremented to indicate that an additional closing brace for the FOR loop is not required.
            var tag = mango.tags._for_closing_tags.pop();
            mango.tags._for_closing_tags.push('}');
            return "\n " + tag + " } else { \n";
        },
        now: function(args) {
            "use strict";
            return mango.tags._getOutputString('mango.strftime(new Date(), ' + args[0] + ')');
        },
        url: function(args) {
            return mango.URLConf.parse(args);
        },
        apply_filters: function(args) {
            /* Runs through list of template filters and applies filters when | is found. */
            var i,
                l = args.length;
            for (i = 0; i < l; i ++) {
                if (args[i].split('|').length > 1) {
                    args[i] = mango.filters.apply(args[i]);
                }
            }
            return args;
        },
        apply: function(tagStatement) {
            /* accepts a template tag, normalizes it, and executes the method of mango.tags for the specified filter. */

            var tag,
                args,
                smart_split_re = new RegExp(/((?:[^\s'"]*(?:(?:"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')[^\s'"]*)+)|\S+)/gi);

            tagStatement = mango.filters.trim(tagStatement);
            tagStatement = tagStatement.match(smart_split_re);

            tag = tagStatement.shift();
            args = tagStatement;

            if (tag === 'if' || tag === 'elif') {
                mango.each(args, function(val, idx, obj) {
                    if (val.match(/[>=|<=]/gi)) {
                        obj[idx] = val.replace('>=', ' >= ').replace('<=', ' <= ');
                    } else {
                        obj[idx] = val.replace('>', ' > ').replace('<', ' < ')
                            .replace('==', ' == ').replace('!=', ' != ');
                    }
                });
            }

            if (tag !== 'filter') {
                args = mango.tags.apply_filters(args);
            }

            if (mango.tags[tag] !== undefined) {
                return mango.tags[tag](args);
            } else {
                return '';
            }

        }
    };
    
    mango.templateSettings = {
        comment: /{#([\s\S]+?)#}/g,
        tag: /{%([\s\S]+?)%}/g,
        tvar: /{{([\s\S]+?)}}/g
    };
    mango.compile = function(text, data, settings) {
        if (settings === undefined) {
            settings = mango.templateSettings;
        }

        // Combine delimiters into one regular expression via alternation.
        var matcher = new RegExp([
            (settings.tvar || noMatch).source,
            (settings.tag || noMatch).source,
            (settings.comment || noMatch).source
        ].join('|') + '|$', 'g');

        // compiling the template source
        var index = 0;
        var source = "__p+='";

        source += "';\n var forloop = {parentloop: {}, __i: 0}, False = false,\n\t True = true,\n\tNone = ''; \n__p+='";
        source += "';\n" + 'obj._cycles = {};' + "\n__p+='"; /* gross! */

        text.replace(matcher, function(match, tvar, tag, comment, offset) {
            "use strict";
            //splitting source into an array at
            source += text.slice(index, offset)
                .replace(escaper, function(match) {return '\\' + escapes[match]; });

            if (tvar) {
                tvar = mango.filters.apply(tvar);
                source += "'+\n((__t=(" + tvar + "))==null?'':__t)+\n'";
            }
            if (tag) {
                tag = mango.tags.apply(tag);
                source += "';\n" + tag + "\n__p+='";
            }
            if (comment) {
                /* this is an easy one.  do nothing. */
            }
            index = offset + match.length;
            return match;
        });
        source += "';\n";

        // If a variable is not specified, place data values in local scope.
        if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

        source = "var __t,__p='',__j=Array.prototype.join," +
            "print=function(){__p+=__j.call(arguments,'');};\n" +
            source + "return __p;\n";

        try {
            var render = new Function(undefined || 'obj', 'mango', source);
        } catch (e) {
            e.source = source;
            throw e;
        }

        if (data) return render(data, mango);
        
        var template = function(data) {
            data = data || {};
            return render.call(this, data, mango);
        };

        // Provide the compiled function source as a convenience for precompilation.
        template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

        return template;

    };
}).call(window);
//}).call(this);
