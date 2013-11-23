// QRCODE reader Copyright 2011 Lazar Laszlo
// http://www.webqr.com

var gCtx = null;
var gCanvas = null;
var imageData = null;
var c=0;
var stype=0;
var gUM=false;
var webkit=false;
var moz=false;
var v=null;

var camhtml='  	<object  id="iembedflash" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,0,0" width="320" height="240"> '+
  		'<param name="movie" value="camcanvas.swf" />'+
  		'<param name="quality" value="high" />'+
		'<param name="allowScriptAccess" value="always" />'+
  		'<embed  allowScriptAccess="always"  id="embedflash" src="camcanvas.swf" quality="high" width="320" height="240" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" mayscript="true"  />'+
    '</object>';

var vidhtml = '<video id="v" autoplay></video>';



function initCanvas(ww,hh)
{
    gCanvas = document.getElementById("qr-canvas");
    var w = ww;
    var h = hh;
    gCanvas.style.width = w + "px";
    gCanvas.style.height = h + "px";
    gCanvas.width = w;
    gCanvas.height = h;
    gCtx = gCanvas.getContext("2d");
    gCtx.clearRect(0, 0, w, h);
    imageData = gCtx.getImageData( 0,0,320,240);
}

function passLine(stringPixels) { 

    var coll = stringPixels.split("-");

    for(var i=0;i<320;i++) { 
        var intVal = parseInt(coll[i]);
        r = (intVal >> 16) & 0xff;
        g = (intVal >> 8) & 0xff;
        b = (intVal ) & 0xff;
        imageData.data[c+0]=r;
        imageData.data[c+1]=g;
        imageData.data[c+2]=b;
        imageData.data[c+3]=255;
        c+=4;
    } 

    if(c>=320*240*4) { 
        c=0;
        gCtx.putImageData(imageData, 0,0);
        try{
            qrcode.decode();
        }
        catch(e){       
            console.log(e);
            setTimeout(captureToCanvas, 500);
        };
    } 
} 

function captureToCanvas() {
    if (tmrCapture)
        clearTimeout(tmrCapture);

    if(stype!=1)
        return;
    if(gUM)
    {
        try{
            gCtx.drawImage(v,0,0);
            try{
                qrcode.decode();
            }
            catch(e){       
                console.log(e);
                tmrCapture = setTimeout(captureToCanvas, 500);
            };
        }
        catch(e){       
                console.log(e);
                tmrCapture = setTimeout(captureToCanvas, 500);
        };
    }
    else
    {
        flash = document.getElementById("embedflash");
        try{
            flash.ccCapture();
        }
        catch(e)
        {
            console.log(e);
            tmrCapture = setTimeout(captureToCanvas, 1000);
        }
    }
}




function isCanvasSupported(){
  var elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
}


function success(stream) {
    v = document.getElementById("v");

    if(webkit)
        v.src = window.webkitURL.createObjectURL(stream);
    else
    if(moz)
    {
        v.mozSrcObject = stream;
        v.play();
    }
    else
        v.src = stream;
    gUM=true;
    setTimeout(captureToCanvas, 500);
}
		
function error(error) {
    gUM=false;
    return;
}


function setwebcam()
{
    if(stype==1)
    {
        setTimeout(captureToCanvas, 500);    
        return;
    }
    
    
    var n=navigator;
    //var getUserMedia = n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia;
    //if (getUserMedia) {
    //    getUserMedia({video: true, audio: false}, success, error);
    //}

    if(n.getUserMedia)
    {
        n.getUserMedia({video: true, audio: false}, success, error);
    }
    else
    if(n.webkitGetUserMedia)
    {
        webkit=true;
        n.webkitGetUserMedia({video: true, audio: false}, success, error);
    }
    else
    if(n.mozGetUserMedia)
    {
        moz=true;
        n.mozGetUserMedia({video: true, audio: false}, success, error);
    }
    else
        document.getElementById("outdiv").innerHTML = camhtml;
    
    //document.getElementById("qrimg").src="qrimg2.png";
    //document.getElementById("webcamimg").src="webcam.png";
    stype=1;
    setTimeout(captureToCanvas, 500);
}

