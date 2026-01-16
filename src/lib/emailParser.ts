/**
 * Smart email parser for CSV and TXT files
 * Supports:
 * - CSV with comma or semicolon delimiters
 * - CSV with headers (auto-detects email column)
 * - TXT with one email per line
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ParseResult {
  emails: string[];
  validCount: number;
  invalidCount: number;
  format: "csv" | "txt";
  delimiter?: "," | ";";
  emailColumnIndex?: number;
}

/**
 * Validate if a string looks like an email
 */
function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim().toLowerCase());
}

/**
 * Try to detect email column in a CSV with headers
 */
function findEmailColumn(headers: string[]): number {
  const emailPatterns = ["email", "e-mail", "mail", "address", "recipient", "destinataire"];
  
  return headers.findIndex((header) =>
    emailPatterns.some((pattern) =>
      header.toLowerCase().includes(pattern)
    )
  );
}

/**
 * Parse CSV content and extract emails
 */
function parseCSV(content: string): ParseResult {
  const lines = content.trim().split("\n").filter((l) => l.trim());
  if (lines.length === 0) {
    return {
      emails: [],
      validCount: 0,
      invalidCount: 0,
      format: "csv",
      delimiter: ",",
    };
  }

  // Try to detect delimiter (comma or semicolon)
  const firstLine = lines[0];
  let delimiter: "," | ";" = ",";

  // Count occurrences of each delimiter
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semicolonCount = (firstLine.match(/;/g) || []).length;

  if (semicolonCount > commaCount) {
    delimiter = ";";
  }

  // Parse all lines
  const rows = lines.map((line) => line.split(delimiter).map((cell) => cell.trim()));

  // Try to detect if first line is header
  const firstRowData = rows[0];
  let emailColumnIndex = -1;
  let startRow = 0;

  // Check if first row looks like a header
  const possibleEmailIndex = findEmailColumn(firstRowData);
  if (possibleEmailIndex !== -1) {
    emailColumnIndex = possibleEmailIndex;
    startRow = 1;
  } else {
    // If no header, try to find email columns
    // Look for lines with valid emails
    for (let i = 0; i < firstRowData.length; i++) {
      if (isValidEmail(firstRowData[i])) {
        emailColumnIndex = i;
        break;
      }
    }
  }

  // If no email column found, just take first column
  if (emailColumnIndex === -1) {
    emailColumnIndex = 0;
  }

  // Extract emails from the determined column
  const emails: string[] = [];
  let validCount = 0;
  let invalidCount = 0;

  for (let i = startRow; i < rows.length; i++) {
    const row = rows[i];
    if (row.length > emailColumnIndex) {
      const email = row[emailColumnIndex].toLowerCase();
      if (isValidEmail(email)) {
        emails.push(email);
        validCount++;
      } else if (email) {
        invalidCount++;
      }
    }
  }

  // Remove duplicates
  const uniqueEmails = Array.from(new Set(emails));

  return {
    emails: uniqueEmails,
    validCount: uniqueEmails.length,
    invalidCount,
    format: "csv",
    delimiter,
    emailColumnIndex,
  };
}

/**
 * Parse TXT content (one email per line)
 */
function parseTXT(content: string): ParseResult {
  const lines = content
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const emails: string[] = [];
  let validCount = 0;
  let invalidCount = 0;

  for (const line of lines) {
    const email = line.toLowerCase();
    if (isValidEmail(email)) {
      emails.push(email);
      validCount++;
    } else {
      invalidCount++;
    }
  }

  // Remove duplicates
  const uniqueEmails = Array.from(new Set(emails));

  return {
    emails: uniqueEmails,
    validCount: uniqueEmails.length,
    invalidCount,
    format: "txt",
  };
}

/**
 * Auto-detect and parse email file
 */
export async function parseEmailFile(file: File): Promise<ParseResult> {
  const content = await file.text();
  const filename = file.name.toLowerCase();

  // Detect format from filename
  if (filename.endsWith(".csv")) {
    return parseCSV(content);
  } else if (filename.endsWith(".txt")) {
    return parseTXT(content);
  }

  // Try to auto-detect from content
  // If it has many lines with only email-like content, it's probably TXT
  // If it has commas/semicolons, it's probably CSV

  const lines = content.trim().split("\n").filter((l) => l.trim());
  if (lines.length === 0) {
    return {
      emails: [],
      validCount: 0,
      invalidCount: 0,
      format: "txt",
    };
  }

  const firstLine = lines[0];
  const hasComma = firstLine.includes(",");
  const hasSemicolon = firstLine.includes(";");

  if (hasComma || hasSemicolon) {
    return parseCSV(content);
  }

  // Default to TXT
  return parseTXT(content);
}

/**
 * Merge email lists, removing duplicates
 */
export function mergeEmails(existing: string[], newEmails: string[]): string[] {
  const merged = [
    ...new Set([
      ...existing.map((e) => e.toLowerCase()),
      ...newEmails.map((e) => e.toLowerCase()),
    ]),
  ];
  return merged.filter((e) => isValidEmail(e));
}
