import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, DialogTitle, TextField } from "@mui/material";
import { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import AuthContext from "../../context/AuthContext";
import { SignInData, SignInFormSchema } from "../../model/AuthData";

const SignInForm = () => {
  const authCtx = useContext(AuthContext);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<SignInData>({ resolver: zodResolver(SignInFormSchema) });

  const handleSignIn = (data: SignInData) => {
    authCtx.signin(data.email!, data.password!);
    reset();
  };
  return (
    <Box sx={{ maxWidth: 400 }}>
      <form>
        <Controller
          name="email"
          defaultValue=""
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              error={Boolean(errors.email?.message)}
              helperText={errors.email?.message}
              autoFocus
              margin="dense"
              id="email"
              label="Email"
              type="text"
              fullWidth
              variant="standard"
              required={true}
            />
          )}
        />
        <Controller
          name="password"
          defaultValue=""
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              error={Boolean(errors.password?.message)}
              helperText={errors.password?.message}
              margin="dense"
              id="password"
              label="Password"
              type="password"
              fullWidth
              variant="standard"
              required={true}
            />
          )}
        />
        <Box display="flex" justifyContent="right">
          <Button variant="contained" onClick={handleSubmit(handleSignIn)}>
            Sign In
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default SignInForm;
