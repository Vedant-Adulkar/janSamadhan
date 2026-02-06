// Issue categories
export const CATEGORIES = [
    'Road',
    'Garbage',
    'Water',
    'Electricity',
    'Other'
];

// Issue status types
export const STATUS = {
    REPORTED: 'REPORTED',
    IN_PROGRESS: 'IN_PROGRESS',
    FIXED: 'FIXED'
};

// Status display names
export const STATUS_LABELS = {
    REPORTED: 'Reported',
    IN_PROGRESS: 'In Progress',
    FIXED: 'Fixed'
};

// Status colors (Tailwind classes)
export const STATUS_COLORS = {
    REPORTED: 'bg-red-500 text-white',
    IN_PROGRESS: 'bg-amber-500 text-white',
    FIXED: 'bg-green-500 text-white'
};

// Default map center (India - New Delhi)
export const DEFAULT_CENTER = {
    lat: 28.6139,
    lng: 77.2090
};
