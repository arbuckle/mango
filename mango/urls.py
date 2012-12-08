from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf.urls import patterns, url
from mango.home.views import Home

urlpatterns = patterns('',
    url(r'^$', Home.as_view(), name='home'),
)
urlpatterns += staticfiles_urlpatterns()
