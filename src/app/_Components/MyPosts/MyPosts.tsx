import Post from '@/app/_Components/Post/Post';
import { PostType } from '@/app/_interfacess/Post.types';
import { cookies } from 'next/headers';
import { jwtDecode } from "jwt-decode";
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import EmptyPosts from '@images/emtyPosts.png';


export default async function MyPosts() {
        {/* دى صفحة البوستات اللى هتتعرض وهعمل صفحات تانية وهرندرها هنا  */}
    const myCookies = await cookies();

    const token = myCookies.get("userTokenSocialApp")
    const userData:{user:string} = jwtDecode(token?.value || "");
    // console.log(userData);


    // Get User Posts
    async function getUserPosts(){
        const res = await fetch(`${process.env.baseUrl}/users/${userData.user}/posts`, {
            headers: {
                // فاضي string ولو مش موجودة رجّعلي cookies هاتلي القيمة اللي جوا ال
                token: token?.value || ""

                /*
                    ولا تحذير Error فبلاش تعمليلي null ولا undefined أنا متأكدة 100% إن القيمة دي مش TypeScript يعني بتقولي للـ
                        * token: cookies.get("userTokenSocialApp")!
                */
            }
        });

        const finalRes = await res.json();
        // console.log(finalRes);

        return finalRes.posts;
    }

    let allPosts:PostType[] = await getUserPosts();
    allPosts = allPosts.toSorted((a,b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    // console.log("allPosts",allPosts);

    return <>
        <Typography component="h2" sx={{fontSize:"45px", fontFamily:"var(--font-fira)"}}>My Posts:</Typography>
        { allPosts.length == 0 ? <Box sx={{display:"flex", justifyContent:"space-between", alignItems:"center", flexDirection:"column"}}>
                                    <Typography component="h4" sx={{fontSize:"30px", pb:"20px"}}>Your Posts is Empty...</Typography>
                                    <Image width={400} height={400} src={EmptyPosts} alt='Empty Posts' />
                                </Box> : 
                                allPosts?.map((post) => { return <Post key={post._id} postDetails={post} singleComment={false} />})  }
        </>
}
