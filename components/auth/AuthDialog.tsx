import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useState } from "react";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

const AuthDialog = (props: { open: boolean }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  if (isSignUp) {
  }

  return (
    <Box>
      <Dialog open={props.open}>
        <DialogTitle>Sign In</DialogTitle>
        <DialogContent>
          {!isSignUp && <SignInForm />}
          {isSignUp && <SignUpForm />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsSignUp((isSignUp) => !isSignUp)}>
            {isSignUp ? "Sign in instead" : "Sign up instead"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AuthDialog;
