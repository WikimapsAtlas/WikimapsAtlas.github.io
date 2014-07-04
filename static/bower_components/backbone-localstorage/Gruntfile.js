module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("dd-mm-yyyy, HH:MM:ss") %> */\n'
            },
            main: {
                files: {
                    'backbone-localstorage.min.js': ['backbone-localstorage.js']
                }
            }
        },
        qunit: {
            main: ['test/index.html']
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-qunit');

    grunt.registerTask('default', ['qunit:main', 'uglify:main']);
    grunt.registerTask('test', ['qunit:main']);
};
