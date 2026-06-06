import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTasksByDisaster, assignVolunteerToTask } from './../api/tasks';
import { getVolunteers } from './../api/volunteers';

function DisasterTasksPage() {
    const { id } = useParams();
    const [tasks, setTasks] = useState([]);
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [tasksData, volsData] = await Promise.all([
                    getTasksByDisaster(id),
                    getVolunteers()
                ]);
                setTasks(Array.isArray(tasksData) ? tasksData : []);
                setVolunteers(Array.isArray(volsData) ? volsData : []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [id]);

    async function handleAssign(taskId, volunteerId) {
        try {
            await assignVolunteerToTask(taskId, volunteerId);
            // Refresh tasks
            const updatedTasks = await getTasksByDisaster(id);
            setTasks(Array.isArray(updatedTasks) ? updatedTasks : []);
            // Refresh volunteers so availability updates
            const updatedVols = await getVolunteers();
            setVolunteers(Array.isArray(updatedVols) ? updatedVols : []);
        } catch (err) {
            console.error('Error assigning volunteer', err);
        }
    }


    if (loading) return <p>Loading tasks...</p>;

    return (
        <div>
            <h2>Tasks for Disaster ID: {id}</h2>
            <table className="table table-striped">
                <thead className="table-dark">
                <tr>
                    <th>Task ID</th>
                    <th>Description</th>
                    <th>Assigned Volunteer</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {tasks.length > 0 ? (
                    tasks.map(t => (
                        <tr key={t.id}>
                            <td>{t.id}</td>
                            <td>{t.task_description}</td>
                            <td>
                                {t.volunteer_name ? (
                                    t.volunteer_name
                                ) : (
                                    <select
                                        className="form-select"
                                        defaultValue=""
                                        onChange={(e) => handleAssign(t.id, e.target.value)}
                                    >
                                        <option value="">Assign volunteer</option>
                                        {volunteers
                                            .filter(v => v.availability === 'Available') // only show available
                                            .map(v => (
                                                <option key={v.id} value={v.id}>{v.name}</option>
                                            ))}
                                    </select>

                                )}
                            </td>
                            <td>
                                    <span className={`badge ${
                                        t.status === 'Pending' ? 'bg-danger' :
                                            t.status === 'Completed' ? 'bg-success' :
                                                'bg-info'
                                    }`}>
                                        {t.status}
                                    </span>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4" className="text-center">No tasks assigned</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}

export default DisasterTasksPage;
