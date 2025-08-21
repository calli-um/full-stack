import React, { useEffect, useState } from 'react';
import TopPerformers from './TopPerformers';
import GPAChart from './GPAChart';
import ExportButtons from './ExportButtons';
import SearchFilterSort from './SearchFilterSort';
import StudentForm from './studentForm'; 
import './adminBoard.css';
import { useNavigate } from 'react-router-dom';
import logout from '../utils/logout'; 

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [deptCount, setDeptCount] = useState([]);
  const [failingStudents, setFailingStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null); 
  const [showForm, setShowForm] = useState(false);

  const fetchData = () => {
    fetch('http://localhost:8000/students/all/')
      .then(res => res.json())
      .then(data => {
        setStudents(data);
        setFiltered(data);
      });

    fetch('http://localhost:8000/students/dept-count/')
      .then(res => res.json())
      .then(setDeptCount);

    fetch('http://localhost:8000/students/failing/')
      .then(res => res.json())
      .then(setFailingStudents);
  };

  useEffect(() => {
    fetchData();
  }, []);

const handleSave = (student) => {
  if (editingStudent) {
    // update existing
    setStudents((prev) =>
      prev.map((s) => (s.id === student.id ? student : s))
    );
    setFiltered((prev) =>
      prev.map((s) => (s.id === student.id ? student : s))
    );
  } else {
    // add new
    setStudents((prev) => [...prev, student]);
    setFiltered((prev) => [...prev, student]);
  }
  setShowForm(false);
  setEditingStudent(null);
};

const handleEdit = (student) => {
  setEditingStudent(student);
  setShowForm(true);
};

const handleAddNew = () => {
  setEditingStudent(null);
  setShowForm(true);
};

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      await fetch(`http://localhost:8000/students/delete/${id}/`, {
        method: 'DELETE',
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };




  return (
  <div className="adm-dashboard">
    <div className="adm-main-content">
      <div className="adm-header">
        <h1>Hello Admin!</h1>
        <button onClick={logout}>Logout</button>
      </div>
     <SearchFilterSort students={students} setFiltered={setFiltered} />
      <div className="adm-student-list">
        <div className="adm-list-header">
          <h3>All Students</h3>
          <div className="adm-list-actions">
            <button onClick={handleAddNew} className="adm-add-button">+ Add Student</button>
            <ExportButtons data={students} />
          </div>
        </div>

       

        {showForm && (
          <StudentForm
            student={editingStudent}
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
            departments={[...new Set(students.map((s) => s.department))]}
            existingRolls={students.map((s) => s.roll_number)}
          />
      )}

        <table className='adm-student-table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll No.</th>
              <th>Dept</th>
              <th>Semester</th>
              <th>GPA</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, idx) => (
              <tr key={idx} className={s.gpa > 3.0 ? 'highlight' : ''}>
                <td>{s.user.username}</td>
                <td>{s.roll_number}</td>
                <td>{s.department}</td>
                <td>{s.semester}</td>
                <td>{s.gpa}</td>
                <td>
                  <button onClick={() => handleEdit(s)}>Edit</button>
                  <button onClick={() => handleDelete(s.id)} className="adm-delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="adm-summary">
        <div className="adm-card-count">
          <h3>Student Count by Department</h3>
        <table className="adm-student-count-table">
  <thead>
    <tr>
      <th>Department</th>
      <th>Student Count</th>
    </tr>
  </thead>
  <tbody>
    {deptCount.map((item, idx) => (
      <tr key={idx}>
        <td>{item.department}</td>
        <td>{item.count}</td>
      </tr>
    ))}
  </tbody>
</table>
        </div>

        <div className="adm-card-fail">
          <h3>Failing Students</h3>
          <table className='adm-student-fail-table'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll No.</th>
                <th>Department</th>
                <th>GPA</th>
              </tr>
            </thead>
            <tbody>
              {failingStudents.map((item, idx) => {
              return (
                <tr key={idx}>
                  <td>{item.user.username}</td>
                  <td>{item.roll_number}</td>
                  <td>{item.department}</td>
                  <td>{item.gpa}</td>
                </tr>
              );
            })}
          </tbody>
          </table>
        </div>
      </div>
     <div ><TopPerformers /></div>
      <div className="adm-chart-container">
        <div><GPAChart /></div>
       
      </div>

    </div>
  </div>
);
};

export default AdminDashboard;
