const fs = require('fs');
const os = require('os');
const path = require('path');
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

        await git.clone({
            dir: './downloads',
            url: 'https://github.com/iuap-design/tinper-bee.git',
            singleBranch: true,
            depath: 1 
        })

        await ctx.render('tinper-bee-custom',{coms:coms});
    }
}

