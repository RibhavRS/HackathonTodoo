from rest_framework import serializers
from todos.models import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from rest_framework.exceptions import *
from django.utils import timezone

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user) 

        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email
        # ...

        return token

class RegisterSerializer(serializers.ModelSerializer):
    
    confirm_password = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = CustomUser
        fields = ['email','username', 'password', 'confirm_password']
        extra_kwargs = {
            'password' : {'write_only': True}       # for security = dont want user to read when passed as request to server
        }

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user

    # overriding one method => pass1 == pass2
    def save(self):
        user = CustomUser(
            email=self.validated_data['email'],
            username=self.validated_data['username'],
        )

        password = self.validated_data['password']
        confirm_password = self.validated_data['confirm_password']

        if password != confirm_password:
            raise serializers.ValidationError({'password' : 'Passwords must match'})
        user.set_password(password)
        user.save()     # actual save() method called => save to db
        return user
    
class LoginSerializer(serializers.ModelSerializer):
    
    password = serializers.CharField(max_length=60, min_length=8, write_only=True)
    email = serializers.EmailField()
    tokens = serializers.SerializerMethodField('get_tokens')

    class Meta:
        model = CustomUser
        fields = ['email', 'password','tokens']
    
    def get_tokens(self, obj):
        user = CustomUser.objects.get(email=obj['email'])
        return {
            'refresh' : user.tokens()['refresh'],
            'access' : user.tokens()['access'],
        }

    def validate(self, attrs):
        email = attrs.get('email', '')
        password = attrs.get('password', '')
        print(email, " ", password)
        user = authenticate(email=email, password=password)
        if not user:
            raise AuthenticationFailed("Invalid credentials. recheck")
        if not user.is_active:
            raise AuthenticationFailed("Account disabled")
        return {
            'email' : user.email,
            'tokens' : user.tokens,
        }
    

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password']
        # extra_kwargs = {
        #     'password' : {'write_only' : True}
        # }

        # def create(self, validated_data):
        #     password = validated_data.pop('password', None)
        #     instance = self.Meta.model(**validated_data)
        #     if password is not None:
        #         instance.set_password(password)
        #     instance.save()
        #     return instance
    
class ListSerializer(serializers.ModelSerializer):
    class Meta:
        model = List
        fields = ['list_title', 'list_desc']



    def save(self, request):
        list_title = self.validated_data['list_title']
        list_desc = self.validated_data['list_desc'] 
        created_at = self.validated_data.get('list_create_at')

        # user = CustomUser.objects.filter(email=request.user.email)      
 
        try:
            if created_at is not None:
                nlist = List(list_title=list_title, list_desc=list_desc, list_owner=request.user, list_last_updated_at=timezone.now())
            else:
                nlist = List(list_title=list_title, list_desc=list_desc, list_owner=request.user)
            
            nlist.save()
 
            try:
                u_q = user_task_list(u_id = request.user, l_id=nlist, t_id=None, role="Owner")
                u_q.save()
            except:
                nlist.delete()
                raise serializers.ValidationError({"error":"List can't be created."})
            return list
        except Exception as e:
            raise serializers.ValidationError({"error":"List can't be created","E":f"{e}"})

class ListUpdationSerializer(serializers.ModelSerializer):
    class Meta:
        model = List
        fields = ['list_title', 'list_desc']

class TaskSerializer(serializers.ModelSerializer):
    # list_owner = UserSerializer(many=True)
    # task=user_task_list.objects.all()
    # rel_table_task = serializers.SlugRelatedField(many=True, slug_field='email', read_only=True)
    class Meta:
        model = Task 
        fields = ['task_title', 'task_desc', 'task_deadline', 'task_priority', 'task_status']

    
    def save(self, request, lst_id):
        print(request.data)
        task_title = self.validated_data['task_title']
        task_desc = self.validated_data['task_desc']
        task_deadline = self.validated_data['task_deadline']
        task_priority = self.validated_data['task_priority']
        task_status = self.validated_data['task_status']
        
 
        try:
            list_instance = List.objects.get(list_id=lst_id)
            task = Task(task_title=task_title, task_desc=task_desc, task_deadline=task_deadline, task_priority=task_priority, task_status=task_status , task_related_list_id=list_instance)
            task.save()
 
            try:
                u_q = user_task_list(u_id = request.user, l_id=list_instance, t_id=task, role="Owner")
                u_q.save()
                collaborators_data = request.data['rel_table_task']
                print(collaborators_data, type(collaborators_data))
                if collaborators_data is not None :
                    for collab_email in collaborators_data:
                     
                        user = CustomUser.objects.filter(email=collab_email).first()
                        if user:
                            print(collab_email)
                            u_q_c = user_task_list(u_id = user, l_id=list_instance, t_id=task, role="Collaborator")
                            u_q_c.save()
                        else:
                            raise ValidationError({"message" : "user not found"})
            except:
                task.delete()
                raise serializers.ValidationError({"error":"Task can't be created."})
            return task
        except Exception as e:
            raise serializers.ValidationError({"error":"Task can't be created", "details": str(e)})
        
class TaskUpdationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task 
        fields = ['task_title', 'task_desc', 'task_deadline', 'task_priority', 'task_status']

class SubtaskSerializer(serializers.ModelSerializer):
    # list_owner = UserSerializer(many=True)
    class Meta:
        model = Subtasks
        fields = ['subtask_title', 'subtask_desc', 'subtask_deadline', 'subtask_priority', 'subtask_status']

    
    def save(self, request, lst_id, tsk_id):
        subtask_title = self.validated_data['subtask_title']
        subtask_desc = self.validated_data['subtask_desc']
        subtask_deadline = self.validated_data['subtask_deadline']
        subtask_priority = self.validated_data['subtask_priority']
        subtask_status = self.validated_data['subtask_status']
 
        try:
            list_instance = List.objects.get(list_id=lst_id)
            task_instance = Task.objects.get(task_id=tsk_id)
            subtask = Subtasks(subtask_title=subtask_title, subtask_desc=subtask_desc, subtask_deadline=subtask_deadline, subtask_priority=subtask_priority, subtask_status=subtask_status , subtask_collaborators=request.user, subtask_related_task_id=task_instance)
            subtask.save()
 
            # try:
            #     u_q = user_task_list(u_id = request.user, l_id=list_instance, t_id=task_instance, role="Collaborator")
            #     u_q.save()
            # except:
            #     subtask.delete()
            #     raise serializers.ValidationError({"error":"Subtask can't be created."})
            return subtask
        except Exception as e:
            raise serializers.ValidationError({"error":"subtask can't be created","E":f"{e}"})
        
class SubtaskUpdationSerializer(serializers.ModelSerializer):
    # list_owner = UserSerializer(many=True)
    class Meta:
        model = Subtasks
        fields = ['subtask_title', 'subtask_desc', 'subtask_deadline', 'subtask_priority', 'subtask_status']

class InvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitation
        fields = []

    def save(self, request, lst_id, tsk_id):
        try:
            tsk = Task.objects.filter(task_related_list_id=lst_id, task_id=tsk_id).first()
            recipient_lst = request.data['recipient_list']
            if recipient_lst is not None:
                for recp in recipient_lst:
                    user = CustomUser.objects.filter(email=recp).first()
                    if user:
                        invite = Invitation(sender_id=request.user, receiver_id=user, related_task_id=tsk)
                        invite.save()
        except Exception as e:
            raise serializers.ValidationError({"errors" : f"{e}"})       


class NotificationSerializer(serializers.ModelSerializer):
    # recipient = UserSerializer(many=True)
    class Meta:
        model = Notification
        fields = ['message', 'read']

    def save(self, request, lst_id, tsk_id, sub_id):
        try:
            subtsk = Subtasks.objects.filter(subtask_id=sub_id, subtask_related_task_id=tsk_id).first()
            msg = request.data['message']
            recipient_lst = request.data['recipient_list']
            if recipient_lst is not None:
                for recp in recipient_lst:
                    user = CustomUser.objects.filter(email=recp).first()
                    if user:
                        invite = Notification(sender_id=request.user, recipient_id=user, related_subtask_id=subtsk, message=msg, read=False)
                        invite.save()
        except Exception as e:
            raise serializers.ValidationError({"errors" : f"{e}"})
        
class NotificationUpdationSerializer(serializers.ModelSerializer):
    # recipient = UserSerializer(many=True)
    class Meta:
        model = Notification
        fields = ['message', 'read']

    