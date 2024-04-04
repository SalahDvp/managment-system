// Import necessary Firebase libraries
'use client'
import { doc, updateDoc, deleteField } from "firebase/firestore";
import { db } from "./firebase"; // Import your Firebase configuration
import { getStorage, ref, deleteObject } from "firebase/storage";
import { storage } from "firebase/storage"; // Import your Firebase storage configuration
// Function to delete fields from a document
const storage1 = getStorage(customApp, "gs://software-management-system-mvp.appspot.com");
export async function deleteFieldsInDocument(documentPath, fieldsToDelete) {
    try {
        const docRef = doc(db, ...documentPath.split('/')); // Splitting document path into array
        const fieldsToDeleteObject = fieldsToDelete.reduce((acc, field) => {
            acc[field] = deleteField(); // Creating an object with field names as keys and deleteField() as values
            return acc;
        }, {});

        // Update the document to delete specified fields
        await updateDoc(docRef, fieldsToDeleteObject);

        console.log("Fields deleted successfully.");
        return true; // Indicate successful deletion
    } catch (error) {
        console.error("Error deleting fields:", error);
        return false; // Indicate failure
    }
}



// Function to delete a document from Firebase Storage
export async function deleteDocumentFromStorage(documentPath) {
    try {
        const storageRef = ref(storage, documentPath);

        // Delete the document
        await deleteObject(storageRef);

        console.log("Document deleted successfully.");
        return true; // Indicate successful deletion
    } catch (error) {
        console.error("Error deleting document:", error);
        return false; // Indicate failure
    }
}
