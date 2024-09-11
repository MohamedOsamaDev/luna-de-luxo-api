import { getwaySessionModel } from "../../database/models/getwaySession.model.js";

export const createGetwaySession = async (payload = {}) => {
  // Create a new session
  const session = new getwaySessionModel.create(payload);
  // Save the session
  await session.save();
  // Return the session data
  return session;
};

export const findGetwaySessionById = async (sessionId) => {
  // Get the session by its ID
  return await getwaySessionModel.findById(sessionId);
};

export const updateGetwaySession = async (sessionId, payload) => {
  // Update the session by its ID
  return await getwaySessionModel.findByIdAndUpdate(sessionId, payload, {
    new: true,
  });
};

export const deleteGetwaySession = async (sessionId) => {
  // Delete the session by its ID
  return await getwaySessionModel.findByIdAndDelete(sessionId);
};
