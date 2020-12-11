/**
 *
 * 地图画线
 *
 * 20个色标
 */

  const linecolors = [
     'rgb(95,157,241)',
     'rgb(237,78,119)',
     'rgb(255,90,40)',
     'rgb(10,190,170)',
     'rgb(200,240,100)',

     'rgb(240,150,110)',
     'rgb(240,110,110)',
     'rgb(240,150,240)',
     'rgb(190,120,240)',
     'rgb(110,230,230)',

     'rgb(120,230,110)',
     'rgb(160,110,230)',
     'rgb(150,150,150)',
     'rgb(80,80,80)',
     'rgb(180,130,60)',

     'rgb(70,190,210)',
     'rgb(130,210,240)',
     'rgb(240,240,100)',
     'rgb(230,180,210)',
     'rgb(120,150,240)',
 ];

 function colorRGB2Hex(color) {
    var rgb = color.split(',');
    var r = parseInt(rgb[0].split('(')[1]);
    var g = parseInt(rgb[1]);
    var b = parseInt(rgb[2].split(')')[0]);

    var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return hex;
 }

 /**
  * index 1 ~ 20
  */
 export default (index)=>{
     return colorRGB2Hex(linecolors[index -1])
 }
