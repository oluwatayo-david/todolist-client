import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


/**
 * Format date for display in a beautiful, readable format
 * Handles both Date objects and ISO date strings
 * @param date - Date object or ISO string (e.g., "2025-09-09T00:00:00.000Z")
 * @returns Formatted date string (e.g., "September 9, 2025")
 */
export const formatDateDisplay = (date: Date | string | null| undefined): string => {
    // Handle null, undefined, or empty string
    if (!date) {
        return '';
    }

    let dateObj: Date;

    // Convert string to Date object if needed
    if (typeof date === 'string') {
        dateObj = new Date(date);
    } else if (date instanceof Date) {
        dateObj = date;
    } else {
        return '';
    }

    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
        return '';
    }

    return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/**
 * Format date for backend API (YYYY-M-D format)
 * Handles both Date objects and ISO date strings
 * @param date - Date object or ISO string
 * @returns Formatted date string (e.g., "2025-2-1")
 */
export const formatDateForBackend = (date: Date | string): string => {
    if (!date) {
        return '';
    }

    let dateObj: Date;

    if (typeof date === 'string') {
        dateObj = new Date(date);
    } else if (date instanceof Date) {
        dateObj = date;
    } else {
        return '';
    }

    if (isNaN(dateObj.getTime())) {
        return '';
    }

    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();

    return `${year}-${month}-${day}`;
};

