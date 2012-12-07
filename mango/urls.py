from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf.urls import patterns, include, url
from home.views import Home

urlpatterns = patterns('',
    url(r'^$', Home.as_view(), name='home'),
)
urlpatterns += staticfiles_urlpatterns()
