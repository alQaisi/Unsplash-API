/*
--Note--:for anyone who likes to use this code please use your own apikey because I'am using the free one and it limited to 50 requests per hour
*/


const imageContainer=document.getElementById('image-container');
const loader=document.getElementById('loader');
let photosArray=[];
let ready=false;
let imagesLoaded=0;
let totalImages=0;
let count=5;

const setAttributes=(element,attributes)=>{
    for(const attribute in attributes){
        element.setAttribute(attribute,attributes[attribute]);
    }
}
const imageLoaded=()=>{
    imagesLoaded++;
    if(imagesLoaded===totalImages ){
        count=15;
        loader.hidden=true;
        ready=true;
    }
}

const displayPhotos=()=>{
    imagesLoaded=0;
    totalImages=photosArray.length;
    photosArray.forEach(photo=>{
        const item=document.createElement('a');
        const img=document.createElement('img');
        setAttributes(item,{
            'href':photo.links.html,
            'target':'_blank'
        });
        setAttributes(img,{
            src:photo.urls.regular,
            alt:photo.alt_description,
            title:photo.alt_description
        });
        img.addEventListener('load',imageLoaded);
        item.appendChild(img);
        imageContainer.appendChild(item);
    })
}

const fetchPhotos=async ()=>{
    /*
    Important Note:
        the unsplash api key must be hidden so I build a server and I put the unsplash API into it,and by this I can get the response and in sametime have my api key safe
    */
    fetch('https://hidden-citadel-03585.herokuapp.com/fetchImages',{
          method:'post',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({
              count:count})
          }).then(response=>response.json())
            .then(data=>{
                photosArray=data;
                displayPhotos();
            });
    // try{
    //     const response=await fetch(apiUrl);
    //     photosArray=await response.json();
    //     displayPhotos();
    // }catch(err){
        
    // }
}

window.addEventListener('scroll',()=>{
    if(window.innerHeight+window.scrollY>=document.body.offsetHeight-1000 && ready===true){
        ready=false;
        fetchPhotos();
    }
})
fetchPhotos();
