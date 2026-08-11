export default function Container({ children }) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {children}
    </div>
  );
}