export const MOTOR_ADDON = 120;
export const DEFAULT_WIDTH = "36";
export const DEFAULT_HEIGHT = "72";
const BASE_AREA = 36 * 72;

export function calculateUnitPrice(
  basePrice: number,
  width: string,
  height: string,
  motor: string
): number {
  const w = parseFloat(width) || 36;
  const h = parseFloat(height) || 72;
  const areaMultiplier = Math.max((w * h) / BASE_AREA, 0.5);
  const motorAddon = motor === "Manual Chain" ? 0 : MOTOR_ADDON;
  return Math.round(basePrice * areaMultiplier + motorAddon);
}

export const HARDWARE_OPTIONS = [
  { id: "white", label: "White", price: 0 },
  { id: "black", label: "Black", price: 0 },
  { id: "champagne", label: "Champagne", price: 15 },
] as const;

const SQ_INCHES_PER_SQUARE_METER = 1550.0031;
const EXTRA_SQUARE_METER_RATE = 45;

export function parseDimensionInches(value: string): number {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function findHardware(hardware?: string) {
  if (!hardware) return undefined;
  return HARDWARE_OPTIONS.find((option) => option.id === hardware);
}

export function hardwareLabel(hardware?: string): string | undefined {
  return findHardware(hardware)?.label;
}

export function calculateConfiguredUnitPrice(params: {
  basePrice: number;
  widthInches: number;
  heightInches: number;
  hardware?: string;
}): number {
  let hardwarePrice = 0;
  if (params.hardware) {
    const option = findHardware(params.hardware);
    if (!option) {
      throw new Error(`Unknown hardware finish: ${params.hardware}`);
    }
    hardwarePrice = option.price;
  }

  if (params.widthInches <= 0 || params.heightInches <= 0) {
    return params.basePrice + hardwarePrice;
  }

  const areaInSqMeters =
    (params.widthInches * params.heightInches) / SQ_INCHES_PER_SQUARE_METER;
  let displayPrice = params.basePrice;
  if (areaInSqMeters > 1) {
    displayPrice += (areaInSqMeters - 1) * EXTRA_SQUARE_METER_RATE;
  }
  return Number((displayPrice + hardwarePrice).toFixed(2));
}

export function createCartItemId(params: {
  slug: string;
  color: string;
  width: string;
  height: string;
  motor: string;
  structure?: string;
  hardware?: string;
  mountType: "inside" | "outside";
  roomName?: string;
}): string {
  const {
    slug,
    color,
    width,
    height,
    motor,
    structure,
    hardware,
    mountType,
    roomName,
  } = params;
  return [
    slug,
    color,
    width || DEFAULT_WIDTH,
    height || DEFAULT_HEIGHT,
    motor,
    structure ?? "",
    hardware ?? "",
    mountType,
    roomName?.trim() ?? "",
  ].join("::");
}

export function formatDimensions(width: string, height: string): string {
  const w = width || DEFAULT_WIDTH;
  const h = height || DEFAULT_HEIGHT;
  return `${w}" W × ${h}" H`;
}
