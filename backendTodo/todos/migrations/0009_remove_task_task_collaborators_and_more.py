# Generated by Django 5.0.2 on 2024-03-17 04:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todos', '0008_alter_task_task_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='task',
            name='task_collaborators',
        ),
        migrations.AlterField(
            model_name='list',
            name='list_last_updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='subtasks',
            name='subtask_deadline',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='subtasks',
            name='subtask_last_updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='task',
            name='task_last_updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
    ]