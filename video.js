let cookieString=document.cookie;
let videoId=cookieString.split("=")[1].split(";")[0];
const apiKey=localStorage.getItem("api_Key");

let firstScript=document.getElementsByTagName("script")[0];
firstScript.addEventListener("load",onLoadScript)
function onLoadScript() {
    if (YT) {
        new YT.Player("aravind", {
            height: "400",
            width: "600",
            videoId,
            events: {
                onReady: (event) => {
                
                    document.title = event.target.videoTitle;
                    extractVideoDetails(videoId);
                    fetchStats(videoId);
                }
            }
        })
    }
}
const statsContainer=document.getElementsByClassName("video-details")[0];
// async function extractVideoDetails(videoId){
//     let endpoint=`https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${apiKey}`;
//     try{
//       let response=await fetch(endpoint);
//       let result=await response.json();
//       console.log(result);
//     }catch(error){
//         console.log("error",error);
//     }
// }
async function extractVideoDetails(videoId) {
    let endpoint = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${apiKey}`;
    try {
       
        let response = await fetch(endpoint);
        let result = await response.json();
       
        renderComments(result.items);
        
    } catch (error) {
        console.log("error", error);
    }
}

async function fetchStats(videoId){
    console.log("fetch fetchStats")
    let endPoint=` https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&key=${apiKey}&id=${videoId}`
    try{
        const response=await fetch(endPoint);
        const result=await response.json();
        console.log(result,"stats");
        
        const item=result.items[0];
        const title=document.getElementById("title")
        title.innerText=item.snippet.title;
        title.style.color="white";
        title.style.fontSize="20px";
        
         statsContainer.innerHTML=` <div class="profile">
         <img src="https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60" class="channel-logo" alt="">
         <div class="owner-details">
             <span style="color:white">${item.snippet.channelTitle}</span>
             <span>20 subscribers</span>
         </div>
     </div>
     <div class="stats">
        <div class="like-container">
         <div class="like">
             <span class="material-icons">thumb_up</span>
             <span>${item.statistics.likeCount}</span>
         </div>
         <div class="like">
             <span class="material-icons">thumb_down</span>
             <span>0</span>
         </div>
        </div>
        <div class="comments-container">
         <span class="material-icons">comment</span>
         <span>${item.statistics.commentCount}</span>
        </div>
     </div>`
    }
    catch(error){
        console.log("error", error)
    }
}

function renderComments(commentsList){
    const commentsContainer=document.getElementById("comments-container")
   for(let i=0;i<commentsList.length;i++){
    let comment=commentsList[i];
    const topLevelComment=comment.snippet.topLevelComment;
    let commentElement=document.createElement("div");
    commentElement.className="comment";
    commentElement.innerHTML=`
    <img src="${topLevelComment.snippet.authorProfileImageUrl}" alt="">
    <div> 
        <p style="font-size: 15px; color: azure;">${topLevelComment.snippet.authorDisplayName}</p> 
        <p>${topLevelComment.snippet.textOriginal}</p>
        <div class="like">
          <div>
            <span class="material-icons">thumb_up</span>
            <span>${topLevelComment.snippet.likeCount}</span>
          </div>
          <div>
            <span class="material-icons">thumb_down</span>
            <span>0</span>
          </div> 
          <button class="reply" style="background-color:black; color:white;border:none;cursor:pointer" onclick="loadComments(this)" data-comment-id="${topLevelComment.id}">
           replies(${comment.snippet.totalReplyCount})
          </button>
        </div>
    </div>
    `
    commentsContainer.append(commentElement);
   }
}

async function loadComments(element){
    const commentId=element.getAttribute("data-comment-id")
  console.log(commentId);
    let endPoint=`https://www.googleapis.com/youtube/v3/comments?part=snippet&parentId=${commentId}&key=${apiKey}`
    try{
        const response=await fetch(endPoint);
        const result=await response.json();
       const parentNode=element.parentNode.parentNode;
       let commentsList=result.items;
       for(let i=0;i<commentsList.length;i++){
        let replyComment=commentsList[i];
        let commentNode=document.createElement("div");
        commentNode.className = "comment comment-reply";

        commentNode.innerHTML = `
                    <img src="${replyComment.snippet.authorProfileImageUrl}" alt="">
                    <div class="comment-right-half">
                        <b>${replyComment.snippet.authorDisplayName}</b>
                        <p>${replyComment.snippet.textOriginal}</p>
                        <div class="options">
                            <div class="like">
                                <span class="material-icons">thumb_up</span>
                                <span>${replyComment.snippet.likeCount}</span>
                            </div>
                            <div class="like">
                                <span class="material-icons">thumb_down</span>
                            </div>
                        </div>
                `;

            parentNode.append(commentNode);
       }
    }
    catch(error){

    }
}
