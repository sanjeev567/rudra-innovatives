const User = require("../model/User");
const { verifyAndAuthorize } = require("./verifyToken");

const router = require("express").Router();

// update
router.put("/:id", verifyAndAuthorize, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json("Internal server error: " + err);
  }
});

// delete
router.delete("/:id", verifyAndAuthorize, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("user has been deleted...");
  } catch (err) {
    res.status(500).json("Internal server error: " + err);
  }
});
module.exports = router;
