export default function ResultsHeader({
  total,
}) {
  return (
    <div className="mb-8">

      <h1 className="text-4xl font-bold">
        Research Radar
      </h1>

      <p className="mt-2 text-gray-500">
        Discover research papers from OpenAlex.
      </p>

      <div className="mt-4 inline-flex rounded-lg bg-blue-100 px-4 py-2">

        <span className="font-semibold text-blue-700">
          {total} Papers Found
        </span>

      </div>

    </div>
  );
}