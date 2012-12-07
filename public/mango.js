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


    mango.templateSettings = {
        variable: /{#([\s\S]+?)#}/g,
        filter: /{%([\s\S]+?)%}/g,
        comment: /{{([\s\S]+?)}}/g
    }

    mango.template = function(text, data, settings) {
        if (settings === undefined) {
            settings = mango.templateSettings;
        }

        // Combine delimiters into one regular expression via alternation.
        var matcher = new RegExp([
            (settings.variable || noMatch).source,
            (settings.filter || noMatch).source,
            (settings.comment || noMatch).source
        ].join('|') + '|$', 'g');

        // compiling the template source
        var index = 0;
        var source = "__p+='"; //it's unclear what this does

        text.replace(matcher, function(match, variable, filter, comment, offset) {
            "use strict";
            //splitting source into an array at
            source += text.slice(index, offset)
                .replace(escaper, function(match) {return '\\' + escapes[match]; });

            if (variable) {
                console.log('template var', variable);
            }
            if (filter) {
                console.log('template filter', filter);
            }
            if (comment) {
                console.log('template comment', comment);
            }
            index = offset + match.length;
            return match;
        });
        source += "';\n";
    }
}).call(this);
