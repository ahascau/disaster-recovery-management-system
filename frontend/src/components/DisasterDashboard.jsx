import { useEffect, useState } from 'react';
import { getDisasters, addDisaster, deleteDisaster } from './../api/disasters';
import { Link } from 'react-router-dom';


export default function DisasterDashboard() {
    const [disasters, setDisasters] = useState([]);
    const [type, setType] = useState('');
    const [location, setLocation] = useState('');
    const [status, setStatus] = useState('');
    const [filterStatus, setFilterStatus] = useState(""); // "" means no filter


    const disasterTypes = ["Flood", "Earthquake", "Fire", "Hurricane", "Tornado", "Landslide"];
    const statuses = ["New", "Ongoing", "Resolved"];

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const data = await getDisasters();
            setDisasters(data);
        } catch (err) {
            console.error("Error fetching disasters:", err);
        }
    }

    async function handleAdd(e) {
        e.preventDefault();
        if (!type || !location || !status) return;
        await addDisaster({ type, location, status });
        setType(''); setLocation(''); setStatus('');
        fetchData();
    }

    async function handleDelete(id) {
        await deleteDisaster(id);
        fetchData();
    }

    return (
        <div>


            {/* Page content */}
            <div className="container mt-4">
                <div className="mb-4">
                    <h1 className="display-5">Relief Coordination Dashboard</h1>
                    <p className="text-muted">Manage disasters, volunteers, resources, and maps efficiently.</p>
                </div>
                {/* Add Disaster Form */}
                <div className="card mb-4 shadow-sm">
                    <div className="card-body">
                        <h2 className="card-title mb-4">Add New Disaster</h2>
                        <form className="row g-3" onSubmit={handleAdd}>
                            <div className="col-md-3">
                                <select
                                    className="form-select"
                                    value={type}
                                    onChange={e => setType(e.target.value)}
                                    required
                                >
                                    <option value="">Select Type</option>
                                    {disasterTypes.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Location"
                                    value={location}
                                    onChange={e => setLocation(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="col-md-3">
                                <select
                                    className="form-select"
                                    value={status}
                                    onChange={e => setStatus(e.target.value)}
                                    required
                                >
                                    <option value="">Select Status</option>
                                    {statuses.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-3">
                                <button type="submit" className="btn btn-primary w-100">
                                    Add Disaster
                                </button>
                            </div>
                        </form>
                    </div>
                </div>



                {/* Disaster Table */}
                <div className="card shadow-sm">
                    <div className="card-body">
                        <h2 className="card-title mb-2">Disaster Reports</h2>
                        <div className="col-md-3 mb-4">
                            <select
                                className="form-select"
                                value={filterStatus}
                                onChange={e => setFilterStatus(e.target.value)}
                            >
                                <option value="">Filter: All</option>
                                {statuses.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Type</th>
                                    <th>Location</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {disasters
                                    .filter(d => !filterStatus || d.status === filterStatus)
                                    .map(d => (
                                        <tr key={d.id}>
                                            <td>
                                                <Link to={`/disaster-tasks/${d.id}`}>{d.id}</Link>
                                            </td>
                                            <td>{d.type}</td>
                                            <td>{d.location}</td>
                                            <td>
          <span className={`badge ${
              d.status === 'New' ? 'bg-danger' :
                  d.status === 'Ongoing' ? 'bg-warning' :
                      'bg-success'  // Resolved
          }`}>
  {d.status}
</span>

                                            </td>
                                            <td>
                                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(d.id)}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
