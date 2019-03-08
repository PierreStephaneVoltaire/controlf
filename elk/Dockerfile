
FROM sebp/elk
ENV ES_HOME /opt/elasticsearch
WORKDIR ${ES_HOME}
RUN yes | CONF_DIR=/etc/elasticsearch gosu elasticsearch bin/elasticsearch-plugin \
    install -b ingest-attachment
RUN yes | CONF_DIR=/etc/elasticsearch gosu elasticsearch bin/elasticsearch-plugin \
    install https://oss.sonatype.org/service/local/repositories/releases/content/info/johtani/elasticsearch/plugin/ingest/ingest-csv/6.5.1.0/ingest-csv-6.5.1.0.zip