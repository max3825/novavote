// Test file pour vérifier le parser
import { parseEmailFile, mergeEmails } from "./emailParser";

// Test CSV content
const csvContent = `email,name,role
alice@example.com,Alice,Admin
bob@example.com,Bob,User
charlie@invalid,Charlie,Invalid`;

// Write test file
const csvFile = new File([csvContent], "test.csv", { type: "text/csv" });

async function testParser() {
  try {
    console.log("Testing CSV parser...");
    const result = await parseEmailFile(csvFile);
    console.log("CSV Result:", result);
    console.log("Valid emails:", result.emails);
    console.log("Valid count:", result.validCount);
    console.log("Invalid count:", result.invalidCount);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Test merge
const emails1 = ["alice@example.com", "bob@example.com"];
const emails2 = ["bob@example.com", "charlie@example.com"];
const merged = mergeEmails(emails1, emails2);
console.log("Merged emails:", merged);
