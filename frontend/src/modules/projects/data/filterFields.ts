
export const filterFields = [
    {
        key: "status",
        label: "Status",
        type: "select" as const,
        options: [
            { value: "active", label: "Active" },
            { value: "on_hold", label: "On Hold" },
            { value: "completed", label: "Completed" },
        ],
    },
    {
        key: "sortBy",
        label: "Sort By",
        type: "select" as const,
        options: [
            { value: "createdAt", label: "Created Date" },
            { value: "startDate", label: "Start Date" },
        ],
    },
    {
        key: "sortOrder",
        label: "Order",
        type: "select" as const,
        options: [
            { value: "desc", label: "Newest First" },
            { value: "asc", label: "Oldest First" },
        ],
    },
];