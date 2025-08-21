// src/components/StudentForm.js
import React, { useEffect, useState } from "react";


export default function StudentForm({ onSave, onCancel, student, departments, existingRolls }) {
  const [formData, setFormData] = useState({
    username: "",
    roll_number: "",
    department: "",
    semester: "",
    gpa: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (student) {
      setFormData({
        username: student.user?.username || "",
        roll_number: student.roll_number || "",
        department: student.department || "",
        semester: student.semester || "",
        gpa: student.gpa || "",
      });
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // GPA constraint 0.0 - 4.0
    if (name === "gpa") {
      const gpaValue = parseFloat(value);
      if (gpaValue < 0 || gpaValue > 4) {
        setError("GPA must be between 0.0 and 4.0");
      } else {
        setError("");
      }
    }

    // If department changes, update roll prefix
    if (name === "department") {
      setFormData((prev) => ({
        ...prev,
        department: value,
        roll_number: value ? `${value}` : "",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Roll number uniqueness check
    if (!student && existingRolls.includes(formData.roll_number)) {
      setError("Roll number must be unique!");
      return;
    }

    if (error) return;

    const newStudent = {
      id: student?.id || Date.now(),
      roll_number: formData.roll_number,
      department: formData.department,
      semester: formData.semester,
      gpa: parseFloat(formData.gpa),
      user: {
        id: student?.user?.id || Date.now() + 1,
        username: formData.username,
        role: "student",
      },
    };
    onSave(newStudent);
  };

  return (
    <form className="student-form" onSubmit={handleSubmit}>
      <select
        name="department"
        className="form-select"
        value={formData.department}
        onChange={handleChange}
        required
      >
        <option value="">Select Department</option>
        {departments.map((dept, idx) => (
          <option key={idx} value={dept}>{dept}</option>
        ))}
      </select>

      <input
        type="text"
        name="roll_number"
        className="form-input"
        placeholder="Roll No"
        value={formData.roll_number}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="username"
        className="form-input"
        placeholder="Name"
        value={formData.username}
        onChange={handleChange}
        required
      />

      <select
        name="semester"
        className="form-select"
        value={formData.semester}
        onChange={handleChange}
        required
      >
        <option value="">Select Semester</option>
        {[...Array(8)].map((_, i) => (
          <option key={i + 1} value={i + 1}>{i + 1}</option>
        ))}
      </select>

      <input
        type="number"
        step="0.1"
        min="0"
        max="4"
        name="gpa"
        className="form-input"
        placeholder="GPA"
        value={formData.gpa}
        onChange={handleChange}
        required
      />

      {error && <p style={{ color: "red", fontSize: "13px" }}>{error}</p>}

      <div className="form-actions">
        <button type="submit" className="btn btn-save">
          {student ? "Update Student" : "Add Student"}
        </button>
        <button type="button" className="btn btn-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
