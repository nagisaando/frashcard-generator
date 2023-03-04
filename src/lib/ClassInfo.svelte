<script lang="ts">
  import DataTable, {Head, Body, Row, Cell} from '@smui/data-table'
  import Button, {Label} from '@smui/button'
  import {onMount} from 'svelte'
  export let messages: string[]
  export let tutor: String | undefined
  export let date: String | undefined

  onMount(() => console.log('rendered'))
</script>

<DataTable table$aria-label="class info" style="width: 100%; margin-top: 3rem;">
  <Head>
    <Row>
      <Cell class="table-header">
        <dir>
          <h2>Class Info</h2>
          <ul>
            <li>Tutor: {tutor}</li>
            <li>Date: {date}</li>
          </ul>
        </dir>
        <!-- create button to analise -->
        <Button>
          <Label>Analysis the messages</Label>
        </Button>
      </Cell>
      {#each Array(3) as i}
        <Cell style="width: 0; padding: 0" />
      {/each}
    </Row>
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
