<script lang="ts">
  import ClassList from './lib/ClassList.svelte'
</script>

<svelte:head>
  <link rel="stylesheet" href="node_modules/svelte-material-ui/bare.css" />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700"
  />
  <!-- Roboto Mono -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto+Mono" />
</svelte:head>

<main>
  <h1>Frashcard generator</h1>
  <ClassList />
</main>

<style>
</style>
