//Registro de caches
const STATIC_CACHE = 'static-v4';
const DYNAMIC_CACHE = 'dynamic-v2';
const INMUTABLE_CACHE = 'inmutable-v1';

//Registro de la estructura de la APP en un array para el cache STATIC
const APP_SHELL_STATIC = [
    //'/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js'
];

//Registro de la estructura de la APP en un array para el cache INMUTABLE
const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];



//Creamos los cachés y le asignamos las rutas a guardar que hemos generado arriba
self.addEventListener('install', event => {

    //Creamos el cache STATIC
    const cacheStatic = caches.open( STATIC_CACHE ).then(cache => {
        return cache.addAll( APP_SHELL_STATIC );
    });

    //Creamos el cache INMUTABLE
    const cacheInmutable = caches.open( INMUTABLE_CACHE ).then(cache => {
        return cache.addAll( APP_SHELL_INMUTABLE );
    });

    event.waitUntil( Promise.all([ cacheStatic, cacheInmutable ]) );

});



//Eliminar los caches antiguos y que no sirven ya
self.addEventListener('activate', event => {

    //Verificamos si en el cache, existen otros con el nombre de 'static'
    const deleteCaches = caches.keys().then(keys => {
        //Interactuamos con cada cache guardado
        keys.forEach(key => {
            //Eliminamos el cache estatico que no se usa para tener la última versión registrada
            if( key != STATIC_CACHE && key.includes('static') ) {
                return caches.delete(key);
            }

            //Eliminamos el cache dinámico que no se usa para tener la última versión registrada
            if( key != DYNAMIC_CACHE && key.includes('dynamic') ) {
                return caches.delete(key);
            }
        });
    });

    event.waitUntil(deleteCaches);

});



//Estrategia de CACHE ONLY que servirá para meter recursos en el caché DINAMICO
self.addEventListener('fetch', event => {

    //Comprobamos todas las rutas de los ficheros en el caché
    const respuesta = caches.match( event.request ).then(res => {

        if(res) {
            return res;
        } else {
            //Verificamos las URLS que no están siendo almacenadas en caché
            //console.log(event.request.url);
            return fetch( event.request ).then( fetchResponse => {
                //Guardamos el cache
                caches.open(DYNAMIC_CACHE).then( cache => {
                    cache.put( event.request, fetchResponse );
                });
            });
        }
        
    });

    event.waitUntil(respuesta);

});