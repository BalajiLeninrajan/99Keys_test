export function FloorPlan(image, name, intSize, extSize, direction, floorType) {
    this.image = image;
    this.name = name;
    this.intSize = intSize;
    this.extSize = extSize;
    this.direction = direction;
    this.floorType = floorType;
}

export const Directions = {
    north: "North",
    south: "South",
    east: "East",
    west: "West",
};

export const FloorTypes = {
    studio: "Studio",
    b1b1: "One Bed One Bath",
    b2b1: "Two Bed One Bath",
    b3b2: "Three Bed 2 Bath",
};
