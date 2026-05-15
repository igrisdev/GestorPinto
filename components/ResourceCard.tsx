import { Resource } from '../types/resource';

export const ResourceCard = ({ title, description, link }: Omit<Resource, 'id'>) => {
  return (
    <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
      <h3 className="m-0 mb-2.5 text-gray-900">{title}</h3>
      <p className="text-gray-500 text-sm">{description}</p>
      <a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-600 font-semibold no-underline hover:underline"
      >
        Ver  →
      </a>
    </div>
  );
};