Fidalgo
=======

Generador de sitios web / blogs semidinámicos al estilo de Jekyll pero en NodeJS


Me gusta el estilo de Jekyll pero no me gusta ruby así que decidí escribir algo parecido, pero a mi manera para node js.


Para usar: 

```
mkdir blog
cd blog
npm install fidalgo
ln -s node_modules/fidalgo/fidalgo.js fidalgo
chmod a+x fidalgo
./fidalgo init
```

Con esto se crea una carpeta src y un archivo fidalgo.config.js. En este archivo reside la configuración del sitio, El cual podemos entrar a configurar pero inmediatamente podemos poner en funcionamiento el sitio con:

```
./fidalgo
```

Esto generará el sitio dentro de la carpeta site y lo pondrá activo en http://localhost:4000




## Por Hacer
 * [gral] Watch
 * [gral] Inicialización
 * [docs] Documentación del config
 * [pages] Datos heredados
 
 