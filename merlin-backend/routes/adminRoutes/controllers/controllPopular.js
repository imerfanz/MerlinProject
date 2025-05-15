const Populars = require("../../../models/popularsModel");

const populars_controll = async (req, res) => {
  try {
    const { action, id, slideNumber } = req.body;
    if (action === "add") {
      const isExisting = await Populars.findOne({ popId : id });
      if(isExisting) return res.status(401).send("item already exists");
      const newItem = new Populars({
        popId: id,
        slideNumber: slideNumber,
      });
      await newItem.save();
      res.status(200).send("Item added to populars");
    } else {
      await Populars.deleteOne({ popId: id });
      res.status(200).send("Item deleted from populars");
    }
  } catch (error) {
    console.error("Error processing populars request:", error);
    res.status(500).send("Internal server error");
  }
};

module.exports = {
  populars_controll,
};
