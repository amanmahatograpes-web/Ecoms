import React, { useState, useEffect, useRef } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  Clock,
  ShoppingCart,
  RefreshCw,
  BarChart3,
  PieChart,
  Download,
  Filter,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Target,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Info,
  ExternalLink,
  Star,
  Shield,
  Truck,
  MessageSquare,
  Bell,
  MapPin,
  Globe,
  CalendarDays,
  Timer,
  ShieldCheck,
  PackageCheck,
  PackageX,
  Clock4,
  Award,
  Zap,
  Navigation,
  Map as MapIcon,
  Play,
  Pause,
  Maximize2,
} from "lucide-react";

// Import Leaflet for mapping
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// =============================================
// DELIVERY PERFORMANCE DATA STRUCTURE
// =============================================

const DELIVERY_METRICS = {
  overallScore: 92.5,
  status: "excellent",
  amazonThreshold: 94.0,
  lastUpdated: "2024-01-15 14:30 EST",
  
  // Key Metrics
  onTimeDelivery: {
    value: 96.8,
    target: 97.0,
    trend: "up",
    change: 0.8,
    status: "good",
  },
  lateDelivery: {
    value: 3.2,
    target: 3.0,
    trend: "down",
    change: -0.8,
    status: "warning",
  },
  validTracking: {
    value: 99.2,
    target: 95.0,
    trend: "stable",
    change: 0.3,
    status: "excellent",
  },
  deliveryExperience: {
    value: 4.7,
    target: 4.5,
    trend: "up",
    change: 0.1,
    status: "excellent",
  },
  
  // Carrier Performance
  carriers: [
    {
      id: "ups",
      name: "UPS",
      volume: 45,
      onTimeRate: 97.2,
      costPerShipment: 8.42,
      rating: 4.8,
      issues: 12,
    },
    {
      id: "fedex",
      name: "FedEx",
      volume: 28,
      onTimeRate: 96.5,
      costPerShipment: 8.75,
      rating: 4.6,
      issues: 18,
    },
    {
      id: "usps",
      name: "USPS",
      volume: 18,
      onTimeRate: 95.8,
      costPerShipment: 6.90,
      rating: 4.3,
      issues: 24,
    },
    {
      id: "amazon",
      name: "Amazon Logistics",
      volume: 9,
      onTimeRate: 98.5,
      costPerShipment: 7.20,
      rating: 4.9,
      issues: 3,
    },
  ],
  
  // Regional Performance
  regions: [
    {
      region: "Northeast",
      onTimeRate: 97.5,
      averageTransit: 2.1,
      deliveryCost: 9.20,
      volume: 125,
    },
    {
      region: "Midwest",
      onTimeRate: 96.8,
      averageTransit: 2.8,
      deliveryCost: 10.50,
      volume: 89,
    },
    {
      region: "South",
      onTimeRate: 96.2,
      averageTransit: 3.2,
      deliveryCost: 11.80,
      volume: 142,
    },
    {
      region: "West",
      onTimeRate: 95.9,
      averageTransit: 4.1,
      deliveryCost: 12.50,
      volume: 98,
    },
  ],
  
  // Delivery Issues
  issues: [
    {
      id: "i1",
      type: "late",
      count: 18,
      change: -12,
      category: "Carrier Delay",
      priority: "medium",
    },
    {
      id: "i2",
      type: "damaged",
      count: 7,
      change: -5,
      category: "Handling Damage",
      priority: "low",
    },
    {
      id: "i3",
      type: "lost",
      count: 3,
      change: 0,
      category: "Lost in Transit",
      priority: "high",
    },
    {
      id: "i4",
      type: "incorrect",
      count: 5,
      change: -2,
      category: "Wrong Address",
      priority: "medium",
    },
  ],
  
  // Recent Deliveries with Indian locations
  recentDeliveries: [
    {
      id: "D-1001",
      orderId: "ORD-78945",
      customer: "Rohan Sharma",
      carrier: "UPS",
      status: "delivered",
      deliveryDate: "2024-01-15",
      estimatedDate: "2024-01-15",
      actualDate: "2024-01-15",
      transitDays: 2,
      trackingId: "1Z999AA1234567890",
      destination: "Mumbai, Maharashtra",
      notes: "On time",
      currentLocation: { lat: 19.0760, lng: 72.8777 },
      route: [
        { lat: 19.0760, lng: 72.8777, timestamp: "2024-01-15 10:30", status: "Delivered" },
        { lat: 19.1800, lng: 72.8500, timestamp: "2024-01-15 09:45", status: "Out for delivery" },
        { lat: 19.1200, lng: 72.8800, timestamp: "2024-01-15 08:30", status: "At local facility" },
        { lat: 18.5204, lng: 73.8567, timestamp: "2024-01-14 16:20", status: "In transit" },
        { lat: 12.9716, lng: 77.5946, timestamp: "2024-01-13 14:00", status: "Shipped" },
      ],
    },
    {
      id: "D-1002",
      orderId: "ORD-78946",
      customer: "Priya Patel",
      carrier: "FedEx",
      status: "in_transit",
      deliveryDate: "2024-01-16",
      estimatedDate: "2024-01-16",
      actualDate: null,
      transitDays: 3,
      trackingId: "123456789012",
      destination: "Delhi",
      notes: "Expected on time",
      currentLocation: { lat: 28.6139, lng: 77.2090 },
      route: [
        { lat: 28.6139, lng: 77.2090, timestamp: "2024-01-15 14:30", status: "In transit" },
        { lat: 28.5000, lng: 77.3000, timestamp: "2024-01-15 11:15", status: "In transit" },
        { lat: 26.9124, lng: 75.7873, timestamp: "2024-01-14 18:45", status: "In transit" },
        { lat: 23.0225, lng: 72.5714, timestamp: "2024-01-14 10:20", status: "In transit" },
        { lat: 12.9716, lng: 77.5946, timestamp: "2024-01-13 09:00", status: "Shipped" },
      ],
    },
    {
      id: "D-1003",
      orderId: "ORD-78947",
      customer: "Amit Kumar",
      carrier: "USPS",
      status: "late",
      deliveryDate: "2024-01-14",
      estimatedDate: "2024-01-13",
      actualDate: "2024-01-14",
      transitDays: 4,
      trackingId: "9405503699300091234567",
      destination: "Chennai, Tamil Nadu",
      notes: "1 day late - weather delay",
      currentLocation: { lat: 13.0827, lng: 80.2707 },
      route: [
        { lat: 13.0827, lng: 80.2707, timestamp: "2024-01-14 16:45", status: "Delivered" },
        { lat: 13.0500, lng: 80.2500, timestamp: "2024-01-14 14:20", status: "Out for delivery" },
        { lat: 13.1200, lng: 80.2900, timestamp: "2024-01-14 10:15", status: "At local facility" },
        { lat: 15.2993, lng: 74.1240, timestamp: "2024-01-13 22:30", status: "In transit" },
        { lat: 18.5204, lng: 73.8567, timestamp: "2024-01-12 18:45", status: "In transit" },
      ],
    },
    {
      id: "D-1004",
      orderId: "ORD-78948",
      customer: "Sneha Gupta",
      carrier: "Amazon Logistics",
      status: "delivered",
      deliveryDate: "2024-01-15",
      estimatedDate: "2024-01-15",
      actualDate: "2024-01-15",
      transitDays: 1,
      trackingId: "TBA123456789000",
      destination: "Bangalore, Karnataka",
      notes: "Early delivery",
      currentLocation: { lat: 12.9716, lng: 77.5946 },
      route: [
        { lat: 12.9716, lng: 77.5946, timestamp: "2024-01-15 11:20", status: "Delivered" },
        { lat: 12.9500, lng: 77.6000, timestamp: "2024-01-15 10:45", status: "Out for delivery" },
        { lat: 12.9900, lng: 77.5800, timestamp: "2024-01-15 08:30", status: "At sorting facility" },
        { lat: 12.9300, lng: 77.6200, timestamp: "2024-01-14 22:15", status: "Processing" },
      ],
    },
    {
      id: "D-1005",
      orderId: "ORD-78949",
      customer: "Vikram Singh",
      carrier: "UPS",
      status: "delayed",
      deliveryDate: "2024-01-17",
      estimatedDate: "2024-01-16",
      actualDate: null,
      transitDays: 3,
      trackingId: "1Z999AA1234567891",
      destination: "Kolkata, West Bengal",
      notes: "Carrier delay - check tracking",
      currentLocation: { lat: 22.5726, lng: 88.3639 },
      route: [
        { lat: 22.5726, lng: 88.3639, timestamp: "2024-01-15 16:30", status: "At destination hub" },
        { lat: 22.6000, lng: 88.4000, timestamp: "2024-01-15 14:15", status: "In transit" },
        { lat: 21.1458, lng: 79.0882, timestamp: "2024-01-14 20:45", status: "In transit" },
        { lat: 19.0760, lng: 72.8777, timestamp: "2024-01-13 23:30", status: "Shipped" },
      ],
    },
  ],
  
  // Performance Trends
  trends: [
    { date: "Jan 9", onTime: 95.2, late: 4.8 },
    { date: "Jan 10", onTime: 96.1, late: 3.9 },
    { date: "Jan 11", onTime: 96.5, late: 3.5 },
    { date: "Jan 12", onTime: 95.8, late: 4.2 },
    { date: "Jan 13", onTime: 96.3, late: 3.7 },
    { date: "Jan 14", onTime: 96.8, late: 3.2 },
    { date: "Jan 15", onTime: 97.0, late: 3.0 },
  ],
};

// =============================================
// MAP TRACKING COMPONENT
// =============================================

const LiveTrackingMap = ({ delivery, isLive = false, onLocationUpdate }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const routeLayer = useRef(null);
  const markerLayer = useRef(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [simulatedLocation, setSimulatedLocation] = useState(null);

  // Initialize map
  useEffect(() => {
    if (!delivery?.route?.length || !mapRef.current) return;

    // Initialize map
    mapInstance.current = L.map(mapRef.current).setView([20.5937, 78.9629], 5);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(mapInstance.current);

    // Draw route
    const routePoints = delivery.route.map(point => [point.lat, point.lng]);
    routeLayer.current = L.polyline(routePoints, {
      color: '#3b82f6',
      weight: 3,
      opacity: 0.7,
      dashArray: '10, 10',
    }).addTo(mapInstance.current);

    // Add markers for each point
    markerLayer.current = L.layerGroup().addTo(mapInstance.current);
    
    delivery.route.forEach((point, index) => {
      const isCurrent = index === currentStep;
      const icon = L.divIcon({
        html: `
          <div class="relative">
            <div class="w-6 h-6 rounded-full ${isCurrent ? 'bg-blue-600' : 'bg-gray-400'} border-2 border-white shadow-lg flex items-center justify-center">
              <span class="text-white text-xs font-bold">${index + 1}</span>
            </div>
            ${isCurrent ? '<div class="w-3 h-3 bg-blue-600 rounded-full animate-ping absolute top-0 left-0"></div>' : ''}
          </div>
        `,
        className: 'custom-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([point.lat, point.lng], { icon })
        .addTo(markerLayer.current)
        .bindPopup(`
          <div class="p-2">
            <div class="font-semibold">${point.status}</div>
            <div class="text-sm">${new Date(point.timestamp).toLocaleString()}</div>
            <div class="text-xs text-gray-500">${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}</div>
          </div>
        `);
    });

    // Fit bounds to show entire route
    mapInstance.current.fitBounds(routeLayer.current.getBounds());

    // Cleanup
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, [delivery, currentStep]);

  // Simulate live updates
  useEffect(() => {
    if (!isLive || !isPlaying || !delivery?.route) return;

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        const next = prev < delivery.route.length - 1 ? prev + 1 : 0;
        
        // Update simulated location for real-time effect
        if (next > 0 && next < delivery.route.length) {
          const currentPoint = delivery.route[next];
          const prevPoint = delivery.route[next - 1];
          
          // Interpolate between points for smooth movement
          const progress = 0.5; // Halfway between points
          const lat = prevPoint.lat + (currentPoint.lat - prevPoint.lat) * progress;
          const lng = prevPoint.lng + (currentPoint.lng - prevPoint.lng) * progress;
          
          setSimulatedLocation({ lat, lng, status: "Moving..." });
          
          if (onLocationUpdate) {
            onLocationUpdate({ lat, lng });
          }
        }
        
        return next;
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [isLive, isPlaying, delivery, onLocationUpdate]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStepChange = (step) => {
    setCurrentStep(step);
    setIsPlaying(false);
  };

  if (!delivery?.route) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <MapIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No tracking data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Map Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <div>
          <h3 className="font-semibold text-gray-900">Live Tracking: {delivery.orderId}</h3>
          <p className="text-sm text-gray-500">Destination: {delivery.destination}</p>
        </div>
        <div className="flex items-center gap-2">
          {isLive && (
            <button
              onClick={handlePlayPause}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                isPlaying ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pause' : 'Play Live'}
            </button>
          )}
          <button
            onClick={() => {
              if (mapInstance.current) {
                mapInstance.current.setView([20.5937, 78.9629], 5);
              }
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg"
          >
            <Navigation className="w-4 h-4" />
            Reset View
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="h-full w-full rounded-b-lg" />
        
        {/* Real-time location indicator */}
        {simulatedLocation && isPlaying && (
          <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg border">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Live Location</span>
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {simulatedLocation.lat.toFixed(4)}, {simulatedLocation.lng.toFixed(4)}
            </div>
          </div>
        )}
      </div>

      {/* Timeline Controls */}
      <div className="p-4 bg-white border-t">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Route Timeline</span>
            <span className="text-xs text-gray-500">
              Step {currentStep + 1} of {delivery.route.length}
            </span>
          </div>
          
          <div className="flex overflow-x-auto pb-2 space-x-2">
            {delivery.route.map((point, index) => (
              <button
                key={index}
                onClick={() => handleStepChange(index)}
                className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm ${
                  index === currentStep
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="font-medium">{point.status}</div>
                <div className="text-xs">{new Date(point.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </button>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Origin: {delivery.route[delivery.route.length - 1]?.status}</span>
            <span>Destination: {delivery.route[0]?.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================
// MULTI-DELIVERY MAP DASHBOARD
// =============================================

const DeliveryMapDashboard = ({ deliveries }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showAllRoutes, setShowAllRoutes] = useState(true);

  useEffect(() => {
    if (!mapRef.current || deliveries.length === 0) return;

    // Initialize map centered on India
    mapInstance.current = L.map(mapRef.current).setView([20.5937, 78.9629], 5);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(mapInstance.current);

    // Add markers for all deliveries
    deliveries.forEach((delivery, index) => {
      if (!delivery.currentLocation) return;

      const isSelected = selectedDelivery?.id === delivery.id;
      
      // Custom marker icon
      const icon = L.divIcon({
        html: `
          <div class="relative">
            <div class="w-8 h-8 rounded-full ${getStatusColor(delivery.status)} border-2 border-white shadow-lg flex items-center justify-center">
              <Truck className="w-4 h-4 text-white" />
            </div>
            ${isSelected ? '<div class="w-4 h-4 bg-blue-600 rounded-full animate-ping absolute top-0 left-0"></div>' : ''}
          </div>
        `,
        className: 'custom-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([delivery.currentLocation.lat, delivery.currentLocation.lng], { icon })
        .addTo(mapInstance.current)
        .bindPopup(`
          <div class="p-2 min-w-[200px]">
            <div class="font-bold text-sm">${delivery.orderId}</div>
            <div class="text-xs text-gray-600">${delivery.customer}</div>
            <div class="mt-2">
              <span class="inline-block px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(delivery.status)}">
                ${delivery.status}
              </span>
            </div>
            <div class="mt-2 text-xs">
              <div>Carrier: ${delivery.carrier}</div>
              <div>Destination: ${delivery.destination}</div>
              <div class="mt-2">
                <button onclick="window.dispatchEvent(new CustomEvent('selectDelivery', { detail: '${delivery.id}' }))" 
                  class="w-full mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600">
                  Track This Delivery
                </button>
              </div>
            </div>
          </div>
        `);

      marker.on('click', () => {
        setSelectedDelivery(delivery);
      });

      // Draw route if showAllRoutes is true and delivery has route
      if (showAllRoutes && delivery.route) {
        const routePoints = delivery.route.map(point => [point.lat, point.lng]);
        L.polyline(routePoints, {
          color: getRouteColor(delivery.status),
          weight: 2,
          opacity: 0.5,
          dashArray: '5, 5',
        }).addTo(mapInstance.current);
      }
    });

    // Cleanup
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, [deliveries, showAllRoutes, selectedDelivery]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-500';
      case 'in_transit': return 'bg-blue-500';
      case 'late': return 'bg-yellow-500';
      case 'delayed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRouteColor = (status) => {
    switch (status) {
      case 'delivered': return '#10b981';
      case 'in_transit': return '#3b82f6';
      case 'late': return '#f59e0b';
      case 'delayed': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const handleDeliverySelect = (delivery) => {
    setSelectedDelivery(delivery);
    if (mapInstance.current && delivery.currentLocation) {
      mapInstance.current.setView([delivery.currentLocation.lat, delivery.currentLocation.lng], 10);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Live Delivery Map</h3>
            <p className="text-sm text-gray-500">Real-time tracking across India</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showRoutes"
                checked={showAllRoutes}
                onChange={(e) => setShowAllRoutes(e.target.checked)}
                className="rounded text-blue-600"
              />
              <label htmlFor="showRoutes" className="text-sm text-gray-700">
                Show all routes
              </label>
            </div>
            <div className="text-sm text-gray-500">
              {deliveries.length} active deliveries
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-[600px]">
        {/* Map Section */}
        <div className="flex-1 relative">
          <div ref={mapRef} className="h-full w-full" />
          
          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg border">
            <div className="text-sm font-medium mb-2">Delivery Status</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Delivered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>In Transit</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Late</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Delayed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery List Section */}
        <div className="lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-200 overflow-auto">
          <div className="p-4">
            <h4 className="font-medium text-gray-900 mb-3">Active Deliveries</h4>
            <div className="space-y-3">
              {deliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedDelivery?.id === delivery.id
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleDeliverySelect(delivery)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{delivery.orderId}</div>
                      <div className="text-xs text-gray-500">{delivery.customer}</div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(delivery.status)}`}>
                      {delivery.status}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Truck className="w-3 h-3" />
                      {delivery.carrier}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {delivery.destination}
                    </div>
                  </div>
                  <button className="w-full mt-3 px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                    Track Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Delivery Details */}
      {selectedDelivery && (
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Tracking Details: {selectedDelivery.orderId}</h4>
            <button
              onClick={() => setSelectedDelivery(null)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear Selection
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Current Location</div>
              <div className="font-medium">
                {selectedDelivery.currentLocation.lat.toFixed(4)}, {selectedDelivery.currentLocation.lng.toFixed(4)}
              </div>
            </div>
            <div>
              <div className="text-gray-500">Last Update</div>
              <div className="font-medium">
                {new Date(selectedDelivery.route[0]?.timestamp).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-gray-500">Estimated Delivery</div>
              <div className="font-medium">
                {new Date(selectedDelivery.estimatedDate).toLocaleDateString()}
              </div>
            </div>
            <div>
              <div className="text-gray-500">Tracking ID</div>
              <div className="font-medium">{selectedDelivery.trackingId}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =============================================
// DELIVERY TRACKING TABLE WITH MAP
// =============================================

const DeliveryTrackingTableWithMap = ({ deliveries, onTrack, showMap = false, selectedDeliveryId }) => {
  const [expandedDelivery, setExpandedDelivery] = useState(null);

  const getStatusBadge = (status) => {
    const statusConfig = {
      delivered: {
        color: "bg-green-50 text-green-700 border-green-200",
        icon: <PackageCheck className="w-3 h-3" />,
        label: "Delivered",
      },
      in_transit: {
        color: "bg-blue-50 text-blue-700 border-blue-200",
        icon: <Truck className="w-3 h-3" />,
        label: "In Transit",
      },
      late: {
        color: "bg-yellow-50 text-yellow-700 border-yellow-200",
        icon: <Clock4 className="w-3 h-3" />,
        label: "Late",
      },
      delayed: {
        color: "bg-red-50 text-red-700 border-red-200",
        icon: <AlertCircle className="w-3 h-3" />,
        label: "Delayed",
      },
      pending: {
        color: "bg-gray-50 text-gray-700 border-gray-200",
        icon: <Clock className="w-3 h-3" />,
        label: "Pending",
      },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${config.color}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Deliveries</h3>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800">
              <MapIcon className="w-4 h-4" />
              View Map
            </button>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
              View All →
            </button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left py-3 px-4 sm:px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Order ID
              </th>
              <th className="text-left py-3 px-4 sm:px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Customer
              </th>
              <th className="text-left py-3 px-4 sm:px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Carrier
              </th>
              <th className="text-left py-3 px-4 sm:px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left py-3 px-4 sm:px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Current Location
              </th>
              <th className="text-left py-3 px-4 sm:px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((delivery) => (
              <React.Fragment key={delivery.id}>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 sm:px-6">
                    <div className="font-medium text-gray-900 text-sm">{delivery.orderId}</div>
                    <div className="text-xs text-gray-500 mt-1">{delivery.trackingId}</div>
                  </td>
                  <td className="py-3 px-4 sm:px-6">
                    <div className="text-sm text-gray-900">{delivery.customer}</div>
                    <div className="text-xs text-gray-500">{delivery.destination}</div>
                  </td>
                  <td className="py-3 px-4 sm:px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                        <Truck className="w-3 h-3 text-blue-600" />
                      </div>
                      <span className="text-sm text-gray-900">{delivery.carrier}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 sm:px-6">
                    {getStatusBadge(delivery.status)}
                    {delivery.notes && (
                      <div className="text-xs text-gray-500 mt-1 truncate max-w-[150px]">
                        {delivery.notes}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 sm:px-6">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">
                        {delivery.currentLocation ? 
                          `${delivery.currentLocation.lat.toFixed(2)}, ${delivery.currentLocation.lng.toFixed(2)}` : 
                          "N/A"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {delivery.route?.[0]?.status || "Location unknown"}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 sm:px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onTrack && onTrack(delivery)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Track
                      </button>
                      <button
                        onClick={() => setExpandedDelivery(expandedDelivery === delivery.id ? null : delivery.id)}
                        className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                      >
                        <ChevronRight className={`w-4 h-4 transition-transform ${expandedDelivery === delivery.id ? 'rotate-90' : ''}`} />
                      </button>
                    </div>
                  </td>
                </tr>
                
                {/* Expanded Row with Map */}
                {expandedDelivery === delivery.id && delivery.route && (
                  <tr>
                    <td colSpan="6" className="p-0">
                      <div className="px-4 pb-4">
                        <div className="border rounded-lg overflow-hidden">
                          <div className="h-64">
                            <LiveTrackingMap
                              delivery={delivery}
                              isLive={delivery.status === "in_transit"}
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// =============================================
// MAIN DELIVERY PERFORMANCE COMPONENT
// =============================================

const DeliveryPerformance = () => {
  const [activeView, setActiveView] = useState("overview");
  const deliveryData = DELIVERY_METRICS;
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [timeRange, setTimeRange] = useState("7d");

  const handleTrackDelivery = (delivery) => {
    setSelectedDelivery(delivery);
    setActiveView("tracking");
  };

  // Render metric cards
  const renderMetricCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <PackageCheck className="w-6 h-6 text-blue-600" />
          </div>
          <span className={`px-2 py-1 text-xs rounded-full ${deliveryData.onTimeDelivery.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {deliveryData.onTimeDelivery.trend === 'up' ? <TrendingUp className="w-3 h-3 inline mr-1" /> : <TrendingDown className="w-3 h-3 inline mr-1" />}
            {deliveryData.onTimeDelivery.change}%
          </span>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">{deliveryData.onTimeDelivery.value}%</div>
          <div className="text-sm text-gray-500">On-Time Delivery</div>
          <div className="mt-2 text-xs text-gray-400">Target: {deliveryData.onTimeDelivery.target}%</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-yellow-50 rounded-lg">
            <Clock4 className="w-6 h-6 text-yellow-600" />
          </div>
          <span className={`px-2 py-1 text-xs rounded-full ${deliveryData.lateDelivery.trend === 'down' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {deliveryData.lateDelivery.trend === 'down' ? <TrendingDown className="w-3 h-3 inline mr-1" /> : <TrendingUp className="w-3 h-3 inline mr-1" />}
            {deliveryData.lateDelivery.change}%
          </span>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">{deliveryData.lateDelivery.value}%</div>
          <div className="text-sm text-gray-500">Late Delivery Rate</div>
          <div className="mt-2 text-xs text-gray-400">Target: {deliveryData.lateDelivery.target}%</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-green-50 rounded-lg">
            <ShieldCheck className="w-6 h-6 text-green-600" />
          </div>
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
            <TrendingUp className="w-3 h-3 inline mr-1" />
            {deliveryData.validTracking.change}%
          </span>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">{deliveryData.validTracking.value}%</div>
          <div className="text-sm text-gray-500">Valid Tracking</div>
          <div className="mt-2 text-xs text-gray-400">Target: {deliveryData.validTracking.target}%</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Star className="w-6 h-6 text-purple-600" />
          </div>
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
            <TrendingUp className="w-3 h-3 inline mr-1" />
            {deliveryData.deliveryExperience.change}
          </span>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">{deliveryData.deliveryExperience.value}/5</div>
          <div className="text-sm text-gray-500">Delivery Experience</div>
          <div className="mt-2 text-xs text-gray-400">Target: {deliveryData.deliveryExperience.target}/5</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Delivery Performance</h1>
          <p className="text-gray-500">Monitor and optimize your delivery operations across India</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500">
            Last updated: {deliveryData.lastUpdated}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {["overview", "carriers", "tracking", "map", "issues", "analytics"].map((view) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-colors ${
              activeView === view
                ? "bg-white text-blue-600 border-t border-x border-gray-200"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview View */}
      {activeView === "overview" && (
        <div className="space-y-6">
          {renderMetricCards()}
          
          {/* Overall Score */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Overall Performance Score</h3>
                <p className="text-sm text-gray-500">Compared to Amazon's threshold of {deliveryData.amazonThreshold}%</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-3xl font-bold text-gray-900">{deliveryData.overallScore}%</div>
                <div className={`px-3 py-1 rounded-full text-sm ${deliveryData.status === 'excellent' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {deliveryData.status}
                </div>
              </div>
            </div>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    Your Performance
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {deliveryData.overallScore}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
                <div
                  style={{ width: `${deliveryData.overallScore}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                ></div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>0%</span>
                <span>Amazon Threshold: {deliveryData.amazonThreshold}%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Recent Deliveries Table */}
          <DeliveryTrackingTableWithMap
            deliveries={deliveryData.recentDeliveries}
            onTrack={handleTrackDelivery}
          />
        </div>
      )}

      {/* Map View */}
      {activeView === "map" && deliveryData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <DeliveryMapDashboard
                deliveries={deliveryData.recentDeliveries}
              />
            </div>
            
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Tracking Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">Active Deliveries</div>
                    <div className="text-lg font-bold text-blue-600">
                      {deliveryData.recentDeliveries.filter(d => d.status === "in_transit").length}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">In Transit</div>
                    <div className="text-lg font-bold text-green-600">
                      {deliveryData.recentDeliveries.filter(d => d.status === "in_transit").length}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">At Risk</div>
                    <div className="text-lg font-bold text-yellow-600">
                      {deliveryData.recentDeliveries.filter(d => ["late", "delayed"].includes(d.status)).length}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">Delivered Today</div>
                    <div className="text-lg font-bold text-purple-600">
                      {deliveryData.recentDeliveries.filter(d => d.status === "delivered").length}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tracking Tools</h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Download className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">Export Tracking Data</div>
                        <div className="text-xs text-gray-500">CSV, Excel, or GPX formats</div>
                      </div>
                    </div>
                  </button>
                  <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Zap className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">Real-time API</div>
                        <div className="text-xs text-gray-500">Webhook notifications</div>
                      </div>
                    </div>
                  </button>
                  <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Bell className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">Geofence Alerts</div>
                        <div className="text-xs text-gray-500">Custom location alerts</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Indian Cities Coverage */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Coverage Across India</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad"].map((city) => (
                <div key={city} className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{city}</div>
                      <div className="text-xs text-gray-500">24-48h delivery</div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tracking View */}
      {activeView === "tracking" && selectedDelivery && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Tracking: {selectedDelivery.orderId}</h3>
                <p className="text-sm text-gray-500">Customer: {selectedDelivery.customer} | Destination: {selectedDelivery.destination}</p>
              </div>
              <button
                onClick={() => setSelectedDelivery(null)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Back to all deliveries
              </button>
            </div>
            <div className="h-[500px]">
              <LiveTrackingMap
                delivery={selectedDelivery}
                isLive={selectedDelivery.status === "in_transit"}
              />
            </div>
          </div>
        </div>
      )}

      {/* Add other views (carriers, issues, analytics) as needed... */}
    </div>
  );
};

export default DeliveryPerformance;