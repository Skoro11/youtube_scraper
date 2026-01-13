import { LinkTableRow } from "./LinkTableRow";

export function LinksTable({ links, onView, onDelete }) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
              My YouTube Links
            </h2>
            <p className="text-gray-600 mt-1 text-sm lg:text-base">
              Manage your YouTube links and send them to n8n
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm lg:text-base">
                  Title
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm lg:text-base hidden md:table-cell">
                  YouTube URL
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm lg:text-base">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm lg:text-base">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {links.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">
                    No links found. Add your first YouTube link!
                  </td>
                </tr>
              ) : (
                links.map((link) => (
                  <LinkTableRow
                    key={link.id}
                    link={link}
                    onView={onView}
                    onDelete={onDelete}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
