<script lang="ts">
  import DataTable, {Head, Body, Row, Cell} from '@smui/data-table'
  import DownloadButton from './DownloadButton.svelte'
  import {onMount} from 'svelte'

  const classFileNumber = 24
  let classList: Array<ClassData> = []

  interface ClassData {
    messages: Array<HTMLElement>
    date: String | undefined
    tutor: String | undefined
    buttonClicked: boolean | undefined
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
      let classData: ClassData = {messages: [], date: '', tutor: '', buttonClicked: false}
      let messageData = [...document.querySelectorAll("[data-qa-id='message-text']")]
      messageData.forEach((el) => {
        classData.messages.push(el.innerText)
      })
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
    for (let i = 1; i <= classFileNumber; i++) {
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
  function onClickButton(index: number) {
    classList[index].buttonClicked = true
    classList = classList
    localStorage.setItem('classes', JSON.stringify(classList))
  }
  onMount(async () => {
    const classDataFromLocalStorage = localStorage.getItem('classes')
    let classSavedData = []
    if (classDataFromLocalStorage) {
      classSavedData = JSON.parse(localStorage.getItem('classes') || '')
    }
    if (classSavedData.length !== classFileNumber) {
      const responses = await getHTMLData()
      getClassData(responses)

      // need to check how to store htmlelement or convert to string before store it to localstorage
      console.log(classList)
      console.log(JSON.stringify(classList))
      localStorage.setItem('classes', JSON.stringify(classList))
    } else {
      classList = classSavedData
    }
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
    {#each classList as classData, i}
      <Row>
        <Cell numeric>{classData.date}</Cell>
        <Cell>{classData.tutor}</Cell>
        <Cell
          ><DownloadButton
            on:click={() => {
              onClickButton(i)
            }}
            clicked={classData.buttonClicked}
            messagesData={classData.messages}
          /></Cell
        >
      </Row>
    {/each}
  </Body>
</DataTable>
