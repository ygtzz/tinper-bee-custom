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


const tinperService = {
    async downloadTinper(){

    },
    async writeTinperIndex(base,aComs){
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

        console.log(shell.pwd());
        await fs.writeFileSync(base + '/index.js',tpl);
    },
    async buildTinper(base){
        shell.cd(base);
        // shell.ls('*.js').forEach(function(file){
        //     console.log(file);
        // });
        if (shell.exec('npm run build').code !== 0) {
            shell.echo('Error: tinperbee build error');
        }
        console.log('build success');
        shell.cd('../../../');
    },
    async buildZip(base){
        const zipName = 'tinper.zip';
        const zipStream = fs.createWriteStream(zipName);
        const zip = archiver('zip');
        zip.pipe(zipStream);
        const zipBase = path.join(__dirname,'../../') + base;
        // 打包文件方式
        const list = [
            {path: zipBase + '/build/tinper-bee.js',name: 'tinper-bee.js'},
            {path: zipBase + '/build/tinper-bee.min.js',name:'tinper-bee-min.js'},
            {path: zipBase + '/assets/tinper-bee.css',name:'tinper-bee.css'}
        ];
        for (let i = 0; i < list.length; i++) {
            zip.append(fs.createReadStream(list[i].path), { name: list[i].name })
        }
        // 打包文件夹方式，有文件冗余index.css
        // zip.directory('build/');
        // zip.directory('assets/');
        await zip.finalize();

        return zipName;
    }
}

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
        await ctx.render('download');
    },
    async build(ctx){
        const coms = ctx.query.coms || '';
        const aComs = coms.split(',');
        let base = 'downloads/1.5.2/tinper-bee-release';
       
        await tinperService.writeTinperIndex(base,aComs);
        await tinperService.buildTinper(base);
        const zipName = await tinperService.buildZip(base);
        
        ctx.attachment(zipName);
        await send(ctx, zipName);
    }
}

