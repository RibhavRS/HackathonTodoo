from django.urls import path
from .views import *
from .views import MyTokenObtainPairView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('register/', register_view, name='register'),
    path('login/', login_view, name='login'),
    path('getRoutes/', getRoutes, name='allroutes'),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('lists/', list_view, name='lists'),
    path('lists/<id>', lists_id_view, name='lists'),
    path('user/', get_user_token, name='token')
]