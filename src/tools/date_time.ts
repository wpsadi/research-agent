import { tool } from "langchain";
import z from "zod";

export const date_time = tool(
	({ time_zone, timestamp }: { time_zone?: string; timestamp?: number }) => {
		try {
			// Use the provided timezone or default to UTC
			const timezone = time_zone || "UTC";

			// Create a date object for the specified timezone
			// If timestamp is provided (in seconds), use it; otherwise use current time
			const now = timestamp ? new Date(timestamp * 1000) : new Date();

			// Format date/time for the timezone
			const formatter = new Intl.DateTimeFormat("en-US", {
				timeZone: timezone,
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
				hour12: false,
				weekday: "long",
			});

			const parts = formatter.formatToParts(now);
			const getValue = (type: string) =>
				parts.find((p) => p.type === type)?.value || "";

			// Get additional date information
			const year = Number.parseInt(getValue("year"), 10);
			const month = Number.parseInt(getValue("month"), 10);
			const day = Number.parseInt(getValue("day"), 10);
			const hour = Number.parseInt(getValue("hour"), 10);
			const minute = Number.parseInt(getValue("minute"), 10);
			const second = Number.parseInt(getValue("second"), 10);
			const weekday = getValue("weekday");

			// Calculate week number (ISO 8601)
			const dateInTimezone = new Date(
				now.toLocaleString("en-US", { timeZone: timezone }),
			);
			const firstDayOfYear = new Date(dateInTimezone.getFullYear(), 0, 1);
			const pastDaysOfYear =
				(dateInTimezone.getTime() - firstDayOfYear.getTime()) / 86400000;
			const weekNumber = Math.ceil(
				(pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7,
			);

			// Calculate quarter
			const quarter = Math.ceil(month / 3);

			// Get day of year
			const start = new Date(year, 0, 0);
			const diff = dateInTimezone.getTime() - start.getTime();
			const dayOfYear = Math.floor(diff / 86400000);

			// Check if it's a leap year
			const isLeapYear =
				(year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

			// Get timezone offset
			const timezoneOffset =
				now
					.toLocaleString("en-US", {
						timeZone: timezone,
						timeZoneName: "short",
					})
					.split(" ")
					.pop() || "";

			// Unix timestamp
			const unixTimestamp = Math.floor(now.getTime() / 1000);

			// ISO 8601 format
			const isoString = now
				.toLocaleString("sv-SE", { timeZone: timezone })
				.replace(" ", "T");

			return {
				success: true,
				timezone: timezone,
				datetime: {
					year: year,
					month: month,
					day: day,
					hour: hour,
					minute: minute,
					second: second,
					millisecond: now.getMilliseconds(),
				},
				formatted: {
					date: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
					time: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`,
					datetime: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`,
					iso8601: isoString,
				},
				calendar: {
					weekday: weekday,
					weekNumber: weekNumber,
					dayOfYear: dayOfYear,
					quarter: quarter,
					isLeapYear: isLeapYear,
				},
				timestamp: {
					unix: unixTimestamp,
					milliseconds: now.getTime(),
				},
				timezoneInfo: {
					name: timezone,
					abbreviation: timezoneOffset,
					offsetMinutes: -now.getTimezoneOffset(), // Note: this is local offset, not target timezone
				},
			};
		} catch (error) {
			return {
				success: false,
				error: `Invalid input: ${error instanceof Error ? error.message : "Unknown error"}. Please provide a valid IANA timezone (e.g., "America/New_York", "Europe/London", "Asia/Tokyo") and/or a valid Unix timestamp in seconds.`,
			};
		}
	},
	{
		name: "date_time",
		description:
			"Get comprehensive date and time information for a specific timezone and/or timestamp. Returns detailed information including year, month, day, hour, minute, second, day of week, week number, quarter, day of year, leap year status, timestamps, and more. Can be used to get current time or convert a specific Unix timestamp to a timezone.",
		schema: z.object({
			time_zone: z
				.string()
				.optional()
				.describe(
					"IANA timezone name (e.g., 'America/New_York', 'Europe/London', 'Asia/Tokyo'). Defaults to 'UTC' if not provided.",
				),
			timestamp: z
				.number()
				.optional()
				.describe(
					"Unix timestamp in seconds (e.g., 1699660800). If not provided, uses the current time. Use this to get date/time information for a specific moment in the past or future.",
				),
		}),
	},
);
