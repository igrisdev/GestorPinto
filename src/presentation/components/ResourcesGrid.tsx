"use client";

import { ResourceCard } from "@/presentation/components/ResourceCard";
import type { Resource } from "@/domain/entities/resource";

interface ResourcesGridProps {
  resources: Resource[];
}

export function ResourcesGrid({ resources }: ResourcesGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {resources.map((item) => (
        <ResourceCard
          key={item.id}
          title={item.title}
          description={item.description}
          link={item.link}
        />
      ))}
    </div>
  );
}
