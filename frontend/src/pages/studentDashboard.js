import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './studentDashboard.css';

export default function StudentDashboard() {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterSemester, setFilterSemester] = useState('');

  const fetchStudents = async () => {
    const token = localStorage.getItem('access');
    try {
      const res = await axios.get('http://localhost:8000/api/students/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setStudents(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearch(term);
    const filteredData = students.filter(s =>
      s.name.toLowerCase().includes(term)
    );
    setFiltered(filteredData);
  };

  const handleSort = (field) => {
    setSortField(field);
    const sorted = [...filtered].sort((a, b) => {
      if (field === 'gpa') return b.gpa - a.gpa;
      if (field === 'name') return a.name.localeCompare(b.name);
      if (field === 'semester') return a.semester - b.semester;
      return 0;
    });
    setFiltered(sorted);
  };

  const handleFilterChange = () => {
    let data = students;
    if (filterDept) {
      data = data.filter(s => s.department === filterDept);
    }
    if (filterSemester) {
      data = data.filter(s => s.semester === parseInt(filterSemester));
    }
    if (search) {
      data = data.filter(s => s.name.toLowerCase().includes(search));
    }
    setFiltered(data);
  };

  useEffect(() => {
    handleFilterChange();
  }, [filterDept, filterSemester]);

  return (
    <div className="dashboard-container">
      <h2>Student Dashboard</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={handleSearch}
        />
        <select onChange={e => setFilterDept(e.target.value)} value={filterDept}>
          <option value="">All Departments</option>
          <option value="CS">CS</option>
          <option value="EE">EE</option>
          <option value="BBA">BBA</option>
        </select>
        <select onChange={e => setFilterSemester(e.target.value)} value={filterSemester}>
          <option value="">All Semesters</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          {/* Add more semesters as needed */}
        </select>

        <button onClick={() => handleSort('name')}>Sort by Name</button>
        <button onClick={() => handleSort('gpa')}>Sort by GPA</button>
        <button onClick={() => handleSort('semester')}>Sort by Semester</button>
      </div>

      <div className="student-list">
        {filtered.map(student => (
          <div
            key={student.id}
            className={`student-card ${
              student.gpa >= 3.0 ? 'highlight' :
              student.gpa < 2.0 ? 'failing' : ''
            }`}
          >
            <h3>{student.name}</h3>
            <p><strong>Roll:</strong> {student.roll_number}</p>
            <p><strong>Dept:</strong> {student.department}</p>
            <p><strong>Semester:</strong> {student.semester}</p>
            <p><strong>GPA:</strong> {student.gpa}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
