import react, { useEffect, useState} from 'react';
import TopPerformers from './TopPerformers';
import GPAChart from './GPAChart';
import SearchFilterSort from './SearchFilterSort';
import './studentBoard.css'

const StudentDashboard = () => {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [deptCount, setDeptCount] = useState([]);
  const [failingStudents, setFailingStudents] = useState([]);
  


  useEffect(()=>{
    fetch('http://localhost:8000/students/all/')
    .then(res => res.json())
    .then(data=>{
      setStudents(data);
      setFiltered(data);
    });

    fetch('http://localhost:8000/students/dept-count/')
    .then(res => res.json())
    .then(setDeptCount);
  
    fetch('http://localhost:8000/students/failing/')
    .then(res => res.json())
    .then(setFailingStudents);
  },[]);

    return (
  <div className="dashboard">
    <div className="main-content">
      <div className="header">
        <h1> Hello Student!</h1>
      </div>
     <SearchFilterSort students={students} setFiltered={setFiltered} />
      <div className="student-list">
        <div className="list-header">
          <h3>All Students</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll No.</th>
              <th>Dept</th>
              <th>Semester</th>
              <th>GPA</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="summary">
        <div className="card-count">
          <h3>Student Count by Department</h3>
        <table className="student-count-table">
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

        <div className="card-fail">
          <h3>Failing Students</h3>
          <table className='student-fail-table'>
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
      <div className="chart-container">
        <div><GPAChart /></div>
       
      </div>

    </div>
  </div>
);
};
export default StudentDashboard;
