from django.urls import path
from .views import *
from .views import MyTokenObtainPairView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('register/', register_view, name='register'),  # checked
    path('login/', login_view, name='login'),       # checked
    path('logout/', logout_view, name='logout'),

    
    # path('token/', TokenObtainPairView.as_view(), name ="token_obtain_pair"),
    path('token/refresh/', TokenRefreshView.as_view(), name="token_refresh"),
    
    path('user/', user, name='user'),

    path('getRoutes/', getRoutes, name='allroutes'),
     
    path('lists/', list_view, name='lists'),        #checked
    path('lists/<lst_id>', lists_id_view, name='lists_id'),      # checked
    path('lists/<lst_id>/tasks', tasks_view , name='tasks'),
    path('lists/<lst_id>/task/<tsk_id>',task_id_view , name='tasks_id'),
    
    path('lists/<lst_id>/task/<tsk_id>/subtasks',subtasks_view , name='subtasks'),
    path('lists/<lst_id>/task/<tsk_id>/subtask/<subtsk_id>',subtask_id_view , name='subtasks_id'),

    path('lists/<lst_id>/task/<tsk_id>/invite', invite_view, name='invite'),
    path('lists/<lst_id>/task/<tsk_id>/subtask/<sub_id>/notif', notification_view, name='notification')
]