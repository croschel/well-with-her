import { Container, Typography } from "@mui/material";

export default function HomePage() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h1">WellWithHer</Typography>
      <Typography variant="body1" color="text.secondary">
        Coming soon.
      </Typography>
    </Container>
  );
}
