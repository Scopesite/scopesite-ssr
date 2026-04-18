/**
 * Small inline loading spinner. Sized by the surrounding text context
 * (1em x 1em). Used inside buttons during POST actions so there is no
 * layout shift between "Idle" and "Loading" states.
 */

interface Props {
  className?: string;
  /** Accessible label. Defaults to "Loading". */
  label?: string;
}

export function Spinner({ className, label = 'Loading' }: Props) {
  return (
    <svg
      className={['animate-spin', className].filter(Boolean).join(' ')}
      viewBox="0 0 24 24"
      fill="none"
      width="1em"
      height="1em"
      aria-hidden="true"
      role="img"
    >
      <title>{label}</title>
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default Spinner;
