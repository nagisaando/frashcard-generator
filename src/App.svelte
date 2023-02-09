<script lang="ts">
  import svelteLogo from './assets/svelte.svg'
  import Counter from './lib/Counter.svelte'

  let classSpan: Array<Node> = []
  let messages: Array<String> = []
  let messagesText: string

  // check how to force typescript to assign type to function
  // check if there is any plugin to force to write Typescript
  async function convertHtmlClassToMessageStrArray() {
    const response = await fetch('/src/class/class-1.html')
    let htmlString = await response.text()

    const parser = new DOMParser()
    const htmlDoc = parser.parseFromString(htmlString, 'text/html')
    classSpan = [...htmlDoc.querySelectorAll("[data-qa-id='message-text']")]

    classSpan.forEach((span) => {
      if (span instanceof HTMLElement) {
        messages.push(span.innerText)
      }
    })
    messagesText = messages.join('\r\n')
  }
  convertHtmlClassToMessageStrArray()

  /** Download contents as a file
   * Source: https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
   */
  function downloadBlob(content: string, filename: string, contentType: string): void {
    // Create a blob
    var blob = new Blob([content], {type: contentType})
    var url = URL.createObjectURL(blob)

    // Create a link to download it
    var pom = document.createElement('a')
    pom.href = url
    pom.setAttribute('download', filename)
    pom.click()
  }
</script>

<main>
  <!-- 
    // linting problem
    //  Export to CSV file
  -->
  <div id="class-content" />
  {messages}
  <div>
    <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
      <img src="/vite.svg" class="logo" alt="Vite Logo" />
    </a>
    <a href="https://svelte.dev" target="_blank" rel="noreferrer">
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a>
  </div>
  <h1>Vite + Svelte</h1>
  <div class="card">
    <Counter />
  </div>

  <button on:click={() => downloadBlob(messagesText, 'export.csv', 'text/csv;charset=utf-8;')}
    >produce csv file</button
  >
  <p>
    Check out <a href="https://github.com/sveltejs/kit#readme" target="_blank" rel="noreferrer"
      >SvelteKit</a
    >, the official Svelte app framework powered by Vite!
  </p>

  <p class="read-the-docs">Click on the Vite and Svelte logos to learn more</p>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
