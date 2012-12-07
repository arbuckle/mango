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
			/* Truncates a string to the specified length, and appends an ellipsis */
			arg = (str.length >= 3) ? arg - 3 : str.length;
			return str.substr(0, arg) + '...';
		},
		apply: function(tagList) {
			var i,
				tagMethod,
				tagArgument,
				tvar = tagList[0];
				
			for (i = 1; i < tagList.length; i ++) {
				tagMethod = mango.filters.trim(tagList[i]).split(':');
				tagArgument = (tagMethod.length > 1) ? tagMethod[1] : undefined;
				tagMethod = tagMethod[0];
				
				if (mango.filters[tagMethod] !== undefined) {
					tvar = 'mango.filters.' + tagMethod + '(' + tvar + ', ' + tagArgument + ')';
				} else {
					tvar = tvar;
				}
			}
			return tvar;
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
        var source = "__p+='"; //it's unclear what this does

        text.replace(matcher, function(match, tvar, tag, comment, offset) {
            "use strict";
            //splitting source into an array at
            source += text.slice(index, offset)
                .replace(escaper, function(match) {return '\\' + escapes[match]; });

            if (tvar) {
                console.log('template var', tvar);
                tvar = mango.filters.apply(tvar.split('|'));
		        source += "'+\n((__t=(" + tvar + "))==null?'':__t)+\n'";
            }
            if (tag) {
                console.log('template tag', tag);
		        //source += "';\n" + tag + "\n__p+='";
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
