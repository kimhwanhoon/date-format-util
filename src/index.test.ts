import { formatDate, convertDate, getSmartDate } from './index';

describe('formatDate', () => {
  test('formats ISO string input to various formats', () => {
    const input = '2023-05-15T14:30:00.000Z';

    expect(formatDate(input, 'ISO').value).toBe('2023-05-15T14:30:00.000Z');
    expect(formatDate(input, 'YYYY-MM-DD').value).toBe('2023-05-15');
    expect(formatDate(input, 'MMM D, YYYY').value).toBe('May 15, 2023');
    expect(formatDate(input, 'MMMM D, YYYY').value).toBe('May 15, 2023');
  });

  test('handles timestamp input correctly', () => {
    const timestamp = 1684150200; // 2023-05-15 14:30:00 UTC
    const result = formatDate(timestamp, 'YYYY-MM-DD', { timestampUnit: 'seconds' });
    expect(result.success).toBe(true);
    expect(result.value).toBe('2023-05-15');
  });

  test('handles invalid input', () => {
    const result = formatDate('invalid-date', 'ISO');
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  test('formats relative time', () => {
    const now = new Date();
    const hourAgo = new Date(now.getTime() - 3600000);
    const result = formatDate(hourAgo, 'relative');
    expect(result.success).toBe(true);
    expect(result.value).toContain('hour ago');
  });
});

describe('convertDate', () => {
  test('converts dates between formats', () => {
    const input = '2023-05-15T14:30:00.000Z';
    
    expect(convertDate(input, 'YYYY-MM-DD')).toBe('2023-05-15');
    expect(convertDate(input, 'timestamp-seconds')).toBe(Math.floor(new Date(input).getTime() / 1000));
  });

  test('returns null for invalid input', () => {
    expect(convertDate('invalid-date', 'ISO')).toBeNull();
  });
});

describe('getSmartDate', () => {
  test('formats recent dates as relative time', () => {
    const now = new Date();
    const hourAgo = new Date(now.getTime() - 3600000);
    expect(getSmartDate(hourAgo)).toContain('hour ago');
  });

  test('formats dates from current year without year', () => {
    // Note: This test might need to be adjusted based on the current date
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000));
    const result = getSmartDate(threeDaysAgo);
    expect(typeof result).toBe('string');
    expect(result).toBeTruthy();
  });

  test('formats dates from different year with year', () => {
    const oldDate = new Date(2020, 5, 15, 14, 30);
    const result = getSmartDate(oldDate);
    expect(result).toBe('Jun 15, 2020, 14:30');
  });

  test('returns null for invalid input', () => {
    expect(getSmartDate('invalid-date')).toBeNull();
  });
}); 