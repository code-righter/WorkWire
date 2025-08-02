// utils/resolveUsers.js

import User from '../models/user.model.js'

/**
 * Converts an array of emails or ObjectIds to valid ObjectIds
 * @param {Array<string>} identifiers - An array of user emails or ObjectIds
 * @returns {Promise<Array<ObjectId>>} Array of MongoDB ObjectIds
 */
export const resolveUserIds = async (identifiers) => {
    const ids = [];

    for (const id of identifiers) {
        // Check if already a valid ObjectId (24-char hex)
        if (/^[0-9a-fA-F]{24}$/.test(id)) {
            ids.push(id);
        } else {
            const user = await User.findOne({ email: id });
            if (user) {
                ids.push(user._id);
            } else {
                throw new Error(`User not found for identifier: ${id}`);
            }
        }
    }

    return ids;
};
