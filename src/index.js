document.getElementById('postButton').addEventListener('click', validateComment);
document.getElementById('showMoreCommentsButton').addEventListener('click', showMoreComments);
window.onload =  fetchGetComments;
let nameValueFromInput='';
let commentTextValueFromInput='';
let commentsDownloaded='';
let commentId=0;
let currentPage=1;
let lastCommentId='';
let comments_wrapper=document.getElementById('comments_wrapper');

function validateComment(){
    clearErrorInstance();
    if(document.getElementById('authorName').value===''){
        throwErrorInstance('authorName');
        }
    if(document.getElementById('commentTextarea').value===''){
        throwErrorInstance('commentTextarea');
        }
    else{
     postComment();   
    }
}

function clearErrorInstance(){
    document.getElementById('authorName').style.borderColor = '';
    document.getElementById('commentTextarea').style.borderColor = '';
    document.getElementById('error_message_authorName').style.display = 'none';
    document.getElementById('error_message_commentTextarea').style.display = 'none';
    document.getElementById('alert_successfully_posted').style.display = 'none';
}

function throwErrorInstance(arg){
    document.getElementById(arg).style.borderColor = 'red';
    document.getElementById('error_message_'+arg).style.display = 'block';
}

function postComment(){
    nameValueFromInput = document.getElementById('authorName').value;
    commentTextValueFromInput = document.getElementById('commentTextarea').value;    
    currentPage=commentsDownloaded.last_page;
    document.getElementById('comments_wrapper').innerHTML='';
    fetchGetComments();
    setTimeout(function wait() {
        if(commentsDownloaded.last_page===commentsDownloaded.last_page){
            let key=Object.keys(commentsDownloaded.data)[Object.keys(commentsDownloaded.data).length-1];
            lastCommentId=commentsDownloaded.data[key].id;
            fetchPostComments();
            document.getElementById('alert_successfully_posted').style.display = 'block';
        }           
    }, 1000);
}


function fetchGetComments(){
    document.getElementById('spinner').style.display= 'block';
fetch('https://jordan.ashton.fashion/api/goods/30/comments?page='+currentPage++)
  .then(response => response.json())
  .then(function(response) {
    commentsDownloaded = response;
    setTimeout(function wait() {
        if(commentsDownloaded === response){
        document.getElementById('spinner').style.display= 'none';
        downloadedCommentsHandler();
        }           
    }, 1000);
});
}

function fetchPostComments(){
    fetch('https://jordan.ashton.fashion/api/goods/30/comments', {
        method: "POST",
        
        body: JSON.stringify({
            data:{
                created_at:Date.now().toISOString,
                id: lastCommentId++,
                name: nameValueFromInput,
                product_id:30,
                text: commentTextValueFromInput,
                updated_at:Date.now().toISOString,
                visible:0 
            },
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }),
    })
    .then(response => response.json())
    .then(json => console.log(json));
}

function downloadedCommentsHandler(){
    document.getElementById('responses_quantity').innerHTML = commentsDownloaded.total + ' Responses';
    currentPage = commentsDownloaded.current_page;    
    document.getElementById('navLastPage').innerHTML=commentsDownloaded.last_page;
    commentsDownloaded.data.forEach(function(item){
        commentId = item.id;
        let createdTime = calculateDays(item.created_at);
        let username = item.name;
        let comment = item.text;
        buildCommentsDOM(createdTime,username,comment);
      });
}

function calculateDays(aDate){
    var d1 = new Date(aDate);
    var d2 = Date.now();
    return Math.round((d2-d1)/(1000*3600*24));
}

function buildCommentsDOM(createdTime,username,comment){
    let commentContainerDIV = document.createElement('div');
    commentContainerDIV.setAttribute('id','commentContainerDIV_'+commentId);    
    commentContainerDIV.setAttribute('class','commentContainerDIV');
    comments_wrapper.append(commentContainerDIV);

        let commenterAvatarDownloaded = document.createElement('img');
        commenterAvatarDownloaded.setAttribute('id','commenterAvatarDownloaded_'+commentId);
        commenterAvatarDownloaded.setAttribute('class','commenterAvatarDownloaded');
        commenterAvatarDownloaded.setAttribute('src','img/avatar.png');        
        commentContainerDIV.append(commenterAvatarDownloaded);

        let commentTextPartContainerDIV = document.createElement('div');
        commentTextPartContainerDIV.setAttribute('id','commentTextPartContainerDIV_'+commentId);    
        commentTextPartContainerDIV.setAttribute('class','commentTextPartContainerDIV');
        commentContainerDIV.append(commentTextPartContainerDIV);

            let commenterNameDownloaded = document.createElement('p');
            commenterNameDownloaded.setAttribute('id','commenterNameDownloaded_'+commentId);
            commenterNameDownloaded.setAttribute('class','commenterNameDownloaded');
            commenterNameDownloaded.innerHTML=username;
            commentTextPartContainerDIV.append(commenterNameDownloaded);

            let daysFromCreationDownloaded = document.createElement('p');
            daysFromCreationDownloaded.setAttribute('id','daysFromCreationDownloaded_'+commentId);
            daysFromCreationDownloaded.setAttribute('class','daysFromCreationDownloaded');
            daysFromCreationDownloaded.innerHTML='('+createdTime+' Days ago)';
            commentTextPartContainerDIV.append(daysFromCreationDownloaded);

            let commentDownloaded = document.createElement('p');
            commentDownloaded.setAttribute('id','commentDownloaded_'+commentId);
            commentDownloaded.setAttribute('class','commentDownloaded');
            commentDownloaded.innerHTML=comment;
            commentTextPartContainerDIV.append(commentDownloaded);

    let afterCommentHR = document.createElement('hr'); 
    afterCommentHR.setAttribute('class','afterCommentHR');
    comments_wrapper.append(afterCommentHR);

    if(commentsDownloaded.current_page!==commentsDownloaded.last_page){
        document.getElementById('showMoreCommentsButton').style.display='block';
    }
    else{
        document.getElementById('showMoreCommentsButton').style.display='none';
    }
}

function showMoreComments(){
    currentPage++;
    fetchGetComments();
}

function changeCommentsPage(linkId){
    let desiredPageNumber = '';
    if(linkId.indexOf('navGo') >= 0){
        desiredPageNumber = document.getElementById(linkId).innerHTML;
    }
    if(linkId === 'navPrevPage'){
        desiredPageNumber = currentPage-1;
    }
    if(linkId === 'navNextPage'){
        desiredPageNumber = currentPage+1;
    }    
    if(linkId === 'navLastPage'){
        desiredPageNumber = commentsDownloaded.last_page;
    }

    if(desiredPageNumber>0 && desiredPageNumber < commentsDownloaded.last_page+1){
        if(desiredPageNumber<3){
            document.getElementById('navGoFirstPage').style.display = 'none';
            document.getElementById('navGo1').innerHTML = 1;
            document.getElementById('navGo2').innerHTML = 2;
            document.getElementById('navGo3').innerHTML = 3;
            document.getElementById('navGo4').innerHTML = 4;
            document.getElementById('navGo5').innerHTML = 5;           
        }
        if(desiredPageNumber>3 && desiredPageNumber < commentsDownloaded.last_page-3){
            document.getElementById('navGo1').innerHTML = desiredPageNumber-2;
            document.getElementById('navGo2').innerHTML = desiredPageNumber-1;
            document.getElementById('navGo3').innerHTML = desiredPageNumber;
            document.getElementById('navGo4').innerHTML = Number(desiredPageNumber)+1;
            document.getElementById('navGo5').innerHTML = Number(desiredPageNumber)+2;           
        }
        if(desiredPageNumber >= commentsDownloaded.last_page-3){
            document.getElementById('navGo1').innerHTML = commentsDownloaded.last_page-5;
            document.getElementById('navGo2').innerHTML = commentsDownloaded.last_page-4;
            document.getElementById('navGo3').innerHTML = commentsDownloaded.last_page-3;
            document.getElementById('navGo4').innerHTML = commentsDownloaded.last_page-2;
            document.getElementById('navGo5').innerHTML = commentsDownloaded.last_page-1;           
        }

        if(desiredPageNumber > 5){
            document.getElementById('navGoFirstPage').style.display = 'block';
        }

        if(desiredPageNumber < commentsDownloaded.last_page-5){
            document.getElementById('navLastPage').style.display = 'block';
        }

        currentPage = desiredPageNumber;
        document.getElementById('comments_wrapper').innerHTML='';
        fetchGetComments();
    }
}
