<script lang="ts">
  import DataTable, {Head, Body, Row, Cell} from '@smui/data-table'
  import DownloadButton from './DownloadButton.svelte'
  import {onMount} from 'svelte'

  let loaded = false
  let classList: Array<ClassData> = []

  interface ClassData {
    messages: Array<HTMLElement>
    date: String | undefined
    tutor: String | undefined
  }

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

  function getClassData(documents: Array<Document>) {
    documents.forEach((document: Document, index: number, array: Document[]) => {
      let classData: ClassData = {messages: [], date: '', tutor: ''}
      classData.messages = [...document.querySelectorAll("[data-qa-id='message-text']")].map(
        (el) => el as HTMLElement
      )
      classData.tutor = document.querySelector<HTMLElement>(
        "[data-qa-id='collocutor_name']"
      )?.innerText
      classData.date = document.querySelector<HTMLElement>("[class^='DateSeparator']")?.innerText
      classList.push(classData)
    })
    classList = classList
  }
  async function convertDataToHTML(data: ResponseData) {
    let htmlString = await data.text()
    const parser = new DOMParser()
    return parser.parseFromString(htmlString, 'text/html')
  }
  async function getHTMLData() {
    const requests: Array<Promise<Document>> = []
    for (let i = 1; i <= 24; i++) {
      async function convertHTML() {
        const response = await fetch(`/src/class/class-${i}.html`)
        const htmlString = await convertDataToHTML(response) // add more function here also fix response data
        return htmlString
      }
      requests.push(convertHTML())
    }
    const responses = await Promise.all(requests)
    return responses
  }
  onMount(async () => {
    const responses = await getHTMLData()
    getClassData(responses)
  })
</script>

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
</DataTable>
