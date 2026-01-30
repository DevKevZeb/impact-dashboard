interface TableSkeletonProps {
  columns: number; 
  rows?: number;
}

export default function TableSkeleton({ columns, rows = 1 }: TableSkeletonProps) {
  const skeletonRows = Array.from({ length: rows });

  return (
    <div className="table-wrapper">
      <table className="table-default animate-pulse">
        <thead className="table-head">
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i}>
                <div className="h-4 bg-gray-200 rounded w-20 mx-auto" />
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {skeletonRows.map((_, r) => (
            <tr key={r} className="table-row">
              {Array.from({ length: columns }).map((_, c) => (
                <td key={c} className="table-cell">
                  <div className="h-4 bg-gray-200 rounded w-full max-w-[150px]" />
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td colSpan={columns} className="table-pagination-cell">
              <div className="table-pagination-container">
                <div className="h-4 w-28 bg-gray-200 rounded"></div>

                <div className="table-pagination-actions">
                  <div className="h-5 w-12 bg-gray-200 rounded"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  <div className="h-5 w-12 bg-gray-200 rounded"></div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
