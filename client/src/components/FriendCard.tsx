/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router";


const FriendCard = ( friend : any) => {
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12">
            <img src={friend.profilePic} alt={friend.fullName} />
          </div>
          <h3 className="font-semibold truncate">{friend.fullName}</h3>
        </div>

        {/* USER LOCATION */}
        {friend.location && (
          <p className="text-sm text-base-content/70">{friend.location}</p>
        )}


        <Link to={`/chat/${friend.id}`} className="btn btn-outline w-full">
          Message
        </Link>
      </div>
    </div>
  );
};
export default FriendCard;
