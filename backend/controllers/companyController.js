
const Company = require("../models/Company");

// @desc    Add a new company
// @route   POST /api/companies
// @access  Admin
const addCompany = async (req, res) => {
    try {
        const {
            name,
            description,
            website,
            industry,
            location,
            logo,
            contactEmail,
            contactPhone
        } = req.body;

        if (!name || !location || !contactEmail) {
            return res.status(400).json({
                message: "Name, location and contact email are required."
            });
        }

        const company = await Company.create({
            name,
            description,
            website,
            industry,
            location,
            logo,
            contactEmail,
            contactPhone
        });

        res.status(201).json({
            message: "Company added successfully!",
            company
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// @desc    Get all companies
// @route   GET /api/companies
// @access  Admin
const getCompanies = async (req, res) => {
    try {
        const companies = await Company.find().sort({ createdAt: -1 });

        res.status(200).json({
            count: companies.length,
            companies
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// @desc    Get single company
// @route   GET /api/companies/:id
// @access  Admin
const getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);

        if (!company) {
            return res.status(404).json({
                message: "Company not found."
            });
        }

        res.status(200).json({ company });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// @desc    Update company
// @route   PUT /api/companies/:id
// @access  Admin
const updateCompany = async (req, res) => {
    try {
        const company = await Company.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!company) {
            return res.status(404).json({
                message: "Company not found."
            });
        }

        res.status(200).json({
            message: "Company updated successfully!",
            company
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// @desc    Delete company
// @route   DELETE /api/companies/:id
// @access  Admin
const deleteCompany = async (req, res) => {
    try {
        const company = await Company.findByIdAndDelete(req.params.id);

        if (!company) {
            return res.status(404).json({
                message: "Company not found."
            });
        }

        res.status(200).json({
            message: "Company deleted successfully!"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    addCompany,
    getCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany
};
