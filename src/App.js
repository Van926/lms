import React, { useState } from "react";
import "./LMSConcern.css";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://uluxjywikdmfhrqrmnqr.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsdXhqeXdpa2RtZmhycXJtbnFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2NTI5NjgsImV4cCI6MjA4NTIyODk2OH0.VXXVJxCx5IHuIY95rOiQG_lqVJsaQlprnN6p-hnA_bw";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function LMSConcernForm() {
  const [form, setForm] = useState({
    userType: "",
    email: "",
    department: "",
    Number: "",
    name: "",
    concern: "",
    attachment: null,
  });

  const handleChange = (e) => {
  const { name, value, files } = e.target;
  setForm({ ...form, [name]: files ? files[0] : value });
};

  const handleSubmit = async (e) => {
  e.preventDefault();

  const trackingCode = `LMS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  let attachmentUrl = null;

  //  Upload image if exists
  if (form.attachment) {
    const fileExt = form.attachment.name.split(".").pop();
    const fileName = `${trackingCode}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("lms-attachments")
      .upload(fileName, form.attachment);

    if (uploadError) {
      alert("Image upload failed");
      console.error(uploadError);
      return;
    }

    const { data } = supabase.storage
      .from("lms-attachments")
      .getPublicUrl(fileName);

    attachmentUrl = data.publicUrl;
  }

  // Insert record
  const { error } = await supabase.from("lms_concerns").insert([
    {
      tracking_code: trackingCode,
      user_type: form.userType,
      email: form.email,
      department: form.department,
      Number: form.Number,
      name: form.name,
      concern: form.concern,
      attachment_url: attachmentUrl,
    },
  ]);

  if (error) {
    alert(error.message);
  } else {
    alert(`Concern submitted successfully!

Your Tracking Number:
${trackingCode}`);

    setForm({
      userType: "",
      email: "",
      department: "",
      Number: "",
      name: "",
      concern: "",
      attachment: null,
    });
  }
};

  // Form
  return (
    <> 
      <div className="navbar"></div>
    <div className="page">
      <div className="card">
        <h1>LMS Concern Form</h1>
        <p1 className="text">This form is designed to gather your feedback and concerns 
          regarding our Learning Management System (LMS). Your input is valuable in helping us 
          identify areas for improvement and ensure a smoother learning experience for everyone 
          Please be specific as possible when describing your concerns. </p1>
        <form onSubmit={handleSubmit}>
            <select name="userType" value={form.userType} onChange={handleChange} required>
              <option value="">Select User Type</option>
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
            </select>
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />

          <select name="department" value={form.department} onChange={handleChange} required>
            <option value="">Select Department</option>
            <option value="Preschool/Gradeschool">Preschool/Gradeschool</option>
            <option value="Junior High School">Junior High School</option>
            <option value="Senior Highschool">Senior High School</option>
            <option value="CBA">CBA</option>
            <option value="CCTE">CCTE</option>
            <option value="CCJE">CCJE</option>
            <option value="CELA">CELA</option>
            <option value="CITHM">CITHM</option>
            <option value="CON">CON</option>
            <option value="Graduate School">Graduate School</option>
          </select>

          <input type="text" name="Number" placeholder="Student/Teacher Number" value={form.Number} onChange={handleChange} required />

          <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
          <textarea name="concern" placeholder="Type your LMS concern..." value={form.concern} onChange={handleChange} rows="4" required />

          <input type="file" name="attachment" accept="image/*" value={form.attachment_url} onChange={handleChange} />

          <button type="submit">Submit Concern</button>
        </form>
      </div>
    </div>
    </>
  );
}


