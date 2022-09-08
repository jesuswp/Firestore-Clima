firebase.initializeApp({

    apiKey: "XXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "XXXXXXXXXXXXXXXXXXXXXXXXXX",
    projectId: "XXXXXXXXXXXXXXXX",
    storageBucket: "XXXXXXXXXXXXXXX",
    messagingSenderId: "XXXXXXXXXXXXXXXX",
    appId: "XXXXXXXXXXXXXXXXXXX",
    measurementId: "XXXXXXXXXXXXXXx"

});
var db = firebase.firestore();

var auth = firebase.auth();

//------------------logout------------------
const logout = document.querySelector('#logout');

logout.addEventListener('click', e => {
    e.preventDefault();
    auth.signOut().then(() => {
        console.log('ha salido');

        location.reload();
    })
})

//----------------login-----------------
const signinForm = document.querySelector('#signin-form');

signinForm.addEventListener('submit', (e) => {

    e.preventDefault();

    const email = document.querySelector('#login-email').value;
    const pasword = document.querySelector('#login-password').value;

    console.log(email, pasword);

    auth.signInWithEmailAndPassword(email, pasword)
        .then(userCredential => {

            signinForm.reset();
            $('#signinModal').modal('hide');
            console.log('si funciona');
            document.getElementById('entrar').style.display = 'none';
            document.getElementById('usuario').value = email;

        })


});

//------------Limpiar datos--------------

function Limpiar() {
    document.getElementById('codigo').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('placa').value = '';
    document.getElementById('remitente').value = '';
    document.getElementById('destino').value = '';
    document.getElementById('kilos').value = '';
    document.getElementById('observaciones').value = '';
    document.getElementById('estado').value = '';
    document.getElementById('qconsecu').value = '';
}

//---------Consulta de codigo de conductores-----------
function Codigo(val) {

    auth.onAuthStateChanged(user => {
        if (user) {

            codigoIn = parseInt(val);

            db.collection("empleados").where("codigo", "==", codigoIn)
                .get()
                .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {

                        console.log(doc.id, " => ", doc.data());
                        var nombre = `${doc.data().nombre}`;

                        document.getElementById('nombre').value = nombre;

                    });
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });

        } else {

            console.log('loguese por favor');
            Swal.fire(
                'Debe Loguearse',
                '',
                'error'
            )

        }



    })
}

//------------------registrar y validar existencia ---------
regis = function () {
    let codigoCom = document.getElementById('codigo').value;

    console.log(codigoCom);
    console.log(typeof codigoCom);
    existe = '';
    db.collection("Rutas").where("Codigo", "==", codigoCom).where("Estado", "<", 2)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
                existe = doc.id;

            });
            console.log('test' + existe);
            if (existe != '') {
                Swal.fire(
                    'El usuario ya tiene asignada una ruta',
                    '',
                    'error'
                )
            }
            else {


                let codigo = document.getElementById('codigo').value;
                let nombre = document.getElementById('nombre').value;
                let placa = document.getElementById('placa').value;
                let remitente = document.getElementById('remitente').value;
                let destino = document.getElementById('destino').value;
                let kilos = document.getElementById('kilos').value;
                let observaciones = document.getElementById('observaciones').value;

                let estado = 0;
                let fecha = new Date();
                let usuario = document.getElementById('usuario').value;
                let nregis = document.getElementById('consecu').value;



                db.collection("Rutas").add({
                    Codigo: codigo,
                    Nombre: nombre,
                    Placa: placa,
                    Remitente: remitente,
                    Destino: destino,
                    Kilos: kilos,
                    Observaciones: observaciones,
                    Estado: estado,
                    FechaRadicado: fecha,
                    Usuario: usuario,
                    Consecutivo: parseInt(nregis),
                })
                    .then((docRef) => {
                        Swal.fire(
                            'Registro Exitoso!!!',
                            '',
                            'success'
                        )
                        Limpiar();
                    })
                    .catch((error) => {
                    });


            }

        })

        .catch((error) => {
        });
}

function Registrar() {
    auth.onAuthStateChanged(user => {

        if (user) {
            if (document.getElementById('usuario').value != 'admin@mail.com') {
                Swal.fire(
                    'No tienes permiso para esta acción',
                    '',
                    'error'
                )

            } else {
                if (document.getElementById('codigo').value != '' && document.getElementById('nombre').value != '' && document.getElementById('placa').value != '' && document.getElementById('remitente').value != '' && document.getElementById('destino').value != '' && document.getElementById('kilos').value != '') {
                    regis();
                }
                else {
                    Swal.fire(
                        'Complete los campos',
                        '',
                        'error'
                    )

                }

            }
        } else {

            document.getElementById('entrar').style.display = 'block';
            document.getElementById('logout').style.display = 'none';
            Swal.fire(
                'Debe Loguearse',
                '',
                'error'
            )

        }

    })

}

//-------------Consulta por numero de consecutivo------
function Consultar() {

    auth.onAuthStateChanged(user => {

        if (user) {
            if (document.getElementById('usuario').value != 'admin@mail.com') {
                Swal.fire(
                    'No tienes permiso para esta acción',
                    '',
                    'error'
                )

            } else {
                let consul = document.getElementById('qconsecu').value;
                consul2 = parseInt(consul)
                db.collection("Rutas").where("Consecutivo", "==", consul2)
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            console.log(doc.id, " => ", doc.data());
                            let Codigo = `${doc.data().Codigo}`;
                            let Destino = `${doc.data().Destino}`;
                            let Estado = `${doc.data().Estado}`;
                            let Kilos = `${doc.data().Kilos}`;

                            let Nombre = `${doc.data().Nombre}`;
                            let Observaciones = `${doc.data().Observaciones}`;
                            let Placa = `${doc.data().Placa}`;
                            let Remitente = `${doc.data().Remitente}`; 
                            UsuarioReg = `${doc.data().Usuario}`;

                            document.getElementById('codigo').value = Codigo;
                            document.getElementById('nombre').value = Nombre;
                            document.getElementById('placa').value = Placa;
                            document.getElementById('remitente').value = Remitente;
                            document.getElementById('destino').value = Destino;
                            document.getElementById('kilos').value = Kilos;
                            document.getElementById('observaciones').value = Observaciones;

                            if (Estado == 0) {
                                esta = 'En Proceso';
                            }
                            if (Estado == 1) {
                                esta = 'En Camino';
                            }
                            if (Estado == 2) {
                                esta = 'Entregado';
                            }
                            document.getElementById('estado').value = esta;

                            //-----------consulta--------------

                            actuali = function () {

                                let codigo = document.getElementById('codigo').value;
                                let nombre = document.getElementById('nombre').value;
                                let placa = document.getElementById('placa').value;
                                let remitente = document.getElementById('remitente').value;
                                let destino = document.getElementById('destino').value;
                                let kilos = document.getElementById('kilos').value;
                                let observaciones = document.getElementById('observaciones').value;

                                let estado = 1;
                                let fecha = new Date();
                                let usuario = document.getElementById('usuario').value;


                                var updateRutas = db.collection("Rutas").doc(doc.id);

                                return updateRutas.update({
                                    Codigo: codigo,
                                    Nombre: nombre,
                                    Placa: placa,
                                    Remitente: remitente,
                                    Destino: destino,
                                    Kilos: kilos,
                                    Observaciones: observaciones,
                                    Estado: estado,
                                    FechaActu: fecha,
                                    UsuarioActu: usuario,
                                })
                                    .then(() => {
                                        console.log("Document successfully updated!");
                                        Swal.fire(
                                            'Actualizacion Exitosa!!!',
                                            '',
                                            'success'
                                        )
                                        Limpiar();
                                    })
                                    .catch((error) => {
                                        console.error("Error updating document: ", error);
                                    });
                            } //fin de la consulta

                            //--------------entrega--------------
                            entrega = function(){
                                let usuarioActivo=document.getElementById('usuario').value;
                                let observaciones=document.getElementById('observaciones').value;
                                let fechaFin=new Date();
                                let estado=2;                                   

                                var cerrarRutas = db.collection("Rutas").doc(doc.id);

                                return cerrarRutas.update({
                                    
                                    Observaciones: observaciones,
                                    Estado: estado,
                                    FechaFin: fechaFin,
                                    UsuarioFin: usuarioActivo,
                                })
                                    .then(() => {
                                        Swal.fire(
                                            'Entrega Completa!!!',
                                            '',
                                            'success'
                                        )
                                        Limpiar();
                                    })
                                    .catch((error) => {
                                    });

                                

                            }

                            //--------------------------Eliminar----------

                            elimi = function () {
                                db.collection("Rutas").doc(doc.id).delete().then(function () {

                                    console.log("Document successfully deleted!");
                                    Swal.fire(
                                        'Registro Eliminado!!!',
                                        '',
                                        'success'
                                    )
                                    Limpiar();

                                }).catch(function (error) {
                                    alert("No se ha podido eliminar el documento");
                                });

                            } //terminar eliminar



                        });
                    })
                    .catch((error) => {
                    });

            }
        } else {
            console.log('loguese por favor');

            document.getElementById('entrar').style.display = 'block';
            document.getElementById('logout').style.display = 'none';
            Swal.fire(
                'Debe Loguearse',
                '',
                'error'
            )

        }

    })



}
//------------------Eliminar-----------------
function Eliminar() {
    if (confirm("Seguro que desea eliminar el Registro?")) {

        if (document.getElementById('usuario').value != 'admin@mail.com') {
            Swal.fire(
                'No tienes permiso para esta acción',
                '',
                'error'
            )

        } else {
            elimi();

        }


    } else {
    }

}

//------------------Culminar entrega----------
function Entregar(){
    entrega();

   /* auth.onAuthStateChanged(user => {

        if (user) {
            entrega();



        } else {

            document.getElementById('entrar').style.display = 'block';
            document.getElementById('logout').style.display = 'none';
            Swal.fire(
                'Debe Loguearse',
                '',
                'error'
            )

        }

    }) */

}
//------------------Actualizar---------------
function Actualizar() {

    auth.onAuthStateChanged(user => {

        if (user) {
            if (document.getElementById('usuario').value != 'admin@mail.com') {

                Swal.fire(
                    'No tienes permiso para esta acción',
                    '',
                    'error'
                )

            } else {
                actuali();


            }


        } else {

            document.getElementById('entrar').style.display = 'block';
            document.getElementById('logout').style.display = 'none';
            Swal.fire(
                'Debe Loguearse',
                '',
                'error'
            )

        }

    })
}

//------------validar cambios de estados-----------
auth.onAuthStateChanged(user => {
    tabl = document.getElementById("tabla");

    if (user) {

        db.collection("Rutas").where("Consecutivo", ">", 0).orderBy("Consecutivo", "asc").onSnapshot((querySnapshot) => {

            querySnapshot.forEach(function (doc) {
                console.log(doc.id, " => ", doc.data());
                var consue = Number(`${doc.data().Consecutivo}`);

                consue++;

                document.getElementById('consecu').value = consue;



            });
        })


        autorizadoPor = user.email;
        document.getElementById('usuario').value = autorizadoPor;
        console.log('usuario logueadi puede proceder');
        document.getElementById('entrar').style.display = 'none';

        //-------------------listar rutas con estado Pendiente y en camino-----------
        db.collection("Rutas").where("Estado", "<", 2).orderBy("Estado", "asc").onSnapshot((querySnapshot) => {
            tabl.innerHTML = "";
            querySnapshot.forEach(function (doc) {
                console.log(doc.id, " => ", doc.data());



                let Consecutivo = Number(`${doc.data().Consecutivo}`);
                let Codigo = `${doc.data().Codigo}`;
                let Destino = `${doc.data().Destino}`;
                let Estado = `${doc.data().Estado}`;

                if (Estado == 0) {
                    esta = 'En Proceso';
                }
                if (Estado == 1) {
                    esta = 'En Camino';
                }
                if (Estado == 2) {
                    esta = 'Entregado';
                }


                document.getElementById('logout').style.display = 'block';

                tabl.innerHTML += `
                      <tr>
                      <td>${Consecutivo}</td>
                      <td>${Codigo}</td>
                      <td scope="row">${Destino}</td>
                 
                  
                        <td>${esta}</td>
                        
                 
    
                
                  </tr>
    
             
             
                        `

                $("table td:last-child:contains(En Camino)")
                    .parents("tr")
                    .css("background-color", "green");

                $("table td:last-child:contains(En Proceso)")
                    .parents("tr")
                    .css("background-color", "red");



            });
        })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });






    } else {
        console.log('loguese por favor');

        document.getElementById('entrar').style.display = 'block';
        document.getElementById('logout').style.display = 'none';
        Swal.fire(
            'Debe Loguearse',
            '',
            'error'
        )

    }

})



//--------------------------------consumo de app clima-------------

function Remitente(value) {
    remi = value;

    let lon
    let lat

    let temperaturaValor1 = document.getElementById('temperatura1')

    let ubicacion1 = document.getElementById('ubicacion1')
    let iconoAnimado1 = document.getElementById('icono-animado1')

    ciudad1 = remi;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(posicion => {
            console.log(posicion.coords.latitude)
            lon = posicion.coords.longitude
            lat = posicion.coords.latitude
            
            //ubicación por ciudad
            const url1 = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad1}&lang=es&units=metric&appid=7c2ea75f3f04318c65c62f32ccd5213c`
            

            fetch(url1)
                .then(response => { return response.json() })
                .then(data => {
                    console.log(data)

                    let temp = Math.round(data.main.temp)
                    temperaturaValor1.textContent = `${temp} ° C`

                    ubicacion1.textContent = data.name

                    console.log(data.weather[0].main)
                    switch (data.weather[0].main) {
                        case 'Thunderstorm':
                            iconoAnimado1.src = 'animated/thunder.svg'
                            console.log('TORMENTA');
                            break;
                        case 'Drizzle':
                            iconoAnimado1.src = 'animated/rainy-2.svg'
                            console.log('LLOVIZNA');
                            break;
                        case 'Rain':
                            iconoAnimado1.src = 'animated/rainy-7.svg'
                            console.log('LLUVIA');
                            break;
                        case 'Snow':
                            iconoAnimado1.src = 'animated/snowy-6.svg'
                            console.log('NIEVE');
                            break;
                        case 'Clear':
                            iconoAnimado1.src = 'animated/day.svg'
                            console.log('LIMPIO');
                            break;
                        case 'Atmosphere':
                            iconoAnimado1.src = 'animated/weather.svg'
                            console.log('ATMOSFERA');
                            break;
                        case 'Clouds':
                            iconoAnimado1.src = 'animated/cloudy-day-1.svg'
                            console.log('NUBES');
                            break;
                        default:
                            iconoAnimado1.src = 'animated/cloudy-day-1.svg'
                            console.log('por defecto');
                    }

                })
                .catch(error => {
                    console.log(error)
                })
        })

    }
}
function Destino(value) {
    let dest = value;

    let lon
    let lat

    let temperaturaValor2 = document.getElementById('temperatura2')

    let ubicacion2 = document.getElementById('ubicacion2')
    let iconoAnimado2 = document.getElementById('icono-animado2')

    ciudad2 = dest;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(posicion => {
            console.log(posicion.coords.latitude)
            lon = posicion.coords.longitude
            lat = posicion.coords.latitude

            //ubicación por ciudad

            const url2 = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad2}&lang=es&units=metric&appid=7c2ea75f3f04318c65c62f32ccd5213c`


            fetch(url2)
                .then(response => { return response.json() })
                .then(data => {
                    console.log(data)

                    let temp = Math.round(data.main.temp)
                    temperaturaValor2.textContent = `${temp} ° C`

                    ubicacion2.textContent = data.name


                    console.log(data.weather[0].main)
                    switch (data.weather[0].main) {
                        case 'Thunderstorm':
                            iconoAnimado2.src = 'animated/thunder.svg'
                            console.log('TORMENTA');
                            break;
                        case 'Drizzle':
                            iconoAnimado2.src = 'animated/rainy-2.svg'
                            console.log('LLOVIZNA');
                            break;
                        case 'Rain':
                            iconoAnimado2.src = 'animated/rainy-7.svg'
                            console.log('LLUVIA');
                            break;
                        case 'Snow':
                            iconoAnimado2.src = 'animated/snowy-6.svg'
                            console.log('NIEVE');
                            break;
                        case 'Clear':
                            iconoAnimado2.src = 'animated/day.svg'
                            console.log('LIMPIO');
                            break;
                        case 'Atmosphere':
                            iconoAnimado2.src = 'animated/weather.svg'
                            console.log('ATMOSFERA');
                            break;
                        case 'Clouds':
                            iconoAnimado2.src = 'animated/cloudy-day-1.svg'
                            console.log('NUBES');
                            break;
                        default:
                            iconoAnimado2.src = 'animated/cloudy-day-1.svg'
                            console.log('por defecto');
                    }

                })
                .catch(error => {
                    console.log(error)
                })
        })

    }
}




