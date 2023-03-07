<script lang="ts">
  import DataTable, {Head, Body, Row, Cell} from '@smui/data-table'
  import Button, {Label} from '@smui/button'
  export let messages: string[]
  export let tutor: String | undefined
  export let date: String | undefined

  interface AnalysisedMessage {
    message: string
    lang: string | null
  }

  let AnalysisedMessageList: AnalysisedMessage[] = []
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
  async function getRevisedMessges() {
    // this has to be modified
    const requests: Array<Promise<void>> = []
    messages.forEach((message, i) => {
      async function translateMessage() {
        const lang = await detectLanguage(message)
        AnalysisedMessageList.push({
          message,
          lang,
        })
      }

      requests.push(translateMessage())
    })

    await Promise.all(requests)
    AnalysisedMessageList = AnalysisedMessageList
  }
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
  <Button on:click={async () => await getRevisedMessges()}>
    <Label>Analysis the messages</Label>
  </Button>
</div>
{#if AnalysisedMessageList.length > 0}
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
      {#each AnalysisedMessageList as data, i}
        <Row>
          <Cell>{data.message}</Cell>
          <Cell>{data.lang}</Cell>
          <Cell />
          <Cell />
        </Row>
      {/each}
    </Body>
  </DataTable>
{/if}

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
