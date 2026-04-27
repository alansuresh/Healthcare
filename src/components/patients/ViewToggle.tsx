import { LayoutGrid, List } from 'lucide-react';
import type { ViewMode } from '../../types';
import { cn } from '../../utils/cn';

interface Props {
  view: ViewMode;
  onChange: (view: ViewMode) => void;
}

export function ViewToggle({ view, onChange }: Props) {
  return (
    <div
      role="tablist"
      aria-label="Switch view"
      className="relative inline-flex items-center rounded-xl border border-ink-200 bg-white p-1 text-sm shadow-sm dark:border-ink-700 dark:bg-ink-900"
    >
      {/* Sliding indicator */}
      <span
        aria-hidden
        className={cn(
          'absolute top-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-lg bg-gradient-to-br from-brand-500 to-teal-500 shadow-glow transition-all duration-300 ease-out',
          view === 'grid' ? 'left-1' : 'left-[calc(50%+0px)]',
        )}
      />
      <button
        role="tab"
        aria-selected={view === 'grid'}
        onClick={() => onChange('grid')}
        className={cn(
          'relative z-10 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-colors',
          view === 'grid' ? 'text-white' : 'text-ink-600 dark:text-ink-300',
        )}
      >
        <LayoutGrid className="h-4 w-4" />
        Grid
      </button>
      <button
        role="tab"
        aria-selected={view === 'list'}
        onClick={() => onChange('list')}
        className={cn(
          'relative z-10 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-colors',
          view === 'list' ? 'text-white' : 'text-ink-600 dark:text-ink-300',
        )}
      >
        <List className="h-4 w-4" />
        List
      </button>
    </div>
  );
}
