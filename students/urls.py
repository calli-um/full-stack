from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StudentViewSet, student_dashboard, admin_dashboard, \
    get_all_students, get_gpa_analytics, get_student_count_by_dept, \
    get_top_performers, get_failing_students, delete_student

router = DefaultRouter()
router.register(r'students', StudentViewSet, basename='students')  # => /students/students/

urlpatterns = [
    path('', include(router.urls)),
    path('student/dashboard/', student_dashboard, name='student_dashboard'),
    path('admin/dashboard/', admin_dashboard, name='admin_dashboard'),

    # analytics / convenience endpoints you already use:
    path('all/', get_all_students),
    path('gpa-analytics/', get_gpa_analytics),
    path('dept-count/', get_student_count_by_dept),
    path('top-performers/', get_top_performers),
    path('failing/', get_failing_students),

    # you still use this one for delete from the table:
    path('delete/<int:pk>/', delete_student),
]
