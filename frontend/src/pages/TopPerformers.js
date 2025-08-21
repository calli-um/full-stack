import react, { useState, useEffect} from 'react';
import './studentBoard.css'

const TopPerformers = () =>{
    const [top, setTop] = useState([]);

    useEffect(()=>{
         fetch('http://localhost:8000/students/top-performers/')
         .then(res => res.json())
         .then(setTop);
    },[])

    return(
        <div className='top-performers'>
            <h3>Top 5 Performers</h3>
            <table className='student-top-table'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll No.</th>
                <th>Department</th>
                <th>GPA</th>
              </tr>
            </thead>
            <tbody>
              {top.map((item, idx) => {
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
    );
};
export default TopPerformers;