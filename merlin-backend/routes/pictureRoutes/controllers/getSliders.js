const Picture = require("../../../models/pictureModel");

const slider_get = async (req, res) => {
  try {
    const location = req.query.location;
    console.log(location);

    if (!location) {
      return res.status(400).send("Location query parameter is missing");
    }

    const data = await Picture.find({ webLocation: location }).sort({
      slideNumber: 1,
    });

    if (!data || data.length === 0) {
      return res
        .status(404)
        .send("No pictures found for the specified location");
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching slider data:", error);
    res.status(500).send("Internal server error");
  }
};

module.exports = {
  slider_get,
};
