import messageModel from "../models/message.js";
import dotenv from "dotenv";
import userModel from "../models/user.js";

dotenv.config();

export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, content, expoPushToken } = req.body;
    if (!senderId || !receiverId || !content) {
      return res.status(400).json({ success: false, error: "Missing fields" });
    }

    const message = new messageModel({ senderId, receiverId, content });
    await message.save();

    // Send push notification to the receiver
    if (expoPushToken && expoPushToken !== "") {
      try {
        await axios.post("https://exp.host/--/api/v2/push/send", {
          to: expoPushToken,
          title: "New Message",
          body: `Message from ${senderId}: ${content}`,
        });
      } catch (pushError) {
        console.error(
          "Push notification error:",
          pushError.response?.data || pushError.message
        );
      }
    }

    res
      .status(200)
      .json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Server error:", error); // Log the exact error
    res.status(500).json({ success: false, error: "Failed to send message." });
  }
};

export const receiveMessage = async (req, res) => {
  const { userId, otherUserId } = req.params;

  try {
    const messages = await messageModel
      .find({
        $or: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      })
      .sort({ timestamp: 1 });

    res.status(200).json({ success: true, messages });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch messages." });
  }
};

export const getUserConversations = async (req, res) => {
  const { userId } = req.params;

  try {
    // Get all messages where the user is either sender or receiver
    const messages = await messageModel.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    });

    // Extract unique conversation user IDs
    const conversationUsers = new Set();

    messages.forEach((message) => {
      if (message.senderId.toString() !== userId) {
        conversationUsers.add(message.senderId.toString());
      }
      if (message.receiverId.toString() !== userId) {
        conversationUsers.add(message.receiverId.toString());
      }
    });

    // Convert Set to Array
    const userIds = [...conversationUsers];

    // Fetch users with profile details
    const users = await userModel.find(
      { _id: { $in: userIds } },
      "username profilePicture"
    );

    // Fetch the last message for each conversation
    const conversations = await Promise.all(
      users.map(async (user) => {
        const lastMessage = await messageModel
          .findOne({
            $or: [
              { senderId: userId, receiverId: user._id },
              { senderId: user._id, receiverId: userId },
            ],
          })
          .sort({ timestamp: -1 }) // Get the latest message
          .select("content timestamp");

        const unreadMessagesCount = await messageModel.countDocuments({
          senderId: user._id,
          receiverId: userId,
          read: false, // ✅ Count only unread messages
        });

        return {
          _id: user._id,
          username: user.username,
          profilePicture: user.profilePicture,
          lastMessage: lastMessage ? lastMessage.content : "",
          lastMessageTime: lastMessage
            ? new Date(lastMessage.timestamp).toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true, // Display AM/PM
              })
            : "",
          unreadMessages: unreadMessagesCount, // ✅ Return unread messages count
        };
      })
    );

    res.status(200).json({ success: true, conversations });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch conversations." });
  }
};
