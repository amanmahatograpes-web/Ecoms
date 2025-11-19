import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const RealMap = ({ Task, drivers }) => {
  const [center, setCenter] = useState([28.6139, 77.209]); // default: New Delhi
  const iconBlue = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const iconRed = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const iconGreen = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const iconYellow = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
const iconDriver = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/194/194935.png", // Change to your custom driver icon
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -30],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});
const iconPickup = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png", // cart with box
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -30],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});


  useEffect(() => {
    // if first task has valid coords, center map there
    if (Task?.length > 0 && Task[0].pickup_latitude && Task[0].pickup_longitude) {
      setCenter([
        parseFloat(Task[0].pickup_latitude),
        parseFloat(Task[0].pickup_longitude),
      ]);
    }
  }, [Task]);
  const getPopupClass = (status) => {
    switch (status) {
      case "unassigned":
        return "popup-blue";
      case "declined":
      case "cancelled":
        return "popup-red";
      case "successful":
        return "popup-green";
      default:
        return "popup-yellow";
    }
  };
  const getMarkerIcon = (status) => {
    switch (status) {
      case "unassigned":
        return iconBlue;
      case "declined":
      case "cancelled":
        return iconRed;
      case "successful":
        return iconGreen;
      default:
        return iconYellow;
    }
  };



  return (
    <MapContainer
      center={center}
      zoom={10}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%", borderRadius: "10px" }}
    >
      <TileLayer
        attribution='© <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Plot pickup & drop markers for each task */}
      {Task?.filter((task) => !["successful", "declined"].includes(task.status)).map((task) => {
        const pickupPos = [
          parseFloat(task.pickup_latitude),
          parseFloat(task.pickup_longitude),
        ];
        const dropPos = [
          parseFloat(task.dropoff_latitude),
          parseFloat(task.dropoff_longitude),
        ];

        return (
          <>
           <Marker
  key={`${task.pk_task_id}-pickup`}
  position={pickupPos}
  icon={iconPickup} // 👈 use the custom pickup icon
>
  <Popup className={getPopupClass(task.status)}>
    <b>Order:</b> #{task.order_id}<br />
    <b>Type:</b> {task.trans_type}<br />
    <b>Status:</b> {task.status}<br />
    <b>Pickup:</b><br />{task.pickup_address}
  </Popup>
</Marker>

<Marker
  key={`${task.pk_task_id}-drop`}
  position={dropPos}
  icon={getMarkerIcon(task.status)} // keep as-is or use different logic
>
  <Popup className={getPopupClass(task.status)}>
    <b>Order:</b> #{task.order_id}<br />
    <b>Type:</b> {task.trans_type}<br />
    <b>Status:</b> {task.status}<br />
    <b>Drop:</b><br />{task.delivery_address}
  </Popup>
</Marker>

          </>
        );
      })}
   {drivers?.filter(d =>
  d.location_lat && d.location_lng
).map((driver) => (
  <Marker
    key={`driver-${driver.id}`}
    position={[parseFloat(driver.location_lat), parseFloat(driver.location_lng)]}
    icon={iconDriver}
  >
    <Popup>
      <b>{driver.fullName}</b><br />
      Status: {driver.dutyStatus}<br />
      Phone: {driver.phone}<br />
      Team: {driver.teamName || "N/A"}
    </Popup>
  </Marker>
))}
    </MapContainer>
  );
};

export default RealMap;
