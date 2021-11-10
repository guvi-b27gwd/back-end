const router = require("express").Router();

const service = require("../services/posts.services");

router.get("/", service.find);
router.post("/", service.create);
router.put("/:id", service.update);
router.delete("/:id", service.delete);

module.exports = router;
