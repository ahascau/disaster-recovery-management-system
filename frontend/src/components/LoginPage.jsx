import { useState } from 'react';
import { login } from './../api/auth';
import { useNavigate } from 'react-router-dom';
import { setAuth } from './../api/authSync';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        try {
            const data = await login(email, password);

            setAuth(data);
            navigate('/');
            console.log("LOGIN RESPONSE:", data);
        } catch (err) {
            setError('Invalid email or password');
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
            <div className="card shadow-sm" style={{ width: '400px' }}>
                <div className="card-body">
                    <h3 className="mb-4 text-center">Login</h3>

                    <form onSubmit={handleSubmit} className="row g-3">

                        {/* Email */}
                        <div className="col-12">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="col-12">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="col-12">
                                <div className="alert alert-danger py-2 mb-0">
                                    {error}
                                </div>
                            </div>
                        )}

                        {/* Button */}
                        <div className="col-12">
                            <button className="btn btn-primary w-100">
                                Login
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}