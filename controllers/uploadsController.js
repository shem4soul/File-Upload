const path = require("path");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");


const uploadProductImage = async (req, res) => {
 
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
module.exports = {
  uploadProductImage,
};
