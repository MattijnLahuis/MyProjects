module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.registerTask('default', ['ngtemplates']);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        ngtemplates: {
            app: {
                src: ['**/*.html', '!node_modules/**', '!sudoku.html'],
                dest: 'javascript/templates.js',
                options: {
                    module: 'templates',
                    standalone: true
                },
            }
        }
    })
};
