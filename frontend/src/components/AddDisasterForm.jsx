import { useState } from 'react';
import { addDisaster } from './../api/disasters';

export default function AddDisasterForm({ onAdded }) {
    const [type, setType] = useState('');
    const [location, setLocation] = useState('');
    const [status, setStatus] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        const newDisaster = await addDisaster({ type, location, status });
        onAdded(newDisaster);
        setType(''); setLocation(''); setStatus('');
    }

    return (
        <form onSubmit={handleSubmit}>
            <input value={type} onChange={e => setType(e.target.value)} placeholder="Type" />
            <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Location" />
            <input value={status} onChange={e => setStatus(e.target.value)} placeholder="Status" />
            <button type="submit">Add Disaster</button>
        </form>
    );
}
