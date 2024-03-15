from django.shortcuts import render

from rest_framework import status, exceptions
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .serializers import RegisterSerializer, MyTokenObtainPairSerializer, LoginSerializer, ListSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user

from .models import CustomUser, List, Task, Subtasks, Invitation, Notification, user_task_list




class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['GET'])
def getRoutes(request):
    routes = [
        'login/',
        'register/',
    ]

    return Response(routes)

@api_view(['POST'])
def get_user_token(request):
   serializer = MyTokenObtainPairSerializer(data=request.data)
   serializer.is_valid(raise_exception=True)
   return Response(serializer.validated_data)

   
# restrict type of request on this view
@api_view(['POST',])     
def register_view(request):
    if request.method == 'POST':
        serializer = RegisterSerializer(data = request.data)
        data = {}
        if serializer.is_valid():       # access to validated_data field in serializer/save()
            user = serializer.save()        # call overided save method 
            data['response'] = "Succesfully registered new user"
            data['email'] = user.email
            data['username'] = user.username
        else:
            data = serializer.errors
        return Response(data)


@api_view(['POST'])  
def login_view(request):
    serializer = LoginSerializer(data = request.data)
    serializer.is_valid(raise_exception=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST', 'GET'])
def list_view(request):
    if request.method == 'POST':
        serializer = ListSerializer(data=request.data)
        # serializer.data.list_owner = request.user
        if serializer.is_valid(raise_exception=True):
            serializer.save(list_owner=request.user)
            return Response({request.user.username : serializer.data})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == 'GET':
        # user = get_user(request)
        all_lists = List.objects.filter(list_owner=request.user)
        data = {}
        for lis in all_lists:
            item = {}
            item['name'] = lis.list_title
            item['description'] = lis.list_desc

            # # task ki setails
            # task_list = Task.objects.filter(task_related_list_id=lis.list_id)
            # for task in task_list:
            #     task_item = {}
            #     task_item['']

            data[lis.list_id] = item

        return Response(data, status=status.HTTP_200_OK)
    
@api_view(['GET', 'PUT'])
def lists_id_view(request, id):
    if request.method == 'GET':
        list_item = user_task_list.objects.filter(u_id=request.user.id)
        list_ids_set = set()
        for list in list_item:
            list_ids_set.add(list.l_id)
        
        if id in list_ids_set:
            data = {}
            for idx in list_ids_set:
                ls_item = List.objects.filter(list_id=idx).first()
                item = {}
                item['name'] = ls_item.list_title
                item['description'] = ls_item.list_desc

                # task ki setails
                task_list = Task.objects.filter(task_related_list_id=ls_item.list_id)
                task = {}
                for task in task_list:
                    task_item = {}
                    task_item['task_title'] = task.task_title
                    task_item['task_desc'] = task.task_desc
                    if request.user in [ls_item.list_owner, task.task_collaborators]:
                        task_item['editable'] = 'True'
                    else:
                        task_item['editable'] = 'False'
                
                    task[task.task_id] = task_item
                item['tasks'] = task
                data[ls_item.list_id] = item               
            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response({"message" : "You can not access this."})
            
    # if request.method == 'PUT':
    #     serializer = SnippetSerializer(snippet, data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    



