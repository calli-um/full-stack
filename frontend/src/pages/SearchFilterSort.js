import React, { useState } from 'react';

const SearchFilterSort = ({ students, setFiltered }) => {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [filterDept, setFilterDept] = useState('');

  const departments = [...new Set(students.map(s => s.department))];

  const handleSearch = () => {
    let filtered = students;

    if (filterDept) {
      filtered = filtered.filter(s => s.department === filterDept);
    }


    const val = query.toLowerCase();
    if (val) {
      filtered = filtered.filter(s =>
        s.user.username.toLowerCase().includes(val) ||
        s.department.toLowerCase().includes(val) ||
        s.semester.toString().includes(val)
      );
    }

    if (sortKey === 'gpaDSC') {
      filtered = [...filtered].sort((a, b) => b.gpa - a.gpa);
    } else if (sortKey === 'semesterASC') {
      filtered = [...filtered].sort((a, b) => a.semester - b.semester);
    } else if (sortKey === 'semesterDSC') {
      filtered = [...filtered].sort((a, b) => b.semester - a.semester);
    } else if (sortKey === 'gpaASC') {
      filtered = [...filtered].sort((a, b) => b.semester - a.semester);
    } else if (sortKey === 'name') {
      filtered = [...filtered].sort((a, b) => a.user.username.localeCompare(b.user.username));
    }

    setFiltered(filtered);
  };

  return (
    <div className="search-box" style={{ marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="username, department, or semester..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: '8px', marginRight: '10px', width: '250px' }}
      />

      <select
        value={filterDept}
        onChange={(e) => setFilterDept(e.target.value)}
        style={{ padding: '8px', marginRight: '10px' }}
      >
        <option value="">All Departments</option>
        {departments.map((dept, idx) => (
          <option key={idx} value={dept}>{dept}</option>
        ))}
      </select>

      <select
        value={sortKey}
        onChange={(e) => setSortKey(e.target.value)}
        style={{ padding: '8px', marginRight: '10px' }}
      >
        <option value="">No Sort</option>
        <option value="gpaDSC">Sort by GPA (High to Low)</option>
        <option value="gpaASC">Sort by GPA (Low to High)</option>
        <option value="semesterASC">Sort by Semester (Low to High)</option>
        <option value="semesterDSC">Sort by Semester (High o Low)</option>
        <option value="name">Sort by Name (Alphabetically)</option>
      </select>

      <button className='apply-button' onClick={handleSearch} style={{ padding: '8px 16px' }}>Apply</button>
    </div>
  );
};

export default SearchFilterSort;
