from rest_framework import viewsets
from .models import Student
from .serializer import StudentSerializer
from django.shortcuts import render
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Avg, Count


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

def api_login(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return JsonResponse({"message": "Login successful", "role": user.role})
        else:
            return JsonResponse({"message": "Invalid credentials"}, status=401)

    return JsonResponse({"message": "Only POST allowed"}, status=405)

@login_required
def student_dashboard(request):
    return render(request, 'students/StudentDashboard.js')

@login_required
def admin_dashboard(request):
    return render(request, 'students/AdminDashboard.js')

@api_view(['GET'])
def get_all_students(request):
    students = Student.objects.all()
    serializer = StudentSerializer(students, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_gpa_analytics(request):
    data = Student.objects.values('semester').annotate(
        avg_gpa = Avg('gpa')
    ).order_by('semester')
    return Response(data)

@api_view(['GET'])
def get_student_count_by_dept(request):
    data = Student.objects.values('department').annotate(
        count=Count('id')
    )
    return Response(data)

@api_view(['GET'])
def get_top_performers(request):
    top_students = Student.objects.order_by('-gpa')[:5]
    serializer = StudentSerializer(top_students, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_failing_students(request):
    failing = Student.objects.filter(gpa__lt=2.0)
    serializer = StudentSerializer(failing, many=True)
    return Response(serializer.data)


@api_view(['DELETE'])
def delete_student(request, pk):
    student = Student.objects.get(pk=pk)
    student.delete()
    return Response({'message': 'Student deleted successfully'})




