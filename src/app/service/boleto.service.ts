import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class BoletoService {

  constructor(private firestore: AngularFirestore) { }

  agregarBoleto(boleto: any): Promise<any>{
    return this.firestore.collection('boletos').add(boleto)
  }
}
