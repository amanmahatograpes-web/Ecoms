import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState, useMemo } from "react";

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Task Status Marker Icons
const iconBlue = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
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

const iconRed = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Driver Icons
const iconDriverActive = new L.Icon({
  iconUrl: "http://bumppy.in/packky/api/v1/uploads/images/driver_icon.png", // dark pin
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -25],
});

const iconDriverOffline = new L.Icon({
  iconUrl: "http://bumppy.in/packky/api/v1/uploads/images/driver_icon.png", // gray scooter
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -25],
});

// Marker icon by task status
const getMarkerIcon = (status) => {
  if (status === "unassigned") return iconBlue;
  if (["cancelled", "declined", "failed"].includes(status)) return iconRed;
  return iconYellow; // assigned, started, etc.
};

const getPopupClass = (status) => {
  if (status === "unassigned") return "popup-blue";
  if (["cancelled", "declined", "failed"].includes(status)) return "popup-red";
  return "popup-yellow";
};

const RealMap = ({ Task, drivers }) => {
  const [center, setCenter] = useState([28.6139, 77.209]); // Default: New Delhi
  const [hasCentered, setHasCentered] = useState(false);

  const validTasks = useMemo(() =>
    Task?.filter(task =>
      task.pickup_latitude && task.pickup_longitude &&
      !["successful", "declined"].includes(task.status)
    ) || [], [Task]);

  const validDrivers = useMemo(() =>
    drivers?.filter(driver =>
      driver.location_lat && driver.location_lng
    ) || [], [drivers]);

  useEffect(() => {
    if (!hasCentered && validTasks.length > 0) {
      setCenter([
        parseFloat(validTasks[0].pickup_latitude),
        parseFloat(validTasks[0].pickup_longitude),
      ]);
      setHasCentered(true);
    }
  }, [validTasks]);
  const createDriverIcon = (url) => {
  return new L.Icon({
    iconUrl: url,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -25],
  });
};

  return (
    <MapContainer
      center={center}
      zoom={11}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%", borderRadius: "10px" }}
    >
      <TileLayer
        attribution='© <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MarkerClusterGroup chunkedLoading>
        {validTasks.map((task) => {
          const pickupPos = [
            parseFloat(task.pickup_latitude),
            parseFloat(task.pickup_longitude),
          ];
          const dropPos = [
            parseFloat(task.dropoff_latitude),
            parseFloat(task.dropoff_longitude),
          ];

          return (
            <div key={`task-${task.pk_task_id}`}>
              <Marker position={pickupPos} icon={getMarkerIcon(task.status)}>
                <Popup className={getPopupClass(task.status)}>
                  <b>Order:</b> #{task.order_id}<br />
                  <b>Type:</b> {task.trans_type}<br />
                  <b>Status:</b> {task.status}<br />
                  <b>Pickup:</b><br />{task.pickup_address}
                </Popup>
              </Marker>

              <Marker position={dropPos} icon={iconYellow}>
                <Popup className="popup-yellow">
                  <b>Order:</b> #{task.order_id}<br />
                  <b>Type:</b> {task.trans_type}<br />
                  <b>Status:</b> {task.status}<br />
                  <b>Drop:</b><br />{task.delivery_address}
                </Popup>
              </Marker>
            </div>
          );
        })}

        {validDrivers.map((driver) => {
  const driverIcon = createDriverIcon(driver.driverIcon);

  return (
    <Marker
      key={`driver-${driver.id}`}
      position={[parseFloat(driver.location_lat), parseFloat(driver.location_lng)]}
      icon={driverIcon}
    >
      <Popup>
        <b>{driver.fullName}</b><br />
        Status: {driver.dutyStatus}<br />
        Phone: {driver.phone}<br />
        Team: {driver.teamName || "N/A"}
      </Popup>
    </Marker>
  );
})}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default RealMap;
