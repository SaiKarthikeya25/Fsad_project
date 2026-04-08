import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion'; 

// Change line 5-8 to this:
import { 
  LayoutDashboard, ClipboardList, UserCircle, LogOut, 
  CheckCircle2, BarChart3, Lock, User
} from 'lucide-react';

const API_URL = "http://localhost:8080/api";

// --- LOGIN PAGE COMPONENT ---
const Login = ({ setUser }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/login`, credentials);
      const userData = res.data;
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      navigate(userData.role === 'STUDENT' ? '/student' : '/warden');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-5 shadow-lg border-0 bg-white" style={{ width: '400px', borderRadius: '20px' }}>
        <div className="text-center mb-4">
          <div className="bg-primary d-inline-block p-3 rounded-circle mb-3 shadow">
            <ClipboardList className="text-white" size={32} />
          </div>
          <h2 className="fw-bold">HostelCare Login</h2>
          <p className="text-muted">Enter your credentials to continue</p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label small fw-bold text-uppercase">Username</label>
            <div className="input-group bg-light rounded-3 overflow-hidden border">
              <span className="input-group-text bg-transparent border-0"><User size={18}/></span>
              <input type="text" className="form-control border-0 bg-transparent" placeholder="student1 or warden1" 
                onChange={e => setCredentials({...credentials, username: e.target.value})} required />
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label small fw-bold text-uppercase">Password</label>
            <div className="input-group bg-light rounded-3 overflow-hidden border">
              <span className="input-group-text bg-transparent border-0"><Lock size={18}/></span>
              <input type="password" className="form-control border-0 bg-transparent" placeholder="••••••••" 
                onChange={e => setCredentials({...credentials, password: e.target.value})} required />
            </div>
          </div>
          {error && <p className="text-danger small mb-3">{error}</p>}
          <button className="btn btn-primary w-100 py-3 rounded-3 shadow fw-bold">Login to Dashboard</button>
        </form>
      </motion.div>
    </div>
  );
};

// --- SHARED SIDEBAR COMPONENT ---
const Sidebar = ({ user, logout }) => (
  <div className="bg-dark text-white p-4 flex-shrink-0 shadow" style={{ width: '260px' }}>
    <div className="d-flex align-items-center mb-5 gap-2">
      <div className="bg-primary p-2 rounded-3 shadow-sm"><ClipboardList size={20} /></div>
      <h5 className="mb-0 fw-bold">HostelCare</h5>
    </div>
    <div className="d-flex flex-column gap-2">
      <div className="p-3 bg-secondary bg-opacity-10 rounded-3 mb-4 text-center">
        <UserCircle size={40} className="mb-2 text-info" />
        <h6 className="mb-0">{user.username}</h6>
        <span className="badge bg-info text-dark mt-2" style={{fontSize: '10px'}}>{user.role}</span>
      </div>
      <button className="btn btn-dark text-start py-3 px-3 d-flex align-items-center gap-3 border-0">
        <LayoutDashboard size={18}/> Dashboard
      </button>
      <button onClick={logout} className="btn btn-outline-danger mt-5 border-0 text-start d-flex align-items-center gap-3">
        <LogOut size={18}/> Logout
      </button>
    </div>
  </div>
);

// --- STUDENT DASHBOARD ---
const StudentDashboard = ({ user }) => {
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState({ title: '', category: 'Maintenance', description: '', studentId: user.id });

  useEffect(() => {
    axios.get(`${API_URL}/complaints/student/${user.id}`).then(res => setComplaints(res.data));
  }, [user.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/complaints`, form);
    setForm({ ...form, title: '', description: '' });
    window.location.reload();
  };

  return (
    <div className="flex-grow-1 p-5 overflow-auto">
      <h2 className="fw-bold mb-4">My Dashboard</h2>
      <div className="row g-4 mb-5">
        <StatCard title="Total Filed" count={complaints.length} color="primary" icon={<BarChart3 />} />
        <StatCard title="Resolved" count={complaints.filter(c => c.status === 'RESOLVED').length} color="success" icon={<CheckCircle2 />} />
      </div>
      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm p-4 rounded-4">
            <h5 className="fw-bold mb-4">File New Complaint</h5>
            <form onSubmit={handleSubmit}>
              <input className="form-control mb-3 bg-light border-0 py-3" placeholder="Summary" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
              <select className="form-select mb-3 bg-light border-0 py-3" onChange={e => setForm({...form, category: e.target.value})}>
                <option>Maintenance</option><option>Food</option><option>Wifi</option>
              </select>
              <textarea className="form-control mb-3 bg-light border-0" rows="4" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
              <button className="btn btn-primary w-100 py-3 rounded-pill fw-bold">Submit Complaint</button>
            </form>
          </div>
        </div>
        <div className="col-lg-7">
          <h5 className="fw-bold mb-4">Recent Status</h5>
          {complaints.map(c => (
            <div key={c.id} className="card border-0 shadow-sm mb-3 rounded-4 p-3 border-start border-4 border-info">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="fw-bold mb-1">{c.title}</h6>
                  <small className="text-muted">{c.category}</small>
                </div>
                <span className={`badge px-3 py-2 rounded-pill ${c.status === 'RESOLVED' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>{c.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- WARDEN DASHBOARD ---
const WardenDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  useEffect(() => { axios.get(`${API_URL}/complaints`).then(res => setComplaints(res.data)); }, []);

  const handleResolve = async (id) => {
    await axios.put(`${API_URL}/complaints/${id}/status`, { status: 'RESOLVED' });
    window.location.reload();
  };

  return (
    <div className="flex-grow-1 p-5 overflow-auto">
      <h2 className="fw-bold mb-4">Hostel Management Panel</h2>
      <div className="card border-0 shadow rounded-4 overflow-hidden">
        <table className="table table-hover mb-0 align-middle">
          <thead className="table-dark">
            <tr className="py-3">
              <th className="p-4">Student ID</th>
              <th>Issue</th>
              <th>Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map(c => (
              <tr key={c.id}>
                <td className="p-4 fw-bold text-primary">#{c.studentId}</td>
                <td>
                  <div className="fw-bold">{c.title}</div>
                  <div className="small text-muted">{c.description}</div>
                </td>
                <td><span className={`badge px-3 py-2 rounded-pill ${c.status === 'RESOLVED' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>{c.status}</span></td>
                <td className="text-center">
                  {c.status === 'PENDING' && (
                    <button onClick={() => handleResolve(c.id)} className="btn btn-sm btn-success rounded-pill px-4">Resolve</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- MAIN ROUTING LOGIC ---
function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <div className="d-flex min-vh-100">
        {user && <Sidebar user={user} logout={logout} />}
        <Routes>
          <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to={user.role === 'STUDENT' ? '/student' : '/warden'} />} />
          <Route path="/student" element={user?.role === 'STUDENT' ? <StudentDashboard user={user} /> : <Navigate to="/login" />} />
          <Route path="/warden" element={user?.role === 'WARDEN' ? <WardenDashboard /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

// Stats Card Helper
function StatCard({ title, count, color, icon }) {
  return (
    <div className="col-md-6">
      <div className="card border-0 shadow-sm rounded-4 p-4">
        <div className="d-flex align-items-center gap-3">
          <div className={`bg-${color} bg-opacity-10 text-${color} p-3 rounded-4`}>{icon}</div>
          <div><p className="text-secondary small mb-0">{title}</p><h3 className="fw-bold mb-0">{count}</h3></div>
        </div>
      </div>
    </div>
  );
}

export default App;