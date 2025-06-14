"use client";
import { Alert, Box, Button, Container, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Paper, Select, Snackbar, TextField, Typography } from "@mui/material";
import { Metadata } from "next"
import linkUpImage from "../../../assets/images/linkUp-logo.png";
import Image from "next/image";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Link from "next/link";
import * as Yup from 'yup';
import { useFormik } from "formik";
import { FormValuesSignupType } from "./register.types";
import axios from "axios";
import { useRouter } from "next/navigation";

export const metaData: Metadata = {
    description:"",
    title:"Register"
};


export default function RegisterForm() {
    // أو لا Password علشان نتحكم في إظهار
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {event.preventDefault();};
    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {event.preventDefault();};

    // أو لا re-Password علشان نتحكم في إظهار
    const [showRepassword, setShowRepassword] = useState(false);
    const handleClickShowRepassword = () => setShowRepassword((show) => !show);
    const handleMouseDownRepassword = (event: React.MouseEvent<HTMLButtonElement>) => {event.preventDefault();};
    const handleMouseUpRepassword = (event: React.MouseEvent<HTMLButtonElement>) => {event.preventDefault();};

    const [isLoading, setIsLoading] = useState(false); // Loading لما يبقى في
    const [isSucsess, setIsSucsess] = useState(false); // يكون رجع صح response لما 
    const [errMessage, setErrMessage] = useState<string | undefined>(undefined);// يكون رجع غلط response لما 

    const router = useRouter();


    const userData: FormValuesSignupType = {
        name: "",
        email: "",
        password: "",
        rePassword: "",
        dateOfBirth: "",
        gender: ""
    }

    function handleSubmit(){
        // console.log( "values userDataRegister", values);
        setIsLoading(true);

        axios.post(`${process.env.baseUrl}/users/signup`,userData)
        .then( res => {
            // console.log("res Signup", res.data.message);

            setIsSucsess(res.data.message);
            setTimeout(()=>{
                router.push("../login");
            },2000)
            setIsLoading(false);
        } )
        .catch( (error) => {
            // console.log("error Signup", error.response.data.error);
            setIsLoading(false);
            setIsSucsess(false);
            setErrMessage(error.response.data.error || "Something went wrong!");
            setTimeout(()=>{
                setErrMessage(undefined);
            },2000)
        } );
    };

    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required"),
        email: Yup.string().required().email("Invalid email"),
        password: Yup.string().required("Password required").matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
            "Your password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, and a special character."),
        rePassword: Yup.string().required("This Confirm Password is Required").oneOf([Yup.ref("password")],"Password and rePassword Don't Match") ,
        dateOfBirth: Yup.date().required("Date of Birth is required").max(new Date(), "Date of Birth can't be in the future"),
        gender: Yup.string().required("Gender is required"),
    });

    const formikSignUp = useFormik({
        initialValues: userData,
        onSubmit: handleSubmit,
        validationSchema
    });


    return <>
        <Box component="section" className="register">
            <Container  sx={{mt:"50px", display:"flex", justifyContent:"center", alignItems:"center"}}>
                <Paper elevation={10} sx={{textAlign:"center",
                    width: { xs: "100%", sm: "80%", md: "70%" },
                    mx:"auto", my:"80px", p:{xs:"20px", sm:"50px"}, bgcolor:"#dddddd6e", border:"1px solid #00000026"}}>
                    <Image src={linkUpImage} alt="linkUp logo" width={200} priority />
                    <Box onSubmit={formikSignUp.handleSubmit} component="form" sx={{display:"flex", flexDirection:"column", alignItems:"center", my:"20px", gap:"20px"}}>

                        <TextField id="name" label="Name" variant="outlined" fullWidth
                            value={formikSignUp.values.name}
                            onChange={formikSignUp.handleChange}
                            onBlur={formikSignUp.handleBlur}
                            error={formikSignUp.touched.name && !!formikSignUp.errors.name}
                            helperText={formikSignUp.touched.name && formikSignUp.errors.name} />

                        <TextField id="email" label="Email" variant="outlined" fullWidth
                            value={formikSignUp.values.email}
                            onChange={formikSignUp.handleChange}
                            onBlur={formikSignUp.handleBlur}
                            error={formikSignUp.touched.email && !!formikSignUp.errors.email}
                            helperText={formikSignUp.touched.email && formikSignUp.errors.email} />

                        <FormControl variant="outlined" fullWidth>
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <OutlinedInput
                                value={formikSignUp.values.password}
                                onChange={formikSignUp.handleChange}
                                onBlur={formikSignUp.handleBlur}
                                error={formikSignUp.touched.password && !!formikSignUp.errors.password}
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
                                    {formikSignUp.touched.password && formikSignUp.errors.password}
                                </FormHelperText>
                        </FormControl>

                        <FormControl variant="outlined" fullWidth>
                            <InputLabel htmlFor="outlined-adornment-password">re-Password</InputLabel>
                            <OutlinedInput
                                value={formikSignUp.values.rePassword} onChange={formikSignUp.handleChange} onBlur={formikSignUp.handleBlur}
                                id="rePassword"
                                type={showRepassword ? 'text' : 'password'}
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label={showRepassword ? 'hide the password' : 'display the password'}
                                        onClick={handleClickShowRepassword}
                                        onMouseDown={handleMouseDownRepassword}
                                        onMouseUp={handleMouseUpRepassword}
                                        edge="end">
                                        {showRepassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>}
                                label="re-Password"/>

                            <FormHelperText error>
                                {formikSignUp.touched.rePassword && formikSignUp.errors.rePassword}
                            </FormHelperText>
                        </FormControl>

                        <TextField type="date" id="dateOfBirth" label="Date of Birth" name="dateOfBirth" fullWidth
                            value={formikSignUp.values.dateOfBirth || "2000-01-01"}
                            onChange={formikSignUp.handleChange}
                            onBlur={formikSignUp.handleBlur}
                            error={formikSignUp.touched.dateOfBirth && !!formikSignUp.errors.dateOfBirth}
                            helperText={formikSignUp.touched.dateOfBirth && formikSignUp.errors.dateOfBirth} />

                        <FormControl fullWidth>
                                <InputLabel id="gender">Gender</InputLabel>
                                <Select
                                    labelId="gender"
                                    id="gender"
                                    name="gender"
                                    value={formikSignUp.values.gender}
                                    label="gender"
                                    onChange={formikSignUp.handleChange}
                                    onBlur={formikSignUp.handleBlur}
                                    >
                                    <MenuItem value={"male"}>Male</MenuItem>
                                    <MenuItem value={"female"}>Female</MenuItem>
                                </Select>

                                <FormHelperText error>
                                    {formikSignUp.touched.gender && formikSignUp.errors.gender}
                            </FormHelperText>
                        </FormControl>

                        <Button loading={isLoading} loadingPosition="end" disabled={!(formikSignUp.isValid && formikSignUp.dirty)} type="submit" variant="contained">Register</Button>

                        <Typography component="p" sx={{ fontSize:"18px" }}>
                            Already have an account? <Link href= "../login" style={{color:"#1976D2"}}>Sign in</Link>
                        </Typography>

                        <Snackbar open={isSucsess} autoHideDuration={6000} onClose={() => setIsSucsess(false)} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
                            <Alert onClose={() => setIsSucsess(false)} severity="success" sx={{ width: '100%' }}>
                                {isSucsess}
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
