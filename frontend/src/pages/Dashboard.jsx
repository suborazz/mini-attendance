import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [attendance, setAttendance] = useState(null);
    const navigate = useNavigate();

    // SweetAlert Toast Mixin
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });

    useEffect(() => {
        fetchTasks();
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const response = await API.get('/attendance/my');
            const todayRecord = response.data.find(r => r.date === today);
            setAttendance(todayRecord);
        } catch (err) {
            console.error('Failed to fetch attendance');
        }
    };

    const fetchTasks = async () => {
        try {
            const response = await API.get('/tasks');
            setTasks(response.data);
        } catch (err) {
            console.error('Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    };

    const handleCheckIn = async () => {
        try {
            const response = await API.post('/attendance/checkin');
            fetchAttendance();
            Toast.fire({
                icon: 'success',
                title: response.data.message
            });
        } catch (err) {
            Toast.fire({
                icon: 'error',
                title: err.response?.data?.message || 'Check-in failed'
            });
        }
    };

    const handleCheckOut = async () => {
        try {
            const response = await API.post('/attendance/checkout');
            fetchAttendance();
            Toast.fire({
                icon: 'success',
                title: response.data.message
            });
        } catch (err) {
            Toast.fire({
                icon: 'error',
                title: err.response?.data?.message || 'Check-out failed'
            });
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!isCheckedIn) {
            Toast.fire({
                icon: 'warning',
                title: 'Please Clock In first to manage tasks'
            });
            return;
        }
        try {
            await API.post('/tasks', { title, description });
            setTitle('');
            setDescription('');
            fetchTasks();
            Toast.fire({
                icon: 'success',
                title: 'Task created successfully'
            });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to create task!',
            });
        }
    };

    const handleDeleteTask = async (id) => {
        if (!isCheckedIn) {
            Toast.fire({
                icon: 'warning',
                title: 'Please Clock In first to manage tasks'
            });
            return;
        }
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'var(--primary)',
            cancelButtonColor: 'var(--danger)',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await API.delete(`/tasks/${id}`);
                fetchTasks();
                Swal.fire(
                    'Deleted!',
                    'Your task has been deleted.',
                    'success'
                );
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to delete task',
                });
            }
        }
    };

    const handleToggleStatus = async (task) => {
        if (!isCheckedIn) {
            Toast.fire({
                icon: 'warning',
                title: 'Please Clock In first to manage tasks'
            });
            return;
        }
        try {
            const newStatus = task.status === 'pending' ? 'completed' : 'pending';
            await API.put(`/tasks/${task.id}`, { status: newStatus });
            fetchTasks();
            Toast.fire({
                icon: 'success',
                title: `Task marked as ${newStatus}`
            });
        } catch (err) {
            Toast.fire({
                icon: 'error',
                title: 'Failed to update task'
            });
        }
    };

    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const taskProgress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

    const lastSession = attendance?.checkIns?.[attendance.checkIns.length - 1];
    const isCheckedIn = lastSession && lastSession.checkOutTime === null;

    const formatTime = (val) => {
        if (!val) return '--:--';

        let date;
        if (val && typeof val === 'object' && val._seconds) {
            // Handle Firestore Timestamp
            date = new Date(val._seconds * 1000);
        } else {
            // Handle ISO string or Date object
            date = new Date(val);
        }

        if (isNaN(date.getTime())) return 'Invalid';
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userInitials = user.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
        : 'U';

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            <style>{`
                .dashboard-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 2rem 1rem;
                    display: grid;
                    gap: 2rem;
                }

                header.dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-bottom: 2rem;
                    border-bottom: 1px solid var(--glass-border);
                }

                .user-badge {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .avatar {
                    width: 48px;
                    height: 48px;
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 1.25rem;
                }

                .main-grid {
                    display: grid;
                    grid-template-columns: 1fr 2fr;
                    gap: 2rem;
                    align-items: start;
                }

                @media (max-width: 768px) {
                    .main-grid {
                        grid-template-columns: 1fr;
                    }
                    header.dashboard-header {
                        flex-direction: column;
                        gap: 1rem;
                        text-align: center;
                    }
                }

                .section-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    margin-bottom: 1.5rem;
                    color: var(--text-main);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .attendance-controls {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }

                .status-msg {
                    margin-top: 1rem;
                    padding: 0.75rem;
                    border-radius: var(--radius-md);
                    font-size: 0.875rem;
                    text-align: center;
                }

                .status-msg.success { background: rgba(16, 185, 129, 0.1); color: var(--success); }
                .status-msg.error { background: rgba(239, 68, 68, 0.1); color: var(--danger); }

                .task-form {
                    display: grid;
                    gap: 1rem;
                    margin-bottom: 2rem;
                    padding: 1.5rem;
                    border-radius: var(--radius-lg);
                    background: white;
                }

                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                input[type="text"] {
                    padding: 0.75rem 1rem;
                    border-radius: var(--radius-md);
                    border: 1px solid #e2e8f0;
                    outline: none;
                    transition: border-color 0.2s;
                }

                input[type="text"]:focus {
                    border-color: var(--primary);
                    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
                }

                .task-list {
                    list-style: none;
                    display: grid;
                    gap: 1rem;
                }

                .task-card {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.25rem;
                    background: white;
                    border-radius: var(--radius-md);
                    box-shadow: var(--shadow-sm);
                    transition: transform 0.2s, box-shadow 0.2s;
                    border-left: 4px solid #e2e8f0;
                }

                .task-card:hover {
                    transform: translateX(4px);
                    box-shadow: var(--shadow);
                }

                .task-card.completed {
                    border-left-color: var(--success);
                    opacity: 0.8;
                }

                .task-info h4 {
                    font-weight: 600;
                    margin-bottom: 0.25rem;
                }

                .task-info p {
                    font-size: 0.875rem;
                    color: var(--text-muted);
                }

                .task-actions {
                    display: flex;
                    gap: 0.5rem;
                }

                .btn-icon {
                    padding: 0.5rem;
                    border-radius: 8px;
                    background: #f1f5f9;
                    color: var(--text-muted);
                }

                .btn-icon:hover {
                    background: #e2e8f0;
                    color: var(--text-main);
                }

                .btn-icon.delete:hover {
                    background: rgba(239, 68, 68, 0.1);
                    color: var(--danger);
                }

                .btn-icon.toggle.completed {
                    color: var(--success);
                    background: rgba(16, 185, 129, 0.1);
                }

                .badge {
                    padding: 0.25rem 0.5rem;
                    border-radius: 6px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                .badge.pending { background: rgba(245, 158, 11, 0.1); color: var(--warning); }
                .badge.completed { background: rgba(16, 185, 129, 0.1); color: var(--success); }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .stat-card {
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .stat-card .label {
                    font-size: 0.875rem;
                    color: var(--text-muted);
                    font-weight: 500;
                }

                .stat-card .value {
                    font-size: 1.75rem;
                    font-weight: 800;
                    color: var(--text-main);
                }

                .skeleton {
                    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
                    background-size: 200% 100%;
                    animation: skeleton-loading 1.5s infinite;
                    border-radius: var(--radius-md);
                }

                @keyframes skeleton-loading {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }

                .skeleton-task {
                    height: 80px;
                    width: 100%;
                    margin-bottom: 1rem;
                }
            `}</style>

            <header className="dashboard-header">
                <div className="user-badge">
                    <div className="avatar">{userInitials}</div>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Attendance Hub</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Welcome back, {user.name || 'User'}</p>
                    </div>
                </div>
                <button className="btn-secondary" onClick={logout}>Sign Out</button>
            </header>

            <div className="stats-grid">
                <div className="card glass stat-card">
                    <span className="label">Total Tasks</span>
                    <span className="value">{tasks.length}</span>
                </div>
                <div className="card glass stat-card">
                    <span className="label">Completion Rate</span>
                    <span className="value">{taskProgress}%</span>
                </div>
                <div className="card glass stat-card">
                    <span className="label">Status</span>
                    <span
                        className="value"
                        style={{ color: isCheckedIn ? 'var(--success)' : 'var(--text-muted)', fontSize: '1.25rem' }}
                    >
                        {isCheckedIn ? 'Currently Working' : 'Off Duty'}
                    </span>
                </div>
            </div>

            <div className="main-grid">
                <aside className="sidebar">
                    <section className="card glass">
                        <h2 className="section-title">Record Attendance</h2>
                        <div className="attendance-controls">
                            <button className="btn-primary" onClick={handleCheckIn}>Check In</button>
                            <button onClick={handleCheckOut} className="btn-secondary">Check Out</button>
                        </div>

                        {attendance?.checkIns?.length > 0 && (
                            <div className="attendance-logs" style={{ marginTop: '1.5rem' }}>
                                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, paddingBottom: '0.5rem', borderBottom: '1px solid var(--glass-border)', marginBottom: '1rem' }}>Today's Logs</h3>
                                <div style={{ display: 'grid', gap: '0.75rem' }}>
                                    {[...attendance.checkIns].reverse().map((session, idx) => (
                                        <div key={idx} className="log-item" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <span style={{ color: 'var(--success)' }}>IN</span>
                                                <span style={{ fontWeight: 600 }}>{formatTime(session.checkInTime)}</span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <span style={{ color: 'var(--danger)' }}>OUT</span>
                                                <span style={{ fontWeight: 600 }}>{formatTime(session.checkOutTime)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                </aside>

                <main className="content">
                    <section className="card task-section glass">
                        <h2 className="section-title">My Tasks</h2>

                        <form className="task-form border" onSubmit={handleCreateTask}>
                            <div className="input-group">
                                <input
                                    type="text"
                                    placeholder="What needs to be done?"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Add notes..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <button className="btn-primary" type="submit" style={{ width: 'fit-content' }}>Add Task</button>
                        </form>

                        {loading ? (
                            <div className="task-list">
                                <div className="skeleton skeleton-task"></div>
                                <div className="skeleton skeleton-task"></div>
                                <div className="skeleton skeleton-task"></div>
                            </div>
                        ) : tasks.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                                <p>No tasks found. Start by adding one!</p>
                            </div>
                        ) : (
                            <ul className="task-list">
                                {tasks.map(task => (
                                    <li key={task.id} className={`task-card ${task.status}`}>
                                        <div className="task-info">
                                            <h4>{task.title}</h4>
                                            {task.description && <p>{task.description}</p>}
                                            <span className={`badge ${task.status}`}>{task.status}</span>
                                        </div>
                                        <div className="task-actions">
                                            <button
                                                className={`btn-icon toggle ${task.status}`}
                                                onClick={() => handleToggleStatus(task)}
                                                title={task.status === 'pending' ? "Mark Completed" : "Mark Pending"}
                                            >
                                                {task.status === 'pending' ? '✓' : '↺'}
                                            </button>
                                            <button
                                                className="btn-icon delete"
                                                onClick={() => handleDeleteTask(task.id)}
                                                title="Delete Task"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
