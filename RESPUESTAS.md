# Respuestas — Taller Gestión de estados y efectos en React + TS

Nombre:DAVID ANDRES CARRASQUILLA GUILLIN
Ficha:3410385

---

## Misión 0 — Preparación del proyecto

Checklist técnico cumplido: proyecto arranca sin errores, `types/tienda.ts` y
`api/tiendaApi.ts` creados, Bootstrap aplicando estilos, este archivo creado.

---

## Bloque 1 — El estado por dentro

**1. Si en `registrarCombo` escribo `setVentas(ventas + 3)` una sola vez, ¿funciona?
¿Por qué sí o por qué no? ¿En qué caso dejaría de funcionar?**

Sí funciona, y de hecho es más simple que tres llamadas encadenadas — el problema
nunca fue "sumar 3", fue sumar tres veces usando el valor congelado del render
(`setVentas(ventas+1)` tres veces). Con `setVentas(ventas + 3)` una sola vez no
hay múltiples lecturas del mismo valor congelado, así que da 3 correctamente.
Dejaría de funcionar si el incremento dependiera de una condición que solo se
conoce en el momento del clic y no antes (por ejemplo, sumar una cantidad
variable calculada dentro de un bucle), o si se combinara con otra llamada que sí
necesita el valor más reciente de la cola — ahí volvería el mismo problema del
valor congelado.

**2. Cerrar caja cambia dos estados. ¿Cuántos renderizados provoca? Demuéstrelo
con un `console.log` y pegue el resultado.**

Un solo renderizado. React agrupa (batching) todas las actualizaciones de
estado que ocurren dentro del mismo manejador de evento y aplica un único
re-render al final, sin importar cuántos `setX` se llamen adentro. Para
comprobarlo: agregar `console.log('render')` en el cuerpo de `VentasCounter` y
hacer clic en "Cerrar caja" — debe imprimir una sola vez (o dos, si
`<StrictMode>` está activo, porque duplica los renders en desarrollo como red
de seguridad).

**3. Suponga que `ventas` vale 2 y ejecuto: `setVentas(ventas + 4)`;
`setVentas(v => v + 1)`; `setVentas(ventas + 1)`. ¿Cuál es el valor final?**

La cola queda así: "reemplazar por 6" (2+4), "sumar 1" (6+1=7), "reemplazar por
3" (2+1, porque `ventas` sigue congelado en 2 dentro de este render). El valor
final es **3**, porque la última instrucción de la cola es un reemplazo directo
que ignora todo lo que pasó antes.

**4. ¿Por qué el botón «Anular última» necesita la función actualizadora incluso
si solo se llama una vez por clic?**

Porque aunque el usuario haga un solo clic, el valor de `ventas` en ese render
puede no ser el más actualizado si hay otras actualizaciones en la misma cola
(por ejemplo, si el usuario hace doble clic rápido antes de que React
re-renderice). Usar `setVentas(v => v > 0 ? v - 1 : 0)` garantiza que siempre se
parte del valor real pendiente en la cola, no del valor congelado del render
en que se disparó el clic. Es una buena práctica general: si el nuevo valor
depende del anterior, siempre función actualizadora, nunca hace daño.

**5. Quite temporalmente `<StrictMode>` de `main.tsx` y describa dos diferencias
observables. Vuelva a ponerlo antes de continuar.**

(a) La consola deja de mostrar los renders y logs duplicados: cada render y
cada llamada a un inicializador o actualizador ocurre una sola vez en lugar de
dos. (b) Cualquier efecto (`useEffect`) deja de montarse-desmontarse-montarse
en el arranque; solo se ejecuta una vez. Esto hace que impurezas en el código
(mutaciones durante el render, efectos sin limpieza) dejen de ser visibles en
desarrollo, aunque el bug sigue latente y puede aparecer en producción.

---

## Bloque 2 — Mutabilidad, objetos y propiedades anidadas

**1. Después de ejecutar `romperTodo`, el precio no cambió en pantalla. Pero al
escribir una letra en Nombre apareció el 99999. Explique exactamente por qué.**

`romperTodo` muta `producto.precio` directamente y luego llama a
`setProducto(producto)` pasando la MISMA referencia. React compara con
`Object.is`: como la referencia no cambió, concluye que "nada cambió" y no
vuelve a renderizar — por eso el precio no se actualiza en pantalla aunque el
dato ya esté corrupto en memoria. Al escribir una letra en Nombre, se dispara
`setProducto({ ...producto, nombre: nuevoValor })`: ahí sí se crea un objeto
nuevo (nueva referencia), React sí re-renderiza, y ese nuevo render lee el
`producto.precio` que ya estaba mutado en 99999 desde antes. El bug estaba
escondido, no ausente.

**2. ¿Cuántos objetos nuevos se crean al cambiar la ciudad del proveedor?
Enumérelos.**

Tres: (1) el objeto `contacto` nuevo con la ciudad actualizada, (2) el objeto
`proveedor` nuevo que apunta al nuevo `contacto`, (3) el objeto `producto` nuevo
que apunta al nuevo `proveedor`. Las ramas que no cambiaron (como `nombre`,
`precio`, `stock`) se siguen compartiendo por referencia con el objeto
anterior — eso está bien, porque no cambiaron.

**3. R8 usa un valor derivado (`hayCambios`) en lugar de un `useState`. ¿Qué
problemas concretos aparecerían si se hubiera guardado en un estado?**

Habría que recordar actualizar ese estado manualmente cada vez que `producto`
cambia (en cada manejador de cambio, en `descartar`, etc.) — y bastaría
olvidarlo en un solo lugar para que `hayCambios` mienta: mostraría "sin
cambios" habiendo cambios reales, o viceversa. Es exactamente el Principio 3
(evitar estado redundante): si algo se puede calcular a partir de datos que ya
existen, no debe vivir en su propio `useState`.

**4. ¿Por qué el manejador genérico necesita el atributo `name` en el input?
¿Qué pasa si dos inputs tienen el mismo `name`?**

`name` es la clave que el manejador usa para saber qué propiedad del objeto
`producto` debe actualizar (`[name]: value`). Si el `name` del input no
coincide con una clave real del objeto, se crearía una propiedad nueva en el
estado que TypeScript debería rechazar (o, sin tipado, uno "fantasma"). Si dos
inputs comparten el mismo `name`, ambos escribirían sobre la misma clave del
estado — el segundo pisaría silenciosamente lo que el primero puso, y el
usuario vería un campo actualizándose por accidente al tocar el otro.

**5. Si el tipo `Producto` tuviera veinte campos anidados en cinco niveles,
¿qué haría distinto? Proponga una alternativa concreta y defiéndala.**

Aplicaría el Principio 5 (evitar estado profundamente anidado): aplanaría la
estructura en vez de seguir agregando niveles de spread. Por ejemplo,
separando el estado en varias piezas planas relacionadas por id (normalización,
como se ve en el Bloque 3), o adoptando Immer (`useImmer`) para escribir
"mutaciones" que por debajo generan un objeto nuevo sin tener que escribir
manualmente un spread por nivel. La razón: cada nivel de anidamiento es un
nivel de spread que hay que mantener correcto en cada manejador, y eso escala
muy mal — a los cinco niveles el código se vuelve casi ilegible y propenso a
errores de "se me olvidó copiar este nivel".

---

## Bloque 3 — Arreglos y estructura del estado

**1. En R2, ¿por qué no se puede escribir
`existente.cantidad = existente.cantidad + 1` aunque «funcione» al hacer clic
dos veces?**

Porque `existente` es una referencia al objeto que ya está dentro del arreglo
del estado. Modificarlo directamente muta ese arreglo sin cambiar su
referencia — React, al comparar con `Object.is`, puede no detectar el cambio y
no volver a renderizar. Que "funcione" al hacer doble clic es una casualidad:
probablemente otro estado disparó un re-render que arrastró el valor mutado.
Ese comportamiento intermitente es justo lo peligroso: el bug no se manifiesta
siempre, así que es más difícil de detectar.

**2. Explique con el Principio 3 qué pasaría si el total fuera un `useState` y
alguien agregara una funcionalidad nueva de descuentos.**

El Principio 3 dice que un valor calculable a partir de otro estado no debe
guardarse aparte. Si `total` fuera estado propio, cada función que toca
`items` (agregar, quitar, cambiar cantidad, vaciar) tendría que recordar
también actualizar `total` a mano. Al agregar descuentos, habría que tocar
*todas* esas funciones para que el descuento se reflejara correctamente en el
total guardado — y bastaría olvidar una sola para que el total mostrado en
pantalla no coincida con la suma real de las filas. Con `total` derivado
(`reduce` en cada render), el descuento solo se agrega en un lugar: la fórmula
del cálculo.

**3. R9 usa un tipo de unión en lugar de dos booleanos. Enumere las cuatro
combinaciones que permitirían dos booleanos y diga cuáles son imposibles en el
mundo real.**

Con `enviando: boolean` y `enviado: boolean` las cuatro combinaciones serían:
(a) `enviando=false, enviado=false` → listo, válida.
(b) `enviando=true, enviado=false` → enviando, válida.
(c) `enviando=false, enviado=true` → enviado, válida.
(d) `enviando=true, enviado=true` → "enviando y enviado a la vez", **imposible**
en el mundo real (no se puede estar todavía enviando algo que ya se confirmó
como enviado). El tipo unión `'listo' | 'enviando' | 'enviado'` elimina esa
cuarta combinación de raíz: el compilador nunca permite escribir un estado que
no tenga sentido.

**4. Si el carrito tuviera un campo `items[i].promocion.descuento.porcentaje`,
¿aplicaría el Principio 5? Escriba cómo quedaría la estructura.**

Sí aplicaría. En vez de anidar la promoción dentro de cada item del arreglo,
normalizaría: un arreglo plano de `items` que solo guarda un
`promocionId: number | null`, y una colección aparte
`promociones: Record<number, { descuento: { porcentaje: number } }>` indexada
por id. Actualizar un descuento pasaría de reconstruir un item completo dentro
de un `map` anidado a simplemente reemplazar una entrada en el diccionario de
promociones.

**5. Cambie temporalmente la llave a `key={i}`, agregue tres productos y
elimine el primero. Describa qué observa y explíquelo.**

Al eliminar la primera fila, React ve que ahora la fila en la posición 0 tiene
contenido distinto al que tenía antes en esa misma posición (porque todas las
filas "se corrieron" un lugar), pero como la `key` es el índice, React cree que
es el mismo elemento que simplemente cambió sus datos, en vez de entender que
un elemento desapareció. Si alguna fila tenía estado interno (un input a medio
escribir, por ejemplo), ese estado se queda pegado a la posición y termina
mostrándose en la fila equivocada. Con `key={item.productoId}` esto no pasa,
porque React identifica cada fila por su identidad real, no por su posición.

---

## Bloque 4 — Estado compartido, hooks propios y efectos

**1. Escriba tres letras rápido en el buscador y cuente las peticiones en la
pestaña Red. Luego quite el `useDebounce` y repita. ¿Cuántas peticiones hubo en
cada caso?**

Con `useDebounce` (400ms): una sola petición, disparada 400ms después de la
última tecla — las letras intermedias solo actualizan `terminoDiferido`
después del retardo, así que las teclas rápidas no llegan a disparar el efecto
por separado. Sin `useDebounce` (pasando `termino` directo a `useProducts`):
tres peticiones, una por cada letra, porque el efecto depende de `termino` y
este cambia en cada tecla.

**2. Elimine temporalmente la línea `return () => { ignorar = true; }` de
`useProducts`. Escriba «caf», borre y escriba «ja». Describa qué se ve y por
qué.**

Sin la bandera de limpieza, ambas peticiones (la de "caf" y la de "ja") se
resuelven de forma independiente y cualquiera que termine de último sobrescribe
`productos`, sin importar si corresponde a la búsqueda actual. Si la petición
de "caf" tarda más que la de "ja" (por la latencia simulada), el resultado
final en pantalla sería el catálogo filtrado por "caf" aunque el input ya
muestre "ja" — una condición de carrera visible.

**3. ¿Por qué el efecto del título tiene `[unidades]` como dependencia y no
`[items]`? ¿Qué pasaría con cada opción?**

`unidades` es un número primitivo: solo cambia cuando el total real de
unidades cambia. `items` es un arreglo, y cada operación inmutable (agregar,
quitar, cambiar cantidad) crea una referencia nueva del arreglo aunque el
número total de unidades no varíe (por ejemplo, quitar un producto y agregar
otro con la misma cantidad total). Si la dependencia fuera `[items]`, el efecto
se dispararía más veces de las necesarias, actualizando `document.title`
innecesariamente. Con `[unidades]`, el efecto solo corre cuando el dato que
realmente le importa cambió.

**4. Justifique su decisión sobre R8 en función del Principio 4 (duplicación) y
del Principio 3 (redundancia).**

Elegí exponer `actualizarProducto` desde dentro de `useProducts`, que hace
`map` sobre su propio arreglo interno de productos. Esto respeta el Principio 4
porque no existe una segunda copia del catálogo en `App` que deba mantenerse
sincronizada con la del hook — solo hay una fuente de verdad. Y respeta el
Principio 3 porque `App` no necesita guardar ningún estado adicional para
reflejar la edición: simplemente le pide al hook que actualice su propio
arreglo, y el nuevo valor de `productos` fluye normalmente desde `useProducts`
hacia `ProductList` y `ProductDetail` en el siguiente render.

**5. Abra React Developer Tools, seleccione `App` y luego `ProductList`.
Explique qué hooks aparecen en cada uno y por qué `useProducts` muestra varios
estados.**

En `App` deberían verse los hooks propios de ese componente: varios `State`
(`busqueda`, `seleccionadoId`, `items`, `estadoEnvio`), el hook personalizado
`useToggle` (que internamente muestra su propio `State`), el hook
`useProducts` (que se expande mostrando sus varios `State` internos:
`productos`, `cargando`, `error`, y el `State` interno de `useDebounce` que usa
por dentro), y un `Effect` correspondiente al `useEffect` del título. En
`ProductList` no debería aparecer ningún hook propio, porque es un componente
controlado: toda su información llega por props (`productos`, `seleccionadoId`,
`onSeleccionar`), no tiene `useState` ni `useEffect` internos.
`useProducts` muestra varios estados porque, aunque se llama con una sola
línea, por dentro combina tres `useState` propios más el `useState` que trae
`useDebounce` anidado — React Developer Tools despliega esa composición
completa.

**6. Envuelva la llamada a `useProducts` en un `if (busqueda.length > 0)`. Copie
el error exacto que aparece y explíquelo con la Regla 1 de los hooks. Luego
revierta el cambio.**

El linter/React arroja un error del tipo *"React Hook 'useProducts' is called
conditionally. React Hooks must be called in the exact same order in every
component render"* (o, en ejecución, *"Rendered more hooks than during the
previous render"*). Esto ocurre porque React identifica cada hook por el
**orden** en que se llama dentro del render, no por su nombre: si `busqueda`
está vacía en un render y no vacía en el siguiente, el hook a veces se llama y
a veces no, cambiando cuántos hooks se ejecutan entre un render y otro. React
pierde la correspondencia entre la posición del hook y el valor que le
corresponde, y la aplicación se rompe de forma impredecible. Por eso la Regla 1
exige llamar los hooks siempre en el nivel superior, nunca dentro de un `if`.
