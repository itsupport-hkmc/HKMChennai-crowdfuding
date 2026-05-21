import { Box, Input } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useSelector} from 'react-redux'
// import { getAdminData } from '../../Redux/adminSlice/adminSlice'

const AdminLogin = () => {

    const [adminData,setAdminData] = useState({
        email:"",
        password:""
    })


    const state = useSelector(state=>state.admin);

    console.log(state)

    const handleChagne = (e) =>{
         const {name,value} = e.target;

         setAdminData(prev=>{
            return {
                ...prev,
                [name]:value
            }
         })
    }

    const handleLogin = (e) =>{ 
       e.preventDefault();  
       console.log("clicked",adminData)
       localStorage.setItem('admin',JSON.stringify(adminData))
    }


  return (
    <Box display={'flex'} w={'100%'} h={'100vh'} justifyContent={'center'} alignItems={'center'}>
        <form onSubmit={handleLogin}>
             <Input type='text' placeholder='Enter Username'  name='email' value={adminData.email} onChange={handleChagne} />
             <Input type='password' placeholder='Enter Password' name='password' value={adminData.password} onChange={handleChagne}  />
             <Input type='submit' value={"Login"} />
        </form>
    </Box>
  )
}

export default AdminLogin
