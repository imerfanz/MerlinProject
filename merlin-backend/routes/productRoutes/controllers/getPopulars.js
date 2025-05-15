const Populars = require("../../../models/popularsModel");

const populars_get = async (req, res) => {
  try {
    const items = await Populars.find({});
    if (!items || items.length === 0) {
      return res.status(404).send("No items found");
    }
    res.status(200).send(items);
  } catch (error) {
    console.error("Error fetching populars:", error);
    res.status(500).send("Internal server error");
  }
};

module.exports = {
  populars_get,
};
