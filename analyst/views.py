from django.shortcuts import render
from django.views import generic
from .forms import RegistrationForm
from django.urls import reverse_lazy
from django.contrib.auth.models import User

from .models import Analyst


# Create your views here.
def index(request):
    return render(request, 'index.html', {})


class UserRegistrationView(generic.CreateView):
    form_class = RegistrationForm
    template_name = 'registration/registration.html'
    success_url = reverse_lazy('login')

