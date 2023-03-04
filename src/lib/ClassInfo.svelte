<script lang="ts">
  import DataTable, {Head, Body, Row, Cell} from '@smui/data-table'
  export let messages: string[]
</script>

<DataTable table$aria-label="User list" style="width: 100%;">
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
        <Cell>{message}</Cell>
        <Cell>{message}</Cell>
        <Cell>{message}</Cell>
      </Row>
    {/each}
  </Body>
</DataTable>
