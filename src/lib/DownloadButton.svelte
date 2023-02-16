<script lang="ts">
  import Button, {Label} from '@smui/button'
  export let messagesData: HTMLElement[]
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
      if (message instanceof HTMLElement) {
        messages.push(message.innerText)
      }
    })
    let messagesText = messages.join('\r\n')
    downloadBlob(messagesText, 'export.csv', 'text/csv;charset=utf-8;')
  }
</script>

<Button on:click={() => convertArrayToCSVString()} variant="raised">
  <Label>download csv file</Label>
</Button>
