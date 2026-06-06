import { getTasks } from './../api/tasks';
import { getVolunteerById } from './../api/volunteers';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

const VolunteerTasksPage = () => {
    const { volunteerId } = useParams();

    const [tasks, setTasks] = useState([]);
    const [volunteerName, setVolunteerName] = useState('');

    // Fetch tasks
    useEffect(() => {
        async function fetchTasksData() {
            if (!volunteerId) return;

            try {
                const data = await getTasks(volunteerId);
                setTasks(data);
            } catch (err) {
                console.error('Error fetching tasks:', err);
            }
        }

        fetchTasksData();
    }, [volunteerId]);

    // Fetch volunteer name
    useEffect(() => {
        async function fetchVolunteer() {
            if (!volunteerId) return;

            try {
                const v = await getVolunteerById(volunteerId);
                setVolunteerName(v.name);
            } catch (err) {
                console.error('Error fetching volunteer:', err);
            }
        }

        fetchVolunteer();
    }, [volunteerId]);

    return (
        <div className="container mt-4">
            <h2>
                Tasks for {volunteerName || `Volunteer ID: ${volunteerId}`}
            </h2>

            <div className="card shadow-sm">
                <div className="card-body">
                    <table className="table table-striped">
                        <thead className="table-dark">
                        <tr>
                            <th>Task</th>
                            <th>Disaster ID</th>
                            <th>Status</th>
                        </tr>
                        </thead>

                        <tbody>
                        {tasks.map((t) => (
                            <tr key={t.id}>
                                <td>{t.task_description}</td>
                                <td>{t.disaster_id}</td>
                                <td>{t.status}</td>
                                <td>
                    <span
                        className={`badge ${
                            t.status === 'Assigned'
                                ? 'bg-primary'
                                : t.status === 'In Progress'
                                    ? 'bg-warning'
                                    : 'bg-success'
                        }`}
                    >
                      {t.status}
                    </span>
                                </td>
                            </tr>
                        ))}

                        {tasks.length === 0 && (
                            <tr>
                                <td colSpan="3" className="text-center">
                                    No tasks assigned
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VolunteerTasksPage;