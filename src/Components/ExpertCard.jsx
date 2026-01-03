import { FaStar, FaRegHeart } from "react-icons/fa";

const ExpertCard = ({ expert }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col sm:flex-row gap-4 w-full">
      
      {/* Avatar */}
      <img
        src={expert.image}
        alt={expert.name}
        className="w-16 h-16 rounded-xl object-cover"
      />

      {/* Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              {expert.name}
              <span className="text-green-500 text-sm">✔</span>
            </h3>
            <p className="text-sm text-gray-500">{expert.role}</p>
          </div>

          <div className="flex items-center gap-1 text-sm font-medium">
            <span>{expert.rating}</span>
            <FaStar className="text-yellow-400" />
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {expert.description}
        </p>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
          
          {/* Price + Availability */}
          <div className="flex items-center gap-3">
            <span className="bg-blue-100 text-blue-600 text-xs font-medium px-3 py-1 rounded-full">
              Available
            </span>
            <span className="font-semibold text-gray-800">
              ${expert.price}/Hour
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition">
              CONNECT
            </button>
            <button className="border border-green-600 text-green-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition">
              VIEW PROFILE
            </button>
          </div>
        </div>
      </div>

      {/* Wishlist */}
      <button className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
        <FaRegHeart />
      </button>
    </div>
  );
};

export default ExpertCard;
