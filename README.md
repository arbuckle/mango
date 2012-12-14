mango.js
=====
DRY client-side templates for Django.
-------------------------------------

**This project is very much incomplete.**

Mango.js is (intended to be):
- A Javascript rendering engine that compiles your existing Django templates into callable Javascript objects.
- Feature-complete, with out-of-the-box support for all of Django's flow-control and conditional syntax.
- Easily extendable, so that implementing custom tags and filters is a painless process.

When you render a view's context to a JSON object, and pass that object to a mango.js template, you get the exact same
result as you would had you passed that context to a Django template.
Not only does mango.js eliminate the need to learn the hot new client-side template language of the day (sorry!), but
it also eliminates the need to author and maintain multiple distinct branches of front-end code.


Usage is simple.
---------------
*In your app:*
    implement a template tag that includes a template without rendering its contents

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


TODOS:
-{% filter %}
-{% firstof %}
-{% ifchanged %}
-{% ifequal %}
-{% ifnotequal %}
-{% now %}
-{% spaceless %}
-{% url %}
-{% verbatim %}
-Date filters.
-Better include_verbatim tag.
-Docstring comments that are basically links to Django's documentation
-Use it in something bigger than a toy project
