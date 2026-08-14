import { FiDroplet, FiSun, FiGrid } from "react-icons/fi";
import { GiSoap, GiChemicalDrop, GiLipstick, GiHairStrands } from "react-icons/gi";
import { FaSpa } from "react-icons/fa";

const iconMap = {
  cleanser: GiSoap,
  moisturizer: FiDroplet,
  serum: GiChemicalDrop,
  sunscreen: FiSun,
  makeup: GiLipstick,
  spa: FaSpa,
  hair: GiHairStrands,
};

export function CategoryIcon({ icon, ...props }) {
  const Icon = iconMap[icon] || FiGrid;
  return <Icon {...props} />;
}
