export interface ThemeConfig {
  name: string;
  colors: {
    background: string;
    surface: string;
    text: string;
    muted: string;
    primary: string;
    secondary: string;
    accent: string;
    border: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    monoFont: string;
  };
  spacing: {
    slidePadding: string;
    elementGap: string;
  };
  radius: string;
  shadow: {
    sm: string;
    md: string;
    lg: string;
  };
}
