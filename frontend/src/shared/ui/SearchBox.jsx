import { Box, InputAdornment, TextField, Typography, alpha, useTheme } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

export default function SearchBox({
  value,
  onChange,
  onClear,
  placeholder = "Tìm kiếm...",
  fullWidth = true,
  showClear = true,
  showSearchIcon = true,
  sx,
  ...props
}) {
  const theme = useTheme();

  const handleClear = () => {
    onChange?.({ target: { value: "" } });
    onClear?.();
  };

  return (
    <Box sx={{ position: "relative", width: fullWidth ? "100%" : "auto", ...sx }}>
      <TextField
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        fullWidth={fullWidth}
        size="small"
        slotProps={{
          input: showSearchIcon
            ? {
                startAdornment: (
                  <InputAdornment
                    position="start"
                    sx={{
                      mr: 0.75,
                      ml: 0.25,
                      height: "auto",
                      maxHeight: "none",
                      alignSelf: "center",
                    }}
                  >
                    <SearchOutlinedIcon
                      sx={{
                        fontSize: 16,
                        color: alpha(theme.palette.text.secondary, 0.55),
                        display: "block",
                      }}
                    />
                  </InputAdornment>
                ),
              }
            : undefined,
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            minHeight: 36,
            alignItems: "center",
            borderRadius: theme.ios18?.radius?.pill ?? 9999,
            backgroundColor: alpha(theme.palette.primary.main, 0.04),
            pr: value && showClear ? 7 : 1.75,
            transition: `all 0.2s ${theme.ios18?.transition}`,
            "& fieldset": {
              borderColor: alpha(theme.palette.primary.main, 0.12),
            },
            "&:hover fieldset": {
              borderColor: alpha(theme.palette.primary.main, 0.25),
            },
            "&.Mui-focused": {
              backgroundColor: "#fff",
              "& fieldset": {
                borderColor: theme.palette.primary.main,
                borderWidth: 1,
              },
            },
            "& .MuiOutlinedInput-input": {
              fontSize: 13,
              lineHeight: "20px",
              py: "8px",
              px: 0,
              "&::placeholder": {
                fontSize: 13,
                lineHeight: "20px",
                opacity: 1,
                color: alpha(theme.palette.text.secondary, 0.65),
              },
            },
          },
        }}
        {...props}
      />
      {value && showClear ? (
        <Typography
          component="button"
          type="button"
          onClick={handleClear}
          sx={{
            position: "absolute",
            right: 16,
            top: "50%",
            transform: "translateY(-50%)",
            border: "none",
            background: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 13,
            fontWeight: 600,
            color: "primary.main",
            p: 0,
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Xóa
        </Typography>
      ) : null}
    </Box>
  );
}
