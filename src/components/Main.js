
import React, { useState, useRef, useEffect } from 'react';
import { Container, Card, CardContent, makeStyles, Grid, TextField, Button } from '@material-ui/core';
import QRCode from 'qrcode';
import Web3 from 'web3'
import ScureScan from '../abis/SecureScan.json'
import QrReader from 'react-qr-reader';
import SHA256 from 'crypto-js/sha256'
import {BounceLoader , BarLoader ,} from 'react-spinners'
function Main() {
  const [t,sett] = useState(false);

let isture1 ;
  const [isloding, setisloding] = useState(true)
  const [scan1, setscan1] = useState()
  const [account, setaccount] = useState()
  /** @param Blockchain Connections */

  useEffect(() => {
    loadWeb3();
    loadBlockchain();

  }, []);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }

  }
  let scan;

  const loadBlockchain = async () => {
    const web3 = window.web3;
    //Load account 
    const accounts = await web3.eth.getAccounts();

    setaccount(accounts[0]);
    // Network ID
    const networkId = await web3.eth.net.getId()
    const networkData = ScureScan.networks[networkId]
    if (networkData) {
      scan = new web3.eth.Contract(ScureScan.abi, networkData.address)
      setscan1(scan)
      setisloding(false)
      console.log("successfully get contreact")

    }

  }
  /**End of BlockChain connections */


  //this will use for text that we enter inside of the textarea
 const [text2, setText2] = useState(false);
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [productname, setproductname] = useState('');
  const [serialnumber, setserialnumber] = useState('');
  //this willuse for image url of qr code that we will show to over webapp and also to over products
  const [imageUrl, setImageUrl] = useState('');
  // this is used for demo how does its work you can create your own data and upload it to blockchain and scan it to see how does its works

  const [scanResultFile, setScanResultFile] = useState('');
  //this is used for scan qr code with cammera
  const [scanResultWebCam, setScanResultWebCam] = useState('');
  const [isProduct, setisProduct] = useState()
  const classes = useStyles();
  const qrRef = useRef(null);

  const generatSHA256hase = async () => {
    let date = new Date().toLocaleString()

    let rendom = Math.floor(Math.random() * (1000000000 - 1) + 1)

    return SHA256(text + productname + serialnumber + rendom.toString() + date.toString()).toString();

  }

  /**@dev generateWrCode is used  to Genrate Qrcode with the help of QR Code module */
  const generateQrCode = async () => {

    try {
//here are we are generatingSHA256hase from the product data
/**
 * such as product name produte id current data and time and someother uniqe things
 * */
      const productHase = await generatSHA256hase()
      console.log({ from: account })
      // here we are calling the function form the over smart contract  that will store the sha256 to blockchian 
      /**
       * intitionlay it would be true means this  is a real product and make the id = 0;as well
       * */
      await scan1.methods.storeData(productHase).send({ from: account })
      /**
       * here we are creating qr code with the help of the qr code genrator we used @param  productHase 
       * */
      const response = await QRCode.toDataURL(productHase);
      /**
       * response will hase a url of the qr code that we will use  on over product box
       * 
       * 
       * */
      setImageUrl(response);
      console.log("add to blockchain")


           setproductname('')
     setText('')
     setserialnumber('')

    }



    catch (error) {
      /**
       * if there is any error the it will consosle log intot he browser*/
      console.log(error);
    }
  }

//this is how we handle for error while scaning the qr code  if there is any error then we will show into the console
  const handleErrorFile = (error) => {
    console.log(error);
  }
  console.log(isProduct)

  //this function is used to scan the file and the result will come into the result that we set to the setscanresult
  const handleScanFile = async (result) => {
  
  //if the qr code return the result  then we will procede
    if (result) {
      // here we are calling the @param identifier that will identify it is the true or not  means that 
      //product is real or not if product is real it will return true else return false 

            isture1 = await scan1.methods.identifier(result).call()
             console.log(isture1)
            sett(isture1.istrue)
            
           
      //this method will change the product hase to false means it has become false means this product is sold or not real 
   if(isture1.istrue){
       await scan1.methods.indentifayProduct(result).send({ from: account });
     }

      setScanResultFile(result);
      

      
      setImageUrl('')
setText2(true)
console.log(text)
      console.log("add to blockchain")

    }
  }

  const onScanFile = (e) => {
    // this will open file manger dialog where you can select the qr code for sacning 
    qrRef.current.openImageDialog();
    // console.log(qrRef.current.openImageDialog)
  }

// this will use for handing the Error while scaning qr code form the web cam
  const handleErrorWebCam = (error) => {
    console.log(error);
  }

  const handleScanWebCam = async (result) => {
   
    if (result) {
      isture1 = await scan1.methods.identifier(result).call()
     if(isture1.istrue){
       await scan1.methods.indentifayProduct(result).send({ from: account });
     }

      setScanResultWebCam(result);
      setImageUrl('')
     setText2(true)
    } 
  }

   return (
    <div>

      {
        isloding ? <div id="loader" className="text-center mt-5"><p>Loding...</p></div> :
          <Container className={ classes.conatiner  }>
            <Card>

{
  text2 ?  <h2 className={ `  ${t? classes.title : classes.title3}  ` }>
{
  t? <p>product is Cheaked Status : Real </p>: <p>product is Cheaked Status : Fake </p>

}
             </h2> : <h2 className = {classes.title} > Scan QR code</h2>
}

             
 <h1 className={classes.p} >How you can  use this  </h1>

  <p className={classes.p}  ><strong> [ Enter Detiles] --- > [Click to Generate] ---> [Click to Image ] --> [Click to Scan qr code] 

----> [Select Qr Code Pic ] --> [open] -->you will get result
</strong></p>
 

             
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
                  <h5>Generate QR Code and try How dose it works</h5>
                    <TextField label="Enter Text Here" onChange={(e) => setText(e.target.value)} />
                    <TextField label="Enter Proudct name" onChange={(e) => setproductname(e.target.value)} />
                    <TextField label="Enter Serial Number" onChange={(e) => setserialnumber(e.target.value)} />

                    <Button className={classes.btn} variant="contained"
                      color="primary" onClick={generateQrCode}>Generate</Button>
                    <br />
                    <br />
                    <br />


                    {imageUrl ? (

                      <a href={imageUrl} download>
                        <img src={imageUrl} alt="img" />
                      </a>) : null}
                      {imageUrl?
                       <p>Click on Image</p> :""
                      }
                  </Grid>
                  <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
                    <Button className={classes.btn} variant="contained" color="secondary" onClick={onScanFile}>Scan Qr Code</Button>
                    <QrReader
                      ref={qrRef}
                      delay={300}
                      style={{ width: '100%' }}
                      onError={handleErrorFile}
                      onScan={handleScanFile}
                      legacyMode
                    />
                   
                  </Grid>
                  <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
                    <h3>Qr Code Scan by Web Cam</h3>
                    <QrReader
                      delay={300}
                      style={{ width: '100%' }}
                      onError={handleErrorWebCam}
                      onScan={handleScanWebCam}
                    />
                  
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

 <h1 className={classes.p} >How Does  this Application works</h1>

<p  className={classes.p} > this is a <strong>Blockchian</strong> Based Application that used  <strong>Ethereum blockchain</strong>
 , <strong> solidity smart contract </strong>  to work with ethereum, <strong> web3 js </strong> for connection front end to blockchain 
<strong>Qr code js </strong> for generateing Qr code of the product and <strong>Qr Readr js </strong> for reading Qr code of the product with that
it also uses <strong> SHA256  hase </strong> function  from the  crypto-js for generateing product hash  we can uses product detiles for generateing product hash
for simplcity perpuse we uses product name , serial number and text , current data and time and a rendom number between 1 to 1000000000 that make it
more sqcure hase 
<br/>
<h1 className={classes.p} >lets talk how does it works and why we need this </h1>

NOw a days everything is running on internet like shoping is one of the most thing that people do form thire comfort 
but there are some problem with that some time we order something and we get something else or get a fake product 
that is not good for us so this aap help us to find out if the product is real or not 
 this uses product detiles for generateing product hase and store it on the blockchain while creating product and after that it Generate a qr code  of that

that hase that qr code we can use to identife that product is real or not it Cheaked only once means you can not use it multiple time for multiple product
 once  you sacn it  you can not scan it again if you try so it show you that your product is fake  means we can not use it multiple time on multiple product
 for a product we only have a diffrent hase that store on the blockchain and we can only read it once .
<br/><br/>
  how does it works 

<br/><br/><br/>
<strong> [ Proudct detiles ] -----Generate Hash SHA256---> [Generate Qr code ] ----Store on Blockchain---> [ hash --> ture  ]--Scan Qr Code with Qr reader--> [get code Hash] 

 ----checked the hash into the blockchain---> [retrun true based on product else false] ---> acrroding that we show result on front end  </strong>




 </p>

          </Container>
      }

    </div>
  )
}
const useStyles = makeStyles((theme) => ({
  conatiner: {
    marginTop: 10
  },
  title: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#3f51b5',
    color: '#fff',
    padding: 20
  },
    title2: {
    
    background: 'green',
  
  },
   title3: {
     display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    padding: 20,
    background: 'red',
  },
   it: {
    
    background: 'red',
  
  },
  btn: {
    marginTop: 10,
    marginBottom: 20
  }
  ,
  p:{
    padding:10,
    margin:10,
  }
}));
export default Main
