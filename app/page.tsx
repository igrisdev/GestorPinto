import { ResourceCard } from '@/components/ResourceCard';
import { Resource } from '@/types/resource';

export default function RecursosPage() {
  // Este es el array que después vendrá de tu base de datos de Notion
  const resources: Resource[] = [
    {
      title: "Proyecto Alpha",
      description: "Planificación del primer trimestre de desarrollo.",
      link: "https://notion.so/..."
    },
    {
      title: "Guía de Estilo",
      description: "Documentación de colores y componentes UI.",
      link: "https://notion.so/..."
    }
  ];

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