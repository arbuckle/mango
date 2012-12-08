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
	htmlEscapes = {
		"<":	"&lt;",
		">":	"&gt;",
		"'":	"&#39;",
		"\"":	"&quot;",
		"&":	"&amp;"
	}
	var htmlEscaper = /\'|\"|>|<|&/g;
	var noMatch = /(.)^/;


	mango.filters = {
		trim: function(str) {
			/* Removes white space on either side of a string. */
			return (str !== undefined) ? str.replace(/^\s+|\s+$/g, ''): str;
		},
		upper: function(str) {
			/* Converts a string to uppercase */
			return str.toUpperCase();
		},
		truncatechars: function(str, arg) {
			/* Truncates a string to the specified length, and appends an ellipsis. */
			arg = (str.length >= 3) ? arg - 3 : str.length;
			return str.substr(0, arg) + '...';
		},
		escape: function(str) {
			/* Escapes <, >, ', ", and & into HTML character entities. */
			if (typeof(str) === "string") {
				return str.replace(htmlEscaper, function(match) {return htmlEscapes[match]; });
			} else {
				return str;
			}
		},
        length: function(str) {
            return str.length;
        },
		apply: function(tvar) {
			/* Accepts a template variable + chained filters as an argument, splits it out, and applies each filter when methods of this object are present. */
			var i,
				tagMethod,
				tagArgument,
				safe = false,
				filterList = tvar.split('|'),
				tvar = filterList[0];
				
			for (i = 1; i < filterList.length; i ++) {
				tagMethod = mango.filters.trim(filterList[i]).split(':');
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
	}

	mango.tags = {
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
	}
	
    mango.templateSettings = {
        comment: /{#([\s\S]+?)#}/g,
        tag: /{%([\s\S]+?)%}/g,
        tvar: /{{([\s\S]+?)}}/g
    }
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

        text.replace(matcher, function(match, tvar, tag, comment, offset) {
            "use strict";
            //splitting source into an array at
            source += text.slice(index, offset)
                .replace(escaper, function(match) {return '\\' + escapes[match]; });

            if (tvar) {
                console.log('template var', tvar);
				tvar = mango.filters.apply(tvar);
				source += "'+\n((__t=(" + tvar + "))==null?'':__t)+\n'";
            }
            if (tag) {
                console.log('template tag', tag);
                tag = mango.tags.apply(tag);
		        source += "';\n" + tag + "\n__p+='";
            }
            if (comment) {
                console.log('template comment', comment);
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

    }
}).call(this);
