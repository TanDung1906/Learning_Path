import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    ios18: {
      radius: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        pill: number;
        card: number;
      };
      blur: number;
      glass: Record<string, string>;
      shadow: { sm: string; md: string; lg: string };
      transition: string;
    };
  }

  interface Palette {
    accent: Palette["primary"];
  }

  interface PaletteOptions {
    accent?: PaletteOptions["primary"];
  }
}
