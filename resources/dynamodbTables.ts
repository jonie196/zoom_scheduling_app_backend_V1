const ProvisionedThroughput = { ReadCapacityUnits: 1, WriteCapacityUnits: 1 }

const ContactsTable = {
  Type: "AWS::DynamoDB::Table",
  Properties: {
    TableName: '${self:provider.environment.CONTACTS_TABLE}',
    AttributeDefinitions: [{
      AttributeName: "id",
      AttributeType: "N",
    }],
    KeySchema: [{
      AttributeName: "id",
      KeyType: "HASH"
    }],
    ProvisionedThroughput
  }
}

const ConversationsTable = {
  Type: "AWS::DynamoDB::Table",
  Properties: {
    TableName: '${self:provider.environment.CONVERSATIONS_TABLE}',
    AttributeDefinitions: [{
      AttributeName: "id",
      AttributeType: "N",
    }],
    KeySchema: [{
      AttributeName: "id",
      KeyType: "HASH"
    }],
    ProvisionedThroughput
  }
}

export default {
  ContactsTable,
  ConversationsTable,
}