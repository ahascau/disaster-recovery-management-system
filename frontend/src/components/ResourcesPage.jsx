import React, { useEffect, useState } from 'react';
import { getResources, updateResource, addResource } from './../api/resources';
import { Link } from 'react-router-dom';

const ResourcesPage = () => {
    const [resources, setResources] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', quantity: 0, status: 'Available' });
    const [newResource, setNewResource] = useState({ name: '', quantity: 0, status: 'Available' });

    // Fetch all resources on load
    useEffect(() => {
        async function fetchData() {
            const data = await getResources();
            setResources(data);
        }
        fetchData();
    }, []);

    // Edit existing resource
    const startEditing = (resource) => {
        setEditingId(resource.id);
        setFormData({ name: resource.name, quantity: resource.quantity, status: resource.status });
    };

    const saveEdit = async () => {
        const updated = await updateResource({ id: editingId, ...formData });
        setResources(resources.map(r => r.id === updated.id ? updated : r));
        setEditingId(null);
    };

    // Add new resource
    const handleAddResource = async () => {
        const added = await addResource(newResource); // use API function
        setResources([...resources, added]);
        setNewResource({ name: '', quantity: 0, status: 'Available' });
    };

    return (
        <div className="container mt-4">
            <h2>Resources</h2>

            {/* Add new resource */}
            <div className="card mb-3 p-3 shadow-sm">
                <h5>Add New Resource</h5>
                <div className="row g-2 align-items-center">
                    <div className="col-auto">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Name"
                            value={newResource.name}
                            onChange={e => setNewResource({ ...newResource, name: e.target.value })}
                        />
                    </div>
                    <div className="col-auto">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Quantity"
                            value={newResource.quantity}
                            onChange={e => setNewResource({ ...newResource, quantity: e.target.value })}
                        />
                    </div>

                    <div className="col-auto">
                        <button className="btn btn-success" onClick={handleAddResource}>Add Resource</button>
                    </div>
                </div>
            </div>

            {/* Resources table */}
            <div className="table-responsive">
            <table className="table table-striped">
                <thead className="table-dark">
                <tr>
                    <th>Name</th>

                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                {resources.map(r => (
                    <tr key={r.id}>
                        <td>
                            {editingId === r.id ? (
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            ) : r.name}
                        </td>

                        <td>
                            {editingId === r.id ? (
                                <select
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="Available">Available</option>
                                    <option value="Depleted">Depleted</option>
                                    <option value="Reserved">Reserved</option>
                                </select>
                            ) : (
                                <span
                                    className={`badge ${
                                        r.status === 'Available'
                                            ? 'bg-success'
                                            : r.status === 'Depleted'
                                                ? 'bg-secondary'
                                                : 'bg-warning'
                                    }`}
                                >
              {r.status}
            </span>
                            )}
                        </td>
                        <td>
                            <Link to={`/resources/${r.id}`} className="btn btn-sm btn-primary me-2">
                                View Details
                            </Link>


                            {editingId === r.id ? (
                                <button className="btn btn-success btn-sm" onClick={saveEdit}>Save</button>
                            ) : (
                                <button className="btn btn-primary btn-sm" onClick={() => startEditing(r)}>Edit</button>
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

export default ResourcesPage;
