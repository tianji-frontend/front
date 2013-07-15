module.exports = function(grunt) {
    var pkg = grunt.file.readJSON('package.json');
    var mapStr = "/*dynamic generate js content for mapping version at  "+ grunt.template.today("yyyy-mm-dd hh:MM:ss") +" */\n" 
                 + "var map = {\n"
                     //you can copy the line below ,and replace industry.min with your fileName
                     //+ "\n'industry.min': '?v=" + pkg.version+"'," 
                 + "\n};";

    //生成文件
    var jsonFun = grunt.file.read('modules/msPick/js/functionData.js');
    jsonFun = '[' + jsonFun.replace(/(var jobData = )|(\s+)/g,'').substring(0,jsonFun.length-1) + ']';
    //var jsonCity = grunt.file.read('modules/msPick/js/cityData.js');
    //jsonCity = '[' + jsonCity.replace(/(var cityData=)|(\s+)|(for(.)+})/g,'').substring(0,jsonCity.length-1) + ']';
    grunt.file.write( '.build/mapVersion.js', mapStr);
    grunt.file.write( '.build/functionData.json', jsonFun);
    //grunt.file.write( '.build/cityData.json', jsonCity);
    //map
    grunt.config.init({
        //拷贝
        copy :{
            msPick:{
                files :[{
                    expand: true,
                    cwd: 'modules/msPick/',
                    src: ['**/*.*'],
                    dest: 'dist/msPick/',
                    filter: 'isFile'
                }]
            },
            timeYM:{
                files :[{
                    expand: true,
                    cwd: 'modules/timeYMPlugin/',
                    src: ['**/*.*'],
                    dest: 'dist/timeYMPlugin/',
                    filter: 'isFile'
                }]
            },
            header:{
                files :[{
                    expand: true,
                    cwd: 'modules/public/header/',
                    src: ['**/*.*'],
                    dest: 'dist/header/',
                    filter: 'isFile'
                }]
            },
            common:{
                files :[{
                    expand: true,
                    cwd: 'modules/public/js/',
                    src: ['**/*.*'],
                    dest: 'dist/common/',
                    filter: 'isFile'
                }]
            },
            styles:{
                files: [{
                    expand: true,
                    cwd: 'styles/',
                    src: ['*.css'],
                    dest: 'dist/styles/',
                    filter: 'isFile'
                }]    
            },
            createdFiles: {
                files: [{
                    expand: true,
                    cwd: '.build/',
                    src: ['*.*'],
                    dest: 'dist/common/',
                    filter: 'isFile'
                }]
            }
        },
        //文件合并
        concat : {
            options: {
                separator: ';'
            },
            job : {
                src : ['modules/msPick/js/functionData.js', 'modules/msPick/js/msFunctionPlugin.js'],
                dest: 'dist/msPick/js/function.min.js'
            },
            city : {
                src : ['modules/msPick/js/cityData.js', 'modules/msPick/js/msCityPlugin.js'],
                dest: 'dist/msPick/js/city.min.js'
            },
            industry : {
                src : ['modules/msPick/js/industryData.js', 'modules/msPick/js/msIndustryPlugin.js'],
                dest: 'dist/msPick/js/industry.min.js'
            },
            jsInit : {
                src : ['dist/common/mapVersion.js', 'modules/public/js/initJs.js'],
                dest: 'dist/common/initJs.min.js'
            },
            cssInit :  {
                src : ['dist/common/mapVersion.js', 'modules/public/js/initCss.js'],
                dest: 'dist/common/initCss.min.js'
            }
        },
        //JS文件压缩
        uglify : {
            options : {
                banner : '/* build at <%= grunt.template.today("yyyy-mm-dd hh:MM:ss") %> */\n'
            },
            msPick : {
                files: [{
                    expand: true,
                    cwd: 'dist/',
                    src: ['**/*.js', '!**/*-debug.js', '!**/*.html', '!**/*.css', '!common/mapVersion.js'],
                    dest: 'dist/'
                }]
            }
        },
        //样式表压缩
        cssmin: {
          msPick: {
            expand: true,
            cwd: 'modules/msPick/css/',
            src: ['*.css'],
            dest: 'dist/msPick/css/',
            ext: '.min.css'
          },
          public: {
            options:{
                banner: '/*common styles minify file, build at <%= grunt.template.today("yyyy-mm-dd hh:MM:ss") %>*/'
            },
            expand: true,
            cwd: 'dist/styles/',
            src: ['*.css'],
            dest: 'dist/styles/',
            ext: '.min.css'
          }
        },
        //文件打包
        compress: {
          createWar: {
            options: {
              mode : 'zip',
              archive: 'compress/tianji-frontend-' + pkg.version + '.war'
            },
            files: [
              {expand: true, cwd: 'dist/', src: ['**/*']},
              {expand: true, cwd: '.', src: ['gallery/**/*']}
            ]
          }
        },
        //文件部署
        scp: {
            release: {
                options: {
                    host: 'repository.tianji.com',
                    username: 'root',
                    privateKey: grunt.file.read(global.process.env.HOME + '/.ssh/id_rsa'),
                    passphrase: ''
                },
                files: [{
                    cwd: 'compress',
                    src: '*.war',
                    filter: 'isFile',
                    // path on the server
                    dest: '/home/jsrepository/js/tianji-frontend/' + pkg.version
                }]
            },            
            deploy: {
                options: {
                    host: 'www11.qa.tianji.com',
                    username: 'root',
                    privateKey: grunt.file.read(global.process.env.HOME + '/.ssh/id_rsa'),
                    passphrase: ''
                },
                files: [{
                    cwd: 'compress',
                    src: '*.war',
                    filter: 'isFile',
                    // path on the server
                    dest: '/var/front/deploy'
                }]
            }
        },
        //发布
        release: {
            options: {
              bump: false, //default: true
              file: 'package.json', //default: package.json
              add: true, //default: true
              commit: true, //default: true
              tag: true, //default: true
              push: true, //default: true
              pushTags: true, //default: true
              npm: false, //default: true
              tagName: 'tianji-frontend-<%= version%>', //default: '<%= version %>'
              commitMessage: 'release <%= version%>', //default: 'release <%= version %>'
              tagMessage: 'Version <%= version%>' //default: 'Version <%= version %>'
            }
        },
        //删除生成的目录
        clean : {
            build: ['dist','compress'],
            tempDir: {
                src: ['.build', 'dist/common/mapVersion.js']
            }
        }
    });
    //加载任务
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-scp');
    grunt.loadNpmTasks('grunt-release');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    //执行任务
    grunt.registerTask('clear', ['clean']);
    grunt.registerTask('build',['clean:build', 'copy', 'concat', 'uglify', 'cssmin', 'compress', 'clean:tempDir']);
    grunt.registerTask('deploy',['clean:build', 'copy', 'concat', 'uglify', 'cssmin', 'compress', 'scp:deploy', 'clean:tempDir']);
    grunt.registerTask('rel',['clean', 'copy', 'concat', 'uglify', 'cssmin', 'compress', 'release', 'scp:release', 'clean:tempDir']);
}