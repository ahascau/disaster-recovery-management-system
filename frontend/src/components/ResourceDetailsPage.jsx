import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getResourceDetails, assignResource } from './../api/resources';
import { getDisasters} from './../api/disasters';

function ResourceDetailsPage() {
    const { id } = useParams();

    const [resource, setResource] = useState(null);
    const [locations, setLocations] = useState([]);
    const [distributions, setDistributions] = useState([]);

    const [locationId, setLocationId] = useState('');
    const [disasterId, setDisasterId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [destination, setDestination] = useState('');
    const [disasters, setDisasters] = useState([]);



    useEffect(() => {
        fetchData();
    }, [id]);
    useEffect(() => {
        getDisasters().then(setDisasters);
    }, []);

    async function fetchData() {
        try {
            const data = await getResourceDetails(id);
            setResource(data.resource);
            setLocations(data.locations);
            setDistributions(data.distributions);
        } catch (err) {
            console.error('Error loading resource details', err);
        }
    }

    async function handleAssign(e) {
        e.preventDefault();

        if (!locationId || !disasterId || !quantity || !destination) {
            alert('Please fill all fields');
            return;
        }

        try {
            await assignResource({
                resource_id: id,
                location_id: locationId,
                disaster_id: disasterId,
                quantity: Number(quantity),
                destination
            });

            // Reset form
            setQuantity('');
            setDestination('');

            // Refresh data
            fetchData();
        } catch (err) {
            console.error('Assignment failed', err);
        }
    }

    if (!resource) return <p>Loading...</p>;

    return (
        <div className="container">
            <h3 className="mb-3">{resource.name}</h3>

            {/* Storage locations */}
            <div className="card mb-4">
                <div className="card-body">
                    <h5>Storage Locations</h5>
                    <table className="table table-sm">
                        <thead>
                        <tr>
                            <th>Location</th>
                            <th>Available Quantity</th>
                        </tr>
                        </thead>
                        <tbody>
                        {locations.map(l => (
                            <tr key={l.id}>
                                <td>{l.storage_location}</td>
                                <td>{l.quantity}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Distributions */}
            <div className="card mb-4">
                <div className="card-body">
                    <h5>Current Distributions</h5>
                    <table className="table table-sm">
                        <thead>
                        <tr>
                            <th>Disaster</th>
                            <th>Quantity</th>
                            <th>Destination</th>
                        </tr>
                        </thead>
                        <tbody>
                        {distributions.map(d => (
                            <tr key={d.id}>
                                <td>{d.disaster_type}</td>
                                <td>{d.quantity}</td>
                                <td>{d.destination}</td>
                            </tr>
                        ))}
                        {distributions.length === 0 && (
                            <tr>
                                <td colSpan="3" className="text-center">
                                    No distributions yet
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Assign resource */}
            <div className="card">
                <div className="card-body">
                    <h5>Assign Resource</h5>

                    <form onSubmit={handleAssign} className="row g-3">
                        <div className="col-md-3">
                            <select
                                className="form-select"
                                value={locationId}
                                onChange={e => setLocationId(e.target.value)}
                            >
                                <option value="">Select storage</option>
                                {locations.map(l => (
                                    <option key={l.id} value={l.id}>
                                        {l.storage_location} ({l.quantity})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-2">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Quantity"
                                value={quantity}
                                onChange={e => setQuantity(e.target.value)}
                            />
                        </div>

                        <div className="col-md-3">
                            <select
                                className="form-select"
                                value={disasterId}
                                onChange={e => {
                                    const selected = disasters.find(d => d.id === Number(e.target.value));
                                    setDisasterId(e.target.value);
                                    setDestination(`${selected.location} (${selected.type})`);
                                }}
                            >
                                <option value="">Select destination</option>
                                {disasters.map(d => (
                                    <option key={d.id} value={d.id}>
                                        {d.location} – {d.type}
                                    </option>
                                ))}
                            </select>
                        </div>


                        <div className="col-md-2">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Disaster ID"
                                value={disasterId}
                                onChange={e => setDisasterId(e.target.value)}
                            />
                        </div>

                        <div className="col-md-2">
                            <button className="btn btn-success w-100">
                                Assign
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ResourceDetailsPage;
