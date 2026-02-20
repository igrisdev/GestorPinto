import { Resource } from '../types/resource';

export const ResourceCard = ({ title, description, link }: Omit<Resource, 'id'>) => {
  return (
    <div style={{
      border: '1px solid #eaeaea',
      borderRadius: '12px',
      padding: '1.5rem',
      backgroundColor: '#fff',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#111' }}>{title}</h3>
      <p style={{ color: '#666', fontSize: '14px' }}>{description}</p>
      <a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer"
        style={{ color: '#0070f3', fontWeight: '600', textDecoration: 'none' }}
      >
        Ver  →
      </a>
    </div>
  );
};