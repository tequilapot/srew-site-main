'use strict';

/**
 * Commutes Map Module for SREW Premium Page
 * (c) 2026 S R ENGG WORKS
 */
function Commutes(configuration) {
  let commutesMap;
  let activeDestinationIndex;
  let origin = configuration.mapOptions.center;
  let destinations = configuration.destination || [];
  let markerIndex = 0;
  let lastActiveEl;

  const markerIconConfig = {
    path: 'M10 27c-.2 0-.2 0-.5-1-.3-.8-.7-2-1.6-3.5-1-1.5-2-2.7-3-3.8-2.2-2.8-3.9-5-3.9-8.8C1 4.9 5 1 10 1s9 4 9 8.9c0 3.9-1.8 6-4 8.8-1 1.2-1.9 2.4-2.8 3.8-1 1.5-1.4 2.7-1.6 3.5-.3 1-.4 1-.6 1Z',
    fillOpacity: 1,
    strokeWeight: 1,
    anchor: new google.maps.Point(15, 29),
    scale: 1.2,
    labelOrigin: new google.maps.Point(10, 9),
  };

  const MARKER_ICON_COLORS = {
    active: { fill: '#0A84FF', stroke: '#004085', label: '#FFF' },
    inactive: { fill: '#F1F3F4', stroke: '#9AA0A6', label: '#3C4043' },
  };

  const STROKE_COLORS = {
    active: { innerStroke: '#0A84FF', outerStroke: '#004085' },
    inactive: { innerStroke: '#BDC1C6', outerStroke: '#80868B' },
  };

  const originMarkerIcon = {
    ...markerIconConfig,
    fillColor: MARKER_ICON_COLORS.active.fill,
    strokeColor: MARKER_ICON_COLORS.active.stroke,
  };

  const destinationMarkerIcon = {
    ...markerIconConfig,
    fillColor: MARKER_ICON_COLORS.inactive.fill,
    strokeColor: MARKER_ICON_COLORS.inactive.stroke,
  };

  const bikeLayer = new google.maps.BicyclingLayer();
  const publicTransitLayer = new google.maps.TransitLayer();

  const commutesEl = {
    map: document.querySelector('.map-view'),
    initialStatePanel: document.querySelector('.commutes-initial-state'),
    destinationPanel: document.querySelector('.commutes-destinations'),
    modal: document.querySelector('.commutes-modal-container'),
  };

  const destinationPanelEl = {
    addButton: commutesEl.destinationPanel?.querySelector('.add-button'),
    container: commutesEl.destinationPanel?.querySelector('.destinations-container'),
    list: commutesEl.destinationPanel?.querySelector('.destination-list'),
    scrollLeftButton: commutesEl.destinationPanel?.querySelector('.left-control'),
    scrollRightButton: commutesEl.destinationPanel?.querySelector('.right-control'),
    getActiveDestination: () => commutesEl.destinationPanel?.querySelector('.destination.active'),
  };

  const destinationModalEl = {
    title: commutesEl.modal?.querySelector('h2'),
    form: commutesEl.modal?.querySelector('form'),
    destinationInput: commutesEl.modal?.querySelector('input[name="destination-address"]'),
    errorMessage: commutesEl.modal?.querySelector('.error-message'),
    addButton: commutesEl.modal?.querySelector('.add-destination-button'),
    deleteButton: commutesEl.modal?.querySelector('.delete-destination-button'),
    editButton: commutesEl.modal?.querySelector('.edit-destination-button'),
    cancelButton: commutesEl.modal?.querySelector('.cancel-button'),
    getTravelModeInput: () => commutesEl.modal?.querySelector('input[name="travel-mode"]:checked'),
  };

  initMapView();
  initCommutesPanel();
  initCommutesModal();

  function initMapView() {
    commutesMap = new google.maps.Map(commutesEl.map, configuration.mapOptions);
    createMarker(origin);
  }

  function initCommutesPanel() {
    document.querySelectorAll('.add-button').forEach(btn => {
      btn.addEventListener('click', () => {
        showModal();
        const mode = configuration.defaultTravelMode.toLowerCase() + '-mode';
        if (document.forms['destination-form'] && document.forms['destination-form'][mode]) {
          document.forms['destination-form'][mode].checked = true;
        }
      });
    });
  }

  function initCommutesModal() {
    if (!destinationModalEl.destinationInput) return;
    const autocomplete = new google.maps.places.Autocomplete(destinationModalEl.destinationInput, {
      fields: ['place_id', 'geometry', 'name'],
    });

    destinationModalEl.addButton?.addEventListener('click', () => {
      const place = autocomplete.getPlace();
      if (!place || !place.geometry) return;
      addDestinationToList(place, destinationModalEl.getTravelModeInput().value);
      hideModal();
    });

    destinationModalEl.cancelButton?.addEventListener('click', hideModal);
  }

  function addDestinationToList(place, travelMode) {
    const config = {
        name: place.name,
        place_id: place.place_id,
        travelModeEnum: travelMode,
        label: String.fromCharCode(65 + (destinations.length % 26))
    };
    
    const request = {
      origin: origin,
      destination: {'placeId': config.place_id},
      travelMode: config.travelModeEnum,
      unitSystem: google.maps.UnitSystem.METRIC,
    };

    const ds = new google.maps.DirectionsService();
    ds.route(request).then(response => {
        const path = response.routes[0].overview_path;
        const leg = response.routes[0].legs[0];
        
        const inner = new google.maps.Polyline({
            path: path,
            strokeColor: STROKE_COLORS.inactive.innerStroke,
            strokeWeight: 4,
            map: commutesMap
        });
        
        config. polylines = {inner};
        destinations.push(config);
        updatePanel();
    });
  }

  function createMarker(loc, label) {
    return new google.maps.Marker({
      position: loc,
      map: commutesMap,
      label: label || '●',
      icon: originMarkerIcon
    });
  }

  function showModal() { commutesEl.modal.style.display = 'flex'; }
  function hideModal() { commutesEl.modal.style.display = 'none'; }
  
  function updatePanel() {
      if (commutesEl.initialStatePanel) commutesEl.initialStatePanel.style.display = 'none';
      if (commutesEl.destinationPanel) commutesEl.destinationPanel.style.display = 'block';
      // Basic panel update logic simplified for MVP
  }
}

const CONFIGURATION = {
  "defaultTravelMode": "DRIVING",
  "distanceMeasurementType": "METRIC",
  "mapOptions": {
    "center": {"lat": 17.5403105, "lng": 78.4641204},
    "fullscreenControl": true,
    "mapTypeControl": false,
    "streetViewControl": false,
    "zoom": 14,
    "zoomControl": true,
    "maxZoom": 20,
    "mapId": ""
  },
  "mapsApiKey": "YOUR_API_KEY_HERE"
};

function initMap() {
  new Commutes(CONFIGURATION);
}
