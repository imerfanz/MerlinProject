const Picture = require("../../../models/pictureModel");
const fs = require("fs");
const path = require("path");

const picture_delete = async (req, res) => {
  try {
    const { id } = req.body;
    const pic = await Picture.findById(id);
    if (!pic) return res.status(404).send("picture not found");
    const name = pic.pictureName;
    const imagePath = path.join(__dirname, "../../../images/sliders", name);

    await fs.unlink(imagePath, async (err) => {
      if (err) {
        console.error(`Error deleting file: ${err}`);
        return res.status(500).send("Error deleting image file");
      }

      await Picture.findByIdAndDelete(id);
      res.status(200).send("File deleted successfully");
    });
  } catch (error) {
    console.error("Error deleting picture:", error);
    res.status(500).send("Internal server error");
  }
};

module.exports = {
  picture_delete,
};
