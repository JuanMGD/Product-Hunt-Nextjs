import app from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
// import { getStorage } from '@firebase/storage';


import firebaseConfig from './config'

class Firebase {
    constructor() {
        if(!app.apps.length){
            app.initializeApp(firebaseConfig)
        }

        this.auth = app.auth()
        this.db = app.firestore()
        this.storage = app.storage()
        // this.storage = getStorage(this.app);
    }

    // Registra un usuario
    async registrar(nombre, email, password){
        const nuevoUsuario = await this.auth.createUserWithEmailAndPassword(email, password)

        return await nuevoUsuario.user.updateProfile({
            displayName: nombre
        })
    }

    // Registra un usuario
    async login(email, password){
        return await this.auth.signInWithEmailAndPassword(email, password)
    }
    
    // Cierra la sesión del usuario
    async cerrarSesion(){
        await this.auth.signOut()
    }
}

const firebase = new Firebase();
export default firebase;