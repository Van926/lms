import React, { useState } from "react";
import "./LMSConcern.css";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://YOUR_PROJECT_ID.supabase.co";
const supabaseKey = "YOUR_PUBLIC_ANON_KEY";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function LMSConcernForm() {
  const [form, setForm] = useState({
    email: "",
    department: "",
    studentNumber: "",
    name: "",
    yearLevel: "",
    concern: "",
    attachment: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from("lms_concerns").insert([
      {
        email: form.email,
        department: form.department,
        student_number: form.studentNumber,
        name: form.name,
        year_level: form.yearLevel,
        concern: form.concern,
      },
    ]);

    if (error) {
      alert("Error submitting concern");
      console.error(error);
    } else {
      alert("Concern submitted successfully!");
      setForm({
        email: "",
        department: "",
        studentNumber: "",
        name: "",
        yearLevel: "",
        concern: "",
        attachment: null,
      });
    }
  };

  return (
    <>
      <div className="navbar"></div>
    <div className="page">
      <div className="card">
        <h1>LMS Concern Form (S.Y.2025-2026)</h1>
        <p1 className="text">This form is designed to gather your feedback and concerns
           regarding our Learning Management System (LMS). Your input is valuable
          in helping us identify areas for improvement and ensure a smoother learning experience for everyone
          Please be specific as possible when describing your concerns.
           </p1>
        <div className="forms">
          <form onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />

            <select name="department" value={form.department} onChange={handleChange} required>
              <option value="">Select Department</option>
              <option value="CBA">CBA</option>
              <option value="CCTE">CCTE</option>
              <option value="CCJE">CCJE</option>
              <option value="CELA">CELA</option>
              <option value="CITHM">CITHM</option>
              <option value="CON">CON</option>
            </select>

            <input type="text" name="studentNumber" placeholder="Student Number" value={form.studentNumber} onChange={handleChange} required />

            <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />

            <select name="yearLevel" value={form.yearLevel} onChange={handleChange} required>
              <option value="">Select Year Level</option>
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
              <option value="4th">4th Year</option>
            </select>

            <textarea name="concern" placeholder="Type your LMS concern..." value={form.concern} onChange={handleChange} rows="4" required />
            <text>Attach a screenshot of your concern (Optional)</text>
            <input type="file" name="attachment" accept="image/*" onChange={handleChange} />

            <button type="submit">Submit Concern</button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}

