import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (req, res) => {
    try {
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({
                message: "Image is required.",
            });
        }

        const result = await cloudinary.uploader.upload(
            image,
            {
                folder: "instacard",
                resource_type: "image",
            }
        );

        return res.status(200).json({
            message: "Image uploaded successfully.",
            url: result.secure_url,
            publicId: result.public_id,
        });
    } catch (error) {
        console.error(
            "Cloudinary upload error:",
            error
        );

        return res.status(500).json({
            message: "Image upload failed.",
        });
    }
};