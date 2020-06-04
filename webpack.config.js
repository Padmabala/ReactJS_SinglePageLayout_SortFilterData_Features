const path=require('path');
module.exports={
    mode:"development",
    entry:path.resolve(__dirname,`src`),
    output:{
        path:path.resolve(__dirname,`dist`),
        filename:'bundle.js',
        publicPath:'/'
    },
    resolve:{
        extensions:['.js','.jsx']
    },
    devServer:{
        historyApiFallback:true,
        publicPath:'/dist/',
        contentBase:path.resolve(__dirname,'./'),
        watchContentBase:true
    },
    module:{
        rules:[
            {
                test:/\.js$/,
                exclude:/node_modules/,
                use:{
                    loader:'babel-loader'
                },
            },
            {
                test: /\.css$/,
                use: [
                  'style-loader',
                  {
                    loader: 'css-loader',
                    options: {
                      importLoaders: 1,
                      modules: true
                    }
                  }
                ]
            }
        ],
    },
}