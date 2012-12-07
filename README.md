mango
=====

DRY client-side templates for Django.

This is a project to determine the feasibility of creating a client-side template rendering engine
in Javascript, which uses the same syntax as Django templates in order to eliminate
the HTML duplication that is seemingly required by modern thick-client applications.

Basically,
- A Javascript rendering engine to convert Django templates into callable Javascript objects.
- Out-of-the-box support for all of Django's flow-control and conditional syntax.
- Easily extendable so that template tags can be implemented in Javascript, though the 
expectation is that JSON payloads will use server-side template tags to prepare data.
- A template filter similar to {% verbatim %}, which does parse {% include %} filters.
