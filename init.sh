curl -X PUT "localhost:9200/_ingest/pipeline/attachment" -H 'Content-Type: application/json' -d'
{
  "description" : "Extract attachment information",
  "processors" : [
    {
      "attachment" : {
        "field" : "data",
        "properties": [ "content", "title" ]
      }
    }
  ]
}
'
