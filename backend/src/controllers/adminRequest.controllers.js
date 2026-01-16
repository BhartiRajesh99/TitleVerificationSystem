import AccessRequest from "../models/AccessRequest.model.js";


const getAllRequests = async (req, res) => {
  try {
    const requests = await AccessRequest.find().sort({ createdAt: -1 });
    return res.status(200).json({message:"Requests fetched successfully", requests});
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message || "Server error" });
  }
}

const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
  
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
  
    const request = await AccessRequest.findById(req.params.id);
  
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
  
    request.status = status;
    await request.save();
  
    res.json({
      message: `Request ${status}`,
      request,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message || "Server error" });
  }
}

export { getAllRequests, updateRequestStatus };