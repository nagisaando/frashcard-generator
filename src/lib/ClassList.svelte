<script lang="ts">
  import DataTable, {Head, Body, Row, Cell} from '@smui/data-table'
  import LinearProgress from '@smui/linear-progress'
  import Button, {Label} from '@smui/button'
  import DownloadButton from './DownloadButton.svelte'
  import {onMount} from 'svelte'
  type User = {
    date: number
    name: string
    username: string
    email: string
    website: string
  }
  let items: User[] = []
  let loaded = false

  let classList: Array<ClassData> = []
  const requests: Array<Promise<Document>> = []

  // create interface for this data
  interface ResponseData {
    text(): Promise<string>
    body: ReadableStream<Uint8Array> | null
    bodyUsed: Boolean
    headers: Object
    ok: Boolean
    redirected: Boolean
    status: Number
    statusText: String
    type: String
    url: String
  }
  interface ClassData {
    messages: Array<HTMLElement>
    date: String | undefined
    tutor: String | undefined
  }
  async function convertDataToHTML(data: ResponseData) {
    let htmlString = await data.text()
    const parser = new DOMParser()
    return parser.parseFromString(htmlString, 'text/html')
  }
  function getClassData(documents: Array<Document>) {
    documents.forEach((document: Document, index: number, array: Document[]) => {
      let classData: ClassData = {messages: [], date: '', tutor: ''}
      classData.messages = [...document.querySelectorAll("[data-qa-id='message-text']")].map(
        (el) => el as HTMLElement
      )
      classData.tutor = document.querySelector("[data-qa-id='collocutor_name']")?.innerText
      classData.date = document.querySelector<HTMLElement>("[class^='DateSeparator']")?.innerText
      classList.push(classData)
    })
    classList = classList
  }
  for (let i = 1; i <= 24; i++) {
    async function convertHTML() {
      const response = await fetch(`/src/class/class-${i}.html`)
      const htmlString = await convertDataToHTML(response) // add more function here also fix response data
      return htmlString
    }
    requests.push(convertHTML())
  }
  async function convertHtmlClassToMessageStrArray() {
    const htmlDocuments = await Promise.all(requests)
    getClassData(htmlDocuments)
  }

  onMount(() => {
    convertHtmlClassToMessageStrArray()
    loadThings(false)
  })

  function loadThings(wait: boolean) {
    if (typeof fetch !== 'undefined') {
      loaded = false

      fetch(
        'https://gist.githubusercontent.com/hperrin/e24a4ebd9afdf2a8c283338ae5160a62/raw/dcbf8e6382db49b0dcab70b22f56b1cc444f26d4/users.json'
      )
        .then((response) => response.json())
        .then((json) =>
          setTimeout(
            () => {
              items = json
              loaded = true
            },
            // Simulate a long load time.
            wait ? 2000 : 0
          )
        )
    }
  }
</script>

<div style="margin-bottom: 1em;">
  <Button on:click={() => loadThings(true)}>Do Pretend Loading</Button>
</div>

<DataTable table$aria-label="User list" style="width: 100%;">
  <Head>
    <Row>
      <Cell numeric>Date</Cell>
      <Cell style="width: 100%;">Class Instructor</Cell>
      <Cell>Action</Cell>
    </Row>
  </Head>
  <Body>
    {#each classList as classData}
      <Row>
        <Cell numeric>{classData.date}</Cell>
        <Cell>{classData.tutor}</Cell>
        <Cell><DownloadButton messagesData={classData.messages} /></Cell>
      </Row>
    {/each}
  </Body>

  <LinearProgress
    indeterminate
    bind:closed={loaded}
    aria-label="Data is being loaded..."
    slot="progress"
  />
</DataTable>
