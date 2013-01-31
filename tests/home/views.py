from json import dumps
import os
import datetime
from django.views.generic.base import TemplateView

class Home(TemplateView):
    """
    Basic empty view
    """
    template_name = 'tests/home/templates/home.html'

    def get_includes(self, path_type):
        include_path = 'c:/users/david/documents/python/mango/tests/home/templates/tests'
        all_includes = []
        includes = []
        for root, dirs, all_includes in os.walk(include_path):
            pass

        for include in all_includes:
            if path_type == 'relative':
                includes.append({
                    "path":'tests/home/templates/tests/' + include,
                    "name": include.replace('.html', '')
                })

            elif path_type == 'absolute':
                includes.append({
                    "path":'c:/users/david/documents/python/mango/tests/home/templates/tests/' + include,
                    "name": include.replace('.html', '')
                })
        includes.reverse()
        return includes


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
            'includes': self.get_includes('relative'),
            'ssis': self.get_includes('absolute'),
            'plans': plans,
            'birthday': datetime.datetime(2012, 03, 11, 16, 44, 22),
            'plans_empty': empties,
            'dict': {"Key1": "Value1", 2: "Value2"},
            'numerator': 10,
            'denominator': 100,
            'fraction': 10/100.0,
            'fruits': ['Apple', 'Banana', 'mango'],
            'basic_list': [1,2],
            'longer_list': [x for x in xrange(0,3)],
            'empty_list': [],
            'empty_dict': {},
            'false_dict': {'one': True},
            'groceries': [['apple', 4], ['banana', 6], ['mango', 2]],
            'script_injection': '<script>console.log(\'Script injected\')</script>',
            'script_injection_with_breaks': '<script>\n\tconsole.log(\'Script injected\')\n</script>',
            'phrase': "Welcome to the Jungle.  The Jungle.",
            'phrase_with_breaks': "Welcome to the Jungle.\n\nThe\nJungle.",
            'name': 'david',
            'oth_name': 'anthony',
            'is_cool': False,
            'has_coin': None,
            'newline': '\n',
            'num_cherries': 2,
            'num_cherries_1': 1,
            'num_walruses': 3,
            'url': 'http://www.example.com/',
        }

        dthandler = lambda obj: obj.isoformat() if isinstance(obj, datetime.datetime) else None #http://stackoverflow.com/questions/455580/json-datetime-between-python-and-javascript
        context.update({"page_context": dumps(context, default=dthandler)})
        return context
