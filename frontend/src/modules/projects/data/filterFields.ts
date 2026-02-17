
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
        key: "createdFromDate",
        label: "Created From",
        type: "date" as const,
    },
    {
        key: "createdToDate",
        label: "Created To",
        type: "date" as const,
    },
    {
        key: "startFromDate",
        label: "Project Starts From",
        type: "date" as const,
    },
    {
        key: "startToDate",
        label: "Project Starts To",
        type: "date" as const,
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