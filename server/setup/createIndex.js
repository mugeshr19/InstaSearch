const elasticClient = require("../config/elasticsearch");

async function createIndex() {

    const exists = await elasticClient.indices.exists({
        index: "users"
    });

    if (exists) {

        console.log("Index already exists");
        return;

    }

    await elasticClient.indices.create({

        index: "users",

        body: {

            settings: {

                analysis: {

                    tokenizer: {

                        autocomplete_tokenizer: {

                            type: "edge_ngram",
                            min_gram: 1,
                            max_gram: 20,
                            token_chars: ["letter", "digit"]

                        }

                    },

                    analyzer: {

                        autocomplete: {

                            type: "custom",
                            tokenizer: "autocomplete_tokenizer"

                        }

                    }

                }

            },

            mappings: {

                properties: {

                    username: {

                        type: "text",
                        analyzer: "autocomplete"

                    },

                    followers: {
                        type: "integer"
                    }

                }

            }

        }

    });

    console.log("Users index created");

}

createIndex();