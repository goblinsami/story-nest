<script setup>
const { story } = defineProps({
  story: {
    required: true,
  },
});

</script>

<template>
  <main>
        <article>
      <h1><input type="text" class="title" v-model="story.title" /></h1>
      <h2>
        <textarea
          type="textarea"
          class="sub-title"
          v-model="story.description"
        ></textarea>
      </h2>

      <br />
      <ul v-for="act in story.acts">
        <h3><input type="text" class="title" v-model="act.title" /></h3>
        <li v-for="scene in act.scenes">
          <tr>
            <td
              ><input type="text" class="description" v-model="scene.title"
            />
          </td>
            <td>
              <textarea
                type="text"
                class="description"
                v-model="scene.description"
              ></textarea>

            </td>
          </tr>
          </li>

      </ul>
    </article>
  </main>

</template>
