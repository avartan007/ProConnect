import { BASE_URL, clientServer } from "@/config";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import styles from "./style.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import { getAllPosts } from "@/config/redux/action/postAction";
import { getConnectionsRequest, getMyConnectionRequests, sendConnectionRequest } from "@/config/redux/action/authAction";

export default function ViewProfilePage({userProfile}) {
  const router = useRouter();
  const postReducer = useSelector((state)=> state.postReducer);
  const dispatch = useDispatch();
  const authState = useSelector((state)=> state.auth);
  const [isDownloading, setIsDownloading] = useState(false);

  const userPosts = postReducer.posts.filter((post) => {
    return post.userId.username === router.query.username;
  });

  const profileId = userProfile?.userId?._id;
  const currentConnection =
    authState.connections?.find((user) => user.connectionId._id === profileId) ??
    authState.connectionRequest?.find((user) => user.userId._id === profileId);

  const isCurrentUserInConnection = Boolean(currentConnection);
  const isConnectionNull = currentConnection?.status_accepted !== true;

  useEffect(()=>{
    const token = localStorage.getItem("token");
    dispatch(getAllPosts());
    if (token) {
      dispatch(getConnectionsRequest({token}));
      dispatch(getMyConnectionRequests({token}));
    }
  },[dispatch]);
  
  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
            <img className={styles.backDrop} src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt="backdrop"></img>
          </div>
          <div className={styles.profileContainer__details}>
            <div className={styles.profileContainer__flex}>
              <div style={{flex:"0.8"}}>
                <div style={{display:"flex", width:"fit-content", alignItems:"center", gap:"1.2rem"}}>
                  <h2>{userProfile.userId.name}</h2>
                  <p style={{color:"grey"}}>@{userProfile.userId.username}</p>
                </div>
              <div style={{display:"flex", alignItems:"center", gap:"1.2rem"}}>
                {isCurrentUserInConnection ?
                <button className={styles.connectedButton}>{isConnectionNull? "Pending":"Connected"}</button>
                :
                <button onClick={async()=>{
                  await dispatch(sendConnectionRequest({token:localStorage.getItem("token"), user_id:userProfile.userId._id}));
                }} className={styles.connectBtn}>Connect</button>}
                <div onClick={async ()=>{
                  if (isDownloading) return;
                  setIsDownloading(true);
                  try {
                    const response= await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`);
                    window.open(`${BASE_URL}/${response.data.message}`, "_blank", "noopener,noreferrer");
                  } catch {
                    window.alert("Unable to download this profile right now.");
                  } finally {
                    setIsDownloading(false);
                  }
                }} style={{cursor:"pointer"}}>
                  <svg style={{width:"1.2em"}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
               </div>
              </div>
              <div>
                <p>{userProfile.bio}</p>
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
            </div>
          </div>

        </div>
      </DashboardLayout>
      </UserLayout>
  )
}

export async function getServerSideProps(context) {

  const request = await clientServer.get("/user/get_profile_based_on_username",{
    params: {
      username: context.query.username
    }
  });
  return { props: {userProfile: request.data.profile} }
}