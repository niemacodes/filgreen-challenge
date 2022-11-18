# FilGreen Take Home

To run: 

```node question1.js```
``` node question2.js```

## Question 1: 
I used JSON RPC request & app.infura.io API to: 
 - Retrieve the chain height using ChainHead. 
 - Retrieve chain tip-set for previously obtained chain height using ChainGetTipSetByHeight. 
 - Retrieve parent messages for each block CID listed in the tip-set response using ChainGetParentMessages.
 
Some results here: 
<img width="733" alt="question1" src="https://user-images.githubusercontent.com/44388988/202822220-bd1bb558-93fc-4c6f-b747-bd2126d7427f.png">

## Question 2: 
Over a given period of time, used export endpoint of the Filecoin Green Energy Consumption ABI to obtain amount of sealed & stored data for the Miner Id of my choice, and based on that data calculatd electricity use as per the filecoin-energy-estimation model v1.0.1.
- Used the SealingEnergy & StoredEnergy models for my data calculations.

Some results here: 
<img width="790" alt="question2" src="https://user-images.githubusercontent.com/44388988/202822231-f54011e6-9947-4d7d-b319-30d4c8bde2db.png">
