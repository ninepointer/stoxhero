const City = require("../models/City/city");

exports.createCity = async (req, res) => {
    // Destructure variables from req.body
    const {
        name,
        tier,
        state,
        status, // This will use the default value if not provided
    } = req.body;

    try {
        // Create a new city document with destructured variables
        const countCity = await City.countDocuments()
        const city = new City({
            name,
            tier,
            state,
            status,
            createdBy:req.user._id,
            lastModifiedBy:req.user._id,
            code: countCity+1
        });

        await city.save();
        res.status(201).json({ message: 'City created successfully', status: 'success', data: city });
    } catch (error) {
        res.status(400).json({ message: error.message, status: 'error' });
    }
};
exports.editCity = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    console.log(updates, req.body, req.params);
    try {
        const city = await City.findByIdAndUpdate(id, updates, { new: true });
        console.log(city);
        if (!city) {
            return res.status(404).json({ message: 'City not found', status: 'error' });
        }
        res.status(200).json({ message: 'City updated successfully', status: 'success', data: city });
    } catch (error) {
        res.status(400).json({ message: error.message, status: 'error' });
    }
};

// Get all cities
exports.getAllCities = async (req, res) => {
    try {
        const cities = await City.find({});
        res.status(200).json({ message: 'Cities retrieved successfully', status: 'success', data: cities });
    } catch (error) {
        res.status(500).json({ message: error.message, status: 'error' });
    }
};

// Get active cities
exports.getActiveCities = async (req, res) => {
    try {
        const activeCities = await City.find({ status: "Active"});

        res.status(200).json({ message: 'Active cities retrieved successfully', status: 'success', data: activeCities });
    } catch (error) {
        res.status(500).json({ message: error.message, status: 'error' });
    }
};

exports.getCitiesBySearch = async (req, res) => {
    try {
        // const activeCities = await City.find({ });
        const {search} = req.query;
        const data = await City.find({
            $and: [
                {
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { state: { $regex: search, $options: 'i' } },
                    ]
                }
            ]
        })
        res.status(200).json({ message: 'Active cities retrieved successfully', status: 'success', data: data });
    } catch (error) {
        res.status(500).json({ message: error.message, status: 'error' });
    }
};

// Get an individual city by ID
exports.getCityById = async (req, res) => {
    const { id } = req.params;
    try {
        const city = await City.findById(id);
        if (!city) {
            return res.status(404).json({ message: 'City not found', status: 'error' });
        }
        res.status(200).json({ message: 'City retrieved successfully', status: 'success', data: city });
    } catch (error) {
        res.status(500).json({ message: error.message, status: 'error' });
    }
};

exports.getCityByState = async (req, res) => {
    const { state } = req.params;
    console.log(state);
    try {
        const city = await City.find({ state: { $regex: new RegExp(state, 'i') } }).sort({ name: 1 });

        if (!city) {
            return res.status(404).json({ message: 'City not found', status: 'error' });
        }
        res.status(200).json({ message: 'City retrieved successfully', status: 'success', data: city });
    } catch (error) {
        res.status(500).json({ message: error.message, status: 'error' });
    }
};
