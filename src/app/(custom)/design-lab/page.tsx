import type { Metadata } from 'next';
import { DesignLab } from './design-lab';

export const metadata: Metadata = {
  title: 'Design Lab',
  description:
    'Explore five animated visual directions for the next evolution of the InternAI experience.',
  alternates: { canonical: '/design-lab' },
};

export default function DesignLabPage() {
  return <DesignLab />;
}
