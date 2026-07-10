---
sidebar_position: 8
title: El panel de control de dig-node
description: "Gestiona tu dig-node local desde el panel de control de la DIG Chrome extension: espacio de caché .dig reservado y desalojo LRU, origen ascendente, repositorios alojados, sincronización, pares, estado en vivo y el emparejamiento del token de control."
keywords:
  - panel de control de dig-node
  - caché de dig
  - desalojo LRU
  - espacio de caché reservado
  - emparejamiento del token de control
  - repositorios alojados
  - sincronización del nodo
  - pares del nodo
tags:
  - dig-node
  - browser
  - dig-rpc
---

# El panel de control de dig-node

La DIG Chrome extension incluye un **panel de control** para tu dig-node local. Desde él puedes ver el estado en vivo del nodo, decidir cuánto espacio en disco reservar para el contenido en caché y, tras un paso de emparejamiento único, gestionar el origen ascendente del nodo, los repositorios que aloja, su sincronización y sus pares. No hace falta la línea de comandos para el uso diario.

El panel de control es el equivalente integrado en la extensión de la pantalla de gestión de nodos de DIG Browser: se comunica con el nodo que se ejecuta en tu propia máquina, así que todo permanece local.

## Abrirlo

1. Abre la extensión.
2. Ve a la pestaña **Network** (Red) y elige **Control**. (La ventana emergente compacta muestra un resumen; usa **Abrir panel de control** para ver cada sección a pantalla completa.)

El panel detecta el nodo automáticamente:

- **Nodo en ejecución** → verás la vista de gestión.
- **No se encontró ningún nodo** → verás una página breve sobre cómo instalar uno. La navegación sigue funcionando: las lecturas de contenido recurren a la red pública; un nodo solo hace falta para la vista de gestión que se describe a continuación.

## Estado en vivo

En la parte superior, un indicador en vivo muestra si tu nodo está **Conectado**, **Conectando** o **Desconectado**, junto con su dirección y versión. Se actualiza solo: inicia o detén el nodo y el indicador cambia en pocos segundos, sin necesidad de volver a abrir el panel ni de recargar.

## Reservar espacio en disco para el contenido en caché (caché y LRU)

Tu nodo mantiene una caché local del contenido que ha obtenido, de modo que las visitas repetidas sean instantáneas y ayudes a servir ese contenido. La caché tiene un **tamaño reservado**: un límite de cuánto disco puede usar. Cuando la caché supera ese límite, el nodo elimina automáticamente primero los elementos **usados menos recientemente** (una política "LRU"), de modo que el espacio que reservas nunca se supera y el contenido que realmente usas permanece en caché.

Esta sección está disponible de inmediato; no necesita emparejamiento.

**Ver cuánto se usa.** Una barra muestra el espacio usado frente al límite reservado, además de varias cifras en vivo: cuántos elementos hay en caché, su tamaño total, cuánto se ha desalojado desde que arrancó el nodo, y los conteos de aciertos/fallos de caché.

**Definir el límite reservado.** Introduce un nuevo tamaño y aplícalo. El mínimo es **64 MiB**; un valor menor se eleva a ese suelo. Bajar el límite por debajo de lo que ya está en uso desencadena el desalojo de los elementos más antiguos hasta que el uso encaje.

**Revisar y eliminar elementos en caché.** La lista de elementos en caché muestra cada uno con su tamaño, cuándo se usó por última vez y su **orden de desalojo** (la posición `0` es el siguiente elemento que se eliminaría). Puedes:

- **Desalojar un elemento** — eliminar un único elemento en caché ahora mismo.
- **Vaciar todo** — vaciar la caché por completo.

Eliminar elementos solo libera disco local; cualquier cosa que vuelvas a visitar simplemente se vuelve a obtener.

:::tip
Dale a la caché todo el espacio que puedas en una máquina desde la que navegues a menudo: una reserva más grande significa menos reobtenciones y más contenido servido localmente. En una máquina con espacio limitado, define una reserva menor; LRU conserva los elementos más útiles y descarta el resto.
:::

## Gestionar el nodo (requiere emparejamiento)

Las secciones restantes cambian la configuración del nodo, así que requieren tu permiso explícito. Como la extensión se ejecuta en el sandbox del navegador, no puede leer directamente el archivo de permisos local del nodo; en su lugar, la **emparejas** una vez. El emparejamiento otorga a la extensión su propia credencial, limitada en alcance y revocable; nunca expone la clave maestra del nodo, y solo puede aprobarse desde el ordenador donde se ejecuta el nodo.

### Emparejar la extensión con tu nodo

1. En el panel de control, elige **Emparejar**. La extensión mostrará un **código de 6 dígitos** y un id de emparejamiento.
2. En el ordenador donde se ejecuta el nodo, en una terminal, ejecuta `dig-node pair` para listar las solicitudes pendientes (o directamente `dig-node pair approve <pairing-id>`).
3. Confirma que el código mostrado en la terminal **coincide** con el código de la extensión, y luego apruébalo. Esta coincidencia es tu salvaguarda: garantiza que apruebas *esta* extensión y ninguna otra.
4. El panel de control pasa automáticamente al estado emparejado. La credencial se guarda únicamente en la extensión.

El código de emparejamiento **caduca a los pocos minutos**; si el tuyo caduca antes de aprobarlo, elige **Emparejar** de nuevo para obtener uno nuevo.

Para dejar de usar la credencial, elige **Desemparejar** en el panel (esto la olvida localmente). Para revocarla en el propio nodo, ejecuta `dig-node pair revoke <token-id>` en ese ordenador; el panel volverá al estado sin emparejar en su siguiente acción.

:::note
El emparejamiento solo hace falta para las secciones de gestión de abajo. El estado en vivo y los controles de caché/LRU de arriba funcionan sin él.
:::

### Origen ascendente

Consulta el origen ascendente del que el nodo obtiene contenido y define uno distinto. Un origen ascendente cambiado surte efecto la próxima vez que arranque el nodo.

### Repositorios alojados

Consulta los repositorios que tu nodo mantiene y fija, fija uno nuevo (para que el nodo lo conserve y lo sirva), quita la fijación de otro y comprueba el estado de cualquiera. Fijar una versión concreta la obtiene por adelantado para que esté lista para servirse.

### Sincronización

Consulta si la sincronización completa autenticada del repositorio está disponible y, para una versión concreta, dispara una sincronización para que el nodo la obtenga y la guarde en caché.

### Pares

Consulta el estado de la red de pares de tu nodo: su conexión al relay para ser alcanzable detrás de un router doméstico, y los pares a los que está conectado.

## Relacionados

- [Gestiona tu nodo](./manage.md) — las acciones administrativas de `control.*` y cómo las conduce el navegador
- [Apunta un consumidor a tu nodo](./point-a-consumer.md) — configura la extensión, el navegador o la CLI para que usen tu nodo
- [Configura dig-node](./configure.md) — puertos, el límite de caché y el origen ascendente
