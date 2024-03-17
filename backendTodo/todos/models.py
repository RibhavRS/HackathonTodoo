from django.db import models
from django.contrib.auth.models import User, AbstractUser, BaseUserManager
from django.db.models.constraints import UniqueConstraint
from rest_framework_simplejwt.tokens import RefreshToken
 
class UserManager(BaseUserManager):
    """Define a model manager for User model with no username field."""
 
    use_in_migrations = True
 
    def _create_user(self, email, password, **extra_fields):
        """Create and save a User with the given email and password."""
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
 
    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular User with the given email and password."""
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)
 
    def create_superuser(self, email, password, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
 
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
 
        return self._create_user(email, password, **extra_fields)
 

class CustomUser(AbstractUser):
    """Class for handlig users with roles"""

    created_at = models.DateTimeField(auto_now_add=True)


    email = models.EmailField(max_length=255, unique=True)
    username = models.CharField(max_length=20, null=False, blank=False)
 
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
 
    objects = UserManager() 

    def tokens(self):
        refresh = RefreshToken.for_user(self)
        return{
            'refresh' : str(refresh),
            'access' : str(refresh.access_token)
        }

    def __str__(self):
        return self.username

class List(models.Model):
    """Class for handling Lists"""

    # list_id = models.IntegerField(primary_key=True, auto_created=True)
    list_id = models.AutoField(primary_key=True)
    list_title = models.CharField(max_length=50, null=False, blank=False)
    list_desc = models.CharField(max_length=200, null=True, blank=False)
    list_owner = models.ForeignKey(to=CustomUser, on_delete=models.CASCADE)    # 
    list_create_at = models.DateTimeField(auto_now_add=True)
    list_last_updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return  self.list_title


class Task(models.Model):
    """Class for handling Tasks with a List"""

    Priority = (
        ('Urgent', 'Urgent Priority'),
        ('High', 'High Priority'),
        ('Medium', 'Medium Priority'),
        ('Low', 'Low Priority'),
    )

    Status = (
        ('Completed', 'Completed'),
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Due', 'Passed Deadline'),
    )

    # task_id = models.IntegerField(primary_key=True, auto_created=True)
    task_id = models.AutoField(primary_key=True)
    task_related_list_id = models.ForeignKey(to=List, on_delete=models.CASCADE)
    task_title = models.CharField(max_length=80, null=False, blank=False)
    task_desc = models.CharField(max_length=200, null=True, blank=False) 
    task_deadline = models.DateTimeField(null=True, blank=True)
    task_priority = models.CharField(choices=Priority, default='Medium')
    task_status = models.CharField(choices=Status, default='Pending')
    # task_collaborators = models.ForeignKey(to=CustomUser, on_delete=models.CASCADE)
    task_create_at = models.DateTimeField(auto_now_add=True)
    task_last_updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.task_id + " : " + self.task_title + " : " + self.task_collaborators


class Subtasks(models.Model):
    """Class for handling subtasks within each task"""

    Priority = (
        ('Urgent', 'Urgent Priority'),
        ('High', 'High Priority'),
        ('Medium', 'Medium Priority'),
        ('Low', 'Low Priority'),
    )

    Status = (
        ('Completed', 'Completed'),
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Due', 'Passed Deadline'),
    )

    subtask_id = models.AutoField(primary_key=True)
    subtask_related_task_id = models.ForeignKey(to=Task, on_delete=models.CASCADE)
    subtask_title = models.CharField(max_length=80, null=False, blank=False)
    subtask_desc = models.CharField(max_length=200, null=True, blank=False) 
    subtask_deadline = models.DateTimeField(null=True, blank=True)
    subtask_priority = models.CharField(choices=Priority, default='Medium')
    subtask_status = models.CharField(choices=Status, default='Pending')
    subtask_collaborators = models.ForeignKey(to=CustomUser, on_delete=models.CASCADE)
    subtask_create_at = models.DateTimeField(auto_now_add=True)
    subtask_last_updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.subtask_id + " : " + self.subtask_title + " : " + self.subtask_collaborators + " : " + self.subtask_related_task_id
    

class Invitation(models.Model):
    """Class to handle invites"""

    sender_id = models.ForeignKey(to=CustomUser, on_delete=models.CASCADE, related_name="invite_from_user")
    receiver_id = models.ForeignKey(to=CustomUser, on_delete=models.CASCADE, related_name="invite_to_user")
    related_task_id = models.ForeignKey(to=Task, on_delete=models.CASCADE)
    invite_create_at = models.DateTimeField(auto_now_add=True)

class Notification(models.Model):
    """Class to handle notifications sent"""

    notification_id = models.AutoField(primary_key=True)
    sender_id = models.ForeignKey(to=CustomUser, on_delete=models.CASCADE, related_name="notif_from_user", default=None)
    recipient_id = models.ForeignKey(to=CustomUser, on_delete=models.CASCADE, related_name="notif_to_user")
    message = models.CharField(max_length=300, null=False, blank=True)
    read = models.BooleanField()
    notification_create_at = models.DateTimeField(auto_now_add=True)
    related_subtask_id = models.ForeignKey(to=Subtasks, on_delete=models.CASCADE, default=None)

class user_task_list(models.Model):
    """relation between user list task"""

    u_id =  models.ForeignKey(to=CustomUser, related_name='rel_table_user', on_delete=models.CASCADE)
    l_id =  models.ForeignKey(to=List, related_name='rel_table_list', on_delete=models.CASCADE)
    t_id = models.ForeignKey(to=Task, related_name='rel_table_task', on_delete=models.CASCADE, null=True)
    Role = (
        ('Owner' , 'Owner'),
        ('Collaborator' , 'Collaborator'),
    )

    role = models.CharField(choices=Role, default='Owner')

    def __str__(self):
        return  self.u_id.username + " : " + self.role
