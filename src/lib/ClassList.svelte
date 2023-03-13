<script lang="ts">
  import DataTable, {Head, Body, Row, Cell} from '@smui/data-table'
  import Switch from '@smui/switch'
  import DownloadButton from './DownloadButton.svelte'
  import {onMount} from 'svelte'
  import ClassInfo from './ClassInfo.svelte'
  import Button from '@smui/button/src/Button.svelte'

  const classFileNumber = 27
  let classList: Array<ClassData> = []

  interface ClassData {
    messages: Array<string>
    date: String | undefined
    tutor: String | undefined
    addedToFrashcard: boolean | undefined
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
      let classData: ClassData = {
        messages: [],
        date: '',
        tutor: '',
        addedToFrashcard: false,
        buttonClicked: false,
      }
      let messageData = [...document.querySelectorAll("[data-qa-id='message-text']")]
      messageData.forEach((el) => {
        if (el instanceof HTMLElement) {
          classData.messages.push(el.innerText)
        }
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
  async function getHTMLData(firstClassIndex: number) {
    const requests: Array<Promise<Document>> = []
    for (let i = firstClassIndex; i <= classFileNumber; i++) {
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

  function saveClassList() {
    classList = classList
    localStorage.setItem('classes', JSON.stringify(classList))
  }
  function onClickButton(index: number) {
    classList[index].buttonClicked = true
    saveClassList()
  }

  function addToFrashCard(index: number) {
    classList[index].addedToFrashcard = true
    saveClassList()
  }
  interface ActiveMessageValue {
    message: string
    lang: null
  }
  let activeMessages: Array<ActiveMessageValue> = []
  let tutor: String | undefined
  let date: String | undefined

  function getClassInfo(index: number) {
    activeMessages = classList[index].messages.map((el) => ({message: el, lang: null}))
    tutor = classList[index].tutor
    date = classList[index].date
  }
  async function detectLanguage(text: string) {
    await fetch(`http://localhost:3000/detect-language`, {
      method: 'POST',
      body: JSON.stringify({text}), // Replace with your data object
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.text()) // convert the response to text format
      .then((data) => {
        console.log(data) // log the response data to the console
        // use the response data as needed
      })
    // check how to send a response
  }
  onMount(async () => {
    detectLanguage('hey how are you')
    async function getClasses(firstClassIndex: number) {
      const responses = await getHTMLData(firstClassIndex)
      getClassData(responses)
      saveClassList()
    }
    const classDataFromLocalStorage = localStorage.getItem('classes')
    let classSavedData = []
    if (classDataFromLocalStorage) {
      classSavedData = JSON.parse(localStorage.getItem('classes') || '')
    }

    if (classSavedData.length === classFileNumber) {
      classList = classSavedData
    } else if (classSavedData.length < classFileNumber) {
      // updates list if there is any new class
      classList = classSavedData
      getClasses(classSavedData.length + 1)
    } else {
      // if there is no class data, it will create
      getClasses(1)
    }
  })
</script>

<DataTable table$aria-label="User list" style="width: 100%;">
  <Head>
    <Row>
      <Cell numeric>Date</Cell>
      <Cell style="width: 100%;">Class Instructor</Cell>
      <Cell>Action</Cell>
      <Cell>Added to frashcard</Cell>
      <Cell />
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
        <Cell>
          <Switch
            bind:checked={classData.addedToFrashcard}
            on:SMUISwitch:change={() => addToFrashCard(i)}
          />
        </Cell>
        <Cell>
          <Button
            on:click={() => {
              getClassInfo(i)
            }}>See Class info</Button
          >
        </Cell>
      </Row>
    {/each}
  </Body>
</DataTable>

{#if activeMessages.length > 0}
  <ClassInfo messages={activeMessages} {tutor} {date} />
{/if}
