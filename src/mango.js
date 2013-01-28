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
        "<":	"&lt;",
        ">":	"&gt;",
        "'":	"&#39;",
        "\"":	"&quot;",
        "&":	"&amp;"
    };
    var htmlEscaper = /\'|\"|>|<|&/g;
    var noMatch = /(.)^/;

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
            /* TODO:  find a library to accomplish this. */
            return str;
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
                varType,
                loopArgs = args.slice(0, args.indexOf('in')),
                loopVar = args.slice(args.indexOf('in') + 1, args.length + 1)[0];

            /* cleaning up the loop args by removing stray commas */
            for (i=0; i < loopArgs.length; i ++) {
                loopArgs[i] = loopArgs[i].replace(',', '');
                if (loopArgs[i] === '') {
                    loopArgs.splice(i, 1);
                }
            }

            loopVar = loopVar.split('.');
            if (loopVar.length > 1 && loopVar[1].toLowerCase() === 'items') {
                /* it's a dict! Checking length for {% empty %} and opening loop. */
                loopVar = loopVar[0];
                ret = "c=0; \n mango.each(" + loopVar + ", function(__th, i){ \n if ("+loopVar+".hasOwnProperty(i)) {c++;}}); \n";
                ret += "if (c > 0) { \n ";
                ret += "mango.each(" + loopVar + ", function(" + loopArgs[1] + ", " + loopArgs[0] + "){ \n ";
            } else {
                loopVar = loopVar[0];
                /* it's an array! Checking length for {% empty %} and opening loop. */
                ret = "if (" + loopVar + ".length) { \n ";
                ret += "mango.each(" + loopVar + ", function(__th, i){ \n";
                for (i=0; i < loopArgs.length; i ++) {
                    ret += "if (typeof(" + loopVar + "[" + i + "]) == 'object') { \n";
                    ret += "var " + loopArgs[i] + " = " + loopVar + "[i][" + i + "]; \n";
                    ret += "} else { \n";
                    ret += "var " + loopArgs[i] + " = " + loopVar + "[i]; \n";
                    ret += "} \n";
                }
            }
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
                    obj[idx] = val.replace('>', ' > ').replace('<', ' < ')
                        .replace('>=', ' >= ').replace('<=', ' <= ')
                        .replace('==', ' == ').replace('!=', ' != ');
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
    mango.template = function(text, data, settings) {
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

        source += "';\n var False = false,\n\t True = true; \n__p+='"; /* gross! */
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
			return render.call(this, data, mango);
		};

		// Provide the compiled function source as a convenience for precompilation.
		template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

		return template;

    };
}).call(window);
//}).call(this);
