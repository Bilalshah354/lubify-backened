
const OilChange = require('../models/OilChange');

exports.addOilChange = async (oilChangeData) => {
    const oilChange = new OilChange(oilChangeData);
    await oilChange.save();
    return 'Oil change recorded';
};

exports.getVehicleOilChanges = async (carId) => {
    const oilChanges = await OilChange.find({ carId });
    if (oilChanges.length === 0) throw new Error('No oil change history found');
    return oilChanges;
};
