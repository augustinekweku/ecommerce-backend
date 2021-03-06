const { response } = require("express");
const User = require("../models/User");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();

//UPDATE
router.put("/:id",verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }
  try {
      const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          {
              $set: req.body,
            },
            { new: true }
            );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("User has been deleted");
        } catch (error) {
            res.status(500).json(err);
        }
})

//GET A USER
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            const { password, ...others } = user._doc;
            res.status(200).json({...others});
        } catch (error) {
            res.status(500).json(error);
        }
})

//GET ALL USERS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
        const query = req.query.new;
        try {
            const users = query
                ? await User.find().sort({ _id: -1 }).limit(5)
                : await User.find();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json(error);
        }
})

//GET USER STATS
router.get("/stats", verifyTokenAndAdmin, async (req, res)=>{
    const date = new Date()
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
        const data = await User.aggregate([
            //match is used to match a condition 
            //in this case we are matching dates that are greater than last year
            { $match : { createdAt: { $gte: lastYear}}},
            {  $project : { 
            //the month number is selected using $month and assigned to the variable month
                month: { $month : "$createdAt" },
            }
            },
            {
                //after project we group the users by the month and sum them up 
                $group: {
                _id : "$month",
                total: { $sum: 1},
            }}
        ]);
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error)
    }
})



module.exports = router;