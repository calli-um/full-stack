import React from 'react';
import { saveAs } from 'file-saver';

const ExportButtons = ({ data }) => {
    const exportCSV = () => {
        const csv = [
            ['Name', 'Roll Number', 'Department', 'Semester', 'GPA'],
            ...data.map(s => [s.user.username, s.roll_number, s.department, s.semester, s.gpa])
        ]
            .map(row => row.join(','))
            .join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'students.csv');
    };

    return (
        <div className='export-buttons'>
            <button onClick={exportCSV}>Export CSV</button>
        </div>
    );
};

export default ExportButtons;
