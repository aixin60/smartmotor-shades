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

export function createCartItemId(params: {
  slug: string;
  color: string;
  width: string;
  height: string;
  motor: string;
  structure?: string;
}): string {
  const { slug, color, width, height, motor, structure } = params;
  return [
    slug,
    color,
    width || DEFAULT_WIDTH,
    height || DEFAULT_HEIGHT,
    motor,
    structure ?? "",
  ].join("::");
}

export function formatDimensions(width: string, height: string): string {
  const w = width || DEFAULT_WIDTH;
  const h = height || DEFAULT_HEIGHT;
  return `${w}" W × ${h}" H`;
}
