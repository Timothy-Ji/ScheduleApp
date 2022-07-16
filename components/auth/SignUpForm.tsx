import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, TextField } from "@mui/material";
import { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import AuthContext from "../../context/AuthContext";
import { SignUpData, SignUpFormSchema } from "../../model/AuthData";

const SignUpForm = () => {
  const authCtx = useContext(AuthContext);
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<SignUpData>({ resolver: zodResolver(SignUpFormSchema) });

  const handleSignUp = (data: SignUpData) => {
    authCtx.signup(data.email, data.password);
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
        <Controller
          name="confirm"
          defaultValue=""
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              error={Boolean(errors.confirm?.message)}
              helperText={errors.confirm?.message}
              margin="dense"
              id="confirm"
              label="Confirm Password"
              type="password"
              fullWidth
              variant="standard"
              required={true}
            />
          )}
        />
        <Box display="flex" justifyContent="right">
          <Button variant="contained" onClick={handleSubmit(handleSignUp)}>
            Sign Up
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default SignUpForm;
