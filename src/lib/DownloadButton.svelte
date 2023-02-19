<script lang="ts">
  import Button, {Label} from '@smui/button'
  import {createEventDispatcher} from 'svelte'
  export let messagesData: HTMLElement[]
  export let clicked: boolean | undefined

  /** Download contents as a file
   * Source: https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
   */
  let messages: Array<String> = []
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

  function convertArrayToCSVString() {
    messagesData.forEach((message) => {
      console.log(message)
      if (message instanceof HTMLElement) {
        messages.push(message.innerText)
      }
    })
    let messagesText = messages.join('\r\n')
    downloadBlob(messagesText, 'export.csv', 'text/csv;charset=utf-8;')
  }

  const dispatch = createEventDispatcher()
  function onClick() {
    dispatch('click')
  }
</script>

<Button
  on:click={() => convertArrayToCSVString()}
  on:click={() => onClick()}
  variant="raised"
  style="background: {clicked ? 'grey' : ''}"
>
  <Label>{clicked ? 'Downloaded' : 'Download csv file'}</Label>
</Button>
