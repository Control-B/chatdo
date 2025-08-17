// Complete cache clearing utility for ChatDO
export const clearAllCaches = async () => {
  console.log("🧹 Starting complete cache clear...");
  
  // 1. Clear all browser caches
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    console.log("Found caches:", cacheNames);
    
    for (const cacheName of cacheNames) {
      await caches.delete(cacheName);
      console.log(`Deleted cache: ${cacheName}`);
    }
  }
  
  // 2. Unregister service workers
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    console.log("Found service workers:", registrations.length);
    
    for (const registration of registrations) {
      await registration.unregister();
      console.log("Unregistered service worker");
    }
  }
  
  // 3. Clear all storage
  localStorage.clear();
  sessionStorage.clear();
  
  // 4. Clear IndexedDB (if any)
  if ('indexedDB' in window) {
    try {
      const databases = await indexedDB.databases();
      for (const db of databases) {
        if (db.name) {
          indexedDB.deleteDatabase(db.name);
          console.log(`Deleted IndexedDB: ${db.name}`);
        }
      }
    } catch (e) {
      console.log("IndexedDB clear failed:", e);
    }
  }
  
  console.log("✅ Complete cache clear finished!");
  console.log("🔄 Please hard refresh the page (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)");
};

// Make it available globally for debugging
if (typeof window !== "undefined") {
  (window as any).clearAllCaches = clearAllCaches;
}
