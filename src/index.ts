import { format, formatDistance, isValid, Locale } from "date-fns";

/**
 * Input types definition
 */
export type DateInput =
  | Date
  | number // Unix timestamp in seconds or milliseconds
  | string; // ISO string, YYYY-MM-DD, etc.

/**
 * Output format types definition
 */
export type DateOutputFormat =
  | "ISO" // ISO string: '2023-01-03T00:00:00.000Z'
  | "YYYY-MM-DD" // '2023-01-03'
  | "YYYY-MM-DD HH:MM" // '2023-01-03 12:30'
  | "MMM D, YYYY" // 'Jan 3, 2023'
  | "MMMM D, YYYY" // 'January 3, 2023'
  | "MMM D, HH:mm" // 'Jan 3, 14:30'
  | "MMM D YYYY, HH:mm" // 'Jan 3, 2023, 14:30'
  | "timestamp-seconds" // Unix timestamp in seconds
  | "timestamp-ms" // Unix timestamp in milliseconds
  | "relative" // '2 hours ago', '3 days ago', etc.
  | "month-day" // 'Jan 3'
  | "custom"; // Custom format using date-fns format tokens

/**
 * Configuration options
 */
export interface DateUtilOptions {
  locale?: Locale;
  timestampUnit?: "seconds" | "milliseconds";
  customFormat?: string; // Add customFormat option for custom date-fns format
}

/**
 * Date conversion result
 */
export interface DateResult {
  success: boolean;
  value?: string | number;
  error?: string;
  date?: Date;
}

/**
 * Unified date utility function
 *
 * @param input - Input date (Date, timestamp, ISO string, etc.)
 * @param outputFormat - Desired output format
 * @param options - Additional options
 * @returns DateResult - Conversion result
 *
 * @example
 * Convert ISO string to 'YYYY-MM-DD' format
 * formatDate('2023-01-03T12:30:45.000Z', 'YYYY-MM-DD');
 *  => { success: true, value: '2023-01-03', date: Date object }
 *
 *  Convert timestamp to relative time
 * formatDate(1672747845, 'relative', { timestampUnit: 'seconds' });
 *  => { success: true, value: '2 hours ago', date: Date object }
 */
export const formatDate = (
  input: DateInput,
  outputFormat: DateOutputFormat = "ISO",
  options: DateUtilOptions = {},
): DateResult => {
  // Default options
  const { locale, timestampUnit = "seconds", customFormat } = options;

  // Date parsing
  let date: Date;

  try {
    // If input is a Date object
    if (input instanceof Date) {
      date = input;
    }
    // If input is a number (timestamp)
    else if (typeof input === "number") {
      // Check if timestamp is in seconds or milliseconds
      // Generally, if it's 13 digits, it's milliseconds; if 10 digits, it's seconds
      const isMilliseconds =
        input > 10000000000 || timestampUnit === "milliseconds";
      date = new Date(isMilliseconds ? input : input * 1000);
    }
    // If input is a string
    else if (typeof input === "string") {
      // ISO format or other formats that Date constructor can recognize
      date = new Date(input);

      // Handle 'YYYY-MM-DD' format
      if (!isValid(date) && /^\d{4}-\d{2}-\d{2}$/.test(input)) {
        const [year, month, day] = input.split("-").map(Number);
        date = new Date(year, month - 1, day);
      }
    } else {
      return {
        success: false,
        error: "Unsupported input format.",
      };
    }

    // Check if date is valid
    if (!isValid(date)) {
      return {
        success: false,
        error: "Invalid date.",
      };
    }

    // Return result based on output format
    let value: string | number;
    const now = new Date();

    switch (outputFormat) {
      case "ISO":
        value = date.toISOString();
        break;

      case "YYYY-MM-DD":
        value = format(date, "yyyy-MM-dd");
        break;

      case "YYYY-MM-DD HH:MM":
        value = format(date, "yyyy-MM-dd HH:mm");
        break;

      case "MMM D, YYYY":
        value = format(date, "MMM d, yyyy");
        break;

      case "MMMM D, YYYY":
        value = format(date, "MMMM d, yyyy");
        break;

      case "MMM D, HH:mm":
        value = format(date, "MMM d, HH:mm");
        break;

      case "MMM D YYYY, HH:mm":
        value = format(date, "MMM d, yyyy, HH:mm");
        break;

      case "timestamp-seconds":
        value = Math.floor(date.getTime() / 1000);
        break;

      case "timestamp-ms":
        value = date.getTime();
        break;

      case "relative":
        value = formatDistance(date, now, { addSuffix: true });
        break;

      case "month-day":
        value = format(date, "MMM d");
        break;

      case "custom":
        if (!customFormat) {
          return {
            success: false,
            error:
              "Custom format requires 'customFormat' option to be provided",
          };
        }
        try {
          value = format(date, customFormat, { locale });
        } catch {
          return {
            success: false,
            error: `Invalid custom format: ${customFormat}`,
          };
        }
        break;

      default:
        // If we reached here, something is wrong with the output format
        return {
          success: false,
          error: `Unsupported output format: ${outputFormat}`,
        };
    }

    return {
      success: true,
      value,
      date,
    };
  } catch (error) {
    return {
      success: false,
      error: `Date parsing error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
};

/**
 * Convert a date to another format (simplified version)
 *
 * @param input - Input date
 * @param outputFormat - Output format
 * @param options - Additional options
 * @returns Converted date as string or number, or null if conversion fails
 */
export const convertDate = (
  input: DateInput,
  outputFormat: DateOutputFormat = "ISO",
  options: DateUtilOptions = {},
): string | number | null => {
  const result = formatDate(input, outputFormat, options);
  return result.success ? result.value! : null;
};

/**
 * Smart date formatting function - automatically determines the appropriate format based on context
 *
 * - Within 24 hours: Shows relative time (e.g., "3 hours ago")
 * - Same year: Shows month, day, and time (year omitted) (e.g., "Jun 15, 14:30")
 * - Different year: Shows full date with year (e.g., "Jun 15 2023, 14:30")
 *
 * @param input - Input date (Date, timestamp, ISO string, etc.)
 * @param options - Additional options
 * @returns Context-appropriate formatted date string or null if formatting fails
 */
export const getSmartDate = (
  input: DateInput,
  options: DateUtilOptions = {},
): string | number | null => {
  const { timestampUnit = "seconds" } = options;

  try {
    // Convert input to Date object
    let date: Date;
    if (input instanceof Date) {
      date = input;
    } else if (typeof input === "number") {
      const isMilliseconds =
        input > 10000000000 || timestampUnit === "milliseconds";
      date = new Date(isMilliseconds ? input : input * 1000);
    } else if (typeof input === "string") {
      date = new Date(input);
    } else {
      return null;
    }

    if (!isValid(date)) {
      return null;
    }

    // Determine format based on comparison with current time
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    const currentYear = now.getFullYear();
    const dateYear = date.getFullYear();

    let timeFormat: DateOutputFormat;
    if (diffInHours <= 24) {
      timeFormat = "relative";
    } else if (currentYear === dateYear) {
      timeFormat = "MMM D, HH:mm";
    } else {
      timeFormat = "MMM D YYYY, HH:mm";
    }

    return convertDate(date, timeFormat, options);
  } catch (error) {
    console.error("Smart date formatting error:", error);
    return null;
  }
};
