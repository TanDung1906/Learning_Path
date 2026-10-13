import { Link as RouterLink, useNavigate } from "react-router-dom";
import logoImg from "../../asset/image/logo.png";
import { useNavigationGuard } from "@/context/NavigationGuardContext";

export const LOGO_SRC = logoImg;

export default function Logo({
  height = 40,
  to = "/",
  link = true,
  className = "",
  alt = "S.T.A.R Learning Path",
}) {
  const navigate = useNavigate();
  const { requestGuardedNavigation } = useNavigationGuard() ?? {};

  const handleClick = (event) => {
    if (!requestGuardedNavigation) return;
    event.preventDefault();
    requestGuardedNavigation(() => navigate(to));
  };

  const image = (
    <img
      src={logoImg}
      alt={alt}
      className={className}
      style={{
        height,
        width: "auto",
        maxWidth: "100%",
        display: "block",
        objectFit: "contain",
      }}
    />
  );

  if (link && to) {
    return (
      <RouterLink
        to={to}
        onClick={handleClick}
        aria-label={alt}
        style={{ display: "inline-flex", lineHeight: 0, flexShrink: 0 }}
      >
        {image}
      </RouterLink>
    );
  }

  return image;
}
