const cron = require('node-cron');
const  ShopLogicController  = require('../controllers/shopController');


const updateTokens  = () => {
 return cron.schedule('*/10 * * * * *', async () => {
    try {
        // Fetch all shops from MongoDB
        
        await ShopLogicController?.updateJwtTokens();
        console.log('Hourly cron job completed successfully.');
    } catch (error) {
        console.error('Error in hourly cron job:', error);
    }
});
}


const init = () => {
    updateTokens();
    console.log( `========= Success: Cron Job Initiated =========` );
};

init();