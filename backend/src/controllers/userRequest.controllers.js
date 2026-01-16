import AccessRequest from "../models/AccessRequest.model.js";

const submitRequest = async (req, res) => {
  try {
    const { name, email, organization, message } = req.body;

    if (!name || !email || !organization || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const request = await AccessRequest.create({
      name,
      email,
      organization,
      message,
      createdBy: req.user._id,
    });

    await request.save();

    res.status(201).json({
      message: "Request submitted successfully",
      requestId: request._id,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message || "Server error" });
  }
}

const getMyRequests = async (req, res) => {
  try {
    const requests = await AccessRequest.find({
      createdBy: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({message:"Requests fetched successfully", requests});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
}

export {submitRequest, getMyRequests};