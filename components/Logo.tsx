export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative h-8 w-8">
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          {/* Bead circle */}
          <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" />
          
          {/* Inner diamond/sparkle */}
          <path
            d="M16 6L20 12L16 18L12 12Z"
            fill="currentColor"
            opacity="0.8"
          />
          
          {/* Decorative elements */}
          <circle cx="16" cy="16" r="3" fill="currentColor" opacity="0.6" />
          <circle cx="9" cy="9" r="1.5" fill="currentColor" opacity="0.4" />
          <circle cx="23" cy="23" r="1.5" fill="currentColor" opacity="0.4" />
        </svg>
      </div>
      <span className="text-lg font-semibold tracking-tight">AuraBeads</span>
    </div>
  );
}
