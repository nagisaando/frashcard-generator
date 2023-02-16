<script lang="ts">
  import ClassList from './lib/ClassList.svelte'
  import Button, {Label} from '@smui/button'
  let classSpan: Array<Node> = []
  let messages: Array<String> = []
  let messagesText: string

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
  // create csv download button
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
  <Button
    on:click={() => downloadBlob(messagesText, 'export.csv', 'text/csv;charset=utf-8;')}
    variant="raised"
  >
    <Label>produce csv file</Label>
  </Button>
</main>

<style>
</style>
