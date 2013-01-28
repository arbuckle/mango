mango.js
=====
DRY client-side templates for Django.
-------------------------------------

**Problem**:    When writing a thick-client application, templates must be duplicated in a client-side template language
in order to avoid the first-load tradeoff.

**Solution**:   mango.js.  Client-side rendering for Django templates.

* Mango.js compiles *verbatim Django templates* to a callable Javascript functions.
* Mango.js renders the *exact same output* as Django templates when provided a JSON representation of the page context.
* Mango.js supports (most of) Django's builtin template tags and filters.
* Mango.js can be easily updated to support custom tags and filters.
* Mango.js ignores missing tags and filters, so pre-processed input context does not result in errors.

**Development is not yet complete**
TODOs:
- {% ifchanged %}
- {% ifequal %}
- {% ifnotequal %}
- {% include %} (*crazy!*)
- {% now %}
- {% spaceless %}
- {% url %}
- {% verbatim %}
- Date filters.
- Fix linebreaksbr and linebreaks
- Maybe refactor the whole thing, since it's extremely difficult to debug



Usage.
---------------
1. Update your views to return the context in JSON format:
    ```
    context.update({"page_context": json.dumps(context)})
    ```

2. Expose a verbatim version of your template to the DOM using the {% ssi %} tag:
    ```
    <script type="text/template" id="MyClientSideTemplate">
        {% ssi "/home/html/application/templates/my_template.html" %}
    </script>
    ```

3.  Create a mango template object and grab the context variable:
    ```
    var templateSource = document.getElementById('MyClientSideTemplate').innerHTML,
        myTemplate = mango.template(templateSource);

    var page_context = JSON.parse("{{ page_context|escapejs }}");
    ```
4.  Render your template and append it to the DOM:
    ```
    var renderedTemplate = myTemplate(page_context);
    document.querySelector('body').innnerHTML = renderedTemplate;
    ```

Caveats.
--------
* Client-side templating requires diligent preparation of the page context in order to work reliably.  If you're counting
on Django's ability to follow foreign-key relations in the template, data will be missing and *your template will fail
to render as expected*.  So code like this will not work in a mango template:
```
{# Follow the author relation and get the avatar from the user's profile #}
{{ post.author.profile.avatar }}
```
Unless you explicitly populate the desired relations in your view, first.  As a general rule, following relations using
the template language is an anti-pattern, since it can add hundreds of blocking queries to Django's rendering operation.
The Django Debug Toolbar is handy for inspecting a template's query load in order to optimize the preparation of data.

* In addition to this, Javascript templates cannot be relied upon to render lists or dicts to strings in the same way that
Python does.  If you want your templates to expose raw data structures as HTML, you will need to overload the toString
method for both Array and Object in order to display this data correctly.
```
Array.prototype.toString = function() {
    var ret = '[';
    for (var i = 0; i < this.length; i ++) {
        ret += (this[i].constructor === String) ? '\'' + this[i] + '\'' : this[i];
        ret += ', ';
    }
    ret = ret.substr(0, ret.length - 2);
    ret += ']';
    return ret;
};
Object.prototype.toString = function() {
    var key,
        ret = '{';
    for (key in this) {
        ret += '\'' + key + '\': ';
        ret += (this[key].constructor === String) ? '\'' + this[key] + '\'' : this[key];
        ret += ', ';
    }
    ret = ret.substr(0, ret.length - 2);
    ret += '}';
    return ret;
};
```

* Exposing the unaltered page context using `json.dumps` is a shortcut that will not be practical for most use cases,
and in some cases may negatively impact the security of your application.  In addition, certain features such as i18n,
timezones,

* Use of `this` and other Javascript reserved words should be avoided.


Authoring Custom Tags and Filters.
---------------------------------
mango.js tags and filters are namespaced in mango.tags and mango.filters respectively.  To add your own, add a method
to the appropriate object.  Method names _must_ be lower case.
```
mango.tags.customtag = function(args){'...'};
mango.filters.customtfilter = function(val, arg){'...'};
```

Filters are chainable, and are called when data is passed into the rendered template.  They accept two arguments:
The value that will be transformed by the filter, and arguments passed into the filter.
As an example, here is a filter to transform phone number digits into hyphenated strings:
```
{{ user_phone.phonePrettify|'us' }}

mango.filters.phonePrettify = function(val, locale) {
    // takes a 10-digit US or 11-digit UK phone number and gussies it up for display.  Locale must be explicit.
    var output = String(val).split('');
    if (locale.toLowerCase() === 'us' && output.length === 10) {
        //(555)555-5555
        output = '(' + output.substr(0,3) + ')' + output.substr(3,3) + '-' + output.substr(6,4);
    } else if (locale.toLowerCase() === 'uk' && output.length === 11) {
        //(55555) 555555
        output = '(' + output.substr(0,5) + ') ' + output.substr(5,6);
    }
    return output;
}
```

Tags are different from filters, in that the output returned by the tag will be evaluated as Javascript code.  To give
an example, here are the wrong and right ways to write a standalone "concat" tag:
```
{% wrongConcat var1 'val2' var3 %}

mango.tags.wrongconcat = function(args) {
    return args.join('');
}

> var1'val2'var3
```

Since the return value from a template tag is written into the rendering function verbatim, it must be valid Javascript.
This approach results in a SyntaxError.

To get around that, it helps to know what's going on under the hood.  The template engine's output HTML is controlled
by a string which is locally defined as "p" within the rendering function.  Variables in the template are appended to
this string so that when the template is rendered, the values are evaluated and written in the output HTML.

So mango.tag contains a helper method, _getOutputString(val), which populates the output string to render any value that
is passed to it.
```
{% rightConcat var1 'val2' var3 %}

 mango.tags.rightconcat: function(args) {
    var ret = '';
    mango.each(args, function(val, index) {
        "use strict";
        ret += mango.tags._getOutputString(val);
    });
    return ret;
}
```
