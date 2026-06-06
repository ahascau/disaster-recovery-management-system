import { useEffect, useState } from 'react';
import { getMyTasks } from './../api/tasks';
import { updateTaskStatus } from './../api/tasks';

export default function MyTasksPage() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetchTasks();
    }, []);

    async function fetchTasks() {
        try {
            const data = await getMyTasks();
            setTasks(data);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4">My Tasks</h2>

            <div className="card shadow-sm">
                <div className="card-body">
                    <table className="table table-striped">
                        <thead className="table-dark">
                        <tr>
                            <th>Task</th>
                            <th>Disaster ID</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {tasks.map(t => (
                            <tr key={t.id}>
                                <td>{t.task_description}</td>
                                <td>{t.disaster_id}</td>
                                <td>
            <span className={`badge ${
                t.status === 'Assigned'
                    ? 'bg-primary'
                    : t.status === 'In Progress'
                        ? 'bg-warning'
                        : 'bg-success'
            }`}>
                {t.status}
            </span>
                                </td>

                                <td>
                                    {t.status === 'Assigned' && (
                                        <button
                                            className="btn btn-sm btn-outline-warning"
                                            onClick={async () => {
                                                await updateTaskStatus(t.id, 'In Progress');
                                                await fetchTasks();
                                            }}
                                        >
                                            Start
                                        </button>
                                    )}

                                    {t.status === 'In Progress' && (
                                        <button
                                            className="btn btn-sm btn-outline-success"
                                            onClick={async () => {
                                                await updateTaskStatus(t.id, 'Completed');
                                                await fetchTasks();
                                            }}
                                        >
                                            Complete
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}