from rest_framework import serializers
from .models import CustomUser, Student
from dj_rest_auth.serializers import UserDetailsSerializer


class UserSerializer(serializers.ModelSerializer):
    class Meta(UserDetailsSerializer.Meta):
        model = CustomUser
        fields = ['id','username', 'role']

class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Student
        fields = ['roll_number', 'department', 'semester', 'gpa', 'user']
        