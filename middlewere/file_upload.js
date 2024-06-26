const fs =require('fs')


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  function generateVerificationCode() {
    const length = 6; // Length of the verification code
    const characters = '0123456789'; // Characters to include in the code
    let code = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }
  
    return code;
  }


var  upload_image=(req)=>{
  var send_image_link=""
  if(req.files && req.files.image){
    var file=req.files.image
    var name_file=Date.now()+getRandomInt(12312321)+"local_image"
    var file_tit=file.name.slice(file.name.lastIndexOf('.'))
    file.mv(`${__dirname}/../uploads/${name_file+file_tit}`)
    send_image_link=req.protocol+"://"+req.hostname+"/"+name_file+file_tit
    }else{
      console.log(send_image_link);
     send_image_link=req.body.image
    }
  return send_image_link
  }

var delete_image=(file_name)=>{ 
  if(file_name){
   var file_tit=file_name.slice(file_name.lastIndexOf('/')+1)
console.log(file_name,file_tit);
if(file_tit.includes("local_image")){
 fs.unlink(`${__dirname}/../uploads/${file_tit}`,()=>{})   
} 
  }

}

var put_image=(file_name,req)=>{
  if(file_name){
     var file_tit=file_name.slice(file_name.lastIndexOf('/'))
  }else{
    var file_tit="qw"
  }
 

if(file_tit.includes("local_image")){
 fs.unlink(`${__dirname}/../uploads/${file_tit}`,()=>{}) }
  var send_image_link=""
  if(req.files && req.files.image){
    var file=req.files.image
    var name_file=Date.now()+getRandomInt(12312321)+"local_image"
    var file_tit=file.name.slice(file.name.lastIndexOf('.'))
    file.mv(`${__dirname}/../uploads/${name_file+file_tit}`)
    send_image_link=req.protocol+"://"+req.hostname+"/"+name_file+file_tit
    }else{
      if(req.body.image){
        send_image_link=req.body.image
      }else{
        send_image_link="no image"
      }
     
    }
  return send_image_link

}


module.exports={upload_image,delete_image,put_image,generateVerificationCode}