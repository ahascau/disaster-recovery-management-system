
import { useEffect, useState } from 'react';
import { getVolunteers, addVolunteer } from './../api/volunteers.js';
import {Link} from "react-router-dom";

export default function VolunteersPage() {
    const [volunteers, setVolunteers] = useState([]);
    const [name, setName] = useState('');
    const [skill, setSkill] = useState('');
    const [availability, setAvailability] = useState('');
    const [filter, setFilter] = useState(""); // "" means no filter
    const filteredVolunteers = volunteers.filter(v => filter === '' || v.availability === filter);
    const availabilityOptions = ['','Available', 'Deployed', 'Unavailable'];
    const skillOptions = [
        'Medical',
        'First Aid',
        'Search & Rescue',
        'Logistics',
        'Shelter Management',
        'Food Distribution',
        'Water & Sanitation',
        'Communication',
        'Counseling',
        'Transport / Driving',
        'Technical Support',
        'Coordination'
    ];


    useEffect(() => {
        fetchVolunteers();
    }, []);

    async function fetchVolunteers() {
        const data = await getVolunteers();
        setVolunteers(data);
    }

    async function handleAdd(e) {
        e.preventDefault();
        await addVolunteer({ name, skill, availability });
        setName('');
        setSkill('');
        setAvailability('');
        fetchVolunteers();
    }

    return (
        <div>
            <h2 className="mb-4">Volunteers</h2>

            {/* Add Volunteer */}
            <div className="card mb-4 shadow-sm">
                <div className="card-body">
                    <form className="row g-3" onSubmit={handleAdd}>
                        <div className="col-md-4">
                            <input
                                className="form-control"
                                placeholder="Name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="col-md-4">
                            <select
                                className="form-select"
                                value={skill}
                                onChange={e => setSkill(e.target.value)}
                                required
                            >
                                <option value="">Skill</option>
                                {skillOptions.map(a => (
                                    <option key={a} value={a}>{a}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-3">
                            <select
                                className="form-select"
                                value={availability}
                                onChange={e => setAvailability(e.target.value)}
                                required
                            >
                                <option value="">Availability</option>
                                {availabilityOptions.map(a => (
                                    <option key={a} value={a}>{a}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-1">
                            <button className="btn btn-primary w-100">Add</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="mb-3">
                <label className="form-label me-2">Filter by Availability:</label>
                <select
                    className="form-select w-auto d-inline"
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                >
                    <option value="">All Volunteers</option>
                    <option value="Available">Available</option>
                    <option value="Deployed">Deployed</option>
                    <option value="Unavailable">Unavailable</option>
                </select>

            </div>

            {/* Volunteers Table */}
            <div className="card shadow-sm">
                <div className="card-body">
                    <table className="table table-striped">
                        <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Skill</th>
                            <th>Availability</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredVolunteers.map(v => (
                            <tr key={v.id}>
                                <td>{v.id}</td>
                                <td>
                                    <Link to={`/tasks/${v.id}`}>{v.name}</Link>
                                </td>
                                <td>{v.skill}</td>
                                <td>
                                    <span className={`badge ${
                                    v.availability === 'Available' ? 'bg-success' :
                                     v.availability === 'Deployed' ? 'bg-warning' :
                                     'bg-secondary'
                                     }`}>
                                     {v.availability}
                                    </span>
                                </td>
                            </tr>

                        ))}


                        {filteredVolunteers.length === 0 && (
                            <tr>
                                <td colSpan="4" className="text-center">
                                    No volunteers found
                                </td>

                            </tr>

                        )}
                        </tbody>


                    </table>
                </div>
            </div>
        </div>
    );
}
