import { useEffect, useState } from 'react';
import {MapContainer, TileLayer, Marker, Popup, Circle} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../utils/leafletIcon';
import { getIncidents, getShelters } from './../api/gis';
import {getShelterIcon, shelterLegendIcons} from "./../utils/leafletIcon";


export default function GISMapPage() {
    const [incidents, setIncidents] = useState([]);
    const [shelters, setShelters] = useState([]);

    useEffect(() => {
        fetchIncidents();
    }, []);

    async function fetchIncidents() {
        try {
            const data = await getIncidents();
            setIncidents(data);
        } catch (err) {
            console.error(err);
        }
    }
    async function fetchShelters() {
        try {
            const data = await getShelters();
            setShelters(data);
        } catch (err) {
            console.error(err);
        }
    }
    useEffect(() => {
        fetchShelters();
    }, []);
    function getSeverityColor(severity) {
        if (severity >= 8) return '#e74c3c';
        if (severity >= 5) return '#f39c12';
        return '#2ecc71'; //
    }
    return (
        <div className="container mt-4">
            <h2 className="mb-4">GIS Map</h2>

            <div className="row">
                {/* LEGEND */}
                <div className="col-md-3">
                    <div className="card shadow-sm p-3">
                        <h5>Legend</h5>
                        <h6>Disaster's Location </h6>
                        <div className="mb-2">

                            <div className="d-flex align-items-center mb-2">
                                <div
                                    style={{
                                        width: 14,
                                        height: 14,
                                        borderRadius: '50%',
                                        background: '#e74c3c',
                                        marginRight: 8
                                    }}
                                />
                                <span>Critical (8–10)</span>
                            </div>

                            <div className="d-flex align-items-center mb-2">
                                <div
                                    style={{
                                        width: 14,
                                        height: 14,
                                        borderRadius: '50%',
                                        background: '#f39c12',
                                        marginRight: 8
                                    }}
                                />
                                <span>Medium (5–7)</span>
                            </div>

                            <div className="d-flex align-items-center mb-2">
                                <div
                                    style={{
                                        width: 14,
                                        height: 14,
                                        borderRadius: '50%',
                                        background: '#2ecc71',
                                        marginRight: 8
                                    }}
                                />
                                <span>Low (1–4)</span>
                            </div>

                        </div>

                        <h6>Shelter's Location </h6>
                            <div className="d-flex align-items-center mb-2">
                                <img src={shelterLegendIcons.open} width="22" />
                                <span className="ms-2">Open Shelter</span>
                            </div>

                            <div className="d-flex align-items-center mb-2">
                                <img src={shelterLegendIcons.full} width="22" />
                                <span className="ms-2">Full Shelter</span>
                            </div>

                            <div className="d-flex align-items-center mb-2">
                                <img src={shelterLegendIcons.closed} width="22" />
                                <span className="ms-2">Closed Shelter</span>
                            </div>
                    </div>
                </div>

                {/* MAP */}
                <div className="col-md-9">
                    <div className="card shadow-sm">
                        <div className="card-body p-0">
                            <MapContainer
                                center={[44.4268, 26.1025]}
                                zoom={11}
                                style={{ height: '70vh', width: '100%' }}
                            >
                                <TileLayer
                                    attribution="&copy; OpenStreetMap contributors"
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                {/* SHELTERS */}
                                {shelters.map(s => (
                                    <Marker
                                        key={s.id}
                                        position={[s.latitude, s.longitude]}
                                        icon={getShelterIcon(s.status)}
                                    >
                                        <Popup>
                                            <div>
                                                <h6>🏠 {s.name}</h6>
                                                <p>Capacity: {s.capacity}</p>
                                                <p>Status: {s.status}</p>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}

                                {/* DISASTERS */}
                                {incidents.map(d => (
                                    <Circle
                                        key={d.id}
                                        center={[Number(d.latitude), Number(d.longitude)]}
                                        radius={40}
                                        pathOptions={{
                                            color: getSeverityColor(d.severity),
                                            fillColor: getSeverityColor(d.severity),
                                            fillOpacity: 0.5
                                        }}
                                    >
                                        <Popup>
                                            <div>
                                                <h6>{d.type}</h6>
                                                <p>Severity: {d.severity}</p>
                                                <p>Status: {d.status}</p>
                                            </div>
                                        </Popup>
                                    </Circle>
                                ))}
                            </MapContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );}