import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc, addDoc, collection, collectionData, query, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, uploadString, ref, getDownloadURL, deleteObject } from '@angular/fire/storage';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  auth = inject(AngularFireAuth);
  firestorage = inject(AngularFirestore);
  storage = inject(AngularFireStorage);
  utilsSvc = inject(UtilsService);

  // Subject para manejar eventos de recarga
  reloadSubject: Subject<void> = new Subject<void>();

  // ===== Autenticación =====
  getAuth() {
    return getAuth();
  }

  // ===== Acceder =====
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // ===== Crear Usuario =====
  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // ===== Actualizar usuario =====
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  // ===== Enviar email para restaurar contraseña =====
  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  // ===== Cerrar Sesión =====
  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.router.navigate(['/auth']);
  }

  // ===== Base de datos =====
  getCollectionData(path: string, collectionQuery?: any) {
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, collectionQuery), { idField: 'id' });
  }

  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  updateDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data);
  }

  deleteDocument(path: string) {
    return deleteDoc(doc(getFirestore(), path));
  }
  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }

  // ===== Almacenamiento =====
  async uploadImage(path: string, data_url: string) {
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(() => {
      return getDownloadURL(ref(getStorage(), path));
    });
  }

  async getFilePath(url: string) {
    return ref(getStorage(), url).fullPath;
  }

  deleteFile(path: string) {
    return deleteObject(ref(getStorage(), path));
  }

}
