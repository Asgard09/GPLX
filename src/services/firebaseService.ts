import { db } from "@/firebase/config";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

// Student types
export interface Student {
  id?: string;
  name: string;
  dob: string;
  phone: string;
  address: string;
  cccd: string;
  course: string;
  status: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Course types
export interface Course {
  id?: string;
  name: string;
  licenseType: string;
  startDate: string;
  endDate: string;
  maxStudents: number;
  instructors: number;
  fee: number;
  status: string;
  description?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// License types
export interface License {
  id?: string;
  studentId: string;
  studentName: string;
  licenseType: string;
  issueDate: string;
  expiryDate: string;
  status: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Student services
export const studentService = {
  getStudents: async (): Promise<Student[]> => {
    const studentsCollection = collection(db, "students");
    const studentsSnapshot = await getDocs(studentsCollection);
    return studentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Student[];
  },

  getStudentById: async (id: string): Promise<Student | null> => {
    const studentDoc = doc(db, "students", id);
    const studentSnapshot = await getDoc(studentDoc);

    if (studentSnapshot.exists()) {
      return {
        id: studentSnapshot.id,
        ...studentSnapshot.data(),
      } as Student;
    }

    return null;
  },

  createStudent: async (
    student: Omit<Student, "id" | "createdAt" | "updatedAt">
  ): Promise<string> => {
    const studentsCollection = collection(db, "students");
    const docRef = await addDoc(studentsCollection, {
      ...student,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  },

  updateStudent: async (
    id: string,
    student: Partial<Omit<Student, "id" | "createdAt" | "updatedAt">>
  ): Promise<void> => {
    const studentDoc = doc(db, "students", id);
    await updateDoc(studentDoc, {
      ...student,
      updatedAt: serverTimestamp(),
    });
  },

  deleteStudent: async (id: string): Promise<void> => {
    const studentDoc = doc(db, "students", id);
    await deleteDoc(studentDoc);
  },

  getStudentsByCourse: async (courseId: string): Promise<Student[]> => {
    const studentsCollection = collection(db, "students");
    const q = query(studentsCollection, where("course", "==", courseId));
    const studentsSnapshot = await getDocs(q);

    return studentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Student[];
  },
};

// Course services
export const courseService = {
  getCourses: async (): Promise<Course[]> => {
    const coursesCollection = collection(db, "courses");
    const coursesSnapshot = await getDocs(coursesCollection);
    return coursesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Course[];
  },

  getCourseById: async (id: string): Promise<Course | null> => {
    const courseDoc = doc(db, "courses", id);
    const courseSnapshot = await getDoc(courseDoc);

    if (courseSnapshot.exists()) {
      return {
        id: courseSnapshot.id,
        ...courseSnapshot.data(),
      } as Course;
    }

    return null;
  },

  createCourse: async (
    course: Omit<Course, "id" | "createdAt" | "updatedAt">
  ): Promise<string> => {
    const coursesCollection = collection(db, "courses");
    const docRef = await addDoc(coursesCollection, {
      ...course,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  },

  updateCourse: async (
    id: string,
    course: Partial<Omit<Course, "id" | "createdAt" | "updatedAt">>
  ): Promise<void> => {
    const courseDoc = doc(db, "courses", id);
    await updateDoc(courseDoc, {
      ...course,
      updatedAt: serverTimestamp(),
    });
  },

  deleteCourse: async (id: string): Promise<void> => {
    const courseDoc = doc(db, "courses", id);
    await deleteDoc(courseDoc);
  },
};

// License services
export const licenseService = {
  getLicenses: async (): Promise<License[]> => {
    const licensesCollection = collection(db, "licenses");
    const licensesSnapshot = await getDocs(licensesCollection);
    return licensesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as License[];
  },

  getLicenseById: async (id: string): Promise<License | null> => {
    const licenseDoc = doc(db, "licenses", id);
    const licenseSnapshot = await getDoc(licenseDoc);

    if (licenseSnapshot.exists()) {
      return {
        id: licenseSnapshot.id,
        ...licenseSnapshot.data(),
      } as License;
    }

    return null;
  },

  getLicensesByStudentId: async (studentId: string): Promise<License[]> => {
    const licensesCollection = collection(db, "licenses");
    const q = query(licensesCollection, where("studentId", "==", studentId));
    const licensesSnapshot = await getDocs(q);

    return licensesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as License[];
  },

  createLicense: async (
    license: Omit<License, "id" | "createdAt" | "updatedAt">
  ): Promise<string> => {
    const licensesCollection = collection(db, "licenses");
    const docRef = await addDoc(licensesCollection, {
      ...license,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  },

  updateLicense: async (
    id: string,
    license: Partial<Omit<License, "id" | "createdAt" | "updatedAt">>
  ): Promise<void> => {
    const licenseDoc = doc(db, "licenses", id);
    await updateDoc(licenseDoc, {
      ...license,
      updatedAt: serverTimestamp(),
    });
  },

  deleteLicense: async (id: string): Promise<void> => {
    const licenseDoc = doc(db, "licenses", id);
    await deleteDoc(licenseDoc);
  },
};
