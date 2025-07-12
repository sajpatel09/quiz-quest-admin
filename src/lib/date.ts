export function formatDateTime(date: any, options = {}) {
    const defaultOptions = {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
    };

    const formatter = new Intl.DateTimeFormat('en-IN', {...defaultOptions, ...options});
    return formatter.format(new Date(date));
}
