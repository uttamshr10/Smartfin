const router = require("express").Router();
const auth = require("../middleware/auth");
const { createAccount, getAccounts } = require("../controllers/accountController");

router.post("/", auth, createAccount);
router.get("/", auth, getAccounts);

module.exports = router;
