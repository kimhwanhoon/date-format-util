# Date Format Utility

A collection of utility functions for date formatting.

## Installation
```npm install your-package-name```

## Usage
```typescript
import { formatDate, convertDate, getSmartDate } from '@kimhwanhoon/date-format-util';

// Format a date to various outputs
const isoDate = formatDate('2023-01-03', 'ISO');
const relativeDate = formatDate(Date.now(), 'relative');
const customDate = formatDate(new Date(), 'YYYY-MM-DD');

// Simple conversion
const converted = convertDate('2023-01-03', 'MMM D, YYYY');

// Smart date formatting
const smartDate = getSmartDate(new Date());
```

## Available Output Formats

- `ISO` - ISO string format
  ```typescript
  formatDate('2023-05-15', 'ISO')
  // Output: "2023-05-15T00:00:00.000Z"
  ```

- `YYYY-MM-DD` - Basic date format
  ```typescript
  formatDate('2023-05-15T14:30:00Z', 'YYYY-MM-DD')
  // Output: "2023-05-15"
  ```

- `YYYY-MM-DD HH:MM` - Date with time
  ```typescript
  formatDate('2023-05-15T14:30:00Z', 'YYYY-MM-DD HH:MM')
  // Output: "2023-05-15 14:30"
  ```

- `MMM D, YYYY` - Abbreviated month with year
  ```typescript
  formatDate('2023-05-15', 'MMM D, YYYY')
  // Output: "May 15, 2023"
  ```

- `MMMM D, YYYY` - Full month name with year
  ```typescript
  formatDate('2023-05-15', 'MMMM D, YYYY')
  // Output: "May 15, 2023"
  ```

- `MMM D, HH:mm` - Abbreviated month with time
  ```typescript
  formatDate('2023-05-15T14:30:00Z', 'MMM D, HH:mm')
  // Output: "May 15, 14:30"
  ```

- `MMM D YYYY, HH:mm` - Full date and time
  ```typescript
  formatDate('2023-05-15T14:30:00Z', 'MMM D YYYY, HH:mm')
  // Output: "May 15 2023, 14:30"
  ```

- `timestamp-seconds` - Unix timestamp in seconds
  ```typescript
  formatDate('2023-05-15T14:30:00Z', 'timestamp-seconds')
  // Output: 1684150200
  ```

- `timestamp-ms` - Unix timestamp in milliseconds
  ```typescript
  formatDate('2023-05-15T14:30:00Z', 'timestamp-ms')
  // Output: 1684150200000
  ```

- `relative` - Relative time (e.g., '2 hours ago')
  ```typescript
  formatDate(new Date(Date.now() - 7200000), 'relative')
  // Output: "2 hours ago"
  ```

- `month-day` - Month and day only
  ```typescript
  formatDate('2023-05-15', 'month-day')
  // Output: "May 15"
  ```

- `custom` - Custom format using date-fns tokens
  ```typescript
  formatDate('2023-05-15', 'custom', { customFormat: 'dd/MM/yyyy' })
  // Output: "15/05/2023"
  ```
# date-format-util
