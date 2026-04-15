import React, { useState, useEffect } from 'react';

function App() {
    const [view, setView] = useState('form');
    const [formData, setFormData] = useState({ name: '', email: '', rating: 5, message: '' });
    const [feedbacks, setFeedbacks] = useState([]);

    // Fetch feedbacks
    const fetchFeedbacks = async () => {
        const res = await fetch('http://localhost:5000/api/feedback');
        const data = await res.json();
        setFeedbacks(data);
    };

    useEffect(() => {
        if (view === 'admin') fetchFeedbacks();
    }, [view]);

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch('http://localhost:5000/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        alert('Feedback submitted!');
        setFormData({ name: '', email: '', rating: 5, message: '' });
    };

    // Delete feedback
    const handleDelete = async (id) => {
        await fetch(`http://localhost:5000/api/feedback/${id}`, { method: 'DELETE' });
        fetchFeedbacks();
    };

    return (
        <div style={{ fontFamily: 'Arial', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h1> Feedback Portal</h1>
                <button onClick={() => setView('form')} style={btn}>Feedback Form</button>
                <button onClick={() => setView('admin')} style={btn}>Admin View</button>
            </div>

            {/* Feedback Form */}
            {view === 'form' && (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        style={input}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        style={input}
                    />
                    <select
                        value={formData.rating}
                        onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                        style={input}
                    >
                        <option value="5"> Excellent</option>
                        <option value="4">Good</option>
                        <option value="3"> Average</option>
                        <option value="2"> Poor</option>
                        <option value="1"> Very Poor</option>
                    </select>
                    <textarea
                        placeholder="Your feedback"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        style={{ ...input, minHeight: '100px' }}
                    />
                    <button type="submit" style={{ ...btn, fontSize: '18px', padding: '15px' }}>
                        Submit Feedback
                    </button>
                </form>
            )}

            {/* Admin View */}
            {view === 'admin' && (
                <div>
                    <h2>Total: {feedbacks.length}</h2>
                    {feedbacks.map(f => (
                        <div key={f._id} style={card}>
                            <h3>{f.name} - {''.repeat(f.rating)}</h3>
                            <p><b>Email:</b> {f.email}</p>
                            <p><b>Message:</b> {f.message}</p>
                            <p style={{ fontSize: '12px', color: '#666' }}>
                                {new Date(f.date).toLocaleString()}
                            </p>
                            <button onClick={() => handleDelete(f._id)} style={deleteBtn}>
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// Styles
const input = { padding: '12px', fontSize: '16px', border: '1px solid #1d1d1d', borderRadius: '5px' };
const btn = { padding: '10px 20px', margin: '5px', backgroundColor: '#b51a75', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const card = { border: '1px solid #5a1dbd', padding: '20px', marginBottom: '15px', borderRadius: '8px', backgroundColor: '#ddd9e2' };
const deleteBtn = { padding: '8px 15px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };

export default App;
