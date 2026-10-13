import { useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Paper,
  Grid,
  Link,
  alpha,
  useTheme,
} from "@mui/material";

import MainLayout from "@/shared/layout/MainLayout";
import AppButton from "@/shared/ui/AppButton";
import PageTitle from "@/shared/ui/PageTitle";
import Loading from "@/shared/ui/Loading";
import EmptyState from "@/shared/ui/EmptyState";
import ConfirmDialog from "@/shared/ui/ConfirmDialog";
import SearchBox from "@/shared/ui/SearchBox";
import { toast, TOAST_DURATION } from "@/shared/ui/Toast";
import CourseCard from "@/features/courses/components/CourseCard";
import CourseList from "@/features/courses/components/CourseList";
import CourseFilter from "@/features/courses/components/CourseFilter";

const MOCK_COURSES = [
  {
    id: 1,
    title: "React c╞í bß║ún ─æß║┐n n├óng cao",
    description: "Hß╗ìc React tß╗½ zero vß╗¢i hooks, context v├á best practices cho dß╗▒ ├ín thß╗▒c tß║┐.",
    level: "C╞í bß║ún",
    duration: "12 giß╗¥",
    students: 1280,
    price: 499000,
    progress: 45,
    tags: ["React", "Frontend"],
  },
  {
    id: 2,
    title: "Node.js & Express API",
    description: "X├óy dß╗▒ng REST API vß╗¢i Express, JWT authentication v├á MongoDB.",
    level: "Trung cß║Ñp",
    duration: "18 giß╗¥",
    students: 856,
    price: 699000,
    progress: 0,
    tags: ["Node.js", "Backend"],
  },
  {
    id: 3,
    title: "UI/UX Design System",
    description: "Thiß║┐t kß║┐ giao diß╗çn minimal modern theo chuß║⌐n iOS 18.",
    level: "N├óng cao",
    duration: "8 giß╗¥",
    students: 432,
    price: 399000,
    progress: 100,
    tags: ["Design", "Figma"],
  },
];

function Section({ title, children }) {
  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: theme.ios18?.radius?.lg ?? 16,
        bgcolor: "background.paper",
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        boxShadow: theme.ios18?.shadow?.sm,
      }}
    >
      <Typography
        variant="overline"
        sx={{ color: "primary.main", fontWeight: 700, letterSpacing: "0.06em" }}
      >
        {title}
      </Typography>
      <Divider sx={{ my: 2, borderColor: alpha(theme.palette.primary.main, 0.12) }} />
      {children}
    </Paper>
  );
}

function ComponentShowcase() {
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("Tß║Ñt cß║ú");
  const [category, setCategory] = useState("Tß║Ñt cß║ú");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [showEmptyList, setShowEmptyList] = useState(false);
  const [fullScreenLoading, setFullScreenLoading] = useState(false);

  const filteredCourses = MOCK_COURSES.filter((c) => {
    const matchLevel = level === "Tß║Ñt cß║ú" || c.level === level;
    const matchSearch =
      !search.trim() || c.title.toLowerCase().includes(search.toLowerCase());
    return matchLevel && matchSearch;
  });

  return (
    <>
      <PageTitle
        title="Component Showcase"
        subtitle="Theme ocean ΓÇö iOS 18 minimal"
        action={
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            <AppButton variant="outlined" onClick={() => toast.info("Demo toast ΓÇö tß╗▒ ─æ├│ng sau 5s")}>
              Thß╗¡ Toast
            </AppButton>
            <AppButton variant="outlined" onClick={() => setConfirmOpen(true)}>
              ConfirmDialog
            </AppButton>
          </Box>
        }
      />

      <Section title="Toast">
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Bß║Ñm n├║t b├¬n d╞░ß╗¢i ΓÇö toast hiß╗çn g├│c tr├¬n phß║úi, tß╗▒ ─æ├│ng sau {TOAST_DURATION / 1000}s.
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
          <AppButton variant="contained" onClick={() => toast.success("Thao t├íc th├ánh c├┤ng!")}>
            Success
          </AppButton>
          <AppButton variant="accent" onClick={() => toast.error("C├│ lß╗ùi xß║úy ra. Vui l├▓ng thß╗¡ lß║íi.")}>
            Error
          </AppButton>
          <AppButton variant="outlined" onClick={() => toast.info("Th├┤ng tin cß║¡p nhß║¡t mß╗¢i.")}>
            Info
          </AppButton>
          <AppButton variant="outlined" onClick={() => toast.warning("Vui l├▓ng kiß╗âm tra lß║íi dß╗» liß╗çu.")}>
            Warning
          </AppButton>
        </Box>
      </Section>

      <Section title="Bß║úng m├áu">
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
          {[
            { label: "Primary", color: theme.palette.primary.main },
            { label: "Secondary", color: theme.palette.secondary.main },
            { label: "Accent", color: theme.palette.accent.main },
            { label: "Background", color: theme.palette.background.default },
            { label: "Paper", color: theme.palette.background.paper },
          ].map((item) => (
            <Box key={item.label} sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  bgcolor: item.color,
                  border: `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,
                  mb: 0.5,
                }}
              />
              <Typography variant="caption" display="block" fontWeight={600}>
                {item.label}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {item.color}
              </Typography>
            </Box>
          ))}
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Link mß║½u: <Link href="#">Xem chi tiß║┐t kh├│a hß╗ìc</Link>
        </Typography>
      </Section>

      <Section title="AppButton">
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
          <AppButton variant="contained">Ch├¡nh (Cam)</AppButton>
          <AppButton variant="secondary">Phß╗Ñ (Xanh)</AppButton>
          <AppButton variant="outlined">Outlined</AppButton>
          <AppButton variant="outlinedSecondary">Outlined xanh</AppButton>
          <AppButton variant="text">Text link</AppButton>
          <AppButton variant="accent">Highlight</AppButton>
          <AppButton variant="contained" loading>
            Loading
          </AppButton>
        </Box>
      </Section>

      <Section title="SearchBox">
        <SearchBox
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="T├¼m kh├│a hß╗ìc..."
        />
      </Section>

      <Section title="Loading">
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
          <Loading message="─Éang tß║úi dß╗» liß╗çu..." />
          <AppButton
            variant="outlined"
            onClick={() => {
              setFullScreenLoading(true);
              setTimeout(() => setFullScreenLoading(false), 2000);
            }}
          >
            Fullscreen 2s
          </AppButton>
        </Box>
        {fullScreenLoading && <Loading fullScreen message="Fullscreen loading..." />}
      </Section>

      <Section title="EmptyState">
        <EmptyState
          title="Kh├┤ng t├¼m thß║Ñy kß║┐t quß║ú"
          description="Thß╗¡ ─æß╗òi tß╗½ kh├│a hoß║╖c bß╗Ö lß╗ìc kh├íc."
          actionLabel="X├│a bß╗Ö lß╗ìc"
          onAction={() => {
            setSearch("");
            setLevel("Tß║Ñt cß║ú");
          }}
        />
      </Section>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => setConfirmOpen(false)}
        title="X├íc nhß║¡n h├ánh ─æß╗Öng"
        message="Demo ConfirmDialog vß╗¢i theme cam mß╗¢i."
        confirmLabel="─Éß╗ông ├╜"
        cancelLabel="Hß╗ºy bß╗Å"
      />

      <Section title="CourseFilter">
        <CourseFilter
          selectedLevel={level}
          selectedCategory={category}
          categories={["Lß║¡p tr├¼nh", "Thiß║┐t kß║┐", "DevOps"]}
          onLevelChange={setLevel}
          onCategoryChange={setCategory}
        />
      </Section>

      <Section title="CourseCard">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <CourseCard
              course={MOCK_COURSES[0]}
              onEnroll={(id) => alert(`Mua kh├│a #${id}`)}
            />
          </Grid>
        </Grid>
      </Section>

      <Section title="CourseList">
        <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
          <AppButton
            size="small"
            variant="outlined"
            onClick={() => {
              setListLoading(true);
              setTimeout(() => setListLoading(false), 1500);
            }}
          >
            Giß║ú lß║¡p loading
          </AppButton>
          <AppButton
            size="small"
            variant="outlined"
            onClick={() => setShowEmptyList((v) => !v)}
          >
            {showEmptyList ? "Hiß╗çn danh s├ích" : "Hiß╗çn empty"}
          </AppButton>
        </Box>
        <CourseList
          courses={showEmptyList ? [] : filteredCourses}
          loading={listLoading}
          onEnroll={(id) => alert(`Mua kh├│a #${id}`)}
          onCourseClick={(c) => alert(`Mß╗ƒ kh├│a: ${c.title}`)}
        />
      </Section>

      <Section title="Layout">
        <Typography variant="body2" color="text.secondary">
          Trang bß╗ìc bß╗ƒi <strong>MainLayout</strong> ΓÇö Header trß║»ng, nß╗ün web{" "}
          <strong>#FFF7ED</strong>, card trß║»ng.
        </Typography>
      </Section>
    </>
  );
}

export default function Test() {
  return (
    <MainLayout>
      <ComponentShowcase />
    </MainLayout>
  );
}
