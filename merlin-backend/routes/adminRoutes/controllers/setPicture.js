const Picture = require("../../../models/pictureModel");

const picture_set = async (req, res) => {
  try {
    console.log(req.file); // Log the uploaded file

    // Create an object with the necessary properties
    const myObject = {
      webLocation: req.body.webLocation,
      pictureName: req.file.filename,
      link: req.body.link,
      slideNumber: req.body.slideNumber,
    };

    // Create a new Picture instance
    const newPicture = new Picture(myObject);

    // Save the new picture to the database
    await newPicture.save();

    // Send a success response
    res.status(200).send("Picture saved successfully");
  } catch (error) {
    console.error("Error saving picture:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  picture_set,
};
