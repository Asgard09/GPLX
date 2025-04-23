import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Log các biến môi trường Firebase để kiểm tra (chỉ hiển thị có hay không, không hiển thị giá trị thực)
console.log("Firebase config available:", {
  apiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
});

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Kiểm tra xem có đủ thông tin cấu hình không
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error(
    "Firebase configuration is missing or incomplete. Check your .env.local file."
  );
}

// Khởi tạo Firebase
let app;
let auth;
let db;
let storage;

try {
  // Sử dụng hard-coded config nếu biến môi trường không hoạt động
  if (!firebaseConfig.apiKey) {
    console.warn(
      "Sử dụng cấu hình Firebase mặc định vì biến môi trường không hoạt động"
    );
    app = initializeApp({
      apiKey: "AIzaSyB0pETLPAvxHetoYb9dbavsVJ-kYqxzVkE",
      authDomain: "gplx-580ed.firebaseapp.com",
      projectId: "gplx-580ed",
      storageBucket: "gplx-580ed.firebasestorage.app",
      messagingSenderId: "544586253762",
      appId: "1:544586253762:web:766008e91436c4d25bc25b",
    });
  } else {
    app = initializeApp(firebaseConfig);
  }

  console.log("Firebase initialized:", app.name);

  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  console.error("Firebase initialization error:", error);
}

// Export các dịch vụ Firebase
export { auth, db, storage };
