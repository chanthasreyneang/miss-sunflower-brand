import { useReveal } from "../../hooks/useReveal";

export default function Reveal({ as: Tag = "div", className = "", style, children, ...rest }) {
  const ref = useReveal();
  return (
    <Tag ref={ref} data-animate className={className} style={style} {...rest}>
      {children}
    </Tag>
  );
}
