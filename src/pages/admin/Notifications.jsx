// pages/admin/Notifications.jsx
import React from "react";

const Notifications = () => {
  const notifications = [
    {
      user: "Jessica Ali",
      message: "sent you new product updates. Check new orders.",
      time: "6h ago",
      avatar: "https://i.pravatar.cc/40?img=1",
    },
    {
      user: "Oliver Too",
      message: "sent you existing product updates. Read more reports.",
      time: "6h ago",
      avatar: "https://i.pravatar.cc/40?img=2",
    },
    {
      user: "Victoria Jane",
      message: "sent you order updates. Read order information.",
      time: "6h ago",
      avatar: "https://i.pravatar.cc/40?img=3",
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Notifications
      </h2>
      <ul className="space-y-4">
        {notifications.map((note, idx) => (
          <li key={idx} className="flex items-start gap-4 border-b pb-4">
            <img
              src={note.avatar}
              alt="avatar"
              className="w-10 h-10 rounded-full"
            />
            <div className="text-sm text-gray-700">
              <span className="font-semibold">{note.user}</span> {note.message}
              <div className="text-xs text-gray-400 mt-1">{note.time}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
