from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf.urls import patterns, url
from tests.home.views import Home

urlpatterns = patterns('',
    url(r'^$', Home.as_view(), name='home'),
    url(r'^mango-templates/$', Home.as_view(template_name="tests/home/templates/mango_templates.html"), name='mango-templates'),

    # test pattern
    url(r'^(?P<id_forum>\d+)/(?P<forum_slug>[-\w]+)/(?P<id_topic>\d+)/(?P<topic_slug>[-\w]+)/$', Home.as_view(template_name="tests/home/templates/mango_templates.html"), {}, "topic-view"),

)
urlpatterns += staticfiles_urlpatterns()
