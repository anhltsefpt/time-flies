import type { LifePhase } from '@/types';

export function getLifePhases(lifeExpectancy: number): LifePhase[] {
  return [
    { label: 'Childhood', range: [0, 12], color: '#60A5FA' },
    { label: 'Teenage', range: [12, 18], color: '#A78BFA' },
    { label: 'Young Adult', range: [18, 30], color: '#34D399' },
    { label: 'Prime', range: [30, 50], color: '#FBBF24' },
    { label: 'Mature', range: [50, 65], color: '#F97316' },
    { label: 'Golden Years', range: [65, lifeExpectancy], color: '#F472B6' },
  ];
}
