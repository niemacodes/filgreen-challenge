let request = require('request');

// Creates a request to the Infura API to return Chain data:
function createRequest(method, params){
    let chainheadRequest = {
        url: 'https://filecoin.infura.io',
        method: 'post',
        headers: {
        'content-type': 'application/json'
        },
        auth: {
        user: '2HbD1SpXPJ0rJqQRKirjlDBUAD2',
        pass: 'a879c65fccb462c9fde3eb8164451979'
        },
        body: `{
            "jsonrpc": "2.0",
            "id": 0,
            "method": "${method}",
            "params": ${params}
        }`
    }
    return chainheadRequest;
}

request(createRequest("Filecoin.ChainHead", `[]`), function (error, response) {
    if (error) throw new Error(error);
    
    console.log("\n✨🚀 ================================ Retrieving ChainHead Height =============================== 🚀✨");
    // Get chainhead: 
    var chainhead = JSON.parse(response.body).result;

    // Get chainhead height:
    console.log("\nChainHead Height: ", chainhead.Height, "\n");

    // Get chainhead tipset by height & retrieves parent messages for all CIDs in tipset reponse:
    request(createRequest("Filecoin.ChainGetTipSetByHeight", `[${chainhead.Height}, null]`), function (error, response) {
        if (error) throw new Error(error);

        console.log("✨🚀 =========== Retrieving Parent Messages For Each Block CID in the Tip-Set Response ========== 🚀✨");

        // Getting chainTipSetByHeight:
        var chainTipSetByHeight = JSON.parse(response.body).result;
        console.log("\nChainHead CIDs: ", chainTipSetByHeight.Cids, "\n")

        // Getting all Block CID messages & parsing them for messages from the parents:
        chainTipSetByHeight.Cids.map((blockCID => {
            
            // Create another request to retrieve the parents block: 
            request(createRequest("Filecoin.ChainGetParentMessages", `[{"/": "${blockCID['/']}"}]`), function (error, response) {
                if (error) throw new Error(error);

                // Getting all parent messages:
                var blockCID_ParentMessages = JSON.parse(response.body).result;
                console.log("\nParent Messages Below For Block CID: ", blockCID['/'], "\n");

                blockCID_ParentMessages.map((blockCIDParentMessage) => { 
                    console.log(blockCIDParentMessage);
                });
            }); 
        }));
    });
  });