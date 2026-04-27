import type { PatientStatus } from '../../types';
import { Badge, type Tone } from './Badge';

const map: Record<PatientStatus, { tone: Tone; label: string }> = {
  critical: { tone: 'danger', label: 'Critical' },
  stable: { tone: 'success', label: 'Stable' },
  recovering: { tone: 'info', label: 'Recovering' },
  discharged: { tone: 'neutral', label: 'Discharged' },
};

export function StatusBadge({ status }: { status: PatientStatus }) {
  const { tone, label } = map[status];
  return (
    <Badge tone={tone} dot>
      {label}
    </Badge>
  );
}
