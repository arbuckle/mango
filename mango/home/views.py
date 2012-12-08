from json import dumps
from django.views.generic.base import TemplateView

class Home(TemplateView):
    """
    Basic empty view
    """
    template_name = 'mango/home/templates/home.html'


    def get_context_data(self, **kwargs):
        plans = {
            "basic": "This is a basic plan",
            "premium": "This is a premium plan",
            "professional": ["This is a professional plan.", "It is a two parter."]
        }

        context = {
            'plans': plans,
            'numerator': 10,
            'denominator': 100,
            'fraction': 10/100.0,
            'script_injection': '<script>console.log(\'Script injected\')</script>',
            'phrase': "Welcome to the Jungle.  The Jungle."
        }
        context.update({"json": dumps(context)})
        return context
