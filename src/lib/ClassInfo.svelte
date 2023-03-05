<script lang="ts">
  import DataTable, {Head, Body, Row, Cell} from '@smui/data-table'
  import Button, {Label} from '@smui/button'
  import {onMount} from 'svelte'
  export let messages: string[]
  export let tutor: String | undefined
  export let date: String | undefined

  async function detectLanguage(text: string) {
    return await fetch(`http://localhost:3000/detect-language`, {
      method: 'POST',
      body: JSON.stringify({text}), // Replace with your data object
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.text()) // convert the response to text format
      .then((data) => {
        return data
      })
    // check how to send a response
  }
  function getRevisedMessges() {
    // this has to be modified
    const requests: Array<Promise<>> = []
    messages.forEach((message) => {
      async function translateMessage() {
        const lang = await detectLanguage(message)
      }
      requests.push(translateMessage())
    })

    const requests: Array<Promise<Document>> = []
    for (let i = firstClassIndex; i <= classFileNumber; i++) {
      async function convertHTML() {
        const response = await fetch(`/src/class/class-${i}.html`)
        const htmlString = await convertDataToHTML(response) // add more function here also fix response data
        return htmlString
      }
      requests.push(convertHTML())
    }
  }
  onMount(() => console.log('rendered'))
</script>

<div>
  <dir>
    <h2>Class Info</h2>
    <ul>
      <li>Tutor: {tutor}</li>
      <li>Date: {date}</li>
    </ul>
  </dir>
  <!-- create button to analise -->
  <Button on:click={() => getRevisedMessges()}>
    <Label>Analysis the messages</Label>
  </Button>
</div>
<DataTable table$aria-label="class info" style="width: 100%; margin-top: 3rem;">
  <Head>
    <Row>
      <Cell>Message</Cell>
      <Cell>Lang</Cell>
      <Cell>English</Cell>
      <Cell>Spanish</Cell>
    </Row>
  </Head>
  <Body>
    {#each messages as message, i}
      <Row>
        <Cell>{message}</Cell>
        <Cell />
        <Cell />
        <Cell />
      </Row>
    {/each}
  </Body>
</DataTable>

<style lang="scss">
  @import '@material/theme/color-palette';
  :global(.table-header) {
    background-color: rgba(98, 0, 238, 0.2) !important;
    display: flex;
    width: 100%;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
</style>
