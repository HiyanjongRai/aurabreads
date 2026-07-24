export function Divider({ text = 'OR' }: { text?: string }) {
  return (
    <div className="relative my-8 flex items-center">
      <div className="flex-1 border-t border-gray-200" />
      {text && (
        <>
          <span className="mx-4 text-xs font-medium uppercase tracking-wider text-gray-400">
            {text}
          </span>
          <div className="flex-1 border-t border-gray-200" />
        </>
      )}
    </div>
  );
}
