/*
--Note--:for anyone who likes to use this code please use your own apikey because I'am using the free one and it limited to 50 requests per hour
*/
const imageContainer=document.getElementById('image-container');
const loader=document.getElementById('loader');
const lightBox=document.getElementById('lightBox');
const next=document.getElementById('next');
const previous=document.getElementById('previous');
const lightboxImage=document.getElementById('lightboxImage');
const closeButton=document.getElementById('close');
let photosArray=[];
let allPhotos=[];
let ready=false;
let imagesLoaded=0;
let totalImages=0;
let count=5;
let currentImage=0;

closeButton.addEventListener('click',()=>{
    lightBox.hidden=true;
})
const changeLightBoxImage=direction=>{
    switch(direction){
        case 'next':
            if(currentImage<allPhotos.length-1){currentImage++};
            break;
        default:
            if(currentImage>0){currentImage--};
    }
    setAttributes(lightboxImage,{
        src:allPhotos[currentImage].urls.regular,
        alt:allPhotos[currentImage].alt_description,
        title:allPhotos[currentImage].alt_description
    });
}
next.addEventListener('click',changeLightBoxImage.bind(this,"next"));
previous.addEventListener('click',changeLightBoxImage);
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
const openLightBox=imageNumber=>{
    currentImage=imageNumber;
    setAttributes(lightboxImage,{
        src:allPhotos[imageNumber].urls.regular,
        alt:allPhotos[imageNumber].alt_description,
        title:allPhotos[imageNumber].alt_description
    });
    lightBox.hidden=false;
}
const displayPhotos=()=>{
    let indexIncrement=allPhotos.length-count; 
    imagesLoaded=0;
    totalImages=photosArray.length;
    photosArray.forEach((photo,index)=>{
        const item=document.createElement('a');
        const img=document.createElement('img');
        /* to enable anchor link */
        // setAttributes(item,{
        //     'href':photo.links.html,
        //     'target':'_blank'
        // });
        setAttributes(img,{
            src:photo.urls.regular,
            alt:photo.alt_description,
            title:photo.alt_description
        });
        img.addEventListener('load',imageLoaded);
        img.addEventListener('click',openLightBox.bind(this,index+indexIncrement));
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
                allPhotos=allPhotos.concat(data);
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
