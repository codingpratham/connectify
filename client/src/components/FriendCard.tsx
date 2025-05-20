/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router";

const FriendCard = ({ friend }: any) => {
  return (
    <div className="card bg-[#140E0E] hover:shadow-md transition-shadow text-white">
      <div className="card-body p-4 flex flex-col items-center text-center">
        {/* USER INFO */}
        <div className="flex flex-col items-center gap-3 mb-4">
          <div className="avatar size-16">
            <img
              src={friend.profilePic || "/placeholder.jpg"}
              alt={friend.fullName}
              className="rounded-full object-cover border border-gray-700"
            />
          </div>
          <h3 className="font-semibold text-lg truncate">{friend.fullName}</h3>
        </div>

        {/* Centered Message Button */}
        <Link
          to={`/chat/${friend.id}`}
          className="px-5 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-700 transition duration-200"
        >
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;
