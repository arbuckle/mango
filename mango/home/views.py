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
        empties = {
            "basic": "This is a basic plan",
            "premium": {},
            "professional": []
        }

        context = {
            'plans': plans,
            'plans_empty': empties,
            'dict': {"Key1": "Value1", 2: "Value2"},
            'numerator': 10,
            'denominator': 100,
            'fraction': 10/100.0,
            'fruits': ['Apple', 'Banana', 'mango'],
            'basic_list': [1,2],
            'longer_list': [x for x in xrange(0,3)],
            'empty_list': [],
            'groceries': [['apple', 4], ['banana', 6], ['mango', 2]],
            'script_injection': '<script>console.log(\'Script injected\')</script>',
            'script_injection_with_breaks': '<script>\n\tconsole.log(\'Script injected\')\n</script>',
            'phrase': "Welcome to the Jungle.  The Jungle.",
            'phrase_with_breaks': "Welcome to the Jungle.\n\nThe\nJungle.",
            'name': 'david',
            'oth_name': 'anthony',
            'is_cool': False,
            'has_coin': None,
            'num_cherries': 2,
            'num_cherries_1': 1,
            'num_walruses': 3,
            'url': 'http://www.example.com/',
        }
        context.update({"json": dumps(context)})
        return context
