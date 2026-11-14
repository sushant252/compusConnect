
const express = require("express");
const router = express.Router();

const {
    addCompany,
    getCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany
} = require("../controllers/companyController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// All company routes require Admin authentication
router.use(protect, adminOnly);

router.post("/", addCompany);
router.get("/", getCompanies);
router.get("/:id", getCompanyById);
router.put("/:id", updateCompany);
router.delete("/:id", deleteCompany);

module.exports = router;
