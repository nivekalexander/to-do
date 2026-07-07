# To-Do

Aplicación de gestión de tareas desarrollada con Ionic, Angular standalone y Apache Cordova.

Permite crear, categorizar, filtrar y cambiar el estado de las tareas. La aplicación puede trabajar con almacenamiento local o con Firebase dependiendo del ambiente seleccionado.

El proyecto fue organizado buscando que pueda crecer sin mezclar la lógica de las funcionalidades, separando tareas, categorías, acceso a datos, configuración de Firebase y componentes compartidos.

## Funcionalidades

- Crear tareas.
- Crear, editar y eliminar categorías.
- Asignar una categoría a una tarea.
- Cambiar una tarea entre los estados:
  - No iniciado.
  - En progreso.
  - Terminado.
- Eliminar tareas.
- Filtrar tareas por estado y categoría.
- Ocultar los grupos que no tienen resultados cuando existe un filtro activo.
- Persistir los datos localmente con Ionic Storage.
- Persistir los datos remotamente con Firebase Firestore.
- Crear sesiones anónimas con Firebase Authentication.
- Activar o desactivar los filtros mediante Firebase Remote Config.
- Ejecutar la aplicación en navegador, Android e iOS mediante Cordova.
- Seleccionar automáticamente la fuente de datos según el ambiente.

## Tecnologías utilizadas

- Angular 20.
- TypeScript 5.
- Ionic Angular 8.
- RxJS.
- Angular Signals.
- Apache Cordova 13.
- Cordova Android 15.
- Cordova iOS 8.
- Firebase Authentication.
- Cloud Firestore.
- Firebase Remote Config.
- AngularFire.
- Ionic Storage.
- Jasmine y Karma.
- ESLint.
- Git y GitHub.

## Arquitectura

La aplicación está organizada por funcionalidades.

Las funcionalidades de tareas y categorías se encuentran separadas, pero comparten contratos, modelos y acceso al estado cuando es necesario.

La estructura principal es:

```text
src/app/
|-- core/
|   |-- data-access/
|   |   `-- todo/
|   |       |-- repositories/
|   |       `-- provide-todo-repository.ts
|   |-- feature-flags/
|   |-- firebase/
|   |-- layout/
|   `-- storage/
|
|-- features/
|   |-- tasks/
|   |   |-- components/
|   |   |-- data-access/
|   |   `-- pages/
|   |
|   `-- categories/
|       |-- components/
|       |-- data-access/
|       `-- pages/
|
`-- shared/
    |-- components/
    |-- data-access/
    `-- models/
```

### Core

Contiene servicios y configuraciones globales de la aplicación:

- Inicialización de Firebase.
- Selección del repositorio de datos.
- Implementaciones de almacenamiento.
- Servicio de Remote Config.
- Header y navegación inferior.
- Configuración compartida por toda la aplicación.

### Features

Cada funcionalidad contiene sus propios componentes, páginas y facade.

Actualmente existen dos features principales:

```text
tasks
categories
```

La vista de tareas no accede directamente a Firestore o Ionic Storage. Las operaciones se realizan mediante una facade y un contrato de repositorio.

La vista de categorías utiliza la misma estrategia, manteniendo su lógica separada de la interfaz.

### Shared

Contiene elementos que pueden ser utilizados por más de una funcionalidad:

- Modelos de tareas y categorías.
- Contrato del repositorio.
- Store compartido.
- Modal reutilizable.
- Estado vacío reutilizable.

## Flujo de datos

El flujo principal es:

```text
Página
-> Facade
-> Store
-> Contrato de repositorio
-> Implementación local, mock o Firebase
```

La aplicación no depende directamente de Firebase dentro de los componentes.

Esto permite cambiar la fuente de datos sin modificar la lógica visual de las funcionalidades.

## Repositorios disponibles

El proyecto contiene diferentes implementaciones del mismo contrato.

### Repositorio local

Utiliza Ionic Storage para guardar tareas y categorías en el dispositivo.

Se utiliza en el ambiente local.

### Repositorio Firebase

Utiliza Firebase Authentication y Cloud Firestore.

Cada usuario recibe una sesión anónima y sus datos se guardan separados por UID.

La estructura utilizada en Firestore es:

```text
users
`-- {userId}
    |-- tasks
    `-- categories
```

### Repositorio mock

Permite probar la aplicación con datos controlados sin depender de Firebase ni del almacenamiento del dispositivo.

También facilita las pruebas unitarias.

## Ambientes

El proyecto contiene tres ambientes.

### Local

Archivo:

```text
src/environments/environment.ts
```

Comando:

```powershell
npm run start:local
```

Características:

- No se conecta a Firebase.
- Utiliza Ionic Storage.
- Remote Config utiliza valores locales.
- Es el ambiente utilizado por defecto con `npm start`.

### Development

Archivo:

```text
src/environments/environment.dev.ts
```

Comando:

```powershell
npm run start:dev
```

Características:

- Se conecta al proyecto Firebase de desarrollo.
- Utiliza Authentication anónima.
- Utiliza Cloud Firestore.
- Consulta Firebase Remote Config.
- Permite probar cambios sin afectar producción.

### Production

Archivo:

```text
src/environments/environment.prod.ts
```

Comando de compilación:

```powershell
npm run build:prod
```

Características:

- Se conecta al proyecto Firebase de producción.
- Utiliza una configuración independiente de desarrollo.
- Remote Config utiliza caché para evitar consultas innecesarias.
- Es el ambiente usado para generar el APK final.

## Firebase Remote Config

La aplicación incluye el siguiente feature flag:

```text
task_filters_enabled
```

Comportamiento:

```text
true
Muestra el botón y el modal de filtros.

false
Oculta el botón de filtros y limpia cualquier filtro activo.
```

El parámetro debe existir tanto en Firebase DEV como en Firebase PROD.

Configuración:

```text
Nombre:
task_filters_enabled

Tipo:
Boolean

Valor predeterminado:
true
```

En el ambiente local no se consulta Firebase Remote Config. La aplicación utiliza el valor definido en el environment.

Si Remote Config no está disponible o se presenta un error de conexión, la aplicación utiliza el valor local como respaldo.

## Instalación

Requisitos principales:

- Node.js 24.
- npm 11.
- Java JDK 17.
- Android Studio.
- Android SDK.
- Gradle.
- Apache Cordova.

Clonar el repositorio:

```powershell
git clone https://github.com/nivekalexander/to-do.git
cd to-do
```

Instalar dependencias:

```powershell
npm install
```

## Ejecutar en navegador

Ambiente local:

```powershell
npm start
```

También se puede ejecutar con:

```powershell
npm run start:local
```

Ambiente de desarrollo con Firebase:

```powershell
npm run start:dev
```

## Compilaciones web

Build local:

```powershell
npm run build:local
```

Build de desarrollo:

```powershell
npm run build:dev
```

Build de producción:

```powershell
npm run build:prod
```

La salida web se genera en:

```text
www/
```

Cordova utiliza esta carpeta para construir las aplicaciones nativas.

## Validaciones

Validación de TypeScript:

```powershell
npm run typecheck
```

Pruebas unitarias:

```powershell
npm run test:ci
```

Build de desarrollo:

```powershell
npm run build:dev
```

Build de producción:

```powershell
npm run build:prod
```

Validación completa recomendada:

```powershell
npm run typecheck
npm run test:ci
npm run build:dev
npm run build:prod
```

## Android

Preparar el proyecto Android con Firebase DEV:

```powershell
npm run android:prepare:dev
```

Preparar el proyecto Android con Firebase PROD:

```powershell
npm run android:prepare
```

Generar APK de desarrollo:

```powershell
npm run android:build:dev
```

Generar APK con configuración de producción:

```powershell
npm run android:build
```

El APK generado se encuentra normalmente en:

```text
platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

También se puede ejecutar directamente en un dispositivo conectado:

```powershell
npx cordova run android --device
```

Para verificar los dispositivos disponibles:

```powershell
adb devices
```

## iOS

La compilación de iOS requiere macOS y Xcode.

Como el desarrollo principal se realizó desde Windows, se utilizó Ionic Appflow para generar un build de simulador iOS.

Proceso utilizado:

```text
GitHub
-> Ionic Appflow
-> Build iOS Simulator
-> Archivo .app
-> Appetize
```

El build de simulador fue probado en Appetize utilizando diferentes modelos y versiones de iPhone.

Un archivo `.app` de simulador no es equivalente a un archivo `.ipa`.

Para generar un IPA instalable en un dispositivo físico se necesitan:

- Cuenta de Apple Developer.
- Certificado de distribución.
- Provisioning Profile.
- Build firmado desde Xcode o un servicio como Appflow.

## Firebase Authentication

La aplicación utiliza autenticación anónima.

No se solicita un formulario de registro porque el objetivo de la prueba es validar la persistencia y separación de datos.

Cada instalación obtiene un UID y sus datos quedan almacenados en su propio documento de usuario.

## Reglas de Firestore

Los usuarios solamente pueden leer y modificar los documentos asociados a su propio UID.

Ejemplo de estructura de las reglas:

```text
users/{userId}/...
```

La validación compara el UID autenticado con el UID del documento solicitado.

Esto evita que una sesión pueda consultar o modificar los datos de otra.

## Optimización de rendimiento

Se aplicaron las siguientes técnicas:

- `ChangeDetectionStrategy.OnPush` en los componentes.
- Signals para manejar estado reactivo.
- Computed signals para valores derivados.
- Lazy loading en las páginas.
- Renderizado condicional de los grupos de tareas.
- Los grupos vacíos no se renderizan cuando existen filtros activos.
- Separación entre componentes visuales y lógica de negocio.
- Caché de Remote Config en producción.
- Persistencia desacoplada mediante repositorios.
- Uso de identificadores estables para actualizar tareas y categorías.
- Inicialización de Firebase solamente en los ambientes que lo necesitan.

## Calidad y mantenibilidad

Para mantener el código organizado se utilizaron:

- Angular standalone.
- TypeScript estricto.
- Facades por funcionalidad.
- Contratos de repositorio.
- Inyección de dependencias.
- Componentes con responsabilidades concretas.
- Modelos compartidos.
- Pruebas unitarias.
- Validación de tipos antes de compilar.
- Commits separados por responsabilidad.
- Ambientes independientes para local, desarrollo y producción.

La estructura permite reemplazar Firebase por otra API o almacenamiento sin modificar los componentes visuales.

También facilita que tareas y categorías puedan separarse en módulos independientes o microfrontends en una evolución futura.

## Decisiones técnicas

### Por qué se utilizó un contrato de repositorio

El contrato evita que las funcionalidades dependan directamente de Firebase o Ionic Storage.

Las facades trabajan con una interfaz común y la implementación se selecciona durante la configuración de la aplicación.

### Por qué se utilizaron facades

Las facades concentran las operaciones disponibles para cada funcionalidad.

Las páginas solamente coordinan la interfaz y delegan las operaciones de datos.

### Por qué se utilizaron signals

Los signals permiten mantener el estado reactivo de manera simple y evitar suscripciones manuales para el estado interno de las vistas.

### Por qué se separaron tareas y categorías

Aunque ambas funcionalidades comparten datos, representan responsabilidades distintas.

Separarlas reduce el acoplamiento y facilita el crecimiento del proyecto.

### Por qué se utilizaron tres ambientes

El ambiente local permite trabajar sin depender de internet o Firebase.

El ambiente DEV permite probar integraciones remotas sin afectar producción.

El ambiente PROD se reserva para los binarios finales.

## Pruebas funcionales realizadas

Se probaron los siguientes flujos:

- Crear una categoría.
- Editar una categoría.
- Eliminar una categoría.
- Crear una tarea sin categoría.
- Crear una tarea con categoría.
- Mover una tarea a En progreso.
- Mover una tarea a Terminado.
- Regresar una tarea a un estado anterior.
- Eliminar una tarea.
- Filtrar por estado.
- Filtrar por categoría.
- Combinar filtros.
- Activar y desactivar filtros con Remote Config.
- Persistencia local.
- Persistencia con Firebase DEV.
- Persistencia con Firebase PROD.
- Navegación entre tareas y categorías.
- Ejecución en navegador.
- Ejecución en Android físico.
- Ejecución en emulador Android.
- Ejecución en simulador iOS mediante Appetize.

## Limitaciones conocidas

La validación de iOS se realizó mediante un build de simulador generado en Appflow y ejecutado en Appetize.

En algunas sesiones de Appetize se observó un cálculo inicial incorrecto de la altura del WKWebView. El layout se corrige cuando la aplicación pasa a segundo plano y vuelve a abrirse.

El comportamiento no se presentó en navegador ni en Android físico.

La validación definitiva de un IPA en un iPhone físico requiere credenciales y hardware de Apple.

## Evidencias

Las capturas y videos de funcionamiento se encuentran en la carpeta:

```text
docs/evidencias/
```

Se incluyen evidencias de:

- Aplicación Android.
- Simulador iOS.
- Creación de tareas.
- Gestión de categorías.
- Filtros.
- Cambio de estados.
- Firebase Authentication.
- Cloud Firestore.
- Firebase Remote Config.

## Repositorio

```text
https://github.com/nivekalexander/to-do
```

## Autor

Kevin Alexander García Romero