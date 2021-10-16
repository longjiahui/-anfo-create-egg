#!/usr/bin/env node
const fs = require('fs-extra')
const fsr = require('fs')
const path = require('path')
const ProgressBar = require('progress')
const { program } = require('commander')
const colors = require('colors/safe')

// 获取文件总数
// function getFilesAmount(p, filter){
//     let _get = p=>{
//         let isDirectory = p=>!!fsr.lstatSync(p)?.isDirectory()
//         let isFile = p=>{let stat = fsr.lstatSync(p);return stat && !stat.isDirectory()}

//         let amount = 0
//         if(isDirectory(p)){
//             let dir = fs.readdirSync(p)
//             dir.forEach(item=>{
//                 let newp = path.resolve(p, item)
//                 if(!filter || filter?.(newp)){
//                     amount += 1
//                 }
//                 if(isDirectory(newp)){
//                     amount += _get(newp)
//                 }
//             })
//         }else{
//             console.error('请传入path')
//             amount = 1
//         }
//         return amount
//     }
//     return _get(p) + 1
// }

const source = path.resolve(__dirname, '../template')

program.version('1.0.0')
    .arguments('<dest>')
    .description('dest: 创建的项目路径，文件夹名为项目名')
    .action(dest=>{
        let to = path.resolve('.', dest)
        
        console.log(`copyfile from ${source} to ${to}`)
        // let totalFiles = getFilesAmount(source, src=>!/node_modules/.test(src))
        // let bar = new ProgressBar(`${colors.blue('files:')} :current/:total :bar`, { total: totalFiles })
        fs.copySync(source, to, {filter: src=>{
            // bar.tick()
            return !(new RegExp(path.join('template', 'server', 'node_modules')).test(src) || new RegExp(path.join('template', 'ui', 'node_modules')).test(src))
        }})
        let proName = path.basename(dest)

        // modified pro name
        let changePackageFileName = p=>{
            let packageJSON = String(fs.readFileSync(p))
            packageJSON = packageJSON.replace(/\[template\]/g, proName)
            fs.writeFileSync(p, packageJSON)
        }
        
        changePackageFileName(path.resolve(to, 'ui/package.json'))
        changePackageFileName(path.resolve(to, 'server/package.json'))
        
        
        console.log(colors.green('rewrite pro name successfully!'))
        console.log(colors.green('files generated successfully!'))
        console.log(colors.blue(`run cd ${proName} && npm install`))
    })

program.parse(process.argv)