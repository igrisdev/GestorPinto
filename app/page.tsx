
import { ResourceCard } from '@/components/ResourceCard';
import { Resource } from '@/types/resource';
import { getLinks } from './lib/notion';

export default async function RecursosPage() {
  // Este es el array que después vendrá de tu base de datos de Notion
  const resources: Resource[] = await getLinks();

  console.log(resources); // Para verificar que estás obteniendo los datos correctamentes

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Mis recursos</h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '20px' 
      }}>
        {resources.map((item, index) => (
          <ResourceCard 
            key={index}
            title={item.title}
            description={item.description}
            link={item.link}
          />
        ))}
      </div>
    </main>
  );
}