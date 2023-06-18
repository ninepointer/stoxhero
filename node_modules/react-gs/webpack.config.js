var getConfig = require('hjs-webpack')

module.exports = getConfig({
    in: 'src/',
    out: 'examples/',
    clearBeforeBuild: true,
    html: function (context) {
        context.relative = true;
        return {
            'index.html': context.defaultTemplate()
        }
    }
})
