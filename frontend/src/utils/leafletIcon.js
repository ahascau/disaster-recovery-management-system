import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

export const openShelterIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/484/484167.png',
    iconSize: [25, 25],
    iconAnchor: [12, 25]
});

export const fullShelterIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/564/564619.png',
    iconSize: [28, 28],
    iconAnchor: [12, 25]
});

export const closedShelterIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1828/1828843.png',
    iconSize: [25, 25],
    iconAnchor: [12, 25]
});
export const shelterLegendIcons = {
    open: openShelterIcon.options.iconUrl,
    full: fullShelterIcon.options.iconUrl,
    closed: closedShelterIcon.options.iconUrl
};
export function getShelterIcon(status) {
    if (status === 'Full') return fullShelterIcon;
    if (status === 'Closed') return closedShelterIcon;
    return openShelterIcon;
}