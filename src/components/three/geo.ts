import * as THREE from "three";

/** Converts lat/lng (degrees) to a point on a sphere of the given radius. */
export function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

/** Biratnagar, Nepal — Dr. Parajuli's hometown. */
export const NEPAL_COORDS: [number, number] = [26.45, 87.27];

/** Geographic center of the contiguous United States. */
export const USA_COORDS: [number, number] = [39.8, -98.5];
