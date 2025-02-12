import multer from "multer";

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "profilephotos/"); // Set the destination folder where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    // cb(null, uniqueSuffix + "-" + file.originalname);
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

// Create the multer upload instance
const profilephoto = multer({ storage: storage });

export default profilephoto;
