---
sidebar_position: 6
title: Troubleshooting — get unstuck
description: "Cada fallo te da un código estable y un request-id que enlaza directamente con el log del servidor, los gastos en cadena están protegidos contra condiciones de carrera para que nunca pagues dos veces, y verificaciones previas claras evitan capsules desperdiciados antes de gastar $DIG."
keywords:
  - DIG troubleshooting
  - error codes
  - request id
  - dry-run
  - if-changed
  - doctor
tags:
  - dig-rpc
  - digstore-cli
  - dighub
  - capsule
---

# Troubleshooting {#troubleshooting}

> Cada fallo te da un **código estable** y un **request-id** que enlaza directamente con el log del servidor, los gastos en cadena están **protegidos contra condiciones de carrera** para que nunca pagues dos veces, y verificaciones previas claras evitan capsules desperdiciados antes de gastar $DIG.

## El modelo mental — encuentra tu fallo por su código {#the-mental-model--find-your-failure-by-its-code}

Cada superficie — el dig RPC, la CLI de digstore, DIGHUb, el loader `chia://`, el SDK — asigna un fallo a un **código ESTABLE**. **Ramifica según el código, nunca según el mensaje.** Un catálogo consolidado los cubre todos y también se publica en formato legible por máquinas.

Las verificaciones previas (`digstore doctor`, `--dry-run`, `--if-changed`) y los anclajes reanudables significan que una publicación atascada o sin efecto **nunca gasta silenciosamente**.

## Fallos comunes de publicación {#common-publishing-failures}

Fondos insuficientes, un tiempo de espera de confirmación agotado (reanudable — tu gasto no se pierde), y el "la raíz remota ha avanzado" de no-fast-forward.

→ [Resolución de problemas](../support/troubleshooting.md)

## Fallos de lectura y verificación {#read--verify-failures}

Discrepancia de pruebas, errores de descifrado/salt, y respuestas de no-encontrado / decoy.

→ [Fallos de lectura y verificación](../support/troubleshooting.md#verification-failed)

## Problemas de wallet y sesión {#wallet--session-issues}

Conexión, reautenticación, una solicitud rechazada, y sesiones de solo lectura que no pueden firmar.

→ [La sesión de wallet no puede firmar](../support/troubleshooting.md#wallet-session)

## Verificaciones previas y de costo — no desperdicies un capsule {#pre-flight--cost-checks--dont-waste-a-capsule}

`digstore doctor` (entorno + preparación), `--dry-run` (previsualiza el costo y el capsule que se generaría), y `--if-changed` (una build idéntica byte a byte es un no-op).

→ [Deploy desde GitHub Actions](../digstore/cli/deploy-from-github-actions.md) · [Anclaje en cadena → costo y seguridad](../digstore/cli/onchain-anchoring.md#cost-and-safety)

## Referencia de códigos de error {#error-codes-reference}

Códigos de salida de la CLI · RPC `-32xxx` · DIGHUb · dig-loader · SDK — una tabla consolidada.

→ [Códigos de error](../support/error-codes.md)

## Preguntas frecuentes {#faq}

Costo, la prueba gratuita, por qué el precio es uniforme, dónde conseguir $DIG, y "¿hay una testnet?".

→ [Preguntas frecuentes](../support/faq.md)

## Obtener ayuda {#get-help}

Discord + GitHub, y cómo presentar un buen reporte — **nunca pegues secretos**.

→ [Obtener ayuda](../support/get-help.md)

## Estado y changelog {#status--changelog}

→ [Estado](../support/status.md) · [Changelog](../support/changelog.md)

---

## Profundiza: el protocolo {#go-deeper-the-protocol}

- **fallos de lectura y verificación** → [Pruebas y seguridad](../digstore/format/proofs-and-security.md) · [URNs y cifrado](../digstore/format/urns-and-encryption.md)
- **códigos `-32xxx` de RPC** → [los métodos del dig RPC](../rpc/methods.md) · [Conformidad](../rpc/conformance.md)
- **Todo** → [Inmersión profunda en el protocolo](../protocol-deep-dive.md) · [Conceptos y glosario](../concepts.md)
