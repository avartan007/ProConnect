import UserLayout from '@/layout/UserLayout';
import styles from './style.module.css';
import DashboardLayout from '@/layout/DashboardLayout';
import { useEffect, useState } from 'react';
import { getAboutUser } from '@/config/redux/action/authAction';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL, clientServer } from '@/config';
import { getAllPosts } from '@/config/redux/action/postAction';

function ProfilePage() {
    const dispatch = useDispatch();
    const authState = useSelector((state)=> state.auth);
    const postReducer = useSelector((state)=> state.postReducer);
    const [userProfile, setUserProfile]= useState({});
    const [userPosts, setUserPosts]= useState([]);
    const [isModalOpen, setIsModalOpen]= useState(false);
    const [inputData, setInputData]= useState({company:``, position:``, years:``});

  const handleWorkInputChange= (e)=>{
    const {name, value} = e.target;
    setInputData({...inputData, [name]: value});
  }

  useEffect(()=>{
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(getAboutUser({token}));
      dispatch(getAllPosts());
    }
  }, [dispatch])

  useEffect(()=>{
    if(authState.user?.userId!=undefined){
    // The editable form mirrors the fetched profile and must be initialized when it arrives.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUserProfile(authState.user);
    let post = postReducer.posts.filter((post)=>{
      return post.userId.username === authState.user.userId.username
    })
    setUserPosts(post);
    }
  }, [authState.user, postReducer.posts])

  const updateProfilePicture = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const formData = new FormData();
    formData.append("profile_picture", file);
    formData.append("token", localStorage.getItem("token"));
    const response = await clientServer.post("/update_profile_picture", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    dispatch(getAboutUser({token:localStorage.getItem("token")}));
  }

  const updateProfileData = async () => {
    await clientServer.post("/user_update", {
        token: localStorage.getItem("token"),
        name: userProfile.userId.name,
    });
    await clientServer.post("/update_profile_data", {
        token: localStorage.getItem("token"),
        bio: userProfile.bio,
        currentPost: userProfile.currentPost,
        pastWork: userProfile.pastWork,
        education: userProfile.education
    });
    dispatch(getAboutUser({token:localStorage.getItem("token")}));
  }

  return (
    <UserLayout>
      <DashboardLayout>
        {authState.user&& userProfile.userId&&
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
            <label htmlFor='profilePictureUpload' className={styles.backDrop__overlay}><p>Edit</p></label>
            <input onChange={(e)=>{updateProfilePicture(e.target.files[0])}} hidden type='file' id='profilePictureUpload'></input>
            <img src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt="backdrop"></img>
          </div>
          <div className={styles.profileContainer__details}>
            <div style={{display:"flex", gap:"0.7rem"}}>
              <div style={{flex:"0.8"}}>
                <div className={styles.details2}>
                  <input className={styles.nameEdit} type="text" value={userProfile.userId.name} onChange={(e)=>{setUserProfile({...userProfile, userId:{...userProfile.userId, name:e.target.value}})}}></input>
                  <p style={{color:"grey"}}>@{userProfile.userId.username}</p>
                </div>
              <div>
                <textarea style={{width:"100%"}} value={userProfile.bio} onChange={(e)=>{setUserProfile({...userProfile, bio:e.target.value})}} rows={Math.max(3, Math.ceil(userProfile.bio.length/80))}></textarea>
              </div>
              </div>
              <div style={{flex:"0.2"}}>
                <h3>Recent Activity</h3>
                {userPosts.map((post)=>{
                  return (
                    <div key={post._id} className={styles.postCard}>
                      <div className={styles.card}>
                        <div className={styles.card__profileContainer}>
                          {post.media!==""?<img src={`${BASE_URL}/${post.media}`} alt="Post attachment"></img>:<div style={{width:"3.4rem", height:"3.4rem"}}></div>}
                        </div>
                        <p>{post.body}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className={styles.workHistory}>
            <h4>Work History</h4>
            <div className={styles.workHistoryContainer}>
              {
                userProfile.pastWork.map((work,index) => {
                  return (
                    <div key={index} className={styles.workHistoryCard}>
                      <p style={{fontWeight:"bold", display:"flex", alignItems:"center", gap:"0.6rem"}}>{work.company} - {work.position}</p>
                      <p>{work.years}</p>
                    </div>
                  )
                })
              }
              <button onClick={()=>setIsModalOpen(true)} className={styles.addWorkButton}>Add Work</button>
            </div>
          </div>

          <button type="button" className={styles.connectBtn} onClick={()=>{
            updateProfileData()
          }}>Update Profile</button>

        </div>
        }

        {
          isModalOpen && 
          <div onClick={()=>{
            setIsModalOpen(false)
          }} className={styles.commentsContainer}>
            <div onClick={(e)=>{e.stopPropagation()}} className={styles.allCommentsContainer}>
                <input onChange={handleWorkInputChange} className={styles.inputField} name='company' type="text" placeholder='Enter Company'/>
                <input onChange={handleWorkInputChange} className={styles.inputField} name='position' type="text" placeholder='Enter Position'/>
                <input onChange={handleWorkInputChange} className={styles.inputField} type="number" name='years' placeholder='Years'/>
                <div onClick={()=>{
                    setUserProfile({...userProfile, pastWork: [...userProfile.pastWork, inputData]})
                    setIsModalOpen(false)
                }} className={styles.connectBtn}>Add Work</div>
            </div>
          </div>
                    
        }

      </DashboardLayout>
      </UserLayout>
  )
}

export default ProfilePage