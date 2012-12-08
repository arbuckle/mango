from django.template.base import Node, TemplateSyntaxError
from django import template

register = template.Library()

class InsecureTemplateNode(Node):
    def __init__(self, filepath):
        self.filepath = filepath

    def render(self, context):
        filepath = self.filepath.resolve(context)
        try:
            with open(filepath, 'r') as fp:
                output = fp.read()
        except IOError:
            output = ''
        return output

@register.tag
def include_verbatim(parser, token):
    bits = token.split_contents()
    if len(bits) <> 2:
        raise TemplateSyntaxError("'include_verbatim' tag takes one argument: the path to"
                                  " the file to be included")
    filepath = parser.compile_filter(bits[1])
    return InsecureTemplateNode(filepath)
