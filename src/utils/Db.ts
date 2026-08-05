import admin, { ServiceAccount } from "firebase-admin";

function formatPrivateKey(key?: string): string | undefined {
  if (!key) return undefined;
  let formatted = key.trim();
  if (formatted.endsWith(",")) {
    formatted = formatted.slice(0, -1).trim();
  }
  while (
    (formatted.startsWith('"') && formatted.endsWith('"')) ||
    (formatted.startsWith("'") && formatted.endsWith("'"))
  ) {
    formatted = formatted.slice(1, -1).trim();
  }
  return formatted.replace(/\\n/g, "\n").trim();
}

let firestoreInstance: admin.firestore.Firestore | null = null;

export function getDb(): admin.firestore.Firestore {
  if (!firestoreInstance) {
    if (!admin.apps.length) {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const privateKey = formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY);

      if (!projectId || !clientEmail || !privateKey) {
        throw new Error(
          "Firebase credentials (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) are missing from environment variables."
        );
      }

      const serviceAccount: ServiceAccount = {
        projectId,
        clientEmail,
        privateKey,
      };

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
    firestoreInstance = admin.firestore();
  }
  return firestoreInstance;
}

// Proxy wrapper so existing `import db from "@/utils/Db"` calls work lazily at runtime
const db = new Proxy({} as admin.firestore.Firestore, {
  get(_target, prop, receiver) {
    const instance = getDb();
    const value = Reflect.get(instance, prop, receiver);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

export default db;
