import React, { useState } from 'react';

// Assuming your schedules data looks something like this (adjust types/interfaces as needed):
/*
schedules: [
  {
    _id: "sch123",
    property: {
      name: "Sunrise Apartments",
      location: "Salt Lake, Sector V, Kolkata",
      price: 4500000
    },
    visitDate: "2025-04-15",
    visitTimeStart: "10:30",
    visitTimeEnd: "11:30",
    createdBy: {
      name: "Rahul Sharma",
      email: "rahul@example.com"
    },
    createdAt: "2025-03-20T14:20:00Z"
  },
  // ...
]
*/

const Schedules = ({
  _id,
  schedules,
  isLoading,
  error
}: {
  _id: string;
  schedules: any[] | null;     // ← better to type this properly later
  isLoading: boolean;
  error: any
}) => {
  const [page, setPage] = useState(1);
  const limit = 10; // you can make this changeable later

  console.log(schedules, "<---???")

  if (isLoading) {
    return <div className="p-6 text-center">Loading schedules...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600 text-center">Error: {error}</div>;
  }

  if (!schedules || schedules.length === 0) {
    return <div className="p-6 text-center text-gray-500">No scheduled visits found.</div>;
  }

  // Optional: simple client-side pagination (you can replace with server-side later)
//   const start = (page - 1) * limit;
//   const paginatedSchedules = schedules.slice(start, start + limit);
//   const totalPages = Math.ceil(schedules.length / limit);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6"></h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Property</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Location</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Price</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Visit Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Scheduled By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {schedules.map((sch) => (
              <tr key={sch._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  {sch.property_object_id?.property_details?.basic?.property_name || '—'}
                </td>
                <td className="px-6 py-4">
                  {sch.property_object_id?.property_details?.basic?.full_address || '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {sch.property_object_id?.property_details?.rent_details?.weekly_rent_price
                    ? `₹${Number(sch.property_object_id?.property_details?.rent_details?.weekly_rent_price).toLocaleString()}`
                    : '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {sch?.date
                    ? new Date(sch?.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })
                    : '—'}{' '}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {sch?.created_by?.first_name + " " + sch?.created_by.last_name || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    
    </div>
  );
};

export default Schedules;