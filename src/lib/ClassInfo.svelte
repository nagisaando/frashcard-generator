<script lang="ts">
  import DataTable, {Head, Body, Row, Cell} from '@smui/data-table'
  import Button, {Label} from '@smui/button'
  import Radio from '@smui/radio'
  import FormField from '@smui/form-field'
  import Textfield from '@smui/textfield'

  export let messages: Message[]
  export let tutor: String | undefined
  export let date: String | undefined
  interface Message {
    message: string
    lang: string | null
    en: string | null
    es: string | null
  }

  $: if (AnalysisedMessageList[0]?.message !== messages[0]?.message && !analyzing) {
    AnalysisedMessageList = messages
  }

  let AnalysisedMessageList: Message[] = messages
  // error hangling
  async function detectLanguage(text: string) {
    try {
      const response = await fetch(`http://localhost:3000/detect-language`, {
        method: 'POST',
        body: JSON.stringify({text}), // Replace with your data object
        headers: {
          'Content-Type': 'application/json',
        },
      })

      return response.text()
    } catch (err) {
      console.log(err)
      return err
    }

    // check how to send a response
  }
  let analyzing = false
  async function getRevisedMessges() {
    analyzing = true
    AnalysisedMessageList = []
    // this has to be modified
    // need different language detect
    const requests: Array<Promise<void>> = []
    messages.forEach((message, i) => {
      async function translateMessage() {
        const lang = await detectLanguage(message.message)
        // pass to chat gpt

        AnalysisedMessageList.push({
          message: message.message,
          lang,
          en: lang === 'en' ? message.message : '',
          es: lang === 'es' ? message.message : '',
        })
      }

      requests.push(translateMessage())
    })

    await Promise.all(requests)

    AnalysisedMessageList = AnalysisedMessageList
    analyzing = false
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
<!-- show preview also add feature to be able to change lang and input msg -->
<!-- message is not updating -->
{#if AnalysisedMessageList.length > 0}
  <DataTable table$aria-label="class info" table$style="width: 100%;">
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
          <!-- add the feature change locale by myself -->
          {#if data.lang}
            <Cell>
              <div class="radio-demo">
                {#each ['en', 'es'] as option}
                  <FormField>
                    <Radio bind:group={data.lang} value={option} touch /><span slot="label"
                      >{option}</span
                    >
                  </FormField>
                {/each}
              </div>
            </Cell>
          {:else}
            <Cell />
          {/if}

          <Cell
            >{#if data.en}<Textfield bind:value={data.en} />{/if}</Cell
          >

          <Cell
            >{#if data.es}<Textfield bind:value={data.es} />{/if}</Cell
          >
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
