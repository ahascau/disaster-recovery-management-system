import { useEffect, useState } from 'react';
import { getDisasters, addDisaster, deleteDisaster } from './../api/disasters';

export default function DisasterDashboard() {
    const [disasters, setDisasters] = useState([]);
    const [type, setType] = useState('');
    const [location, setLocation] = useState('');
    const [status, setStatus] = useState('');
    const disasterTypes = ["Flood", "Earthquake", "Fire", "Hurricane", "Tornado", "Landslide"];

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        const data = await getDisasters();
        setDisasters(data);
    }

    async function handleAdd(e) {
        e.preventDefault();
        await addDisaster({ type, location, status });
        setType(''); setLocation(''); setStatus('');
        fetchData();
    }

    async function handleDelete(id) {
        await deleteDisaster(id);
        fetchData();
    }

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Disaster Reports</h1>

            {/* Add Disaster Form */}
            <form className="row g-3 mb-4" onSubmit={handleAdd}>
                <div className="col-md-3">
                    <select
                        className="form-select"
                        value={type}
                        onChange={e => setType(e.target.value)}
                        required
                    >
                        <option value="">Select Type</option> {/* Placeholder */}
                        {disasterTypes.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
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
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Status"
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                        required
                    />
                </div>
                <div className="col-md-3">
                    <button type="submit" className="btn btn-primary w-100">
                        Add Disaster
                    </button>
                </div>
            </form>

            {/* Disaster Table */}
            <div className="table-responsive">
                <table className="table table-bordered table-hover">
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
                    {disasters.map(d => (
                        <tr key={d.id}>
                            <td>{d.id}</td>
                            <td>{d.type}</td>
                            <td>{d.location}</td>
                            <td>
                  <span className={`badge ${d.status === 'Ongoing' ? 'bg-danger' : 'bg-success'}`}>
                    {d.status}
                  </span>
                            </td>
                            <td>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(d.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
