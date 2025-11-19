import React, { useState } from 'react';

const RoleForm = () => {
  const [formData, setFormData] = useState({
    roleName: '',
    roleId: '',
    createdBy: '',
  });

  const [submittedData, setSubmittedData] = useState(null);

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedData(formData);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Role Registration Form</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Role Name</label>
        <select 
          name="roleName" 
          value={formData.roleName} 
          onChange={handleChange} 
          style={styles.input}
          required
        >
          <option value="">Select Role</option>
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="Viewer">Viewer</option>
        </select>

        <label style={styles.label}>Role ID</label>
        <input 
          type="text" 
          name="roleId" 
          value={formData.roleId} 
          onChange={handleChange} 
          style={styles.input} 
          required 
        />

        <label style={styles.label}>Created By</label>
        <input 
          type="text" 
          name="createdBy" 
          value={formData.createdBy} 
          onChange={handleChange} 
          style={styles.input} 
          required 
        />

        <button type="submit" style={styles.button}>Submit</button>
      </form>

      {/* {submittedData && (
        <div style={styles.tableContainer}>
          <h3>Submitted Data</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Role Name</th>
                <th style={styles.th}>Role ID</th>
                <th style={styles.th}>Created By</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.td}>{submittedData.roleName}</td>
                <td style={styles.td}>{submittedData.roleId}</td>
                <td style={styles.td}>{submittedData.createdBy}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )} */}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '30px',
    backgroundColor: 'silver',
    borderRadius: '10px',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  label: {
    fontWeight: 'bold',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '12px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  tableContainer: {
    marginTop: '30px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
  },
  th: {
    padding: '10px',
    border: '1px solid #ccc',
    backgroundColor: '#f2f2f2',
    textAlign: 'center',
  },
  td: {
    padding: '10px',
    border: '1px solid #ccc',
    textAlign: 'center',
  },
};

export default RoleForm;
