const searchInput=document.getElementById("search-input")
const apiKey="AIzaSyD-CIMgO2TAQLEHTNhyga6InBsH3puL8X8"
localStorage.setItem("api_Key",apiKey)
const container=document.getElementById("container")

// https://youtube.googleapis.com/youtube/v3/search?part=snippet,statistics&maxResults=1&q=mycodeschool&key=AIzaSyD-CIMgO2TAQLEHTNhyga6InBsH3puL8X8

function searchVideos(){
    let searchValue=searchInput.value;
    fetchVideos(searchValue);
}


async function fetchVideos(searchValue){
    let endPoint=`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=16&q=${searchValue}&key=${apiKey}`;
     try{
        let response=await fetch (endPoint);
        let result=await response.json();
        for(let i=0;i<result.items.length;i++){
            let video=result.items[i];
            let videoStats=await fetchStats(video.id.videoId)
           if(videoStats.items.length>0){
            result.items[i].videoStats=videoStats.items[0].statistics;
            result.items[i].duration=videoStats.items[0].content
            result.items[i].duration=videoStats.items[0].contentDetails.duration;
           }
        }
        showThumbnails(result.items)
       
     }
     catch{
        alert("something went wrong")
     }

}  
function getViews(n){
if(n<1000){
    return n;
}
else if(n>=1000 && n<=999999){
    n/=1000;
    n=parseInt(n)
    return n+"K";
}
return parseInt(n/1000000)+"M";
}


function showThumbnails(items){
    for(let i=0;i<items.length;i++){
     let videoItem=items[i];
     let imageUrl=videoItem.snippet.thumbnails.high.url;
     let videoElement=document.createElement("div");
     videoElement.addEventListener("click",()=>{
        navigateToVideo(videoItem.id.videoId)
     })
     const videoChildren=`
     <img src="${imageUrl}"/>
     <b>${formattedData(videoItem.duration)}</b>
     <p class="title">${videoItem.snippet.title}</p>
     <p class="channel-name">${videoItem.snippet.channelTitle}</p>
     <p class="views-count">${videoItem.videoStats ? getViews(videoItem.videoStats.viewCount) + "  Views": "NA"}</p>
     `
     videoElement.innerHTML=videoChildren;
     container.append(videoElement);

    }
}
async function fetchStats(videoId){
    const endpoint = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&part=statistics,contentDetails&id=${videoId}`;
    let response=await fetch(endpoint);
    let result=await response.json();
    return result;
}

function formattedData(duration) {
    if(!duration) return "NA" ;
    // PT2H33M23S
    let hrs = duration.slice(2, 4);
    let mins = duration.slice(5, 7);
    let seconds ;
    if(duration.length > 8){
        seconds = duration.slice(8, 10);
    }
    let str = `${hrs}:${mins}`;
    seconds && (str += `:${seconds}`)
    return str ;
}
function navigateToVideo(videoId){
    //function to redirect to new webPage...
    let path=`/youtube-clone/video.html`
    if(videoId){
        // window.location.href="http://127.0.0.1:5500/youtube-clone/video.html"
        document.cookie=`video_Id=${videoId};path=${path}`
        let linkItem=document.createElement("a");
        linkItem.href="http://127.0.0.1:5500/youtube-clone/video.html"
        linkItem.target="_blank";
        linkItem.click();
    }else{
        alert("go and watch in youtube")
    }
}