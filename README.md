# The directory structure of tianji front-end
===
## The directory like bellow: 
──tianji-frontend/
   ├─compress/
   ├─dist/
   ├─gallery/
   ├─modules/
   │  ├─public/
   │  ├─msPick/
   │  │  ├─css/
   │  │  ├─images/
   │  │  ├─src/
   │  │  ├─checkBox.html
   │  │  ├─checkBoxNo.html
   │  │  ├─radio.html
   │  │  └─radioNo.html
   │  └─test1/
   │
   └─node_modules/
       ├─grunt/
       ├─grunt-cmd-concat/
       ├─grunt-cmd-transport/
       ├─grunt-contrib-clean/
       ├─grunt-contrib-compress/
       └─grunt-contrib-uglify/

## Instructions
    * "compress" contains .zip&.tar files with their version.
    * "dist" is a local dir and created automatic,contains files be concated and uglified.
    * "gallery" folder will be containing seajs and other libary like jquery etc.
    * "modules" will be containing the independent module of ourselfs,like msPickPlugin developed by zhiwei;and it will be contains their css/images/pages/source.
      ** "public" contains public plugins and sources.
      ** "msPick"&"test1" is demo modules.
    * node_modules contains plugins of grunt.