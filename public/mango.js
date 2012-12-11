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
            if (typeof(str) !== "string") return str;
            return str[0].toUpperCase() + str.substring(1, str.length);
        },
        cut: function(str, arg) {
            return str.replace(arg, '');
        },
        date: function(str, arg){
            /* TODO:  find a library to accomplish this. */
            return str;
        },
        default: function(str, arg) {
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
            if (str.length === Number(arg)) return true;
            return false;
        },
        linebreaksbr: function(str) {
            return str.replace(/\n/g, '<br />');
        },
        lower: function(str) {
            if (typeof(str) !== "string" && typeof(str) !== "number") {
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
            return str.toLowerCase().replace(/ +/g, ' ').replace(/ /g, '-').replace(allowed, '');
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
            if (typeof(str) !== "string" && typeof(str) !== "number") {
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
            if (typeof(str) === "string") {
                return str.replace(htmlEscaper, function(match) {return htmlEscapes[match]; });
            } else {
                return str;
            }
        },
        _traverse_obj_and_apply_string_method: function(obj, method) {
            /* Probably a too-specific implementation of map.  Traverses an object and all child objects and
               calls the specified 'method'. */
            mango.each(obj, function(val, iter, parent_obj){
                if (typeof(val) !== "string" && typeof(val) !== "number") {
                    mango.filters._traverse_obj_and_apply_string_method(val, method);
                } else if (typeof(val) === "number" ) {
                    //do nothing to numbers
                } else {
                    parent_obj[iter] = method.call(val);
                }
            });
            return obj;
        },
        apply: function(tvar) {
            /* Accepts a template variable + chained filters as an argument, splits it out, and applies each filter when methods of this object are present. */
            var i,
                tagMethod,
                tagArgument,
                safe = false,
                filterList = tvar.split('|');
            tvar = filterList[0];

            for (i = 1; i < filterList.length; i ++) {
                tagMethod = mango.filters.trim(filterList[i]).split(/:(.+)/);
                tagArgument = (tagMethod.length > 1) ? tagMethod[1] : undefined;
                tagMethod = tagMethod[0];

                if (mango.filters[tagMethod] !== undefined && tagMethod !== 'safe') {
                    tvar = 'mango.filters.' + tagMethod + '(' + tvar + ', ' + tagArgument + ')';
                } else if (tagMethod === 'safe') {
                    safe = true;
                }
            }
            if (!safe) {
                tvar = 'mango.filters.escape(' + tvar + ')';
            }
            return tvar;
        }
    };

	mango.tags = {
        _for_closing_tags: [],
        comment: function() {
            return "if (false) { \n";
        },
        endcomment: function() {
            return " } \n";
        },
        cycle: function(args) {
            console.log(args);
        },
        if: function(args) {
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
          return "\n } else " + mango.tags.if(args);
        },
        else: function() {
            return "\n } else { \n";
        },
        endif: function() {
            return "\n } \n";
        },
        for: function(args){
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
            // pad out conditional statements, remove redundant white space and split
            tagStatement = tagStatement.replace('>', ' > ').replace('<', ' < ')
                    .replace('>=', ' >= ').replace('<=', ' <= ')
                    .replace('==', ' == ').replace('!=', ' != ');
            tagStatement = mango.filters.trim(tagStatement);
            tagStatement = tagStatement.replace(/ +/gi, ' ').split(' ');

            var tag = tagStatement.shift(),
                args = tagStatement;
            args = mango.tags.apply_filters(args); //TODO:  this may be inappropriate for certain tags

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
        source += "';\n var i; \n__p+='"; /* declare i for loops */
        source += "';\n var c; \n__p+='"; /* declare c for dict counters */

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
            //console.log(source);
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

    }
}).call(this);
