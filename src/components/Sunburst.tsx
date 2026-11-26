/**
 * A small radial-gradient "sun" circle — the one place this redesign uses a
 * gradient, echoing the glowing circles in the reference posters. Kept to a
 * single modest decorative flourish rather than a page-wide wash.
 */
export default function Sunburst({ className }: { className?: string }) {
  return <div className={className ? `sunburst ${className}` : 'sunburst'} aria-hidden="true" />
}
