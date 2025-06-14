import { Box, Typography } from '@mui/material'
import image from '@images/linkUp-logo.png';
import Image from 'next/image';


export default function Loading() {
    return <>
        <Box sx={{display:"flex", justifyContent:"center", alignItems:"center", bgcolor:"#fff", width:"100%", height:"100vh"}}>
        <Box sx={{display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column", gap:"30px"}}>
            <Typography component={"span"} className="loader"></Typography>
            <Image width={150} height={50} src={image} alt='LinkUp Loading' />
        </Box>
        </Box>
    </>
}
