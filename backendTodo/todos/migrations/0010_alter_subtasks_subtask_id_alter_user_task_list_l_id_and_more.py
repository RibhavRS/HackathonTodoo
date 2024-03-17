# Generated by Django 5.0.2 on 2024-03-17 10:01

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todos', '0009_remove_task_task_collaborators_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='subtasks',
            name='subtask_id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='user_task_list',
            name='l_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='rel_table_list', to='todos.list'),
        ),
        migrations.AlterField(
            model_name='user_task_list',
            name='t_id',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='rel_table_task', to='todos.task'),
        ),
        migrations.AlterField(
            model_name='user_task_list',
            name='u_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='rel_table_user', to=settings.AUTH_USER_MODEL),
        ),
    ]