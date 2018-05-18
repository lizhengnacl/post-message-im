/**
 * * Created by lee on 2018/2/2
 *
 * umd name
 * http://www.rollupjs.com/big-list-of-options/
 */
import babel from 'rollup-plugin-babel';

const name = process.env.entry;
// const GLOBAL = name === 'client'? 'POST_MESSAGE_CLIENT': 'POST_MESSAGE_SERVER';
const GLOBAL = 'POST_MESSAGE';

export default {
    input: `src/${name}.js`,
    output: {
        format: 'umd',
        name: GLOBAL, // umd 以amd，cjs 和 iife 为一体，暴露的全局变量，例如jQuery、_、moment
        file: `dist/${name}.js`,
        globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            moment: 'moment'
        }
    },
    plugins: [
        babel({
            exclude: 'node_modules/**'
        })
    ],
    external: ['moment', 'react-dom', 'react']
};