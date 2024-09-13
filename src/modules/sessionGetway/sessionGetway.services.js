import { getwaySessionModel } from "../../database/models/getwaySession.model.js";

export const createGetwaySession = async (payload = {}) => {
  // Create a new session
  const session = new getwaySessionModel(payload);
  // Save the session
  await session.save();
  // Return the session data
  return session;
};

export const findGetwaySessionById = async (sessionId, populate = []) => {
  // Get the session by its ID
  return await getwaySessionModel.findById(sessionId).populate(populate);
};

export const updateGetwaySession = async (sessionId, payload) => {
  // Update the session by its ID
  return await getwaySessionModel.findByIdAndUpdate(sessionId, payload, {
    new: true,
  });
};

export const deleteGetwaySession = async (query = {}) => {
  // Delete the session by its ID
  return await getwaySessionModel.findOneAndDelete(query);
};
