// Clear messages debug script
// Run this in browser console to completely clear all messages

console.log("🧹 Clearing all messages from ChatDO...");

// Clear all message store data
if (typeof window !== "undefined") {
  // Clear any window-level debugging data
  if (window.clearAllMessages) {
    window.clearAllMessages();
  }

  if (window.cleanSystemMessages) {
    window.cleanSystemMessages();
  }

  // Clear localStorage (just in case)
  Object.keys(localStorage).forEach((key) => {
    if (
      key.includes("message") ||
      key.includes("chat") ||
      key.includes("channel")
    ) {
      console.log(`Removing localStorage key: ${key}`);
      localStorage.removeItem(key);
    }
  });

  // Clear sessionStorage (just in case)
  Object.keys(sessionStorage).forEach((key) => {
    if (
      key.includes("message") ||
      key.includes("chat") ||
      key.includes("channel")
    ) {
      console.log(`Removing sessionStorage key: ${key}`);
      sessionStorage.removeItem(key);
    }
  });

  console.log("✅ Message clearing complete! Please refresh the page.");
}
