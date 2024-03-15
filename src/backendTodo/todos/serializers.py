from rest_framework import serializers
from todos.models import CustomUser, List, Task, Subtasks
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from rest_framework import exceptions

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

    def create(self, validate_data):
        user = CustomUser.objects.create_user(**validate_data)
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
            raise exceptions.AuthenticationFailed("Invalid credentials. recheck")
        if not user.is_active:
            raise exceptions.AuthenticationFailed("Account disabled")
        return {
            'email' : user.email,
            'tokens' : user.tokens,
        }
    

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password']
    
class ListSerializer(serializers.ModelSerializer):
    # list_owner = UserSerializer(many=True)
    class Meta:
        model = List
        fields = ['list_title', 'list_desc']
    
    # def create(self, validated_data):
    #     list_owner = validated_data.pop('id')
    #     if not list_owner:
    #         raise exceptions.AuthenticationFailed("You are not registered.")
    #     list_inst = List.objects.create(**validated_data)
    #     for list_owner in list_owner:

    