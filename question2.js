var data = require('./v-1-0-1.json')
var request = require('request');

// Miner Id of Choice: f01173170
var miner_id = 'f01173170'; 

// Creates filecoin green api endpoint URL: 
function createURL(id, code_name, miner, start, end, offset, limit){
    var url = (`https://api.filecoin.energy/models/export?id=${id}&code_name=${code_name}&miner=${miner}&start=${start}&end=${end}&offset=${offset}&limit=${limit}`);
    return url; 
}

// Creates a request to the Filecoin Green API to return data:
function createRequest(URL){
    let modelRequest = {
        'method': 'GET',
        'url': URL,
        'headers': {
        }
    };
    return modelRequest;
}

function getData (sealedDataURL, storedDataURL){
    
    console.log("\n✨🚀 =================================== Getting Sealed & Stored Data:  ================================= 🚀✨");
    request(sealedDataURL, function (error, response) {
        if (error) throw new Error(error);
        
        // Getting sealed data:
        var sealedData = JSON.parse(response.body).data;
        
        request(storedDataURL, function (error, response) {
            if (error) throw new Error(error);

            // Getting stored data:
            var storedData = JSON.parse(response.body).data;
            
            // Calculating electricity use: 
            calculateElectricityUse(sealedData, storedData);
        });
    });
}

function calculateElectricityUse(sealingData, storedData){
    console.log("\n✨🚀 =================================== Calculating Electricity Use:  ================================== 🚀✨");

    for(let i = 0; i < Object.keys(sealingData).length; i++){

        // Get lower, estimate, & upper values from Sealing & Stored data:
        const sealingLower = sealingData[i].sealing_energy_kW_lower; 
        const sealingEstimate = sealingData[i].sealing_energy_kW_estimate;
        const sealingUpper = sealingData[i].sealing_energy_kW_upper;
        const storedLower = storedData[i].storage_energy_kW_lower; 
        const storedEstimate = storedData[i].storage_energy_kW_estimate;
        const storedUpper = storedData[i].storage_energy_kW_upper;
    
        // Display data: 
        console.log("Miner ID: ", sealingData[i].miner, "\ntimestamp: ", storedData[i].timestamp.substring(0,10),
                    "\n** Sealing Energy in kW - Lower: ", sealingLower, " | Estimate: ", sealingEstimate, " | Upper: ", sealingUpper,
                    "\n** Storage Energy in kW - Lower: ", storedLower, " | Estimate: ", storedEstimate, " | Upper: ", storedUpper);

        // Calculating electricy use as per filecoin-energy-estimation model v1.0.1:
        const electrictityUseLower = (Number(sealingLower) + Number(storedLower)) * data.pue.min;
        const electrictityUseEstimate = (Number(sealingEstimate) + Number(storedEstimate)) * data.pue.estimate;
        const electrictityUseUpper = (Number(sealingUpper) + Number(storedUpper)) * data.pue.max;

        console.log("\nElectricity Use:\n ⚡⚡ Low = ", electrictityUseLower, "\n ⚡⚡ Estimate = ", electrictityUseEstimate, 
                    "\n ⚡⚡ Upper = ", electrictityUseUpper);
        console.log("\n----------------------------------------------------------------------------------------------------------------\n")
    }
}

// Obtain sealed & stored data for the Miner ID & calculating electricity user:
let sealedDataRequest = createRequest(createURL(1, "SealingEnergyModel_v_1_0_1", miner_id,  "2022-05-01", "2022-7-15", 0, 100));
let storedDataRequest = createRequest(createURL(2, "StorageEnergyModel_v_1_0_1", miner_id,  "2022-05-01", "2022-7-15", 0, 100));
getData(sealedDataRequest, storedDataRequest);
