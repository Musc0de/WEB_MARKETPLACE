/**
 * shared.ts — shared utilities for Customers feature (no duplicate code)
 */

// ─── Avatar ─────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  'bg-violet-500',
  'bg-blue-500',
  'bg-emerald-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-cyan-500',
  'bg-rose-500',
  'bg-teal-500',
];

export function getAvatarColor(name: string): string {
  return AVATAR_COLORS[(name?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];
}

export function getInitials(firstName?: string, lastName?: string, email?: string): string {
  if (firstName || lastName) {
    return [firstName?.[0], lastName?.[0]].filter(Boolean).join('').toUpperCase() || '?';
  }
  return (email?.[0] ?? '?').toUpperCase();
}

export function getDisplayName(
  firstName?: string,
  lastName?: string,
  fallback = 'No Name',
): string {
  const name = `${firstName || ''} ${lastName || ''}`.trim();
  return name || fallback;
}

// ─── Status badge ────────────────────────────────────────────────────────────
export function CustomerStatusBadge({ status }: { status: string }) {
  const active = status === 'active';
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
        active ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-red-400'}`} />
      {active ? 'Active' : status}
    </span>
  );
}

// ─── Avatar component ────────────────────────────────────────────────────────
export function CustomerAvatar({
  firstName,
  lastName,
  email,
  size = 'md',
}: {
  firstName?: string;
  lastName?: string;
  email?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  const initials = getInitials(firstName, lastName, email);
  const color = getAvatarColor(firstName || email || '');
  const dim = size === 'xl'
    ? 'w-16 h-16 text-xl'
    : size === 'lg'
    ? 'w-12 h-12 text-base'
    : size === 'md'
    ? 'w-9 h-9 text-sm'
    : 'w-7 h-7 text-xs';
  return (
    <div
      className={`${dim} ${color} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}
    >
      {initials}
    </div>
  );
}
