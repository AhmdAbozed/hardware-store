
/*
To upload or download from BB:
    1. get unique BB api url, using BB account key and keyID
    2. send request to the unique BB api url to get upload/download URL
    3. send request to the upload/download URL, with the approperiate headers.

The upload/download requests are done at products.ts file
*/

import https from 'https'

const geturl = function(options:any){
    
    return new Promise((resolve,reject)=>{
        
        let urls:any;
        
        const getBlaze = https.request(options,(res)=>{
           
            res.on('data', (chunk)=>{
               urls = JSON.parse(chunk);   
            })

            res.on('end', () => {resolve(urls);}); 
        })
       
        getBlaze.on('error', (err) => {
            reject(err);
          });
          
        getBlaze.end()
        
    })
}

const getUploadUrl = function(options:object){

    return new Promise((resolve,reject)=>{
        console.log("INSIDE UPLOAD URL")

        console.log(options)
        let urls:any;
        const getBlaze = https.request(options,(res)=>{
            
            console.log("about to get blaze urls")
            res.on('data', (chunk)=>{
                
               urls = JSON.parse(chunk);
               
            })
            res.on('end', () => {resolve(urls);});
       
            
        })
        getBlaze.on('error', (err) => {
            reject(err);
          });
        getBlaze.write(JSON.stringify({bucketId:"5e6b2b10be5cffb88f260a18"}))  
        getBlaze.end()
        
    })
}
const blazeApi = async function(keyId:string, key:string): Promise<any>{
    const encodedkey = btoa(keyId+":"+key)

    const options = {
        hostname: 'api.backblazeb2.com',
        path: '/b2api/v2/b2_authorize_account',
        method: 'GET',
        headers: {
            Authorization: `Basic ${encodedkey}`
        }
    }
    
    

    const blazeUrls:any = await geturl(options)
    
    console.log("post blaze Url")

    options.hostname = blazeUrls.apiUrl.substr(8)
    options.path = '/b2api/v2/b2_get_upload_url'
    options.method = 'POST'
    options.headers = {Authorization: blazeUrls.authorizationToken}
     
    const blazeUploadUrl:any = await getUploadUrl(options)
    console.log("post blaze Upload Url")

    return blazeUploadUrl;
}

export default blazeApi;