import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

import vuelosjson from 'src/assets/json/vuelos.json';
import { BoletoService } from '../service/boleto.service';

@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.component.html',
  styleUrls: ['./confirmacion.component.css'],
})
export class ConfirmacionComponent implements OnInit {
  paises: any = vuelosjson.data;
  lugarDestino: any = ' ';
  vuelos: any = ' ';
  horarios: any = [];
  mostrar: number = 0;
  nombrePais: any = 'seleccionar vuelo';
  crearVuelo: FormGroup;
  paisVuelo: any = ' ';
  estadoVuelo: any = ' ';
  horaVuelo: any = '';

  constructor(private fb: FormBuilder, private _boletoService: BoletoService, private router: Router, private alertController: AlertController) {
    this.crearVuelo = fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      pasaporte: ['', Validators.required],
    });
  }

  slideOpts = {
    initialSlide: 0,
    speed: 400,
  };

  ngOnInit(): void {}

  async mostrarLocalidad(pais: any) {
    for (let index = 0; index < this.paises.length; index++) {
      if (this.paises[index].nombre === pais) {
        this.lugarDestino = this.paises[index];
        this.vuelos = this.lugarDestino.viajes;
        this.paisVuelo = pais;
        const alert = await this.alertController.create({
          header: 'ha seleccionado '+ pais,
          subHeader: 'continue a la derecha',
          buttons: ['OK'],
        });
        await alert.present();
      }
    }
  }

  async mostrarHorario(vuelo: any) {
    for (let index = 0; index < this.vuelos.length; index++) {
      if (this.vuelos[index].destino === vuelo) {
        this.horarios = this.vuelos[index].hora;
        this.nombrePais = vuelo;
        this.estadoVuelo = vuelo;
        console.log(this.horarios);
        const alert = await this.alertController.create({
          header: 'ha seleccionado '+ this.estadoVuelo + ' en ' + this.paisVuelo,
          subHeader: 'porfavor, selecciona una hora disponible',
          buttons: ['OK'],
        });
        await alert.present();
      }
    }
  }

  async seleccionHora(hora: any) {
    this.horaVuelo = hora;
    const alert = await this.alertController.create({
      header: 'ha seleccionado '+ this.estadoVuelo + ' en ' + this.paisVuelo,
      subHeader: 'hora de vuelo ' + this.horaVuelo + ' porfavor, continua a la derecha e ingresa tus datos',
      buttons: ['OK'],
    });
    await alert.present();
    console.log(hora);
  }

  async comprarVuelo() {
    const preboleto: any = {
      nombe: this.crearVuelo.value.nombre,
      apellido: this.crearVuelo.value.apellido,
      pasaporte: this.crearVuelo.value.pasaporte,
    };
    const alert = await this.alertController.create({
      header: 'continua a la derecha para confirmar',
      buttons: ['OK'],
    });
    await alert.present();
    console.log(preboleto);
  }

  confirmarVuelo() {
    const boleto: any = {
      nombe: this.crearVuelo.value.nombre,
      apellido: this.crearVuelo.value.apellido,
      pasaporte: this.crearVuelo.value.pasaporte,
      pais: this.paisVuelo,
      estado: this.estadoVuelo,
      hora: this.horaVuelo,
    };
    this._boletoService.agregarBoleto(boleto).then(async ()=>{
      console.log("exito al cargar");
      const alert = await this.alertController.create({
        header: 'se a rerervado con exito',
        buttons: ['OK'],
      });
      await alert.present();
      window.location.reload();
    }).catch(error => {
      console.log("error")
    })
  }
}
