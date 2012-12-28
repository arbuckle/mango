mango.js
=====
DRY client-side templates for Django.
-------------------------------------

**This project is somewhat incomplete.**

Mango.js is (intended to be):
- A Javascript rendering engine that translates your existing Django templates into callable Javascript objects.
- Feature-complete, with out-of-the-box support for all of Django's flow-control and conditional syntax.
- Easily extendable, so that implementing custom tags and filters is a painless process.

When you render a view's context to a JSON object, and pass that object to a mango.js template, you get the exact same
result as you would had you passed that context to a Django template.

Mango.js eliminates the need to learn the hot new client-side template language of the day (sorry!), as well as
the need to author and maintain multiple distinct branches of front-end code.  Write yours templates one time, and use
them everywhere.

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
        // to render data as HTML...
        document.getElementById('body').innerHTML += myTemplate(data);
    </script>


TODOS:
------
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


A Brief Discussion With Myself:
-------------------------------
- An alternative would be rendering Javascript from Python.  Problem is, current Python -> JS translators tend to be
  very, very limited in their ability to handle complex data structuress such as Class Inheritance and Generators, both
  of which are in use in Django's backent code.
- Rendering Javascript from Python would likely also result in a large, recursive exploration over large portions of the
  Django codebase, all of which would have to be sent over the wire to the client.

- The Django template language isn't Python, however.  It's a purposefully simplified subset of the Python language,
  which follows simple rules with very few exceptions.  Supporting this language in Javascript is a relatively simple
  task of properly evaluating the 60-or-so filters and tags that are implemented in Python.
- By writing the bulk of the code in Javascript, custom tags and filters need to be written twice: once for Python, and
  once for JS.  This is kind of a caveat, but tags and filters are very much a write-once-and-never-change type of code,
  while templates are more likely to be in a constant state of flux.

- From a maintenance standpoint, Python -> JS and JS-from-python aren't very much different.  The resulting rendered
  functions are going to be very difficult to debug no matter which approach is used.
