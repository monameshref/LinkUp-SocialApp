"use client"
import { Alert, Box, Button, Container, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, Paper, Snackbar, TextField, Typography } from "@mui/material";
import Image from "next/image";
import linkUpImage from "../../../assets/images/linkUp-logo.png";
import { useEffect, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FormValuesLoginType, LoginResponseType } from "./login.types";
import { useFormik } from 'formik';
import * as Yup from 'yup'
import axios from 'axios';
import { useRouter } from "next/navigation";
import { getUserData, setUserToken } from "@/lib/redux/authSlice";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { Metadata } from "next";
import { store } from "@/lib/redux/reduxStore";
import Cookies from 'js-cookie';


export const metaData: Metadata = {
    description:"",
    title:"Login"
};



export default function LoginForm() {
    // أو لا Password علشان نتحكم في إظهار
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {event.preventDefault();};
    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {event.preventDefault();};

    const [isLoading, setIsLoading] = useState(false); // Loading لما يبقى في
    const [isSucsess, setIsSucsess] = useState(false); // يكون رجع صح response لما 
    const [errMessage, setErrMessage] = useState<string | undefined>(undefined);// يكون رجع غلط response لما 

    const router = useRouter();

    const userData: FormValuesLoginType = {
        email: "",
        password: ""
    }

    const dispatch = useDispatch<typeof store.dispatch>();

    useEffect(() => {
        dispatch(getUserData());
    }, [dispatch]);


    function handleSubmit(values:FormValuesLoginType){
        // console.log( "values userDataSignin", values);
        setIsLoading(true);

        axios.post<LoginResponseType>(`${process.env.baseUrl}/users/signin`, values)
        .then( res => {
            // console.log("res Signin", res.data.token);

            // localStorage.setItem("userTokenSocialApp", res.data.token);
            Cookies.set("userTokenSocialApp", res.data.token);

            dispatch(setUserToken(res.data.token));

            setIsSucsess(true);
            router.push("/");
            setIsLoading(false);
        } )
        .catch( error => {
            // console.log("error Signin", error.response.data.error);
            setIsLoading(false);
            setIsSucsess(false);
            setErrMessage(error.response.data.error || "Something went wrong!");
        } );
    }

    const validationSchema = Yup.object({
        email: Yup.string().required().email("Invalid email"),
        password: Yup.string().required("Password required").matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
            "Your password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, and a special character.")
    });

    const formik = useFormik({
        initialValues: userData,

        onSubmit:handleSubmit,
        validationSchema
    });


    return <>
        <Box component="section" className="login">
            <Container sx={{mt:"50px", display:"flex", justifyContent:"center", alignItems:"center"}}>
                <Paper elevation={10} sx={{textAlign:"center", 
                    width: { xs: "100%", sm: "80%", md: "70%" },
                    mx:"auto", mt:"80px", p:{xs:"20px", sm:"50px"}, bgcolor:"#dddddd6e", border:"1px solid #00000026"}}>
                    <Image src={linkUpImage} alt="linkUp logo" width={200} priority />
                    <Box onSubmit={formik.handleSubmit} component="form" sx={{display:"flex", flexDirection:"column", alignItems:"center", my:"20px", gap:"20px"}}>
                        <TextField id="email" label="Email" variant="outlined" fullWidth
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={!!formik.errors.email && formik.touched.email}
                            helperText={formik.touched.email && formik.errors.email} />

                        <FormControl variant="outlined" fullWidth>
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <OutlinedInput
                                error={!!formik.errors.password && formik.touched.password}
                                value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label={showPassword ? 'hide the password' : 'display the password'}
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        onMouseUp={handleMouseUpPassword}
                                        edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>}
                                label="Password"/>

                            <FormHelperText error>
                                {formik.touched.password && formik.errors.password}
                            </FormHelperText>
                        </FormControl>

                        <Button loading={isLoading} loadingPosition="end" disabled={!(formik.isValid && formik.dirty)} type="submit" variant="contained">Sign in</Button>

                        <Typography component="p" sx={{ fontSize:"1.125rem" }}>
                            Don’t have an account? <Link href= "../register" style={{color:"#1976D2"}}>Sign Up</Link>
                        </Typography>

                        <Snackbar open={isSucsess} autoHideDuration={6000} onClose={() => setIsSucsess(false)} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
                            <Alert onClose={() => setIsSucsess(false)} severity="success" sx={{ width: '100%' }}>
                                Congratulations Your Account has Been Created
                            </Alert>
                        </Snackbar>

                        <Snackbar open={!!errMessage} autoHideDuration={6000} onClose={() => setErrMessage(undefined)} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
                            <Alert onClose={() => setErrMessage(undefined)} severity="error" sx={{ width: '100%' }}>
                                {errMessage}
                            </Alert>
                        </Snackbar>
                    </Box>
                </Paper>
            </Container>
        </Box>
    </>
}
