from django.shortcuts import render

from rest_framework import status, exceptions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

from .serializers import *
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.exceptions import *

from rest_framework_simplejwt.tokens import *
from django.contrib.auth import authenticate, get_user

from .models import *
# from django.views.decorators.csrf import csrf_protect

# import jwt
from datetime import *
import json


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['GET', ])
def getRoutes(request):
    routes = [
        'login/',
        'register/',
    ]

    return Response(routes)

@api_view(['POST', ])
def user(request):
   serializer = MyTokenObtainPairSerializer(data=request.data)
   serializer.is_valid(raise_exception=True)
   return Response(serializer.validated_data)
    # token = request.COOKIES.get('jwt')      # Cookie is preserved

    # if not token: 
    #     raise AuthenticationFailed('Unauthenticated')
    
    # try:
    #     payload = jwt.decode(token, 'secret', algorithms=['HS256'])
    # except jwt.ExpiredSignatureError:
    #     raise AuthenticationFailed('Unauthenticated!')
    
    # user = CustomUser.objects.filter(id=payload['id']).first()
    # serializer = UserSerializer(user)
    # return Response({'token' : token, 'userserializer' : serializer.data})

   
# restrict type of request on this view
@api_view(['POST',])   
@permission_classes([AllowAny])   
def register_view(request):
    if request.method == 'POST':
        serializer = RegisterSerializer(data = request.data)
        # if serializer.is_valid():
        #     serializer.save()
        #     return Response(serializer.data, status=status.HTTP_201_CREATED)
        data = {}
        if serializer.is_valid():       # access to validated_data field in serializer/save()
            user = serializer.save()        # call overided save method 
            data['response'] = "Succesfully registered new user"
            data['email'] = user.email
            data['username'] = user.username
        else:
            data = serializer.errors
        return Response(data)


@api_view(['POST', 'GET' ])  
def login_view(request):

    if request.method == 'GET':
        output = [{"username" : output.username,
                   "email" : output.email}
                   for output in CustomUser.objects.all()]
        return Response(output)
    
   

    if request.method == 'POST':
        # email = request.data["email"]
        # password = request.data["password"]
        
        # try:
        #     user = CustomUser.objects.get(email = email)
        # except User.DoesNotExist:
        #     raise AuthenticationFailed("Account does  not exist")
        # if user is None:
        #     raise AuthenticationFailed("User does not exist")
        # if not user.check_password(password):
        #     raise AuthenticationFailed("Incorrect Password")
        # access_token = AccessToken.for_user(user)
        # refresh_token =RefreshToken.for_user(user)
        # return Response({
        #     "message" : "login successful",
        #     "access_token" : json.dumps(access_token),
        #     "refresh_token" : json.dumps(refresh_token)
        # })
        serializer = LoginSerializer(data = request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        # data = request.json.get("user")
        # email = request.data['email']
        # password = request.data['password']

        # user = CustomUser.objects.filter(email=email).first()

        # if user is None:
        #     raise AuthenticationFailed('User not found')
        
        # if not user.check_password(password):
        #     raise AuthenticationFailed('Incorrect Password')
        
        # payload = {
        #     'id': user.id,
        #     'email':user.email,
        #     'exp': datetime.now(timezone.utc) + timedelta(minutes=60),
        #     'iat' : datetime.now(timezone.utc)
        # }

        # token = jwt.encode(payload, 'secret', algorithm='HS256')
        
        # response =  Response()

        # response.set_cookie(key='jwt', value=token, httponly=True)      # httponly => dont want frontend to access but send to backend

        # response.data = {
        #     'message' : 'success login',
        #     'jwt' : token
        # }

        # return response

@api_view(['POST', ])
def logout_view(request):
    try:
        refresh_token = request.data['refresh_token']
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        return Response("Logout Successful", status=status.HTTP_200_OK)
    except TokenError:
        raise AuthenticationFailed("Invalid Token")
    # response = Response()
    # response.delete_cookie('jwt')
    # response.data = {
    #     'message' : 'Logged Out successfully!!'
    # }
    # return response

@api_view(['POST', 'GET'])
# @csrf_protect
def list_view(request):
    if request.method == 'POST':
        serializer = ListSerializer(data=request.data)
        # serializer.data.list_owner = request.user
        if serializer.is_valid(raise_exception=True):
            serializer.save(request)
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
            data[lis.list_id] = item
        return Response(data, status=status.HTTP_200_OK)
    
@api_view(['GET', 'PUT', 'DELETE'])
# @csrf_protect
def lists_id_view(request, lst_id):
    if request.method == 'GET':
        list_item = user_task_list.objects.filter(u_id=request.user.id, l_id=lst_id, role='Owner')
        print(list_item)

        if list_item:
            data = {}
            ls_item = List.objects.filter(list_id=lst_id).first()
            item = {}
            item['name'] = ls_item.list_title
            item['description'] = ls_item.list_desc

            # task ki setails
            task_list = Task.objects.filter(task_related_list_id=lst_id)
            task = {}
            for tsk in task_list:
                task_item = {}
                task_item['task_title'] = tsk.task_title
                task_item['task_desc'] = tsk.task_desc
                if request.user in [ls_item.list_owner, tsk.task_collaborators]:
                    task_item['editable'] = 'True'
                else:
                    task_item['editable'] = 'False'
            
                task[tsk.task_id] = task_item
            item['tasks'] = task
            data[ls_item.list_id] = item               
            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response({"message" : "You can not access this."})
            
    if request.method == 'PUT':       # list update
        try :
            update_list = List.objects.filter(list_id=lst_id).first()
            if update_list.list_owner != request.user:
                raise ValidationError("Permission Denied. You are not the owner.")
        except List.DoesNotExist:
            return Response({"error": "List instance does not exist."}, status=status.HTTP_404_NOT_FOUND)
        serializer = ListUpdationSerializer(update_list, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == 'DELETE':
        try:
            list_item = user_task_list.objects.filter(l_id=lst_id)
            lst_itm = List.objects.filter(list_id=lst_id).first()
            if lst_itm is not None and lst_itm.list_owner != request.user:
                raise ValidationError("Permission Denied. You are not owner to delete this.")
        except List.DoesNotExist:
            return Response({"message": "List not found or you don't have permission to delete it."}, status=status.HTTP_404_NOT_FOUND)

        if list_item is not None and lst_itm is not None:
            list_item.delete()
            lst_itm.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({"message" : "Not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET', 'POST'])
# @csrf_protect
def tasks_view(request, lst_id):
    if request.method == 'GET':
        all_tasks = Task.objects.filter(task_related_list_id=lst_id)
        data = {}
        for tsk in all_tasks:
            item = {}
            item['name'] = tsk.task_title
            item['description'] = tsk.task_desc
            item['deadline'] = tsk.task_deadline
            item['priority'] = tsk.task_priority
            item['status'] = tsk.task_status
            data[tsk.task_id] = item

        return Response(data, status=status.HTTP_200_OK)
    
    if request.method == 'POST':
        serializer = TaskSerializer(data=request.data)
        # serializer.data.list_owner = request.user
        if serializer.is_valid(raise_exception=True):
            serializer.save(request, lst_id)
            return Response({request.user.username : serializer.data})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

@api_view(['GET', 'PUT', 'DELETE'])
# @csrf_protect
def task_id_view(request, lst_id, tsk_id):
    if request.method == 'GET':
        task_item = user_task_list.objects.filter(u_id=request.user.id, l_id=lst_id, t_id=tsk_id)
        
        if task_item:
            data = {}
            tsk_item = Task.objects.filter(task_id=tsk_id).first()
            item = {}
            item['task_name'] = tsk_item.task_title
            item['task_description'] = tsk_item.task_desc
            item['deadline'] = tsk_item.task_deadline
            item['priority'] = tsk_item.task_priority
            item['status'] = tsk_item.task_status

            # task ki setails
            subtask_list = Subtasks.objects.filter(subtask_related_task_id=tsk_item.task_id)
            subtasks = {}
            for subtask in subtask_list:
                subtask_item = {}
                subtask_item['subtask_title'] = subtask.subtask_title
                subtask_item['subtask_desc'] = subtask.subtask_desc
                subtask_item['subtask_deadline'] = subtask.subtask_deadline
                subtask_item['subtask_priority'] = subtask.subtask_priority
                subtask_item['subtask_status'] = subtask.subtask_status
                if request.user in [tsk_item.task_collaborators, subtask.subtask_collaborators]:
                    subtask_item['editable'] = 'True'
                else:
                    subtask_item['editable'] = 'False'
            
                subtasks[subtask.subtask_id] = subtask_item
            item['subtasks'] = subtasks
            data[tsk_id] = item               
            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response({"message" : "You can not access this."})
        
    if request.method == 'PUT':    
        task_item = Task.objects.filter(task_id=tsk_id).first()
        serializer = TaskUpdationSerializer(task_item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == 'DELETE':
        try:
            task_item = user_task_list.objects.filter(l_id=lst_id, t_id=tsk_id)
            tsk = Task.objects.filter(task_id=tsk_id)
        except Task.DoesNotExist:
            return Response({"message": "Task not found or you don't have permission to delete it."}, status=status.HTTP_404_NOT_FOUND)

        task_item.delete()
        tsk.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    
@api_view(['GET', 'POST'])
# @csrf_protect
def subtasks_view(request, lst_id, tsk_id):
    if request.method == 'GET':
        all_subtasks = Subtasks.objects.filter(subtask_related_task_id=tsk_id)
        data = {}
        for subtsk in all_subtasks:
            item = {}
            item['name'] = subtsk.subtask_title
            item['description'] = subtsk.subtask_desc
            item['deadline'] = subtsk.subtask_deadline
            item['priority'] = subtsk.subtask_priority
            item['status'] = subtsk.subtask_status
            data[subtsk.subtask_id] = item

        return Response(data, status=status.HTTP_200_OK)
    
    if request.method == 'POST':
        serializer = SubtaskSerializer(data=request.data)
        # serializer.data.list_owner = request.user
        if serializer.is_valid(raise_exception=True):
            serializer.save(request, lst_id, tsk_id)
            return Response({request.user.username : serializer.data})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

@api_view(['GET', 'PUT', 'DELETE'])
# @csrf_protect
def subtask_id_view(request, lst_id, tsk_id, subtsk_id):
    if request.method == 'GET':
        subtsk = Subtasks.objects.filter(subtask_related_task_id=tsk_id, subtask_id=subtsk_id).first()
        
        if subtsk:
            data = {}
            item = {}
            item['name'] = subtsk.subtask_title
            item['description'] = subtsk.subtask_desc
            item['deadline'] = subtsk.subtask_deadline
            item['priority'] = subtsk.subtask_priority
            item['status'] = subtsk.subtask_status
            data[subtsk.subtask_id] = item      
            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response({"message" : "You can not access this."}, status=status.HTTP_204_NO_CONTENT)
        
    if request.method == 'PUT':      
        subtask_item = Subtasks.objects.filter(subtask_related_task_id=tsk_id, subtask_id=subtsk_id).first()
        serializer = SubtaskUpdationSerializer(subtask_item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == 'DELETE':
        try:
            tsk = Subtasks.objects.filter(subtask_id=subtsk_id)
        except Subtasks.DoesNotExist:
            return Response({"message": "Task not found or you don't have permission to delete it."}, status=status.HTTP_404_NOT_FOUND)

        tsk.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

@api_view(['POST', ])
def invite_view(request, lst_id, tsk_id):
    if request.method == 'POST':
        serializer = InvitationSerializer(data=request.data)
        # serializer.data.list_owner = request.user
        if serializer.is_valid():
            serializer.save(request, lst_id, tsk_id)
            return Response({request.user.username : "invites sent successfully!!"})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

@api_view(['POST', ])
def notification_view(request, lst_id, tsk_id, sub_id):
    if request.method == 'POST':
        serializer = NotificationSerializer(data=request.data)
        # serializer.data.list_owner = request.user
        if serializer.is_valid():
            serializer.save(request, lst_id, tsk_id, sub_id)
            return Response({request.user.username : "Notification sent successfully!!"})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    if request.method == 'PUT':
        serializer = NotificationUpdationSerializer(data=request.data)
        # serializer.data.list_owner = request.user
        notif_item = Notification.objects.filter(recipient_id=request.user, related_subtask_id=sub_id).first()
        serializer = NotificationUpdationSerializer(notif_item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        