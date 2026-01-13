import { FILTER_OPTIONS } from "../../constants/status";

const FILTER_CONFIG = {
  [FILTER_OPTIONS.ALL]: {
    title: "All Links",
    icon: (
      <svg
        className="w-5 h-5 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
      </svg>
    ),
    bgColor: "bg-blue-100",
    activeColor: "border-blue-500 ring-2 ring-blue-200",
  },
  [FILTER_OPTIONS.PROCESSED]: {
    title: "Processed",
    icon: (
      <svg
        className="w-5 h-5 text-green-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
    bgColor: "bg-green-100",
    activeColor: "border-green-500 ring-2 ring-green-200",
  },
  [FILTER_OPTIONS.FAILED]: {
    title: "Failed",
    icon: (
      <svg
        className="w-5 h-5 text-red-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
    bgColor: "bg-red-100",
    activeColor: "border-red-500 ring-2 ring-red-200",
  },
};

function FilterCard({ filterKey, count, isActive, onClick }) {
  const config = FILTER_CONFIG[filterKey];

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer border flex-shrink-0 ${
        isActive ? config.activeColor : "border-gray-200"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 ${config.bgColor} rounded-full flex items-center justify-center`}
        >
          {config.icon}
        </div>
        <div className="min-w-0">
          <h3 className="font-medium text-gray-900">{config.title}</h3>
          <p className="text-sm text-gray-500">{count} links</p>
        </div>
      </div>
    </div>
  );
}

export function FilterCards({ filter, onFilterChange, linkCounts, onAddClick }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {Object.values(FILTER_OPTIONS).map((filterKey) => (
        <FilterCard
          key={filterKey}
          filterKey={filterKey}
          count={linkCounts[filterKey]}
          isActive={filter === filterKey}
          onClick={() => onFilterChange(filterKey)}
        />
      ))}
      <button
        onClick={onAddClick}
        className="ml-auto px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium flex items-center justify-center gap-2 flex-shrink-0 h-fit my-auto"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
        </svg>
        Add YouTube Link
      </button>
    </div>
  );
}
