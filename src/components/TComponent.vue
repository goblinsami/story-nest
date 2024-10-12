<script setup>

const beforeEnter = (el) => {
  el.style.height = "0";
  //el.style.opacity = "0";
};

const enter = (el, done) => {
  // Forzar el cálculo de la altura inicial correcta usando `getBoundingClientRect()`
  const initialHeight = el.getBoundingClientRect().height;
  el.style.transition = "none"; // Desactivar transición temporalmente
  el.style.height = initialHeight + "px"; // Establecer la altura inicial

  //el.offsetHeight; // Forzar un reflujo para que el navegador reconozca el cambio de estilo

  el.style.transition = "all 0.5s ease"; // Volver a habilitar la transición
  el.style.height = el.scrollHeight + "px"; // Aplicar la altura completa
  el.style.opacity = "1"; // Restaurar opacidad

  el.addEventListener("transitionend", done);
  console.log(el.scrollHeight);
};

const leave = (el, done) => {
  el.style.transition = "all 0.5s ease";
  el.style.height = "0";
  el.style.opacity = "0";
  el.addEventListener("transitionend", done);
};
</script>

<template>
      <Transition
      name="fade-height"
      @before-enter="beforeEnter"
      @enter="enter"
      @leave="leave"
    >
      <slot></slot>
    </Transition>
</template>
