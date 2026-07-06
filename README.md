# To-Do

Base tecnica minima para validar Ionic Angular standalone ejecutandose como aplicacion web y preparada para Apache Cordova Android.

## Objetivo

Comprobar que un proyecto Ionic Angular completamente standalone, sin NgModules y sin Capacitor, puede compilar a `www` y ser reconocido por Cordova desde la raiz del proyecto.

## Stack

- Ionic Angular `^8.0.0`
- Angular `20.3.25`
- Angular CLI `20.3.28`
- TypeScript `5.9.3`
- Apache Cordova CLI `13.0.0`
- cordova-android `15.0.0`
- Node.js `24.16.0`
- npm `11.13.0`
- Java JDK `17.0.19`

## Instalacion

```powershell
npm install
```

## Ejecutar en navegador

```powershell
npm start
```

El script ejecuta `ionic serve`.

## Build web

```powershell
npm run build
```

El build genera la salida directamente en `www`. El archivo principal esperado es:

```text
www/index.html
```

## Preparar Android

```powershell
npm run android:prepare
```

El script ejecuta `npm run build` y despues `npx cordova prepare android`.

## Generar APK

```powershell
npm run android:build
```

El script ejecuta `npm run build` y despues `npx cordova build android`.

## Validaciones reales

- `npm install`: correcto.
- `npx cordova platform ls`: correcto; reconoce el proyecto Cordova.
- `ionic serve --no-open --host 127.0.0.1 --port 8100`: correcto; respondio HTTP 200 y se detuvo el servidor.
- `ionic build`: correcto; salida en `www`.
- `www/index.html`: existe.
- `www/browser/index.html`: no existe.
- Archivos JavaScript y CSS: existen directamente en `www`.
- `npx cordova requirements android` antes de agregar la plataforma: fallo porque Cordova aun no tenia plataformas agregadas.
- `npx cordova platform add android`: correcto; agrego `cordova-android@15.0.0`.
- `npx cordova requirements android` despues de agregar la plataforma: parcial; Java y Android SDK fueron detectados, pero faltan requisitos.
- `npx cordova prepare android`: correcto.
- `npx cordova build android`: fallo por entorno Android; no se genero APK.

## Requisitos faltantes

- Instalar Gradle o Android Studio para que Cordova pueda encontrar Gradle.
- Instalar Android SDK Platform exacta `platforms;android-36`.
- Definir `ANDROID_HOME` apuntando a `C:\Users\nivek\AppData\Local\Android\sdk` es recomendado; Cordova encontro ese SDK por defecto, pero la variable esta indefinida.

## Angular standalone y Cordova

La app arranca con `bootstrapApplication(AppComponent, appConfig)` desde `src/main.ts`. Los providers de Ionic y Router viven en `src/app/app.config.ts`, y las rutas en `src/app/app.routes.ts`.

Cordova toma los archivos compilados desde `www`, configurado en `angular.json` con el builder `@angular-devkit/build-angular:application` y `outputPath.base = "www"` con `outputPath.browser = ""`. `config.xml` usa `content src="index.html"`, y Angular usa `base href="./"` mas rutas hash para cargar correctamente dentro del WebView.
