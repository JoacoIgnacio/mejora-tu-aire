import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail} from 'firebase/auth';
import { User } from '../models/user.model';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc,addDoc, collection} from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {getStorage, uploadString,ref, getDownloadURL} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestorage = inject(AngularFirestore);
  storage = inject(AngularFireStorage);
  utilsSvc = inject(UtilsService);

  // ===== Autenticación =====
  getAuth(){
    return getAuth();
  }
  // ===== Acceder =====

  signIn(user: User){
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  
  }

  // ===== Crear Usuario =====

  signUp(user: User){
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
    
  }

  // ===== Actualizar usuario =====
  updateUser(displayName: string){
    return updateProfile(getAuth().currentUser, {displayName})
  }
  // ===== Enviar email para restaurar contraseña  =====
  sendRecoveryEmail(email: string){
    return sendPasswordResetEmail(getAuth(), email);
  }
  // ===== Cerrar Sesión  =====
  signOut(){
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.router.navigate(['/auth']);
  }

  
// ===== Base de datos =====

  // ===== Setear un documento =====
  setDocument(path: string, data: any){
    return setDoc(doc(getFirestore(), path), data);
  }
  // ===== Obtener un documento =====
  async getDocument(path: string){
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  // ===== Agregar un documento =====
  addDocument(path: string, data: any){
    return addDoc(collection(getFirestore(), path), data);
  }
// ===== Almacenamiento =====

// ===== Subir imagen =====
 async uploadImage(path:string, data_url:string){
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(()=>{
      return getDownloadURL(ref(getStorage(), path));
    });

  }

}
