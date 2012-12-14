mango.js
=====

DRY client-side templates for Django.

Mango.js uses your existing Django templates and compiles them into functional Javascript templates.

When you render a view's context to a JSON object, and pass that object to a mango.js template, you get the exact same
result as you would had you passed that context to a Django template.  Not only does mango.js eliminate the need to
learn the hot new client-side template language of the day (sorry!), but it also eliminates the need to author and
maintain multiple distinct branches of front-end code.

**This library is very much incomplete.**

Usage is simple.
---------------
*In your views:*

    context.update({"json": dumps(context)})

*In your template:*

    <script src="mango.js"></script>
    <script type="text/template" id="MyClientSideTemplate">
        {% include_verbatim "templates/my_template.html" %}
    </script>
    <script>
        var myTemplate = document.getElementById('MyClientSideTemplate').innerHTML;
        myTemplate = mango.template(templateInclude);
        document.getElementById('body').innerHTML += myTemplate(data);
    </script>



Basically,
- A Javascript rendering engine to convert Django templates into callable Javascript objects.
- Out-of-the-box support for all of Django's flow-control and conditional syntax.
- Easily extendable so that template tags can be implemented in Javascript, though the 
expectation is that JSON payloads will use server-side template tags to prepare data.
- A template filter similar to {% verbatim %}, which does parse {% include %} filters.


TODOS:
{% filter %}
{% firstof %}
{% ifchanged %}
{% ifequal %}
{% ifnotequal %}
{% now %}
{% spaceless %}
{% url %}
{% verbatim %}
Date filters.
Better include_verbatim tag.
Docstring comments that are basically links to Django's documentation
Use it in something bigger than a toy project
