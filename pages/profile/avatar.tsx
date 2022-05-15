import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getDownloadURL, ref, StorageReference, uploadBytes } from 'firebase/storage'

import Divider from '../../components/Divider'
import { storage } from '../../src/helpers/firebaseHelper'
import { useKryptikAuthContext } from '../../components/KryptikAuthProvider'
import NavProfile from '../../components/NavProfile'



const Profile: NextPage = () => {
  const { authUser, loading, getUserPhotoPath, updateCurrentUserKryptik } = useKryptikAuthContext();
  const router = useRouter();
  // ROUTE PROTECTOR: Listen for changes on loading and authUser, redirect if needed
  useEffect(() => {
    if (!loading && !authUser)
      router.push('/')
  }, [authUser, loading])

  const [imageUrl, setImageUrl] = useState("");
  let fileInit:Blob = new Blob();
  //UNCOMMENT for file uploads
  const [imageFile, setImageFile] = useState(fileInit);

  useEffect(()=>{
    getUserPhotoPath(authUser).then((path)=>{
        setImageUrl(path);
    })
  });

  // uploads file to device
  const uploadToClient = (event:any) => {
    if (event.target.files && event.target.files[0]) {
      // extract file from event
      const i:any = event.target.files[0];
      // save file data
      setImageFile(i);
      // set local image url for display
      setImageUrl(URL.createObjectURL(i));
    }
  };

  // gets file url from document reference
  const urlFromRef = async(storageRef:StorageReference):Promise<string>=>{
    let urlResult:string = await getDownloadURL(storageRef);
    return urlResult;
  }


  const uploadToRemote = async():Promise<string>=>{
    console.log("firebase image upload starting....");
    const storageRef = ref(storage, imageUrl);
    // placeholder for upload return url
    let imageUploadUrl:string = "https://picsum.photos/200";
    // upload image to firebase
    uploadBytes(storageRef, imageFile).then(async (snapshot) => {
      console.log("Snapshot:");
      console.log(snapshot);
      imageUploadUrl = await urlFromRef(storageRef);
    });
    return imageUploadUrl;
  }


  const handleClickUpload = async() =>{
    // upload file to firebase
    let urlImageUpload:string = await uploadToRemote();
    authUser.photoUrl = urlImageUpload;
    // update user's profile photo
    await updateCurrentUserKryptik(authUser);
  }

  return (
    <div>

    <div className="h-[2rem]">
      {/* padding div for space between top and main elements */}
    </div>

    <div className="container grid md:grid-cols-2 gap-10 mx-auto place-items-center">
        <div className="w-full rounded">
          <img src={imageUrl} alt="image sneak peak" className="shadow rounded h-auto align-middle border-none" />
        </div>
        <div className="w-full rounded">
        <h5 className="mb-3 text-base font-bold text-black-900 lg:text-xl dark:text-white">
              Upload Profile Photo
          </h5>

                  <label className="form-label inline-block mb-2 text-gray-700">
                    Image Path</label>
                    <input className="form-control
                    block
                    w-full
                    px-3
                    py-1.5
                    text-base
                    font-normal
                    text-gray-700
                    bg-white bg-clip-padding
                    border border-solid border-gray-300
                    rounded
                    transition
                    hover:cursor-pointer
                    ease-in-out
                    m-0
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" type="file" id="file" name="file" onChange={uploadToClient} required/>         
                  

                    {/* upload button */}
                    <div className="item-end">
                      <button onClick={()=>handleClickUpload()} className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded my-5">
                        Upload
                      </button>
                    </div>     
        </div>
    </div>
           

    <div className="h-[5rem]">
      {/* padding div for space between top and main elements */}
    </div>
    
<NavProfile/>
</div>
 
  )
}

export default Profile