
// @ts-nocheck
export function useGlobalUtils(hex, amount = 80) {
  function lightenHexColor (hex, amount){
    console.log('useGlobalUtils.lightenHexColor is deprecated, use useColorUtils.lightenHexColor instead');
    hex = hex.replace(/^#/, '');
    const r = Math.min(255, parseInt(hex.slice(0, 2), 16) + amount);
    const g = Math.min(255, parseInt(hex.slice(2, 4), 16) + amount);
    const b = Math.min(255, parseInt(hex.slice(4, 6), 16) + amount);
    return `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`;
  };
  return {
    lightenHexColor
  };



}
