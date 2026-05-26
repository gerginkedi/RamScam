import { useEffect, useState } from 'react';
import '../styles/ArtifactModal.css';

export default function ArtifactModal({ onSelect }) {
    const [artifacts, setArtifacts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArtifacts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/artifacts/random', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setArtifacts(data);
                }
            } catch (err) {
                console.error('Artifacts fetch failed', err);
            } finally {
                setLoading(false);
            }
        };
        fetchArtifacts();
    }, []);

    const handleSelect = async (artifact) => {
        try {
            const token = localStorage.getItem('token');
            await fetch('/api/artifacts/select', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(artifact.id)
            });
            onSelect(artifact);
        } catch (err) {
            console.error('Artifact selection failed', err);
            // Fallback: still continue locally
            onSelect(artifact);
        }
    };

    if (loading) return null;

    return (
        <div className='artifact-overlay'>
            <div className='artifact-modal'>
                <div className="artifact-header">
                    <h2>Artifact Seçimi</h2>
                    <p>Bu "Run" boyunca pasif avantaj sağlayacak bir artifact seçin.</p>
                </div>
                <div className='artifact-list'>
                    {artifacts.map(a => (
                        <div key={a.id} className='artifact-card' onClick={() => handleSelect(a)}>
                            <div className="artifact-icon-box">💎</div>
                            <h3>{a.name}</h3>
                            <p>{a.description}</p>
                            <div className="artifact-select-hint">Seçmek için tıkla</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
