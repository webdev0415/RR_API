CREATE PROCEDURE ExpireMarketplaceHolds 
AS 
START TRANSACTION; 
UPDATE cars
SET saleStatus = 1
WHERE saleStatus = 2 
AND saleCurrentTransactionId = ( 
SELECT  transactionId
FROM transactions
WHERE saleStartTimeStamp < NOW() - INTERVAL ( 
SELECT  settingNumber
FROM globalsettings
WHERE settingName = 'timeToCompletePayment') SECOND 
AND assetType = 'car'); UPDATE Gasstations 

SET saleStatus = 1
WHERE saleStatus = 2 
AND saleCurrentTransactionId = ( 
SELECT  transactionId
FROM transactions
WHERE saleStartTimeStamp < NOW() - INTERVAL ( 
SELECT  settingNumber
FROM globalsettings
WHERE settingName = 'timeToCompletePayment') SECOND AND assetType = 'gasstation'); 

INSERT INTO transactionlogs (timeStamp, ethAddress, assetType, assetID, action)
SELECT  Now(),
        sellerEthAddress,
        assetType,
        assetId,
        "hold time expired"
FROM transactions
WHERE saleStartTimeStamp < NOW() - INTERVAL ( 
SELECT  settingNumber
FROM globalsettings
WHERE settingName = 'timeToCompletePayment') SECOND; UPDATE transactions 

SET saleStartTimeStamp = "", sellerEthAddress=""
WHERE saleStartTimeStamp < NOW() - INTERVAL ( 
SELECT  settingNumber
FROM globalsettings
WHERE settingName = 'timeToCompletePayment') SECOND; 
COMMIT; 
GO; 