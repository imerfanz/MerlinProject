const formidable = require("formidable");
const cookie = require("cookie");
const fs = require("fs");

export const config = {
  api: {
    bodyParser: false, // Disallow Next.js's default body parser
  },
};

async function AdminSetFile(req, res) {
  try {
    const path = req.query.path;
    const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
    const token = cookies.token || null;

    if (!token) {
      return res.status(403).send("No token!");
    }

    const income = new formidable.IncomingForm();

    const { fields, files } = await new Promise((resolve, reject) => {
      income.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
        } else {
          resolve({ fields, files });
          console.log(files);
        }
      });
    });

    let form;
    let backendResponse;

    // Scenario 1: Handle single picture (named "picture")
    if (files.picture && files.picture[0]) {
      const uploadedFile = files.picture[0];
      const imageBuffer = await fs.promises.readFile(uploadedFile.filepath);
      if (!imageBuffer) {
        return res.status(500).send("Error reading the file");
      }

      form = new FormData();
      const blob = new Blob([imageBuffer], { type: "image/*" });
      form.append("picture", blob);
      Object.entries(fields).forEach(([key, value]) => {
        form.append(key, value[0]);
      });
      form.append("token", token);

      backendResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/${path}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        }
      );
    }
    // Scenario 2: Handle two pictures (named "firstPicture" and "secondPicture")
    else if (
      files.firstPicture &&
      files.firstPicture[0] &&
      files.secondPicture &&
      files.secondPicture[0]
    ) {
      // Process firstPicture
      const firstPictureFile = files.firstPicture[0];

      const firstPictureBuffer = await fs.promises.readFile(
        firstPictureFile.filepath
      );
      if (!firstPictureBuffer) {
        return res.status(500).send("Error reading the first picture");
      }

      // Process secondPicture
      const secondPictureFile = files.secondPicture[0];
      const secondPictureBuffer = await fs.promises.readFile(
        secondPictureFile.filepath
      );
      if (!secondPictureBuffer) {
        return res.status(500).send("Error reading the second picture");
      }

      // Create a new form for both pictures
      form = new FormData();
      const firstBlob = new Blob([firstPictureBuffer], { type: "image/*" });
      const secondBlob = new Blob([secondPictureBuffer], { type: "image/*" });
      form.append("firstPicture", firstBlob);
      form.append("secondPicture", secondBlob);
      Object.entries(fields).forEach(([key, value]) => {
        form.append(key, value[0]);
      });
      form.append("token", token);

      backendResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/${path}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        }
      );
    } else {
      return res
        .status(400)
        .send(
          "Invalid file upload: Either 'picture' or both 'firstPicture' and 'secondPicture' are required"
        );
    }

    // Handle the backend response
    if (!backendResponse) return res.status(500).send("API fetch failed");

    const status = await backendResponse.status;
    const response = await backendResponse.text();

    try {
      const parsed = JSON.parse(response);
      res.status(status).send(parsed);
    } catch (error) {
      res.status(status).send(response);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("API Error");
  }
}

export default AdminSetFile;
