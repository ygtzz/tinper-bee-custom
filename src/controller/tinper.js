const fs = require('fs');
const os = require('os');
const path = require('path');
const shell = require('shelljs');
const send = require('koa-send');
const archiver = require('archiver');
require('ignore');
require('wcwidth');
const git = require('isomorphic-git');
git.plugins.set('fs',fs);


module.exports = {
    async custom(ctx){
        const coms = [
            'Button','Badge','Alert','Label','FormControl','FormGroup','Form','InputGroup','InputNumber',
            'Checkbox','Pagination','ProgressBar','Radio','Switch','Tooltip','Dropdown','Panel','PanelGroup',
            'Transition','Navbar','Animate','Select','Tile','Icon','Menu','Upload','Breadcrumb','Message',
            'Notification','Popconfirm','Tabs','Cascader','Loading','Table','Tree','Clipboard','Rate','Step',
            'Timeline','Transfer','BackTop','Collapse','Slider','Autocomplete','LoadingState','Locale','Popover'
        ];

        await ctx.render('custom',{coms:coms});
    },
    async download(ctx){
        const coms = ctx.query.coms || '';
        const aComs = coms.split(',');
        //生成index.js
        //生成require字符串
        var requires = [],
            TinperBee = ["version: '1.5.0'"];
        //生成TinperBee对象
        aComs.forEach(function(item){
            requires.push('var ' + item + ' = require("./lib/' + item + '");');
            TinperBee.push(item + ':' + item);
        });
        requires = requires.join('');
        TinperBee = TinperBee.join(',');

        let tpl = `${requires}

        var TinperBee = {
            ${TinperBee}
        }
        
        module.exports = TinperBee;`

        let base = 'downloads/1.5.2/tinper-bee-release';

        await fs.writeFileSync(base + '/index.js',tpl);

        shell.cd('downloads/1.5.2/tinper-bee-release');
        // shell.ls('*.js').forEach(function(file){
        //     console.log(file);
        // });
        if (shell.exec('npm run build').code !== 0) {
            shell.echo('Error: tinperbee build error');
        }
        console.log('build success');

        // const filePath = '/build/tinper-bee.min.js';
        // ctx.attachment(filePath);
        // await send(ctx,filePath);

        const zipName = 'tinper.zip';
        const zipStream = fs.createWriteStream(zipName);
        const zip = archiver('zip');
        zip.pipe(zipStream);
        base = path.join(__dirname,'../../') + base;
        // 打包文件方式
        const list = [
            {path: base + '/build/tinper-bee.js',name: 'tinper-bee.js'},
            {path: base + '/build/tinper-bee.min.js',name:'tinper-bee-min.js'},
            {path: base + '/assets/tinper-bee.css',name:'tinper-bee.css'}
        ];
        for (let i = 0; i < list.length; i++) {
            zip.append(fs.createReadStream(list[i].path), { name: list[i].name })
        }
        // 打包文件夹方式，有文件冗余index.css
        // zip.directory('build/');
        // zip.directory('assets/');
        await zip.finalize();
        ctx.attachment(zipName);
        await send(ctx, zipName);

        // await ctx.render('download');
    }
}

