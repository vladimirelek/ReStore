import {
  Container,
  Typography,
  ButtonGroup,
  Button,
  Alert,
  ListItemText,
  AlertTitle,
  List,
  ListItem,
} from "@mui/material";
import agent from "../../app/api/agent";
import { useState } from "react";

const AboutPage = () => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const getValidationError = () => {
    agent.TestErrors.getValidationError()
      .then(() => console.log("should not see this"))
      .catch((error) => setValidationErrors(error));
  };
  return (
    <Container>
      <Typography gutterBottom variant={"h2"}>
        Errors for testing purposes
      </Typography>
      <ButtonGroup fullWidth>
        <Button
          onClick={() =>
            agent.TestErrors.get400Error().catch((error) =>
              console.log(console.log(error))
            )
          }
        >
          Test 400 error
        </Button>
        <Button
          onClick={() =>
            agent.TestErrors.get401Error().catch((error) =>
              console.log(console.log(error))
            )
          }
        >
          Test 401 error
        </Button>
        <Button
          onClick={() =>
            agent.TestErrors.get404Error().catch((error) =>
              console.log(console.log(error))
            )
          }
        >
          Test 404 error
        </Button>
        <Button
          onClick={() =>
            agent.TestErrors.get500Error().catch((error) =>
              console.log(console.log(error))
            )
          }
        >
          Test 500 error
        </Button>
        <Button onClick={getValidationError}>Test validation error</Button>
      </ButtonGroup>
      {validationErrors.length > 0 && (
        <Alert severity="error">
          <AlertTitle>ValidationErrors</AlertTitle>
          <List>
            {validationErrors.map((error) => (
              <ListItem key={error}>
                <ListItemText>{error}</ListItemText>
              </ListItem>
            ))}
          </List>
        </Alert>
      )}
    </Container>
  );
};
export default AboutPage;
