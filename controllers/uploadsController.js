const path = require("path");
const fs = require("fs");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");


const cloudinary = require("cloudinary").v2;

const uploadProductImageLocal = async (req, res) => {
 
  console.log(req.files);
  if (!req.files) {
    throw new CustomError.BadRequestError("No file uploaded");
  
  }

   const productImage = req.files.image;
  if (!productImage.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Please upload an image");  
  }

  const maxSize = 1024 * 1024; // 1MB
  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError(
      `Please upload an image smaller than ${maxSize / 1024} KB`
    );
  }
  const imagePath = path.join(
    __dirname,
    "../public/uploads",
    `${productImage.name}`
  );

  await productImage.mv(imagePath)
  return res
    .status(StatusCodes.OK)
    .json({ image: { src: `/uploads/${productImage.name}` } })
   
}
// const uploadProductImage = async (req, res) => {
//   const result = await cloudinary.uploader.upload(
//     req.files.image.tempFilePath,
//     {
//       use_filename: true,
//       folder: "file-upload",
//     }
//   );
//   console.log(result);
//   // res.status(200).json({ image: { src: result.secure_url } });
// };




const uploadProductImage = async (req, res) => {
  try {
    // 1) Validation
    if (!req.files?.image) {
      throw new CustomError.BadRequestError("No file uploaded");
    }
    const productImage = req.files.image;
    if (!productImage.mimetype.startsWith("image")) {
      throw new CustomError.BadRequestError("Please upload an image");
    }
    if (!productImage.tempFilePath) {
      throw new CustomError.BadRequestError("Temp file path is missing");
    }
    if (productImage.size > 1 * 1024 * 1024) {
      throw new CustomError.BadRequestError("Image must be smaller than 1MB");
    }

    // 2) Unsigned upload with folder override
    const result = await cloudinary.uploader.unsigned_upload(
      productImage.tempFilePath,
      "unsigned_images", // your preset name
      { folder: "file-upload" } // override the folder here
    );

    // 3) Cleanup temp file
    // fs.unlinkSync(productImage.tempFilePath);

    // 4) Respond
    return res.status(StatusCodes.OK).json({
      image: {
        src: result.secure_url,
        public_id: result.public_id,
      },
    });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return res
      .status(error.http_code || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: error.message });
  }
};

module.exports = {
  uploadProductImage,
};
